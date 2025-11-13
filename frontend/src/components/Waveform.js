import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const Waveform = ({ audioUrl }) => {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Si une instance existait déjà, on la détruit proprement
    if (waveSurferRef.current) {
      try {
        waveSurferRef.current.destroy();
      } catch (err) {
        console.warn("WaveSurfer destroy (ignored):", err.message);
      }
    }

    // Création de l’instance
    waveSurferRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "violet",
      progressColor: "linear-gradient(to right, #4A90E2, #9013FE)",
      cursorColor: "#fff",
      barWidth: 6,
      barRadius: 3,
      height: 120,
      responsive: true,
      hideScrollbar: true,
    });

    // Quand le son est prêt
    waveSurferRef.current.on("ready", () => {
      setIsReady(true);
    });

    // Charge ton fichier
    waveSurferRef.current.load(audioUrl);

    // Nettoyage quand on quitte la page
    return () => {
      if (waveSurferRef.current && waveSurferRef.current.destroy) {
        try {
          waveSurferRef.current.destroy();
          waveSurferRef.current = null;
        } catch (err) {
          console.warn("WaveSurfer cleanup error:", err.message);
        }
      }
    };
  }, [audioUrl]);

  return (
    <div style={{ width: "100%", maxWidth: 600, marginTop: 30 }}>
      <div ref={containerRef}></div>
      {!isReady && (
        <p style={{ textAlign: "center", color: "#666" }}>Chargement du son...</p>
      )}
    </div>
  );
};

export default Waveform;
