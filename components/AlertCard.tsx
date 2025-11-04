interface AlertCardProps {
  type: "warning" | "info" | "success" | "error";
  message: string;
}

export default function AlertCard({ type, message }: AlertCardProps) {
  const typeStyles = {
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  const icons = {
    warning: "⚠️",
    info: "ℹ️",
    success: "✅",
    error: "❌",
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start space-x-3 ${typeStyles[type]}`}>
      <span className="text-xl mt-0.5">{icons[type]}</span>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
