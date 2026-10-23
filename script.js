/* Behind the Headlines: game logic. Content lives in data.js */
"use strict";

/* ---- config: progress needed before the report can be preserved ---- */
const NEED = { evidence: 10, claims: 4, compares: 3, literary: 3, notes: 1, links: 1 };
const KEY = "bth_state_v1";
const NOTE_CATS = ["My interpretation", "Observation", "Question", "Reminder"];
const AUTH = { A: "Historical record", S: "Secondary interpretation", N: "Newspaper or case-file document", L: "Field notes on the household", M: "Working note" };
const TRACK = { historical: "Historical", literary: "Bartolome household", media: "Working note", scenario: "Case file" };
const ASSESS = ["Not yet assessed", "Supported by the evidence", "Partly supported or incomplete", "Needs more context", "Not established by the evidence", "Unresolved"];
const REL_COLOR = { "Supports": "#5f6b4a", "Contradicts": "#8c3b32", "Contextualizes": "#34507a", "Raises a question": "#6b5a1f" };
const SEC = { est: "What the evidence establishes", sug: "What the evidence suggests", unr: "What remains unresolved" };
const SEC_HELP = { est: "Claims adequately supported by sources you cite. Be precise and name the source.", sug: "Reasonable inferences that are not conclusively established. Say what supports them and what limits them.", unr: "Questions where the material is incomplete, ambiguous, conflicting, or insufficient." };

/* ---- state ---- */
const defState = () => ({ introSeen: false, newspaperOpened: false, inspected: {}, claimsSeen: {}, claimAssess: {}, compare: {}, customPairs: [], notes: [], board: { items: [], links: [] }, report: { entries: [], finalized: false }, doro: { opened: false, unlocked: false }, marks: {}, sort: { piles: [], place: {} } });
function load() { try { const r = JSON.parse(localStorage.getItem(KEY)); return Object.assign(defState(), r || {}); } catch (e) { return defState(); } }
let S = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { say("Could not save: browser storage is unavailable."); } }

/* ---- helpers ---- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const EV = Object.fromEntries(EVIDENCE.map(e => [e.id, e]));
const CL = Object.fromEntries(CLAIMS.map(c => [c.id, c]));
const SR = Object.fromEntries(SOURCES.map(s => [s.id, s]));
const UI = { arc: { tab: "ev", track: "all", thread: "all", sel: null }, lit: { sel: null }, claim: null, cmp: { claim: "c1" }, board: { tab: "ev", pick: null, from: null }, rep: { edit: null }, pen: false };
const UI0 = JSON.stringify(UI); /* pristine copy of the initial UI state, used by "Scrap the Case" */

/* ---- dialogue ---- */
const lastLine = {};
function pick(key) {
  let pool = [...(DIALOGUE[key] || [])];
  DIALOGUE_PROGRESS.forEach(d => { if (d.obj === key && d.when(S)) pool.push(...d.lines); });
  if (!pool.length) return "";
  if (pool.length > 1 && lastLine[key]) pool = pool.filter(l => l !== lastLine[key]);
  const l = pool[Math.floor(Math.random() * pool.length)];
  lastLine[key] = l; return l;
}
let bubbleTimer;
function say(text, ms = 4500) {
  if (!text) return;
  const b = $("#bubble"); b.textContent = text; b.hidden = false;
  clearTimeout(bubbleTimer); bubbleTimer = setTimeout(() => { b.hidden = true; }, ms);
}

/* ---- sound effects ---- */
const SFX = {
  drawerOpen: ["assets/audio/drawer-open.mp3", 400],      /* central, left and right drawers share this */
  drawerClose: ["assets/audio/drawer-close.mp3", 400],    /* shared closing sound */
  fileOpen: ["assets/audio/file-open.mp3", 350, true],          /* an evidence file inside the central drawer */
  paperRustle: ["assets/audio/paper-rustle.mp3", 450],    /* loose papers, photographs, newspapers, documents */
  scribble: ["assets/audio/scribble.mp3", 1200],          /* note-writing surface opens */
  clink: ["assets/audio/clink.mp3", 350, true],                 /* plate, cup, coffee */
  pinClack: ["assets/audio/pinboard-clack.mp3", 180, true],     /* corkboard pins and strings */
  knock: ["assets/audio/knock.mp3", 0],                   /* ending: same file for every knock */
  speakiCry: ["assets/audio/speaki-cry.mp3", 0],
  freddy: ["assets/audio/har-har-har-har.mp3", 0],
  typewriter: ["assets/audio/typewriter.mp3", 500],        /* typewriter clicked */
  penClick: ["assets/audio/pen-click.mp3", 250, true],     /* pen picked up */
  lampClick: ["assets/audio/lamp-click.mp3", 250, true],   /* desk lamp switch */
  glass: ["assets/audio/glass.mp3", 450],                   /* magnifying glass */
  notebookOpen: ["assets/audio/notebook-open.mp3", 600]    /* notebook opened */
};
const sfxEl = {}, sfxLast = {}, sfxDead = {};
let sfxMuted = false;
/* plays a short effect; a missing file or a blocked play() is ignored. restart (or a third value of true): cut the previous play and start again instead of ignoring the new one */
function playSfx(key, restart) {
  try {
    const def = SFX[key]; if (!def || sfxMuted || sfxDead[key]) return;
    const now = Date.now(); if (now - (sfxLast[key] || 0) < def[1]) return;
    let a = sfxEl[key];
    if (!a) { a = new Audio(def[0]); a.preload = "auto"; a.volume = .8; a.addEventListener("error", () => { sfxDead[key] = true; }); sfxEl[key] = a; }
    if (!a.paused && !a.ended) { if (!(restart || def[2])) return; try { a.currentTime = 0; } catch (e) { } }
    sfxLast[key] = now;
    const p = a.play(); if (p && p.catch) p.catch(() => { });
  } catch (e) { }
}

/* ---- overlay manager ---- */
const OV = {};
function openOv(id, render, cls = "", after = null) {
  const existed = !!$("#ov-" + id);
  OV[id] = { render, cls, after };
  drawOv(id);
  if (!existed) { const x = $("#ov-" + id + " .x"); x && x.focus(); }
}
function drawOv(id) {
  const o = OV[id]; if (!o) return;
  let el = $("#ov-" + id);
  if (!el) { el = document.createElement("div"); el.className = "ov" + (id === "archive" ? " ov-drawer" : ""); el.id = "ov-" + id; el.dataset.id = id; $("#overlays").append(el); }
  const sc = el.firstElementChild ? el.firstElementChild.scrollTop : 0;
  el.innerHTML = `<div class="panel ${o.cls}" role="dialog" aria-modal="true" aria-label="${esc(id)}"><button class="x" data-act="close" data-id="${id}" aria-label="Close">×</button>${o.render()}</div>`;
  el.firstElementChild.scrollTop = sc;
  applyMarks(el);
  if (o.after) o.after(el);
}
function closeOv(id) {
  if (id === "doroVideo") { const v = $("#dv"); if (v) { v.pause(); v.removeAttribute("src"); v.load(); } }
  const el = $("#ov-" + id); el && el.remove(); delete OV[id];
  if (id === "archive") { const d = $("#drawerObj"); if (d && d.classList.contains("opening")) { d.classList.remove("opening"); playSfx("drawerClose"); } }
  if (id === "doro" && S.doro.opened && !S.doro.unlocked) { S.doro.unlocked = true; save(); markDoro(); }
  meter();
  if (OV.dossier && id !== "dossier") drawOv("dossier");
}
function redraw(...ids) { ids.forEach(i => { if (OV[i]) drawOv(i); }); }
function topOv() { const all = $$("#overlays .ov"); return all[all.length - 1]; }

/* ---- actions (data-act) ---- */
const A = {};
document.addEventListener("click", e => {
  if (UI.justMarked) return;
  const t = e.target.closest("[data-act]");
  if (t && A[t.dataset.act]) { A[t.dataset.act](t, e); return; }
  const bg = e.target.classList && e.target.classList.contains("ov") ? e.target : null;
  if (bg) closeOv(bg.dataset.id);
});
document.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("claim")) { e.preventDefault(); e.target.click(); return; }
  if (e.key === "Escape") { const o = topOv(); if (o) closeOv(o.dataset.id); else if (UI.pen) setPen(false); else if (egg.openR) closeRight(); }
});
document.addEventListener("error", e => {
  const t = e.target;
  if (t.tagName === "IMG" && t.dataset.fb) { const d = document.createElement("div"); d.className = "ph" + (t.dataset.demo ? " member-pic" : ""); d.textContent = t.dataset.fb; if (t.dataset.demo) d.dataset.demo = "1"; t.replaceWith(d); }
}, true);
A.close = t => closeOv(t.dataset.id);

/* confirm box */
let confirmFn = null;
function confirmBox(msg, fn, label = "Delete") {
  confirmFn = fn;
  openOv("confirm", () => `<h2>Are you sure?</h2><p>${esc(msg)}</p><div class="row"><button class="btn danger" data-act="confirm-yes">${esc(label)}</button><button class="btn alt" data-act="close" data-id="confirm">Cancel</button></div>`, "sm");
}
A["confirm-yes"] = () => { const f = confirmFn; confirmFn = null; closeOv("confirm"); f && f(); };

/* ---- progress ---- */
const nLit = () => Object.keys(S.inspected).filter(i => EV[i] && EV[i].track === "literary").length;
const nCmp = () => Object.values(S.compare).filter(c => c.cls).length;
function meter() {
  $("#meter").textContent = `Evidence ${Object.keys(S.inspected).length}/${EVIDENCE.length} · Claims ${Object.keys(S.claimsSeen).length}/${CLAIMS.length} · Comparisons ${nCmp()} · Notes ${S.notes.length}`;
}
function inspect(id) { if (!S.inspected[id]) { S.inspected[id] = Date.now(); save(); meter(); } }
function readiness() {
  const r = S.report.entries;
  const est = r.filter(e => e.sec === "est"), unr = r.filter(e => e.sec === "unr");
  const items = [
    [S.newspaperOpened, "Read the newspaper"],
    [Object.keys(S.inspected).length >= NEED.evidence, `Inspect at least ${NEED.evidence} evidence items (${Object.keys(S.inspected).length} so far)`],
    [Object.keys(S.claimsSeen).length >= NEED.claims, `Inspect at least ${NEED.claims} newspaper claims (${Object.keys(S.claimsSeen).length} so far)`],
    [nCmp() >= NEED.compares, `Record at least ${NEED.compares} source comparisons (${nCmp()} so far)`],
    [nLit() >= NEED.literary, `Read at least ${NEED.literary} items in The Bartolome File (${nLit()} so far)`],
    [S.notes.length >= NEED.notes, "Write at least one note"],
    [S.board.links.length >= NEED.links, "Draw at least one connection on the board"],
    [est.length >= 1, "Add at least one entry under “What the evidence establishes”"],
    [est.every(e => e.ev.length > 0) && est.length > 0, "Every “establishes” entry cites at least one evidence item"],
    [unr.length >= 1, "Add at least one entry under “What remains unresolved”"]
  ];
  return { items, ready: items.every(i => i[0]) };
}

/* ================= DESK ================= */
const OBJ = {
  pen: () => { if (!UI.pen) playSfx("penClick"); setPen(!UI.pen); },
  papers: () => { say(pick("papers")); playSfx("paperRustle"); openPapers(); },
  notebook: () => { say(pick("notebook")); openNotebook(); },
  newspaper: () => { say(pick("newspaper")); playSfx("paperRustle"); openNews(); },
  archive: () => {
    say(pick("archive"));
    if (OV.archive || egg.busyC) return;           /* already open or opening: no second sound */
    egg.busyC = true; const d = $("#drawerObj"); if (d) d.classList.add("opening");
    playSfx("drawerOpen");
    setTimeout(() => { egg.busyC = false; openArchive({}); }, 340);
  },
  drawerL: () => speakiDrawer(),
  drawerR: () => freddyDrawer(),
  freddy: () => freddyClick(),
  doro: () => openDoro(),
  mug: () => { playSfx("clink"); say(pick("mug")); },
  board: () => { say(pick("board")); openBoard(); },
  radio: () => { if (Math.random() < .3) say(pick("radio")); openRadio(); },
  folders: () => { say(pick("folders")); playSfx("paperRustle"); openThreads(); },
  magnifier: () => { playSfx("glass"); say(pick("magnifier")); openCompare(); },
  dossier: () => { say(pick("dossier")); playSfx("paperRustle"); openDossier(); },
  typewriter: () => { playSfx("typewriter"); say(pick("typewriter")); openReport(); },
  photoStreet: () => { say(pick("photos")); playSfx("paperRustle"); openArchive({ sel: "photoStreet" }); },
  photoFamily: () => { say(pick("photos")); playSfx("paperRustle"); openArchive({ sel: "photoFamily" }); },
  lamp: () => { const d = $("#dimLayer"); const dim = d.getAttribute("opacity") === "0"; d.setAttribute("opacity", dim ? ".35" : "0"); $("#lampGlow").style.opacity = dim ? 0 : 1; playSfx("lampClick"); say(pick("lamp")); },
  calendar: () => say(pick("calendar")), water: () => { playSfx("clink"); say(pick("water")); }, plate: () => { playSfx("clink"); say(pick("plate")); }, clips: () => say(pick("clips"))
};
function objClick(name) { if (UI.pen && name !== "pen") say("Pen's still in hand. Open a document and select a passage to underline it."); (OBJ[name] || (() => { }))(); }
$$(".obj").forEach(o => {
  o.addEventListener("click", () => objClick(o.dataset.obj));
  o.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); objClick(o.dataset.obj); } });
});
function setPen(on) {
  UI.pen = on; document.body.classList.toggle("pen-on", on);
  $("#penObj").classList.toggle("sel", on);
  if (on) { say(pick("pen")); $("#hint").textContent = "Pen in hand. Open the newspaper or an evidence document and select a passage to underline it. Click an underline to rub it out. Click the pen again to put it down."; }
  else $("#hint").textContent = "Click objects on the desk. The pen underlines passages, the notebook holds your own notes, the loose papers sort what you have collected.";
}
A.go = t => ({ newspaper: openNews, archive: () => openArchive({}), lit: openLit, threads: openThreads, compare: () => openCompare(), board: openBoard, notebook: openNotebook, report: openReport, menu: openMenu }[t.dataset.to])();

