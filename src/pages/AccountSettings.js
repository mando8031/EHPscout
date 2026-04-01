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
  const [teamInput, setTeamInput] = useState("");

  // LOAD
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    const savedPresets = JSON.parse(localStorage.getItem("scoringPresets")) || {};

    if (saved) setSettings({ ...defaultSettings, ...saved });
    setPresets(savedPresets);
  }, []);

  // AUTOSAVE
  useEffect(() => {
    localStorage.setItem("scoringSettings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  // NORMALIZE
  const normalizeGroup = (fields) => {
    let total = fields.reduce((sum, f) => sum + settings[f], 0);
    if (total === 0) total = 1;

    const updated = { ...settings };
    fields.forEach(f => {
      updated[f] = settings[f] / total;
    });

    setSettings(updated);
  };

  // CALIBRATION
  const calibrate = () => {
    const selectedEvent = localStorage.getItem("selectedEvent");
    if (!selectedEvent) return alert("Select event");

    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]")
      .filter(d => d.event === selectedEvent);

    if (!data.length) return alert("No data");

    const grouped = {};
    data.forEach(e => {
      if (!grouped[e.team]) grouped[e.team] = [];
      grouped[e.team].push(e);
    });

    const teams = Object.keys(grouped).map(team => ({
      team,
      entries: grouped[team]
    }));

    const top = teams.filter(t => selectedTeams.includes(t.team));
    const others = teams.filter(t => !selectedTeams.includes(t.team));

    if (!top.length) return alert("Pick teams");

    const avg = (arr, fn) =>
      arr.reduce((s, e) => s + fn(e), 0) / arr.length;

    const diff = (fn) => {
      const t = avg(top.flatMap(t => t.entries), fn);
      const o = avg(others.flatMap(t => t.entries), fn);
      return Math.max(0.01, t - o);
    };

    let s = { ...settings };

    // MAIN
    s.accuracy = diff(e => Number(e.accuracy || 0));
    s.shootingSpeed = diff(e => Number(e.shootingSpeed || 0));
    s.intakeSpeed = diff(e => Number(e.intakeSpeed || 0));

    s.awareness = diff(e =>
      e.awareness === "Yes" ? 1 :
      e.awareness === "Kind of Lost" ? 0.5 : 0
    );

    s.climb = diff(e =>
      e.climb?.includes("L3") ? 1 :
      e.climb?.includes("L2") ? 0.7 :
      e.climb?.includes("L1") ? 0.4 : 0
    );

    s.robotType = diff(e =>
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
      s[k] = diff(e => e.auton?.includes(v) ? 1 : 0);
    });

    // FOCUS
    const focusMap = {
      focusScoring: "Scoring",
      focusPassing: "Passing / Moving Balls",
      focusDefense: "Defense"
    };

    Object.entries(focusMap).forEach(([k, v]) => {
      s[k] = diff(e => e.focus?.includes(v) ? 1 : 0);
    });

    // FAILURES
    const failMap = {
      failureLostComm: "Lost Communication",
      failureLostPower: "Lost Power",
      failureBrokenIntake: "Broken Intake"
    };

    Object.entries(failMap).forEach(([k, v]) => {
      const d = diff(e => e.failures?.includes(v) ? 1 : 0);
      s[k] = 1 / d;
    });

    setSettings(s);

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

  // PRESETS
  const applyPreset = (preset) => {
    setSettings(prev => ({ ...prev, ...preset }));
  };

  const savePreset = () => {
    if (!presetName) return alert("Name it");

    const updated = { ...presets, [presetName]: settings };
    setPresets(updated);
    localStorage.setItem("scoringPresets", JSON.stringify(updated));
    setPresetName("");
  };

  const loadPreset = (name) => setSettings(presets[name]);

  // IMPORT / EXPORT
  const exportSettings = () => {
    navigator.clipboard.writeText(JSON.stringify(settings));
    alert("Copied!");
  };

  const importSettings = () => {
    const data = prompt("Paste JSON");
    if (!data) return;
    try { setSettings(JSON.parse(data)); }
    catch { alert("Invalid"); }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const total = (fields) =>
    fields.reduce((s, f) => s + settings[f], 0);

  const totalDisplay = (val) => (
    <p style={{
      color: Math.abs(val - 1) > 0.01 ? "red" : "lime"
    }}>
      Total: {(val * 100).toFixed(0)}%
    </p>
  );

  const slider = (label, field, percent = true) => (
    <div>
      <p>{label}: {percent
        ? (settings[field]*100).toFixed(0)+"%"
        : settings[field].toFixed(2)}</p>
      <input
        type="range"
        min="0"
        max={percent ? "1" : "2"}
        step="0.05"
        value={settings[field]}
        onChange={(e)=>handleChange(field,e.target.value)}
        style={{width:"100%"}}
      />
    </div>
  );

  return (
    <div style={{padding:"15px",color:"white"}}>

      <h2>Account Settings</h2>

      {/* CALIBRATION */}
      <div style={box}>
        <h3>Calibration</h3>

        <input
          value={teamInput}
          onChange={(e)=>setTeamInput(e.target.value)}
          placeholder="frc####"
        />

        <button onClick={()=>{
          if(!teamInput) return;
          setSelectedTeams([...selectedTeams, teamInput]);
          setTeamInput("");
        }}>Add Team</button>

        <div>
          {selectedTeams.map(t=>(
            <span key={t} style={{margin:"5px"}}>{t}</span>
          ))}
        </div>

        <button onClick={calibrate}>Run Calibration</button>
      </div>

      {/* PRESETS */}
      <div style={box}>
        <h3>Presets</h3>
        <button onClick={()=>applyPreset(defaultSettings)}>Balanced</button>

        <input
          placeholder="Preset name"
          value={presetName}
          onChange={(e)=>setPresetName(e.target.value)}
        />
        <button onClick={savePreset}>Save</button>

        {Object.keys(presets).map(p=>(
          <button key={p} onClick={()=>loadPreset(p)}>
            {p}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div style={box}>
        <h3>Main</h3>
        {totalDisplay(total([
          "accuracy","shootingSpeed","intakeSpeed",
          "auton","climb","awareness","focus","robotType"
        ]))}

        {slider("Accuracy","accuracy")}
        {slider("Shooting Speed","shootingSpeed")}
        {slider("Intake Speed","intakeSpeed")}
        {slider("Auton","auton")}
        {slider("Climb","climb")}
        {slider("Awareness","awareness")}
        {slider("Focus","focus")}
        {slider("Robot Type","robotType")}

        <button onClick={()=>normalizeGroup([
          "accuracy","shootingSpeed","intakeSpeed",
          "auton","climb","awareness","focus","robotType"
        ])}>Normalize</button>
      </div>

      {/* IMPORT EXPORT */}
      <div style={box}>
        <button onClick={exportSettings}>Export</button>
        <button onClick={importSettings}>Import</button>
      </div>

      <button onClick={logout} style={{background:"red"}}>
        Logout
      </button>

    </div>
  );
}

const box = {
  background:"#1e1e1e",
  padding:"15px",
  marginBottom:"15px",
  borderRadius:"10px"
};
