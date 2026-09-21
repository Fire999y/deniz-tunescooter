import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const models = { f3pro: { name: 'Ninebot F3 Pro', min: 3, max: 35 }, zt3pro: { name: 'Ninebot ZT3 Pro', min: 3, max: 45 }, g3max: { name: 'Ninebot G3 Max', min: 3, max: 45 } };

function App() {
  const [ready, setReady] = useState(false);
  const [seconds, setSeconds] = useState(10);
  const [model, setModel] = useState('f3pro');
  const [speed, setSpeed] = useState(20);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState('Noch kein Scooter verbunden.');
  const limit = models[model];

  useEffect(() => {
    if (ready) return;
    const timer = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [ready]);

  useEffect(() => setSpeed(Math.min(limit.max, Math.max(limit.min, limit.min === 3 ? 20 : 22))), [model, limit.max, limit.min]);

  async function connect() {
    if (!navigator.bluetooth) {
      setStatus('Web Bluetooth wird in diesem Browser nicht unterstützt. Nutze Chrome oder Edge über HTTPS.');
      return;
    }
    try {
      const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: ['battery_service'] });
      setConnected(true);
      setStatus(`Verbunden mit ${device.name || 'Bluetooth-Gerät'}. Echte Scooter-Daten benötigen das passende Herstellerprotokoll.`);
    } catch (error) {
      setStatus(`Verbindung abgebrochen: ${error.message}`);
    }
  }

  if (!ready) return <div className="warning"><div className="warning-card"><h1>DENIZ-TUNESCOOTER</h1><p>Diese App ist ein unabhängiges Dashboard. Nutze ausschließlich vom Scooter unterstützte Einstellungen und beachte die örtlichen Vorschriften.</p><p className="small">Bitte bestätige den Hinweis nach Ablauf des Countdowns.</p><button disabled={seconds > 0} onClick={() => setReady(true)}>Weiter {seconds > 0 ? `(${seconds})` : ''}</button></div></div>;

  return <main className="app"><header><h1>DENIZ-TUNESCOOTER</h1><span className={connected ? 'online' : ''}>{connected ? 'Verbunden' : 'Offline'}</span></header><section className="layout"><div className="panel"><div className="row"><h2>Übersicht</h2><button onClick={connect}>Scooter verbinden</button></div><div className="stats"><div><small>Geschwindigkeit</small><strong>{speed} <i>km/h</i></strong></div><div><small>Akku</small><strong>-- <i>%</i></strong></div><div><small>Reichweite</small><strong>-- <i>km</i></strong></div></div><label>Modell<select value={model} onChange={(event) => setModel(event.target.value)}><option value="f3pro">Ninebot F3 Pro</option><option value="zt3pro">Ninebot ZT3 Pro</option><option value="g3max">Ninebot G3 Max</option></select></label><label>Geschwindigkeit: <b>{speed} km/h</b><input type="range" min={limit.min} max={limit.max} value={speed} onChange={(event) => setSpeed(Number(event.target.value))}/><small className="range">Bereich: {limit.min}–{limit.max} km/h</small></label><button onClick={() => setStatus(`Profil vorbereitet: ${limit.name}, ${speed} km/h.`)}>Profil speichern</button></div><aside className="panel"><h2>Status</h2><p>{status}</p><hr/><p>Modell: {limit.name}</p><p>Kickstart-Anzeige: bis 15 km/h, sofern vom Modell unterstützt.</p><p>Region: USA / Standard</p></aside></section></main>;
}

createRoot(document.getElementById('root')).render(<App />);
