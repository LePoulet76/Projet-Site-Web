import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
/*
nom database : blindtest
table1 : anime (contient id(clef primaire), auteur , anime, name_song)
table2 : serie (contient id(clef primaire), auteur , serie, name_song)
table3 : film (contient id(clef primaire), auteur , film, name_song)
table4 : users (contient id(clef primaire), username, password, email)

utilisateur distant : lepoulet, mdp : Art1307PezBel# : ip du serveur : 49.13.235.112
utilisateur local : site, mdp : tableauDeTChicken123#

port sql : 3306


*/

export default function Login() {
    //on créer les variable qui vont stocker l'email le mdp si il y a une erreur et si le formulaire est en cours d'envoi
    const[email,setEmail] = useState('');
    const[password,setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
     const [pseudo, setPseudo] = useState('');
    //evite de recharger la page par defaut + vérifie que les champs sont remplis
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(email === '' || password === '' || pseudo ===''){
            setError('Veuillez remplir tous les champs');
            return;
        }
        
        setIsSubmitting(true);
        axios.post();
        try{
            //ici on changera le post quand on fera tourner tout ca sur le serveur 
            const answer = await axios.post("http://localhost:3001/api/login",{email,password});
            alert("Connection avec succès");
        }
        catch{
            setError(error.reponse?.data?.error||"Erreur Serveur");
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label htmlFor = "email"> Email :</label>
            <input type = "email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required />
            <input htmlFor = "pseudo">Pseudo :</input>
            <label type = "text" id="pseudo" name ="pseudo" onChange={(e) => setPseudo(e.target.value)} required />
            <label htmlFor  ="password"> Mot de passe :</label>
            <input type="password" id="password" name="password" size = "20"  onChange={(e) => setPassword(e.target.value)}  required />
            <button type="submit">Se connecter</button>
            {error && <p className="error">{error}</p>}
            <p>Pas de compte ?<Link to ="/inscription">Créer un compte</Link> </p>
            <p><Link to = "/forgotpassword">Mot de passe oublié</Link></p>
        </form>
    );
}
   