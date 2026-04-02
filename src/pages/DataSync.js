import React, { useState } from "react";
import pako from "pako";

export default function DataSync() {
  const [exportText, setExportText] = useState("");
  const [importText, setImportText] = useState("");

  const handleExport = () => {
    try {
      const scoutingData = JSON.parse(
        localStorage.getItem("scoutingData") || "[]"
      );

      const compressed = pako.deflate(JSON.stringify(scoutingData));
      const encoded = btoa(String.fromCharCode(...compressed));

      setExportText(encoded);
    } catch (err) {
      alert("Export failed");
    }
  };

  const handleImport = () => {
    try {
      const binary = atob(importText.trim());
      const bytes = new Uint8Array(
        [...binary].map((c) => c.charCodeAt(0))
      );

      const decompressed = pako.inflate(bytes, { to: "string" });
      const incoming = JSON.parse(decompressed);

      const existing = JSON.parse(
        localStorage.getItem("scoutingData") || "[]"
      );

      const merged = [...existing];

      incoming.forEach((entry) => {
        const exists = merged.some(
          (e) =>
            e.team === entry.team &&
            e.matchNumber === entry.matchNumber
        );

        if (!exists) merged.push(entry);
      });

      localStorage.setItem("scoutingData", JSON.stringify(merged));

      alert("Import successful");
    } catch (err) {
      alert("Import failed");
    }
  };

  return (
    <div>
      <h1>Scout Data Sync</h1>

      <button onClick={handleExport}>
        Export
      </button>

      {exportText && (
        <textarea value={exportText} readOnly />
      )}

      <textarea
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
      />

      <button onClick={handleImport}>
        Import
      </button>
    </div>
  );
}
