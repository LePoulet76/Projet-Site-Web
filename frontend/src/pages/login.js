import React, { useState } from "react";
import { Link } from "react-router-dom";//pour utiliser les balises Link
import axios from "axios";//pour faire des requetes au serveur.js
import { useInfoJoueur } from './InfoJoueurContext';//pour avoir accès aux infos du joueur
import { useNavigate } from "react-router-dom"; // pour gérer le changement de page auto 

//connection et inscription sont très similaire car la logique est quasiment la même
export default function Login() {
    //on créer les variable qui vont stocker l'email le mdp si il y a une erreur et si le formulaire est en cours d'envoi
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pseudo, setPseudo] = useState('');
    const navigate = useNavigate();
    const {connecterJoueur} = useInfoJoueur();
    //evite de recharger la page par defaut + vérifie que les champs sont remplis
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if(email === '' || password === '' || pseudo ===''){
            setError('Veuillez remplir tous les champs');
            return;
        }
        
        setIsSubmitting(true);
        try{
           
            const answer = await axios.post("http://localhost:3001/api/login",{email,password});//envoie une requete au serveur.js pour vérifier que l'utilisateur existe pour pouvoir se connecter 
            const{token,user} = answer.data;
            connecterJoueur(user,token);
            alert("Connection avec succès");
            navigate('/');//on retourne à la page d'accueil 
        }
        catch{
            setError(error.reponse?.data?.error||"Erreur Serveur");//erreur le compte n'existe pas
        }finally{
            setIsSubmitting(false);
        }
    };
    return (//mise en page 
        <div
      className="min-h-screen w-full flex flex-col bg-cover bg-center overflow-hidden justify-center items-center"
      style={{
        backgroundImage:
          'url("https://i.postimg.cc/Cxsv37Bv/Sans-titre-3-20260114234428.png")',
 }}
    >
        
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
            <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
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
            <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition mb-4">Se connecter</button>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <p className="text-center text-gray-700 mb-2">Pas de compte ? <Link to ="/inscription" className="text-blue-600 hover:underline">Créer un compte</Link></p>
            <p className="text-center text-gray-700"><Link to = "/forgotpassword" className="text-blue-600 hover:underline">Mot de passe oublié</Link></p>
        </form>
        </div>
    );
}
   
