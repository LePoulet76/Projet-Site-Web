import React, { useState } from "react";
import { Link } from "react-router-dom";//pour utiliser les balises link
import axios from "axios";//pour faire des requetes au serveur.js
import { useNavigate } from "react-router-dom"; // pour gérer le changement de page auto 
import { useInfoJoueur } from './InfoJoueurContext';//pour pouvoir se connecter au context et donc pouvoir mettre les données du joueur en commun 
import PDP from "../components/Pdp";//pour utiliser le component Pdp pour gérer les photos de profil -> il ne sera finallement pas utlisé 
export default function Profil() {
    const { joueur, deconnecterJoueur } = useInfoJoueur();//déclare un joueur 
    const navigate = useNavigate();//pour pouvoir naviguer entre les pages
    if (!joueur) //affichage différent selon si le joueur est déjà connecté si il est pas connecté on affiche qu'il faut se connecter plus un lien vers la page de connection sinon on affiche le pseudo et l'email et un lien pour se déconnecter et pour retourner sur la page d'accueil  
        return (
         <div
      className="relative min-h-screen w-full flex flex-col bg-cover bg-center overflow-hidden justify-center items-center"
      style={{
        backgroundImage:
          'url("https://i.postimg.cc/Cxsv37Bv/Sans-titre-3-20260114234428.png")',
 }}
    >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h1 className="text-2xl font-bold mb-4">Vous n'êtes pas connecté</h1>
            <Link to="/login" className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">Aller à la page de connexion</Link>
        </div>
        </div>
        );
    const handleDeconnexion = () => {//on gère la deconnextion 
        deconnecterJoueur();
        alert("Déconnexion réussie");
        navigate('/');//on retourne à la page d'accueil 
        
    };
    return (
        <div
      className="relative min-h-screen w-full flex flex-col bg-cover bg-center overflow-hidden justify-center items-center"
      style={{
        backgroundImage:
          'url("https://i.postimg.cc/Cxsv37Bv/Sans-titre-3-20260114234428.png")',
 }}
    >
        
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="profil" className="h-24 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Profil de {joueur?.username || "Utilisateur"}</h1>
            <p className="text-gray-700 mb-6">Email : {joueur.email||"email"}</p>
            <button onClick={handleDeconnexion} className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition">Se déconnecter</button>
            <Link to="/" className="block mt-4 text-blue-600 hover:underline">Revenir au menu principal</Link>
        </div>
        </div>
    );

}