/* optional image assets: fall back to the drawn art when missing */
(function assets() {
  const swap = (sel, src, box) => {
    const im = new Image(); im.onload = () => {
      const g = $(sel + " .art"); if (!g) return; g.style.display = "none";
      const i = document.createElementNS("http://www.w3.org/2000/svg", "image");
      i.setAttribute("href", src); ["x", "y", "width", "height"].forEach((k, n) => i.setAttribute(k, box[n]));
      $(sel).append(i);
    }; im.src = src;
  };
  swap('[data-obj=typewriter]', "assets/typewriter.png", [206, 296, 250, 210]);
  swap('[data-obj=newspaper]', "assets/newspaper.png", [470, 310, 220, 180]);
  swap('[data-obj=radio]', "assets/radio.png", [566, 170, 176, 124]);
  swap('[data-obj=plate]', "assets/food.png", [22, 500, 214, 100]);
  const bg = new Image(); bg.onload = () => { const b = $("#deskBgImg"); b.setAttribute("href", "assets/desk-bg.jpg"); b.style.display = ""; }; bg.src = "assets/desk-bg.jpg";
})();

/* ================= INTRO / MENU ================= */
function openIntro() {
  openOv("intro", () => `<h2>Behind the Headlines</h2>
  <p>You are an investigative journalist at a cluttered desk. In front of you: today's paper, a drawer of records, and Case File 07, the dossier you have been building.</p>
  <p><b>What if everything you've read is true, but the story it tells you is still wrong?</b></p>
  <p>Two threads run through the file. One follows the records: what was declared, reported, and left out. The other follows a household, the Bartolomes, and how the same events reached a wife and mother, her husband, and their five sons.</p>
  <p>Read, compare, take notes, pin your thoughts to the board, and finally write a report that separates what the evidence establishes, what it suggests, and what remains unresolved.</p>
  <p class="muted">Your progress saves in this browser. Open Case File 07 for a place to start.</p>
  <div class="row"><button class="btn" data-act="intro-go">Sit at the desk</button></div>`, "md");
}
A["intro-go"] = () => { S.introSeen = true; save(); closeOv("intro"); say("Case file first. Then the paper."); };

function openMenu() {
  openOv("menu", () => {
    const r = readiness();
    return `<h2>Case file</h2>
    <h3>Progress toward the final report</h3>
    <ul class="check">${r.items.map(i => `<li class="${i[0] ? "ok" : "no"}">${i[0] ? "✓" : "○"} ${esc(i[1])}</li>`).join("")}</ul>
    <h3>Housekeeping</h3>
    <div class="row"><button class="btn alt" data-act="intro-open">Show the introduction again</button><button class="btn danger" data-act="reset">Reset all saved progress</button></div>`;
  }, "md");
}
A["intro-open"] = () => { closeOv("menu"); openIntro(); };
A.reset = () => confirmBox("This permanently erases your notes, comparisons, board, report, and progress in this browser.", () => { localStorage.removeItem(KEY); S = defState(); sfxMuted = true; try { $$("#overlays .ov").forEach(o => closeOv(o.dataset.id)); } finally { sfxMuted = false; } resetDrawers(); meter(); say("Desk cleared. A fresh start."); openIntro(); }, "Erase everything");

/* ================= NEWSPAPER ================= */
function openNews() {
  S.newspaperOpened = true; save();
  openOv("newspaper", () => {
    const paras = NEWS.paras.map((p, pi) => `<p data-mk="news:${pi}">${esc(p).replace(/\[\[(c\d)\|(.+?)\]\]/g, (m, id, tx) => `<span role="button" tabindex="0" class="claim ${S.claimsSeen[id] ? "seen" : ""} ${UI.claim === id ? "on" : ""}" data-act="claim" data-id="${id}" aria-label="Inspect claim">${tx}</span>`)}</p>`).join("");
    return `<h2>The newspaper</h2>
    <p class="muted">Highlighted passages can be inspected. The article itself never changes; your understanding of it can.</p>
    <div class="news2"><div>
      <div class="paper-news">
        <div class="mast"><b>${NEWS.name}</b><span>${NEWS.tag}</span></div>
        <h3><span role="button" tabindex="0" class="claim ${S.claimsSeen.c1 ? "seen" : ""} ${UI.claim === "c1" ? "on" : ""}" data-act="claim" data-id="c1">CALM RETURNS TO THE CAPITAL</span> as Citizens Resume Daily Routines</h3>
        <p class="muted"><span role="button" tabindex="0" class="claim ${S.claimsSeen.c9 ? "seen" : ""} ${UI.claim === "c9" ? "on" : ""}" data-act="claim" data-id="c9">Officials point to new public works and rising growth as proof that discipline is working</span></p>
        <div class="cols">${paras}</div>
        <p class="muted">Weather: fair. Market prices: steady. Bus schedules: see page 4.</p></div>
    </div><div id="claimPane">${claimPane()}</div></div>`;
  });
}
function claimPane() {
  const c = CL[UI.claim];
  if (!c) return `<div class="box"><h4>Choose a highlighted passage</h4><p>Ask of each: who says this, what does it establish, and what is missing?</p><p class="muted">Inspected: ${Object.keys(S.claimsSeen).length} of ${CLAIMS.length}</p></div>`;
  const as = S.claimAssess[c.id] || { status: 0, why: "" };
  return `<div class="box"><h4>Claim: ${esc(c.short)}</h4><p><i>${esc(c.text)}</i></p><p>${esc(c.ctx)}</p>
  <h4>Questions a careful reader might ask</h4><ul>${c.qs.map(q => `<li>${esc(q)}</li>`).join("")}</ul>
  <h4>Evidence to check</h4><div class="chips">${c.ev.map(e => `<button class="chip ${S.inspected[e] ? "on" : ""}" data-act="open-ev" data-id="${e}">${esc(EV[e].title)}</button>`).join("")}</div>
  <div class="row"><button class="btn" data-act="cmp-claim" data-id="${c.id}">Compare sources</button><button class="btn alt" data-act="pin" data-type="claim" data-ref="${c.id}">Pin to board</button></div>
  <label for="as-st">My current assessment</label><select id="as-st">${ASSESS.map((a, i) => `<option value="${i}" ${as.status == i ? "selected" : ""}>${a}</option>`).join("")}</select>
  <label for="as-why">Why (my reasoning, not a source)</label><textarea id="as-why">${esc(as.why)}</textarea>
  <div class="row" style="margin-top:.5rem"><button class="btn" data-act="save-assess" data-id="${c.id}">Save assessment</button><span class="muted">${as.t ? "Saved " + new Date(as.t).toLocaleString() : "You can revise this any time."}</span></div></div>`;
}
A.claim = t => { UI.claim = t.dataset.id; S.claimsSeen[UI.claim] = 1; save(); meter(); redraw("newspaper"); };
A["save-assess"] = t => { S.claimAssess[t.dataset.id] = { status: +$("#as-st").value, why: $("#as-why").value, t: Date.now() }; save(); redraw("newspaper"); say("Assessment saved. I can revise it later."); };
A["cmp-claim"] = t => openCompare(t.dataset.id);

/* ================= EVIDENCE VIEWER (archive + literary) ================= */
function evViewer(ui, fixedTrack) {
  const list = EVIDENCE.filter(e => (fixedTrack ? e.track === fixedTrack : (ui.track === "all" || e.track === ui.track)) && (!ui.thread || ui.thread === "all" || e.threads.includes(ui.thread)));
  const which = fixedTrack ? "lit" : "arc";
  const chips = fixedTrack ? "" : `<div class="chips" role="group" aria-label="Filter by track">${[["all", "All"], ["historical", "Historical"], ["literary", "Bartolome File"], ["media", "Working notes"], ["scenario", "Case-file documents"]].map(([v, l]) => `<button class="chip ${ui.track === v ? "on" : ""}" data-act="filter" data-w="${which}" data-k="track" data-v="${v}">${l}</button>`).join("")}</div>`;
  const th = `<div class="chips" role="group" aria-label="Filter by thread"><button class="chip ${!ui.thread || ui.thread === "all" ? "on" : ""}" data-act="filter" data-w="${which}" data-k="thread" data-v="all">All threads</button>${THREADS.map(t => `<button class="chip ${ui.thread === t.id ? "on" : ""}" data-act="filter" data-w="${which}" data-k="thread" data-v="${t.id}" title="${esc(t.name)}">Thread ${t.id}</button>`).join("")}</div>`;
  return `${chips}${th}<div class="two"><div class="list" role="list">${list.map(e => `<button class="item ${ui.sel === e.id ? "on" : ""} ${S.inspected[e.id] ? "done" : ""}" data-act="ev-sel" data-w="${which}" data-id="${e.id}"><span class="tag t-${e.auth}">${({ A: "Record", S: "Interpretation", N: "Document", L: "Household", M: "Working note" })[e.auth] || "Item"}</span>${esc(e.title)}<small>${esc(e.cat)}</small></button>`).join("") || "<p>No items match.</p>"}</div>
  <div>${ui.sel ? evDetail(ui.sel) : `<div class="box"><h4>Pick an item</h4><p>${list.length} items shown. Each has a provenance and a statement of what it can and cannot establish.</p></div>`}</div></div>`;
}
function evDetail(id) {
  const e = EV[id]; const rel = CLAIMS.filter(c => c.ev.includes(id));
  const photo = e.photo ? `<img src="${e.photo}" alt="${esc(e.title)}" style="max-width:100%;max-height:340px;display:block;margin:.4rem 0;border:6px solid #f4ecd6;box-shadow:2px 4px 8px #0005" data-fb="Image unavailable">` : "";
  const srcs = e.track === "literary" ? [] : e.src.filter(x => SR[x] && SR[x].group !== "Project original");
  return `<div class="doc"><span class="tag t-${e.auth}">${esc(AUTH[e.auth])}</span><h3>${esc(e.title)}</h3>${photo}
  <table class="meta"><tr><td>Category</td><td>${esc(e.cat)}</td></tr><tr><td>Track</td><td>${TRACK[e.track]}</td></tr><tr><td>Date</td><td>${esc(e.date)}</td></tr><tr><td>Provenance</td><td>${esc(e.prov)}</td></tr>
  ${srcs.length ? `<tr><td>Sources</td><td>${srcs.map(x => `<span>${esc(SR[x].apa.replace(/_/g, ""))}${SR[x].url ? ` <a href="${esc(SR[x].url)}" target="_blank" rel="noopener">Open</a>` : ""}</span>`).join("<br>")}</td></tr>` : ""}
  <tr><td>Threads</td><td>${e.threads.map(t => "Thread " + t).join(", ")}</td></tr></table>
  ${e.body.map((p, pi) => `<p data-mk="ev:${e.id}:${pi}">${esc(p)}</p>`).join("")}
  <div class="box"><h4>What this can establish</h4>${esc(e.establishes)}</div>
  <div class="box warn"><h4>Limits and cautions</h4>${esc(e.limits)}</div>
  <h4>Questions to carry forward</h4><ul>${e.q.map(q => `<li>${esc(q)}</li>`).join("")}</ul>
  ${rel.length ? `<h4>Newspaper claims this bears on</h4><div class="chips">${rel.map(c => `<button class="chip" data-act="claim-from-ev" data-id="${c.id}">${esc(c.short)}</button>`).join("")}</div>` : ""}
  <div class="row"><button class="btn" data-act="pin" data-type="ev" data-ref="${id}">Pin to board</button><button class="btn alt" data-act="note-ev" data-id="${id}">Write a note about this</button>${e.open ? `<button class="btn alt" data-act="go" data-to="newspaper">Open the newspaper</button>` : ""}</div></div>`;
}
A.filter = t => { const ui = t.dataset.w === "lit" ? UI.lit : UI.arc; ui[t.dataset.k] = t.dataset.v; redraw("archive", "lit"); };
A["ev-sel"] = t => { playSfx(t.dataset.w === "lit" ? "paperRustle" : "fileOpen"); const ui = t.dataset.w === "lit" ? UI.lit : UI.arc; ui.sel = t.dataset.id; inspect(t.dataset.id); redraw("archive", "lit"); };
A["open-ev"] = t => { playSfx("paperRustle"); openArchive({ sel: t.dataset.id }); };
A["claim-from-ev"] = t => { UI.claim = t.dataset.id; S.claimsSeen[UI.claim] = 1; save(); openNews(); };
A["note-ev"] = t => newNote({ rel: "ev:" + t.dataset.id });

