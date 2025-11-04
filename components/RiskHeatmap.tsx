export default function RiskHeatmap() {
  // Dados simulados de risco por departamento/área
  const riskData = [
    { area: "Escavação", risk: 95, color: "bg-red-600" },
    { area: "Estrutura", risk: 75, color: "bg-orange-500" },
    { area: "Acabamentos", risk: 45, color: "bg-yellow-400" },
    { area: "Instalações", risk: 35, color: "bg-lime-400" },
    { area: "Limpeza", risk: 25, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-4">
      {riskData.map((item) => (
        <div key={item.area} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{item.area}</span>
            <span className="text-sm font-bold text-gray-900">{item.risk}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${item.color} transition-all duration-300`}
              style={{ width: `${item.risk}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
