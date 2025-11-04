"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LibraryItem {
  id: string;
  title: string;
  category: "Legislação" | "Modelos" | "Checklists" | "Guias";
  description: string;
  fileType: string;
  downloadCount: number;
  updatedDate: string;
}

export default function BibliotecaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items] = useState<LibraryItem[]>([
    {
      id: "1",
      title: "Lei de Segurança, Higiene e Saúde no Trabalho",
      category: "Legislação",
      description: "Legislação angolana sobre SHST",
      fileType: "PDF",
      downloadCount: 245,
      updatedDate: "2025-10-01",
    },
    {
      id: "2",
      title: "Modelo de PSS - Plano de Segurança e Saúde",
      category: "Modelos",
      description: "Modelo padrão para elaboração de PSS",
      fileType: "DOCX",
      downloadCount: 189,
      updatedDate: "2025-09-15",
    },
    {
      id: "3",
      title: "Checklist de Inspeção de Segurança",
      category: "Checklists",
      description: "Lista de verificação para inspeções de segurança",
      fileType: "PDF",
      downloadCount: 312,
      updatedDate: "2025-10-20",
    },
    {
      id: "4",
      title: "Guia de Gestão de Risco",
      category: "Guias",
      description: "Guia prático para identificação e gestão de riscos",
      fileType: "PDF",
      downloadCount: 156,
      updatedDate: "2025-09-30",
    },
    {
      id: "5",
      title: "Modelo de Relatório de Acidente",
      category: "Modelos",
      description: "Formulário para registo de acidentes de trabalho",
      fileType: "DOCX",
      downloadCount: 98,
      updatedDate: "2025-10-10",
    },
    {
      id: "6",
      title: "Checklist de Conformidade IGT",
      category: "Checklists",
      description: "Lista de verificação para conformidade com IGT",
      fileType: "PDF",
      downloadCount: 267,
      updatedDate: "2025-10-15",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<"Todos" | "Legislação" | "Modelos" | "Checklists" | "Guias">("Todos");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-center py-10">A carregar...</div>;
  }

  const filteredItems = selectedCategory === "Todos" 
    ? items 
    : items.filter((item) => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Legislação":
        return "bg-blue-100 text-blue-800";
      case "Modelos":
        return "bg-purple-100 text-purple-800";
      case "Checklists":
        return "bg-green-100 text-green-800";
      case "Guias":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return "📄";
      case "DOCX":
        return "📝";
      case "XLSX":
        return "📊";
      default:
        return "📎";
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Biblioteca</h1>
        <p className="text-gray-600 mt-1">Documentos, modelos, checklists e legislação</p>
      </div>

      {/* Filtros por Categoria */}
      <div className="flex gap-2 flex-wrap">
        {["Todos", "Legislação", "Modelos", "Checklists", "Guias"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resumo de Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Legislação</p>
          <p className="text-2xl font-bold text-blue-700">
            {items.filter((i) => i.category === "Legislação").length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-600 font-medium">Modelos</p>
          <p className="text-2xl font-bold text-purple-700">
            {items.filter((i) => i.category === "Modelos").length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Checklists</p>
          <p className="text-2xl font-bold text-green-700">
            {items.filter((i) => i.category === "Checklists").length}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-600 font-medium">Guias</p>
          <p className="text-2xl font-bold text-orange-700">
            {items.filter((i) => i.category === "Guias").length}
          </p>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{getFileIcon(item.fileType)}</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{item.description}</p>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>{item.fileType}</span>
              <span>📥 {item.downloadCount} downloads</span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium text-sm transition-colors">
                Descarregar
              </button>
              <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded font-medium text-sm hover:bg-gray-50 transition-colors">
                Pré-visualizar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem se não houver documentos */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">Nenhum documento encontrado nesta categoria</p>
        </div>
      )}
    </div>
  );
}
