'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const OCT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --bg: #07090f;
  --surface: #0d1117;
  --panel: #111927;
  --border: #1e2d42;
  --accent: #00d4ff;
  --accent2: #00ff9d;
  --accent3: #ff6b35;
  --warn: #ffc947;
  --danger: #ff4757;
  --text: #cdd9e5;
  --muted: #5a7a96;
  --bright: #e6f1ff;
  --grid: rgba(0,212,255,0.04);
}

.oct-app * { box-sizing: border-box; margin: 0; padding: 0; }

.oct-app {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

.oct-app::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.oct-app .app {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* HEADER */
.oct-app header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  background: rgba(13,17,23,0.92);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.oct-app .logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.oct-app .logo-icon {
  width: 36px; height: 36px;
  border: 1.5px solid var(--accent);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  overflow: hidden;
}

.oct-app .logo-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 120%, rgba(0,212,255,0.3), transparent 60%);
}

.oct-app .logo-icon svg { width: 20px; height: 20px; color: var(--accent); }
.oct-app .logo-text { font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700; color: var(--bright); letter-spacing: 0.5px; }
.oct-app .logo-sub { font-size: 11px; color: var(--muted); margin-top: 1px; }
.oct-app .header-right { display: flex; align-items: center; gap: 16px; }
.oct-app .version-tag { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent); background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.2); padding: 3px 8px; border-radius: 4px; }

.oct-app .back-link {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: var(--muted);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: all 0.2s;
}

.oct-app .back-link:hover {
  color: var(--accent);
  border-color: var(--accent);
}

/* MAIN LAYOUT */
.oct-app main {
  display: flex;
  flex: 1;
  gap: 0;
  height: calc(100vh - 57px);
}

/* LEFT PANEL */
.oct-app .left-panel {
  width: 260px;
  min-width: 260px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.oct-app .panel-section {
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.oct-app .panel-label {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 12px;
}

/* UPLOAD ZONE */
.oct-app .upload-zone {
  border: 1.5px dashed var(--border);
  border-radius: 10px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.oct-app .upload-zone:hover {
  border-color: var(--accent);
  background: rgba(0,212,255,0.04);
}

.oct-app .upload-zone input[type=file] {
  position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%;
}

.oct-app .upload-icon { width: 32px; height: 32px; margin: 0 auto 10px; color: var(--muted); }
.oct-app .upload-text { font-size: 12px; color: var(--muted); }
.oct-app .upload-text strong { display: block; color: var(--text); font-size: 13px; margin-bottom: 4px; }

/* SCALE CALIBRATION */
.oct-app .scale-row { display: flex; align-items: center; gap: 8px; }

.oct-app .input-field {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--bright);
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  padding: 7px 10px;
  width: 100%;
  transition: border-color 0.2s;
}

.oct-app .input-field:focus { outline: none; border-color: var(--accent); }
.oct-app .input-label { font-size: 11px; color: var(--muted); white-space: nowrap; }

/* TOOL BUTTONS */
.oct-app .tool-grid { display: flex; flex-direction: column; gap: 6px; }

.oct-app .tool-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: var(--text);
  cursor: pointer;
  transition: all 0.18s;
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.oct-app .tool-btn:hover { border-color: var(--accent); color: var(--bright); }

.oct-app .tool-btn.active {
  border-color: var(--accent);
  background: rgba(0,212,255,0.1);
  color: var(--accent);
}

.oct-app .tool-btn.active::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--accent);
  border-radius: 2px 0 0 2px;
}

.oct-app .tool-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

.oct-app .tool-count {
  margin-left: auto;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  color: var(--muted);
  background: var(--surface);
  padding: 1px 6px;
  border-radius: 10px;
}

.oct-app .tool-count.done { color: var(--accent2); background: rgba(0,255,157,0.1); }

/* ACTION BUTTONS */
.oct-app .btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.18s;
  width: 100%;
}

.oct-app .btn-primary { background: var(--accent); color: #000; }
.oct-app .btn-primary:hover { background: #33ddff; transform: translateY(-1px); }
.oct-app .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--muted); }
.oct-app .btn-ghost:hover { border-color: var(--muted); color: var(--text); }
.oct-app .btn-danger { background: rgba(255,71,87,0.1); border: 1px solid rgba(255,71,87,0.3); color: var(--danger); }
.oct-app .btn-danger:hover { background: rgba(255,71,87,0.2); }

/* CANVAS AREA */
.oct-app .canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #040608;
  position: relative;
  overflow: hidden;
}

.oct-app .canvas-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.oct-app .toolbar-group { display: flex; align-items: center; gap: 6px; }
.oct-app .toolbar-sep { width: 1px; height: 20px; background: var(--border); }

.oct-app .icon-btn {
  width: 30px; height: 30px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--panel);
  color: var(--text);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  font-size: 13px;
}
.oct-app .icon-btn:hover { border-color: var(--accent); color: var(--accent); }

