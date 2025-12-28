import { useParams } from "react-router-dom";
import React, { use, useState } from "react";

export default function Reponse() {
    const {Id} = useParams();
    const [reponse, setReponse] = useState();

    socket.emit("send_response", {lobbyId: Id, answer: reponse});
    setReponse("");
    return (
        <div className="p-10">
            <h1 className="text-2xl mb-4">Lobby : {id}</h1>
            
            <form onSubmit={envoyerReponse}>
                <input 
                    type="text" 
                    className="border p-2 rounded w-full"
                    placeholder="Devine le titre..."
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                />
                <button type="submit" className="mt-2 bg-green-500 text-white p-2 rounded">
                    Valider
                </button>
            </form>
        </div>
    );
}