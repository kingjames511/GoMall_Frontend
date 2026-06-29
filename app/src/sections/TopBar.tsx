import { Phone, ChevronDown } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-navy text-white h-10 flex items-center">
      <div className="container-main flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-white/80" />
          <span className="text-caption text-white/90">+234 809 289 0307</span>
        </div>
        <p className="text-caption font-medium text-white/90 hidden sm:block">
          Millions of Products, Endless Choices
        </p>
        <button className="flex items-center gap-1 text-caption text-white/90 hover:text-white transition-colors">
          NGN
          <ChevronDown size={12} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