/* ================= ARCHIVE ================= */
function openArchive(o) {
  if (o.sel) { UI.arc.sel = o.sel; UI.arc.track = "all"; UI.arc.thread = "all"; UI.arc.tab = "ev"; inspect(o.sel); }
  if (o.tab) UI.arc.tab = o.tab;
  openOv("archive", () => `<h2>Archive drawer</h2>
  <div class="tabs" role="tablist">${[["ev", "Evidence Files"], ["cred", "Project Credits"], ["reg", "Source Register"]].map(([k, l]) => `<button role="tab" aria-selected="${UI.arc.tab === k}" class="${UI.arc.tab === k ? "on" : ""}" data-act="arc-tab" data-tab="${k}">${l}</button>`).join("")}</div>
  ${UI.arc.tab === "ev" ? `<p class="muted">Records and readings to examine. Each item gives its provenance, what it can establish, and where it stops. The Source Register is the full reference list.</p>${evViewer(UI.arc)}` : UI.arc.tab === "cred" ? credits() : register()}`, "arch");
  if (UI.arc.tab === "cred") say("Who are these people?", 6000);
  if (UI.arc.tab === "reg") say("Oh, these sources look pretty nice, but what does www. mean?", 6000);
}
A["arc-tab"] = t => { UI.arc.tab = t.dataset.tab; redraw("archive"); if (UI.arc.tab === "cred") say("Who are these people?", 6000); if (UI.arc.tab === "reg") say("Oh, these sources look pretty nice, but what does www. mean?", 6000); };
function credits() {
  return `<p class="muted">Creators of the website.</p><div class="cols3">${MEMBERS.map((m, i) => `<div class="box"><img class="member-pic" data-demo="1" draggable="false" src="${esc(m.img)}" alt="Photo of ${esc(m.name)}" style="width:100%;max-height:220px;object-fit:cover" data-fb="Portrait unavailable"><h3>${esc(m.name)}</h3><div>${m.roles.map(r => `<span class="tag">${esc(r)}</span>`).join("")}</div><p>${esc(m.work)}</p></div>`).join("")}</div>`;
}
function refHtml(x) {
  const t = esc(x.apa).replace(/_(.+?)_/g, "<em>$1</em>");
  return `<p class="ref">${t}${x.url ? ` <a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.url)}</a>` : ""}<span class="muted ref-use">${esc(x.use)}</span></p>`;
}
function register() {
  const groups = [...new Set(SOURCES.map(x => x.group))];
  return `<h3 style="margin-top:.2rem">Source Register</h3>
  <p class="reg-note">References (APA 7th edition) for the historical and household material in this investigation, with a few works listed as background reading. The Evidence Files are the materials the journalist examines.</p>
  <details class="reg-note"><summary>About this list</summary><p>Links open the original pages. Entries are summarized in the game's own words, so read the original before relying on any detail. “The Capital Courier” is an original newspaper written for this investigation and is not a historical document.</p></details>
  ${groups.map(g => `<h4 class="reg-h">${esc(g)}</h4>${SOURCES.filter(x => x.group === g).sort((a, b) => a.apa.localeCompare(b.apa)).map(refHtml).join("")}`).join("")}`;
}

/* ================= LITERARY ================= */
function openLit() {
  openOv("lit", () => `<h2>The Bartolome File <span class="muted">· field notes</span></h2>
  <p>What the household went through, as far as I can piece it together: Amanda, her husband, their five sons, and how the same events reached each of them. These are my field notes, my reading of the household's account set beside the records in the Archive. The Archive tells me what happened; this file tells me how it was lived.</p>
  <div class="box"><h4>How I'm keeping this file</h4>Three things stay separate: what the household's account says, what I'm reading into it, and what the records establish. The account can show how something was lived. Only a record can show that it happened.</div>
  ${evViewer(UI.lit, "literary")}`, "arch");
}

/* ================= THREADS ================= */
function openThreads() {
  openOv("threads", () => `<h2>Investigation threads</h2><p class="muted">Five strands, in any order. Items overlap on purpose.</p>${THREADS.map(t => { const d = t.ev.filter(e => S.inspected[e]).length; return `<div class="box"><h3>Thread ${t.id}: ${esc(t.name)} <span class="tag">${t.track}</span></h3><p>${esc(t.blurb)}</p><p class="muted">Guiding questions: ${t.qs.map(esc).join(" · ")}</p><div class="chips">${t.ev.map(e => `<button class="chip ${S.inspected[e] ? "on" : ""}" data-act="open-ev" data-id="${e}">${esc(EV[e].title)}</button>`).join("")}</div>${t.claims.length ? `<div class="chips">${t.claims.map(c => `<button class="chip ${S.claimsSeen[c] ? "on" : ""}" data-act="claim-from-ev" data-id="${c}">Claim: ${esc(CL[c].short)}</button>`).join("")}</div>` : ""}<p class="muted">${d} of ${t.ev.length} items inspected</p></div>`; }).join("")}`, "md");
}

/* ================= CASE DOSSIER ================= */
const leadDone = l => l.kind === "claim" ? !!S.claimsSeen[l.id] : !!S.inspected[l.id];
function openDossier() {
  openOv("dossier", () => `<div class="dos-tab">${esc(DOSSIER.title)}</div><h2 class="dos-h">${esc(DOSSIER.subtitle)}</h2>
  <div class="dos-grid">
    <div class="dos-col">
      <section class="hand sheet-a"><h3>Note, in my hand</h3>${DOSSIER.note.map(p => `<p>${esc(p)}</p>`).join("")}</section>
      <section class="hand sheet-b"><h3>Questions I keep asking</h3><ol>${DOSSIER.questions.map(q => `<li>${esc(q)}</li>`).join("")}</ol></section>
      <section class="typed-card"><h3>Timeline so far</h3><ul>${DOSSIER.chrono.map(c => `<li><b>${esc(c.when)}</b> ${esc(c.what)} <button class="chip" data-act="open-ev" data-id="${c.ev}">${S.inspected[c.ev] ? "✓ " : ""}record</button></li>`).join("")}</ul></section>
    </div>
    <div class="dos-col dos-leads"><h3>Leads</h3>${DOSSIER.leads.map(l => `<div class="lead"><b>${esc(l.title)}</b><p>${esc(l.why)}</p><button class="btn alt" data-act="${l.kind === "claim" ? "claim-from-ev" : "open-ev"}" data-id="${l.id}">${l.kind === "claim" ? "Inspect the claim" : "Read the record"}</button>${leadDone(l) ? `<span class="lead-done">✓ looked at</span>` : ""}</div>`).join("")}</div>
  </div>
  <div class="dos-open"><h3>Still unresolved</h3><p>${esc(DOSSIER.open)}</p></div>
  <div class="row"><button class="btn" data-act="note-new">Write a note</button><button class="btn alt" data-act="go" data-to="newspaper">Open the newspaper</button><button class="btn alt" data-act="go" data-to="threads">Investigation threads</button></div>`, "dos");
}

/* ================= PEN: underline passages in documents ================= */
/* underlines live in S.marks as [start, end] character ranges per paragraph; the documents themselves are never edited */
function unwrapMarks(p) { $$("span.ul", p).forEach(u => { const par = u.parentNode; while (u.firstChild) par.insertBefore(u.firstChild, u); par.removeChild(u); par.normalize(); }); }
function wrapRange(p, s0, e0) {
  const w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let pos = 0, n; const jobs = [];
  while ((n = w.nextNode())) { const len = n.nodeValue.length, a = Math.max(s0, pos), b = Math.min(e0, pos + len); if (a < b) jobs.push([n, a - pos, b - pos]); pos += len; }
  jobs.reverse().forEach(([node, a, b]) => { const r = document.createRange(); r.setStart(node, a); r.setEnd(node, b); const u = document.createElement("span"); u.className = "ul"; r.surroundContents(u); });
}
function markPara(p) { unwrapMarks(p); ((S.marks && S.marks[p.dataset.mk]) || []).forEach(([a, b]) => wrapRange(p, a, b)); }
function applyMarks(root) { $$("[data-mk]", root).forEach(markPara); }
function offsetIn(p, node, off) { const r = document.createRange(); r.selectNodeContents(p); r.setEnd(node, off); return r.toString().length; }
function addMark(key, a, b) {
  const list = (S.marks[key] = S.marks[key] || []); list.push([a, b]); list.sort((x, y) => x[0] - y[0]);
  const out = []; list.forEach(r => { const l = out[out.length - 1]; if (l && r[0] <= l[1]) l[1] = Math.max(l[1], r[1]); else out.push([r[0], r[1]]); }); S.marks[key] = out;
}
/* with the pen in hand: a selection is underlined; a plain click on an underline rubs it out */
function penUp(e) {
  if (!UI.pen) return;
  const sel = window.getSelection(); if (!sel || !sel.rangeCount) return;
  const r = sel.getRangeAt(0);
  if (sel.isCollapsed) {
    const u = e.target.closest && e.target.closest("span.ul"); const p = u && u.closest("[data-mk]"); if (!p) return;
    const a = offsetIn(p, u, 0), b = a + u.textContent.length;
    S.marks[p.dataset.mk] = (S.marks[p.dataset.mk] || []).filter(([x, y]) => y <= a || x >= b);
    if (!S.marks[p.dataset.mk].length) delete S.marks[p.dataset.mk];
    save(); markPara(p); UI.justMarked = true; setTimeout(() => { UI.justMarked = false; }, 80); return;
  }
  let did = false;
  $$("[data-mk]").forEach(p => {
    if (!r.intersectsNode(p)) return;
    let a = p.contains(r.startContainer) ? offsetIn(p, r.startContainer, r.startOffset) : 0;
    let b = p.contains(r.endContainer) ? offsetIn(p, r.endContainer, r.endOffset) : p.textContent.length;
    const txt = p.textContent; while (a < b && /\s/.test(txt[a])) a++; while (b > a && /\s/.test(txt[b - 1])) b--;
    if (b - a < 2) return;
    addMark(p.dataset.mk, a, b); markPara(p); did = true;
  });
  if (did) { save(); sel.removeAllRanges(); UI.justMarked = true; setTimeout(() => { UI.justMarked = false; }, 80); }
}
/* capture phase and synchronous: this must run before the click that ends the drag, or a claim would open and redraw the page first */
document.addEventListener("pointerup", e => { if (UI.pen) penUp(e); }, true);

