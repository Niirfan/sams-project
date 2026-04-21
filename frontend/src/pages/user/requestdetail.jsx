import { useParams, useNavigate } from "react-router-dom";
import { MOCK_REQUESTS } from "./mockreq";

const STATUS_LABELS = {
  pending: "รอดำเนินการ",
  approved: "อนุมัติ",
  processing: "กำลังดำเนินการ",
  rejected: "ไม่อนุมัติ",
  completed: "สำเร็จ",
};

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const request = MOCK_REQUESTS.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        ไม่พบข้อมูลคำขอ
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md">

        {/* Header */}
        <div className="border-b px-8 py-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-gray-500 hover:text-black mb-2"
            >
              ← กลับ
            </button>
            <h1 className="text-2xl font-bold">
              รายละเอียดคำขอ {request.id}
            </h1>
          </div>

          <span className="px-4 py-1 rounded-full text-sm font-medium bg-gray-100">
            {STATUS_LABELS[request.status]}
          </span>
        </div>

        {/* Meta Info */}
        <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          <Info label="วันที่" value={request.date} />
          <Info label="สาขา" value={request.branch} />
          <Info label="ผู้ขอ" value={request.requester} />
          <Info label="ผู้อนุมัติ" value={request.approver || "รออนุมัติ"} />
        </div>

        {/* Items */}
        <div className="px-8 pb-8">
          <h2 className="text-lg font-semibold mb-4">รายการสินค้า</h2>

          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">ชื่อสินค้า</th>
                  <th className="py-3 px-4 text-center">จำนวน</th>
                  <th className="py-3 px-4 text-center">หน่วย</th>
                </tr>
              </thead>
              <tbody>
                {request.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4 text-center font-medium">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600">
                      {item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="font-medium text-sm">{value}</p>
    </div>
  );
}