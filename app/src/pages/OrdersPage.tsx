import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ChevronRight,
  ChevronDown,
  Bike,
  Clock,
  XCircle,
  Truck,
  MapPin,
  X,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import TopBar from "@/sections/TopBar";
import Navbar from "@/sections/Navbar";
import Footer from "@/sections/Footer";
import { isAuthenticated } from "@/utils/storage";

interface OrderItem {
  id: number;
  name: string;
  price: string;
  qty: number;
  seller: string;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  placedAt: string;
  status: "on_the_way" | "out_for_delivery" | "processing" | "cancelled" | "completed";
  total: string;
  itemCount: number;
  address: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "inprogress" | "completed" | "cancelled">("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }, [location.pathname, navigate]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "inprogress") return order.status === "on_the_way" || order.status === "out_for_delivery" || order.status === "processing";
    if (activeTab === "completed") return order.status === "completed";
    if (activeTab === "cancelled") return order.status === "cancelled";
    return true;
  });

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "on_the_way":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green/10 text-green border border-green/20">
            <Bike size={14} />
            On the Way
          </span>
        );
      case "out_for_delivery":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-navy/10 text-navy border border-navy/20">
            <Truck size={14} />
            Out For Delivery
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-star/10 text-star border border-star/20">
            <Clock size={14} />
            Processing
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red/10 text-red border border-red/20">
            <XCircle size={14} />
            Cancelled
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300/30">
            <CheckCircle2 size={14} />
            Completed
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white font-vietnam flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-grow pb-16">
        {/* Breadcrumb */}
        <div className="container-main py-4 text-caption text-text-secondary flex items-center gap-2">
          <Link to="/" className="hover:text-navy transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-text-muted font-semibold">My Orders</span>
        </div>

        {/* Banner matching Attachment 1 */}
        <div className="container-main mb-8">
          <div className="relative rounded-2xl md:rounded-2xl overflow-hidden h-[180px] sm:h-[210px] md:h-[240px] flex items-center px-6 md:px-12">
            <img
              src="/assets/orders-bg.png"
              alt="Grocery shopping cart"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/30" />

            <div className="relative z-10 text-white max-w-xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                My Orders
              </h1>
              <p className="text-gray-200 mt-2 text-xs sm:text-sm md:text-base font-normal">
                Track, manage, and stay updated on all your orders in one convenient place.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs matching Attachment 1 */}
        <div className="container-main">
          <div className="border-b border-gray-200 mb-8 flex gap-6 sm:gap-8 overflow-x-auto scrollbar-none text-sm font-medium">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-3.5 px-1 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "all"
                  ? "border-navy text-navy font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              All Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab("inprogress")}
              className={`pb-3.5 px-1 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "inprogress"
                  ? "border-navy text-navy font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Inprogress ({orders.filter((order) => order.status === "on_the_way" || order.status === "out_for_delivery" || order.status === "processing").length})
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`pb-3.5 px-1 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "completed"
                  ? "border-navy text-navy font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Completed Orders ({orders.filter((order) => order.status === "completed").length})
            </button>

            <button
              onClick={() => setActiveTab("cancelled")}
              className={`pb-3.5 px-1 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "cancelled"
                  ? "border-navy text-navy font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              Cancelled ({orders.filter((order) => order.status === "cancelled").length})
            </button>
          </div>

          {/* Orders List Container */}
          <div className="space-y-4 max-w-6xl mx-auto">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No orders found for this filter.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isExpanded = expandedOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden transition-all"
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => toggleExpand(order.id)}
                      className="p-4 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Left: Stack Icon & Title */}
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Thumbnail Box */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-600 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                          <img
                            src={order.items[0]?.image || "/assets/product-iphone.jpg"}
                            alt="Order thumbnail"
                            className="w-full h-full object-cover opacity-40 filter brightness-75"
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm drop-shadow-md">
                            {order.itemCount}+ Items
                          </span>
                        </div>

                        {/* Order Info */}
                        <div className="min-w-0">
                          <h3 className="font-bold text-text-primary text-sm sm:text-base tracking-tight">
                            Order {order.orderNumber}
                          </h3>
                          <p className="text-xs text-text-muted mt-0.5">
                            {order.status === "on_the_way" ? "Placed at: " : ""}
                            {order.placedAt}
                          </p>
                          <div className="mt-1.5">{getStatusBadge(order.status)}</div>
                        </div>
                      </div>

                      {/* Right: Total Price & Chevron */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-extrabold text-base sm:text-lg text-text-primary">
                          &#8358; {order.total}
                        </span>
                        <div className="text-gray-400 hover:text-text-primary transition-colors">
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail Body matching Attachment 1 */}
                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-6 pt-2 space-y-5 border-t border-gray-100 bg-white">
                        {/* Horizontal Product Items Slider Container */}
                        <div className="bg-gray-bg border border-gray-100 rounded-xl p-4 sm:p-5 flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="w-32 sm:w-36 shrink-0 flex flex-col"
                            >
                              {/* Image Card with badge */}
                              <div className="relative w-full h-28 sm:h-32 rounded-xl bg-white border border-gray-200 overflow-hidden p-2 flex items-center justify-center">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <span className="w-5 h-5 bg-navy text-white rounded-full flex items-center justify-center text-[10px] font-bold absolute top-1.5 right-1.5 shadow-xs">
                                  {item.qty}
                                </span>
                              </div>

                              {/* Details */}
                              <h4 className="font-bold text-xs text-text-primary mt-2.5 truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs font-semibold text-text-secondary mt-0.5">
                                {item.qty} x {item.price}
                              </p>
                              <p className="text-[10px] text-text-muted mt-0.5 truncate">
                                {item.seller}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Footer Bar inside expanded order */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-navy/10 text-navy flex items-center justify-center shrink-0">
                              <MapPin size={18} />
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                                Delivering
                              </p>
                              <p className="text-xs sm:text-sm font-bold text-text-primary">
                                {order.address}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (order.status === "cancelled") {
                                toast.error("This order has been cancelled.");
                              } else {
                                setTrackingModalOrder(order);
                              }
                            }}
                            className="w-full sm:w-auto bg-navy hover:bg-navy-hover text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            Track Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Order Tracking Modal */}
        {trackingModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 relative shadow-lg animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div>
                <span className="text-xs font-semibold text-navy uppercase tracking-wider">
                  Real-time Tracking
                </span>
                <h3 className="text-xl font-bold text-text-primary mt-1">
                  Order {trackingModalOrder.orderNumber}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Delivering to: {trackingModalOrder.address}
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">Order Confirmed</p>
                    <p className="text-[10px] text-gray-400">Nov 30, 2026 - 10:34 AM</p>
                  </div>
                </div>

                <div className="w-0.5 h-4 bg-emerald-500 ml-4" />

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center shrink-0">
                    <Truck size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">Package Dispatched</p>
                    <p className="text-[10px] text-gray-400">Rider assigned & en route</p>
                  </div>
                </div>

                <div className="w-0.5 h-4 bg-gray-200 ml-4" />

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Delivered</p>
                    <p className="text-[10px] text-gray-400">Estimated delivery: Today, 3:30 PM</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  toast.success("Tracking link copied to clipboard!");
                  setTrackingModalOrder(null);
                }}
                className="w-full bg-navy hover:bg-navy-hover text-white py-2.5 rounded-lg font-semibold text-sm transition-colors cursor-pointer mt-4"
              >
                Copy Tracking Link
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
