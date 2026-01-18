import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";//pour pouvoir naviguer entre les pages
import axios from "axios";//pour pouvoir appeler des fonctions dans le serveur.js
import { Link } from "react-router-dom";//permet d'utiliser les balises link


export default function ChangingPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // On récupère l'email passé depuis la page précédente si il l'a rentré avant
    const [email] = useState(location.state?.email || '');
    const [code, setCode] = useState('');//stock le code à 4 chiffres qui a été tapé par le joueur dans la page d'avant
    const [newPassword, setNewPassword] = useState('');//garde le nouveau mot de passe 
    const [error, setError] = useState('');//permet de mettre une erreur si le code est pas celui envoyé par mail 

    const handleReset = async (e) => {//evite que la page se recharge complètement et que l'on perde les informations
        e.preventDefault();
        try {
            // Cette route devra être créée dans server.js
            await axios.post("http://localhost:3001/api/reset-password-code", {
                email,
                code,
                newPassword
            });//requete au serveur pour pouvoir changer le mot de passe envoyant l'email le code envoyé par mail et le nouveau mot de passe 
            alert("Mot de passe modifié avec succès !");
            navigate('/login');//retourne à la page se connecter
        } catch (err) {
            setError(err.response?.data?.error || "Code invalide ou expiré.");//si le code est mauvais ou expiré (pas précisé lequel des deux pour des raisons de sécurité)
        }
    };

    return (//mise en page
        <div className="min-h-screen w-full flex flex-col bg-cover bg-center overflow-hidden justify-center items-center" style={{
            backgroundImage: 'url("https://i.postimg.cc/Cxsv37Bv/Sans-titre-3-20260114234428.png")',
        }}>
        <form onSubmit={handleReset} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h1 className="text-2xl font-bold text-center mb-4">Réinitialisation</h1>
            <p className="text-center text-gray-700 mb-6">Email : <strong>{email}</strong></p>
            
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Code à 4 chiffres :</label>
                <input 
                    type="text" 
                    maxLength="4" 
                    onChange={(e) => setCode(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Nouveau mot de passe :</label>
                <input 
                    type="password" 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition mb-4">Valider le changement</button>
            {error && <p className="text-red-500 text-center">{error}</p>}
              <p className="text-center"><Link to="/" className="text-blue-600 hover:underline">Annuler</Link></p>
        </form>
      
        </div>
    );
}
