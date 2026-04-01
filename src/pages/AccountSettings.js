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
  const [teamsInput, setTeamsInput] = useState("");

  // 🔥 LOAD
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    const savedPresets = JSON.parse(localStorage.getItem("scoringPresets")) || {};

    if (saved) setSettings({ ...defaultSettings, ...saved });
    setPresets(savedPresets);
  }, []);

  // 🔥 AUTO NORMALIZE FUNCTION
  const normalize = (obj, fields) => {
    const total = fields.reduce((sum, f) => sum + obj[f], 0);
    if (total === 0) return obj;

    const updated = { ...obj };
    fields.forEach(f => updated[f] = obj[f] / total);
    return updated;
  };

  // 🔥 AUTO NORMALIZE ON CHANGE
  useEffect(() => {
    let updated = { ...settings };

    updated = normalize(updated, ["accuracy","shootingSpeed","intakeSpeed","auton","climb","awareness","focus","robotType"]);
    updated = normalize(updated, ["autonShoot","autonCollectMiddle","autonCollectDepot","autonClimb"]);
    updated = normalize(updated, ["focusScoring","focusPassing","focusDefense"]);
    updated = normalize(updated, ["failureLostComm","failureLostPower","failureBrokenIntake"]);

    localStorage.setItem("scoringSettings", JSON.stringify(updated));
    setSettings(updated);

  }, [
    settings.accuracy,
    settings.shootingSpeed,
    settings.intakeSpeed,
    settings.auton,
    settings.climb,
    settings.awareness,
    settings.focus,
    settings.robotType,

    settings.autonShoot,
    settings.autonCollectMiddle,
    settings.autonCollectDepot,
    settings.autonClimb,

    settings.focusScoring,
    settings.focusPassing,
    settings.focusDefense,

    settings.failureLostComm,
    settings.failureLostPower,
    settings.failureBrokenIntake
  ]);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  // 🔥 CALIBRATION (AVERAGE TEAM)
  const runCalibration = () => {
    const teams = teamsInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "")
      .map(t => t.startsWith("frc") ? t : `frc${t}`);

    if (teams.length === 0) return alert("Enter teams");

    const eventKey = localStorage.getItem("selectedEvent");
    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");

    const filtered = data.filter(d =>
      d.event === eventKey && teams.includes(d.team)
    );

    if (filtered.length === 0) return alert("No data");

    const avg = {
      accuracy: 0,
      shootingSpeed: 0,
      intakeSpeed: 0,
      awareness: 0,
      climb: 0,

      autonShoot: 0,
      autonCollectMiddle: 0,
      autonCollectDepot: 0,
      autonClimb: 0,

      focusScoring: 0,
      focusPassing: 0,
      focusDefense: 0,

      failureLostComm: 0,
      failureLostPower: 0,
      failureBrokenIntake: 0,

      robotType: 0
    };

    filtered.forEach(e => {
      avg.accuracy += Number(e.accuracy || 0);
      avg.shootingSpeed += Number(e.shootingSpeed || 0);
      avg.intakeSpeed += Number(e.intakeSpeed || 0);

      if (e.awareness === "Yes") avg.awareness += 1;
      else if (e.awareness === "Kind of Lost") avg.awareness += 0.5;

      if (e.climb?.includes("L3")) avg.climb += 1;
      else if (e.climb?.includes("L2")) avg.climb += 0.7;
      else if (e.climb?.includes("L1")) avg.climb += 0.4;

      if (e.auton?.includes("Shoot")) avg.autonShoot += 1;
      if (e.auton?.includes("Collect Middle")) avg.autonCollectMiddle += 1;
      if (e.auton?.includes("Collect Depot")) avg.autonCollectDepot += 1;
      if (e.auton?.includes("Climb")) avg.autonClimb += 1;

      if (e.focus?.includes("Scoring")) avg.focusScoring += 1;
      if (e.focus?.includes("Passing / Moving Balls")) avg.focusPassing += 1;
      if (e.focus?.includes("Defense")) avg.focusDefense += 1;

      if (e.failures?.includes("Lost Communication")) avg.failureLostComm += 1;
      if (e.failures?.includes("Lost Power")) avg.failureLostPower += 1;
      if (e.failures?.includes("Broken Intake")) avg.failureBrokenIntake += 1;

      if (e.robotType?.includes("Custom")) avg.robotType += 1;
    });

    const count = filtered.length;

    Object.keys(avg).forEach(k => avg[k] /= count);

    const invert = (v) => 1 - Math.min(1, v / 5);

    let newSettings = { ...settings };

    newSettings.accuracy = invert(avg.accuracy);
    newSettings.shootingSpeed = invert(avg.shootingSpeed);
    newSettings.intakeSpeed = invert(avg.intakeSpeed);
    newSettings.awareness = 1 - avg.awareness;
    newSettings.climb = 1 - avg.climb;
    newSettings.robotType = 1 - avg.robotType;

    newSettings.autonShoot = 1 - avg.autonShoot;
    newSettings.autonCollectMiddle = 1 - avg.autonCollectMiddle;
    newSettings.autonCollectDepot = 1 - avg.autonCollectDepot;
    newSettings.autonClimb = 1 - avg.autonClimb;

    newSettings.focusScoring = 1 - avg.focusScoring;
    newSettings.focusPassing = 1 - avg.focusPassing;
    newSettings.focusDefense = 1 - avg.focusDefense;

    newSettings.failureLostComm = avg.failureLostComm;
    newSettings.failureLostPower = avg.failureLostPower;
    newSettings.failureBrokenIntake = avg.failureBrokenIntake;

    setSettings(newSettings);
  };

  // 🔥 PRESETS
  const applyPreset = (preset) => {
    setSettings(prev => ({ ...prev, ...preset }));
  };

  const savePreset = () => {
    if (!presetName) return;

    const updated = { ...presets, [presetName]: settings };
    setPresets(updated);
    localStorage.setItem("scoringPresets", JSON.stringify(updated));
    setPresetName("");
  };

  const loadPreset = (name) => setSettings(presets[name]);

  const exportSettings = () => {
    navigator.clipboard.writeText(JSON.stringify(settings));
    alert("Copied!");
  };

  const importSettings = () => {
    const data = prompt("Paste JSON");
    if (!data) return;
    try {
      setSettings(JSON.parse(data));
    } catch {
      alert("Invalid JSON");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const slider = (label, field) => (
    <div style={{ marginBottom: "10px" }}>
      <p>{label}: {(settings[field] * 100).toFixed(0)}%</p>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={settings[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );

  return (
    <div style={{ padding:"15px", color:"white" }}>
      <h2>Account Settings</h2>

      {/* CALIBRATION */}
      <div style={box}>
        <h3>Calibration</h3>
        <input
          placeholder="1234, 254, 1678"
          value={teamsInput}
          onChange={(e)=>setTeamsInput(e.target.value)}
        />
        <button onClick={runCalibration} style={btn}>Calibrate</button>
      </div>

      {/* PRESETS */}
      <div style={box}>
        <h3>Presets</h3>
        <button onClick={()=>applyPreset(defaultSettings)} style={btnSmall}>Balanced</button>

        <input value={presetName} onChange={(e)=>setPresetName(e.target.value)} placeholder="Preset name"/>
        <button onClick={savePreset} style={btnSmall}>Save</button>

        {Object.keys(presets).map(p=>(
          <button key={p} onClick={()=>loadPreset(p)} style={btnSmall}>{p}</button>
        ))}
      </div>

      {/* MAIN */}
      <div style={box}>
        <h3>Main</h3>
        {slider("Accuracy","accuracy")}
        {slider("Shooting","shootingSpeed")}
        {slider("Intake","intakeSpeed")}
        {slider("Auton","auton")}
        {slider("Climb","climb")}
        {slider("Awareness","awareness")}
        {slider("Focus","focus")}
        {slider("Robot Type","robotType")}
      </div>

      {/* AUTON */}
      <div style={box}>
        <h3>Auton</h3>
        {slider("Shoot","autonShoot")}
        {slider("Middle","autonCollectMiddle")}
        {slider("Depot","autonCollectDepot")}
        {slider("Climb","autonClimb")}
      </div>

      {/* FOCUS */}
      <div style={box}>
        <h3>Focus</h3>
        {slider("Scoring","focusScoring")}
        {slider("Passing","focusPassing")}
        {slider("Defense","focusDefense")}
      </div>

      {/* FAILURES */}
      <div style={box}>
        <h3>Failures</h3>
        {slider("Lost Comm","failureLostComm")}
        {slider("Lost Power","failureLostPower")}
        {slider("Broken Intake","failureBrokenIntake")}
        {slider("Penalty","failurePenalty")}
      </div>

      <div style={box}>
        <button onClick={exportSettings} style={btnSmall}>Export</button>
        <button onClick={importSettings} style={btnSmall}>Import</button>
      </div>

      <button onClick={logout} style={{...btn, background:"red"}}>
        Logout
      </button>
    </div>
  );
}

const box = {
  background:"#1e1e1e",
  padding:"15px",
  borderRadius:"12px",
  marginBottom:"15px"
};

const btn = {
  width:"100%",
  padding:"12px",
  marginTop:"10px",
  border:"none",
  borderRadius:"10px",
  background:"#2d8cf0",
  color:"white"
};

const btnSmall = {
  margin:"5px",
  padding:"8px 12px",
  borderRadius:"8px",
  border:"none",
  background:"#333",
  color:"white"
};
