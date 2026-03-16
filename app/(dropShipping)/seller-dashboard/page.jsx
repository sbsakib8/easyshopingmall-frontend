
function SallerDashboard() {
  const overview = [
        {
            id: 1,
            title: "Total Orders",    
            value:100
        },
        {
            id: 2,
            title: "Pending",
            value:100
        },
        {
            id: 3,
            title: "Processing",
            value:100
        },
        {
            id: 4,
            title: "Complete",
            value:100
        },
        {
            id: 5,
            title: "Return",
            value:100
        },
       
    ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
       Seller Details
        </h2>
        <p className="text-gray-500 text-sm">
       Your Actions
        </p>
      </div>
    <div className='container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 '>
             {overview.map(view => <div key={view.id} className={`py-20 md:px-10   cursor-pointer hover:scale-105 duration-75 rounded-2xl relative bg-primary-color ${view.class}`} >
               <h2 className="text-center text-lg font-bold"> {view.title}</h2>
               <h2 className="text-center text-3xl font-bold"> {view.value}</h2>
            <p className="absolute top-5 right-3">{view?.icon}</p>
            </div>)}
            </div>
    </div>
  );
}

export default SallerDashboard;
