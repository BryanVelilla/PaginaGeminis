import { useState } from 'react'

interface CommandResponse {
  cmd: string
  output: string[]
}

const presetOutputs: Record<string, string[]> = {
  diagnostico: [
    '[+] Iniciando análisis de infraestructura CECAR / Semillero Géminis...',
    '[-] Segmentos de red inspeccionados: 10.20.0.0/16 (Laboratorios & I+D)',
    '[✓] Integridad de túneles criptográficos: TLS 1.3 / WireGuard OK',
    '[✓] Protección perimetral IDS: 0 vulnerabilidades críticas no mitigadas',
    '[i] Estado general: NÚCLEO INVESTIGATIVO OPERATIVO AL 100%',
  ],
  mision: [
    '==========================================================',
    'SEMILLERO DE INVESTIGACIÓN GÉMINIS // CECAR',
    '==========================================================',
    'Misión: Formar investigadores de alto nivel en ciberseguridad',
    'y redes dentro de la Corporación Universitaria del Caribe.',
    'Promovemos el pensamiento crítico, la ética profesional y la',
    'capacidad técnica para blindar infraestructuras críticas.',
  ],
  'lineas-id': [
    '┌────────────────────────────────────────────────────────┐',
    '│ LÍNEAS DE INVESTIGACIÓN Y DESARROLLO (I+D+i)           │',
    '├────────────────────────────────────────────────────────┤',
    '│ 01. Ciberseguridad Ofensiva & Ethical Hacking          │',
    '│ 02. Arquitectura de Redes Seguras & Protocolos         │',
    '│ 03. Informática Forense & Respuesta a Incidentes (DFIR)│',
    '│ 04. Criptografía Aplicada, Cloud & Seguridad en IoT    │',
    '└────────────────────────────────────────────────────────┘',
  ],
  cecar: [
    '[+] Institución: Corporación Universitaria del Caribe - CECAR',
    '[+] Sede: Sincelejo, Sucre, Colombia',
    '[+] Facultad: Ciencias Básicas, Ingenierías y Arquitectura',
    '[+] Programa: Ingeniería de Sistemas',
    '[+] Redes de investigación: RedCOLSI / Comunidades de Seguridad',
  ],
  unirme: [
    '[>] Requisitos para ser Semillerista Géminis en CECAR:',
    '  1. Estar matriculado en programa académico de CECAR.',
    '  2. Curiosidad insaciable por las redes y la seguridad digital.',
    '  3. Compromiso con la ética hacker y la investigación formativa.',
    '  4. Contactar al docente líder o escribir a hola@semillerogeminis.edu.co',
  ],
}

export function TerminalSim() {
  const [history, setHistory] = useState<CommandResponse[]>([
    {
      cmd: 'geminis --info',
      output: [
        'Semillero Géminis v2.6.4 [CECAR Security Lab Edition]',
        'Escribe o pulsa un comando para explorar la telemetría académica.',
      ],
    },
  ])
  const [inputVal, setInputVal] = useState('')

  const executeCmd = (command: string) => {
    const cleanCmd = command.trim().toLowerCase()
    if (!cleanCmd) return

    if (cleanCmd === 'clear') {
      setHistory([])
      setInputVal('')
      return
    }

    const res = presetOutputs[cleanCmd] || [
      `Comando desconocido: "${cleanCmd}".`,
      'Comandos válidos: diagnostico, mision, lineas-id, cecar, unirme, clear',
    ]

    setHistory((prev) => [...prev.slice(-6), { cmd: command, output: res }])
    setInputVal('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCmd(inputVal)
  }

  return (
    <div className="terminal-sim">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="term-btn red" />
          <span className="term-btn yellow" />
          <span className="term-btn green" />
        </div>
        <div className="terminal-title">cecar@geminis-lab:~ (bash)</div>
        <div className="terminal-badge">LIVE LAB</div>
      </div>

      <div className="terminal-quick-bar">
        <span className="quick-label">COMANDOS RÁPIDOS:</span>
        {(['diagnostico', 'mision', 'lineas-id', 'cecar', 'unirme'] as const).map((c) => (
          <button
            key={c}
            type="button"
            className="quick-btn"
            onClick={() => executeCmd(c)}
          >
            ${c}
          </button>
        ))}
      </div>

      <div className="terminal-body" role="log" aria-live="polite">
        {history.map((entry, idx) => (
          <div key={idx} className="terminal-block">
            <div className="terminal-prompt-line">
              <span className="term-user">geminis@cecar</span>
              <span className="term-sep">:</span>
              <span className="term-path">~/investigacion</span>
              <span className="term-sign">$</span>
              <span className="term-cmd">{entry.cmd}</span>
            </div>
            {entry.output.map((line, lineIdx) => (
              <div key={lineIdx} className="terminal-output-line">
                {line}
              </div>
            ))}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="terminal-input-row">
          <span className="term-user">geminis@cecar</span>
          <span className="term-sep">:</span>
          <span className="term-path">~/investigacion</span>
          <span className="term-sign">$</span>
          <input
            type="text"
            className="terminal-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Escribe 'diagnostico' o 'lineas-id'..."
            aria-label="Línea de comandos del semillero"
          />
        </form>
      </div>
    </div>
  )
}
