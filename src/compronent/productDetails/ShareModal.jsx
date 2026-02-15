"use client"
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Facebook,
    MessageCircle,
    Check,
    X
} from "lucide-react";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaFacebook } from 'react-icons/fa';

const ShareModal = ({ isOpen, onClose, product }) => {
    const [isCopied, setIsCopied] = useState(false);

    // const productUrl = typeof window !== 'undefined' ? window.location.href : '';
    const productUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/productdetails/${product.id}`
    const shareTitle = product?.name || 'Check out this awesome product!';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(productUrl);
            setIsCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const shareOnFacebook = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    };

    const shareOnTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareTitle)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    };

    const shareOnWhatsApp = () => {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + productUrl)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-bg text-accent w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <h2 className="text-lg font-semibold">Share in a post</h2>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-2">

                            {/* URL Input */}
                            <div className="relative">
                                <div className="flex items-center gap-2 p-3 bg-black/40 border border-white/10 rounded-xl">
                                    <input
                                        type="text"
                                        readOnly
                                        value={productUrl}
                                        className="bg-transparent flex-1 text-sm outline-none text-gray-300 overflow-hidden text-ellipsis"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="bg-[#3EA6FF] hover:bg-[#65B8FF] text-black px-4 py-1.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2 whitespace-nowrap"
                                    >
                                        {isCopied ? <Check className="w-4 h-4" /> : null}
                                        {isCopied ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                            {/* Social Icons */}
                            <div className="mt-6">
                                <h3 className="text-md font-medium px-1 text-accent">Share</h3>
                                <div className="flex justify-between items-center  overflow-x-auto pb-4 custom-scrollbar w-2/3 mx-auto">

                                    <ShareIcon
                                        icon={<MessageCircle className="w-6 h-6 fill-green-500 text-green-500" />}
                                        label="WhatsApp"
                                        onClick={shareOnWhatsApp}
                                    />
                                    <ShareIcon
                                        icon={<FaFacebook className="w-6 h-6 fill-[#1877F2] text-[#1877F2]" />}
                                        label="Facebook"
                                        onClick={shareOnFacebook}
                                    />
                                    <ShareIcon
                                        icon={<FaSquareXTwitter className="w-6 h-6 fill-accent text-accent" />}
                                        label="X"
                                        onClick={shareOnTwitter}
                                    />

                                </div>
                            </div>


                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const ShareIcon = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-2 group min-w-fit"
    >
        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
            {icon}
        </div>
        <span className="text-xs text-accent group-hover:text-accent transition-colors">{label}</span>
    </button>
);

export default ShareModal;
