//ici qu'on va pouvoir recup les infos du joeur (token , email , pseudo etc.. )
import React, { createContext, useContext, useState, useEffect } from 'react';
const InfoJoueurContext = createContext();
export const useInfoJoueur = () => useContext(InfoJoueurContext);// permet de pouvoir écrire  useInfoJoueur au lieu de useContext(InfoJoueurContext) à cahque fois
export const InfoJoueurProvider = ({children}) =>{
    const [token, setToken] = useState(sessionStorage.getItem('userToken'));//on recup le token 
    
    const [joueur, setJoueur] = useState(() => {
        const savedJoueur = sessionStorage.getItem('userInfo');
        return savedJoueur ? JSON.parse(savedJoueur) : null;
    });
    
    const[isLoading, setIsLoading] = useState(true);//on initialise le fait que le joueur soit co
    
    const connecterJoueur = (joueurData, joueurToken)=>{
        sessionStorage.setItem('userToken',joueurToken);
        setToken(joueurToken);
        sessionStorage.setItem('userInfo',JSON.stringify(joueurData));
        setJoueur(joueurData);
    };
    const deconnecterJoueur = ()=>{
        sessionStorage.removeItem('userToken');
        setToken(null);
        setJoueur(null);
    };
    useEffect(()=>{
        setIsLoading(false);
    },[token]);
    const contextValue ={
        joueur,
        token,
        isLoading,
        connecterJoueur,
        deconnecterJoueur
    };
    return(
        <InfoJoueurContext.Provider value = {contextValue}>
            {children}
        </InfoJoueurContext.Provider> 
    );

};

















