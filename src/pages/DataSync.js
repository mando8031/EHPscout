import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";

export default function DataSync() {

  const [chunks, setChunks] = useState([]);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [received, setReceived] = useState({});

  // 📤 SPLIT DATA INTO CHUNKS
  const handleGenerateQR = () => {
    const data = localStorage.getItem("scoutingData") || "[]";

    const CHUNK_SIZE = 800; // safe QR size

    const parts = [];
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      parts.push(data.slice(i, i + CHUNK_SIZE));
    }

    // wrap with metadata
    const wrapped = parts.map((chunk, index) => JSON.stringify({
      index,
      total: parts.length,
      data: chunk
    }));

    setChunks(wrapped);
    setCurrentChunk(0);
  };

  // ➡️ NEXT QR
  const nextQR = () => {
    if (currentChunk < chunks.length - 1) {
      setCurrentChunk(currentChunk + 1);
    }
  };

  // ⬅️ PREV QR
  const prevQR = () => {
    if (currentChunk > 0) {
      setCurrentChunk(currentChunk - 1);
    }
  };

  // 📥 START SCANNER
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

          if (parsed.index === undefined) return;

          setReceived(prev => {
            if (prev[parsed.index]) return prev; // already scanned

            const updated = { ...prev, [parsed.index]: parsed.data };

            const total = parsed.total;

            // ✅ CHECK IF COMPLETE
            if (Object.keys(updated).length === total) {

              // 🔗 REASSEMBLE
              const fullString = Object.keys(updated)
                .sort((a, b) => a - b)
                .map(i => updated[i])
                .join("");

              const imported = JSON.parse(fullString);
              const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");

              const map = {};
              [...existing, ...imported].forEach(entry => {
                map[entry.id] = entry;
              });

              const merged = Object.values(map);

              localStorage.setItem("scoutingData", JSON.stringify(merged));

              alert("Full dataset merged!");

              html5QrCode.stop();
              setScanning(false);
              setReceived({});
            }

            return updated;
          });

        } catch (err) {
          console.error(err);
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
      <h1>QR Sync (Full Transfer)</h1>

      {/* EXPORT */}
      <button
        onClick={handleGenerateQR}
        style={{ width: "100%", padding: "15px", marginBottom: "15px" }}
      >
        Generate Multi QR
      </button>

      {chunks.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <QRCode value={chunks[currentChunk]} size={250} />

          <p>{currentChunk + 1} / {chunks.length}</p>

          <button onClick={prevQR} style={{ margin: "5px" }}>⬅️</button>
          <button onClick={nextQR} style={{ margin: "5px" }}>➡️</button>
        </div>
      )}

      {/* IMPORT */}
      {!scanning && (
        <button
          onClick={startScanner}
          style={{ width: "100%", padding: "15px", marginTop: "20px" }}
        >
          Scan Multi QR
        </button>
      )}

      {scanning && (
        <div>
          <div id="reader" style={{ marginTop: "20px" }} />
          <p style={{ marginTop: "10px" }}>
            Scanned: {Object.keys(received).length} chunks
          </p>
        </div>
      )}
    </div>
  );
}
