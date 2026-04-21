import { useState } from "react";
import { useNavigate } from "react-router-dom"; // เพิ่มสำหรับการเปลี่ยนหน้า
import { FaSignOutAlt } from "react-icons/fa"; // ไอคอนออกจากระบบ

export default function Topbar({ onSearch, onNotifClick }) {
  const [q, setQ] = useState("");
  const [showLogoutCard, setShowLogoutCard] = useState(false); // State ควบคุมป๊อปอัพ Logout
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(q);
  };

  const handleLogout = () => {
    // ในอนาคตใส่ Logic ลบ Token ตรงนี้
    setShowLogoutCard(false);
    navigate("/login"); // สั่งให้ไปหน้า Login
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSubmit} className="w-80">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-full h-10 rounded-full border border-gray-200 bg-gray-50 px-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNotifClick}
            className="h-10 w-10 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
            title="แจ้งเตือน"
          >
            🔔
          </button>

          {/* ส่วนของปุ่ม User และ Dropdown Logout */}
          <div className="relative">
            <button
              onClick={() => setShowLogoutCard(!showLogoutCard)}
              className="h-10 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
              title="บัญชีผู้ใช้"
            >
              👤 <span className="text-sm font-medium">User</span>
            </button>

            {/* การ์ด Logout ที่จะแสดงเมื่อกดปุ่ม User */}
            {showLogoutCard && (
              <>
                {/* เลเยอร์ล่องหนสำหรับคลิกที่อื่นเพื่อปิดเมนู */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowLogoutCard(false)}
                ></div>

                {/* ตัวการ์ดเมนูตามรูปแบบในรูปภาพ */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 animate-in fade-in zoom-in duration-200">
                  <div className="px-3 py-2 text-sm font-bold text-gray-900 border-b border-gray-50 mb-1">
                    User
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-3 text-red-500 font-bold bg-gray-50 rounded-xl hover:bg-red-50 transition-colors group"
                  >
                    <span>ออกจากระบบ</span>
                    <FaSignOutAlt className="text-lg group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}