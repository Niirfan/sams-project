import { FaPlus, FaEllipsisV, FaUsers, FaTrash, FaEdit, FaKey } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminUserManagement() {
  const navigate = useNavigate();

// export default function AdminUserManagement() {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [openMenuId, setOpenMenuId] = useState(null);
  // const usersArray = Array.isArray(data) ? data : [data, data];
  
  // State สำหรับ Modal แก้ไข
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  // ฟังก์ชันลบผู้ใช้

  const handleDeleteUser = (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้คนนี้?")) {
      setUsers(users.filter(user => user.id !== id));
      setOpenMenuId(null);
      alert("ลบผู้ใช้สำเร็จแล้ว");
    }
  };



  // ฟังก์ชันเปิด Modal แก้ไข
  const openEditModal = (user) => {
    setSelectedUser({ ...user }); 
    setIsEditModalOpen(true);
    setOpenMenuId(null); 
  };

  // ฟังก์ชันบันทึกการแก้ไข
  const handleSaveEdit = () => {
    const updatedUsers = users.map(u => u.id === selectedUser.id ? selectedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(user))
    setIsEditModalOpen(false);
    alert("อัปเดตข้อมูลสำเร็จ");
  };

  // ฟังก์ชันรีเซ็ตรหัสผ่าน (ตัวอย่าง)
  const handleResetPassword = (username) => {
    alert(`ระบบได้รีเซ็ตรหัสผ่านของ ${username} เป็น '123456' เรียบร้อยแล้ว`);
    setOpenMenuId(null);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users/all")
      .then(res => res.json())
      .then(data => {
      //   console.log("API USERS:", data);
      
  
      // // 🔹 แปลง object → array
      // const usersArray = Array.isArray(data) ? data : [data];

      const mappedUsers = data.map(u => ({
        id: u.user_id,
        name: u.full_name,
        role: u.user_role,
        branch: u.branch_id,
        servicePoint: u.service_point_id ?? "-",
        username: u.emp_code
      }));

      // const uniqueUsers = Object.values(
      //   mappedUsers.reduce((acc, u) => {
      //     if (!acc[u.id]) acc[u.id] = u;
      //     return acc;
      //   }, {})
      // );

      // setUsers(uniqueUsers);
      setUsers(mappedUsers);
    })
    .catch(err => {
      console.error("โหลดข้อมูลผู้ใช้ไม่สำเร็จ", err);
    });
}, []);


  return (
    <div className="p-5 bg-gray-100 min-h-screen text-left relative">
      
      {/* Overlay สำหรับปิดเมนู dropdown */}
      {openMenuId !== null && (
        <div className="fixed inset-0 z-20 bg-transparent" onClick={() => setOpenMenuId(null)} />
      )}

      {/* 1. ส่วนหัว (Header Section) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-3 flex items-center gap-4">
        <div className="bg-black p-3 rounded-xl text-white">
          <FaUsers size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">การจัดการผู้ใช้</h1>
          <p className="text-gray-400 text-xs">จัดการและติดตามข้อมูลสิทธิ์ผู้ใช้ทั้งหมด</p>
        </div>
      </div>

      {/* 2. แถบตัวกรอง */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          {["ทั้งหมด"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab ? "bg-black text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ตารางรายชื่อ */}
      <div className="bg-white rounded-[1rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-xs font-bold uppercase w-20">ID</th>
              <th className="px-8 py-5 text-xs font-bold uppercase">ชื่อผู้ใช้</th>
              <th className="px-8 py-5 text-xs font-bold uppercase">ตำแหน่ง</th>
              <th className="px-8 py-5 text-xs font-bold uppercase">จุดบริการ</th>
              <th className="px-8 py-5 text-xs font-bold uppercase">สาขา</th>
              <th className="px-8 py-5 text-xs font-bold uppercase">Username</th>
              <th className="px-8 py-5 text-xs font-bold uppercase w-24">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.username} className="hover:bg-gray-50/50">
                <td className="px-8 py-5 text-sm text-gray-700">{user.username}</td>
                <td className="px-8 py-5 text-sm text-gray-700 font-medium">{user.name}</td>
                <td className={`px-8 py-5 text-sm ${user.role === "Admin" ? "text-pink-300" : "text-gray-600"}`}>
                  {user.role}
                </td>
                <td className="px-8 py-5 text-sm text-gray-600">{user.servicePoint}</td>
                <td className="px-8 py-5 text-sm text-gray-600">{user.branch}</td>
                <td className="px-8 py-5 text-sm text-gray-600">{user.id}</td>
                <td className="px-8 py-5 text-center relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative z-30"
                  >
                    <FaEllipsisV size={14} />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === user.id && (
                    <div className="absolute right-10 top-12 bg-white border border-gray-100 shadow-2xl rounded-2xl p-1 z-30 min-w-[150px] flex flex-col items-start overflow-hidden">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEditModal(user); }}
                        className="p-3 text-blue-600 hover:bg-blue-50 w-full flex items-center gap-3 text-sm font-bold transition-colors"
                      >
                        <FaEdit size={14} /> แก้ไขสิทธิ์/สาขา
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleResetPassword(user.username); }}
                        className="p-3 text-orange-500 hover:bg-orange-50 w-full flex items-center gap-3 text-sm font-bold transition-colors"
                      >
                        <FaKey size={14} /> รีเซ็ตรหัสผ่าน
                      </button>
                      <div className="h-[1px] bg-gray-100 w-full" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }}
                        className="p-3 text-red-600 hover:bg-red-50 w-full flex items-center gap-3 text-sm font-bold transition-colors"
                      >
                        <FaTrash size={14} /> ลบผู้ใช้
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {[...Array(3)].map((_, i) => (
              <tr key={`empty-${i}`} className="h-16">
                <td colSpan="7" className="border-t border-gray-100"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL แก้ไขข้อมูล --- */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform transition-all">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
              <FaEdit className="text-blue-500" /> แก้ไขข้อมูลสิทธิ์
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ชื่อผู้ใช้ (อ่านอย่างเดียว)</label>
                <input type="text" value={selectedUser.name} disabled className="w-full p-3 mt-1 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 cursor-not-allowed" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ตำแหน่งสิทธิ์</label>
                <select 
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                  className="w-full p-3 mt-1 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black bg-white"
                >
                  <option value="เจ้าหน้าที่พัสดุ">เจ้าหน้าที่พัสดุ</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">สาขา</label>
                  <input 
                    type="text" 
                    value={selectedUser.branch}
                    onChange={(e) => setSelectedUser({...selectedUser, branch: e.target.value})}
                    className="w-full p-3 mt-1 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">จุดบริการ</label>
                  <input 
                    type="text" 
                    value={selectedUser.servicePoint}
                    onChange={(e) => setSelectedUser({...selectedUser, servicePoint: e.target.value})}
                    className="w-full p-3 mt-1 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black" 
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="px-6 py-2 text-gray-400 font-bold hover:bg-gray-100 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleSaveEdit} 
                className="px-8 py-2 bg-black text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all"
              >
                บันทึกการแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}