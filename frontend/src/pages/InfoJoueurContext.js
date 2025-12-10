//ici qu'on va pouvoir recup les infos du joeur (token , email , pseudo etc.. )
import React, { createContext, useContext, useState, useEffect } from 'react';
const InfoJoueurContext = createContext();
export const useInfoJoueur = () => useContext(InfoJoueurContext);// créer ce qui va permettre de lire et modifier l'etat du joueur*


