/* ================= LOOSE PAPERS: sort what has been collected ================= */
/* S.sort = { piles: [{id, name}], place: { evidenceId: pileId } }; a document with no placement is simply unsorted */
const collectedIds = () => EVIDENCE.filter(e => S.inspected[e.id] || (e.id === "news" && S.newspaperOpened)).map(e => e.id);
const pileOf = id => { const pl = S.sort.place[id]; return S.sort.piles.some(p => p.id === pl) ? pl : ""; };
function openPapers() { openOv("papers", renderPapers, "md blot"); }
function paperCard(id) {
  const e = EV[id], here = pileOf(id);
  return `<div class="pcard" draggable="true" data-card="${id}"><span class="tag t-${e.auth}">${esc(({ A: "Record", S: "Interpretation", N: "Document", L: "Household", M: "Working note" })[e.auth] || "Item")}</span><b>${esc(e.title)}</b>
  <div class="row"><button class="chip" data-act="open-ev" data-id="${id}">Inspect</button><label class="sr" for="mv-${id}">Move ${esc(e.title)} to</label><select id="mv-${id}" data-move="${id}"><option value="">Unsorted</option>${S.sort.piles.map(p => `<option value="${p.id}" ${here === p.id ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select></div></div>`;
}
function renderPapers() {
  const ids = collectedIds(), sug = ["Newspaper reports", "Historical records", "Photographs", "Unresolved provenance"].filter(n => !S.sort.piles.some(p => p.name === n));
  const un = ids.filter(i => !pileOf(i));
  return `<h2>Loose papers</h2>
  <p class="muted">Everything you have looked at ends up on this desk. Drag a document onto a pile, or use “Move to”. Make as many piles as you like, name them yourself, and leave anything unsorted if you are not sure where it belongs.</p>
  <div class="row"><label class="sr" for="pp-new">New pile name</label><input type="text" id="pp-new" maxlength="40" placeholder="Name a new pile" style="max-width:16rem"><button class="btn" data-act="pp-add">Start a pile</button>${sug.map(n => `<button class="chip" data-act="pp-add" data-name="${esc(n)}">+ ${esc(n)}</button>`).join("")}</div>
  ${ids.length ? "" : `<div class="box"><h4>Nothing collected yet</h4><p>Documents you examine in the archive, the newspaper and the case file collect here.</p></div>`}
  <div class="piles">
    <section class="pile"><h3>Unsorted <span class="muted">(${un.length})</span></h3><div class="drop" data-drop="">${un.map(paperCard).join("") || '<p class="muted">Empty.</p>'}</div></section>
    ${S.sort.piles.map(p => { const mine = ids.filter(i => pileOf(i) === p.id); return `<section class="pile"><div class="row"><label class="sr" for="pn-${p.id}">Pile name</label><input type="text" id="pn-${p.id}" class="pile-name" value="${esc(p.name)}" maxlength="40" data-pname="${p.id}"><button class="chip" data-act="pp-del" data-id="${p.id}" title="Its documents go back to Unsorted">Remove pile</button></div><div class="drop" data-drop="${p.id}">${mine.map(paperCard).join("") || '<p class="muted">Drop documents here.</p>'}</div></section>`; }).join("")}
  </div>`;
}
function moveDoc(id, pile) {
  if (!EV[id]) return;
  if (pile && S.sort.piles.some(p => p.id === pile)) S.sort.place[id] = pile; else delete S.sort.place[id];
  save(); playSfx("paperRustle"); redraw("papers");
}
A["pp-add"] = t => {
  const inp = $("#pp-new"), name = (t.dataset.name || (inp && inp.value) || "").trim().slice(0, 40); if (!name) { inp && inp.focus(); return; }
  S.sort.piles.push({ id: uid(), name }); save(); playSfx("paperRustle"); redraw("papers"); const n = $("#pp-new"); n && n.focus();
};
A["pp-del"] = t => { const id = t.dataset.id; S.sort.piles = S.sort.piles.filter(p => p.id !== id); Object.keys(S.sort.place).forEach(k => { if (S.sort.place[k] === id) delete S.sort.place[k]; }); save(); redraw("papers"); };
document.addEventListener("change", e => {
  const t = e.target; if (!t || !t.dataset) return;
  if (t.dataset.move) moveDoc(t.dataset.move, t.value);
  else if (t.dataset.pname) { const p = S.sort.piles.find(x => x.id === t.dataset.pname); if (p) { p.name = t.value.trim().slice(0, 40) || p.name; save(); redraw("papers"); } }
});
document.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.id === "pp-new") { e.preventDefault(); A["pp-add"](e.target); } });
/* dragging between piles: one rustle when a document is picked up, not one per mouse movement */
let dragCard = null;
document.addEventListener("dragstart", e => { const c = e.target.closest && e.target.closest("[data-card]"); if (!c) return; dragCard = c.dataset.card; try { e.dataTransfer.setData("text/plain", dragCard); e.dataTransfer.effectAllowed = "move"; } catch (x) { } playSfx("paperRustle"); });
document.addEventListener("dragover", e => { const d = e.target.closest && e.target.closest("[data-drop]"); if (d && dragCard) { e.preventDefault(); $$(".drop.over").forEach(x => x !== d && x.classList.remove("over")); d.classList.add("over"); } });
document.addEventListener("dragend", () => { dragCard = null; $$(".drop.over").forEach(x => x.classList.remove("over")); });
document.addEventListener("drop", e => { const d = e.target.closest && e.target.closest("[data-drop]"); if (!d || !dragCard) return; e.preventDefault(); const id = dragCard; dragCard = null; moveDoc(id, d.dataset.drop); });

/* ================= COMPARE ================= */
const pairsFor = c => [...CL[c].ev, ...S.customPairs.filter(p => p.startsWith(c + "|")).map(p => p.split("|")[1])];
function openCompare(c) { if (c) UI.cmp.claim = c; openOv("compare", renderCompare, "blot"); }
function renderCompare() {
  const cid = UI.cmp.claim, c = CL[cid], pairs = pairsFor(cid);
  const avail = EVIDENCE.filter(e => S.inspected[e.id] && !pairs.includes(e.id));
  return `<h2>Compare sources</h2><p class="muted">Choose a claim, read each source beside it, and classify how it relates. Revise any time.</p>
  <details class="box"><summary>Contradiction, difference, or silence?</summary><p><b>Contradiction</b>: two sources make incompatible claims about the same thing. <b>Difference of emphasis</b>: they discuss different parts of an event; that is not a contradiction. <b>Silence</b>: a source does not mention something; that does not prove it false, though silence from a controlled source is weak evidence. An unsupported denial does not weigh the same as a documented record.</p></details>
  <div class="two"><div class="list">${CLAIMS.map(k => `<button class="item ${k.id === cid ? "on" : ""}" data-act="cmp-pick" data-id="${k.id}">${esc(k.short)}<small>${pairsFor(k.id).filter(e => (S.compare[k.id + "|" + e] || {}).cls).length}/${pairsFor(k.id).length} decided</small></button>`).join("")}</div>
  <div><div class="box"><h4>Claim</h4><i>${esc(c.text)}</i><p class="muted">${esc(c.ctx)}</p></div>
  <div class="pairs" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:.8rem">${pairs.map(e => pairCard(cid, e)).join("")}</div>
  <div class="box"><h4>Make your own comparison</h4>${avail.length ? `<div class="row"><select id="cmp-add" aria-label="Evidence item to add">${avail.map(e => `<option value="${e.id}">${esc(e.title)}</option>`).join("")}</select><button class="btn" data-act="cmp-add">Add to this claim</button></div>` : `<p class="muted">Inspect more evidence in the archive and it will become available here.</p>`}</div></div></div>`;
}
function pairCard(cid, eid) {
  const e = EV[eid], k = cid + "|" + eid, d = S.compare[k] || {}; const read = S.inspected[eid];
  const hint = d.cls ? (CL[cid].hints[eid] || "No prepared hint for this pair. Ask: does this source address the same thing as the claim, or a different aspect of it?") : "";
  return `<div class="box"><span class="tag t-${e.auth}">${esc(AUTH[e.auth])}</span><h4>${esc(e.title)}</h4><p>${esc(e.body[0])}</p><p class="muted"><b>Can establish:</b> ${esc(e.establishes)}<br><b>Limits:</b> ${esc(e.limits)}</p>
  <button class="btn alt" data-act="open-ev" data-id="${eid}">${read ? "Re-read full item" : "Read full item first"}</button>
  <fieldset style="border:0;padding:0;margin:.5rem 0"><legend class="muted">How does it relate to the claim?</legend>${CLASSES.map(o => `<label style="margin:.1rem 0"><input type="radio" name="r-${k}" value="${o.v}" ${d.cls === o.v ? "checked" : ""}> ${o.t}</label>`).join("")}</fieldset>
  <label for="w-${k}">Why? (your reasoning)</label><textarea id="w-${k}">${esc(d.why || "")}</textarea>
  <div class="row" style="margin-top:.4rem"><button class="btn" data-act="cmp-save" data-c="${cid}" data-e="${eid}">Save decision</button>${d.cls ? `<button class="btn alt" data-act="cmp-board" data-c="${cid}" data-e="${eid}">Add to board</button>` : ""}</div>
  ${hint ? `<div class="box"><h4>Reading guide</h4>${esc(hint)}</div>` : ""}</div>`;
}
A["cmp-pick"] = t => { UI.cmp.claim = t.dataset.id; redraw("compare"); };
A["cmp-add"] = () => { S.customPairs.push(UI.cmp.claim + "|" + $("#cmp-add").value); save(); redraw("compare"); };
A["cmp-save"] = t => {
  const k = t.dataset.c + "|" + t.dataset.e, r = $(`input[name="r-${k}"]:checked`);
  if (!r) { say("Pick a classification first. “Unresolved” is a valid answer."); return; }
  S.compare[k] = { cls: r.value, why: document.getElementById("w-" + k).value, t: Date.now() }; save(); meter(); redraw("compare"); say("Decision saved. New evidence may change it.");
};
const CLS_REL = { supports: "Supports", contradicts: "Contradicts", context: "Contextualizes", none: "Raises a question", unresolved: "Raises a question" };
A["cmp-board"] = t => {
  const k = t.dataset.c + "|" + t.dataset.e, d = S.compare[k]; if (!d) return;
  const a = ensurePin("claim", t.dataset.c), b = ensurePin("ev", t.dataset.e);
  const rel = CLS_REL[d.cls], ex = S.board.links.find(l => (l.a === a && l.b === b) || (l.a === b && l.b === a));
  if (ex) { ex.rel = rel; ex.why = d.why; } else S.board.links.push({ id: uid(), a: b, b: a, rel, why: d.why });
  save(); playSfx("pinClack"); redraw("board"); say("Linked on the board. That line is my interpretation.");
};

/* ================= NOTES ================= */
function relLabel(rel) { if (!rel) return ""; const [t, id] = rel.split(":"); return t === "ev" ? (EV[id] || {}).title : t === "claim" ? (CL[id] || {}).short : (QUESTIONS.find(q => q.id === id) || {}).text; }
function relOptions(sel) {
  return `<option value="">None</option><optgroup label="Evidence">${EVIDENCE.map(e => `<option value="ev:${e.id}" ${sel === "ev:" + e.id ? "selected" : ""}>${esc(e.title)}</option>`).join("")}</optgroup><optgroup label="Newspaper claims">${CLAIMS.map(c => `<option value="claim:${c.id}" ${sel === "claim:" + c.id ? "selected" : ""}>${esc(c.short)}</option>`).join("")}</optgroup><optgroup label="Questions">${QUESTIONS.map(q => `<option value="q:${q.id}" ${sel === "q:" + q.id ? "selected" : ""}>${esc(q.text)}</option>`).join("")}</optgroup>`;
}
function newNote(o) { const wasOpen = !!OV.noteEd; UI.noteEdit = o; openOv("noteEd", () => { const n = o.id ? S.notes.find(x => x.id === o.id) : null; const v = n || { title: "", body: "", cat: NOTE_CATS[0], rel: o.rel || "" }; return `<h2>${n ? "Edit note" : "New note"}</h2><div class="sheet"><label for="n-t">Title</label><input type="text" id="n-t" value="${esc(v.title)}" maxlength="80"><label for="n-b">Note</label><textarea id="n-b" style="min-height:9rem">${esc(v.body)}</textarea><label for="n-c">Category</label><select id="n-c">${(NOTE_CATS.includes(v.cat) ? NOTE_CATS : [...NOTE_CATS, v.cat]).map(c => `<option ${v.cat === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select><label for="n-r">Related to (optional)</label><select id="n-r">${relOptions(v.rel)}</select></div><p class="muted">Notes are your own working thoughts. They are never treated as established facts.</p><p id="n-err" class="no" role="alert"></p><div class="row"><button class="btn" data-act="note-save">Save</button><button class="btn alt" data-act="close" data-id="noteEd">Cancel</button></div>`; }, "md"); if (!wasOpen) playSfx("scribble"); }
A["note-save"] = () => {
  const title = $("#n-t").value.trim(), body = $("#n-b").value.trim();
  if (!title && !body) { $("#n-err").textContent = "Write a title or some text first."; return; }
  const data = { title: title || "(untitled)", body, cat: $("#n-c").value, rel: $("#n-r").value, t: Date.now() };
  const id = UI.noteEdit && UI.noteEdit.id;
  if (id) Object.assign(S.notes.find(n => n.id === id), data); else S.notes.push({ id: uid(), ...data });
  save(); meter(); closeOv("noteEd"); redraw("notebook", "board", "report"); say(pick("pen"));
};
function openNotebook() { if (!OV.notebook) playSfx("notebookOpen"); openOv("notebook", () => `<h2>Notebook</h2><p class="muted">Your own thoughts, observations and questions. Nothing here is a source.</p><div class="row"><button class="btn" data-act="note-new">New note</button></div>${S.notes.length ? S.notes.map(n => `<div class="note-card"><span class="tag t-S">Your note, not a source</span><span class="tag">${esc(n.cat)}</span><h3 style="margin:.3rem 0">${esc(n.title)}</h3><pre>${esc(n.body)}</pre>${n.rel ? `<p class="muted">Related: ${esc(relLabel(n.rel))}</p>` : ""}<div class="row"><button class="btn alt" data-act="note-edit" data-id="${n.id}">Edit</button><button class="btn alt" data-act="pin" data-type="note" data-ref="${n.id}">Pin to board</button><button class="btn alt" data-act="note-del" data-id="${n.id}">Delete</button></div></div>`).join("") : `<div class="box"><h4>Nothing written yet</h4><p>Notes help you keep what you think apart from what a source says. Try one on the newspaper claim you trust least.</p></div>`}`, "md nb"); }
A["note-new"] = () => newNote({});
A["note-edit"] = t => newNote({ id: t.dataset.id });
A["note-del"] = t => confirmBox("Delete this note? It will also be removed from the board and report.", () => { const id = t.dataset.id; S.notes = S.notes.filter(n => n.id !== id); S.board.items = S.board.items.filter(i => i.id !== "note:" + id); S.board.links = S.board.links.filter(l => l.a !== "note:" + id && l.b !== "note:" + id); S.report.entries.forEach(e => e.notes = e.notes.filter(n => n !== id)); save(); meter(); redraw("notebook", "board", "report"); });

/* ================= BOARD ================= */
function pinTitle(it) {
  if (it.type === "ev") return (EV[it.ref] || {}).title || it.ref;
  if (it.type === "claim") return (CL[it.ref] || {}).short || it.ref;
  if (it.type === "q") return (QUESTIONS.find(q => q.id === it.ref) || {}).text || it.ref;
  const n = S.notes.find(n => n.id === it.ref); return n ? n.title : "(deleted note)";
}
const TYPE_LABEL = { ev: "Source", claim: "Newspaper claim", q: "Question", note: "Your note" };
const REL_SHORT = { "Contextualizes": "Adds context" };
const relShort = r => REL_SHORT[r] || r;
function ensurePin(type, ref) {
  const id = type + ":" + ref;
  if (!S.board.items.find(i => i.id === id)) { const n = S.board.items.length; S.board.items.push({ id, type, ref, x: 3 + (n % 4) * 25, y: 4 + (Math.floor(n / 4) % 3) * 31 + (n % 2) * 14 }); save(); playSfx("pinClack"); }
  return id;
}
A.pin = t => { ensurePin(t.dataset.type, t.dataset.ref); redraw("board"); say("Pinned. Open the board to arrange it."); };
function openBoard() { openOv("board", renderBoard, "", drawLinks); }
function trayItems() {
  const b = UI.board;
  if (b.tab === "ev") return EVIDENCE.filter(e => S.inspected[e.id]).map(e => ({ type: "ev", ref: e.id, t: e.title }));
  if (b.tab === "claim") return CLAIMS.filter(c => S.claimsSeen[c.id]).map(c => ({ type: "claim", ref: c.id, t: c.short }));
  if (b.tab === "q") return QUESTIONS.map(q => ({ type: "q", ref: q.id, t: q.text }));
  return S.notes.map(n => ({ type: "note", ref: n.id, t: n.title }));
}
function suggestions() {
  const out = [];
  Object.entries(S.compare).forEach(([k, d]) => { if (!d.cls) return; const [c, e] = k.split("|"); const a = "claim:" + c, b = "ev:" + e; if (!S.board.links.find(l => (l.a === a && l.b === b) || (l.a === b && l.b === a))) out.push({ c, e, rel: CLS_REL[d.cls] }); });
  return out.slice(0, 4);
}
function linkPanel() {
  const l = S.board.links.find(x => x.id === UI.board.sel);
  if (!l) return `<p class="muted">Select a tag on the board to read or change a connection.</p>`;
  const nm = id => pinTitle(S.board.items.find(i => i.id === id) || { type: "x", ref: id });
  return `<div class="linkpanel" style="--c:${REL_COLOR[l.rel]}"><h4 style="margin:0 0 .3rem">Connection</h4><p style="margin:.1rem 0"><b>${esc(nm(l.a))}</b> → <b>${esc(nm(l.b))}</b></p>
  <label for="lp-rel">Relationship</label><select id="lp-rel">${RELATIONS.map(r => `<option value="${r}" ${l.rel === r ? "selected" : ""}>${r === "Contextualizes" ? "Contextualizes (adds context)" : r}</option>`).join("")}</select>
  <label for="lp-why">Your explanation (optional)</label><textarea id="lp-why" style="min-height:3.5rem">${esc(l.why || "")}</textarea>
  <p class="muted">This line is your interpretation. It does not prove causation, coordination, or conspiracy.</p>
  <div class="row"><button class="btn" data-act="lp-save">Save explanation</button><button class="btn alt" data-act="lp-del">Remove connection</button><button class="btn alt" data-act="lp-close">Done</button></div></div>`;
}
function renderBoard() {
  const b = UI.board, tray = trayItems(), sg = suggestions();
  return `<h2>Investigation board</h2>
  <div class="box warn">A string is <b>your interpretation</b> of how two items relate. It does not prove causation, coordination, or conspiracy.</div>
  <div class="boardwrap"><div class="tray"><div class="chips">${[["ev", "Evidence"], ["claim", "Claims"], ["q", "Questions"], ["note", "Notes"]].map(([k, l]) => `<button class="chip ${b.tab === k ? "on" : ""}" data-act="b-tab" data-k="${k}">${l}</button>`).join("")}</div>
  ${tray.map(i => `<button class="item ${b.pick && b.pick.type === i.type && b.pick.ref === i.ref ? "on" : ""}" data-act="b-pick" data-type="${i.type}" data-ref="${i.ref}">${esc(i.t)}</button>`).join("") || `<p class="muted">${b.tab === "ev" ? "Inspect evidence in the archive to unlock cards." : b.tab === "claim" ? "Inspect newspaper claims to unlock cards." : "Nothing yet."}</p>`}
  <div class="row" style="margin-top:.5rem">${b.pick ? `<button class="btn" data-act="b-auto">Place for me</button><button class="btn alt" data-act="b-unpick">Cancel</button>` : ""}</div>
  <p class="muted">${b.pick ? "Now click an empty spot on the board." : "Click a card, then click the board. Drag pins to move them. Arrow keys move a focused pin."}</p>
  <div class="row"><button class="btn alt" data-act="b-all">Pin everything I've examined</button><button class="btn alt" data-act="b-clear">Clear board</button></div></div>
  <div><div class="muted" id="b-status">${b.from ? `Connecting from “${esc(pinTitle(S.board.items.find(i => i.id === b.from) || {}))}”. Press ⛓ on another card. <button class="btn alt" data-act="b-cancel">Cancel</button>` : "Press ⛓ on a card, then ⛓ on another to tie a string between them."}</div>
  <div id="cork" class="${b.pick ? "placing" : ""}" data-act="b-cork">${S.board.items.map(it => `<div class="pin ${it.type}" data-id="${esc(it.id)}" style="left:${it.x}%;top:${it.y}%" tabindex="0" aria-label="${esc(TYPE_LABEL[it.type] + ": " + pinTitle(it))}"><small>${TYPE_LABEL[it.type]}</small>${esc(pinTitle(it))}<div class="tools">${it.type !== "q" ? `<button data-act="p-open" data-id="${esc(it.id)}" title="Open" aria-label="Open">↗</button>` : ""}<button data-act="p-link" data-id="${esc(it.id)}" title="Connect" aria-label="Connect">⛓</button><button data-act="p-del" data-id="${esc(it.id)}" title="Remove from board" aria-label="Remove from board">×</button></div></div>`).join("")}<svg id="links" aria-hidden="true"></svg><div id="tags"></div>
  ${!S.board.items.length ? `<p style="position:absolute;left:1rem;top:1rem;max-width:20rem;color:#fff;text-shadow:0 1px 2px #000">An empty board. Pick a card from the tray and click here to pin it.</p>` : ""}</div>
  <div id="lp">${linkPanel()}</div>
  ${sg.length ? `<div class="box"><h4>Connections you could tie from your comparisons</h4>${sg.map(x => `<div class="row"><span>${esc(CL[x.c].short)} ↔ ${esc(EV[x.e].title)} (${relShort(x.rel)})</span><button class="btn alt" data-act="cmp-board" data-c="${x.c}" data-e="${x.e}">Tie it</button></div>`).join("")}</div>` : ""}</div></div>`;
}
/* strings hang as curves; tags sit beside the string, away from pins and other tags */
function drawLinks() {
  const svg = $("#links"), cork = $("#cork"), tags = $("#tags"); if (!svg || !cork || !tags) return;
  const W = cork.clientWidth, H = cork.clientHeight, pins = {}, boxes = [];
  $$(".pin", cork).forEach(p => { const o = { x: p.offsetLeft + p.offsetWidth / 2, y: p.offsetTop + 2 }; pins[p.dataset.id] = o; boxes.push([p.offsetLeft - 6, p.offsetTop - 10, p.offsetLeft + p.offsetWidth + 6, p.offsetTop + p.offsetHeight + 6]); });
  const hit = (r, q) => !(r[2] < q[0] || r[0] > q[2] || r[3] < q[1] || r[1] > q[3]);
  const used = {}; let paths = "", html = "", tether = "";
  const sel = S.board.links.find(l => l.id === UI.board.sel);
  S.board.links.forEach(l => {
    const a = pins[l.a], b = pins[l.b]; if (!a || !b) return;
    const key = [l.a, l.b].sort().join("|"), n = used[key] = (used[key] || 0) + 1;
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    let nx = -dy / len, ny = dx / len; if (ny < 0) { nx = -nx; ny = -ny; }
    const bend = Math.min(70, len * .16) + (n - 1) * 34, cx = (a.x + b.x) / 2 + nx * bend, cy = (a.y + b.y) / 2 + ny * bend;
    const d = `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`, on = sel && sel.id === l.id;
    paths += `<path class="shadow" d="${d}"/><path class="${l.rel === "Raises a question" ? "q " : ""}${on ? "sel" : ""}" d="${d}"/>`;
    const mx = .25 * a.x + .5 * cx + .25 * b.x, my = .25 * a.y + .5 * cy + .25 * b.y;
    const label = relShort(l.rel), tw = label.length * 6.6 + 30, th = 24;
    let best = null;
    const at = t => [(1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cx + t * t * b.x, (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cy + t * t * b.y];
    outer: for (const t of [.5, .38, .62, .28, .72]) for (const off of [22, -22, 42, -42, 64, -64]) {
      const [px, py] = at(t), tx = Math.max(tw / 2 + 4, Math.min(W - tw / 2 - 4, px + nx * off)), ty = Math.max(th / 2 + 4, Math.min(H - th / 2 - 4, py + ny * off));
      const r = [tx - tw / 2, ty - th / 2, tx + tw / 2, ty + th / 2];
      if (!boxes.some(q => hit(r, q))) { best = { tx, ty, r, px, py }; break outer; }
    }
    if (!best) { const [px, py] = at(.5), tx = Math.max(tw / 2 + 4, Math.min(W - tw / 2 - 4, px + nx * 24)), ty = Math.max(th / 2 + 4, Math.min(H - th / 2 - 4, py + ny * 24)); best = { tx, ty, px, py, r: [tx - tw / 2, ty - th / 2, tx + tw / 2, ty + th / 2] }; }
    boxes.push(best.r);
    tether += `<line x1="${best.px}" y1="${best.py}" x2="${best.tx}" y2="${best.ty}" stroke="#5a2019" stroke-opacity=".45" stroke-dasharray="2 3"/>`;
    html += `<button class="ctag ${on ? "sel" : ""}" style="left:${best.tx}px;top:${best.ty}px;--c:${REL_COLOR[l.rel]}" data-act="tag" data-id="${l.id}" aria-label="Connection: ${esc(l.rel)}. Select to read or change it.">${esc(label)}</button>`;
  });
  svg.innerHTML = paths + tether; tags.innerHTML = html;
  $$(".pin", cork).forEach(p => p.classList.toggle("hl", !!sel && (p.dataset.id === sel.a || p.dataset.id === sel.b)));
}
A["b-tab"] = t => { UI.board.tab = t.dataset.k; redraw("board"); };
A["b-pick"] = t => { UI.board.pick = { type: t.dataset.type, ref: t.dataset.ref }; redraw("board"); };
A["b-unpick"] = () => { UI.board.pick = null; redraw("board"); };
A["b-auto"] = () => { const p = UI.board.pick; if (p) { ensurePin(p.type, p.ref); UI.board.pick = null; redraw("board"); } };
A["b-cork"] = (t, e) => {
  if (e.target.closest(".pin") || e.target.closest(".ctag")) return;
  if (!UI.board.pick) { if (UI.board.sel) { UI.board.sel = null; redraw("board"); } return; }
  const r = $("#cork").getBoundingClientRect(), p = UI.board.pick, id = p.type + ":" + p.ref;
  const x = Math.max(0, Math.min(78, (e.clientX - r.left) / r.width * 100 - 9)), y = Math.max(0, Math.min(80, (e.clientY - r.top) / r.height * 100 - 5));
  const ex = S.board.items.find(i => i.id === id); if (ex) { ex.x = x; ex.y = y; } else S.board.items.push({ id, type: p.type, ref: p.ref, x, y });
  UI.board.pick = null; save(); playSfx("pinClack"); redraw("board");
};
A["b-all"] = () => { Object.keys(S.inspected).forEach(e => ensurePin("ev", e)); Object.keys(S.claimsSeen).forEach(c => ensurePin("claim", c)); redraw("board"); };
A["b-clear"] = () => confirmBox("Remove every card and connection from the board? Your notes and comparisons stay.", () => { S.board = { items: [], links: [] }; UI.board.sel = null; save(); redraw("board"); }, "Clear board");
A["b-cancel"] = () => { UI.board.from = null; redraw("board"); };
A["p-del"] = t => { const id = t.dataset.id; S.board.items = S.board.items.filter(i => i.id !== id); S.board.links = S.board.links.filter(l => l.a !== id && l.b !== id); save(); redraw("board"); };
A["p-open"] = t => { const it = S.board.items.find(i => i.id === t.dataset.id); if (!it) return; if (it.type === "ev") openArchive({ sel: it.ref }); else if (it.type === "claim") { UI.claim = it.ref; S.claimsSeen[it.ref] = 1; save(); openNews(); } else if (it.type === "note") newNote({ id: it.ref }); };
A["p-link"] = t => {
  const id = t.dataset.id, f = UI.board.from;
  if (!f) { UI.board.from = id; redraw("board"); return; }
  if (f === id) { UI.board.from = null; redraw("board"); return; }
  UI.board.from = null; linkDialog({ a: f, b: id });
};
A.tag = t => { UI.board.sel = UI.board.sel === t.dataset.id ? null : t.dataset.id; redraw("board"); };
A["lp-save"] = () => { const l = S.board.links.find(x => x.id === UI.board.sel); if (!l) return; l.rel = $("#lp-rel").value; l.why = $("#lp-why").value; save(); redraw("board", "report"); say("Connection updated. Still my interpretation."); };
A["lp-del"] = () => { S.board.links = S.board.links.filter(l => l.id !== UI.board.sel); UI.board.sel = null; save(); redraw("board", "report"); };
A["lp-close"] = () => { UI.board.sel = null; redraw("board"); };
document.addEventListener("change", e => {
  if (e.target.id !== "lp-rel") return; const l = S.board.links.find(x => x.id === UI.board.sel); if (!l) return;
  l.rel = e.target.value; save(); const why = $("#lp-why"); if (why) l.why = why.value; save(); redraw("board", "report");
});
function linkDialog(o) {
  const l = { a: o.a, b: o.b, rel: RELATIONS[0], why: "" }; UI.linkEdit = { o, l };
  const nm = id => pinTitle(S.board.items.find(i => i.id === id) || { type: "x", ref: id });
  openOv("linkEd", () => `<h2>New connection</h2><p><b>${esc(nm(l.a))}</b> → <b>${esc(nm(l.b))}</b></p><label for="l-rel">Relationship</label><select id="l-rel">${RELATIONS.map(r => `<option value="${r}">${r === "Contextualizes" ? "Contextualizes (adds context)" : r}</option>`).join("")}</select><label for="l-why">Why do you think so? (optional)</label><textarea id="l-why"></textarea><p class="muted">This is your interpretation. A string does not prove causation, coordination, or conspiracy.</p><div class="row"><button class="btn" data-act="l-save">Tie the string</button><button class="btn alt" data-act="close" data-id="linkEd">Cancel</button></div>`, "sm");
}
A["l-save"] = () => { const { l } = UI.linkEdit; l.rel = $("#l-rel").value; l.why = $("#l-why").value; l.id = uid(); S.board.links.push(l); UI.board.sel = l.id; save(); playSfx("pinClack"); closeOv("linkEd"); redraw("board", "report"); say("Connection saved. Still my interpretation."); };
/* drag pins */
let drag = null;
document.addEventListener("pointerdown", e => {
  const p = e.target.closest(".pin"); if (!p || e.target.closest("button")) return;
  const cork = $("#cork"); if (!cork) return; const r = p.getBoundingClientRect();
  drag = { p, cork, dx: e.clientX - r.left, dy: e.clientY - r.top }; p.setPointerCapture(e.pointerId); p.style.cursor = "grabbing";
});
document.addEventListener("pointermove", e => {
  if (!drag) return; const cr = drag.cork.getBoundingClientRect();
  const x = Math.max(0, Math.min(cr.width - drag.p.offsetWidth, e.clientX - cr.left - drag.dx)), y = Math.max(0, Math.min(cr.height - drag.p.offsetHeight, e.clientY - cr.top - drag.dy));
  drag.p.style.left = x / cr.width * 100 + "%"; drag.p.style.top = y / cr.height * 100 + "%"; drawLinks();
});
document.addEventListener("pointerup", () => {
  if (!drag) return; const it = S.board.items.find(i => i.id === drag.p.dataset.id);
  if (it) { it.x = parseFloat(drag.p.style.left); it.y = parseFloat(drag.p.style.top); save(); } drag.p.style.cursor = ""; drag = null;
});
document.addEventListener("keydown", e => {
  const p = e.target.closest && e.target.closest(".pin"); if (!p || !e.key.startsWith("Arrow") || e.target !== p) return;
  const it = S.board.items.find(i => i.id === p.dataset.id); if (!it) return; e.preventDefault();
  const d = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }[e.key];
  it.x = Math.max(0, Math.min(82, it.x + d[0])); it.y = Math.max(0, Math.min(84, it.y + d[1])); save();
  p.style.left = it.x + "%"; p.style.top = it.y + "%"; drawLinks();
});
window.addEventListener("resize", drawLinks);

/* ================= RADIO ================= */
const audio = new Audio("assets/audio/radio-track.mp3"); audio.preload = "metadata"; audio.loop = true;
let audioMissing = false, jokeShown = false;
try { audio.volume = parseFloat(localStorage.getItem("bth_vol") || "0.7"); } catch (e) { }
audio.addEventListener("error", () => { audioMissing = true; redraw("radio"); });
audio.addEventListener("loadedmetadata", () => { audioMissing = false; redraw("radio"); });
audio.addEventListener("timeupdate", () => { const p = $("#r-prog"); if (p) { p.value = audio.currentTime; p.max = audio.duration || 1; $("#r-time").textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration); } });
audio.addEventListener("play", () => redraw("radio")); audio.addEventListener("pause", () => redraw("radio"));
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "--:--";
function openRadio() {
  openOv("radio", () => `<div class="radio"><h2>Radio</h2><div class="face">
    <p><b>Now playing:</b> The Cozy Sunday</p>
    ${audioMissing ? `<p class="no">The radio is silent. The recording could not be loaded.</p>` : ""}
    <div class="row"><button class="btn" data-act="r-play" ${audioMissing ? "disabled" : ""}>${audio.paused ? "Play" : "Pause"}</button></div>
    <label for="r-prog">Progress</label><progress id="r-prog" value="${audio.currentTime || 0}" max="${audio.duration || 1}"></progress><div id="r-time" class="muted">${fmt(audio.currentTime)} / ${fmt(audio.duration)}</div>
    <label for="r-vol">Volume</label><input type="range" id="r-vol" min="0" max="1" step="0.01" value="${audio.volume}"></div></div>`, "sm", () => { const v = $("#r-vol"); if (v) v.oninput = () => { audio.volume = +v.value; try { localStorage.setItem("bth_vol", v.value); } catch (e) { } }; });
  if (!jokeShown || Math.random() < .15) { jokeShown = true; say(DIALOGUE.radioJoke[0], 7000); }
}
A["r-play"] = () => { if (audio.paused) audio.play().catch(() => { audioMissing = true; redraw("radio"); }); else audio.pause(); };

/* ================= REPORT ================= */
const flags = e => {
  const f = [];
  if (!e.ev.length && e.sec !== "unr") f.push("Cites no evidence item.");
  if (e.ev.length && e.track === "historical" && !e.ev.some(i => EV[i].track === "historical")) f.push("A historical claim should cite at least one historical source.");
  if (e.track === "literary" && e.ev.length && !e.ev.some(i => EV[i].track === "literary")) f.push("A claim about the household should cite an item from The Bartolome File.");
  if (e.sec === "est" && e.ev.length && e.ev.every(i => EV[i].auth === "N" || EV[i].auth === "M")) f.push("Every cited item is a newspaper report or a reading guide. Check it against a historical record before calling it established.");
  if (e.sec === "est" && !e.ev.length && e.notes.length) f.push("Your own notes are interpretations. They cannot establish a fact.");
  if (e.sec !== "est" && !e.limits) f.push("Say what limits this.");
  return f;
};
function openReport() {
  openOv("report", () => {
    const r = readiness(), ed = UI.rep.edit ? S.report.entries.find(x => x.id === UI.rep.edit) : null;
    const v = ed || { sec: "est", text: "", track: "historical", ev: [], notes: [], links: [], limits: "" };
    const insp = EVIDENCE.filter(e => S.inspected[e.id]);
    return `<h2>Final report</h2><p class="muted">Build it from what you have examined. Quality depends on how carefully you use evidence and admit limits, not on which conclusion you reach.</p>
    <details class="box" ${r.ready ? "" : "open"}><summary>Still to do before you can preserve the record</summary><ul class="check">${r.items.map(i => `<li class="${i[0] ? "ok" : "no"}">${i[0] ? "✓" : "○"} ${esc(i[1])}</li>`).join("")}</ul></details>
    <div class="scrap-row"><button type="button" class="scrap-btn" data-act="scrap">Scrap the Case</button></div>
    <div class="box"><h4>${ed ? "Edit entry" : "Add an entry"}</h4>
    <div class="row"><div><label for="r-sec">Section</label><select id="r-sec">${Object.entries(SEC).map(([k, l]) => `<option value="${k}" ${v.sec === k ? "selected" : ""}>${l}</option>`).join("")}</select></div><div><label for="r-trk">Kind of claim</label><select id="r-trk">${[["historical", "Historical"], ["literary", "Household (Bartolome File)"], ["media", "Working notes"]].map(([k, l]) => `<option value="${k}" ${v.track === k ? "selected" : ""}>${l}</option>`).join("")}</select></div></div>
    <label for="r-txt">Your wording (be precise; say who says what)</label><textarea id="r-txt">${esc(v.text)}</textarea>
    <label for="r-lim">What limits this? (required for “suggests” and “unresolved”)</label><textarea id="r-lim" style="min-height:3.5rem">${esc(v.limits)}</textarea>
    <details><summary>Cite evidence you have inspected (${insp.length})</summary>${insp.map(e => `<label style="margin:.1rem 0"><input type="checkbox" name="r-ev" value="${e.id}" ${v.ev.includes(e.id) ? "checked" : ""}> ${esc(e.title)}</label>`).join("") || "<p class='muted'>Nothing inspected yet.</p>"}</details>
    <details><summary>Include your notes (${S.notes.length})</summary>${S.notes.map(n => `<label style="margin:.1rem 0"><input type="checkbox" name="r-nt" value="${n.id}" ${v.notes.includes(n.id) ? "checked" : ""}> ${esc(n.title)}</label>`).join("") || "<p class='muted'>No notes yet.</p>"}</details>
    <details><summary>Include board connections (${S.board.links.length})</summary>${S.board.links.map(l => `<label style="margin:.1rem 0"><input type="checkbox" name="r-lk" value="${l.id}" ${v.links.includes(l.id) ? "checked" : ""}> ${esc(linkText(l))}</label>`).join("") || "<p class='muted'>No connections yet.</p>"}</details>
    <p id="r-err" class="no" role="alert"></p><div class="row"><button class="btn" data-act="r-save">${ed ? "Update entry" : "Add entry"}</button>${ed ? `<button class="btn alt" data-act="r-cancel">Cancel edit</button>` : ""}</div></div>
    <div class="cols3">${Object.entries(SEC).map(([k, l]) => `<div><h3>${l}</h3><p class="muted">${SEC_HELP[k]}</p>${S.report.entries.filter(e => e.sec === k).map(e => `<div class="entry"><p style="margin:0 0 .3rem">${esc(e.text)}</p>${e.limits ? `<p class="muted" style="margin:0 0 .3rem">Limits: ${esc(e.limits)}</p>` : ""}<div class="cite">${e.ev.map(i => esc(EV[i].title)).join("; ") || "No sources cited"}</div>${e.notes.length ? `<div class="cite">Your notes: ${e.notes.map(n => esc((S.notes.find(x => x.id === n) || { title: "?" }).title)).join("; ")}</div>` : ""}${flags(e).map(f => `<div class="no">⚠ ${esc(f)}</div>`).join("")}<div class="row"><button class="btn alt" data-act="r-edit" data-id="${e.id}">Edit</button><button class="btn alt" data-act="r-del" data-id="${e.id}">Remove</button></div></div>`).join("") || `<p class="muted">Empty.</p>`}</div>`).join("")}</div>
    <div class="row" style="margin-top:1rem"><button class="btn" data-act="r-record">For the Record: review and preserve</button></div>`;
  }, "typed");
}
const linkText = l => { const n = id => pinTitle(S.board.items.find(i => i.id === id) || { type: "x", ref: id }); return `${n(l.a)} → ${l.rel} → ${n(l.b)}`; };
A["r-save"] = () => {
  const text = $("#r-txt").value.trim(), sec = $("#r-sec").value, limits = $("#r-lim").value.trim(), err = $("#r-err");
  const ev = $$("input[name=r-ev]:checked").map(i => i.value), notes = $$("input[name=r-nt]:checked").map(i => i.value), links = $$("input[name=r-lk]:checked").map(i => i.value);
  if (!text) { err.textContent = "Write the finding in your own words first."; return; }
  if (sec === "est" && !ev.length) { err.textContent = "An “establishes” entry needs at least one cited evidence item. If you can't cite one, move it to “suggests” or “unresolved”."; return; }
  const data = { sec, text, track: $("#r-trk").value, ev, notes, links, limits };
  if (UI.rep.edit) Object.assign(S.report.entries.find(x => x.id === UI.rep.edit), data); else S.report.entries.push({ id: uid(), ...data });
  UI.rep.edit = null; save(); redraw("report");
};
A["r-edit"] = t => { UI.rep.edit = t.dataset.id; redraw("report"); };
A["r-cancel"] = () => { UI.rep.edit = null; redraw("report"); };
A["r-del"] = t => confirmBox("Remove this entry from the report?", () => { S.report.entries = S.report.entries.filter(e => e.id !== t.dataset.id); save(); redraw("report"); }, "Remove");

/* record of remembrance */
function buildRecord() {
  const L = []; const used = new Set();
  L.push("FOR THE RECORD", "Behind the Headlines: Case File 07", "", "NOTE: “The Capital Courier” is a constructed newspaper used as a case study, not a historical document. Notes and board connections below are the investigator's own interpretations, not established facts.", "");
  Object.entries(SEC).forEach(([k, l]) => {
    L.push("== " + l.toUpperCase() + " ==");
    const es = S.report.entries.filter(e => e.sec === k); if (!es.length) L.push("(none)");
    es.forEach((e, i) => { L.push(`${i + 1}. ${e.text}`); if (e.limits) L.push("   Limits: " + e.limits); if (e.ev.length) { L.push("   Evidence: " + e.ev.map(x => EV[x].title).join("; ")); e.ev.forEach(x => EV[x].src.forEach(s => used.add(s))); } e.notes.forEach(n => { const nt = S.notes.find(x => x.id === n); if (nt) L.push(`   My observation (not a fact) [${nt.cat}]: ${nt.title}: ${nt.body}`); }); e.links.forEach(lid => { const lk = S.board.links.find(x => x.id === lid); if (lk) L.push(`   My connection (interpretation): ${linkText(lk)}${lk.why ? " (" + lk.why + ")" : ""}`); }); });
    L.push("");
  });
  const as = Object.entries(S.claimAssess).filter(([, a]) => a.status);
  if (as.length) { L.push("== MY ASSESSMENTS OF NEWSPAPER CLAIMS (interpretation) =="); as.forEach(([id, a]) => L.push(`- ${CL[id].short}: ${ASSESS[a.status]}${a.why ? ". " + a.why : ""}`)); L.push(""); }
  L.push("== SOURCES (see Source Register; verify before relying) ==");
  [...used].sort().forEach(s => L.push(`${s}: ${SR[s].author}. ${SR[s].title}. ${SR[s].url || "[URL to be completed]"}`));
  return L.join("\n");
}
A["r-record"] = () => {
  const r = readiness();
  if (!r.ready) { openOv("need", () => `<h2>Not quite ready</h2><p>The record needs a bit more behind it:</p><ul class="check">${r.items.filter(i => !i[0]).map(i => `<li class="no">○ ${esc(i[1])}</li>`).join("")}</ul><p class="muted">Use the nav bar to visit the archive, newspaper, comparison desk, notebook, or board.</p><button class="btn" data-act="close" data-id="need">Back to work</button>`, "sm"); return; }
  const warn = S.report.entries.flatMap(e => flags(e));
  openOv("record", () => `<h2>For the Record</h2><p class="muted">Review before preserving. You can go back and edit.</p>${warn.length ? `<div class="box warn"><h4>${warn.length} caution(s) on your entries</h4><p>Open the report to see which entries are flagged. You can preserve anyway, but check them.</p></div>` : ""}<pre class="note-card" style="white-space:pre-wrap">${esc(buildRecord())}</pre><div class="row"><button class="btn alt" data-act="r-dl">Download a copy (.txt)</button><button class="btn alt" data-act="close" data-id="record">Keep editing</button><button class="btn" data-act="r-pass">Place it in the folder</button></div>`, "md");
};
A["r-dl"] = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([buildRecord()], { type: "text/plain" })); a.download = "for-the-record.txt"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
A["r-pass"] = () => { S.report.finalized = true; save(); sfxMuted = true; try { $$("#overlays .ov").forEach(o => closeOv(o.dataset.id)); } finally { sfxMuted = false; } startEnding(); };

