import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa";

export default function AdminTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // ฟังก์ชันหาชื่อหน้าเพื่อแสดงในการ์ดทางซ้าย
  const getPageLabel = () => {
    const path = location.pathname;
    if (path === "/admin/dashboard" || path === "/admin/dashbord") return "Dashbord";
    if (path === "/admin/materials") return "รายการวัสดุสำนักงาน";
    if (path === "/admin/inout") return "รายการประวัติการเข้าออกวัสดุ";
    if (path === "/admin/approve-requests") return "รายการเบิก";
    if (path === "/admin/users") return "รายการผู้ใช้";
    if (path === "/admin/reports") return "รายการรายงานคงคลัง";
    if (path === "/admin/material/add") return "เพิ่มรายการวัสดุสํานักงาน"
    return "Admin Panel";
  };

  // ปิดเมนูเมื่อคลิกข้างนอกตัวการ์ด
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // ใส่ Logic การลบ Token หรือ Session ตรงนี้ (ถ้ามี)
    navigate("/login");
  };

  return (
    <header className="h-20 bg-white relative z-50">
      <div className="h-full flex items-center justify-between px-8">
        
        {/* ส่วนซ้าย: การ์ดชื่อหน้า */}
        <div className="flex items-center">
          <div className="bg-white border border-gray-200 px-6 py-2 rounded-xl shadow-sm">
            <span className="text-sm font-bold text-gray-800">{getPageLabel()}</span>
          </div>
        </div>

        {/* ส่วนขวา: แจ้งเตือน และ โปรไฟล์ */}
        <div className="flex items-stretch gap-4 h-10 relative" ref={menuRef}>
          
          <button className="flex items-center justify-center px-3 text-black hover:bg-gray-50 rounded-xl border border-gray-200 transition-all shadow-sm bg-white">
            <FaBell size={18} />
          </button>
          
          {/* โปรไฟล์ Admin (คลิกเพื่อเปิดเมนู) */}
          <div 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-3 pl-2 pr-4 border rounded-2xl bg-white shadow-sm transition-all cursor-pointer select-none ${
              isMenuOpen ? "border-gray-400 ring-2 ring-gray-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="h-7 w-7 bg-gray-100 rounded-full flex items-center justify-center text-black border border-gray-200">
              <FaUserCircle size={20} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-extrabold text-black leading-none">Admin</span>
            </div>
          </div>

          {/* --- Dropdown Menu (การ์ดออกจากระบบ) --- */}
          {isMenuOpen && (
            <div className="absolute top-12 right-0 w-56 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 animate-in fade-in zoom-in duration-200 z-50">
              <div className="px-4 py-3 mb-2 border-b border-gray-50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Admin Actions</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-4 py-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors group"
              >
                <span className="text-sm font-bold">ออกจากระบบ</span>
                <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* เส้นขอบล่างมีมิติ */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-100"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-gray-50/30"></div>
    </header>
  );
}