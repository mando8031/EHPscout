import React, { useState, useEffect } from "react";

export default function AccountSettings() {

  const defaultSettings = {
    accuracy: 0.3,
    shootingSpeed: 0.2,
    intakeSpeed: 0.2,
    auton: 0.1,
    climb: 0.1,
    awareness: 0.1,
    focus: 0.1,
    robotType: 0.05,
    failurePenalty: 0.2,

    autonShoot: 1,
    autonCollectMiddle: 0.6,
    autonCollectDepot: 0.5,
    autonClimb: 0.8,

    focusScoring: 1,
    focusPassing: 0.6,
    focusDefense: 0.8,

    failureLostComm: 1,
    failureLostPower: 1,
    failureBrokenIntake: 0.6
  };

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    if (saved) setSettings({ ...defaultSettings, ...saved });
  }, []);

  // 🔥 HANDLE CHANGE
  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  // 🔥 NORMALIZE MAIN WEIGHTS (SO TOTAL = 1)
  const normalizeMainWeights = (s) => {
    const total =
      s.accuracy +
      s.shootingSpeed +
      s.intakeSpeed +
      s.auton +
      s.climb +
      s.awareness +
      s.focus +
      s.robotType;

    if (total === 0) return s;

    return {
      ...s,
      accuracy: s.accuracy / total,
      shootingSpeed: s.shootingSpeed / total,
      intakeSpeed: s.intakeSpeed / total,
      auton: s.auton / total,
      climb: s.climb / total,
      awareness: s.awareness / total,
      focus: s.focus / total,
      robotType: s.robotType / total
    };
  };

  // 🔥 SAVE
  const saveSettings = () => {
    const normalized = normalizeMainWeights(settings);
    localStorage.setItem("scoringSettings", JSON.stringify(normalized));
    setSettings(normalized);
    alert("Settings normalized & saved!");
  };

  // 🔥 PRESETS (SUPER IMPORTANT)
  const applyPreset = (type) => {
    let preset = {};

    if (type === "balanced") {
      preset = {
        accuracy: 0.2,
        shootingSpeed: 0.15,
        intakeSpeed: 0.15,
        auton: 0.15,
        climb: 0.15,
        awareness: 0.1,
        focus: 0.07,
        robotType: 0.03
      };
    }

    if (type === "shooter") {
      preset = {
        accuracy: 0.3,
        shootingSpeed: 0.25,
        intakeSpeed: 0.15,
        auton: 0.15,
        climb: 0.05,
        awareness: 0.05,
        focus: 0.03,
        robotType: 0.02
      };
    }

    if (type === "defense") {
      preset = {
        accuracy: 0.1,
        shootingSpeed: 0.1,
        intakeSpeed: 0.15,
        auton: 0.1,
        climb: 0.15,
        awareness: 0.2,
        focus: 0.15,
        robotType: 0.05
      };
    }

    setSettings(prev => ({ ...prev, ...preset }));
  };

  // 🔥 LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // 🔥 TOTAL DISPLAY
  const total =
    settings.accuracy +
    settings.shootingSpeed +
    settings.intakeSpeed +
    settings.auton +
    settings.climb +
    settings.awareness +
    settings.focus +
    settings.robotType;

  // 🎛️ SLIDER
  const slider = (label, field, isPercent = true) => (
    <div style={{ marginBottom: "12px" }}>
      <p>
        {label}: {isPercent
          ? (settings[field] * 100).toFixed(0) + "%"
          : settings[field].toFixed(2)}
      </p>
      <input
        type="range"
        min="0"
        max={isPercent ? "1" : "2"}
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

      {/* 🔥 PRESETS */}
      <div style={box}>
        <h3>Quick Presets</h3>
        <button onClick={() => applyPreset("balanced")} style={presetBtn}>Balanced</button>
        <button onClick={() => applyPreset("shooter")} style={presetBtn}>Shooter</button>
        <button onClick={() => applyPreset("defense")} style={presetBtn}>Defense</button>
      </div>

      {/* 🔥 MAIN WEIGHTS */}
      <div style={box}>
        <h3>Main Weights</h3>
        <p>Total: {(total * 100).toFixed(0)}%</p>

        {slider("Accuracy", "accuracy")}
        {slider("Shooting Speed", "shootingSpeed")}
        {slider("Intake Speed", "intakeSpeed")}
        {slider("Auton", "auton")}
        {slider("Climb", "climb")}
        {slider("Awareness", "awareness")}
        {slider("Focus", "focus")}
        {slider("Robot Type", "robotType")}
      </div>

      {/* AUTON */}
      <div style={box}>
        <h3>Auton Breakdown</h3>
        {slider("Shoot", "autonShoot", false)}
        {slider("Collect Middle", "autonCollectMiddle", false)}
        {slider("Collect Depot", "autonCollectDepot", false)}
        {slider("Climb", "autonClimb", false)}
      </div>

      {/* FOCUS */}
      <div style={box}>
        <h3>Focus Breakdown</h3>
        {slider("Scoring", "focusScoring", false)}
        {slider("Passing", "focusPassing", false)}
        {slider("Defense", "focusDefense", false)}
      </div>

      {/* FAILURES */}
      <div style={box}>
        <h3>Failure Penalties</h3>
        {slider("Lost Communication", "failureLostComm", false)}
        {slider("Lost Power", "failureLostPower", false)}
        {slider("Broken Intake", "failureBrokenIntake", false)}
        {slider("Penalty Strength", "failurePenalty")}
      </div>

      <button onClick={saveSettings} style={btn}>Save Settings</button>

      <button onClick={logout} style={{ ...btn, background: "#c62828" }}>
        Logout
      </button>
    </div>
  );
}

// 🎨 STYLES
const box = {
  background: "#1e1e1e",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "15px"
};

const btn = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  border: "none",
  borderRadius: "10px",
  background: "#2d8cf0",
  color: "white"
};

const presetBtn = {
  marginRight: "10px",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#333",
  color: "white"
};
