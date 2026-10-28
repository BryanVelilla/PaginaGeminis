import { useState, useEffect, useRef } from 'react'

interface LoadingScreenProps {
  onComplete?: () => void
}

const PHASES = [
  { progress: 14, text: 'INICIALIZANDO KERNEL GÉMINIS...', log: '> [0.08s] SYS_INIT: Gemini Core v2.6.4 (CECAR Lab) activo.' },
  { progress: 32, text: 'ESTABLECIENDO ENLACE CIFRADO [TLS 1.3]...', log: '> [0.42s] NET_CRYPT: Handshake criptográfico validado [TLS 1.3].' },
  { progress: 58, text: 'DESENCRIPTANDO MÓDULOS DE INVESTIGACIÓN...', log: '> [1.05s] DEC_PAYLOAD: Descifrando cargas AES-GCM-256... OK' },
  { progress: 79, text: 'ENFOCANDO INTERFAZ NEURAL & CIPHERFIELD...', log: '> [1.70s] OPTIC_FOCUS: Matriz CipherField y radar enfocados.' },
  { progress: 93, text: 'SINCRONIZANDO PROTOCOLOS DE SEGURIDAD CECAR...', log: '> [2.30s] CECAR_AUTH: Credenciales confirmadas [NODO_SINCELEJO].' },
  { progress: 100, text: 'AUTORIZACIÓN VERIFICADA // ENTRANDO AL SISTEMA...', log: '> [2.85s] EXEC_ENTRY: Acceso concedido. Cargando sesión...' },
]

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________0123456789ABCDEF'
const TOTAL_CELLS = 28

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [displayText, setDisplayText] = useState(PHASES[0].text)
  const [logs, setLogs] = useState<string[]>([PHASES[0].log])
  const [isExiting, setIsExiting] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const scrambleIntervalRef = useRef<number | null>(null)
  const hasFinishedRef = useRef(false)

  // Prevent background scroll while loading
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Matrix background effect on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    const fontSize = 14
    const columns = Math.floor(width / fontSize)
    const drops = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -50))
    const chars = '0123456789ABCDEFGEMINISCECAR<>/[]*#'

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 11, 10, 0.12)'
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = '#06b6d4'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        if (Math.random() > 0.85) {
          ctx.fillStyle = '#38bdf8'
        } else if (Math.random() > 0.5) {
          ctx.fillStyle = '#10b981'
        } else {
          ctx.fillStyle = '#06b6d4'
        }

        ctx.fillText(char, x, y)

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Text scramble decryption effect
  const scrambleTo = (targetText: string) => {
    if (scrambleIntervalRef.current) {
      clearInterval(scrambleIntervalRef.current)
    }

    let iteration = 0
    const maxIterations = 14

    scrambleIntervalRef.current = window.setInterval(() => {
      setDisplayText(() => {
        return targetText
          .split('')
          .map((letter, index) => {
            if (letter === ' ' || index < (iteration / maxIterations) * targetText.length) {
              return letter
            }
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          })
          .join('')
      })

      iteration++
      if (iteration > maxIterations) {
        if (scrambleIntervalRef.current) clearInterval(scrambleIntervalRef.current)
        setDisplayText(targetText)
      }
    }, 30)
  }

  // Handle phase changes & text scramble
  useEffect(() => {
    const phase = PHASES[currentPhaseIndex]
    if (phase) {
      scrambleTo(phase.text)
      setLogs((prev) => (prev.includes(phase.log) ? prev : [...prev.slice(-4), phase.log]))
    }
  }, [currentPhaseIndex])

  // Progress pacing loop
  useEffect(() => {
    const startTime = Date.now()
    const targetDuration = 2700 // ~2.7s for full cyber load sequence

    const timer = setInterval(() => {
      if (hasFinishedRef.current) {
        clearInterval(timer)
        return
      }

      const elapsed = Date.now() - startTime
      const rawProgress = Math.min(100, Math.floor((elapsed / targetDuration) * 100))

      setProgress(rawProgress)

      // Determine active phase
      const phaseIdx = PHASES.findIndex((p) => rawProgress <= p.progress)
      const currentIdx = phaseIdx === -1 ? PHASES.length - 1 : phaseIdx
      setCurrentPhaseIndex(currentIdx)

      if (rawProgress >= 100) {
        hasFinishedRef.current = true
        clearInterval(timer)
        triggerFinish()
      }
    }, 35)

    return () => clearInterval(timer)
  }, [])

  // Finish and smooth exit
  const triggerFinish = () => {
    setProgress(100)
    setCurrentPhaseIndex(PHASES.length - 1)
    scrambleTo(PHASES[PHASES.length - 1].text)

    // Give a brief moment for user to see the "ENTRANDO AL SISTEMA" state
    setTimeout(() => {
      setIsExiting(true)
      document.body.style.overflow = ''
      setTimeout(() => {
        setIsVisible(false)
        document.body.style.overflow = ''
        onComplete?.()
      }, 550)
    }, 450)
  }

  // Manual skip (ESC or Click)
  const handleSkip = () => {
    if (hasFinishedRef.current) return
    hasFinishedRef.current = true
    triggerFinish()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isVisible) return null

  // Calculate filled segmented cells
  const filledCells = Math.round((progress / 100) * TOTAL_CELLS)

  return (
    <div
      className={`hacker-loader-overlay ${isExiting ? 'is-exiting' : ''}`}
      role="status"
      aria-label="Cargando interfaz de seguridad"
    >
      <canvas ref={canvasRef} className="hacker-loader-canvas" />
      <div className="hacker-loader-scanline" />
      <div className="hacker-loader-sweep" />
      <div className="hacker-loader-vignette" />

      {/* Corner HUD Badges */}
      <div className="loader-hud-corner loader-hud-top-left">
        <span className="loader-badge-tag">CECAR // GÉMINIS</span>
        <span>SYS_SEC: TLSv1.3</span>
      </div>

      <div className="loader-hud-corner loader-hud-top-right">
        <span>MEM_ALLOC: 0x7FFE9A</span>
        <span className="loader-badge-tag pulse-green">NODE_ONLINE</span>
      </div>

      <div className="loader-hud-corner loader-hud-bottom-left">
        <span>IP: 10.20.0.12 // SEC_LEVEL: ALPHA</span>
      </div>

      <div className="loader-hud-corner loader-hud-bottom-right">
        <button
          type="button"
          onClick={handleSkip}
          className="loader-skip-hint"
          aria-label="Saltar pantalla de carga"
        >
          [ESC] O CLIC PARA SALTAR
        </button>
      </div>

      {/* Central Cyber Panel */}
      <div className="loader-center-panel">
        <span className="loader-corner-bracket loader-corner-tl" />
        <span className="loader-corner-bracket loader-corner-tr" />
        <span className="loader-corner-bracket loader-corner-br" />
        <span className="loader-corner-bracket loader-corner-bl" />

        {/* Panel Header */}
        <div className="loader-header">
          <div className="loader-brand">
            <div className="loader-brand-icon">G</div>
            <div className="loader-brand-text">
              <span className="loader-brand-title">SEMILLERO GÉMINIS</span>
              <span className="loader-brand-sub">CECAR CYBERSECURITY LAB // I+D+i</span>
            </div>
          </div>
          <div className="loader-status-pill">
            <span className="loader-status-dot" />
            <span>{progress === 100 ? 'ACCESS GRANTED' : 'DECRYPTING'}</span>
          </div>
        </div>

        {/* Dynamic Decrypting / Enfocando Status Message */}
        <div className="loader-msg-box">
          <div className="loader-msg-label">ESTADO DE ACCESO :: SEC_SYS</div>
          <div className={`loader-msg-text ${progress === 100 ? 'is-complete' : ''}`}>
            <span>{displayText}</span>
            <span className="loader-cursor" />
          </div>
        </div>

        {/* Hacking Progress Bar Section */}
        <div className="loader-progress-section">
          <div className="loader-progress-top-info">
            <span className="loader-progress-state">
              {progress < 40 && 'FASE I: INICIALIZACIÓN Y ENCRIPTADO'}
              {progress >= 40 && progress < 80 && 'FASE II: DESENCRIPTANDO Y ENFOCANDO'}
              {progress >= 80 && progress < 100 && 'FASE III: SINCRONIZACIÓN DE INTERFAZ'}
              {progress === 100 && 'FASE FINAL: ENTRANDO AL SISTEMA'}
            </span>
            <span className="loader-progress-pct">{progress.toString().padStart(3, '0')}%</span>
          </div>

          {/* Segmented Hacking Cells Bar */}
          <div className="loader-cells-track" aria-hidden="true">
            {Array.from({ length: TOTAL_CELLS }).map((_, index) => {
              const isFilled = index < filledCells
              const isGreen = progress >= 95
              const isPurple = progress >= 60 && !isGreen

              let cellClass = ''
              if (isFilled) {
                cellClass = isGreen ? 'filled green-stage' : isPurple ? 'filled purple-stage' : 'filled'
              }

              return <div key={index} className={`loader-cell ${cellClass}`} />
            })}
          </div>

          {/* Continuous Glow Laser Bar */}
          <div className="loader-fluid-bar-wrap">
            <div
              className="loader-fluid-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="loader-progress-bottom-info">
            <span>ADDR: 0x{(progress * 1337).toString(16).toUpperCase().padStart(6, '0')}</span>
            <span>TRANSFER: {(progress * 10.24).toFixed(1)} KB / 1024.0 KB</span>
            <span>LATENCY: 0.04ms</span>
          </div>
        </div>

        {/* Mini Cyber Terminal Logs */}
        <div className="loader-logs-console" aria-live="polite">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`loader-log-line ${idx === logs.length - 1 && progress === 100 ? 'success' : ''}`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
