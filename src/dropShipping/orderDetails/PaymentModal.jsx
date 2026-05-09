'use client';
import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ShieldCheck, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { UrlBackend } from '@/src/confic/urlExport';
import { useSelector } from 'react-redux';

const PaymentModal = ({ order, paymentType, onClose, onSuccess }) => {
  const user = useSelector((state) => state.user.data);
  const [paymentMethod, setPaymentMethod] = useState('balance');
  const [selectedManualMethod, setSelectedManualMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualDetails, setManualDetails] = useState({
    transactionId: '',
    senderNumber: '',
  });

  const manualMethods = [
    { id: "bkash", name: "Bkash", number: "01626420774", logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/bkash.png" },
    { id: "nagad", name: "Nagad", number: "01626420774", logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/nagad.png" },
    { id: "rocket", name: "Rocket", number: "01626420774", logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/rocket.png" },
    { id: "upay", name: "Upay", number: "01626420774", logo: "https://raw.githubusercontent.com/shuvro-setu/bkash-nagad-rocket-logos/main/upay.png" },
  ];

  const amountToPay = paymentType === 'delivery' ? order.deliveryCharge : order.totalAmt;

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (paymentMethod === 'balance') {
      if ((user?.balance || 0) < amountToPay) {
        toast.error("Insufficient balance!");
        return;
      }
    } else if (paymentMethod === 'manual') {
      if (!selectedManualMethod) {
        toast.error("Please select a payment method!");
        return;
      }
      if (!manualDetails.transactionId) {
        toast.error("Transaction ID is required!");
        return;
      }
    }

    setIsProcessing(true);
    try {
      const payload = {
        paymentMethod,
        paymentType,
        manualDetails: paymentMethod === 'manual' ? {
          provider: selectedManualMethod,
          transactionId: manualDetails.transactionId,
          senderNumber: manualDetails.senderNumber || "N/A"
        } : undefined
      };

      const response = await axios.post(`${UrlBackend}/orders/${order._id}/pay-due`, payload, { withCredentials: true });

      if (response.data.success) {
        toast.success(response.data.message || "Payment successful!");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment failed!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">অর্ডার পেমেন্ট করুন</h2>
              <p className="text-emerald-50 text-xs font-bold uppercase tracking-widest opacity-80">
                Paying for {paymentType === 'delivery' ? 'Delivery Charge' : 'Full Payment'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Amount Display */}
          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Payable</p>
              <h3 className="text-3xl font-black text-emerald-900 tracking-tighter">৳{amountToPay.toLocaleString()}</h3>
            </div>
            <div className="bg-white/50 px-4 py-2 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Order ID</p>
              <p className="text-sm font-black text-slate-700">#{order.orderId?.slice(-8) || order._id?.slice(-8)}</p>
            </div>
          </div>

          {/* Payment Method Toggle */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('balance')}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'balance' 
                  ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                  : 'border-slate-100 hover:border-emerald-200 bg-slate-50/50'}`}
              >
                <div className={`p-2.5 rounded-xl ${paymentMethod === 'balance' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-slate-900">Wallet Balance</p>
                  <p className={`text-[10px] font-bold ${Number(user?.balance || 0) < amountToPay ? 'text-red-500' : 'text-emerald-600'}`}>
                    ৳{Number(user?.balance || 0).toLocaleString()}
                  </p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('manual')}
                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'manual' 
                  ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                  : 'border-slate-100 hover:border-emerald-200 bg-slate-50/50'}`}
              >
                <div className={`p-2.5 rounded-xl ${paymentMethod === 'manual' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-slate-900">Manual Payment</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Bkash/Nagad</p>
                </div>
              </button>
            </div>
          </div>

          {/* Manual Payment Section */}
          {paymentMethod === 'manual' && (
            <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-4">
              <div className="grid grid-cols-4 gap-3">
                {manualMethods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedManualMethod(m.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${selectedManualMethod === m.id 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-50 bg-slate-50/30'}`}
                  >
                    <img src={m.logo} className="w-8 h-8 object-contain mb-1" alt={m.name} />
                    <span className="text-[8px] font-black uppercase text-slate-500">{m.name}</span>
                  </button>
                ))}
              </div>

              {selectedManualMethod && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                   <div className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white">
                      <div>
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Send Money To</p>
                        <p className="text-xl font-black tracking-widest">{manualMethods.find(m => m.id === selectedManualMethod)?.number}</p>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(manualMethods.find(m => m.id === selectedManualMethod)?.number);
                          toast.success("Copied!");
                        }}
                        className="bg-emerald-500 p-2 rounded-xl hover:bg-emerald-400 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Transaction ID</label>
                        <input 
                          name="transactionId"
                          value={manualDetails.transactionId}
                          onChange={handleManualInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" 
                          placeholder="e.g. 9ABCDEF"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Number</label>
                        <input 
                          name="senderNumber"
                          value={manualDetails.senderNumber}
                          onChange={handleManualInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                          placeholder="01XXXXXXXXX"
                        />
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-emerald-500/20 hover:opacity-90 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:transform-none"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                PROCESSING...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                CONFIRM PAYMENT
                <ChevronRight className="w-5 h-5" />
              </span>
            )}
          </button>

          <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            Secure encrypted transaction
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
