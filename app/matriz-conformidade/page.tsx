"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ComplianceRequirement {
  id: string;
  decree: string;
  article: string;
  requirement: string;
  status: "Conforme" | "Não Conforme" | "Em Progresso" | "Não Aplicável";
  evidence: string[];
  responsible: string;
  dueDate: string;
  lastUpdated: string;
  history: Array<{ date: string; status: string; notes: string }>;
}

export default function MatrizConformidadePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([
    {
      id: "1",
      decree: "Lei 11/04",
      article: "Art. 15",
      requirement: "Avaliação de Saúde Ocupacional (ASO) para todos os trabalhadores",
      status: "Conforme",
      evidence: ["ASO_2025_Lote1.pdf", "ASO_2025_Lote2.pdf"],
      responsible: "Técnico SHST",
      dueDate: "2025-12-31",
      lastUpdated: "2025-10-26",
      history: [
        { date: "2025-10-26", status: "Conforme", notes: "ASO atualizado para todos os trabalhadores" },
        { date: "2025-09-15", status: "Em Progresso", notes: "Aguardando resultados de 5 trabalhadores" },
      ],
    },
    {
      id: "2",
      decree: "Lei 11/04",
      article: "Art. 22",
      requirement: "Formação inicial em segurança no trabalho",
      status: "Em Progresso",
      evidence: ["Certificados_Formacao_2025.pdf"],
      responsible: "Gestor de Projeto",
      dueDate: "2025-11-30",
      lastUpdated: "2025-10-20",
      history: [
        { date: "2025-10-20", status: "Em Progresso", notes: "75% dos trabalhadores formados" },
        { date: "2025-09-01", status: "Em Progresso", notes: "Iniciada formação" },
      ],
    },
    {
      id: "3",
      decree: "Lei 11/04",
      article: "Art. 28",
      requirement: "Fornecimento e manutenção de EPIs",
      status: "Não Conforme",
      evidence: [],
      responsible: "Contratada",
      dueDate: "2025-10-31",
      lastUpdated: "2025-10-15",
      history: [
        { date: "2025-10-15", status: "Não Conforme", notes: "Inspeção revelou EPIs danificados" },
      ],
    },
    {
      id: "4",
      decree: "Lei 11/04",
      article: "Art. 35",
      requirement: "Plano de Emergência e Evacuação",
      status: "Conforme",
      evidence: ["Plano_Emergencia_2025.pdf", "Simulado_Evacuacao_2025.pdf"],
      responsible: "Técnico SHST",
      dueDate: "2025-12-31",
      lastUpdated: "2025-10-10",
      history: [
        { date: "2025-10-10", status: "Conforme", notes: "Simulado de evacuação realizado com sucesso" },
      ],
    },
    {
      id: "5",
      decree: "Decreto 11/04",
      article: "Art. 42",
      requirement: "Investigação de acidentes e incidentes",
      status: "Em Progresso",
      evidence: ["Relatorio_Acidente_001_2025.pdf"],
      responsible: "Técnico SHST",
      dueDate: "2025-11-15",
      lastUpdated: "2025-10-22",
      history: [
        { date: "2025-10-22", status: "Em Progresso", notes: "1 acidente investigado, 1 pendente" },
      ],
    },
  ]);

  const [filteredRequirements, setFilteredRequirements] = useState(requirements);
  const [filters, setFilters] = useState({
    status: "Todos",
    decree: "Todos",
    searchTerm: "",
  });

  const [selectedRequirement, setSelectedRequirement] = useState<ComplianceRequirement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    let filtered = requirements;

    if (filters.status !== "Todos") {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    if (filters.decree !== "Todos") {
      filtered = filtered.filter((r) => r.decree === filters.decree);
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.requirement.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          r.article.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredRequirements(filtered);
  }, [filters, requirements]);

  if (status === "loading") {
    return <div className="text-center py-10">A carregar...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Conforme":
        return "bg-green-100 text-green-800";
      case "Não Conforme":
        return "bg-red-100 text-red-800";
      case "Em Progresso":
        return "bg-yellow-100 text-yellow-800";
      case "Não Aplicável":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Conforme":
        return "✓";
      case "Não Conforme":
        return "✗";
      case "Em Progresso":
        return "⟳";
      case "Não Aplicável":
        return "-";
      default:
        return "?";
    }
  };

  const conformeCount = requirements.filter((r) => r.status === "Conforme").length;
  const totalCount = requirements.length;
  const conformancePercentage = Math.round((conformeCount / totalCount) * 100);

  const decrees = ["Todos", ...new Set(requirements.map((r) => r.decree))];
  const statuses = ["Todos", "Conforme", "Não Conforme", "Em Progresso", "Não Aplicável"];

  const handleExportPDF = () => {
    alert("Exportação PDF em desenvolvimento. Será gerado um relatório de conformidade completo.");
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Matriz de Conformidade IGT</h1>
          <p className="text-gray-600 mt-1">Rastreabilidade de requisitos legais e conformidade</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          📥 Exportar Relatório PDF
        </button>
      </div>

      {/* Resumo de Conformidade */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Conforme</p>
          <p className="text-2xl font-bold text-green-700">{conformeCount}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-600 font-medium">Em Progresso</p>
          <p className="text-2xl font-bold text-yellow-700">
            {requirements.filter((r) => r.status === "Em Progresso").length}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600 font-medium">Não Conforme</p>
          <p className="text-2xl font-bold text-red-700">
            {requirements.filter((r) => r.status === "Não Conforme").length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Taxa de Conformidade</p>
          <p className="text-2xl font-bold text-blue-700">{conformancePercentage}%</p>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Progresso Geral de Conformidade</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-green-600 h-full transition-all duration-300"
            style={{ width: `${conformancePercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {conformeCount} de {totalCount} requisitos conformes
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pesquisa</label>
            <input
              type="text"
              placeholder="Pesquisar requisito..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Decreto/Lei</label>
            <select
              value={filters.decree}
              onChange={(e) => setFilters({ ...filters, decree: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              {decrees.map((decree) => (
                <option key={decree} value={decree}>
                  {decree}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Requisitos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Decreto/Lei</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Artigo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Requisito</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Responsável</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prazo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequirements.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{req.decree}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{req.article}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{req.requirement}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                    {getStatusIcon(req.status)} {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{req.responsible}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{req.dueDate}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => {
                      setSelectedRequirement(req);
                      setShowDetailModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalhes */}
      {showDetailModal && selectedRequirement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Detalhes do Requisito</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Informações Principais */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Decreto/Lei</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequirement.decree}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Artigo</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequirement.article}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">Requisito</p>
                <p className="text-gray-900">{selectedRequirement.requirement}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Estado</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedRequirement.status)}`}>
                    {selectedRequirement.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Responsável</p>
                  <p className="text-gray-900">{selectedRequirement.responsible}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Prazo</p>
                  <p className="text-gray-900">{selectedRequirement.dueDate}</p>
                </div>
              </div>

              {/* Evidências */}
              {selectedRequirement.evidence.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Evidências</p>
                  <div className="space-y-2">
                    {selectedRequirement.evidence.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span>📎</span>
                        <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Histórico */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Histórico de Alterações</p>
                <div className="space-y-3">
                  {selectedRequirement.history.map((entry, idx) => (
                    <div key={idx} className="border-l-2 border-gray-300 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{entry.status}</p>
                        <span className="text-xs text-gray-600">{entry.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Fechar
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Editar Requisito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
