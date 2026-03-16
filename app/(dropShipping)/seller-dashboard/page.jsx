import { FiBox, FiClock, FiSettings, FiCheckCircle, FiCornerUpLeft } from "react-icons/fi";
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";

function SallerDashboard() {
  const overview = [
    {
      id: 1,
      title: "total order",
      order: 123,
      profit: 1234,
      sellPrice: 112324,
      arrow1: "right",
      arrow2: "right",
      icon: <FiBox className="text-3xl text-secondary" />,
    },
    {
      id: 2,
      title: "PENDING",
      order: 4,
      profit: 1234,
      sellPrice: 112324,
      arrow1: "right",
      arrow2: "right",
      icon: <FiClock className="text-3xl text-secondary" />,
    },
    {
      id: 3,
      title: "PROCESSING",
      order: 4,
      profit: 1234,
      sellPrice: 112324,
      arrow1: "left",
      arrow2: "right",
      icon: <FiSettings className="text-3xl text-secondary" />,
    },
    {
      id: 4,
      title: "DELIVERED",
      order: 4,
      profit: 1234,
      sellPrice: 112324,
      arrow1: "right",
      arrow2: "left",
      icon: <FiCheckCircle className="text-3xl text-secondary" />,
    },
    {
      id: 5,
      title: "RETURNED",
      order: 4,
      profit: 1234,
      sellPrice: 112324,
      arrow1: "right",
      arrow2: "right",
      icon: <FiCornerUpLeft className="text-3xl text-secondary" />,
    },
  ];

  return (
   <div className="bg-bg">
     <div className="container mx-auto px-4 py-8 ">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Seller Details
        </h2>
        <p className="text-gray-500 text-sm">Your Actions</p>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {overview.map((view) => (
          <div
            key={view.id}
            className="rounded-md p-6 flex flex-col md:flex-row items-center gap-8 bg-primary-color shadow-2xl"
          >
            {/* Left Icon (circle) */}
            <div className="w-[80px] h-[80px] rounded-full border-2 border-secondary flex items-center justify-center shrink-0">
              {view.icon}
            </div>

            {/* Right content */}
            <div className="flex-grow flex flex-col gap-4 w-full items-center">
              {/* Title Box */}
              <div className=" w-full text-center text-2xl  font-semibold uppercase">
                {view.title}
              </div>

              {/* Stats row */}
              <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center md:justify-start gap-4 flex-wrap">
                {/* Order */}
                <div className="border border-secondary font-bold rounded-md px-6 py-2 flex items-center justify-center">
                  ORDER : ৳{view.order}
                </div>

                {/* Arrow 1 */}
                <div className="items-center text-secondary hidden md:flex">
                  {view.arrow1 === "right" ? (
                    <FaLongArrowAltRight size={20} />
                  ) : (
                    <FaLongArrowAltLeft size={20} />
                  )}
                </div>

                {/* Profit */}
                <div className="border border-secondary font-bold rounded-md px-6 py-2 flex items-center justify-center text-sm">
                  PROFIT : ৳{view.profit}
                </div>

                {/* Arrow 2 */}
                <div className="items-center text-secondary hidden md:flex">
                  {view.arrow2 === "right" ? (
                    <FaLongArrowAltRight size={20} />
                  ) : (
                    <FaLongArrowAltLeft size={20} />
                  )}
                </div>

                {/* Sell Price */}
                <div className="border border-secondary font-bold rounded-md px-6 py-2 flex items-center justify-center text-sm">
                  SELL PRICE : ৳{view.sellPrice}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
   </div>
  );
}

export default SallerDashboard;
