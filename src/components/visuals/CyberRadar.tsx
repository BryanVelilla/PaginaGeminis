import { useState } from 'react'

interface NodeItem {
  id: string
  label: string
  ip: string
  status: 'PROTEGIDO' | 'EN AUDITORÍA' | 'SEGURO' | 'MONITOREO'
  role: string
  x: number // percentage
  y: number // percentage
  latency: string
}

const radarNodes: NodeItem[] = [
  { id: 'gw', label: 'Gateway CECAR-Core', ip: '10.20.0.1', status: 'SEGURO', role: 'Enrutamiento & Firewall Perimetral', x: 28, y: 32, latency: '2ms' },
  { id: 'ids', label: 'Nodo IDS / Suricata', ip: '10.20.4.12', status: 'PROTEGIDO', role: 'Detección de Intrusiones en Tiempo Real', x: 72, y: 26, latency: '4ms' },
  { id: 'lab', label: 'Lab Redes & Ethical Hacking', ip: '192.168.100.5', status: 'EN AUDITORÍA', role: 'Entorno de Pruebas y Simulación CTF', x: 74, y: 70, latency: '1ms' },
  { id: 'vpn', label: 'Túnel WireGuard / ZeroTrust', ip: '10.8.0.1', status: 'PROTEGIDO', role: 'Acceso Seguro de Investigadores', x: 25, y: 68, latency: '9ms' },
  { id: 'siem', label: 'SIEM & Forense Engine', ip: '10.20.99.8', status: 'MONITOREO', role: 'Correlación de Logs & Telemetría', x: 50, y: 84, latency: '3ms' },
]

export function CyberRadar() {
  const [selectedNode, setSelectedNode] = useState<NodeItem>(radarNodes[0])
  const [isScanning, setIsScanning] = useState(true)

  return (
    <div className="cyber-radar-card">
      <div className="radar-topbar">
        <div className="radar-topbar-title">
          <span className="live-dot" />
          <span className="mono-title">TELEMETRÍA DE RED // RADAR ACTIVO CECAR</span>
        </div>
        <div className="radar-controls">
          <button
            type="button"
            className={`radar-btn ${isScanning ? 'active' : ''}`}
            onClick={() => setIsScanning(!isScanning)}
            title="Pausar / Reactivar barrido de radar"
          >
            {isScanning ? 'Barrido: ACTIVO' : 'Barrido: PAUSA'}
          </button>
        </div>
      </div>

      <div className="radar-viewport">
        {/* Glow ambient background */}
        <div className="radar-ambient-glow" />

        {/* Concentric radar rings */}
        <div className="radar-ring radar-ring-1" />
        <div className="radar-ring radar-ring-2" />
        <div className="radar-ring radar-ring-3" />
        <div className="radar-ring radar-ring-4" />

        {/* Radar crosshairs */}
        <div className="radar-crosshair-h" />
        <div className="radar-crosshair-v" />

        {/* Rotating radar sweep */}
        {isScanning && (
          <div className="radar-sweep-beam">
            <div className="radar-sweep-cone" />
          </div>
        )}

        {/* Expanding pulse wave */}
        <div className="radar-pulse-wave wave-1" />
        <div className="radar-pulse-wave wave-2" />

        {/* Central Core Shield */}
        <div className="radar-center-core">
          <div className="core-shield">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="core-label">CORE</span>
        </div>

        {/* Radar interactive nodes */}
        {radarNodes.map((node) => {
          const isCurrent = selectedNode.id === node.id
          return (
            <button
              key={node.id}
              type="button"
              className={`radar-node ${isCurrent ? 'selected' : ''}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => setSelectedNode(node)}
              aria-label={`Ver información del nodo ${node.label}`}
            >
              <span className="node-ping" />
              <span className="node-dot" />
              <span className="node-tag">{node.label.split(' ')[0]}</span>
            </button>
          )
        })}

        {/* Floating pill metrics */}
        <div className="radar-floating-badge badge-top-left">
          <span className="badge-bullet">◈</span>
          <span>CECAR NET MATRIX</span>
        </div>
        <div className="radar-floating-badge badge-top-right">
          <span className="badge-bullet green">●</span>
          <span>LATENCIA: {selectedNode.latency}</span>
        </div>
        <div className="radar-floating-badge badge-bottom-left">
          <span className="badge-bullet purple">✦</span>
          <span>ZERO-TRUST AUDIT</span>
        </div>
      </div>

      {/* Selected Node Telemetry Bar */}
      <div className="radar-telemetry-panel">
        <div className="telemetry-col">
          <span className="telemetry-label">NODO SELECCIONADO</span>
          <span className="telemetry-value highlight">{selectedNode.label}</span>
        </div>
        <div className="telemetry-col">
          <span className="telemetry-label">IP ASIGNADA</span>
          <span className="telemetry-value mono">{selectedNode.ip}</span>
        </div>
        <div className="telemetry-col">
          <span className="telemetry-label">ESTADO DE DEFENSA</span>
          <span className={`status-pill status-${selectedNode.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {selectedNode.status}
          </span>
        </div>
        <div className="telemetry-col full-width">
          <span className="telemetry-label">FUNCIÓN DE INVESTIGACIÓN</span>
          <span className="telemetry-desc">{selectedNode.role}</span>
        </div>
      </div>
    </div>
  )
}
