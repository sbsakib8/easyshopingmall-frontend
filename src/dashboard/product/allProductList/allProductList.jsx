"use client";

import { UrlFrontend } from "@/src/confic/urlExport";
import { ProductDelete, ProductUpdate } from "@/src/hook/useProduct";
import {
  setAdminProductCategory,
  setAdminProductSearchTerm,
} from "@/src/redux/searchSlice";
import { useDashboardPermission } from "@/src/utlis/useDashboardPermission";
import useGetRevenue from "@/src/utlis/useGetRevenue";
import { useGetProduct } from "@/src/utlis/userProduct";
import {
  Activity,
  ArrowUp,
  DollarSign,
  Download,
  Grid as GridIcon,
  Package,
  Plus,
  RefreshCw,
  Search,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";

import CustomLoader from "@/src/compronent/loading/CustomLoader";
import { useMobile } from "@/src/hook/useMobile";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as EyeIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ProductDeleteModal from "../modals/ProductDeleteModal";
import ProductDetailsModal from "../modals/ProductDetailsModal";
import ProductEditModal from "../modals/ProductEditModal";

export const getStatusColor = (stock) => {
  if (stock <= 10) return "from-red-500! to-pink-500!";
  if (stock <= 25) return "from-yellow-500! to-orange-500!";

  return "from-green-500! to-emerald-500!";
};

export const getStatusText = (stock) => {
  if (stock <= 5) return "Low Stock";
  if (stock <= 15) return "Medium";

  return "In Stock";
};

const ProductDashboard = () => {
  const { canModify } = useDashboardPermission();
  const dispatch = useDispatch();
  const searchTerm = useSelector(
    (state) => state.search.adminProductSearchTerm,
  );
  const selectedCategory = useSelector(
    (state) => state.search.adminProductCategory,
  );

  const setSearchTerm = (term) => dispatch(setAdminProductSearchTerm(term));
  const setSelectedCategory = (category) =>
    dispatch(setAdminProductCategory(category));
  const [spin, setSpin] = useState(false);
  const Router = useRouter();
  const [page, setPage] = useState(1);
  const isMobile = useMobile();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // data
  const currentTime = new Date();

  const handleMenuOpen = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleAction = (action) => {
    if (!selectedProduct) return;
    if (action === "view") handleView(selectedProduct);
    if (action === "edit") handleEdit(selectedProduct);
    if (action === "delete") handleDelete(selectedProduct._id);

    handleMenuClose();
  };

  const formData = useMemo(
    () => ({
      page,
      limit: 5000,
      search: "",
    }),
    [page],
  );

  // product get
  const {
    product,
    totalCount,
    refetch,
    loading: productLoading,
  } = useGetProduct(formData);
  // console.log("totalCount--->",totalCount)
  const allCategorydata = useSelector(
    (state) => state.category.allCategorydata,
  );
  const allsubCategorydata = useSelector(
    (state) => state.subcategory.allsubCategorydata,
  );

  // demo Sample product data after remove
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (product) {
      setProducts(product);
    }
  }, [product, allCategorydata, allsubCategorydata]);
  // console.log("allCategorydata---->",allCategorydata)
  // Calculate statistics
  const totalProducts = product?.length || 0;
  const totalCategories = allCategorydata?.data.length || 0;
  const totalSubCategories = allsubCategorydata?.data.length || 0;
  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products?.filter((product) => {
      const matchesSearch =
        product?.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.productStock?.toString().includes(searchTerm);

      const matchesCategory =
        selectedCategory === "All" ||
        product?.category?.some((cat) => cat.name === selectedCategory) ||
        product?.subCategory?.some((sub) => sub.name === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // handle
  const addProdcut = () => {
    Router.push(`${UrlFrontend}/dashboard/products/addproduct`);
  };

  // handleExport
  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(products);
    ws["!cols"] = [{ wch: 10 }, { wch: 10 }, { wch: 40 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, ws, "MyProducts");
    XLSX.writeFile(wb, "productsData.xlsx");
    // const dataStr = JSON.stringify(products, null, 2);
    // const dataBlob = new Blob([dataStr], {type:"application/json"});
    // const url = URL.createObjectURL(dataBlob);
    // const link = document.createElement("a");
    // link.href = url;
    // link.download ="products-export.json";
    // link.click();
  };

  // refetch
  const reFreshData = async () => {
    setSpin(true);
    setPage(page + 1);
    await refetch();
    setSpin(false);
  };

  // action function click handle
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const handleView = (product) => {
    setViewModal(product);
  };

  const handleEdit = (product) => {
    setEditModal({ ...product });
  };

  const handleDelete = (id) => {
    setDeleteModal(id);
  };

  const confirmDelete = async () => {
    try {
      if (!deleteModal) return;
      await ProductDelete(deleteModal);
      setProducts((prev) => prev.filter((p) => p._id !== deleteModal));
      setDeleteModal(null);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const [load, setLoad] = useState(false);

  const saveEdit = async () => {
    setLoad(true);
    try {
      const res = await ProductUpdate(editModal);
      if (res.success) {
        toast.success("Product updated successfully!");
        setProducts(
          products.map((p) => (p._id === editModal._id ? editModal : p)),
        );
        setEditModal(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error updating product");
    } finally {
      setLoad(false);
    }
  };

  const updateEditField = (field, value) => {
    setEditModal({ ...editModal, [field]: value });
  };

  // toal sale calculation
  // const {allOrders, loading: ordersLoading} = useGetAllOrders()
  // const completedOrders = allOrders?.filter(order => order.order_status==="completed")
  // const toalIncome = completedOrders?.reduce((sum,o)=>sum+o.totalAmt,0)
  const { totalRevenue, loading: revenueLoading } = useGetRevenue();
  // console.log("allOrders--->",allOrders)
  // console.log("completedOrders--->",completedOrders)
  // console.log("toalIncome--->",toalIncome)
  // console.log("totalRevenue--->",totalRevenue)

  // if(loading)return <p>Loading...</p>

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/3 to-blue-600/3 rounded-full blur-3xl"></div>
      </div>
      {/* Main Content */}
      <div className={`py-5 px-2 lg:px-9`}>
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="relative bg-gradient-to-r from-gray-900/80 via-blue-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl shadow-blue-500/10 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-cyan-400 rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                  All Product
                  <span className="ml-2 bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent">
                    Admin
                  </span>
                </h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  EasyShoppingMall Admin Dashboard
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-300">
                    {currentTime.toLocaleDateString("en-BD")}
                  </p>
                  <p className="text-blue-300 text-sm">
                    {currentTime.toLocaleTimeString("en-BD")}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-secondary-content" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            {
              title: "Total Products",
              value: totalCount,
              change: "+12.5%",
              icon: Package,
              gradient: "from-emerald-500 via-teal-500 to-cyan-500",
              bgGradient: "from-emerald-500/10 to-cyan-500/10",
            },
            {
              title: "Total Categories",
              value: totalCategories,
              change: "+8.2%",
              icon: Tag,
              gradient: "from-purple-500 via-violet-500 to-indigo-500",
              bgGradient: "from-purple-500/10 to-indigo-500/10",
            },
            {
              title: "Sub Categories",
              value: totalSubCategories,
              change: "+3.1%",
              icon: GridIcon,
              gradient: "from-blue-500 via-sky-500 to-cyan-500",
              bgGradient: "from-blue-500/10 to-cyan-500/10",
            },
            {
              title: "Total Sales",
              value: totalRevenue,
              change: "+15.3%",
              icon: DollarSign,
              gradient: "from-amber-500 via-orange-500 to-red-500",
              bgGradient: "from-amber-500/10 to-red-500/10",
            },
          ].map((card) => (
            <div
              key={card?.title}
              className={`group relative bg-gradient-to-br ${card?.bgGradient} backdrop-blur-xl p-4 rounded-3xl border border-gray-700/30 shadow-xl overflow-hidden`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${card?.gradient} opacity-0 group-hover:opacity-10 rounded-3xl`}
              ></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-r ${card?.gradient} shadow-lg`}
                  >
                    <card.icon className="w-6 h-6 text-neutral" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm font-bold">{card?.change}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">
                    {card?.title}
                  </p>
                  <p className="text-3xl font-bold text-primary mb-1">
                    {card?.value}
                  </p>
                  <p className="text-xs text-gray-500">vs last month</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Actions */}
        <div className="bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-700/30 shadow-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                  <Package className="w-5 h-5 text-neutral" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary">
                    Best Selling Products
                  </h2>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-medium">Live Data</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Category Filter
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-700/50"
                  >
                    <option
                      value="All"
                      className="bg-gray-800/50 hover:bg-gray-700/50 text-slate-200"
                    >
                      All Categories
                    </option>
                    {allCategorydata?.data.map((cat) => (
                      <option
                        key={cat._id}
                        value={cat.name}
                        className="bg-gray-800/50 hover:bg-gray-700/50 text-slate-200"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-2 relative">
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">
                    Search Products
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search by name, ID , SKU , Stock , brand, ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-slate-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-gray-700/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {canModify("products") && (
                  <button
                    onClick={addProdcut}
                    className="flex items-center cursor-pointer space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-slate-300 rounded-xl shadow-lg hover:shadow-green-500/25 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                )}
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-slate-300 rounded-xl"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button
                  onClick={() => reFreshData()}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-slate-300 rounded-xl cursor-pointer"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${spin ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {
          // Loader
          productLoading && (
            <div className="grid place-items-center w-full h-[250px]">
              <CustomLoader />
            </div>
          )
        }

        {/* Products Table */}
        {!productLoading && filteredProducts.length === 0 ? (
          <div className="flex justify-center items-center h-[250px]">
            <h1 className="text-3xl font-bold text-gray-600">
              No Product Found!
            </h1>
          </div>
        ) : (
          !productLoading && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 6,
                overflow: "hidden",
                background: "linear-gradient(145deg, #1f2937 0%, #111827 100%)",
                border: "1px solid rgba(55, 65, 81, 0.5)",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  background:
                    "linear-gradient(to right, #3b82f6, #8b5cf6, #6366f1)",
                  px: 3,
                  py: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" color="white" fontWeight={600}>
                  Products
                </Typography>
                <Typography variant="body2" color="#e0f2fe">
                  {filteredProducts.length} items
                </Typography>
              </Box>

              {/* Desktop Table */}
              {!isMobile && (
                <TableContainer sx={{ maxHeight: 700 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="center" width={160}>
                          Category
                        </TableCell>
                        <TableCell align="center" width={150}>
                          Brand
                        </TableCell>
                        <TableCell align="center" width={140}>
                          Price
                        </TableCell>
                        <TableCell align="center" width={150}>
                          Stock
                        </TableCell>
                        <TableCell align="center" width={200}>
                          Rating
                        </TableCell>
                        <TableCell align="right" width={100}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts
                        ?.slice(0, 20)
                        ?.sort((a, b) => a?.productStock - b?.productStock)
                        ?.map((product) => (
                          <TableRow
                            key={product._id}
                            hover
                            sx={{
                              "&:hover": {
                                background: "rgba(55, 65, 81, 0.6)",
                              },
                            }}
                          >
                            <TableCell className="min-w-[370px]">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Box
                                  component="img"
                                  src={product.images[0]}
                                  sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 3,
                                    objectFit: "cover",
                                    border: "2px solid #4b5563",
                                  }}
                                />
                                <Box>
                                  <Typography variant="subtitle2" color="white">
                                    {product.productName}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    className="text-white/70!"
                                  >
                                    {product.sku}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.8,
                                }}
                              >
                                <Chip
                                  label={product.category[0]?.name}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                <Chip
                                  label={product.subCategory[0]?.name}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  sx={{
                                    textTransform: "capitalize",
                                  }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={product.brand}
                                size="small"
                                className="text-white/80! uppercase bg-primary/20!"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="caption" color="#60a5fa">
                                {product.discount}% OFF
                              </Typography>
                              <Typography
                                variant="h6"
                                color="#34d399"
                                fontWeight={700}
                              >
                                ${product.price}
                              </Typography>
                              {product.dropshippingPrice != null && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "block",
                                    color: "#22d3ee",
                                    fontWeight: 700,
                                    mt: 0.5,
                                  }}
                                >
                                  DS: ৳{product.dropshippingPrice}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={`${getStatusText(product.productStock)}`}
                                size="small"
                                sx={{ fontWeight: 600 }}
                                className={`bg-gradient-to-r! ${getStatusColor(product.productStock)}`}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "14px",
                                }}
                              >
                                <Rating
                                  value={product.ratings}
                                  precision={0.5}
                                  size="small"
                                  readOnly
                                />
                                <Typography
                                  variant="caption"
                                  className="text-white/80!"
                                >
                                  {product.ratings}.0
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={(e) => handleMenuOpen(e, product)}
                                size="small"
                                className="text-white/80!"
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Mobile Card Layout */}
              {isMobile && (
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {filteredProducts
                    ?.slice(0, 20)
                    ?.sort((a, b) => a?.productStock - b?.productStock)
                    ?.map((product) => (
                      <Card
                        key={product._id}
                        sx={{
                          backgroundColor: "#1f2937",
                          border: "1px solid rgba(55, 65, 81, 0.6)",
                          borderRadius: 3,
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            {/* Image */}
                            <Box
                              component="img"
                              src={product.images[0]}
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 3,
                                objectFit: "cover",
                                border: "2px solid #374151",
                              }}
                            />

                            {/* Main Info */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="subtitle1"
                                color="white"
                                fontWeight={600}
                                noWrap
                              >
                                {product.productName}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ display: "block", mb: 1 }}
                                className="text-white/80!"
                              >
                                {product.sku} • {product.brand}
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  flexWrap: "wrap",
                                  mb: 2,
                                }}
                              >
                                <Chip
                                  label={product.category[0]?.name}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                <Chip
                                  label={product.subCategory[0]?.name}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  sx={{
                                    textTransform: "capitalize",
                                  }}
                                />
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Box>
                                  <Typography variant="caption" color="#60a5fa">
                                    {product.discount}% OFF
                                  </Typography>
                                  <Typography
                                    variant="h5"
                                    color="#34d399"
                                    fontWeight={700}
                                  >
                                    ${product.price}
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    textAlign: "right",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: "8px",
                                  }}
                                >
                                  <Chip
                                    label={`${product.productStock} left`}
                                    size="small"
                                    sx={{ fontWeight: 600, mb: 0.5 }}
                                    className={`bg-gradient-to-r! ${getStatusColor(product.productStock)} `}
                                  />
                                  <Rating
                                    value={product.ratings}
                                    precision={0.5}
                                    size="small"
                                    readOnly
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          <Divider
                            sx={{ my: 2, borderColor: "rgba(55,65,81,0.6)" }}
                          />

                          {/* Actions */}
                          <Box
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, product)}
                              size="small"
                              sx={{ color: "#9ca3af" }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                </Box>
              )}

              {/* Action Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={() => handleAction("view")}>
                  <EyeIcon sx={{ mr: 1.5 }} /> View Details
                </MenuItem>
                {canModify("products") && (
                  <MenuItem onClick={() => handleAction("edit")}>
                    <EditIcon sx={{ mr: 1.5 }} /> Edit Product
                  </MenuItem>
                )}
                {canModify("products") && (
                  <MenuItem
                    onClick={() => handleAction("delete")}
                    sx={{ color: "#f87171" }}
                  >
                    <DeleteIcon sx={{ mr: 1.5 }} /> Delete
                  </MenuItem>
                )}
              </Menu>
            </Paper>
          )
        )}
      </div>

      {/* Details Modal */}
      <ProductDetailsModal
        open={viewModal !== null}
        onClose={() => setViewModal(null)}
        product={viewModal}
      />

      {/* Edit Modal */}
      <ProductEditModal
        open={editModal !== null && canModify("products")}
        onClose={() => setEditModal(null)}
        product={editModal}
        updateEditField={updateEditField}
        load={load}
        saveEdit={saveEdit}
      />

      {/* Delete Confirmation Modal */}
      <ProductDeleteModal
        open={deleteModal !== null && canModify("products")}
        onClose={() => setDeleteModal(null)}
        confirmDelete={confirmDelete}
      />

      <style jsx>{`
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 4px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }

        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
        }

        @media (hover: none) and (pointer: coarse) {
          .group:active {
            transform: scale(0.98);
          }

          .transform:active {
            transform: scale(0.95);
          }
        }
      `}</style>
    </section>
  );
};

export default ProductDashboard;
