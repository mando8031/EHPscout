import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";
import pako from "pako";

export default function DataSync() {

  const [chunks, setChunks] = useState([]);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [received, setReceived] = useState({});

  const scannerRef = useRef(null);
  const isStoppingRef = useRef(false);

  // 📤 GENERATE QR
  const handleGenerateQR = () => {
    const rawData = JSON.parse(localStorage.getItem("scoutingData") || "[]");

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

  const startScanner = () => {
    setScanning(true);
  };

  useEffect(() => {
    if (!scanning) return;

    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

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

              try {
                const compressedFull = Object.keys(updated)
                  .sort((a, b) => a - b)
                  .map(i => updated[i])
                  .join("");

                const binary = Uint8Array.from(
                  atob(compressedFull),
                  c => c.charCodeAt(0)
                );

                const decompressed = pako.inflate(binary, { to: "string" });

                const importedShort = JSON.parse(decompressed);

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

                const map = {};
                [...existing, ...imported].forEach(entry => {
                  const key = `${entry.team}-${entry.matchNumber}`;
                  map[key] = entry;
                });

                localStorage.setItem("scoutingData", JSON.stringify(Object.values(map)));

                alert("Data imported!");

              } catch (err) {
                console.error("Processing error:", err);
              }

              // ✅ SAFE STOP
              safeStopScanner();
            }

            return updated;
          });

        } catch (err) {
          console.error("Scan error:", err);
        }
      }
    );

    return () => {
      safeStopScanner();
    };

  }, [scanning]);

  // 🔥 SAFE STOP FUNCTION
  const safeStopScanner = () => {

    if (isStoppingRef.current) return;

    isStoppingRef.current = true;

    const scanner = scannerRef.current;

    if (!scanner) return;

    scanner.stop()
      .then(() => {
        scanner.clear();
        setScanning(false);
        setReceived({});
      })
      .catch(() => {
        // Ignore stop errors completely
      })
      .finally(() => {
        isStoppingRef.current = false;
      });
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>QR Sync</h1>

      <button onClick={handleGenerateQR} style={{ width: "100%", padding: "15px" }}>
        Generate QR
      </button>

      {chunks.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <QRCode value={chunks[currentChunk]} size={250} />
          <p>{currentChunk + 1} / {chunks.length}</p>
        </div>
      )}

      {!scanning && (
        <button onClick={startScanner} style={{ width: "100%", padding: "15px", marginTop: "20px" }}>
          Scan QR
        </button>
      )}

      {scanning && (
        <div>
          <div id="reader" style={{ marginTop: "20px" }} />
          <p>Chunks: {Object.keys(received).length}</p>
        </div>
      )}
    </div>
  );
}
