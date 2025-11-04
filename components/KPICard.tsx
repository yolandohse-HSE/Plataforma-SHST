interface KPICardProps {
  title: string;
  value: string;
  change: string;
  status: "positive" | "negative" | "neutral" | "warning";
}

export default function KPICard({ title, value, change, status }: KPICardProps) {
  const statusColors = {
    positive: "bg-green-50 text-green-700",
    negative: "bg-red-50 text-red-700",
    neutral: "bg-gray-50 text-gray-700",
    warning: "bg-yellow-50 text-yellow-700",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm font-semibold mt-2 ${statusColors[status]}`}>
            {change}
          </p>
        </div>
      </div>
    </div>
  );
}
