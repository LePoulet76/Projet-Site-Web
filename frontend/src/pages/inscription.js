import React, { useState } from "react";
import { Link } from "react-router-dom";//permet d'utiliser les balises link
import axios from "axios";//permet de faire des requetes au serveur.js
import { useNavigate } from "react-router-dom"; // pour gérer le changement de page auto 
import { useInfoJoueur } from './InfoJoueurContext';//pour pouvoir se connecter au context et donc pouvoir mettre les données du joueur en commun 


export default function Inscription() {
    //on créer les variable qui vont stocker l'email le mdp si il y a une erreur et si le formulaire est en cours d'envoi
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pseudo, setPseudo] = useState('');
    const navigate = useNavigate();//Pour pouvoir naviguer entre les pages
    const {connecterJoueur} = useInfoJoueur(); 
    //evite de recharger la page par defaut + vérifie que les champs sont remplis
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(email === '' || password === '' || pseudo ===''){
            setError('Veuillez remplir tous les champs');
            return;
        }
        
        setIsSubmitting(true);
        try{
            
            const answer = await axios.post("http://localhost:3001/api/register",{email,password,pseudo});//on envoie une requete au serveur pour pouvoir s'inscrire avec comme variable email le mdp et le pseudo
            const{token,user} = answer.data;
            connecterJoueur(user,token);
            alert("Compte créer avec succès");
            navigate('/');//on retourne à la page d'accueil 
        }
        catch(err){
            setError(err.response?.data?.error||"Erreur Serveur");
        }finally{
            setIsSubmitting(false);
        }
    };
    return (//mise en page
         <div
      className="relative min-h-screen w-full flex flex-col bg-cover bg-center overflow-hidden justify-center items-center"
      style={{
        backgroundImage:
          'url("https://i.postimg.cc/Cxsv37Bv/Sans-titre-3-20260114234428.png")',
 }}
    >
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
            <div className="mb-4">
                <label htmlFor = "email" className="block text-gray-700 font-semibold mb-2"> Email :</label>
                <input type = "email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            
            <div className="mb-4">
                <label htmlFor = "pseudo" className="block text-gray-700 font-semibold mb-2">Pseudo :</label>
                <input type = "text" id="pseudo" name ="pseudo" onChange={(e) => setPseudo(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            
            <div className="mb-6">
                <label htmlFor  ="password" className="block text-gray-700 font-semibold mb-2"> Mot de passe :</label>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}  required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition mb-4"> S'inscrire </button>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <p className="text-center text-gray-700"> Déjà un compte ? <Link to ="/login" className="text-blue-600 hover:underline"> Connectez-vous </Link> </p>
            
        </form>
        </div>
    );
}
