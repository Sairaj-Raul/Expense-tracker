import { Link, useLocation } from "react-router-dom";
import {
  Check,
  DollarSign,
  ShoppingCart,
  PiggyBank,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Check, color: "text-white" },
  {
    name: "Income",
    href: "/income",
    icon: DollarSign,
    color: "text-green-500",
  },
  {
    name: "Expense",
    href: "/expense",
    icon: ShoppingCart,
    color: "text-red-500",
  },
  {
    name: "Savings",
    href: "/savings",
    icon: PiggyBank,
    color: "text-yellow-500",
  },
  {
    name: "Due",
    href: "/due",
    icon: Calendar,
    color: "text-orange-500",
  },
];

interface SidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function Sidebar({ open = true }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-gray-900 text-white transition-all duration-300",
        open ? "w-64" : "w-0 overflow-hidden"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 p-6 transition-opacity",
          !open && "opacity-0"
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
          <span className="text-xl font-bold">$</span>
        </div>
        <span className="text-xl font-bold text-blue-400">MyExpense</span>
      </div>

      {/* Navigation */}
      <nav
        className={cn(
          "flex-1 space-y-1 px-3 transition-opacity",
          !open && "opacity-0"
        )}
      >
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon
                className={cn("h-5 w-5", isActive ? "text-white" : item.color)}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
