import React, { useState, useEffect } from "react";

export default function AccountSettings() {

  const defaultSettings = {
    accuracy: 0.18,
    shootingSpeed: 0.18,
    intakeSpeed: 0.18,
    auton: 0.1,
    climb: 0.05,
    awareness: 0.1,
    focus: 0.1,
    robotType: 0.1,
    failurePenalty: 0.1,

    autonShoot: 0.25,
    autonCollectMiddle: 0.25,
    autonCollectDepot: 0.25,
    autonClimb: 0.25,

    focusScoring: 0.33,
    focusPassing: 0.33,
    focusDefense: 0.33,

    failureLostComm: 0.33,
    failureLostPower: 0.33,
    failureBrokenIntake: 0.33
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState({});
  const [selectedTeams, setSelectedTeams] = useState([]);

  // 🔥 LOAD
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    const savedPresets = JSON.parse(localStorage.getItem("scoringPresets")) || {};

    if (saved) setSettings({ ...defaultSettings, ...saved });
    setPresets(savedPresets);
  }, []);

  // 🔥 AUTOSAVE
  useEffect(() => {
    localStorage.setItem("scoringSettings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  // 🔥 NORMALIZE
  const normalizeGroup = (fields) => {
    let total = fields.reduce((sum, f) => sum + settings[f], 0);
    if (total === 0) total = 1;

    const updated = { ...settings };
    fields.forEach(f => {
      updated[f] = settings[f] / total;
    });

    setSettings(updated);
  };

  // 🔥 CALIBRATION (FULL)
  const calibrate = () => {
    const selectedEvent = localStorage.getItem("selectedEvent");
    if (!selectedEvent) return alert("Select event first");

    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]")
      .filter(d => d.event === selectedEvent);

    if (data.length === 0) return alert("No data");

    const grouped = {};
    data.forEach(e => {
      if (!grouped[e.team]) grouped[e.team] = [];
      grouped[e.team].push(e);
    });

    const teams = Object.keys(grouped).map(team => ({
      team,
      entries: grouped[team]
    }));

    const selectedSet = new Set(selectedTeams);
    const topTeams = teams.filter(t => selectedSet.has(t.team));
    const otherTeams = teams.filter(t => !selectedSet.has(t.team));

    if (topTeams.length === 0) return alert("Pick top teams");

    const avg = (entries, fn) =>
      entries.reduce((sum, e) => sum + fn(e), 0) / entries.length;

    const diff = (fn) => {
      const top = avg(topTeams.flatMap(t => t.entries), fn);
      const other = avg(otherTeams.flatMap(t => t.entries), fn);
      return Math.max(0.01, top - other);
    };

    let newSettings = { ...settings };

    // MAIN
    newSettings.accuracy = diff(e => Number(e.accuracy || 0));
    newSettings.shootingSpeed = diff(e => Number(e.shootingSpeed || 0));
    newSettings.intakeSpeed = diff(e => Number(e.intakeSpeed || 0));

    newSettings.awareness = diff(e =>
      e.awareness === "Yes" ? 1 : e.awareness === "Kind of Lost" ? 0.5 : 0
    );

    newSettings.climb = diff(e =>
      e.climb?.includes("L3") ? 1 :
      e.climb?.includes("L2") ? 0.7 :
      e.climb?.includes("L1") ? 0.4 : 0
    );

    newSettings.robotType = diff(e =>
      e.robotType?.includes("Custom") ? 1 :
      e.robotType?.includes("Kitbot") ? 0 : 0.5
    );

    // AUTON
    const autonMap = {
      autonShoot: "Shoot",
      autonCollectMiddle: "Collect Middle",
      autonCollectDepot: "Collect Depot",
      autonClimb: "Climb"
    };

    Object.entries(autonMap).forEach(([k, v]) => {
      newSettings[k] = diff(e => e.auton?.includes(v) ? 1 : 0);
    });

    // FOCUS
    const focusMap = {
      focusScoring: "Scoring",
      focusPassing: "Passing / Moving Balls",
      focusDefense: "Defense"
    };

    Object.entries(focusMap).forEach(([k, v]) => {
      newSettings[k] = diff(e => e.focus?.includes(v) ? 1 : 0);
    });

    // FAILURES (inverted)
    const failMap = {
      failureLostComm: "Lost Communication",
      failureLostPower: "Lost Power",
      failureBrokenIntake: "Broken Intake"
    };

    Object.entries(failMap).forEach(([k, v]) => {
      const d = diff(e => e.failures?.includes(v) ? 1 : 0);
      newSettings[k] = 1 / d;
    });

    // RECALC MAIN
    newSettings.auton =
      newSettings.autonShoot +
      newSettings.autonCollectMiddle +
      newSettings.autonCollectDepot +
      newSettings.autonClimb;

    newSettings.focus =
      newSettings.focusScoring +
      newSettings.focusPassing +
      newSettings.focusDefense;

    setSettings(newSettings);

    // normalize after
    setTimeout(() => {
      normalizeGroup([
        "accuracy","shootingSpeed","intakeSpeed",
        "auton","climb","awareness","focus","robotType"
      ]);
      normalizeGroup([
        "autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"
      ]);
      normalizeGroup([
        "focusScoring","focusPassing","focusDefense"
      ]);
      normalizeGroup([
        "failureLostComm","failureLostPower","failureBrokenIntake"
      ]);
    }, 50);

    alert("Calibration complete");
  };

  // 🔥 PRESETS
  const applyPreset = (preset) => {
    setSettings(prev => ({ ...prev, ...preset }));
  };

  // 🔥 TOTAL DISPLAY
  const total = (fields) =>
    fields.reduce((sum, f) => sum + settings[f], 0);

  const totalDisplay = (label, value) => (
    <p style={{
      color: Math.abs(value - 1) > 0.01 ? "red" : "lime",
      fontWeight: "bold"
    }}>
      {label}: {(value * 100).toFixed(0)}%
    </p>
  );

  const slider = (label, field, percent = true) => (
    <div style={{ marginBottom: "10px" }}>
      <p>{label}: {percent
        ? (settings[field] * 100).toFixed(0) + "%"
        : settings[field].toFixed(2)}</p>
      <input
        type="range"
        min="0"
        max={percent ? "1" : "2"}
        step="0.05"
        value={settings[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );

  return (
    <div style={{ padding: "15px", color: "white" }}>
      <h2>Account Settings</h2>

      {/* CALIBRATION */}
      <div style={box}>
        <h3>Calibration</h3>
        <input
          placeholder="Enter team (frc####)"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSelectedTeams([...selectedTeams, e.target.value]);
              e.target.value = "";
            }
          }}
        />
        <div>
          {selectedTeams.map(t => (
            <span key={t} style={{ margin: "5px" }}>{t}</span>
          ))}
        </div>
        <button onClick={calibrate} style={btnSmall}>
          Run Calibration
        </button>
      </div>

      {/* MAIN */}
      <div style={box}>
        <h3>Main</h3>
        {totalDisplay("Total", total([
          "accuracy","shootingSpeed","intakeSpeed",
          "auton","climb","awareness","focus","robotType"
        ]))}

        {slider("Accuracy", "accuracy")}
        {slider("Shooting Speed", "shootingSpeed")}
        {slider("Intake Speed", "intakeSpeed")}
        {slider("Auton", "auton")}
        {slider("Climb", "climb")}
        {slider("Awareness", "awareness")}
        {slider("Focus", "focus")}
        {slider("Robot Type", "robotType")}

        <button onClick={() =>
          normalizeGroup([
            "accuracy","shootingSpeed","intakeSpeed",
            "auton","climb","awareness","focus","robotType"
          ])
        } style={btnSmall}>Normalize</button>
      </div>

      {/* AUTON */}
      <div style={box}>
        <h3>Auton</h3>
        {totalDisplay("Total", total([
          "autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"
        ]))}

        {slider("Shoot", "autonShoot", false)}
        {slider("Middle", "autonCollectMiddle", false)}
        {slider("Depot", "autonCollectDepot", false)}
        {slider("Climb", "autonClimb", false)}

        <button onClick={() =>
          normalizeGroup([
            "autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"
          ])
        } style={btnSmall}>Normalize</button>
      </div>

      {/* FOCUS */}
      <div style={box}>
        <h3>Focus</h3>
        {totalDisplay("Total", total([
          "focusScoring","focusPassing","focusDefense"
        ]))}

        {slider("Scoring", "focusScoring", false)}
        {slider("Passing", "focusPassing", false)}
        {slider("Defense", "focusDefense", false)}

        <button onClick={() =>
          normalizeGroup([
            "focusScoring","focusPassing","focusDefense"
          ])
        } style={btnSmall}>Normalize</button>
      </div>

      {/* FAILURES */}
      <div style={box}>
        <h3>Failures</h3>
        {totalDisplay("Total", total([
          "failureLostComm","failureLostPower","failureBrokenIntake"
        ]))}

        {slider("Lost Comm", "failureLostComm", false)}
        {slider("Lost Power", "failureLostPower", false)}
        {slider("Broken Intake", "failureBrokenIntake", false)}
        {slider("Penalty Strength", "failurePenalty")}

        <button onClick={() =>
          normalizeGroup([
            "failureLostComm","failureLostPower","failureBrokenIntake"
          ])
        } style={btnSmall}>Normalize</button>
      </div>
    </div>
  );
}

const box = {
  background: "#1e1e1e",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "15px"
};

const btnSmall = {
  marginTop: "10px",
  padding: "10px",
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: "8px"
};
