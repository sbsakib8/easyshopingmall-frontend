"use client";

import { UrlFrontend } from "@/src/confic/urlExport";
import { ProductDelete, ProductUpdate } from "@/src/hook/useProduct";
import useGetRevenue from "@/src/utlis/useGetRevenue";
import { useGetProduct } from "@/src/utlis/userProduct";
import {
  Activity,
  ArrowUp,
  DollarSign,
  Download,
  Edit,
  Eye,
  Grid as GridIcon,
  Package,
  Plus,
  RefreshCw,
  Search,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
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

const ProductDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
        }`}
      />
    ));
  };

  const getStatusColor = (stock) => {
    if (stock <= 10) return "from-red-500! to-pink-500!";
    if (stock <= 25) return "from-yellow-500! to-orange-500!";
    return "from-green-500! to-emerald-500!";
  };

  const getStatusText = (stock) => {
    if (stock <= 5) return "Low Stock";
    if (stock <= 15) return "Medium";
    return "In Stock";
  };

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
                  <p className="text-lg font-bold text-accent-content">
                    {currentTime.toLocaleDateString("en-BD")}
                  </p>
                  <p className="text-blue-300 text-sm">
                    {currentTime.toLocaleTimeString("en-BD")}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-accent-content" />
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
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-accent-content placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-gray-700/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={addProdcut}
                  className="flex items-center cursor-pointer space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-accent-content rounded-xl shadow-lg hover:shadow-green-500/25 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-accent-content rounded-xl"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button
                  onClick={() => reFreshData()}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-accent-content rounded-xl cursor-pointer"
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
                <MenuItem onClick={() => handleAction("edit")}>
                  <EditIcon sx={{ mr: 1.5 }} /> Edit Product
                </MenuItem>
                <MenuItem
                  onClick={() => handleAction("delete")}
                  sx={{ color: "#f87171" }}
                >
                  <DeleteIcon sx={{ mr: 1.5 }} /> Delete
                </MenuItem>
              </Menu>
            </Paper>
          )
        )}
      </div>
      {/* View Modal */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-accent-content flex items-center gap-2">
                <Eye className="w-6 h-6" />
                Product Details
              </h2>
              <button
                onClick={() => setViewModal(null)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-6 h-6 text-accent-content" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <img
                  src={viewModal?.images[0]}
                  alt={viewModal?.productName}
                  className="w-full md:w-64 h-64 rounded-xl object-cover border-2 border-purple-500/30"
                />
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-accent-content mb-2">
                    {viewModal?.productName}
                  </h3>
                  <div className="flex gap-2 mb-4">
                    {renderStars(viewModal?.ratings)}
                    <span className="text-accent-content font-semibold">
                      ({viewModal?.ratings}.0)
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4">{viewModal?.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {viewModal?.category[0]?.name}
                    </span>
                    <span className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {viewModal?.subCategory[0]?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-400 text-sm">SKU</span>
                  </div>
                  <p className="text-accent-content font-semibold">
                    {viewModal?.sku}
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-400 text-sm">Price</span>
                  </div>
                  <p className="text-accent-content font-semibold text-2xl">
                    ৳{viewModal?.price}
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-400 text-sm">Discount</span>
                  </div>
                  <p className="text-emerald-400 font-semibold text-2xl">
                    {viewModal?.discount}%
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-orange-400" />
                    <span className="text-gray-400 text-sm">Stock</span>
                  </div>
                  <p className="text-accent-content font-semibold text-2xl">
                    {viewModal?.productStock}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {getStatusText(viewModal?.productStock)}
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                  <span className="text-gray-400 text-sm">Brand</span>
                  <p className="text-accent-content font-semibold mt-2">
                    {viewModal?.brand}
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                  <span className="text-gray-400 text-sm">Product ID</span>
                  <p className="text-emerald-400 font-mono text-sm mt-2">
                    #{viewModal?._id}
                  </p>
                </div>
              </div>

              {viewModal?.images?.length > 1 && (
                <div className="mt-6">
                  <h4 className="text-accent-content font-semibold mb-3">
                    All Images
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {viewModal?.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="w-full h-32 rounded-lg object-cover border border-slate-600/50"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      clg
      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-emerald-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-accent-content flex items-center gap-2">
                <Edit className="w-6 h-6" />
                Edit Product
              </h2>
              <button
                onClick={() => setEditModal(null)}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X className="w-6 h-6 text-accent-content" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editModal?.productName}
                    onChange={(e) =>
                      updateEditField("productName", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={editModal?.sku}
                    onChange={(e) => updateEditField("sku", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={editModal?.brand}
                    onChange={(e) => updateEditField("brand", e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={editModal?.price}
                    onChange={(e) =>
                      updateEditField("price", Number(e.target.value))
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={editModal?.discount}
                    onChange={(e) =>
                      updateEditField("discount", Number(e.target.value))
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={editModal?.productStock}
                    onChange={(e) =>
                      updateEditField("productStock", Number(e.target.value))
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={editModal?.ratings}
                    onChange={(e) =>
                      updateEditField("ratings", Number(e.target.value))
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Product Size
                  </label>
                  <input
                    type="text"
                    value={editModal?.productSize?.join(",") || ""}
                    onChange={(e) =>
                      updateEditField(
                        "productSize",
                        e.target.value.split(",").map((s) => s.trim()),
                      )
                    }
                    placeholder="M, L, XL"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Product Color
                  </label>
                  <input
                    type="text"
                    value={editModal?.color?.join(",") || ""}
                    onChange={(e) =>
                      updateEditField(
                        "color",
                        e.target.value.split(",").map((c) => c.trim()),
                      )
                    }
                    placeholder="Black, Brown, Red"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Product Rank
                  </label>
                  <input
                    type="number"
                    value={editModal?.productRank || ""}
                    onChange={(e) =>
                      updateEditField("productRank", Number(e.target.value))
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Product Status
                  </label>
                  <select
                    value={
                      editModal?.productStatus?.length > 0
                        ? editModal.productStatus[0]
                        : "none"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      updateEditField(
                        "productStatus",
                        val === "none" ? [] : [val],
                      );
                    }}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500"
                  >
                    <option value="none">None</option>
                    <option value="hot">Hot</option>
                    <option value="cold">Cold</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    value={editModal?.description}
                    onChange={(e) =>
                      updateEditField("description", e.target.value)
                    }
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-accent-content focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center p-4 bg-white/5 border border-slate-600 rounded-xl mt-1">
                    <input
                      type="checkbox"
                      checked={editModal?.isBoost || false}
                      onChange={(e) =>
                        updateEditField("isBoost", e.target.checked)
                      }
                      className="w-5 h-5 text-emerald-600 bg-transparent border-slate-500 rounded focus:ring-emerald-500"
                    />
                    <label className="ml-3 text-gray-300 font-semibold">
                      Boost Product
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveEdit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-accent-content font-semibold rounded-lg transform"
                >
                  {load ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditModal(null)}
                  className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-accent-content font-semibold rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-pink-500/30 max-w-md w-full p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-pink-500/20 rounded-full">
                <Trash2 className="w-8 h-8 text-pink-500" />
              </div>
              <h2 className="text-2xl font-bold text-accent-content">
                Delete Product
              </h2>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-accent-content font-semibold rounded-lg transform"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-accent-content font-semibold rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(2deg);
          }
          66% {
            transform: translateY(10px) rotate(-1deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s;
        }

        .animate-slideDown {
          animation: slideDown 0.8s;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s forwards;
          opacity: 0;
        }

        .animate-slideUp {
          animation: slideUp 0.6s forwards;
          opacity: 0;
        }

        . {
          animation: float 8s infinite;
        }

        .-slow {
          animation: bounce-slow 4s infinite;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

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

        @media (max-width: 640px) {
          .grid {
            gap: 1rem;
          }

          .p-6 {
            padding: 1rem;
          }

          .p-8 {
            padding: 1.5rem;
          }

          .text-3xl {
            font-size: 1.5rem;
          }

          .text-2xl {
            font-size: 1.25rem;
          }

          .animate-slideUp,
          .animate-fadeInUp,
          .animate-slideDown {
            animation-duration: 0.4s;
          }
        }

        @media (max-width: 768px) {
          .animate-slideUp,
          .animate-fadeInUp,
          .animate-slideDown {
            animation-duration: 0.5s;
          }
        }

        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }

        .hover-glow:hover {
          box-shadow:
            0 20px 40px rgba(59, 130, 246, 0.15),
            0 10px 20px rgba(139, 92, 246, 0.1);
        }

        @media (hover: none) and (pointer: coarse) {
          .group:active {
            transform: scale(0.98);
          }

          .transform:active {
            transform: scale(0.95);
          }
        }

        .dark-glow {
          box-shadow:
            0 0 20px rgba(59, 130, 246, 0.1),
            0 0 40px rgba(139, 92, 246, 0.05);
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
          }
          50% {
            box-shadow:
              0 0 30px rgba(59, 130, 246, 0.2),
              0 0 40px rgba(139, 92, 246, 0.1);
          }
        }

        .-glow {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default ProductDashboard;
