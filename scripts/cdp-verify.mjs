// Rendered-DOM checks against a running server, driven over the Chrome DevTools protocol.
// No test framework in this repo; this is the verification tool the plan and the lessons call for.
//
// Usage:
//   node scripts/cdp-verify.mjs --url http://localhost:4173/ --hash discover --width 1280 [--height 900]
//        [--dump cards.txt] [--shot view.png] [--mobile] [--eval "js expression"] [--then <hash>]
//   --dump  writes the concatenated outerHTML of every [data-camp-card] (for before/after diffs)
//   --shot  captures a viewport screenshot after the section rendered
//   --mobile emulates a touch device (iPhone-class user agent + device scale factor 3)
//   --eval  evaluates an extra expression in the page and prints its JSON result
// Prints: title, card count, nav labels, document width vs viewport, horizontal overflow, console errors.
// Chrome path: CHROME_PATH env or the default Windows install. Each run uses a throwaway profile.

import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => {
  if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true])
  return acc
}, []))
const url = args.url || 'http://localhost:4173/'
const hash = args.hash || 'home'
const width = Number(args.width || 1280)
const height = Number(args.height || 900)
const chrome = process.env.CHROME_PATH || 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
const profile = mkdtempSync(join(tmpdir(), 'esc-cdp-'))
const profileName = basename(profile) // unique per run; the only safe kill key on Windows

// Windows: chrome.exe can hand off to the real browser process and exit, so killing the spawned PID
// (even with /T) can reap a corpse and leave the tree alive (Playground lesson 2026-07-14, shared-machine
// facts). The reliable kill matches the unique profile name in each process's command line. Any harness
// timeout kills this script without running exit handlers, so every launch first reaps strays from earlier
// runs whose profile is older than three minutes (a concurrent fresh run is never touched).
const sweepChrome = (match, olderThanMinutes = 0) => {
  if (process.platform !== 'win32') return
  const age = olderThanMinutes > 0 ? ` -and $_.CreationDate -lt (Get-Date).AddMinutes(-${olderThanMinutes})` : ''
  spawnSync('powershell', ['-NoProfile', '-Command',
    `Get-CimInstance Win32_Process -Filter "name='chrome.exe'" | Where-Object { $_.CommandLine -like '*${match}*'${age} } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`
  ], { stdio: 'ignore', timeout: 20000 })
}
sweepChrome('esc-cdp-', 3)
const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
const removeDir = (dir) => {
  for (let attempt = 0; attempt < 8; attempt++) {
    try { rmSync(dir, { recursive: true, force: true }) } catch { /* still locked */ }
    if (!existsSync(dir)) return true
    pause(250)
  }
  return false
}
// Orphan profiles from runs that were killed before their cleanup ran (older than three minutes).
try {
  for (const name of readdirSync(tmpdir())) {
    if (!name.startsWith('esc-cdp-')) continue
    const dir = join(tmpdir(), name)
    if (Date.now() - statSync(dir).mtimeMs > 3 * 60 * 1000) removeDir(dir)
  }
} catch { /* temp dir listing is best effort */ }

let cleaned = false
const cleanup = () => {
  if (cleaned) return
  cleaned = true
  sweepChrome(profileName)
  if (process.platform !== 'win32') { try { proc.kill() } catch { /* already gone */ } }
  if (!removeDir(profile)) console.error(`profile still locked, left for the next launch: ${profile}`)
}
process.on('exit', cleanup)
process.on('SIGINT', () => process.exit(130))
process.on('uncaughtException', (err) => { console.error(err); process.exit(1) })

const proc = spawn(chrome, [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--disable-gpu', `--window-size=${width},${height}`, 'about:blank'
], { stdio: 'ignore' })

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
// Only the DevToolsActivePort file says whether the browser is up (the launcher may exit early). AV-delayed
// starts can take a while, so poll for up to 30 s.
let port = 0
let target = null
for (let i = 0; i < 120 && !target; i++) {
  await sleep(250)
  try {
    if (!port) port = Number(readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split(/\r?\n/)[0])
    if (!port) continue
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
    target = list.find(t => t.type === 'page')
  } catch { /* not up yet */ }
}
if (!target) { console.error('Chrome did not expose a page target'); process.exit(1) }

const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
let id = 0
const pending = new Map()
const consoleErrors = []
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
  if (msg.method === 'Runtime.exceptionThrown') consoleErrors.push('exception: ' + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text))
  if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') consoleErrors.push('console.error: ' + msg.params.args.map(a => a.value || a.description).join(' '))
}
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) })
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  return r.result?.result?.value
}

await send('Runtime.enable')
await send('Page.enable')
if (args.mobile) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 3, mobile: true })
  await send('Emulation.setTouchEmulationEnabled', { enabled: true })
  await send('Network.enable')
  await send('Network.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' })
} else {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
}
await send('Page.navigate', { url: `${url}#${hash}` })
await sleep(2500)
// Dismiss the consent banner if it appeared (5 s delay in the app) so screenshots show the view
await sleep(3000)
await evaluate(`(() => { const b = [...document.querySelectorAll('button')].find(x => x.textContent.trim() === 'Essential Only'); if (b) b.click(); return !!b })()`)
await sleep(500)

const report = await evaluate(`(() => ({
  title: document.title,
  h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim().replace(/\\s+/g, ' ')),
  cards: document.querySelectorAll('[data-camp-card]').length,
  nav: [...document.querySelectorAll('nav button')].map(b => b.textContent.trim()).filter(Boolean),
  chips: [...document.querySelectorAll('[aria-label="Active filters"] span')].map(s => s.textContent.trim()),
  faq: document.querySelectorAll('details').length,
  winterPreview: !!document.getElementById('winter-preview'),
  docWidth: document.documentElement.scrollWidth,
  viewport: window.innerWidth,
  overflow: document.documentElement.scrollWidth > window.innerWidth,
}))()`)
console.log(JSON.stringify({ hash, width, mobile: !!args.mobile, ...report, consoleErrors }, null, 2))

if (args.then) {
  const second = await evaluate(`new Promise((resolve) => { location.hash = ${JSON.stringify(args.then)}; setTimeout(() => resolve({
    cards: document.querySelectorAll('[data-camp-card]').length,
    chips: [...document.querySelectorAll('[aria-label="Active filters"] span')].map(s => s.textContent.trim()),
    nav: [...document.querySelectorAll('nav button')].map(b => b.textContent.trim()).filter(Boolean),
  }), 1200) })`)
  console.log('after navigating to #' + args.then + ':', JSON.stringify(second))
}
if (args.dump) {
  const html = await evaluate(`[...document.querySelectorAll('[data-camp-card]')].map(c => c.outerHTML).join('\\n<!-- card -->\\n')`)
  writeFileSync(args.dump, html || '', 'utf8')
  console.log(`dumped ${report.cards} cards to ${args.dump}`)
}
if (args.eval) {
  console.log('eval:', JSON.stringify(await evaluate(args.eval)))
}
if (args.shot) {
  const shot = await send('Page.captureScreenshot', { format: 'png' })
  writeFileSync(args.shot, Buffer.from(shot.result.data, 'base64'))
  console.log(`screenshot ${args.shot}`)
}

await Promise.race([send('Browser.close'), sleep(1500)])
ws.close()
await sleep(300)
cleanup()
