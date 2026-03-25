import React from "react";

export default function DataSync() {

  // EXPORT
  const handleExport = () => {
    const data = localStorage.getItem("scoutingData") || "[]";

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "scouting-data.json";
    a.click();
  };

  // IMPORT + MERGE
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);

        const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");

        // MERGE BY ID
        const map = {};

        [...existing, ...imported].forEach(entry => {
          map[entry.id] = entry;
        });

        const merged = Object.values(map);

        localStorage.setItem("scoutingData", JSON.stringify(merged));

        alert("Data merged successfully!");
      } catch (err) {
        console.error(err);
        alert("Invalid file");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Offline Sync</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleExport}
          style={{
            width: "100%",
            padding: "15px",
            marginBottom: "10px"
          }}
        >
          Export Data
        </button>

        <input
          type="file"
          accept="application/json"
          onChange={handleImport}
          style={{ width: "100%" }}
        />
      </div>

      <p>
        Export your data and share it with other scouts.  
        Import their files to merge data together.
      </p>
    </div>
  );
}