/* ================= ENDING: PASS IT ON ================= */
let endTimers = [];
const END_FOLDER = `<svg viewBox="0 0 300 200" class="scene" role="img" aria-label="A manila folder on a desk"><rect width="300" height="200" fill="#2b1f17"/><rect x="40" y="60" width="220" height="110" fill="#d8b97a"/><path d="M40 60 h70 l10 -14 h-80z" fill="#d8b97a"/><rect x="85" y="100" width="130" height="16" fill="#8c3b32" opacity=".8"/><text x="150" y="146" text-anchor="middle" font-family="Courier New,monospace" font-size="14" fill="#6a4f2c">FOR THE RECORD</text></svg>`;
const END_DESK2 = `<svg viewBox="0 0 400 240" class="scene" role="img" aria-label="Another journalist's desk with an open folder, a report, a newspaper, and an investigation board"><rect width="400" height="240" fill="#2c241f"/><rect x="110" y="14" width="180" height="84" fill="#4d3322"/><rect x="116" y="20" width="168" height="72" fill="#a07850"/><rect x="126" y="30" width="34" height="26" fill="#efe4c8"/><rect x="170" y="28" width="38" height="22" fill="#d9c8a0"/><rect x="222" y="32" width="36" height="30" fill="#efe4c8"/><g id="newq" style="opacity:0;transition:opacity 2s"><rect x="196" y="58" width="68" height="28" fill="#f0e2a5" transform="rotate(-3 230 72)"/><text x="230" y="75" text-anchor="middle" font-family="Courier New,monospace" font-size="8" fill="#2b241c" transform="rotate(-3 230 72)">Who was never asked?</text></g><rect y="100" width="400" height="140" fill="#5a3e2b"/><rect x="60" y="130" width="130" height="86" fill="#d8b97a"/><rect x="70" y="136" width="110" height="74" fill="#efe6cf"/><g stroke="#6b6558" stroke-width="3" stroke-dasharray="10 4"><line x1="78" y1="150" x2="170" y2="150"/><line x1="78" y1="162" x2="162" y2="162"/><line x1="78" y1="174" x2="170" y2="174"/><line x1="78" y1="186" x2="150" y2="186"/></g><rect x="206" y="136" width="120" height="84" fill="#e6dcc3" transform="rotate(3 266 178)"/><text x="266" y="156" text-anchor="middle" font-family="Georgia,serif" font-size="9" font-weight="bold" fill="#2b241c" transform="rotate(3 266 178)">THE CAPITAL COURIER</text><g stroke="#5b4f40" stroke-width="3" stroke-dasharray="6 3" transform="rotate(3 266 178)"><line x1="214" y1="170" x2="318" y2="170"/><line x1="214" y1="180" x2="318" y2="180"/><line x1="214" y1="190" x2="300" y2="190"/></g></svg>`;
function startEnding() {
  endTimers.forEach(clearTimeout); endTimers = [];
  const old = $("#end"); old && old.remove();
  const el = document.createElement("div"); el.className = "end"; el.id = "end";
  el.innerHTML = `<div class="knock" id="e-knock" aria-live="polite"></div><div id="e-scene"></div><p class="cap" id="e-cap"></p><div class="row" id="e-btns"><button class="btn alt" data-act="e-skip" style="color:#efe4c9;border-color:#efe4c9;background:transparent">Skip to the end</button></div>`;
  document.body.append(el);
  const cap = t => { const c = $("#e-cap"); if (!c) return; c.classList.add("hide"); setTimeout(() => { c.textContent = t; c.classList.remove("hide"); }, 400); };
  const scene = h => { const s = $("#e-scene"); if (s) s.innerHTML = h; };
  const at = (ms, fn) => endTimers.push(setTimeout(() => { if ($("#end")) fn(); }, ms));
  scene(END_FOLDER);
  const fi = new Image(); fi.onload = () => scene(`<img class="scene" src="assets/folder.png" alt="A folder">`); fi.src = "assets/folder.png";
  cap("The folder holds the report, the sources, the notes, and the questions nobody has answered.");
  at(6000, () => cap("The journalist leaves it where the next person will look."));
  at(11000, () => { playSfx("knock", true); cap(""); $("#e-knock").textContent = "knock."; el.classList.add("shake"); });
  at(12400, () => { playSfx("knock", true); $("#e-knock").textContent = "knock.  knock."; });
  at(13800, () => { playSfx("knock", true); $("#e-knock").textContent = "knock.  knock.  knock."; });
  at(16000, () => { $("#e-knock").textContent = ""; $("#e-scene").classList.add("hide"); cap("The door opens."); });
  at(20000, () => cap(""));
  at(22000, () => { const s = $("#e-scene"); s.classList.remove("hide"); scene(END_DESK2); cap("Another desk. Another journalist opens the folder."); });
  at(28000, () => cap("The report is read. Then every source is checked again, independently."));
  at(34000, () => { const q = $("#newq"); if (q) q.style.opacity = 1; cap("A new question goes up on the board."); });
  at(40000, endFinal);
}
function endFinal() {
  endTimers.forEach(clearTimeout); endTimers = [];
  const el = $("#end"); if (!el) return;
  el.classList.remove("shake");
  $("#e-knock").textContent = "";
  const sc = $("#e-scene"); sc.classList.remove("hide"); sc.innerHTML = END_DESK2;
  const cap = $("#e-cap"); cap.classList.remove("hide"); cap.innerHTML = `<span class="final">One investigation ended. Another began.</span>`;
  setTimeout(() => { const q = $("#newq"); if (q) q.style.opacity = 1; }, 50);
  $("#e-btns").innerHTML = `<button class="btn" data-act="e-close">Return to the desk</button><button class="btn alt" data-act="e-replay" style="color:#efe4c9;border-color:#efe4c9;background:transparent">Replay the ending</button>`;
  $("#e-btns .btn").focus();
}
A["e-skip"] = endFinal;
A["e-close"] = () => { const e = $("#end"); e && e.remove(); say("Back at the desk. It feels quieter."); };
A["e-replay"] = () => startEnding();

