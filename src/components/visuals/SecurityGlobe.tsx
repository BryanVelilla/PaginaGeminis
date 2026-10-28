import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface NodeLocation {
  name: string
  label: string
  lat: number
  lon: number
  isHub?: boolean
}

// Key cybersecurity research nodes
const NODES: NodeLocation[] = [
  { name: 'cecar', label: 'CECAR (Sincelejo)', lat: 9.30, lon: -75.40, isHub: true },
  { name: 'bogota', label: 'Nodo Bogotá', lat: 4.71, lon: -74.07 },
  { name: 'us_east', label: 'Cyber Defense DC', lat: 38.90, lon: -77.03 },
  { name: 'us_west', label: 'Silicon Valley I+D', lat: 37.38, lon: -122.08 },
  { name: 'europe_w', label: 'Madrid CERT', lat: 40.41, lon: -3.70 },
  { name: 'europe_c', label: 'Frankfurt Hub', lat: 50.11, lon: 8.68 },
  { name: 'asia', label: 'Tokyo Lab', lat: 35.67, lon: 139.65 },
  { name: 'sa_south', label: 'São Paulo Sec', lat: -23.55, lon: -46.63 },
]

// Network connection arcs between nodes
const CONNECTIONS: [number, number][] = [
  [0, 1], // CECAR -> Bogotá
  [0, 2], // CECAR -> US East
  [0, 3], // CECAR -> US West
  [0, 4], // CECAR -> Madrid
  [0, 7], // CECAR -> São Paulo
  [2, 4], // US East -> Madrid
  [3, 6], // US West -> Tokyo
  [4, 5], // Madrid -> Frankfurt
  [5, 6], // Frankfurt -> Tokyo
]

const GLOBE_RADIUS = 150

// Convert lat/lon to 3D Vector3 on a sphere
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

