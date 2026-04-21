import {
  FaBox,
  FaArrowAltCircleUp,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaLayerGroup
} from "react-icons/fa";

export default function AdminDashboard() {

  // ===== Mock Summary Stats =====
  const stats = [
    { label: "มูลค่าวัสดุคงเหลือทั้งหมด", value: "92,000 บาท", icon: <FaBox className="text-red-400" /> },
    { label: "คำขอเบิกที่รออนุมัติ", value: "4 รายการ", icon: <FaArrowAltCircleUp className="text-purple-400" /> },
    { label: "จำนวนเบิกสำเร็จในเดือนนี้", value: "28 รายการ", icon: <FaCheckCircle className="text-green-400" /> },
    { label: "จำนวนพัสดุที่ใกล้หมด", value: "6 รายการ", icon: <FaExclamationTriangle className="text-orange-400" /> },
    { label: "จำนวนคำขอที่ไม่ได้รับการอนุมัติ", value: "2 รายการ", icon: <FaTimesCircle className="text-yellow-400" /> },
    { label: "จำนวนครุภัณฑ์ทั้งหมด", value: "64 รายการ", icon: <FaLayerGroup className="text-blue-400" /> },
  ];

  // ===== Mock Graph Data =====
  const graphData = [
    { month: "ม.ค.", value: 12 },
    { month: "ก.พ.", value: 18 },
    { month: "มี.ค.", value: 10 },
    { month: "เม.ย.", value: 22 },
    { month: "พ.ค.", value: 15 },
    { month: "มิ.ย.", value: 28 },
  ];

  // ===== Mock Table Data =====
  const topMaterials = [
    { id: "MAT-001", name: "กระดาษ A4", total: 420 },
    { id: "MAT-002", name: "แฟ้มเอกสาร", total: 310 },
    { id: "MAT-003", name: "ซองเอกสาร", total: 280 },
    { id: "MAT-004", name: "สมุดบัญชี", total: 190 },
  ];

  const maxValue = Math.max(...graphData.map(i => i.value));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* ===== Summary Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white py-4 px-6 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl text-xl">{stat.icon}</div>
            <div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-[11px] text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Graph Section ===== */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">จำนวนการเบิก (รายเดือน)</h2>
        </div>

        {/* Fake Bar Chart */}
        <div className="flex items-end justify-between h-64 gap-3">
          {graphData.map((item, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div
                className="w-full bg-blue-500 rounded-t-xl transition-all"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              ></div>
              <p className="text-xs mt-2 text-gray-600">{item.month}</p>
              <p className="text-xs font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Table Section ===== */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
        <h2 className="text-lg font-bold mb-4">วัสดุที่ถูกเบิกมากที่สุด</h2>

        <table className="w-full text-center">
          <thead>
            <tr className="text-xs font-bold border-b">
              <th className="py-3">รหัสวัสดุ</th>
              <th className="py-3 text-left">ชื่อวัสดุ</th>
              <th className="py-3">จำนวนที่ถูกเบิก</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {topMaterials.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="py-4 font-medium">{item.id}</td>
                <td className="py-4 text-left font-bold">{item.name}</td>
                <td className="py-4 font-bold text-blue-600">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}