import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";



const menu = [
  { to: "/borrow-material", label: "เบิกวัสดุ", icon: "📦" },
  { to: "/cart", label: "ตะกร้าเบิกของ", icon: "🛒" },
  { to: "/requests", label: "รายการคำขอ", icon: "🧾" },
  { to: "/history", label: "ประวัติการเบิก", icon: "🕘" },
  { to: "/profile", label: "บัญชีของฉัน", icon: "👤" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="h-30 flex items-center px-10 gap-3">
  <img
    src={logo}
    alt="AiC Logo"
    className="h-70 w-00 object-contain"
  />
</div>

      
      {/* Menu */}
      <nav className="px-3 space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-xl text-sm
              ${isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-200"}`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
