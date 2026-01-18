import { useState, useEffect } from 'react';
import axios from 'axios';
import imageParDefaut from "../pages/pdp/default.png";//image pdp par default
export default function PDP({ pseudo, className }) {
    const [imageSrc, setImageSrc] = useState(imageParDefaut); // Par défaut, on met l'image locale

    useEffect(() => {
        const chargerPDP = async () => {
            if (!pseudo) return;
            try {
                // On demande au serveur
                const response = await axios.get(`http://localhost:3001/api/pdp/${pseudo}`); 
                if (response.data.pdp) {
                    setImageSrc(response.data.pdp);
                }
            } catch (err) {
                // En cas d'erreur serveur, on reste sur l'image par défaut
                console.log("Utilisation de l'image par défaut");
                setImageSrc(imageParDefaut);
            }
        };

        chargerPDP();
    }, [pseudo]);

    return (
        <img 
            src={imageSrc} 
            alt={pseudo} 
            className={className || "w-10 h-10 rounded-full object-cover"} 
        />
    );
}