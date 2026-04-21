import React, { useEffect, useState } from "react";
import { FaBars, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function InOutPage() {
  const navigate = useNavigate();

  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    setHistoryData([
      {
        mat_code: "MAT-001",
        mat_name: "ปากกาทดสอบระบบ",
        mat_type_name: "แผนกพัฒนาผลิตภัณฑ์",
        created_at: "2026-02-19T23:42:01",
        action_type: "IN",
        quantity: 90,
        balance_after: 180,
      },
      {
        mat_code: "MAT-002",
        mat_name: "ของที่ระลึก",
        mat_type_name: "ของพรีเมียม",
        created_at: "2026-02-19T23:40:05",
        action_type: "OUT",
        quantity: 90,
        balance_after: 90,
      },
      {
        mat_code: "MAT-003",
        mat_name: "สมุดโน้ต",
        mat_type_name: "เครื่องเขียน",
        created_at: "2026-02-19T22:45:39",
        action_type: "IN",
        quantity: 50,
        balance_after: 100,
      },
      {
        mat_code: "MAT-004",
        mat_name: "ซองใส่เอกสาร",
        mat_type_name: "อุปกรณ์สำนักงาน",
        created_at: "2026-02-19T22:31:12",
        action_type: "OUT",
        quantity: 10,
        balance_after: 20,
      },
      {
        mat_code: "MAT-005",
        mat_name: "กระดาษ A4",
        mat_type_name: "แบบฟอร์ม",
        created_at: "2026-02-19T09:25:56",
        action_type: "IN",
        quantity: 20,
        balance_after: 40,
      },
    ]);
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen text-left">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-black p-3 rounded-xl text-white shadow-lg">
              <FaBars size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                รายการประวัติวัสดุ
              </h1>
              <p className="text-gray-400 text-xs">
                รายละเอียดประวัติการเข้าออกวัสดุในระบบ
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/material/add")}
            className="bg-black text-white px-5 py-3 rounded-xl flex items-center gap-2 font-bold text-sm shadow-md"
          >
            <FaPlus size={14} /> เพิ่มรายการวัสดุ
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[1rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-gray-50 border-b">
            <tr className="text-sm text-gray-600 font-bold">
              <th className="px-6 py-4">รหัสวัสดุ</th>
              <th className="px-6 py-4">ชื่อวัสดุ</th>
              <th className="px-6 py-4">ประเภท</th>
              <th className="px-6 py-4">วันที่</th>
              <th className="px-6 py-4">สถานะ</th>
              <th className="px-6 py-4">จำนวน</th>
              <th className="px-6 py-4">คงเหลือ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {historyData.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium">
                  {item.mat_code}
                </td>
                <td className="px-6 py-4">{item.mat_name}</td>
                <td className="px-6 py-4">{item.mat_type_name}</td>
                <td className="px-6 py-4 text-sm">
                  {new Date(item.created_at).toLocaleString("th-TH")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-6 py-2 rounded-full text-xs font-bold border-2 ${
                      item.action_type === "IN"
                        ? "bg-[#D1E9F6] text-[#63ADD1] border-[#B2D7E8]"
                        : "bg-[#FFE2E2] text-[#E25656] border-[#F5C6C6]"
                    }`}
                  >
                    {item.action_type === "IN" ? "นำเข้า" : "นำออก"}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold">
                  {item.quantity}
                </td>
                <td className="px-6 py-4 font-bold">
                  {item.balance_after}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}