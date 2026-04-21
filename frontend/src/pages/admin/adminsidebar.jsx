import { Link, useLocation } from "react-router-dom";
import { 
  FaThLarge, // เปลี่ยนจาก FaLayout เป็น FaThLarge เพื่อแก้ Error
  FaBox, FaLaptop, FaCheckSquare, 
  FaClipboardList, FaUsers, FaChartBar,FaBars 
} from "react-icons/fa";

export default function AdminSidebar() {
  const location = useLocation();

  const menuGroups = [
    {
      title: "Dashbord",
      items: [
        { name: "ภาพรวมระบบ", path: "/admin/dashboard", icon: <FaThLarge /> },
      ]
    },
    {
      title: "จัดการวัสดุสำนักงาน",
      items: [
        { name: "รายการวัสดุสำนักงาน", path: "/admin/materials", icon: <FaBox /> },
      ]
    },

    {
      title: "จัดการประวัติวัสดุสำนักงาน",
      items: [
        { name: "รายการประวัติการเข้าออกวัสดุ", path: "/admin/history", icon: <FaBars />}
      ]
    },

    {
      title: "จัดการตรวจสอบการอนุมัติการเบิก",
      items: [
        { name: "รายการเบิก", path: "/admin/requests", icon: <FaCheckSquare /> },
      ]
    },
    {
      title: "จัดการผู้ใช้",
      items: [
        { name: "รายการผู้ใช้", path: "/admin/users", icon: <FaUsers /> },
      ]
    },
    {
      title: "จัดการรายงานคงคลัง",
      items: [
        { name: "รายการรายงานคงคลัง", path: "/admin/inventory", icon: <FaChartBar /> },
      ]
    }
  ];

  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col overflow-y-auto scrollbar-thin">
      {/* ส่วนกำหนด CSS สำหรับ Custom Scrollbar แบบ Inline */}
      <style dangerouslySetInnerHTML={{ __html: `
        aside::-webkit-scrollbar {
          width: 5px;
        }
        aside::-webkit-scrollbar-track {
          background: transparent;
        }
        aside::-webkit-scrollbar-thumb {
          background: #f4f5f7ff; 
          border-radius: 10px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}} />

      {/* Header Logo */}
      <div className="p-6 sticky top-0 bg-white z-10">
        <div className="bg-[#2D2D2D] text-white p-4 rounded-xl text-center font-bold tracking-wider shadow-sm">
          ADMIN PANEL
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 pb-10">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-black uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                // เช็ค Path ให้ตรงทั้ง dashboard และ dashbord ตาม AppRoutes
                const isActive = location.pathname === item.path || (item.path === "/admin/dashboard" && location.pathname === "/admin/dashbord");
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-gray-100 text-gray-900 shadow-sm" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <span className={isActive ? "text-[#72C1D1]" : "text-gray-400"}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}