/* ================= EASTER EGG: optional, never touches progress ================= */
const DORO_ART = `<svg viewBox="0 0 600 340" role="img" aria-label="Tabloid illustration of a city skyline with smoke"><rect width="600" height="340" fill="#d9c9a0"/><rect y="230" width="600" height="110" fill="#6f6048"/><g fill="#8a7a60"><rect x="20" y="130" width="50" height="110"/><rect x="80" y="100" width="60" height="140"/><rect x="150" y="150" width="45" height="90"/><rect x="400" y="120" width="55" height="120"/><rect x="465" y="90" width="70" height="150"/><rect x="545" y="140" width="45" height="100"/></g><g fill="#c0392b"><path d="M300 60 L270 240 H330 Z"/></g><g stroke="#f4ecd6" stroke-width="3"><path d="M288 110 H312 M282 150 H318 M276 190 H324"/></g><g fill="#3b3329" opacity=".55"><circle cx="150" cy="90" r="26"/><circle cx="178" cy="70" r="20"/><circle cx="440" cy="70" r="28"/><circle cx="470" cy="46" r="20"/></g><circle cx="300" cy="262" r="46" fill="#f4efe0" stroke="#2b241c" stroke-width="3" stroke-dasharray="7 5"/><g fill="#2b241c"><circle cx="286" cy="256" r="4"/><circle cx="314" cy="256" r="4"/><path d="M290 274 q10 7 20 0" fill="none" stroke="#2b241c" stroke-width="3"/></g><g fill="#2b241c"><circle cx="90" cy="290" r="3"/><circle cx="110" cy="300" r="3"/><circle cx="480" cy="290" r="3"/><circle cx="520" cy="304" r="3"/><circle cx="210" cy="306" r="3"/></g></svg>`;
function markDoro() { const m = $("#doroMark"); if (m) m.style.display = S.doro.unlocked ? "" : "none"; }
function openDoro() {
  S.doro.opened = true; save();
  openOv("doro", () => `<div class="tabloid"><div class="mast"><b>${esc(DORO.paper)}</b><span>${esc(DORO.tag)}</span></div>
    <h2>${esc(DORO.headline)}</h2><p class="deck">${esc(DORO.deck)}</p>
    <figure id="doroFig">${DORO_ART}<figcaption>${esc(DORO.caption)}</figcaption></figure>
    <div class="body">${DORO.paras.map(p => `<p>${esc(p)}</p>`).join("")}</div>
    ${S.doro.unlocked ? `<button class="truth" data-act="doro-truth">${esc(DORO.ghost)}</button>` : `<span class="ghost" aria-hidden="true">${esc(DORO.ghost)}</span>`}
    <p class="sat">${esc(DORO.notice)}</p></div>`, "md", () => {
    const f = $("#doroFig"); if (!f) return;
    const im = new Image(); im.onload = () => { const g = $("#doroFig svg"); if (g) { g.replaceWith(Object.assign(im, { alt: "Tabloid illustration: " + DORO.headline })); } }; im.src = DORO.img;
    const c = new Image(); c.onload = () => { const t = $(".tabloid"); if (t) t.style.backgroundImage = `url(${DORO.clip})`; }; c.src = DORO.clip;
  });
  say(DORO.reaction, 7500);
}
A["doro-truth"] = () => {
  if (!S.doro.unlocked) return;
  openOv("doroVideo", () => `<h2>${esc(DORO.ghost)}</h2><div class="vid"><video id="dv" controls playsinline preload="none"></video><div id="dv-msg" class="ph" hidden>HER TRUTH!.</div></div><p class="muted">Truly a remarkable creature.</p>`, "md", () => {
    const v = $("#dv"); if (!v || v.getAttribute("src")) return;
    v.addEventListener("error", () => { v.hidden = true; $("#dv-msg").hidden = false; });
    v.src = DORO.video; v.play().catch(() => { });
  });
};

