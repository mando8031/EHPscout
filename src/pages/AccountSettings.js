import React, { useState, useEffect } from "react";

export default function AccountSettings() {

  const defaultSettings = {
    accuracy: 0.3,
    shootingSpeed: 0.2,
    intakeSpeed: 0.2,
    auton: 0.1,
    climb: 0.1,
    awareness: 0.1,
    failurePenalty: 0.2
  };

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scoringSettings"));
    if (saved) setSettings(saved);
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: Number(value)
    }));
  };

  const totalWeight =
    settings.accuracy +
    settings.shootingSpeed +
    settings.intakeSpeed +
    settings.auton +
    settings.climb +
    settings.awareness;

  const saveSettings = () => {

    if (totalWeight === 0) {
      return alert("Weights cannot all be zero");
    }

    localStorage.setItem("scoringSettings", JSON.stringify(settings));
    alert("Settings saved!");
  };

  const resetDefaults = () => {
    setSettings(defaultSettings);
    localStorage.setItem("scoringSettings", JSON.stringify(defaultSettings));
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const slider = (label, field) => (
    <div style={{ marginBottom: "15px" }}>
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
    <div style={{ padding: "15px", color: "white" }}>

      <h2>Account Settings</h2>

      {/* SCORING */}
      <div style={{
        background: "#1e1e1e",
        padding: "15px",
        borderRadius: "12px",
        marginBottom: "20px"
      }}>
        <h3>Scoring Weights</h3>

        {slider("Accuracy", "accuracy")}
        {slider("Shooting Speed", "shootingSpeed")}
        {slider("Intake Speed", "intakeSpeed")}
        {slider("Auton", "auton")}
        {slider("Climb", "climb")}
        {slider("Awareness", "awareness")}

        {/* 🔥 TOTAL DISPLAY */}
        <div style={{
          marginTop: "15px",
          padding: "10px",
          borderRadius: "8px",
          background: totalWeight > 1 ? "#8b0000" : "#333"
        }}>
          <b>Total Weight: {(totalWeight * 100).toFixed(0)}%</b>
          <p style={{ fontSize: "12px", opacity: 0.7 }}>
            Ideally this should be ~100%
          </p>
        </div>

        {/* FAILURE */}
        <h3 style={{ marginTop: "20px" }}>Failure Penalty</h3>
        {slider("Penalty Strength", "failurePenalty")}

        <button onClick={saveSettings} style={btnStyle}>
          Save Settings
        </button>

        <button onClick={resetDefaults} style={btnStyle}>
          Reset Defaults
        </button>
      </div>

      {/* ACCOUNT */}
      <div style={{
        background: "#1e1e1e",
        padding: "15px",
        borderRadius: "12px"
      }}>
        <h3>Account</h3>

        <button onClick={logout} style={{ ...btnStyle, background: "#c62828" }}>
          Log Out
        </button>
      </div>

    </div>
  );
}

const btnStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  border: "none",
  borderRadius: "10px",
  background: "#2d8cf0",
  color: "white",
  fontSize: "16px"
};
