import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";
import pako from "pako";

export default function DataSync() {

  const [chunks, setChunks] = useState([]);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [received, setReceived] = useState({});

  // 📤 GENERATE QR
  const handleGenerateQR = () => {

    const rawData = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    // 🔥 CLEAN + SHORT KEYS
    const cleaned = rawData.map(e => ({
      t: e.team,
      m: e.matchNumber,
      a: e.auton,
      ac: e.accuracy,
      c: e.climb,
      mv: e.movement,
      i: e.intake
    }));

    const json = JSON.stringify(cleaned);

    // 🔥 COMPRESS
    const compressed = btoa(
      String.fromCharCode(...pako.deflate(json))
    );

    const CHUNK_SIZE = 1200;

    const parts = [];
    for (let i = 0; i < compressed.length; i += CHUNK_SIZE) {
      parts.push(compressed.slice(i, i + CHUNK_SIZE));
    }

    const wrapped = parts.map((chunk, index) => JSON.stringify({
      i: index,
      t: parts.length,
      d: chunk
    }));

    setChunks(wrapped);
    setCurrentChunk(0);
  };

  const nextQR = () => {
    if (currentChunk < chunks.length - 1) {
      setCurrentChunk(currentChunk + 1);
    }
  };

  const prevQR = () => {
    if (currentChunk > 0) {
      setCurrentChunk(currentChunk - 1);
    }
  };

  const startScanner = () => {
    setScanning(true);
  };

  useEffect(() => {
    if (!scanning) return;

    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {

        try {
          const parsed = JSON.parse(decodedText);

          if (parsed.i === undefined) return;

          setReceived(prev => {

            if (prev[parsed.i]) return prev;

            const updated = { ...prev, [parsed.i]: parsed.d };
            const total = parsed.t;

            if (Object.keys(updated).length === total) {

              // 🔗 REASSEMBLE
              const compressedFull = Object.keys(updated)
                .sort((a, b) => a - b)
                .map(i => updated[i])
                .join("");

              // 🔥 DECOMPRESS
              const binary = Uint8Array.from(
                atob(compressedFull),
                c => c.charCodeAt(0)
              );

              const decompressed = pako.inflate(binary, { to: "string" });

              const importedShort = JSON.parse(decompressed);

              // ✅ 🔥 FIX: EXPAND BACK TO FULL FORMAT
              const imported = importedShort.map(e => ({
                team: e.t,
                matchNumber: e.m,
                auton: e.a,
                accuracy: e.ac,
                climb: e.c,
                movement: e.mv,
                intake: e.i
              }));

              const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");

              // 🔥 MERGE WITHOUT DUPES
              const map = {};
              [...existing, ...imported].forEach(entry => {
                const key = `${entry.team}-${entry.matchNumber}`;
                map[key] = entry;
              });

              const merged = Object.values(map);

              localStorage.setItem("scoutingData", JSON.stringify(merged));

              alert("Full dataset merged!");

              html5QrCode.stop().then(() => {
                setScanning(false);
                setReceived({});
              });
            }

            return updated;
          });

        } catch (err) {
          console.error("Scan error:", err);
        }
      },
      () => {}
    );

    return () => {
      html5QrCode.stop().catch(() => {});
    };

  }, [scanning]);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>QR Sync (Optimized)</h1>

      <button
        onClick={handleGenerateQR}
        style={{ width: "100%", padding: "15px", marginBottom: "15px" }}
      >
        Generate QR
      </button>

      {chunks.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <QRCode value={chunks[currentChunk]} size={250} />

          <p>{currentChunk + 1} / {chunks.length}</p>

          <button onClick={prevQR}>⬅️</button>
          <button onClick={nextQR}>➡️</button>
        </div>
      )}

      {!scanning && (
        <button
          onClick={startScanner}
          style={{ width: "100%", padding: "15px", marginTop: "20px" }}
        >
          Scan QR
        </button>
      )}

      {scanning && (
        <div>
          <div id="reader" style={{ marginTop: "20px" }} />
          <p>Scanned: {Object.keys(received).length}</p>
        </div>
      )}
    </div>
  );
}
