import React, { useState } from "react";
import pako from "pako";

export default function DataSync() {

  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");

  // 📤 EXPORT DATA
  const handleExport = () => {

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

    setExportText(compressed);
  };

  // 📥 IMPORT DATA
  const handleImport = () => {

    try {
      const binary = Uint8Array.from(
        atob(importText),
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

      const merged = Object.values(map);

      localStorage.setItem("scoutingData", JSON.stringify(merged));

      alert("Data imported successfully!");

      setImportText("");

    } catch (err) {
      console.error(err);
      alert("Invalid data");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Data Sync</h1>

      {/* EXPORT */}
      <button
        onClick={handleExport}
        style={{ width: "100%", padding: "15px", marginBottom: "10px" }}
      >
        Generate Export Code
      </button>

      {exportText && (
        <textarea
          value={exportText}
          readOnly
          style={{ width: "100%", height: "150px", marginBottom: "20px" }}
        />
      )}

      {/* IMPORT */}
      <textarea
        placeholder="Paste data here..."
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
        style={{ width: "100%", height: "150px", marginBottom: "10px" }}
      />

      <button
        onClick={handleImport}
        style={{ width: "100%", padding: "15px" }}
      >
        Import Data
      </button>
    </div>
  );
}
