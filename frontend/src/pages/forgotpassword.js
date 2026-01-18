import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; //permet d'utiliser les balises link et de naviguer entre les apges
import axios from "axios";//permet de faire des requetes au serveur

export default function ForgotPassword() {
    const [email, setEmail] = useState('');//on defini l'email vers lequel on va envoyer le mail avec le code de sécurité
    const [error, setError] = useState('');//permet de pouvoir mettre une erreur
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();//pour pouvoir naviguer entre les pages

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // On vide l'erreur précédente

        if (email === '') {//s'il n'y a pas d'email alors erreur
            setError('Veuillez entrer votre email');
            return;
        }   

        setIsSubmitting(true);
        
        try {
            // Vérifie que l'URL correspond bien à ta route backend
            await axios.post("http://localhost:3001/api/forgot-password", { email });//envoie une demande au serveur pour qu'il communique avec la bd.js
            
            alert("Un code de validation a été envoyé par email.");
            
            // On redirige vers la page où il va taper son code et son nouveau mdp
            navigate('/changingpassword', { state: { email } }); 
        }
        catch (err) {
            setError(err.response?.data?.error || "Erreur lors de l'envoi");
        } finally {
            setIsSubmitting(false);
        }   
    };

    return (//mise en page 
        <div className="min-h-screen w-full flex flex-col bg-cover bg-center overflow-hidden justify-center items-center" style={{
            backgroundImage: 'url("https://i.postimg.cc/Cxsv37Bv/Sans-titre-3-20260114234428.png")',
        }}>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h1 className="text-2xl font-bold text-center mb-2">Récupération de compte</h1>
            <p className="text-center text-gray-700 mb-6">Entrez votre email pour recevoir un code à 4 chiffres.</p>
            
            <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email :</label>   
                <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
            </div>
            
            <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition mb-4 disabled:opacity-50">
                {isSubmitting ? 'Envoi...' : 'Recevoir le code'}
            </button>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <p className="text-center text-gray-700">
                <Link to="/login" className="text-blue-600 hover:underline">Retour à la connexion</Link>
            </p>
        </form>
        </div>
    );
}
