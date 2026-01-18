//ici qu'on va pouvoir recupérer les infos du joueur (token , email , pseudo etc.. ) pour pouvoir les utiliser dans d'autre pages
import React, { createContext, useContext, useState, useEffect } from 'react';
const InfoJoueurContext = createContext();//créer une variable qui contiendra toutes les infos du joueur 
export const useInfoJoueur = () => useContext(InfoJoueurContext);// permet de pouvoir écrire  useInfoJoueur au lieu de useContext(InfoJoueurContext) à chaque fois
export const InfoJoueurProvider = ({children}) =>{
    const [token, setToken] = useState(sessionStorage.getItem('userToken'));//on créer un token de sécurité
    
    const [joueur, setJoueur] = useState(() => {//on initialise le joueur 
        const savedJoueur = sessionStorage.getItem('userInfo');
        return savedJoueur ? JSON.parse(savedJoueur) : null;
    });
    
    const[isLoading, setIsLoading] = useState(true);//on initialise le fait que le joueur soit connecté
    
    const connecterJoueur = (joueurData, joueurToken)=>{//enregistre les infos dans la mémoire du navigateur (setItem) et met à jour l'affichage 
        sessionStorage.setItem('userToken',joueurToken);
        setToken(joueurToken);
        sessionStorage.setItem('userInfo',JSON.stringify(joueurData));
        setJoueur(joueurData);
    };
    const deconnecterJoueur = ()=>{//vide la mémoire et remet tout à null
        sessionStorage.removeItem('userToken');
        setToken(null);
        setJoueur(null);
    };
    useEffect(()=>{
        setIsLoading(false);
    },[token]);
    const contextValue ={//toutes les informations que l'on veut récupérer 
        joueur,
        token,
        isLoading,
        connecterJoueur,
        deconnecterJoueur
    };
    return(//renvoie ces informations
        <InfoJoueurContext.Provider value = {contextValue}>
            {children}
        </InfoJoueurContext.Provider> 
    );

};
