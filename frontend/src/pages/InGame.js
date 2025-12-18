import React, { useEffect, useState } from "react";
import Waveform from "../components/Waveform";
import Tchat from "../components/Tchat";
import { socket } from "../socket";
/*import Scoreboard from "../components/ScoreBoard";*/
/*import Player from  ".../backend/classes/Player";*/

export default function GamepPage() {
  
  return (
    <div className="p-6 max-w-md mx-auto">
      <Tchat socket={socket} />
      {/*<Scoreboard players={players} />*/}
      <Waveform audioUrl="/content/musics/anime/SAO.mp3" /> 
    </div>
  );
}
