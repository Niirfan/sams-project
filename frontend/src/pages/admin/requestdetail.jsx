import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaChevronLeft } from "react-icons/fa";

export default function RequestDetailPage() {
  const navigate = useNavigate();
    const [status, setStatus] = useState("รออนุมัติ");
    const handleSaveAll = () => {
  // 1. ดึงรายการคำขอทั้งหมดที่มีอยู่เดิม
  const existingRequests = JSON.parse(localStorage.getItem("admin_requests") || "[]");

  // 2. อัปเดตเฉพาะรายการที่เรากำลังเปิดอยู่ (ค้นหาด้วย ID)
  const updatedRequests = existingRequests.map(req => {
    if (req.id === requestInfo.id) {
      return { 
        ...req, 
        status: status, // ค่าที่ได้จาก Radio Button ที่เราติ๊ก
        subStatus: "ดำเนินการเสร็จสิ้น" 
      };
    }
    return req;
  });

    localStorage.setItem("admin_requests", JSON.stringify(updatedRequests));
    
    // ส่งสัญญาณให้หน้า List อัปเดตแบบ Real-time
    window.dispatchEvent(new Event("request_status_updated"));

    alert("บันทึกการอนุมัติสำเร็จ");
    navigate("/admin/requests"); // กลับไปหน้า List
  };

  // ข้อมูลสมมติ
  const requestInfo = {
    id: "REQ-2025-0012",
    date: "21/11/67",
    type: "ผสม",
    branch: "001 หาดใหญ่",
    approver: "สกล ดีมาก",
    requester: "อารีภาพ ใจดี",
    position: "เจ้าหน้าที่พัสดุ"
  };

  const items = [
    { id: 1, name: "ใบรับฝากเงิน", requestQty: 2, approveQty: 2, unit: "เล่ม", before: 50, after: 48 },
    { id: 2, name: "ใบสำคัญจ่าย", requestQty: 20, approveQty: 15, unit: "เล่ม", before: 80, after: 65 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-left">
      
      {/* ส่วนหัว Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-black p-3 rounded-xl text-white">
            <FaFileAlt size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">รายละเอียดรายการเบิก</h1>
            <p className="text-gray-400 text-xs">ตรวจสอบและอนุมัติคำขอเบิกจากผู้ใช้งานทุกสาขา</p>
          </div>
        </div>
              <button onClick={() => navigate("/admin/requests")}
                  className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md active:scale-95 transition-all">
          <FaChevronLeft /> ย้อนกลับ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* ส่วนที่ 1: สถานะปัจจุบัน */}
        <div className="md:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4 text-sm border-b pb-2">สถานะ:</h3>
          <div className="space-y-3">
            {["รออนุมัติ", "อนุมัติแล้ว", "ไม่อนุมัติ", "เบิกสำเร็จ", "ยกเลิก"].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="status" 
                  checked={status === item} 
                  onChange={() => setStatus(item)}
                  className="w-4 h-4 accent-black"
                />
                <span className={`text-sm ${status === item ? "font-bold text-black" : "text-gray-400"}`}>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ส่วนที่ 2: อัปเดตสถานะ */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4 text-sm border-b pb-2">อัปเดตสถานะ:</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 text-blue-400 p-3 rounded-xl text-center font-bold text-sm">
              รอดำเนินการ
            </div>
            <select className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none">
                          <option>กำลังดำเนินการ</option>
                          <option>อนุมัติทั้งหมด</option>
                          <option>อนุมัติบางส่วน</option>
                          <option>ไม่อนุมัติ</option>
            </select>
            <button onClick={handleSaveAll} className="w-full py-3 bg-neutral-800 text-white rounded-xl font-bold text-sm shadow-md hover:bg-black transition-all">
              บันทึกผลการอนุมัติ
            </button>
          </div>
        </div>
      </div>

      {/* ส่วนที่ 3: ข้อมูลพื้นฐานคำขอ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
        <h3 className="font-bold mb-4 text-sm">ข้อมูลพื้นฐานคำขอ</h3>
        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
          <div className="flex justify-between md:pr-10"><span className="text-gray-400">รหัสคำขอ:</span> <span>{requestInfo.id}</span></div>
          <div className="flex justify-between md:pl-10"><span className="text-gray-400">วันที่ขอ:</span> <span>{requestInfo.date}</span></div>
          <div className="flex justify-between md:pr-10"><span className="text-gray-400">จำนวนรายการ:</span> <span>{requestInfo.type}</span></div>
          <div className="flex justify-between md:pl-10"><span className="text-gray-400">สาขา:</span> <span>{requestInfo.branch}</span></div>
          <div className="flex justify-between md:pr-10"><span className="text-gray-400">ผู้อนุมัติ:</span> <span>{requestInfo.approver}</span></div>
          <div className="flex justify-between md:pl-10"><span className="text-gray-400">ผู้ขอ:</span> <span>{requestInfo.requester}</span></div>
          <div className="flex justify-between md:pr-10"><span className="text-gray-400">ตำแหน่ง:</span> <span>{requestInfo.position}</span></div>
        </div>
      </div>

      {/* ส่วนที่ 4: รายละเอียดรายการเบิกสินค้า */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="font-bold mb-4 text-sm">รายละเอียดรายการเบิกสินค้า</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <tr>
              <th className="py-4 px-4 text-center">ลำดับ</th>
              <th className="py-4 px-4 text-left">ชื่อสินค้า</th>
              <th className="py-4 px-4 text-center">จำนวนขอเบิก</th>
              <th className="py-4 px-4 text-center text-red-400">จำนวนอนุมัติ 🖊️</th>
              <th className="py-4 px-4 text-center">หน่วย</th>
              <th className="py-4 px-4 text-center">คงเหลือก่อนเบิก</th>
              <th className="py-4 px-4 text-center font-bold">คงเหลือหลังเบิก</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-gray-50/30">
                <td className="py-4 px-4 text-center font-bold">{idx + 1}</td>
                <td className="py-4 px-4 text-left font-medium">{item.name}</td>
                <td className="py-4 px-4 text-center font-bold">{item.requestQty}</td>
                <td className="py-4 px-4 text-center">
                  <input type="number" defaultValue={item.approveQty} className="w-16 text-center border rounded-lg p-1 font-bold" />
                </td>
                <td className="py-4 px-4 text-center text-gray-400">{item.unit}</td>
                <td className="py-4 px-4 text-center font-bold">{item.before}</td>
                <td className="py-4 px-4 text-center font-bold">{item.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}