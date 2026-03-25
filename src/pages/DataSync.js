import React, { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";

export default function DataSync() {

  const [qrData, setQrData] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState(null);

  // 📤 GENERATE QR
  const handleGenerateQR = () => {
    const data = JSON.parse(localStorage.getItem("scoutingData") || "[]");
    const recent = data.slice(-25);

    const payload = JSON.stringify(recent);
    setQrData(payload);
  };

  // 📥 START SCANNER
  const startScanner = () => {
    console.log("Starting scanner...");
    setScanning(true);
  };

  // 🔥 THIS IS THE IMPORTANT PART
  useEffect(() => {
  if (!scanning) return;

  const html5QrCode = new Html5Qrcode("reader");

  // 🔥 TRY TO FORCE BACK CAMERA
  html5QrCode.start(
    { facingMode: "environment" }, // ✅ THIS FIXES IT
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      console.log("QR scanned:", decodedText);

      try {
        const imported = JSON.parse(decodedText);
        const existing = JSON.parse(localStorage.getItem("scoutingData") || "[]");

        const map = {};
        [...existing, ...imported].forEach(entry => {
          map[entry.id] = entry;
        });

        const merged = Object.values(map);

        localStorage.setItem("scoutingData", JSON.stringify(merged));

        alert("QR Data Merged!");

        html5QrCode.stop().then(() => {
          setScanning(false);
        });

      } catch (err) {
        console.error(err);
        alert("Invalid QR Data");
      }
    },
    (error) => {
      // ignore scan errors
    }
  ).catch(err => {
    console.warn("Back camera failed, trying fallback:", err);

    // 🔁 FALLBACK TO ANY CAMERA
    Html5Qrcode.getCameras().then(devices => {
      if (devices.length) {
        html5QrCode.start(
          devices[0].id,
          { fps: 10, qrbox: 250 },
          () => {},
          () => {}
        );
      }
    });
  });

  return () => {
    html5QrCode.stop().catch(() => {});
  };

}, [scanning]);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>QR Sync</h1>

      {/* EXPORT */}
      <button
        onClick={handleGenerateQR}
        style={{ width: "100%", padding: "15px", marginBottom: "15px" }}
      >
        Generate QR Code
      </button>

      {qrData && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <QRCode value={qrData} size={250} />
          <p>Have another device scan this</p>
        </div>
      )}

      {/* IMPORT */}
      {!scanning && (
        <button
          onClick={startScanner}
          style={{ width: "100%", padding: "15px" }}
        >
          Scan QR Code
        </button>
      )}

      {/* CAMERA VIEW */}
      {scanning && (
        <div
          id="reader"
          style={{
            width: "100%",
            marginTop: "20px"
          }}
        />
      )}
    </div>
  );
}
