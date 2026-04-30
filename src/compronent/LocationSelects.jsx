"use client";

import bdData from "@/src/data/bd-dd-ui-bn";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export default function LocationSelects({ customerInfo, setCustomerInfo, isDropshipping = false }) {
    const [divisions, setDivisionList] = useState([]);
    const [districts, setDistrictList] = useState([]);
    const [upazilas, setUpazilaList] = useState([]);

    const [selectedDivision, setSelectedDivision] = useState(customerInfo.division || "");
    const [selectedDistrict, setSelectedDistrict] = useState(customerInfo.district || "");

    useEffect(() => {
        setDivisionList(bdData.map(d => d.division));
    }, []);

    // Sync state with customerInfo props (e.g., when auto-populated from profile)
    useEffect(() => {
        // 1. Handle Division & Districts
        if (customerInfo.division) {
            setSelectedDivision(customerInfo.division);
            const divObj = bdData.find(d => d.division === customerInfo.division);
            if (divObj) {
                setDistrictList(divObj.districts || []);
            }
        }

        // 2. Handle District & Upazilas
        if (customerInfo.district) {
            setSelectedDistrict(customerInfo.district);

            // Find district object - prioritize current division but fallback to global search
            let distObj = null;

            if (customerInfo.division) {
                const divObj = bdData.find(d => d.division === customerInfo.division);
                distObj = divObj?.districts.find(d => d.district === customerInfo.district);
            }

            // Fallback: search all divisions if not found yet
            if (!distObj) {
                for (const div of bdData) {
                    const found = div.districts.find(d => d.district === customerInfo.district);
                    if (found) {
                        distObj = found;
                        break;
                    }
                }
            }

            // Always update upazila list if district found
            if (distObj) {
                setUpazilaList(distObj.upazilas || []);
            } else {
                setUpazilaList([]);
            }
        }
    }, [customerInfo.division, customerInfo.district, customerInfo.area]);

    const handleDivisionChange = (division) => {
        setSelectedDivision(division);
        setSelectedDistrict("");
        setUpazilaList([]);
        const divObj = bdData.find(d => d.division === division);
        setDistrictList(divObj?.districts || []);
        setCustomerInfo(prev => ({ ...prev, division, district: "", area: "" }));
    };

    const handleDistrictChange = (district) => {
        setSelectedDistrict(district);
        const distObj = districts.find(d => d.district === district);
        setUpazilaList(distObj?.upazilas || []);
        setCustomerInfo(prev => ({ ...prev, district, area: "", division: selectedDivision }));
    };

    const handleUpazilaChange = (upazila) => {
        setCustomerInfo(prev => ({ ...prev, area: upazila }));
    };

    return (
        <div className={isDropshipping ? "bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-8" : "bg-bg rounded-2xl shadow-xl border border-gray-100 overflow-hidden"}>
            {isDropshipping ? (
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary-color/10 rounded-2xl">
                        <MapPin className="w-6 h-6 text-primary-color" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">অঞ্চল ও জেলা নির্বাচন (Location)</h2>
                </div>
            ) : (
                <div className="bg-btn-color p-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-accent-content" />
                        </div>
                        <h2 className="text-xl font-semibold text-accent-content">অঞ্চল ও জেলা নির্বাচন</h2>
                    </div>
                </div>
            )}

            <div className={isDropshipping ? "" : "p-6"}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Division */}
                    <div className={isDropshipping ? "space-y-2" : ""}>
                        <label className={isDropshipping ? "block text-xs font-black text-gray-400 uppercase tracking-widest" : "block text-sm font-semibold text-gray-700 mb-2"}>বিভাগ *</label>
                        <select
                            value={selectedDivision}
                            onChange={(e) => handleDivisionChange(e.target.value)}
                            className={isDropshipping ? "w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-900 focus:ring-2 focus:ring-primary-color" : "w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"}
                        >
                            <option value="">-- বিভাগ নির্বাচন করুন --</option>
                            {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                        </select>
                    </div>

                    {/* District */}
                    <div className={isDropshipping ? "space-y-2" : ""}>
                        <label className={isDropshipping ? "block text-xs font-black text-gray-400 uppercase tracking-widest" : "block text-sm font-semibold text-gray-700 mb-2"}>জেলা *</label>
                        <select
                            value={selectedDistrict}
                            onChange={(e) => handleDistrictChange(e.target.value)}
                            className={isDropshipping ? "w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-900 focus:ring-2 focus:ring-primary-color" : "w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"}
                            disabled={!districts.length}
                        >
                            <option value="">-- জেলা নির্বাচন করুন --</option>
                            {districts.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}
                        </select>
                    </div>

                    {/* Upazila */}
                    <div className={isDropshipping ? "space-y-2 md:col-span-2" : "md:col-span-2"}>
                        <label className={isDropshipping ? "block text-xs font-black text-gray-400 uppercase tracking-widest" : "block text-sm font-semibold text-gray-700 mb-2"}>উপজেলা / থানা *</label>
                        <select
                            value={customerInfo.area}
                            onChange={(e) => handleUpazilaChange(e.target.value)}
                            className={isDropshipping ? "w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-gray-900 focus:ring-2 focus:ring-primary-color" : "w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"}
                            disabled={!upazilas.length}
                        >
                            <option value="">-- উপজেলা নির্বাচন করুন --</option>
                            {upazilas.map(up => <option key={up} value={up}>{up}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
