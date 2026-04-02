import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";
import pako from "pako";

export default function DataSync() {

  const [chunks, setChunks] = useState([]);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [received, setReceived] = useState({});

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

    console.log("Generated chunks:", wrapped.length);

    setChunks(wrapped);
    setCurrentChunk(0);
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

        console.log("Scanned chunk:", decodedText);

        try {
          const parsed = JSON.parse(decodedText);

          if (parsed.i === undefined) return;

          setReceived(prev => {

            if (prev[parsed.i]) return prev;

            const updated = { ...prev, [parsed.i]: parsed.d };
            const total = parsed.t;

            console.log("Chunks received:", Object.keys(updated).length, "/", total);

            if (Object.keys(updated).length === total) {

              try {
                // 🔗 REASSEMBLE
                const compressedFull = Object.keys(updated)
                  .sort((a, b) => a - b)
                  .map(i => updated[i])
                  .join("");

                console.log("Reassembled length:", compressedFull.length);

                // 🔥 DECOMPRESS
                const binary = Uint8Array.from(
                  atob(compressedFull),
                  c => c.charCodeAt(0)
                );

                const decompressed = pako.inflate(binary, { to: "string" });

                console.log("Decompressed string:", decompressed);

                const importedShort = JSON.parse(decompressed);

                if (!Array.isArray(importedShort)) {
                  throw new Error("Imported data is not an array");
                }

                // ✅ SAFE EXPAND
                const imported = importedShort.map(e => ({
                  team: e.t ?? null,
                  matchNumber: e.m ?? null,
                  auton: e.a ?? 0,
                  accuracy: e.ac ?? 0,
                  climb: e.c ?? "none",
                  movement: e.mv ?? 0,
                  intake: e.i ?? 0
                }));

                console.log("Expanded data:", imported);

                const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");

                const map = {};
                [...existing, ...imported].forEach(entry => {
                  if (!entry.team || !entry.matchNumber) return;

                  const key = `${entry.team}-${entry.matchNumber}`;
                  map[key] = entry;
                });

                const merged = Object.values(map);

                console.log("Final merged data:", merged);

                localStorage.setItem("scoutingData", JSON.stringify(merged));

                alert("Data imported successfully!");

                html5QrCode.stop();
                setScanning(false);
                setReceived({});

              } catch (innerErr) {
                console.error("FINAL PROCESSING ERROR:", innerErr);
                alert("Import failed — check console");
              }
            }

            return updated;
          });

        } catch (err) {
          console.error("SCAN ERROR:", err);
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
      <h1>QR Sync (Debug Mode)</h1>

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
