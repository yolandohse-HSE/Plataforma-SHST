"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Contractor {
  id: string;
  name: string;
  nif: string;
  contact: string;
  email: string;
  rating: number;
  status: "Ativa" | "Inativa" | "Suspensa";
  documents: string[];
}
interface FormData {
  name: string;
  nif: string;
  contact: string;
  email: string;
  status: "Ativa" | "Inativa" | "Suspensa";
}
export default function ContratadasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contractors, setContractors] = useState<Contractor[]>([
    {
      id: "1",
      name: "Construtora ABC",
      nif: "1234567890123",
      contact: "+244 923 456 789",
      email: "contato@construtorabc.ao",
      rating: 4.5,
      status: "Ativa",
      documents: ["Licença", "Seguro", "Certificação"],
    },
    {
      id: "2",
      name: "Engenharia XYZ",
      nif: "9876543210987",
      contact: "+244 912 345 678",
      email: "info@engenhariaxyz.ao",
      rating: 4.0,
      status: "Ativa",
      documents: ["Licença", "Seguro"],
    },
    {
      id: "3",
      name: "Obras Gerais",
      nif: "5555555555555",
      contact: "+244 934 567 890",
      email: "obras@gerais.ao",
      rating: 3.5,
      status: "Inativa",
      documents: ["Licença"],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] =  useState<FormData>({
    name: "",
    nif: "",
    contact: "",
    email: "",
    status: "Ativa"
  });
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
      name: "",
      nif: "",
      contact: "",
      email: "",
      status: "Ativa",
    });
    setShowForm(true);
  };

  const handleEdit = (contractor: Contractor) => {
    setEditingId(contractor.id);
    setFormData({
      name: contractor.name,
      nif: contractor.nif,
      contact: contractor.contact,
      email: contractor.email,
      status: contractor.status,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.nif || !formData.email) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (editingId) {
      setContractors(
        contractors.map((c) =>
          c.id === editingId
            ? { ...c, ...formData }
            : c
        )
      );
    } else {
      setContractors([
        ...contractors,
        {
          id: Date.now().toString(),
          ...formData,
          rating: 3.5,
          documents: [],
        },
      ]);
    }

    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar esta contratada?")) {
      setContractors(contractors.filter((c) => c.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa":
        return "bg-green-100 text-green-800";
      case "Inativa":
        return "bg-gray-100 text-gray-800";
      case "Suspensa":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating: number) => {
    return "⭐".repeat(Math.round(rating));
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Contratadas</h1>
          <p className="text-gray-600 mt-1">Registo, validação e gestão de contratadas e subempreiteiros</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          + Nova Contratada
        </button>
      </div>

      {/* Resumo de Contratadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Ativas</p>
          <p className="text-2xl font-bold text-green-700">
            {contractors.filter((c) => c.status === "Ativa").length}
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Inativas</p>
          <p className="text-2xl font-bold text-gray-700">
            {contractors.filter((c) => c.status === "Inativa").length}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600 font-medium">Suspensas</p>
          <p className="text-2xl font-bold text-red-700">
            {contractors.filter((c) => c.status === "Suspensa").length}
          </p>
        </div>
      </div>

      {/* Tabela de Contratadas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">NIF</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Classificação</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contractors.map((contractor) => (
              <tr key={contractor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{contractor.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{contractor.nif}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{contractor.email}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-yellow-500">{getRatingStars(contractor.rating)}</span>
                  <span className="text-gray-600 ml-1">({contractor.rating})</span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contractor.status)}`}>
                    {contractor.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(contractor)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(contractor.id)}
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
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? "Editar Contratada" : "Nova Contratada"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ex: Construtora ABC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIF *
                </label>
                <input
                  type="text"
                  value={formData.nif}
                  onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ex: 1234567890123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ex: contato@empresa.ao"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contacto
                </label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ex: +244 923 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option>Ativa</option>
                  <option>Inativa</option>
                  <option>Suspensa</option>
                </select>
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
