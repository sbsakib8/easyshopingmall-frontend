"use client"
import React, { useEffect, useState } from 'react';
import { 
    Plus, Edit3, Trash2, Tag, Ticket, Calendar, Percent, 
    DollarSign, User, Package, Layers, X, Save, Search, 
    Filter, Info, CheckCircle, Clock, AlertTriangle 
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { 
    createCouponCode, 
    getAllCoupons, 
    deleteCoupon, 
    updateCouponCode 
} from '@/src/hook/useCoupon';
import { CategoryAllGet } from '@/src/hook/usecategory';
import { SubCategoryAllGet } from '@/src/hook/useSubcategory';
import { ProductAllGet } from '@/src/hook/useProduct';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const ManageCoupons = () => {
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const [coupons, setCoupons] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountAmount: 0,
        maxDiscountAmount: 0,
        minOrderAmount: 0,
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: 0,
        isActive: true,
        applicableCategory: '',
        applicableSubCategory: '',
        applicableProduct: '',
        isForNewUserOnly: false,
    });

    useEffect(() => {
        const prodId = searchParams.get('productId');
        if (prodId) {
            setFormData(prev => ({ ...prev, applicableProduct: prodId }));
            setShowForm(true);
        }
        loadData();
    }, [searchParams]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [couponRes, catRes, subRes] = await Promise.all([
                getAllCoupons(),
                CategoryAllGet(dispatch),
                SubCategoryAllGet(dispatch) // Assuming this exists or I'll check its name
            ]);
            
            if (couponRes.success) setCoupons(couponRes.data);
            if (catRes.success) setCategories(catRes.data);
            if (subRes.success) setSubCategories(subRes.data);
            
            // Load some products for selection (or we could use a search-as-you-type)
            const productRes = await ProductAllGet({ limit: 100 });
            if (productRes.success) setProducts(productRes.data || productRes.products || []);

        } catch (error) {
            console.error("Load data error:", error);
            toast.error("Failed to load some data");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }));
    };

    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discountType: 'percentage',
            discountAmount: 0,
            maxDiscountAmount: 0,
            minOrderAmount: 0,
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            usageLimit: 0,
            isActive: true,
            applicableCategory: '',
            applicableSubCategory: '',
            applicableProduct: '',
            isForNewUserOnly: false,
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Transform empty strings to null for optional ObjectIDs
            const submitData = {
                ...formData,
                applicableCategory: formData.applicableCategory || null,
                applicableSubCategory: formData.applicableSubCategory || null,
                applicableProduct: formData.applicableProduct || null,
            };

            let res;
            if (editingId) {
                res = await updateCouponCode(editingId, submitData);
            } else {
                res = await createCouponCode(submitData);
            }

            if (res.success) {
                toast.success(editingId ? "Coupon updated! ✅" : "Coupon created! ✅");
                resetForm();
                loadData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        try {
            const res = await deleteCoupon(id);
            if (res.success) {
                toast.success("Coupon deleted! 🗑️");
                loadData();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleEdit = (coupon) => {
        setFormData({
            code: coupon.code,
            description: coupon.description,
            discountType: coupon.discountType,
            discountAmount: coupon.discountAmount,
            maxDiscountAmount: coupon.maxDiscountAmount,
            minOrderAmount: coupon.minOrderAmount,
            validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
            validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
            usageLimit: coupon.usageLimit,
            isActive: coupon.isActive,
            applicableCategory: coupon.applicableCategory?._id || coupon.applicableCategory || '',
            applicableSubCategory: coupon.applicableSubCategory?._id || coupon.applicableSubCategory || '',
            applicableProduct: coupon.applicableProduct?._id || coupon.applicableProduct || '',
            isForNewUserOnly: coupon.isForNewUserOnly,
        });
        setEditingId(coupon._id);
        setShowForm(true);
    };

    const filteredCoupons = coupons.filter(c => 
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) && 
        (filterType === 'all' || c.discountType === filterType)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 lg:ml-10 lg:px-9">
            {/* Header section */}
            <div className="mb-8 animate-slideDown">
                <div className="relative bg-gradient-to-r from-gray-900/80 via-indigo-900/80 to-purple-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl flex flex-col md:flex-row items-center justify-between overflow-hidden">
                    {/* Animated Particles */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-4 left-1/4 w-3 h-3 bg-indigo-500/30 rounded-full animate-ping"></div>
                        <div className="absolute bottom-4 right-1/3 w-2 h-2 bg-purple-500/30 rounded-full animate-pulse"></div>
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                            Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Coupons</span>
                        </h1>
                        <p className="text-gray-300">Create and control discount offers for your customers</p>
                    </div>

                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2 border border-white/10"
                    >
                        {showForm ? <X size={20} /> : <Plus size={20} />}
                        <span>{showForm ? "Close Form" : "New Coupon"}</span>
                    </button>
                </div>
            </div>

            {/* Form Section */}
            {showForm && (
                <div className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-slideIn">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Ticket className="mr-3 text-indigo-400" />
                        {editingId ? "Edit Coupon" : "Create New Coupon"}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-2 font-medium">Coupon Code *</label>
                                <input 
                                    type="text" 
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    placeholder="SUMMER24"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 font-medium">Description</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                                    placeholder="Get 20% off on all items"
                                />
                            </div>
                        </div>

                        {/* Discount Config */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2 font-medium">Type</label>
                                    <select 
                                        name="discountType"
                                        value={formData.discountType}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="percentage" className="bg-gray-900">Percentage %</option>
                                        <option value="flat" className="bg-gray-900">Flat Amount ৳</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 font-medium">Amount</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            name="discountAmount"
                                            value={formData.discountAmount}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <span className="absolute right-4 top-3 text-gray-500 font-bold">
                                            {formData.discountType === 'percentage' ? '%' : '৳'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {formData.discountType === 'percentage' && (
                                <div>
                                    <label className="block text-gray-400 mb-2 font-medium">Max Discount (0 for no limit)</label>
                                    <input 
                                        type="number" 
                                        name="maxDiscountAmount"
                                        value={formData.maxDiscountAmount}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-400 mb-2 font-medium">Min Order Amount</label>
                                <input 
                                    type="number" 
                                    name="minOrderAmount"
                                    value={formData.minOrderAmount}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Constraints & Targets */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-2 font-medium">Target Category</label>
                                <select 
                                    name="applicableCategory"
                                    value={formData.applicableCategory}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="" className="bg-gray-900">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id} className="bg-gray-900">{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2 font-medium">Target SubCategory</label>
                                <select 
                                    name="applicableSubCategory"
                                    value={formData.applicableSubCategory}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="" className="bg-gray-900">All SubCategories</option>
                                    {subCategories.map(sub => (
                                        <option key={sub._id} value={sub._id} className="bg-gray-900">{sub.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2 font-medium">Target Specific Product</label>
                                <select 
                                    name="applicableProduct"
                                    value={formData.applicableProduct}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="" className="bg-gray-900">None (Apply to cart)</option>
                                    {products.map(prod => (
                                        <option key={prod._id} value={prod._id} className="bg-gray-900">{prod.productName}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dates & Limits */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 mb-2 font-medium">Valid From</label>
                                    <input 
                                        type="date" 
                                        name="validFrom"
                                        value={formData.validFrom}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2 font-medium">Valid Until</label>
                                    <input 
                                        type="date" 
                                        name="validUntil"
                                        value={formData.validUntil}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 font-medium">Usage Limit (0 for unlimited)</label>
                                <input 
                                    type="number" 
                                    name="usageLimit"
                                    value={formData.usageLimit}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Flags */}
                        <div className="flex flex-col space-y-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-indigo-600 bg-gray-700 border-none rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="isActive" className="ml-3 text-white font-medium cursor-pointer">Active</label>
                            </div>
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id="isForNewUserOnly"
                                    name="isForNewUserOnly"
                                    checked={formData.isForNewUserOnly}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-indigo-600 bg-gray-700 border-none rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="isForNewUserOnly" className="ml-3 text-white font-medium cursor-pointer flex items-center">
                                    New Users Only <User size={16} className="ml-2 text-indigo-400" />
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="lg:col-span-3 flex justify-end space-x-4 mt-4">
                            <button 
                                type="button" 
                                onClick={resetForm}
                                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-10 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2"
                            >
                                <Save size={20} />
                                <span>{editingId ? "Update Coupon" : "Create Coupon"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List Section */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden min-h-[400px]">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <Tag className="mr-3 text-indigo-400" />
                        Existing Coupons ({filteredCoupons.length})
                    </h2>

                    <div className="flex space-x-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Types</option>
                            <option value="percentage">Percentage</option>
                            <option value="flat">Flat</option>
                        </select>
                    </div>
                </div>

                {loading && coupons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-400 font-medium">Crunching coupon data...</p>
                    </div>
                ) : filteredCoupons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <Ticket size={64} className="text-gray-700 mb-4" />
                        <p className="text-gray-400 text-xl font-bold">No coupons found</p>
                        <p className="text-gray-500 mt-2">Try a different search or create one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCoupons.map((coupon) => {
                            const isExpired = new Date(coupon.validUntil) < new Date();
                            const isUpcoming = new Date(coupon.validFrom) > new Date();
                            
                            return (
                                <div 
                                    key={coupon._id}
                                    className={`group relative bg-black/40 border ${coupon.isActive ? 'border-white/10' : 'border-red-900/50'} rounded-3xl p-6 transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-2xl overflow-hidden`}
                                >
                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 flex space-x-2">
                                        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                            isExpired ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                            isUpcoming ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                            coupon.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                        }`}>
                                            {isExpired ? 'Expired' : isUpcoming ? 'Upcoming' : coupon.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>

                                    {/* Coupon Icon/Type */}
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                            coupon.discountType === 'percentage' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
                                        }`}>
                                            {coupon.discountType === 'percentage' ? <Percent size={24} /> : <DollarSign size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white tracking-widest">{coupon.code}</h3>
                                            <p className="text-xs text-gray-400 truncate max-w-[150px]">{coupon.description || 'No description'}</p>
                                        </div>
                                    </div>

                                    {/* Discount Info */}
                                    <div className="mb-6">
                                        <div className="flex items-baseline space-x-1">
                                            <span className="text-4xl font-extrabold text-white">
                                                {coupon.discountType === 'percentage' ? coupon.discountAmount : `৳${coupon.discountAmount}`}
                                            </span>
                                            {coupon.discountType === 'percentage' && <span className="text-xl text-indigo-400 font-bold">% OFF</span>}
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {coupon.minOrderAmount > 0 && (
                                                <span className="flex items-center text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-full text-gray-300">
                                                    Min: ৳{coupon.minOrderAmount}
                                                </span>
                                            )}
                                            {coupon.maxDiscountAmount > 0 && (
                                                <span className="flex items-center text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-full text-gray-300">
                                                    Max: ৳{coupon.maxDiscountAmount}
                                                </span>
                                            )}
                                            {coupon.usageLimit > 0 && (
                                                <span className="flex items-center text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-full text-gray-300">
                                                    Limit: {coupon.usedCount}/{coupon.usageLimit}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Targets Info */}
                                    <div className="mb-6 space-y-2 py-3 border-t border-b border-white/5">
                                        {coupon.applicableCategory && (
                                            <div className="flex items-center text-xs text-indigo-300">
                                                <Layers size={12} className="mr-2" />
                                                Cat: {typeof coupon.applicableCategory === 'object' ? coupon.applicableCategory.name : 'Targeted'}
                                            </div>
                                        )}
                                        {coupon.applicableSubCategory && (
                                            <div className="flex items-center text-xs text-pink-300">
                                                <Tag size={12} className="mr-2" />
                                                Sub: {typeof coupon.applicableSubCategory === 'object' ? coupon.applicableSubCategory.name : 'Targeted'}
                                            </div>
                                        )}
                                        {coupon.applicableProduct && (
                                            <div className="flex items-center text-xs text-amber-300">
                                                <Package size={12} className="mr-2" />
                                                Product Specific
                                            </div>
                                        )}
                                        {coupon.isForNewUserOnly && (
                                            <div className="flex items-center text-xs text-cyan-300">
                                                <User size={12} className="mr-2" />
                                                New Users Only
                                            </div>
                                        )}
                                        {!coupon.applicableCategory && !coupon.applicableSubCategory && !coupon.applicableProduct && (
                                            <div className="flex items-center text-xs text-gray-500">
                                                <CheckCircle size={12} className="mr-2" />
                                                Store-wide Coupon
                                            </div>
                                        )}
                                    </div>

                                    {/* Date Info */}
                                    <div className="flex justify-between items-center text-[10px] text-gray-500 mb-6">
                                        <div className="flex items-center">
                                            <Calendar size={12} className="mr-1" />
                                            {new Date(coupon.validFrom).toLocaleDateString()}
                                        </div>
                                        <div className="h-px w-8 bg-gray-800"></div>
                                        <div className="flex items-center">
                                            <Calendar size={12} className="mr-1" />
                                            {new Date(coupon.validUntil).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(coupon)}
                                            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-400 rounded-xl transition-all border border-indigo-500/30"
                                        >
                                            <Edit3 size={14} />
                                            <span className="text-xs font-bold">Edit</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(coupon._id)}
                                            className="flex-1 flex items-center justify-center space-x-2 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl transition-all border border-red-500/30"
                                        >
                                            <Trash2 size={14} />
                                            <span className="text-xs font-bold">Delete</span>
                                        </button>
                                    </div>

                                    {/* Decorative dashed border for "Ticket" look */}
                                    <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-black rounded-full border border-white/10"></div>
                                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 bg-black rounded-full border border-white/10"></div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slideDown {
                    animation: slideDown 0.5s ease-out forwards;
                }
                .animate-slideIn {
                    animation: slideIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ManageCoupons;