/* hidden demo shortcut: three clicks on one member portrait launch the ending. Saved data is not touched. */
const demo = { el: null, n: 0, t: 0 };
document.addEventListener("click", e => {
  const m = e.target.closest("[data-demo]"); if (!m) return;
  const now = Date.now(); if (demo.el !== m || now - demo.t > 2500) demo.n = 0;
  demo.el = m; demo.t = now;
  if (++demo.n >= 3) { demo.n = 0; demo.el = null; sfxMuted = true; try { $$("#overlays .ov").forEach(o => closeOv(o.dataset.id)); } finally { sfxMuted = false; } startEnding(); }
});

/* ================= SCRAP THE CASE: tear up the report sheet, then start over =================
   The button lives in the Report (typewriter) panel. Only this game's data is cleared: the KEY entry in localStorage
   plus in-memory state. Unrelated localStorage entries (and the saved radio volume, a setting) are left alone.
   The reset is driven by a timer, never by animation events, so it completes even if the animation cannot run. */
const RIP_SRC = "assets/audio/paper-rip.mp3"; /* put your own paper-ripping sound here (keep the file name) */
const SCRAP_MS = 1300;                        /* the reset never waits longer than this */
let scrapping = false, ripSound = null;
const rr = (a, b) => a + Math.random() * (b - a);
const reducedMotion = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };

