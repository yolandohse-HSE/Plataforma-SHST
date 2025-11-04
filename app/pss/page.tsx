"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PSS {
  id: string;
  projectName: string;
  version: string;
  status: "Draft" | "Desenvolvimento" | "Final";
  createdDate: string;
  lastUpdated: string;
  createdBy: string;
  chapters: number;
  completeness: number;
}

export default function PSSPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pssDocuments, setPSSDocuments] = useState<PSS[]>([
    {
      id: "1",
      projectName: "Obra Kilamba - Reabilitação",
      version: "1.0",
      status: "Desenvolvimento",
      createdDate: "2025-10-01",
      lastUpdated: "2025-10-26",
      createdBy: "João Silva",
      chapters: 8,
      completeness: 65,
    },
    {
      id: "2",
      projectName: "Instalação Solar - Talatona",
      version: "1.0",
      status: "Draft",
      createdDate: "2025-10-15",
      lastUpdated: "2025-10-25",
      createdBy: "Maria Santos",
      chapters: 0,
      completeness: 0,
    },
  ]);

  const [showElaborationForm, setShowElaborationForm] = useState(false);
  const [showDevelopmentView, setShowDevelopmentView] = useState(false);
  const [selectedPSS, setSelectedPSS] = useState<PSS | null>(null);
  const [elaborationData, setElaborationData] = useState({
    projectName: "",
    projectType: "Reabilitação",
    location: "",
    contractor: "",
    startDate: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="text-center py-10">A carregar...</div>;
  }

  const handleElaborate = () => {
    if (!elaborationData.projectName || !elaborationData.startDate) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const newPSS: PSS = {
      id: Date.now().toString(),
      projectName: elaborationData.projectName,
      version: "1.0",
      status: "Draft",
      createdDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      createdBy: session?.user?.name || "Utilizador",
      chapters: 0,
      completeness: 0,
    };

    setPSSDocuments([...pssDocuments, newPSS]);
    setShowElaborationForm(false);
    setElaborationData({
      projectName: "",
      projectType: "Reabilitação",
      location: "",
      contractor: "",
      startDate: "",
    });

    alert("PSS elaborado com sucesso! Pode agora iniciar o desenvolvimento.");
  };

  const handleStartDevelopment = (pss: PSS) => {
    setSelectedPSS(pss);
    setShowDevelopmentView(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Desenvolvimento":
        return "bg-blue-100 text-blue-800";
      case "Final":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plano de Segurança e Saúde (PSS)</h1>
          <p className="text-gray-600 mt-1">Elaboração, desenvolvimento e atualização de PSS</p>
        </div>
        <button
          onClick={() => setShowElaborationForm(true)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          + Elaborar Novo PSS
        </button>
      </div>

      {/* Abas de Fluxo */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex gap-4 border-b border-gray-200">
          <button className="px-4 py-2 text-green-600 border-b-2 border-green-600 font-medium">
            Elaboração
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
            Desenvolvimento (DPSS)
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
            Atualização
          </button>
        </div>
      </div>

      {/* Resumo de PSS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 font-medium">Drafts</p>
          <p className="text-2xl font-bold text-gray-700">
            {pssDocuments.filter((p) => p.status === "Draft").length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Em Desenvolvimento</p>
          <p className="text-2xl font-bold text-blue-700">
            {pssDocuments.filter((p) => p.status === "Desenvolvimento").length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Finalizados</p>
          <p className="text-2xl font-bold text-green-700">
            {pssDocuments.filter((p) => p.status === "Final").length}
          </p>
        </div>
      </div>

      {/* Lista de PSS */}
      <div className="grid grid-cols-1 gap-4">
        {pssDocuments.map((pss) => (
          <div key={pss.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{pss.projectName}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Versão {pss.version} • Criado por {pss.createdBy} em {pss.createdDate}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(pss.status)}`}>
                {pss.status}
              </span>
            </div>

            {/* Barra de Progresso */}
            {pss.status !== "Draft" && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Progresso de Desenvolvimento</p>
                  <p className="text-sm font-semibold text-gray-900">{pss.completeness}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${pss.completeness}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {pss.chapters > 0 && <span>{pss.chapters} capítulos • </span>}
                <span>Atualizado em {pss.lastUpdated}</span>
              </div>
              <div className="flex gap-2">
                {pss.status === "Draft" && (
                  <button
                    onClick={() => handleStartDevelopment(pss)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors"
                  >
                    Iniciar Desenvolvimento
                  </button>
                )}
                {pss.status === "Desenvolvimento" && (
                  <button
                    onClick={() => handleStartDevelopment(pss)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors"
                  >
                    Continuar Desenvolvimento
                  </button>
                )}
                {pss.status === "Final" && (
                  <button
                    onClick={() => handleStartDevelopment(pss)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium text-sm transition-colors"
                  >
                    Criar Atualização
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium text-sm hover:bg-gray-50 transition-colors">
                  Visualizar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulário de Elaboração Modal */}
      {showElaborationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Elaborar Novo PSS</h2>
            <p className="text-gray-600 mb-6">
              Preencha os dados do projeto para gerar um PSS inicial (Draft).
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Projeto *
                </label>
                <input
                  type="text"
                  value={elaborationData.projectName}
                  onChange={(e) => setElaborationData({ ...elaborationData, projectName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="Ex: Obra Kilamba - Reabilitação"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Obra
                  </label>
                  <select
                    value={elaborationData.projectType}
                    onChange={(e) => setElaborationData({ ...elaborationData, projectType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option>Reabilitação</option>
                    <option>Nova Construção</option>
                    <option>Instalações Solares</option>
                    <option>Infraestruturas</option>
                    <option>Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={elaborationData.location}
                    onChange={(e) => setElaborationData({ ...elaborationData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Ex: Luanda, Kilamba"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa Contratada
                  </label>
                  <input
                    type="text"
                    value={elaborationData.contractor}
                    onChange={(e) => setElaborationData({ ...elaborationData, contractor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Ex: Construtora ABC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    value={elaborationData.startDate}
                    onChange={(e) => setElaborationData({ ...elaborationData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowElaborationForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleElaborate}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Gerar PSS (Draft)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vista de Desenvolvimento Modal */}
      {showDevelopmentView && selectedPSS && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedPSS.projectName}</h2>
                <p className="text-sm text-gray-600">Desenvolvimento de PSS - Versão {selectedPSS.version}</p>
              </div>
              <button
                onClick={() => setShowDevelopmentView(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Capítulos do PSS */}
            <div className="space-y-4">
              {[
                "1. Identificação da Obra",
                "2. Análise de Riscos",
                "3. Medidas de Prevenção",
                "4. Organização da Segurança",
                "5. Formação e Informação",
                "6. Coordenação de Atividades",
                "7. Documentação e Registos",
                "8. Plano de Emergência",
              ].map((chapter, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{chapter}</h3>
                      <p className="text-sm text-gray-600 mt-1">Clique para editar conteúdo e adicionar evidências</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDevelopmentView(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Fechar
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                Finalizar PSS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
