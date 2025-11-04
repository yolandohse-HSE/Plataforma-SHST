"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/conformidade", label: "Conformidade IGT", icon: "📜" },
    { href: "/matriz-conformidade", label: "Matriz Interativa", icon: "📈" },
    { href: "/pss", label: "Plano de Segurança", icon: "🏗️" },
    { href: "/contratadas", label: "Contratadas", icon: "🤝" },
    { href: "/biblioteca", label: "Biblioteca", icon: "📚" },
    { href: "/perfil", label: "Perfil", icon: "👤" },
  ];

  return (
    <aside className={`${isOpen ? "w-64" : "w-20"} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {isOpen && <h1 className="text-xl font-bold">Global Safety</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-gray-800 rounded"
        >
          {isOpen ? "←" : "→"}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-green-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-gray-700">
        {isOpen && (
          <p className="text-xs text-gray-400 text-center">
            Global Safety © 2025
          </p>
        )}
      </div>
    </aside>
  );
}