// Generate circular soft glow texture for particles
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.25, 'rgba(56, 189, 248, 0.95)')
  gradient.addColorStop(0.55, 'rgba(6, 182, 212, 0.45)')
  gradient.addColorStop(0.85, 'rgba(14, 165, 233, 0.15)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function SecurityGlobe() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let width = container.clientWidth || 600
    let height = container.clientHeight || 600

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000)
    camera.position.set(0, 20, 420)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.appendChild(renderer.domElement)

    // Main rotating group (Earth + orbits + nodes)
    const globeGroup = new THREE.Group()
    // Realistic axial tilt (~23.5 degrees)
    globeGroup.rotation.z = THREE.MathUtils.degToRad(18)
    globeGroup.rotation.x = THREE.MathUtils.degToRad(10)
    scene.add(globeGroup)

    const glowTexture = createGlowTexture()

    // 2. Inner Dark Occlusion Core (keeps front particles clear while softly darkening back particles)
    const innerCoreGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 0.985, 48, 48)
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x020807,
      transparent: true,
      opacity: 0.88,
    })
    const innerCore = new THREE.Mesh(innerCoreGeom, innerCoreMat)
    globeGroup.add(innerCore)

    // 3. Fallback / Initial Fibonacci land particles while JSON loads
    let landPointsMesh: THREE.Points | null = null
    let oceanPointsMesh: THREE.Points | null = null

    // Load full land & ocean coordinates
    fetch('/data/globe-points.json')
      .then((res) => res.json())
      .then((data: { land: [number, number, number][]; ocean: [number, number, number][] }) => {
        // --- Land Particles ---
        const landGeom = new THREE.BufferGeometry()
        const landPositions = new Float32Array(data.land.length * 3)
        const landColors = new Float32Array(data.land.length * 3)

        const colCyan = new THREE.Color(0x38bdf8)
        const colTeal = new THREE.Color(0x06b6d4)
        const colEmerald = new THREE.Color(0x10b981)
        const colBrightSky = new THREE.Color(0xbae6fd)

        for (let i = 0; i < data.land.length; i++) {
          const [x, y, z] = data.land[i]
          landPositions[i * 3] = x * GLOBE_RADIUS
          landPositions[i * 3 + 1] = y * GLOBE_RADIUS
          landPositions[i * 3 + 2] = z * GLOBE_RADIUS

          // Aesthetic color variation: mostly cyan/teal, with subtle emerald and bright sky sparks
          const rand = Math.random()
          let c = colTeal
          if (rand > 0.82) c = colEmerald
          else if (rand > 0.68) c = colCyan
          else if (rand > 0.94) c = colBrightSky

          landColors[i * 3] = c.r
          landColors[i * 3 + 1] = c.g
          landColors[i * 3 + 2] = c.b
        }

        landGeom.setAttribute('position', new THREE.BufferAttribute(landPositions, 3))
        landGeom.setAttribute('color', new THREE.BufferAttribute(landColors, 3))

        const landMat = new THREE.PointsMaterial({
          size: 3.2,
          vertexColors: true,
          map: glowTexture,
          transparent: true,
          opacity: 0.92,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })

        landPointsMesh = new THREE.Points(landGeom, landMat)
        globeGroup.add(landPointsMesh)

        // --- Ocean Sparse Grid ---
        if (data.ocean && data.ocean.length > 0) {
          const oceanGeom = new THREE.BufferGeometry()
          const oceanPositions = new Float32Array(data.ocean.length * 3)

          for (let i = 0; i < data.ocean.length; i++) {
            const [x, y, z] = data.ocean[i]
            oceanPositions[i * 3] = x * GLOBE_RADIUS
            oceanPositions[i * 3 + 1] = y * GLOBE_RADIUS
            oceanPositions[i * 3 + 2] = z * GLOBE_RADIUS
          }

          oceanGeom.setAttribute('position', new THREE.BufferAttribute(oceanPositions, 3))

          const oceanMat = new THREE.PointsMaterial({
            size: 2.0,
            color: 0x0369a1,
            map: glowTexture,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })

          oceanPointsMesh = new THREE.Points(oceanGeom, oceanMat)
          globeGroup.add(oceanPointsMesh)
        }

        setDataLoaded(true)
      })
      .catch((err) => console.error('Error loading globe points:', err))

    // 4. Large 3D Orbital Trajectories (Ellipses looping around the globe, like reference image)
    const orbitsGroup = new THREE.Group()
    const orbitCount = 8
    const orbitAngles = [
      { rx: 0.35, ry: 0.2, rz: 0.1, scale: 1.12, col: 0x38bdf8, op: 0.55 },
      { rx: 1.15, ry: -0.4, rz: 0.6, scale: 1.18, col: 0x06b6d4, op: 0.45 },
      { rx: -0.85, ry: 0.6, rz: -0.5, scale: 1.15, col: 0x0ea5e9, op: 0.5 },
      { rx: 0.7, ry: 1.2, rz: -0.2, scale: 1.22, col: 0x38bdf8, op: 0.4 },
      { rx: -1.3, ry: -0.7, rz: 0.9, scale: 1.25, col: 0x06b6d4, op: 0.35 },
      { rx: 0.1, ry: -1.1, rz: 1.2, scale: 1.16, col: 0x0284c7, op: 0.4 },
      { rx: 1.45, ry: 0.3, rz: -0.8, scale: 1.2, col: 0x06b6d4, op: 0.45 },
      { rx: -0.4, ry: 1.4, rz: 0.4, scale: 1.14, col: 0x38bdf8, op: 0.5 },
    ]

    orbitAngles.forEach((cfg) => {
      const radiusX = GLOBE_RADIUS * cfg.scale
      const radiusY = GLOBE_RADIUS * (cfg.scale * 0.95)
      const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusY, 0, 2 * Math.PI, false, 0)
      const points = curve.getPoints(140)
      const geom = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, p.y, 0))
      )
      const mat = new THREE.LineBasicMaterial({
        color: cfg.col,
        transparent: true,
        opacity: cfg.op,
        blending: THREE.AdditiveBlending,
      })
      const orbitLine = new THREE.Line(geom, mat)
      orbitLine.rotation.set(cfg.rx, cfg.ry, cfg.rz)
      orbitsGroup.add(orbitLine)
    })
    globeGroup.add(orbitsGroup)

    // 5. Great Circle Connection Arcs & Cyber Light Pulses
    const arcCurves: THREE.QuadraticBezierCurve3[] = []
    const arcLinesGroup = new THREE.Group()

    CONNECTIONS.forEach(([srcIdx, dstIdx]) => {
      const srcNode = NODES[srcIdx]
      const dstNode = NODES[dstIdx]
      if (!srcNode || !dstNode) return

      const p1 = latLonToVector3(srcNode.lat, srcNode.lon, GLOBE_RADIUS)
      const p2 = latLonToVector3(dstNode.lat, dstNode.lon, GLOBE_RADIUS)

      // Calculate midpoint and elevate outward
      const mid = p1.clone().add(p2).multiplyScalar(0.5)
      const distance = p1.distanceTo(p2)
      const elevation = Math.min(distance * 0.38, 48)
      mid.normalize().multiplyScalar(GLOBE_RADIUS + elevation)

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2)
      arcCurves.push(curve)

      const points = curve.getPoints(45)
      const geom = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({
        color: srcIdx === 0 ? 0x38bdf8 : 0x06b6d4,
        transparent: true,
        opacity: srcIdx === 0 ? 0.75 : 0.45,
        blending: THREE.AdditiveBlending,
      })
      const arcLine = new THREE.Line(geom, mat)
      arcLinesGroup.add(arcLine)
    })
    globeGroup.add(arcLinesGroup)

    // Cyber Photons / Traveling Packets along arcs
    const packetCount = arcCurves.length * 2
    const packetGeom = new THREE.BufferGeometry()
    const packetPositions = new Float32Array(packetCount * 3)
    packetGeom.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3))

    const packetMat = new THREE.PointsMaterial({
      size: 5.5,
      color: 0xffffff,
      map: glowTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const packetMesh = new THREE.Points(packetGeom, packetMat)
    globeGroup.add(packetMesh)

    // Packet state
    const packets = Array.from({ length: packetCount }, (_, i) => ({
      curveIdx: i % arcCurves.length,
      progress: (i / packetCount) + Math.random() * 0.2,
      speed: 0.004 + (Math.random() * 0.003),
    }))

    // 6. Beacons / Hotspots (CECAR and global research hubs)
    const beaconsGroup = new THREE.Group()
    const beaconRings: { mesh: THREE.Mesh; scale: number; baseScale: number }[] = []

    NODES.forEach((node) => {
      const pos = latLonToVector3(node.lat, node.lon, GLOBE_RADIUS * 1.01)

      // Solid inner core marker
      const coreGeom = new THREE.SphereGeometry(node.isHub ? 3.5 : 2.2, 16, 16)
      const coreMat = new THREE.MeshBasicMaterial({
        color: node.isHub ? 0x38bdf8 : 0x10b981,
      })
      const coreMesh = new THREE.Mesh(coreGeom, coreMat)
      coreMesh.position.copy(pos)
      beaconsGroup.add(coreMesh)

      // Glowing pulsing ring target (like the CenturyLink reference rings)
      const ringGeom = new THREE.RingGeometry(node.isHub ? 5.5 : 3.8, node.isHub ? 7.2 : 5.0, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.isHub ? 0x06b6d4 : 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      })
      const ringMesh = new THREE.Mesh(ringGeom, ringMat)
      ringMesh.position.copy(pos)
      ringMesh.lookAt(pos.clone().multiplyScalar(2)) // Orient ring tangent to sphere
      beaconsGroup.add(ringMesh)

      beaconRings.push({
        mesh: ringMesh,
        scale: 1,
        baseScale: 1,
      })
    })
    globeGroup.add(beaconsGroup)

    // 7. Interactive Mouse / Touch Parallax & Rotation
    let isDragging = false
    let prevMouseX = 0
    let prevMouseY = 0
    let targetRotY = 0
    let targetRotX = 0
    let autoRotationSpeed = 0.0022

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      prevMouseX = clientX
      prevMouseY = clientY
    }

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      if (isDragging) {
        const deltaX = clientX - prevMouseX
        const deltaY = clientY - prevMouseY
        targetRotY += deltaX * 0.005
        targetRotX += deltaY * 0.003
        prevMouseX = clientX
        prevMouseY = clientY
      } else {
        // Subtle ambient parallax when hovering
        const rect = container.getBoundingClientRect()
        const normX = ((clientX - rect.left) / rect.width) * 2 - 1
        const normY = -(((clientY - rect.top) / rect.height) * 2 - 1)
        camera.position.x = normX * 24
        camera.position.y = 20 + normY * 16
        camera.lookAt(0, 0, 0)
      }
    }

    const handlePointerUp = () => {
      isDragging = false
    }

    container.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('mousemove', handlePointerMove)
    window.addEventListener('mouseup', handlePointerUp)
    container.addEventListener('touchstart', handlePointerDown, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })
    window.addEventListener('touchend', handlePointerUp)

    // Resize observer
    const handleResize = () => {
      if (!container) return
      width = container.clientWidth || 600
      height = container.clientHeight || 600
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    // 8. Animation Render Loop
    let animationFrameId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Continuous rotation
      globeGroup.rotation.y += autoRotationSpeed
      if (targetRotY !== 0) {
        globeGroup.rotation.y += targetRotY * 0.1
        targetRotY *= 0.92
      }
      if (targetRotX !== 0) {
        globeGroup.rotation.x += targetRotX * 0.1
        targetRotX *= 0.92
      }

      // Slowly rotate orbits slightly counter for deep dimensionality
      orbitsGroup.rotation.y -= 0.0006

      // Animate packet movements along network arcs
      const posAttr = packetGeom.getAttribute('position') as THREE.BufferAttribute
      if (posAttr) {
        const posArray = posAttr.array as Float32Array
        packets.forEach((p, idx) => {
          p.progress = (p.progress + p.speed) % 1
          const curve = arcCurves[p.curveIdx]
          if (curve) {
            const pt = curve.getPoint(p.progress)
            posArray[idx * 3] = pt.x
            posArray[idx * 3 + 1] = pt.y
            posArray[idx * 3 + 2] = pt.z
          }
        })
        posAttr.needsUpdate = true
      }

      // Animate beacon pulsing target rings
      beaconRings.forEach((ring, idx) => {
        const pulse = 1 + Math.sin(elapsedTime * 3.5 + idx * 0.8) * 0.35
        ring.mesh.scale.set(pulse, pulse, pulse)
        const mat = ring.mesh.material as THREE.MeshBasicMaterial
        if (mat) {
          mat.opacity = 0.5 + Math.sin(elapsedTime * 3.5 + idx * 0.8) * 0.4
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      container.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('mouseup', handlePointerUp)
      container.removeEventListener('touchstart', handlePointerDown)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('touchend', handlePointerUp)

      glowTexture.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="security-globe-wrapper" aria-hidden="true">
      {/* Ambient background glow behind the globe */}
      <div className="security-globe-halo" />
      <div ref={mountRef} className="security-globe-canvas-mount" />
    </div>
  )
}
