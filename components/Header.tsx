"use client";

import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Plataforma SHST</h2>
        <p className="text-sm text-gray-600">Gestão de Segurança, Higiene e Saúde no Trabalho</p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Informações do Utilizador */}
        {session && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
              <p className="text-xs text-gray-600">{session.user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
              {session.user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Botão de Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
