"use client";

import bdData from "@/src/data/bd-dd-ui-bn";
import { useEffect, useState } from "react";

// Full Bangladesh divisions, districts, upazilas

export default function LocationSelects({ customerInfo, setCustomerInfo }) {
    const [divisions, setDivisionList] = useState([]);
    const [districts, setDistrictList] = useState([]);
    const [upazilas, setUpazilaList] = useState([]);

    const [selectedDivision, setSelectedDivision] = useState(customerInfo.city || "");
    const [selectedDistrict, setSelectedDistrict] = useState("");

    useEffect(() => {
        setDivisionList(bdData.map(d => d.division));
    }, []);

    const handleDivisionChange = (division) => {
        setSelectedDivision(division);
        setSelectedDistrict("");
        setUpazilaList([]);
        const divObj = bdData.find(d => d.division === division);
        setDistrictList(divObj?.districts || []);
        setCustomerInfo(prev => ({ ...prev, city: division, area: "" }));
    };

    const handleDistrictChange = (district) => {
        setSelectedDistrict(district);
        const distObj = districts.find(d => d.district === district);
        setUpazilaList(distObj?.upazilas || []);
        setCustomerInfo(prev => ({ ...prev, city: selectedDivision, area: "" }));
    };

    const handleUpazilaChange = (upazila) => {
        setCustomerInfo(prev => ({ ...prev, area: upazila }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Division */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">বিভাগ</label>
                <select
                    value={selectedDivision}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                    <option value="">-- বিভাগ নির্বাচন করুন --</option>
                    {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                </select>
            </div>

            {/* District */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">জেলা</label>
                <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    disabled={!districts.length}
                >
                    <option value="">-- জেলা নির্বাচন করুন --</option>
                    {districts.map(d => <option key={d.district} value={d.district}>{d.district}</option>)}
                </select>
            </div>

            {/* Upazila */}
            <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">উপজেলা / থানা</label>
                <select
                    value={customerInfo.area}
                    onChange={(e) => handleUpazilaChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    disabled={!upazilas.length}
                >
                    <option value="">-- উপজেলা নির্বাচন করুন --</option>
                    {upazilas.map(up => <option key={up} value={up}>{up}</option>)}
                </select>
            </div>
        </div>
    );
}
