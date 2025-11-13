import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const Waveform = ({ audioUrl }) => {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let isCancelled = false;

    // Destroy any existing instance before creating a new one
    if (waveSurferRef.current) {
      try {
        waveSurferRef.current.destroy();
      } catch (err) {
        console.warn("WaveSurfer destroy (ignored):", err.message);
      }
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
    });

    waveSurferRef.current = ws;

    ws.on("ready", async () => {
      if (isCancelled) return;
      setIsReady(true);

      try {
        await ws.play(); // essaie de jouer automatiquement
      } catch (err) {
        console.warn("Lecture auto bloquée par le navigateur :", err.message);
      }
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

  return (
    <div style={{ width: "100%", maxWidth: 600, marginTop: 30 }}>
      <div ref={containerRef}></div>
      {!isReady && (
        <p style={{ textAlign: "center", color: "#666" }}>
          Chargement du son...
        </p>
      )}
    </div>
  );
};

export default Waveform;
