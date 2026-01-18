import  { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

// Composant Waveform pour afficher la forme d'onde et gérer la lecture audio, il n'est pas de nous, il a été adapté depuis internet pour correspondre à nos besoins.
const Waveform = ({ audioUrl, isPlaying }) => {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !audioUrl) return;
    setIsReady(false);
    containerRef.current.innerHTML = "";
    let isCancelled = false;
    
    // Destroy any existing instance before creating a new one
    if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
    }

    // Create new instance
    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "violet",
      progressColor: "#9013FE",
      cursorColor: "#fff",
      barWidth: 6,
      barRadius: 3,
      height: 120,
      responsive: true,
      hideScrollbar: true,
      backend: 'MediaElement',
    });

    waveSurferRef.current = ws;

    ws.on("ready", async () => {
      if (isCancelled) return;
      setIsReady(true);
    });

    ws.on("error", (err) => {
      console.warn("WaveSurfer error:", err);
    });

    // Load audio file safely
    try {
      ws.load(audioUrl);
    } catch (err) {
      console.warn("WaveSurfer load error:", err.message);
    }

    // Cleanup when unmounting or audioUrl changes
    return () => {
      isCancelled = true;

      if (waveSurferRef.current) {
        // Wait for WaveSurfer to finish any pending work
        try {
          waveSurferRef.current.unAll(); // remove listeners first
          waveSurferRef.current.destroy();
        } catch (err) {
          if (err.message !== "The operation was aborted.")
            console.warn("WaveSurfer cleanup error:", err.message);
        } finally {
          waveSurferRef.current = null;
        }
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    const ws = waveSurferRef.current;
    if (!ws) return;

    // Si le parent dit de jouer et que le son est prêt
    if (isPlaying && isReady) {
      ws.play().catch((err) => console.warn("Erreur lecture:", err.message));
    } else {
      // Sinon pause
      ws.pause();
    }
  }, [isPlaying, isReady]); // Se lance quand le statut change ou que le son est prêt

  return (
    <div style={{ width: "100%", maxWidth: 600, marginTop: 30 }}>
      <div ref={containerRef}></div>
      {!isReady && audioUrl && (
        <p style={{ textAlign: "center", color: "#666" }}>
          Chargement du son...
        </p>
      )}
    </div>
  );
};

export default Waveform;
