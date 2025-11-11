import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Page d’accueil (emma au boulot)</h1>
      <Link
        to="/ingame"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Aller dans le chat
      </Link>
    </div>
  );
}