.oct-app .canvas-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: crosshair;
}

.oct-app #mainCanvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
  image-rendering: pixelated;
}

.oct-app .drop-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--muted);
  pointer-events: none;
}

.oct-app .drop-overlay svg { width: 56px; height: 56px; color: var(--border); }
.oct-app .drop-overlay h2 { font-size: 18px; font-weight: 400; color: var(--text); }
.oct-app .drop-overlay p { font-size: 13px; max-width: 320px; text-align: center; line-height: 1.6; }

/* RIGHT PANEL */
.oct-app .right-panel {
  width: 300px;
  min-width: 300px;
  background: var(--surface);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.oct-app .measure-card { padding: 12px 16px; border-bottom: 1px solid var(--border); }

.oct-app .measure-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 5px 0;
  border-bottom: 1px solid rgba(30,45,66,0.5);
}

.oct-app .measure-row:last-child { border-bottom: none; }
.oct-app .measure-name { font-size: 12px; color: var(--muted); }
.oct-app .measure-abbr { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent); margin-left: 4px; }
.oct-app .measure-val { font-family: 'Space Mono', monospace; font-size: 13px; color: var(--bright); }
.oct-app .measure-val.pending { color: var(--muted); font-size: 11px; }

.oct-app .index-card { margin: 0 16px 10px; border-radius: 10px; border: 1px solid var(--border); overflow: hidden; }

.oct-app .index-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  background: var(--panel);
}

.oct-app .index-name { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: var(--bright); }
.oct-app .index-badge { font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700; }
.oct-app .index-body { padding: 8px 12px; }
.oct-app .index-desc { font-size: 11px; color: var(--muted); margin-bottom: 6px; line-height: 1.5; }
.oct-app .index-bar-wrap { height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; margin-bottom: 5px; }
.oct-app .index-bar { height: 100%; border-radius: 2px; transition: width 0.5s ease; }
.oct-app .index-interp { font-size: 11px; font-weight: 600; }

.oct-app .prognosis-box {
  margin: 12px 16px;
  border-radius: 12px;
  border: 1px solid;
  padding: 14px;
  position: relative;
  overflow: hidden;
}

.oct-app .prognosis-label { font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
.oct-app .prognosis-title { font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.oct-app .prognosis-detail { font-size: 11px; line-height: 1.6; opacity: 0.8; }
.oct-app .prognosis-icon { position: absolute; right: 14px; top: 14px; font-size: 28px; opacity: 0.4; }

.oct-app .section-title {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--muted);
  text-transform: uppercase;
  padding: 14px 16px 8px;
}

.oct-app .legend { padding: 10px 16px; border-top: 1px solid var(--border); margin-top: auto; }
.oct-app .legend-item { display: flex; align-items: center; gap: 8px; padding: 3px 0; font-size: 11px; color: var(--muted); }
.oct-app .legend-line { width: 20px; height: 2px; border-radius: 1px; }
.oct-app .legend-dot-swatch { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.oct-app .status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  color: var(--muted);
}

.oct-app .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent2); display: inline-block; margin-right: 6px; }
.oct-app .zoom-label { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); }
.oct-app .undo-btn { margin-top: 6px; }

