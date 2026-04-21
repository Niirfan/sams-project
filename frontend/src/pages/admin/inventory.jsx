import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaBox,
  FaSearch,
  FaEdit,
  FaTrash,
  FaFileExcel,
  FaFilePdf
} from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InventoryList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [materials, setMaterials] = useState([
    {
      id: "MAT-001",
      name: "ใบรับฝากเงิน",
      type: "สลิปฝาก-ถอน",
      stock: 120,
      unit: "เล่ม",
      date: "19/02/2569",
    },
    {
      id: "MAT-002",
      name: "ใบสำคัญจ่าย",
      type: "สลิปฝาก-ถอน",
      stock: 80,
      unit: "เล่ม",
      date: "19/02/2569",
    },
    {
      id: "MAT-003",
      name: "สมุดเงินฝากกองทุนฮัจย์",
      type: "สมุดเงินฝาก",
      stock: 150,
      unit: "เล่ม",
      date: "19/02/2569",
    },
    {
      id: "MAT-004",
      name: "ซองใส่เอกสาร A4",
      type: "อุปกรณ์สำนักงาน",
      stock: 60,
      unit: "แพ็ค",
      date: "19/02/2569",
    },
    {
      id: "MAT-005",
      name: "กระดาษ A4",
      type: "แบบฟอร์ม",
      stock: 500,
      unit: "รีม",
      date: "19/02/2569",
    },
  ]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(materials);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, `Inventory_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("รายงานรายการพัสดุคงคลัง", 14, 15);

    const tableColumn = ["รหัสวัสดุ", "ชื่อพัสดุ", "ประเภท", "คงเหลือ", "หน่วย", "อัปเดต"];
    const tableRows = materials.map(item => [
      item.id,
      item.name,
      item.type,
      item.stock,
      item.unit,
      item.date,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`Inventory_Report_${new Date().toLocaleDateString()}.pdf`);
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณต้องการลบรายการนี้หรือไม่?")) {
      setMaterials(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen text-left">

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-black p-3 rounded-xl text-white">
            <FaBox size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">รายการพัสดุคงคลัง</h1>
            <p className="text-gray-400 text-xs">ตรวจสอบและจัดการจำนวนพัสดุทั้งหมดในระบบ</p>
          </div>
        </div>
      </div>

      {/* Search + Export */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3 flex items-center justify-between gap-3">
        <div className="relative flex-grow max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="ค้นหาชื่อพัสดุหรือรหัส..."
            className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-300"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-sm">
          <button
            onClick={exportToExcel}
            className="p-2 hover:bg-green-50 text-green-600 rounded-xl flex items-center gap-2 text-xs font-bold"
          >
            <FaFileExcel size={16} /> Excel
          </button>

          <button
            onClick={exportToPDF}
            className="p-2 hover:bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-xs font-bold"
          >
            <FaFilePdf size={16} /> PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-center">
          <thead>
            <tr className="text-xs font-bold text-gray-800 border-b border-gray-100 uppercase tracking-wider">
              <th className="px-6 py-5">รหัสวัสดุ</th>
              <th className="px-6 py-5 text-left">ชื่อพัสดุ</th>
              <th className="px-6 py-5">ประเภท</th>
              <th className="px-6 py-5">คงเหลือ</th>
              <th className="px-6 py-5">หน่วย</th>
              <th className="px-6 py-5">อัปเดตล่าสุด</th>
              <th className="px-6 py-5">จัดการ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
            {materials
              .filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-5 text-left font-bold text-gray-800">{item.name}</td>
                  <td className="px-6 py-5">{item.type}</td>
                  <td className="px-6 py-5 font-bold text-gray-900">{item.stock}</td>
                  <td className="px-6 py-5">{item.unit}</td>
                  <td className="px-6 py-5 text-gray-400">{item.date}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/material/add`, { state: { editData: item } })}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <FaEdit size={18} />
                      </button>

                      <div className="w-[1px] h-4 bg-gray-200" />

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FaTrash size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}