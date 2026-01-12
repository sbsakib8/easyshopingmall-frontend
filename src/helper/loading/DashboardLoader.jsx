import React from 'react';

const DashboardLoader = () => {
    return (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-2xl">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-300 font-medium">Processing...</p>
            </div>
          </div>
    );
};

export default DashboardLoader;