.oct-app ::-webkit-scrollbar { width: 4px; }
.oct-app ::-webkit-scrollbar-track { background: transparent; }
.oct-app ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
`

export default function AnnotationToolPage() {
  const fnRef = useRef<Record<string, (...args: unknown[]) => unknown>>({})

  useEffect(() => {
    const COLORS: Record<string, string> = {
      apex:      '#ff6b35',
      minDiam:   '#ffc947',
      base:      '#00d4ff',
      leftRim:   '#00ff9d',
      rightRim:  '#bd93f9',
      outerBase: '#ff79c6',
    }

    const POINT_LIMITS: Record<string, number> = {
      apex: 1, minDiam: 2, base: 2, leftRim: 2, rightRim: 2, outerBase: 2
    }

    type Point = { x: number; y: number }
    type CanvasPoint = { x: number; y: number }

    const state = {
      image: null as HTMLImageElement | null,
      scale: 3.87,
      currentTool: null as string | null,
      points: { apex: [] as Point[], minDiam: [] as Point[], base: [] as Point[], leftRim: [] as Point[], rightRim: [] as Point[], outerBase: [] as Point[] },
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
      canvasW: 0,
      canvasH: 0,
    }

    let overlayOn = true

    const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const canvasWrap = document.getElementById('canvasWrap') as HTMLElement

    function resizeCanvas() {
      canvas.width = canvasWrap.clientWidth
      canvas.height = canvasWrap.clientHeight
      state.canvasW = canvas.width
      state.canvasH = canvas.height
      render()
    }

    function loadImageFile(file: File) {
      const reader = new FileReader()
      reader.onload = ev => {
        const img = new Image()
        img.onload = () => {
          state.image = img
          clearAll(true)
          fitImage()
          const overlay = document.getElementById('dropOverlay')
          if (overlay) overlay.style.display = 'none'
          setStatus('Image loaded — select an annotation mode and click on the scan')
        }
        img.src = ev.target?.result as string
      }
      reader.readAsDataURL(file)
    }

    function fitImage() {
      if (!state.image) return
      const cw = state.canvasW, ch = state.canvasH
      const iw = state.image.width, ih = state.image.height
      const s = Math.min(cw / iw, ch / ih) * 0.95
      state.zoom = s
      state.offsetX = (cw - iw * s) / 2
      state.offsetY = (ch - ih * s) / 2
      updateZoomLabel()
      render()
    }

    function selectTool(tool: string) {
      state.currentTool = tool
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'))
      const btn = document.querySelector(`[data-tool="${tool}"]`)
      if (btn) btn.classList.add('active')
      setStatus(`Mode: ${toolName(tool)} — click on OCT to place point`)
    }

    function toolName(t: string) {
      const names: Record<string, string> = {
        apex: 'Hole Apex', minDiam: 'Minimum Diameter', base: 'Base Diameter (RPE)',
        leftRim: 'Left Rim Angle', rightRim: 'Right Rim Angle', outerBase: 'Outer Base'
      }
      return names[t] || t
    }

    function canvasToImg(cx: number, cy: number) {
      return { x: (cx - state.offsetX) / state.zoom, y: (cy - state.offsetY) / state.zoom }
    }

    function imgToCanvas(ix: number, iy: number) {
      return { x: ix * state.zoom + state.offsetX, y: iy * state.zoom + state.offsetY }
    }

    function onCanvasClick(e: MouseEvent) {
      if (!state.image || !state.currentTool) return
      const rect = canvas.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const pt = canvasToImg(cx, cy)
      const tool = state.currentTool
      const limit = POINT_LIMITS[tool]
      const pts = state.points[tool as keyof typeof state.points]
      if (pts.length >= limit) pts.length = 0
      pts.push(pt)
      updateCounters()
      render()
      setStatus(`Point placed for ${toolName(tool)} (${pts.length}/${limit})`)
    }

    function onMouseMove(e: MouseEvent) {
      if (!state.image) return
      const rect = canvas.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const pt = canvasToImg(cx, cy)
      const coordEl = document.getElementById('coordText')
      if (coordEl) coordEl.textContent = `x:${Math.round(pt.x)} y:${Math.round(pt.y)}`
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      zoom(e.deltaY < 0 ? 1.1 : 0.9, mx, my)
    }

    function zoom(factor: number, mx?: number, my?: number) {
      if (!mx) mx = canvas.width / 2
      if (!my) my = canvas.height / 2
      const newZoom = Math.max(0.1, Math.min(20, state.zoom * factor))
      state.offsetX = mx - (mx - state.offsetX) * (newZoom / state.zoom)
      state.offsetY = my - (my - state.offsetY) * (newZoom / state.zoom)
      state.zoom = newZoom
      updateZoomLabel()
      render()
    }

    function resetZoom() { fitImage() }

    function updateZoomLabel() {
      const el = document.getElementById('zoomLabel')
      if (el) el.textContent = Math.round(state.zoom * 100) + '%'
    }

    function toggleOverlay() {
      overlayOn = !overlayOn
      const btn = document.getElementById('overlayBtn')
      if (btn) btn.style.opacity = overlayOn ? '1' : '0.4'
      render()
    }

    function render() {
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#040608'
      ctx.fillRect(0, 0, w, h)
      if (!state.image) return
      ctx.save()
      ctx.translate(state.offsetX, state.offsetY)
      ctx.scale(state.zoom, state.zoom)
      ctx.drawImage(state.image, 0, 0)
      ctx.restore()
      if (!overlayOn) return
      drawAnnotations()
    }

    function drawAnnotations() {
      const base = state.points.base
      if (base.length === 2) {
        const a = imgToCanvas(base[0].x, base[0].y)
        const b = imgToCanvas(base[1].x, base[1].y)
        drawMeasureLine(a, b, '#00d4ff', 'BD', true)
      }

      const ob = state.points.outerBase
      if (ob.length === 2) {
        const a = imgToCanvas(ob[0].x, ob[0].y)
        const b = imgToCanvas(ob[1].x, ob[1].y)
        drawMeasureLine(a, b, '#ff79c6', 'OBD', true, true)
      }

      const md = state.points.minDiam
      if (md.length === 2) {
        const a = imgToCanvas(md[0].x, md[0].y)
        const b = imgToCanvas(md[1].x, md[1].y)
        drawMeasureLine(a, b, '#ffc947', 'MHD')
      }

      const apex = state.points.apex
      if (apex.length === 1 && base.length === 2) {
        const bc = midpoint(imgToCanvas(base[0].x, base[0].y), imgToCanvas(base[1].x, base[1].y))
        const ac = imgToCanvas(apex[0].x, apex[0].y)
        drawMeasureLine(ac, bc, '#ff6b35', 'MHH', false)
      }

      const lr = state.points.leftRim
      if (lr.length === 2) {
        const a = imgToCanvas(lr[0].x, lr[0].y)
        const b = imgToCanvas(lr[1].x, lr[1].y)
        drawAngleLine(a, b, '#00ff9d', 'θL')
      }

      const rr = state.points.rightRim
      if (rr.length === 2) {
        const a = imgToCanvas(rr[0].x, rr[0].y)
        const b = imgToCanvas(rr[1].x, rr[1].y)
        drawAngleLine(a, b, '#bd93f9', 'θR')
      }

      Object.entries(state.points).forEach(([tool, pts]) => {
        pts.forEach((pt, i) => {
          const c = imgToCanvas(pt.x, pt.y)
          drawPoint(c.x, c.y, COLORS[tool], i + 1)
        })
      })
    }

    function drawMeasureLine(a: CanvasPoint, b: CanvasPoint, color: string, label: string, drawTicks = false, dashed = false) {
      ctx.save()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      if (dashed) ctx.setLineDash([5, 4])
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
      ctx.setLineDash([])
      if (drawTicks) {
        const angle = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2
        const tickLen = 7;
        [a, b].forEach(pt => {
          ctx.beginPath()
          ctx.moveTo(pt.x + Math.cos(angle) * tickLen, pt.y + Math.sin(angle) * tickLen)
          ctx.lineTo(pt.x - Math.cos(angle) * tickLen, pt.y - Math.sin(angle) * tickLen)
          ctx.stroke()
        })
      }
      const mx = (a.x + b.x) / 2
      const my = (a.y + b.y) / 2
      ctx.fillStyle = color
      ctx.font = 'bold 11px "Space Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText(label, mx, my - 8)
      ctx.restore()
    }

    function drawAngleLine(a: CanvasPoint, b: CanvasPoint, color: string, label: string) {
      ctx.save()
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.setLineDash([6, 3])
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = color
      ctx.font = 'bold 11px "Space Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText(label, b.x + 14, b.y)
      ctx.restore()
    }

    function drawPoint(x: number, y: number, color: string, num: number) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, 7, 0, Math.PI * 2)
      ctx.fillStyle = color + '33'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 0.8
      ctx.stroke()
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 8px "Space Mono", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(num), x, y)
      ctx.textBaseline = 'alphabetic'
      ctx.restore()
    }

    function midpoint(a: CanvasPoint, b: CanvasPoint) {
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
    }

    function imgDist(a: Point, b: Point) {
      return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) * state.scale
    }

    function lineAngle(a: Point, b: Point) {
      return Math.abs(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI)
    }

    function calculateAll() {
      const pts = state.points
      const results: Record<string, number | undefined> = {}

      if (pts.apex.length === 1 && pts.base.length === 2) {
        const baseMid = { x: (pts.base[0].x + pts.base[1].x) / 2, y: (pts.base[0].y + pts.base[1].y) / 2 }
        results.MHH = imgDist(pts.apex[0], baseMid)
      }
      if (pts.minDiam.length === 2) results.MHD = imgDist(pts.minDiam[0], pts.minDiam[1])
      if (pts.base.length === 2) results.BD = imgDist(pts.base[0], pts.base[1])
      if (pts.outerBase.length === 2) results.OBD = imgDist(pts.outerBase[0], pts.outerBase[1])
      if (pts.leftRim.length === 2) results.THL = lineAngle(pts.leftRim[0], pts.leftRim[1])
      if (pts.rightRim.length === 2) results.THR = lineAngle(pts.rightRim[0], pts.rightRim[1])

      if (results.MHH != null && results.BD != null) results.MHI = results.MHH / results.BD
      if (results.MHD != null && results.MHH != null) {
        results.DHI = results.MHD / results.MHH
        results.THI = results.MHH / results.MHD
      }
      if (results.MHD != null && results.BD != null) {
        let hff = 1 - (results.MHD / results.BD)
        if (results.OBD != null) hff = 1 - (results.MHD / results.BD + results.MHD / results.OBD) / 2
        results.HFF = Math.max(0, Math.min(1, hff))
      }
      if (results.MHI != null && results.DHI != null) results.CI = results.MHI * results.DHI

      updateUI(results)
      return results
    }

    function fmt(v: number | undefined, unit = 'µm', dec = 0) {
      if (v == null) return '—'
      return v.toFixed(dec) + ' ' + unit
    }

    function fmtIdx(v: number) { return v.toFixed(3) }

    function updateUI(r: Record<string, number | undefined>) {
      setVal('val-MHH', fmt(r.MHH))
      setVal('val-MHD', fmt(r.MHD))
      setVal('val-BD', fmt(r.BD))
      setVal('val-OBD', fmt(r.OBD))
      setVal('val-THL', r.THL != null ? r.THL.toFixed(1) + '°' : '—')
      setVal('val-THR', r.THR != null ? r.THR.toFixed(1) + '°' : '—')

      updateIndex('MHI', r.MHI, v => {
        const pct = Math.min(100, v * 100)
        const col = v >= 0.9 ? '#00ff9d' : v >= 0.5 ? '#ffc947' : '#ff4757'
        return { pct, col, interp: v >= 0.9 ? '✓ Excellent — high closure probability' : v >= 0.5 ? '△ Good — favourable for PPV closure' : '⚠ Guarded — lower closure likelihood', intCol: col }
      })
      updateIndex('DHI', r.DHI, v => {
        const pct = Math.min(100, v * 100)
        const col = v >= 0.5 ? '#00ff9d' : v >= 0.3 ? '#ffc947' : '#ff4757'
        return { pct, col, interp: v >= 0.5 ? '✓ Flat profile — good prognosis' : v >= 0.3 ? '△ Moderate depth' : '⚠ Deep, tall hole', intCol: col }
      })
      updateIndex('THI', r.THI, v => {
        const pct = Math.min(100, (v / 3) * 100)
        const col = v < 0.9 ? '#00ff9d' : v < 1.5 ? '#ffc947' : '#ff4757'
        return { pct, col, interp: v < 0.9 ? '✓ Low traction — favourable' : v < 1.5 ? '△ Moderate tractional component' : '⚠ High traction — consider ILM peel strategy', intCol: col }
      })
      updateIndex('HFF', r.HFF, v => {
        const pct = Math.min(100, v * 100)
        const col = v >= 0.9 ? '#00ff9d' : v >= 0.5 ? '#ffc947' : '#ff4757'
        return { pct, col, interp: v >= 0.9 ? '✓ Near-ideal form factor' : v >= 0.5 ? '△ Moderate form factor' : '⚠ Poor form — wide base relative to waist', intCol: col }
      })
      updateIndex('CI', r.CI, v => {
        const pct = Math.min(100, v * 100)
        const col = v >= 0.5 ? '#00ff9d' : v >= 0.2 ? '#ffc947' : '#ff4757'
        return { pct, col, interp: v >= 0.5 ? '✓ High composite closure score' : v >= 0.2 ? '△ Moderate closure probability' : '⚠ Low closure score — challenging case', intCol: col }
      })

      showPrognosis(r)
      setStatus('Indices calculated successfully')
    }

    function setVal(id: string, v: string) {
      const el = document.getElementById(id)
      if (!el) return
      el.textContent = v
      el.className = v === '—' ? 'measure-val pending' : 'measure-val'
    }

    function updateIndex(name: string, val: number | undefined, fn: (v: number) => { pct: number; col: string; interp: string; intCol: string }) {
      const badge = document.getElementById('badge-' + name)
      const bar = document.getElementById('bar-' + name) as HTMLElement | null
      const interp = document.getElementById('interp-' + name)
      if (!badge || !bar || !interp) return
      if (val == null) {
        badge.textContent = '—'
        badge.style.color = 'var(--muted)'
        bar.style.width = '0%'
        interp.textContent = 'Awaiting data'
        interp.style.color = 'var(--muted)'
        return
      }
      const res = fn(val)
      badge.textContent = fmtIdx(val)
      badge.style.color = res.col
      bar.style.width = res.pct + '%'
      bar.style.background = res.col
      interp.textContent = res.interp
      interp.style.color = res.intCol
    }

    function showPrognosis(r: Record<string, number | undefined>) {
      const box = document.getElementById('prognosisBox')
      const pending = document.getElementById('pendingPrognosis')
      if (!box || !pending || !r.MHI) return
      box.style.display = 'block'
      pending.style.display = 'none'

      let score = 0, max = 0
      if (r.MHI != null) { score += r.MHI >= 0.9 ? 3 : r.MHI >= 0.5 ? 2 : 0; max += 3 }
      if (r.THI != null) { score += r.THI < 0.9 ? 3 : r.THI < 1.5 ? 1 : 0; max += 3 }
      if (r.HFF != null) { score += r.HFF >= 0.9 ? 2 : r.HFF >= 0.5 ? 1 : 0; max += 2 }
      if (r.CI  != null) { score += r.CI  >= 0.5 ? 2 : r.CI  >= 0.2 ? 1 : 0; max += 2 }
      if (r.DHI != null) { score += r.DHI >= 0.5 ? 2 : r.DHI >= 0.3 ? 1 : 0; max += 2 }

      const pct = max > 0 ? score / max : 0
      let prog: { label: string; title: string; detail: string; icon: string; border: string; bg: string }

      if (pct >= 0.8) {
        prog = { label: 'SURGICAL PROGNOSIS', title: 'Excellent', detail: 'High probability of anatomical closure with primary PPV + ILM peel + gas tamponade. Type 1 closure expected. Long-term visual recovery likely if presenting VA ≥ 6/60.', icon: '✦', border: '#00ff9d', bg: 'rgba(0,255,157,0.05)' }
      } else if (pct >= 0.55) {
        prog = { label: 'SURGICAL PROGNOSIS', title: 'Good', detail: 'Favourable for primary PPV closure. Consider extended gas tamponade (C3F8) or prone positioning. Functional outcome depends on duration and pre-op visual acuity.', icon: '◈', border: '#00d4ff', bg: 'rgba(0,212,255,0.05)' }
      } else if (pct >= 0.35) {
        prog = { label: 'SURGICAL PROGNOSIS', title: 'Guarded', detail: 'Anatomical closure possible but closure rate may be reduced. Consider adjuncts: autologous serum, crystallin lens capsule graft, or inverted ILM flap technique. Long duration of symptoms warrants discussion of realistic expectations.', icon: '⬡', border: '#ffc947', bg: 'rgba(255,201,71,0.05)' }
      } else {
        prog = { label: 'SURGICAL PROGNOSIS', title: 'Challenging', detail: 'Complex hole — high base diameter, significant traction, or unfavourable morphology. Inverted ILM flap or amniotic membrane graft should be considered. Realistic discussion of closure rates and visual gain required pre-operatively.', icon: '⚠', border: '#ff4757', bg: 'rgba(255,71,87,0.05)' }
      }

      box.style.borderColor = prog.border
      box.style.background = prog.bg
      const progLabel = document.getElementById('prog-label')
      const progTitle = document.getElementById('prog-title')
      const progDetail = document.getElementById('prog-detail')
      const progIcon = document.getElementById('prog-icon')
      if (progLabel) { progLabel.style.color = prog.border; progLabel.textContent = prog.label }
      if (progTitle) { progTitle.style.color = prog.border; progTitle.textContent = prog.title }
      if (progDetail) progDetail.textContent = prog.detail
      if (progIcon) { progIcon.textContent = prog.icon; progIcon.style.color = prog.border }
    }

    function updateCounters() {
      Object.entries(state.points).forEach(([tool, pts]) => {
        const el = document.getElementById('cnt-' + tool)
        if (!el) return
        const limit = POINT_LIMITS[tool]
        el.textContent = `${pts.length}/${limit}`
        el.className = 'tool-count' + (pts.length === limit ? ' done' : '')
      })
    }

    function undoLast() {
      if (!state.currentTool) return
      const pts = state.points[state.currentTool as keyof typeof state.points]
      if (pts.length > 0) {
        pts.pop()
        updateCounters()
        render()
        setStatus('Last point removed')
      }
    }

    function clearAll(silent = false) {
      Object.keys(state.points).forEach(k => { (state.points[k as keyof typeof state.points] as Point[]).length = 0 })
      updateCounters();
      ['MHH', 'MHD', 'BD', 'OBD', 'THL', 'THR'].forEach(id => setVal('val-' + id, '—'));
      ['MHI', 'DHI', 'THI', 'HFF', 'CI'].forEach(id => updateIndex(id, undefined, () => ({ pct: 0, col: '', interp: '', intCol: '' })))
      const box = document.getElementById('prognosisBox')
      const pending = document.getElementById('pendingPrognosis')
      if (box) box.style.display = 'none'
      if (pending) pending.style.display = 'block'
      render()
      if (!silent) setStatus('All annotations cleared')
    }

    function setStatus(msg: string) {
      const el = document.getElementById('statusText')
      if (el) el.textContent = msg
    }

    function exportCanvas() {
      if (!state.image) return
      const link = document.createElement('a')
      link.download = 'macular_hole_analysis.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    // Expose functions to JSX handlers
    fnRef.current = { selectTool, calculateAll, undoLast, clearAll: () => clearAll(false), zoom, resetZoom, toggleOverlay, exportCanvas }

    // Init
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    canvas.addEventListener('click', onCanvasClick)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null
    if (fileInput) {
      fileInput.addEventListener('change', e => {
        const f = (e.target as HTMLInputElement).files?.[0]
        if (f) loadImageFile(f)
      })
    }

    const scaleInput = document.getElementById('scaleInput') as HTMLInputElement | null
    if (scaleInput) {
      scaleInput.addEventListener('input', e => {
        state.scale = parseFloat((e.target as HTMLInputElement).value) || 3.87
      })
    }

    canvasWrap.addEventListener('dragover', e => e.preventDefault())
    canvasWrap.addEventListener('drop', e => {
      e.preventDefault()
      const f = (e as DragEvent).dataTransfer?.files[0]
      if (f && f.type.startsWith('image/')) loadImageFile(f)
    })

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('click', onCanvasClick)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [])

  const call = (name: string, ...args: unknown[]) => fnRef.current[name]?.(...args)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: OCT_CSS }} />
      <div className="oct-app">
        <div className="app">
          {/* HEADER */}
          <header>
            <div className="logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M8 12 Q10 6 12 12 Q14 18 16 12" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
                </svg>
              </div>
              <div>
                <div className="logo-text">RETINA·SCOPE</div>
                <div className="logo-sub">OCT Macular Hole Analyser</div>
              </div>
            </div>
            <div className="header-right">
              <span className="version-tag">v2.1 · CLINICAL</span>
              <Link href="/" className="back-link">← Back to OCTina</Link>
            </div>
          </header>

          <main>
            {/* LEFT PANEL */}
            <div className="left-panel">
              {/* UPLOAD */}
              <div className="panel-section">
                <div className="panel-label">OCT Image</div>
                <div className="upload-zone" id="uploadZone">
                  <input type="file" id="fileInput" accept="image/*" />
                  <div className="upload-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                  </div>
                  <div className="upload-text">
                    <strong>Load OCT Scan</strong>
                    Click or drag image here
                  </div>
                </div>
              </div>

              {/* SCALE */}
              <div className="panel-section">
                <div className="panel-label">Scale Calibration</div>
                <div style={{ marginBottom: 8 }}>
                  <div className="input-label" style={{ marginBottom: 5 }}>μm per pixel (scale)</div>
                  <div className="scale-row">
                    <input type="number" id="scaleInput" className="input-field" defaultValue="3.87" step="0.01" min="0.1" placeholder="μm/px" />
                    <span className="input-label">μm/px</span>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.5 }}>
                  Common values: Topcon DRI ~3.87, Heidelberg Spectralis ~3.87–7.8 (varies by scan protocol)
                </div>
              </div>

              {/* TOOLS */}
              <div className="panel-section">
                <div className="panel-label">Annotation Mode</div>
                <div className="tool-grid" id="toolGrid">
                  {[
                    { tool: 'apex',      color: '#ff6b35', label: 'Hole Apex',          limit: '0/1' },
                    { tool: 'minDiam',   color: '#ffc947', label: 'Min Diameter',        limit: '0/2' },
                    { tool: 'base',      color: '#00d4ff', label: 'Base Diameter (RPE)', limit: '0/2' },
                    { tool: 'leftRim',   color: '#00ff9d', label: 'Left Rim Angle',      limit: '0/2' },
                    { tool: 'rightRim',  color: '#bd93f9', label: 'Right Rim Angle',     limit: '0/2' },
                    { tool: 'outerBase', color: '#ff79c6', label: 'Outer Base (HFF)',    limit: '0/2' },
                  ].map(({ tool, color, label, limit }) => (
                    <button key={tool} className="tool-btn" data-tool={tool} onClick={() => call('selectTool', tool)}>
                      <span className="tool-dot" style={{ background: color }}></span>
                      <span>{label}</span>
                      <span className="tool-count" id={`cnt-${tool}`}>{limit}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="panel-section">
                <div className="panel-label">Actions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <button className="btn btn-primary" onClick={() => call('calculateAll')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 9H4v11h5V9z"/><path d="M20 4H15v6h5V4z"/>
                      <path d="M20 14H15v6h5v-6z"/><path d="M9 4H4v3h5V4z"/>
                    </svg>
                    Calculate Indices
                  </button>
                  <button className="btn btn-ghost undo-btn" onClick={() => call('undoLast')}>↩ Undo Last Point</button>
                  <button className="btn btn-danger" onClick={() => call('clearAll')}>✕ Clear All</button>
                </div>
              </div>

              {/* LEGEND */}
              <div className="legend">
                <div className="panel-label">Overlay Legend</div>
                <div className="legend-item"><div className="legend-dot-swatch" style={{ background: '#ff6b35' }}></div>Hole Apex</div>
                <div className="legend-item"><div className="legend-line" style={{ background: '#ffc947' }}></div>Min Diameter</div>
                <div className="legend-item"><div className="legend-line" style={{ background: '#00d4ff' }}></div>Base Diameter (RPE)</div>
                <div className="legend-item"><div className="legend-line" style={{ background: '#00ff9d' }}></div>Left Rim</div>
                <div className="legend-item"><div className="legend-line" style={{ background: '#bd93f9' }}></div>Right Rim</div>
                <div className="legend-item"><div className="legend-line" style={{ background: '#ff79c6' }}></div>Outer Base</div>
              </div>
            </div>

            {/* CANVAS */}
            <div className="canvas-container">
              <div className="canvas-toolbar">
                <div className="toolbar-group">
                  <button className="icon-btn" onClick={() => call('zoom', 1.2)} title="Zoom In">＋</button>
                  <button className="icon-btn" onClick={() => call('zoom', 0.8)} title="Zoom Out">－</button>
                  <button className="icon-btn" onClick={() => call('resetZoom')} title="Fit">⊡</button>
                  <span className="zoom-label" id="zoomLabel">100%</span>
                </div>
                <div className="toolbar-sep"></div>
                <div className="toolbar-group">
                  <button className="icon-btn" onClick={() => call('toggleOverlay')} title="Toggle Overlay" id="overlayBtn">👁</button>
                  <button className="icon-btn" onClick={() => call('exportCanvas')} title="Export Image">⬇</button>
                </div>
              </div>

              <div className="canvas-wrap" id="canvasWrap">
                <div className="drop-overlay" id="dropOverlay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M8 12 Q10 6 12 12 Q14 18 16 12"/>
                    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
                  </svg>
                  <h2>Load an OCT scan to begin</h2>
                  <p>Upload a B-scan cross-section of a full thickness macular hole. Then select annotation modes to place measurement points.</p>
                </div>
                <canvas id="mainCanvas"></canvas>
              </div>

              <div className="status-bar">
                <span><span className="status-dot"></span><span id="statusText">Ready — load an OCT image to begin</span></span>
                <span id="coordText" style={{ fontSize: 10, color: 'var(--muted)' }}></span>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="right-panel">
              <div className="section-title">Measurements</div>
              <div className="measure-card">
                {[
                  { label: 'Max Hole Height', abbr: 'MHH', id: 'val-MHH' },
                  { label: 'Min Hole Diameter', abbr: 'MHD', id: 'val-MHD' },
                  { label: 'Base Diameter', abbr: 'BD', id: 'val-BD' },
                  { label: 'Outer Base Diam.', abbr: 'OBD', id: 'val-OBD' },
                  { label: 'Left Rim Angle', abbr: 'θL', id: 'val-THL' },
                  { label: 'Right Rim Angle', abbr: 'θR', id: 'val-THR' },
                ].map(({ label, abbr, id }) => (
                  <div className="measure-row" key={id}>
                    <span className="measure-name">{label} <span className="measure-abbr">{abbr}</span></span>
                    <span className="measure-val pending" id={id}>—</span>
                  </div>
                ))}
              </div>

              <div className="section-title">Macular Hole Indices</div>

              {[
                { name: 'MHI', title: 'MHI · Macular Hole Index', desc: 'MHH ÷ Base Diameter. ≥0.9 excellent, 0.5–0.9 good, <0.5 guarded.', barColor: 'var(--accent)' },
                { name: 'DHI', title: 'DHI · Diameter Hole Index', desc: 'MHD ÷ MHH. Higher = flatter hole = better prognosis.', barColor: 'var(--accent2)' },
                { name: 'THI', title: 'THI · Tractional Hole Index', desc: 'MHH ÷ MHD. Reflects vitreous traction. <0.9 favourable.', barColor: 'var(--warn)' },
                { name: 'HFF', title: 'HFF · Hole Form Factor', desc: 'Shape index: 1−(MHD/BD+MHD/OBD)/2. Higher = better closure.', barColor: '#bd93f9' },
                { name: 'CI',  title: 'CI · Close Index',          desc: 'MHI × DHI. Combined predictor of surgical closure.', barColor: '#ff79c6' },
              ].map(({ name, title, desc, barColor }) => (
                <div className="index-card" key={name}>
                  <div className="index-header">
                    <span className="index-name">{title}</span>
                    <span className="index-badge" id={`badge-${name}`} style={{ color: 'var(--muted)' }}>—</span>
                  </div>
                  <div className="index-body">
                    <div className="index-desc">{desc}</div>
                    <div className="index-bar-wrap">
                      <div className="index-bar" id={`bar-${name}`} style={{ width: '0%', background: barColor }}></div>
                    </div>
                    <div className="index-interp" id={`interp-${name}`} style={{ color: 'var(--muted)' }}>Awaiting data</div>
                  </div>
                </div>
              ))}

              <div className="section-title">Surgical Prognosis</div>
              <div id="prognosisBox" className="prognosis-box" style={{ borderColor: 'var(--border)', display: 'none' }}>
                <div className="prognosis-label" id="prog-label"></div>
                <div className="prognosis-title" id="prog-title"></div>
                <div className="prognosis-detail" id="prog-detail"></div>
                <div className="prognosis-icon" id="prog-icon"></div>
              </div>

              <div id="pendingPrognosis" style={{ padding: 16, fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.7 }}>
                Place annotation points and click<br /><strong style={{ color: 'var(--accent)' }}>Calculate Indices</strong><br />to see prognosis
              </div>

              <div style={{ height: 20 }}></div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