function ripAudio() {
  if (!ripSound) { try { ripSound = new Audio(RIP_SRC); ripSound.preload = "auto"; ripSound.volume = .6; } catch (e) { ripSound = null; } }
  return ripSound;
}
function playRip() { /* only ever called from the confirmed click; a missing or blocked file is silently ignored */
  const a = ripAudio(); if (!a) return;
  try { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => { }); } catch (e) { }
}

/* a ragged tear: one wandering vertical rip, then a horizontal rip across each half, giving four scraps */
function tearShapes(W, H) {
  const jag = () => (Math.random() < .12 ? rr(-10, 10) : rr(-4.5, 4.5));
  const xc = W * rr(.42, .58), ph = rr(0, 6.28), amp = W * rr(.015, .04);
  const yl = H * rr(.34, .64), yr = H * rr(.34, .64);
  const ys = [0]; for (let y = 0; (y += rr(9, 19)) < H - 6;) ys.push(y);
  ys.push(H, yl, yr); ys.sort((a, b) => a - b);
  const V = ys.map((y, i) => ({ x: xc + Math.sin(y / H * 3.4 + ph) * amp + (i && i < ys.length - 1 ? jag() : 0), y, v: 1 }));
  const iL = V.findIndex(p => p.y === yl), iR = V.findIndex(p => p.y === yr);
  const hz = (y0, x0, x1) => {
    const n = Math.max(3, Math.round(Math.abs(x1 - x0) / 14)), f = rr(0, 6.28), a = H * rr(.01, .025);
    return Array.from({ length: n + 1 }, (_, i) => { const t = i / n, mid = i > 0 && i < n; return { x: x0 + (x1 - x0) * t + (mid ? rr(-3, 3) : 0), y: y0 + (mid ? Math.sin(t * 7 + f) * a + jag() : 0), h: 1 }; });
  };
  const HL = hz(yl, 0, V[iL].x), HR = hz(yr, V[iR].x, W), c = (x, y) => ({ x, y });
  const defs = [
    { list: [c(0, 0), ...V.slice(0, iL + 1), ...HL.slice(0, -1).reverse()], vs: -1, hs: -1 },
    { list: [...HL.slice(0, -1), ...V.slice(iL), c(0, H)], vs: -1, hs: 1 },
    { list: [...V.slice(0, iR + 1), ...HR.slice(1), c(W, 0)], vs: 1, hs: -1 },
    { list: [...HR.slice(1).reverse(), ...V.slice(iR), c(W, H)], vs: 1, hs: 1 }
  ];
  return defs.map(d => {
    /* "back" is the exact outline; "front" pulls the torn edges in a few pixels so a pale paper fibre rim shows beneath */
    const back = [], front = [], start = [], xs = [], yv = [];
    d.list.forEach(p => {
      back.push(`${p.x.toFixed(1)}px ${p.y.toFixed(1)}px`);
      start.push(`${(p.x - (p.v ? d.vs * 1.4 : 0)).toFixed(1)}px ${(p.y - (p.h ? d.hs * 1.4 : 0)).toFixed(1)}px`); /* overlaps its neighbours slightly so no hairline shows before the rip */
      front.push(`${(p.x + (p.v ? d.vs * rr(1.6, 4.8) : 0)).toFixed(1)}px ${(p.y + (p.h ? d.hs * rr(1.6, 4.8) : 0)).toFixed(1)}px`);
      xs.push(p.x); yv.push(p.y);
    });
    return { back: back.join(","), front: front.join(","), start: start.join(","), left: d.vs < 0, top: d.hs < 0, ox: (Math.min(...xs) + Math.max(...xs)) / 2, oy: (Math.min(...yv) + Math.max(...yv)) / 2 };
  });
}

/* copies the report sheet four times, each clipped to one scrap, and hides the real sheet. Returns the layer, or null. */
function tearPaper(paper) {
  const r = paper.getBoundingClientRect(), W = r.width, H = r.height;
  if (W < 60 || H < 60) return null;
  const cs = getComputedStyle(paper);
  const sb = Math.max(0, paper.offsetWidth - paper.clientWidth - (parseFloat(cs.borderLeftWidth) || 0) - (parseFloat(cs.borderRightWidth) || 0));
  const fields = $$("textarea,input,select", paper);
  const copy = () => {
    const k = paper.cloneNode(true);
    $$("[id]", k).forEach(n => n.removeAttribute("id"));
    $$("[data-act],[data-demo]", k).forEach(n => { n.removeAttribute("data-act"); n.removeAttribute("data-demo"); });
    $$("textarea,input,select", k).forEach((f, i) => { const o = fields[i]; if (!o) return; if (o.type === "checkbox" || o.type === "radio") f.checked = o.checked; else f.value = o.value; f.tabIndex = -1; });
    ["role", "aria-modal", "aria-label"].forEach(a => k.removeAttribute(a));
    k.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px;max-height:none;margin:0;overflow:hidden;padding-right:calc(${cs.paddingRight} + ${sb}px)`;
    return k;
  };
  const layer = document.createElement("div"); layer.className = "rip-layer"; layer.setAttribute("aria-hidden", "true");
  layer.style.setProperty("--rip-ms", (SCRAP_MS - 60) + "ms");
  const copies = [];
  tearShapes(W, H).forEach(s => {
    const dir = s.left ? -1 : 1, up = s.top ? -1 : 1;
    const piece = document.createElement("div"); piece.className = "rip-piece";
    piece.style.cssText = `left:${r.left}px;top:${r.top}px;width:${W}px;height:${H}px;transform-origin:${s.ox}px ${s.oy}px;` +
      `--ax:${(dir * W * rr(.02, .04)).toFixed(1)}px;--ay:${(up * H * rr(.025, .06)).toFixed(1)}px;--ar:${(dir * rr(1.5, 4)).toFixed(1)}deg;` +
      `--bx:${(dir * W * rr(.2, .42)).toFixed(1)}px;--by:${(H * (s.top ? rr(.2, .45) : rr(.45, .85))).toFixed(1)}px;--br:${(dir * rr(14, 34)).toFixed(1)}deg;` +
      `--wob:${rr(.3, .7).toFixed(2)}deg;animation-delay:${Math.round(rr(0, 50))}ms`;
    const edge = document.createElement("div"); edge.className = "rip-edge"; edge.style.clipPath = `polygon(${s.back})`;
    const face = document.createElement("div"); face.className = "rip-face"; face.style.clipPath = `polygon(${s.front})`; face.style.setProperty("--c0", s.start);
    const k = copy(); face.append(k); copies.push(k);
    piece.inert = true; piece.append(edge, face); layer.append(piece); /* inert: nothing inside a scrap can be focused or read out */
  });
  document.body.append(layer);
  copies.forEach(k => { k.scrollTop = paper.scrollTop; });
  paper.style.visibility = "hidden"; /* last step: from here the player sees only the scraps */
  return layer;
}

/* every in-memory and saved piece of this game's progress goes back to a fresh start */
function resetAllProgress() {
  try { localStorage.removeItem(KEY); } catch (e) { }
  S = defState();
  Object.keys(UI).forEach(k => delete UI[k]); Object.assign(UI, JSON.parse(UI0));
  Object.keys(lastLine).forEach(k => delete lastLine[k]);
  jokeShown = false; confirmFn = null; demo.el = null; demo.n = 0; demo.t = 0;
  endTimers.forEach(clearTimeout); endTimers = []; const en = $("#end"); if (en) en.remove();
  try { audio.pause(); audio.currentTime = 0; } catch (e) { }
  sfxMuted = true; try { $$("#overlays .ov").forEach(o => closeOv(o.dataset.id)); } finally { sfxMuted = false; }
  resetDrawers(); setPen(false); meter(); markDoro();
  say("Desk cleared. A fresh start."); openIntro();
}

function scrapTheCase() {
  if (scrapping) return;
  scrapping = true;
  const paper = $("#ov-report .panel"), blockKeys = e => e.stopPropagation();
  const lock = on => ["#top", "#stage", "#overlays"].forEach(q => { const n = $(q); if (n) n.inert = on; });
  let layer = null, done = false;
  const finish = () => {
    if (done) return; done = true;
    window.removeEventListener("keydown", blockKeys, true);
    try { $$(".rip-layer").forEach(n => n.remove()); lock(false); } catch (e) { }
    try { resetAllProgress(); } finally { scrapping = false; }
  };
  playRip();
  if (paper && !reducedMotion()) {
    try { window.addEventListener("keydown", blockKeys, true); lock(true); layer = tearPaper(paper); } catch (e) { layer = null; }
  }
  if (!layer) { finish(); return; } /* reduced motion, no sheet to tear, or the animation could not be built: reset right away */
  setTimeout(finish, SCRAP_MS);
}
A.scrap = () => {
  if (scrapping) return;
  ripAudio(); /* begin loading the sound while the player reads the question */
  confirmBox("Do you really want to abandon this investigation and start over? Scrapping the case permanently erases your saved investigation progress, collected evidence progress, notes, source comparisons, corkboard arrangements, and report draft in this browser. This cannot be undone.", scrapTheCase, "Scrap the case");
};

/* ================= SIDE DRAWERS: two small surprises that stay on the desk ================= */
const EGG_IMG = { speakiImg: ["assets/images/speaki.png", "assets/speaki.png", "assets/images/Speaki.png", "assets/Speaki.png"], freddyImg: ["assets/images/freddy-fazbear.png", "assets/freddy-fazbear.png", "assets/images/Freddy-Fazbear.png", "assets/images/freddy.png", "assets/freddy.png"] };
const egg = { busyC: false, busyL: false, busyR: false, openR: false, timers: [] };
const eggLater = (fn, ms) => { egg.timers.push(setTimeout(() => { try { fn(); } catch (e) { } }, ms)); };
/* the picture is only attached if the file really loads, so a missing file leaves the drawer working and nothing broken on screen */
function loadEggImages() {
  Object.entries(EGG_IMG).forEach(([id, srcs]) => {
    const el = $("#" + id); if (!el) return;
    const tryNext = i => { if (i >= srcs.length) return; const im = new Image(); im.onload = () => { el.setAttribute("href", srcs[i]); if (id === "freddyImg") $("#freddyHit").classList.add("has-img"); }; im.onerror = () => tryNext(i + 1); im.src = srcs[i]; };
    tryNext(0);
  });
}
/* left drawer: opens, Speaki peeks out and cries, the drawer shuts by itself */
function speakiDrawer() {
  if (egg.busyL) return; egg.busyL = true;
  const d = $("#drawerL"), sp = $("#speakiG"); d.setAttribute("aria-disabled", "true");
  d.classList.add("opening"); playSfx("drawerOpen");
  eggLater(() => sp.classList.add("up"), 380);
  eggLater(() => playSfx("speakiCry"), 600);
  eggLater(() => sp.classList.remove("up"), 1900);
  eggLater(() => { d.classList.remove("opening"); playSfx("drawerClose"); }, 2250);
  eggLater(() => { egg.busyL = false; d.removeAttribute("aria-disabled"); }, 2700);
}
/* right drawer: stays open with Freddy inside until the player shuts it */
function freddyDrawer() {
  if (egg.busyR) return;
  if (egg.openR) { closeRight(); return; }
  egg.busyR = true; egg.openR = true;
  const d = $("#drawerR"); d.classList.add("opening"); playSfx("drawerOpen");
  d.setAttribute("aria-label", "Right desk drawer: click to shut it");
  eggLater(() => { $("#freddyHit").classList.add("up"); $("#freddyHit").setAttribute("tabindex", "0"); $("#shutTag").classList.add("on"); }, 380);
  eggLater(() => { egg.busyR = false; }, 720);
}
function closeRight(quiet) {
  if (!egg.openR) return; egg.busyR = true;
  const d = $("#drawerR"), f = $("#freddyHit");
  f.classList.remove("up", "wob"); f.setAttribute("tabindex", "-1"); $("#shutTag").classList.remove("on");
  eggLater(() => { d.classList.remove("opening"); d.setAttribute("aria-label", "Right desk drawer"); if (!quiet) playSfx("drawerClose"); }, 320);
  eggLater(() => { egg.openR = false; egg.busyR = false; }, 720);
}
function freddyClick() {
  if (!egg.openR) return;
  const f = $("#freddyHit"); f.classList.remove("wob"); void f.getBoundingClientRect(); f.classList.add("wob");
  playSfx("freddy");   /* ignored while it is still playing, so clicks never stack */
}
/* back to a closed, quiet desk (used by the resets) */
function resetDrawers() {
  egg.timers.forEach(clearTimeout); egg.timers = []; egg.busyC = egg.busyL = egg.busyR = egg.openR = false;
  ["drawerL", "drawerR"].forEach(i => { const d = $("#" + i); if (d) { d.classList.remove("opening"); d.removeAttribute("aria-disabled"); } });
  const d = $("#drawerR"); d && d.setAttribute("aria-label", "Right desk drawer");
  ["speakiG", "freddyHit", "shutTag"].forEach(i => { const e = $("#" + i); e && e.classList.remove("up", "wob", "on"); });
  const f = $("#freddyHit"); f && f.setAttribute("tabindex", "-1");
}

/* ================= INIT ================= */
meter(); markDoro(); loadEggImages();
if (!S.introSeen) openIntro();
