"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FileUpload from "@/components/FileUpload";

interface ComplianceItem {
  id: string;
  requirement: string;
  description: string;
  status: "Conforme" | "Não Conforme" | "Em Progresso";
  evidence?: string;
  evidenceFile?: File;
  dueDate: string;
  responsible?: string;
  lastUpdated?: string;
}

export default function ConformidadePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<ComplianceItem[]>([
    {
      id: "1",
      requirement: "ASO - Avaliação de Saúde Ocupacional",
      description: "Todos os trabalhadores devem ter ASO atualizado",
      status: "Conforme",
      evidence: "ASO_2025.pdf",
      dueDate: "2025-12-31",
      responsible: "Técnico SHST",
      lastUpdated: "2025-10-26",
    },
    {
      id: "2",
      requirement: "Formação em Segurança",
      description: "Formação inicial e contínua em segurança",
      status: "Em Progresso",
      dueDate: "2025-11-30",
      responsible: "Gestor de Projeto",
      lastUpdated: "2025-10-20",
    },
    {
      id: "3",
      requirement: "EPIs - Equipamentos de Proteção Individual",
      description: "Fornecimento e manutenção de EPIs",
      status: "Não Conforme",
      dueDate: "2025-10-31",
      responsible: "Contratada",
      lastUpdated: "2025-10-15",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    requirement: "",
    description: "",
    status: "Em Progresso" as const,
    evidence: "",
    dueDate: "",
    responsible: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-center py-10">A carregar...</div>;
  }

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      requirement: "",
      description: "",
      status: "Em Progresso",
      evidence: "",
      dueDate: "",
      responsible: "",
    });
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleEdit = (item: ComplianceItem) => {
    setEditingId(item.id);
    setFormData({
      requirement: item.requirement,
      description: item.description,
      status: item.status,
      evidence: item.evidence || "",
      dueDate: item.dueDate,
      responsible: item.responsible || "",
    });
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFormData({ ...formData, evidence: file.name });
  };

  const handleSave = () => {
    if (!formData.requirement || !formData.dueDate) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      setItems(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formData,
                evidenceFile: selectedFile,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          ...formData,
          evidenceFile: selectedFile,
          lastUpdated: new Date().toISOString().split("T")[0],
        },
      ]);
    }

    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar este item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Conforme":
        return "bg-green-100 text-green-800";
      case "Não Conforme":
        return "bg-red-100 text-red-800";
      case "Em Progresso":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const conformeCount = items.filter((i) => i.status === "Conforme").length;
  const totalCount = items.length;
  const conformancePercentage = Math.round((conformeCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conformidade IGT</h1>
          <p className="text-gray-600 mt-1">Matriz de conformidade com legislação angolana</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          + Novo Requisito
        </button>
      </div>

      {/* Resumo de Conformidade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Conforme</p>
          <p className="text-2xl font-bold text-green-700">{conformeCount}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-600 font-medium">Em Progresso</p>
          <p className="text-2xl font-bold text-yellow-700">
            {items.filter((i) => i.status === "Em Progresso").length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Taxa de Conformidade</p>
          <p className="text-2xl font-bold text-blue-700">{conformancePercentage}%</p>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Progresso Geral</p>
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

      {/* Tabela de Requisitos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Requisito</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Responsável</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prazo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Evidência</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.requirement}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.responsible || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.dueDate}</td>
                <td className="px-6 py-4 text-sm">
                  {item.evidence ? (
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                      📎 {item.evidence}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulário Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? "Editar Requisito" : "Novo Requisito"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requisito *
                </label>
                <input
                  type="text"
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ex: ASO - Avaliação de Saúde Ocupacional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Descrição detalhada do requisito"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option>Conforme</option>
                    <option>Em Progresso</option>
                    <option>Não Conforme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Ex: Técnico SHST"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prazo *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ficheiro de Evidência
                </label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  maxSize={10 * 1024 * 1024}
                  allowedTypes={["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}
                  label=""
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
