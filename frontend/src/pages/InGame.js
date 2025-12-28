import Waveform from "../components/Waveform";
import ChatComponent from "../components/Tchat";
import { socket } from "../socket";
import ScoreBoard from "../components/ScoreBoard";


export default function InGame() {

  return (
     <div className="flex h-screen w-screen bg-[#eac7c0]">
      {/* Left sidebar */}
      
    <div className="flex flex-col h-screen w-screen bg-[#eac7c0]">
      {/* HEADER FIXED EN HAUT */}
      <div className="w-full h-14 bg-[#4b4cc5] flex items-center px-4 text-white text-xl font-bold">
        Blindtest.io
      </div>

      {/* CONTENU SOUS LE HEADER */}
      <div className="flex-1 flex flex-row items-center justify-start p-6 gap-6 overflow-y-auto">
      <div className="flex flex-col items-center gap-6 mt-10">
          <div className="rotate-90 w-12 h-20 bg-[#8c6558] rounded-full" />

          <div className="w-16 h-16 bg-[#e88a79] rounded" />
          <div className="w-16 h-16 bg-[#e88a79] rounded" />
          <div className="w-16 h-16 bg-[#e88a79] rounded" />
        </div> 

      <div className="flex-1 flex flex-col items-center justify-start p-6 gap-6 overflow-y-auto">
        {/* Top avatars + squares */}
        <ScoreBoard players={[]} socket={socket} />
        <ChatComponent socket={socket}/>
        <Waveform audioUrl="/content/musics/anime/LISA,adamas.mp3" />
      </div>
       </div>
      {/* BARRE EN BAS */}
      <div className="w-full h-10 bg-[#4b4cc5] flex items-center justify-center text-white text-sm">
        © 2025 Blindtest.io
      </div>
    </div>
    </div>
  );
}
