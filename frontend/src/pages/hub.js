import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Creation du BlindTest</h1>
      <Link to="/ingame" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Ouvrir le blindtest au joueur</Link> 
    </div>
  );
}