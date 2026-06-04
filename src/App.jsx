import { useState, useEffect } from "react";

// ── SUPABASE CONFIG ──────────────────────────────────────────────
const SUPABASE_URL = "https://oodpfafyjubqpyoedvov.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vZHBmYWZ5anVicXB5b2Vkdm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjI3MTcsImV4cCI6MjA5NjEzODcxN30.YM2gomq_dk5krStWJZpob2rK2lEqf8MPRapzEqHngdw";
const TABLE = "responses";

async function saveToSupabase(profile) {
  const row = {
    name:                profile.name,
    age_group:           profile.ageGroup,
    type:                profile.type,
    register:            profile.register,
    register_secondary:  profile.registerSecondary || null,
    effort:              profile.effort,
    spontaneity:         profile.spontaneity,
    social:              profile.social,
    decision_style:      profile.decisionStyle,
    raw_answers:         profile.rawAnswers,
  };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "apikey":        SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer":        "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
}

async function loadFromSupabase() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${TABLE}?select=*&order=created_at.desc`,
    {
      headers: {
        "apikey":        SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── PALETTE ──────────────────────────────────────────────────────
const C = {
  bg:"#f7f3ec", card:"#ffffff", cardAlt:"#fbf8f2",
  border:"#ebe4d8", borderHi:"#d8cdbb",
  accent:"#d98a63", accentSoft:"#f9ede4", accentDeep:"#b15f3b",
  text:"#3a3530", textSoft:"#6b645b", muted:"#9c958a", dim:"#f0eadf",
};
const SERIF = "'Fraunces', Georgia, serif";
const SANS  = "'DM Sans', -apple-system, sans-serif";
const GFONT = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=DM+Sans:wght@300;400;500;600&display=swap";
const SHADOW    = "0 1px 2px rgba(58,53,48,0.04), 0 6px 20px rgba(58,53,48,0.06)";
const SHADOW_SM = "0 1px 2px rgba(58,53,48,0.03), 0 2px 8px rgba(58,53,48,0.04)";

const v   = (age, y, o) => age === "y" ? y : o;
const RM  = { creative:"Creative", intellectual:"Intellectual", physical:"Physical", social:"Social", restorative:"Restorative" };

// ── QUESTIONS ────────────────────────────────────────────────────
function buildQ(age) {
  const y = (a, b) => v(age, a, b);
  return {
    q1: {
      id:"q1", type:"single",
      text: y("free saturday, money to spend. what are you actually doing?",
               "rare free saturday, schedule actually clear. what sounds most like you?"),
      options: y([
        { id:"novelty",  label:"hunting down somewhere new — i'll figure it out when i get there" },
        { id:"balanced", label:"finally trying that place i've been meaning to check out" },
        { id:"comfort",  label:"going back somewhere i know — why gamble on a rare free day" },
      ],[
        { id:"novelty",  label:"somewhere completely new — a part of the city i haven't explored" },
        { id:"balanced", label:"that place i bookmarked ages ago — feels like the right day" },
        { id:"comfort",  label:"somewhere i already know is good — a free day isn't the day to risk it" },
      ]),
    },
    q2a: {
      id:"q2a", type:"multi", cap:2,
      text: y("and what kind of new are we talking? pick 2.","what does 'new' usually mean for you? pick 2."),
      options:[
        { id:"place",        label:"📍 somewhere i've never been — a new spot, off the usual circuit" },
        { id:"intellectual", label:"💡 something that'll actually make me think or learn" },
        { id:"social",       label:"🌐 meeting people outside my usual circle — that's the point" },
        { id:"physical",     label:"💪 something active i haven't tried — a new sport, class, trail" },
        { id:"creative",     label:"🎨 something creative — making something, or being moved by it" },
      ],
    },
    q2b: {
      id:"q2b", type:"multi", cap:null,
      text: y("when you do try something new — what's usually going on? pick all that feel true.",
               "when you're in the mood to try something different — what's usually behind it?"),
      options:[
        { id:"energy",  label: y("😄 i'm in a good headspace and actually have energy for it","😄 i'm having a good week and want to mark it with something different") },
        { id:"fatigue", label:"😮‍💨 i've been stuck in the same routine and i can feel it" },
        { id:"proof",   label:"👌 someone i trust suggested it — there's some social proof behind it" },
        { id:"company", label:"🫂 the right person is coming with me — certain people make me bolder" },
        { id:"story",   label: y("✨ i want something worth actually talking about afterwards","✨ i want an experience i'll actually reference later — not just another evening") },
      ],
    },
    q2c: {
      id:"q2c", type:"multi", cap:2,
      text: y("when something feels like a guaranteed good time — what makes it that way? pick 2.",
               "when something feels reliable and worth it — what's usually behind that? pick 2."),
      options:[
        { id:"known-place",  label: y("📍 a place i already know and like — familiarity is the point","📍 somewhere i've been before and liked — going because i know it") },
        { id:"known-format", label:"🔁 a format i've done before and genuinely enjoy" },
        { id:"company",      label:"🫂 the right people with me — that matters more than the activity" },
        { id:"expectation",  label:"✅ i know exactly what i'm walking into — no surprises" },
        { id:"friction",     label: y("🚗 it's easy to get to — i'm not fighting the city for it","🚗 low friction to get there — the experience starts before i arrive") },
      ],
    },
    q3a: {
      id:"q3a", type:"single",
      text: y("and who do you want with you when you're trying something new?","what's the right social setup for discovering something new?"),
      options:[
        { id:"solo",  label: y("🧍 just me — i move faster and don't have to compromise","🧍 solo — fully at my own pace, no coordinating") },
        { id:"pair",  label: y("👥 one person, whoever i'm closest to right now","👥 one person i genuinely want there with me") },
        { id:"small", label: y("👨‍👩‍👧 my close group — three or four people i actually know","👨‍👩‍👧 small group — close friends, enough energy, no logistics headache") },
        { id:"large", label:"🎉 the whole group — i like the collective energy" },
        { id:"open",  label: y("🌐 open to whoever — new people in that context is fine","🌐 open to meeting people — if i'm already stepping out, why not") },
      ],
    },
    q3b: {
      id:"q3b", type:"single",
      text: y("who do you usually end up going out with?","what's your usual social setup when you go out?"),
      options:[
        { id:"solo",     label: y("🧍 on my own honestly — more than people might expect","🧍 solo — i actually prefer my own company for a lot of this") },
        { id:"pair",     label: y("👥 one person — two is genuinely the right dynamic for me","👥 partner or one close friend — that's the unit i default to") },
        { id:"small",    label: y("👨‍👩‍👧 small group — my actual close friends, not the full group chat","👨‍👩‍👧 small group of people i'm genuinely close to") },
        { id:"large",    label: y("🎉 the whole group when possible — i like that energy","🎉 bigger group — smaller plans can feel underwhelming") },
        { id:"flexible", label:"🔀 genuinely varies — the activity usually decides it" },
      ],
    },
    q3c: {
      id:"q3c", type:"single",
      text: y("when you're doing something you enjoy — how much do you actually want to exert?","how much do you want to invest in the experience itself?"),
      options:[
        { id:"high",     label: y("🔥🔥🔥 a lot — i feel better when i've actually done something","🔥🔥🔥 high — passive experiences rarely satisfy me") },
        { id:"medium",   label:"🔥🔥 engaged but not wiped out — somewhere in the middle" },
        { id:"low",      label: y("🔥 low — show up, enjoy it, no effort required","🔥 low — i want to arrive and have it be good without working for it") },
        { id:"variable", label: y("🔄 completely depends on how my week's gone","🔄 varies too much — a long week changes everything") },
      ],
    },
    q4_effort: {
      id:"q4_effort", type:"single",
      text: y("how much do you actually want to do when you're out?","how much effort do you want to invest in the experience itself?"),
      options:[
        { id:"high",     label: y("🔥🔥🔥 a lot — passive feels like a waste of going out","🔥🔥🔥 high — i'd rather push myself and feel it afterwards") },
        { id:"medium",   label:"🔥🔥 active and present, but not at my limit" },
        { id:"low",      label: y("🔥 low — i want to arrive and enjoy without working for it","🔥 low — arrive, settle in, have it come to me") },
        { id:"variable", label: y("🔄 honestly depends on how my week's been","🔄 varies week to week — a brutal week changes everything") },
      ],
    },
    q5_spont: {
      id:"q5_spont", type:"single",
      text: y("do you tend to plan it or just go?","how do you prefer to plan?"),
      options:[
        { id:"spontaneous", label: y("⚡ i basically just go — if i'm in the mood, i'm there","⚡ last minute — if i'm free and in the mood, i go") },
        { id:"loose",       label: y("📆 day or two ahead — loose plan, nothing locked in","📆 loose structure — a few days ahead, nothing rigid") },
        { id:"planned",     label: y("🗓️ i like it in the calendar — something to look forward to","🗓️ planned — free time is precious, i'm not winging it") },
      ],
    },
    q4_spont: {
      id:"q4_spont", type:"single",
      text: y("how do plans usually happen for you?","how do you prefer to approach plans generally?"),
      options:[
        { id:"spontaneous", label: y("⚡ last minute — something comes up and i go","⚡ last minute — if i'm free and in the mood, i go") },
        { id:"loose",       label: y("📆 a couple of days ahead — rough idea, that's enough","📆 loose structure — a few days ahead, nothing rigid") },
        { id:"planned",     label: y("🗓️ i like it locked in — i'm more likely to actually go","🗓️ planned — free time is precious, i'm not winging it") },
      ],
    },
    q5_effort: {
      id:"q5_effort", type:"single",
      text: y("on a typical outing — how much energy do you want to spend?","how much do you want to invest in the experience itself?"),
      options:[
        { id:"high",     label: y("🔥🔥🔥 a lot — i feel it more when i've actually done something","🔥🔥🔥 high — i'd rather push myself and feel it afterwards") },
        { id:"medium",   label:"🔥🔥 engaged but sustainable — active without being drained" },
        { id:"low",      label: y("🔥 low — show up, enjoy, the effort of getting there is enough","🔥 low — arrive, settle in, have it come to me") },
        { id:"variable", label: y("🔄 depends on the week — i can't call it in advance","🔄 varies week to week — a brutal week changes everything") },
      ],
    },
    q4_social: {
      id:"q4_social", type:"single",
      text: y("switching gears — who do you usually go out and do things with?","who's your usual social setup when you go out?"),
      options:[
        { id:"solo",   label: y("🧍 just me — i like the freedom of going alone","🧍 solo — fully at my own pace, no coordinating") },
        { id:"pair",   label: y("👥 one person — my partner or whoever i'm closest to","👥 partner or one close friend — that's what i default to") },
        { id:"small",  label: y("👨‍👩‍👧 small close group — three to five people i actually know","👨‍👩‍👧 small group of people i'm genuinely close to — three to five max") },
        { id:"large",  label: y("🎉 the whole group — i like the energy when everyone's there","🎉 bigger group — smaller plans can feel underwhelming to me") },
        { id:"family", label: y("🏠 family, cousins included — honestly some of my best outings","🏠 family — cousins count too, some of my best outings honestly") },
      ],
    },
    q5_spont_comfort: {
      id:"q5_spont_comfort", type:"single",
      text: y("do you plan ahead or go when the mood hits?","how do you prefer to approach plans?"),
      options:[
        { id:"spontaneous", label: y("⚡ whenever the mood hits — advance planning feels wrong","⚡ last minute — if i'm free and in the mood, i go") },
        { id:"loose",       label: y("📆 a few days ahead is enough — i don't need it all sorted","📆 loose structure — a few days ahead, nothing rigid") },
        { id:"planned",     label: y("🗓️ i'd rather have it planned — free time is too rare to gamble on","🗓️ planned — free time is precious, i'm not winging it") },
      ],
    },
    q6: {
      id:"q6", type:"single",
      text: y("last proper one. when a plan's genuinely hit right — what made it that way?",
               "last one. when something's genuinely been worth it — what was at the centre of it?"),
      options:[
        { id:"creative",     label: y("🎨 i made or felt something creative — that was the centre of it","🎨 something creative happened — i made it, felt it, or was moved by it") },
        { id:"intellectual", label: y("💡 i came away thinking differently about something","💡 i came away having thought about something properly") },
        { id:"physical",     label: y("💪 my body actually did something — i felt it physically","💪 i was physically present — moved, exerted, used my body") },
        { id:"social",       label: y("🤝 something real happened between me and the people i was with","🤝 the people — something genuine happened between us") },
        { id:"restorative",  label: y("🍃 i actually switched off and felt restored — lighter coming home","🍃 i genuinely decompressed — came home lighter and more like myself") },
      ],
    },
    q7: {
      id:"q7", type:"single",
      text: y("last one — when you're figuring out what to do with free time, which are you?",
               "last one — when you're deciding what to do with free time, which sounds like you?"),
      options:[
        { id:"surprise", label: y("🎲 i'd rather just be told what to do — surprise me","🎲 i'd rather someone just make the call — surprise me") },
        { id:"browse",   label: y("🔍 i'd rather see the options and pick myself","🔍 i'd rather see everything and choose myself") },
        { id:"hybrid",   label: y("⚖️ a bit of both — some suggestions, some browsing","⚖️ a mix — a starting point, then i'll explore") },
      ],
    },
  };
}

// ── FLOW ─────────────────────────────────────────────────────────
function getFlow(answers, age) {
  const Q = buildQ(age || "y");
  if (!answers.q1) return [Q.q1];
  const flow = [Q.q1];
  if (answers.q1 === "novelty")       flow.push(Q.q2a, Q.q3a, Q.q4_effort, Q.q5_spont);
  else if (answers.q1 === "balanced") flow.push(Q.q2b, Q.q3b, Q.q4_spont,  Q.q5_effort);
  else                                flow.push(Q.q2c, Q.q3c, Q.q4_social,  Q.q5_spont_comfort);
  flow.push(Q.q6);
  if (answers.q6) {
    flow.push({
      id:"q6b", type:"single", isSecondary:true, text:"close second?",
      options: buildQ(age || "y").q6.options
        .filter(o => o.id !== answers.q6)
        .concat([{ id:"none", label:"nope, just that one ✓" }]),
    });
  }
  if (answers.q6b !== undefined) flow.push(Q.q7);
  return flow;
}

// ── PROFILE BUILDER ───────────────────────────────────────────────
function buildProfile(name, age, answers) {
  const BM  = { novelty:"Explorer", balanced:"Balanced", comfort:"Comfort-Seeker" };
  const EM  = { high:"High energy", medium:"Medium", low:"Low effort", variable:"Mood-dependent" };
  const SM  = { spontaneous:"Spontaneous", loose:"Loose structure", planned:"Planner" };
  const SCM = { solo:"Solo", pair:"One-on-one", small:"Small group", large:"Big group", open:"Open / mixed", flexible:"Flexible", family:"Family group" };
  const DM  = { surprise:"Likes to be guided", browse:"Likes to choose", hybrid:"Flexible" };
  return {
    name, ageGroup: age === "y" ? "18-25" : "26-35",
    type:              BM[answers.q1] || "-",
    register:          RM[answers.q6] || "-",
    registerSecondary: (answers.q6b && answers.q6b !== "none") ? RM[answers.q6b] : null,
    effort:            EM[answers.q4_effort || answers.q5_effort || answers.q3c] || "-",
    spontaneity:       SM[answers.q4_spont  || answers.q5_spont  || answers.q5_spont_comfort] || "-",
    social:            SCM[answers.q3a || answers.q3b || answers.q4_social] || "-",
    decisionStyle:     DM[answers.q7] || "-",
    rawAnswers:        answers,
    timestamp:         Date.now(),
  };
}

// ── COMPONENTS ───────────────────────────────────────────────────
function Opt({ label, selected, onClick, faded }) {
  return (
    <button onClick={faded && !selected ? undefined : onClick} style={{
      display:"block", width:"100%", textAlign:"left",
      padding:"14px 16px", marginBottom:10, borderRadius:14,
      border:`1.5px solid ${selected ? C.accent : C.border}`,
      background: selected ? C.accentSoft : C.card,
      color: selected ? C.accentDeep : C.text,
      opacity: faded && !selected ? 0.38 : 1,
      fontSize:15, lineHeight:1.5, fontFamily:SANS,
      cursor: faded && !selected ? "default" : "pointer",
      boxShadow: selected ? "none" : SHADOW_SM,
      transition:"all 0.13s ease",
    }}>{label}</button>
  );
}

function ProfileCard({ p, compact, showDecision }) {
  const rows = [
    ["Type",        p.type],
    ["Drawn to",    p.registerSecondary ? `${p.register} + ${p.registerSecondary}` : p.register],
    ["Energy",      p.effort],
    ["Planning",    p.spontaneity],
    ["Social",      p.social],
  ];
  if (showDecision) rows.push(["Decision style", p.decisionStyle]);
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:18,
      padding: compact ? "15px 17px" : "22px 24px", marginBottom:12, boxShadow:SHADOW }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:13 }}>
        <span style={{ fontFamily:SERIF, fontSize:compact?17:21, fontWeight:500, color:C.text }}>{p.name}</span>
        <span style={{ fontSize:11, color:C.muted, background:C.dim, padding:"3px 9px", borderRadius:20 }}>{p.ageGroup}</span>
      </div>
      {rows.map(([k, val]) => (
        <div key={k} style={{ display:"flex", justifyContent:"space-between",
          marginBottom:compact?5:7, fontSize:compact?13.5:14.5 }}>
          <span style={{color:C.muted}}>{k}</span>
          <span style={{color:C.text, fontWeight:500, maxWidth:"60%", textAlign:"right"}}>{val}</span>
        </div>
      ))}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────
export default function App() {
  const [screen,    setScreen]    = useState("home");
  const [name,      setName]      = useState("");
  const [age,       setAge]       = useState(null);
  const [answers,   setAnswers]   = useState({});
  const [step,      setStep]      = useState(0);
  const [multiSel,  setMultiSel]  = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [vis,       setVis]       = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [saveErr,   setSaveErr]   = useState(null);
  const [profiles,  setProfiles]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [adminTaps, setAdminTaps] = useState(0);

  const flow     = getFlow(answers, age);
  const currentQ = flow[step] || null;
  const pct      = flow.length > 1 ? (step / (flow.length - 1)) * 100 : 0;

  const fade = (fn) => { setVis(false); setTimeout(() => { fn(); setVis(true); }, 155); };

  function advance(newAnswers) {
    const nf = getFlow(newAnswers, age);
    if (step + 1 < nf.length) {
      fade(() => { setStep(s => s + 1); setMultiSel([]); });
    } else {
      finish(newAnswers);
    }
  }

  async function finish(finalAnswers) {
    const p = buildProfile(name, age, finalAnswers);
    setMyProfile(p);
    setSaving(true); setSaveErr(null);
    try {
      await saveToSupabase(p);
    } catch(e) {
      setSaveErr("couldn't save — check your connection and try again.");
      console.error(e);
    } finally { setSaving(false); }
    setScreen("result");
  }

  function handleSingle(id) {
    const a = { ...answers, [currentQ.id]: id };
    setAnswers(a);
    setTimeout(() => advance(a), 175);
  }

  function handleMultiNext() {
    const a = { ...answers, [currentQ.id]: multiSel };
    setAnswers(a); advance(a);
  }

  function restart() {
    setScreen("home"); setName(""); setAge(null);
    setAnswers({}); setStep(0); setMultiSel([]);
    setMyProfile(null); setVis(true); setSaveErr(null);
  }

  async function openAdmin() {
    setScreen("admin"); setLoading(true);
    try { setProfiles(await loadFromSupabase()); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  }

  // ── HOME ────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={PAGE}>
      <link rel="stylesheet" href={GFONT} />
      <div style={{maxWidth:400, width:"100%", textAlign:"center"}}>
        <div onClick={() => { const n=adminTaps+1; setAdminTaps(n); if(n>=5) openAdmin(); }}
          style={{fontSize:42, marginBottom:20, cursor:"default", userSelect:"none"}}>👋</div>
        <h1 style={{fontFamily:SERIF, fontSize:38, fontWeight:500, color:C.text, margin:"0 0 14px", lineHeight:1.15}}>
          a few questions.
        </h1>
        <p style={{color:C.textSoft, fontSize:15.5, lineHeight:1.65, margin:"0 0 40px"}}>
          takes about 2 minutes.<br/>there are no wrong answers — just go with your gut.
        </p>
        <button onClick={() => setScreen("setup")} style={BTN_PRIMARY}>let's go</button>
      </div>
    </div>
  );

  // ── SETUP ───────────────────────────────────────────────────────
  if (screen === "setup") return (
    <div style={PAGE}>
      <link rel="stylesheet" href={GFONT} />
      <div style={{maxWidth:400, width:"100%"}}>
        <div style={{fontFamily:SERIF, fontSize:27, fontWeight:500, color:C.text, marginBottom:6}}>first, the basics</div>
        <p style={{color:C.textSoft, fontSize:14.5, marginBottom:30}}>just two quick things.</p>
        <label style={LABEL}>your name</label>
        <input value={name} onChange={e=>setName(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&name.trim()&&age){setStep(0);setScreen("quiz");}}}
          placeholder="first name is fine" autoFocus
          style={{ width:"100%", background:C.card, borderRadius:14, padding:"14px 16px",
            fontSize:15.5, color:C.text, fontFamily:SANS, outline:"none", boxSizing:"border-box",
            marginBottom:26, boxShadow:SHADOW_SM, transition:"border-color 0.15s",
            border:`1.5px solid ${name.trim() ? C.borderHi : C.border}`,
          }} />
        <label style={LABEL}>your age</label>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:34}}>
          {[{id:"y",label:"18 – 25"},{id:"o",label:"26 or over"}].map(opt=>(
            <button key={opt.id} onClick={()=>setAge(opt.id)} style={{
              padding:"16px 12px", borderRadius:14, fontSize:15.5, fontWeight:600,
              cursor:"pointer", fontFamily:SANS, transition:"all 0.13s ease",
              border:`1.5px solid ${age===opt.id ? C.accent : C.border}`,
              background: age===opt.id ? C.accentSoft : C.card,
              color: age===opt.id ? C.accentDeep : C.textSoft,
              boxShadow: age===opt.id ? "none" : SHADOW_SM,
            }}>{opt.label}</button>
          ))}
        </div>
        <button onClick={()=>{setStep(0);setScreen("quiz");}} disabled={!name.trim()||!age}
          style={{...BTN_PRIMARY, opacity:name.trim()&&age?1:0.38,
            cursor:name.trim()&&age?"pointer":"not-allowed"}}>continue</button>
        <button onClick={()=>setScreen("home")} style={BTN_GHOST}>← back</button>
      </div>
    </div>
  );

  // ── QUIZ ────────────────────────────────────────────────────────
  if (screen === "quiz" && currentQ) return (
    <div style={{minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column",
      alignItems:"center", padding:"34px 18px", fontFamily:SANS}}>
      <link rel="stylesheet" href={GFONT} />
      <div style={{maxWidth:480, width:"100%"}}>
        {step > 0 && (
          <div style={{height:5, background:C.dim, borderRadius:5, marginBottom:38, overflow:"hidden"}}>
            <div style={{height:5, background:C.accent, borderRadius:5,
              width:`${pct}%`, transition:"width 0.4s ease"}}/>
          </div>
        )}
        <div style={{ opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(8px)",
          transition:"opacity 0.15s ease, transform 0.15s ease" }}>
          {currentQ.isSecondary && (
            <div style={{fontSize:13, color:C.muted, marginBottom:14}}>
              you picked <span style={{color:C.accentDeep,fontWeight:500}}>{RM[answers.q6]}</span> — does anything else come close?
            </div>
          )}
          <p style={{
            fontFamily: currentQ.isSecondary ? SANS : SERIF,
            fontSize: currentQ.isSecondary ? 18 : 24,
            fontWeight: 500, lineHeight:1.4, color:C.text, margin:"0 0 28px",
          }}>{currentQ.text}</p>

          {currentQ.type === "single" && currentQ.options.map(opt => (
            <Opt key={opt.id} label={opt.label}
              selected={answers[currentQ.id]===opt.id}
              onClick={()=>handleSingle(opt.id)} />
          ))}

          {currentQ.type === "multi" && (<>
            {currentQ.options.map(opt => (
              <Opt key={opt.id} label={opt.label}
                selected={multiSel.includes(opt.id)}
                faded={currentQ.cap && multiSel.length>=currentQ.cap && !multiSel.includes(opt.id)}
                onClick={()=>setMultiSel(prev=>
                  prev.includes(opt.id) ? prev.filter(x=>x!==opt.id)
                    : currentQ.cap&&prev.length>=currentQ.cap ? prev : [...prev,opt.id]
                )} />
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
              <span style={{color:C.muted,fontSize:13.5}}>
                {currentQ.cap ? `${multiSel.length} of ${currentQ.cap} selected` : `${multiSel.length} selected`}
              </span>
              <button onClick={handleMultiNext} disabled={multiSel.length===0} style={{
                background: multiSel.length>0 ? C.accent : C.dim,
                color: multiSel.length>0 ? "#fff" : C.muted,
                border:"none", borderRadius:12, padding:"11px 24px",
                fontSize:14.5, fontWeight:600, fontFamily:SANS,
                cursor: multiSel.length>0 ? "pointer" : "not-allowed",
                transition:"all 0.13s ease",
              }}>next →</button>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );

  // ── RESULT ──────────────────────────────────────────────────────
  if (screen === "result" && myProfile) return (
    <div style={PAGE}>
      <link rel="stylesheet" href={GFONT} />
      <div style={{maxWidth:420, width:"100%"}}>
        <div style={{textAlign:"center", marginBottom:30}}>
          <div style={{fontSize:36, marginBottom:14}}>{saving ? "⏳" : saveErr ? "⚠️" : "✨"}</div>
          <div style={{fontSize:11,letterSpacing:3,color:C.muted,textTransform:"uppercase",marginBottom:10}}>here's you</div>
          <h2 style={{fontFamily:SERIF,fontSize:34,fontWeight:500,color:C.text,margin:0}}>{myProfile.name}</h2>
          {saving && <p style={{color:C.muted,fontSize:13,marginTop:8}}>saving your answers...</p>}
          {saveErr && <p style={{color:"#c0392b",fontSize:13,marginTop:8}}>{saveErr}</p>}
        </div>
        <ProfileCard p={myProfile} />
        <p style={{color:C.muted,fontSize:13.5,textAlign:"center",lineHeight:1.6,margin:"20px 0 22px"}}>
          thanks for filling this in — it really helps.
        </p>
        <button onClick={restart} style={BTN_GHOST}>done</button>
      </div>
    </div>
  );

  // ── ADMIN ───────────────────────────────────────────────────────
  if (screen === "admin") {
    const byType = profiles.reduce((a,p)=>{a[p.type]=(a[p.type]||0)+1;return a;},{});
    const byReg  = profiles.reduce((a,p)=>{a[p.register]=(a[p.register]||0)+1;return a;},{});
    const topR   = Object.entries(byReg).sort((a,b)=>b[1]-a[1])[0]?.[0];
    return (
      <div style={{minHeight:"100vh",background:C.bg,padding:"38px 18px 80px",fontFamily:SANS}}>
        <link rel="stylesheet" href={GFONT} />
        <div style={{maxWidth:480,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
            <h2 style={{fontFamily:SERIF,fontSize:26,fontWeight:500,color:C.text,margin:0}}>responses</h2>
            <span style={{color:C.muted,fontSize:14}}>{loading?"loading...":profiles.length+" people"}</span>
          </div>

          {!loading && profiles.length > 1 && (
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,
              padding:"18px 20px",marginBottom:24,boxShadow:SHADOW}}>
              <div style={{fontSize:10.5,letterSpacing:2.5,color:C.muted,textTransform:"uppercase",marginBottom:14}}>snapshot</div>
              {Object.entries(byType).map(([t,n])=>(
                <div key={t} style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:14.5}}>
                  <span style={{color:C.muted}}>{t}</span>
                  <span style={{color:C.accentDeep,fontWeight:500}}>{n}</span>
                </div>
              ))}
              {topR && (
                <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.border}`,fontSize:13.5,color:C.muted}}>
                  most common experience: <span style={{color:C.text,fontWeight:500}}>{topR}</span>
                </div>
              )}
            </div>
          )}

          {loading
            ? <p style={{color:C.muted,textAlign:"center",marginTop:60}}>loading from supabase...</p>
            : profiles.length === 0
              ? <p style={{color:C.muted,textAlign:"center",marginTop:60}}>no responses yet.</p>
              : profiles.map((p,i) => <ProfileCard key={i} p={{
                  name: p.name, ageGroup: p.age_group,
                  type: p.type, register: p.register,
                  registerSecondary: p.register_secondary,
                  effort: p.effort, spontaneity: p.spontaneity,
                  social: p.social, decisionStyle: p.decision_style,
                }} compact showDecision />)
          }

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:20}}>
            <button onClick={restart} style={BTN_PRIMARY}>add response</button>
            <button onClick={()=>setScreen("home")} style={BTN_GHOST}>← home</button>
          </div>
          <button onClick={openAdmin} style={{
            display:"block",margin:"14px auto 0",background:"none",border:"none",
            color:C.muted,fontSize:12,cursor:"pointer",fontFamily:SANS,textDecoration:"underline",
          }}>↻ refresh</button>
        </div>
      </div>
    );
  }

  return null;
}

// ── SHARED STYLES ─────────────────────────────────────────────────
const PAGE = {
  minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column",
  alignItems:"center", justifyContent:"center", padding:"34px 18px", fontFamily:SANS,
};
const BTN_PRIMARY = {
  display:"block", width:"100%", padding:"14px 20px", marginBottom:10,
  background:C.accent, color:"#fff", border:"none", borderRadius:14,
  fontSize:15.5, fontWeight:600, cursor:"pointer", fontFamily:SANS,
  boxShadow:"0 2px 10px rgba(217,138,99,0.28)", transition:"opacity 0.14s",
};
const BTN_GHOST = {
  display:"block", width:"100%", padding:"13px 20px",
  background:"transparent", color:C.textSoft, border:`1px solid ${C.border}`,
  borderRadius:14, fontSize:14.5, cursor:"pointer", fontFamily:SANS,
};
const LABEL = {
  display:"block", fontSize:11.5, letterSpacing:1.5, color:C.muted,
  textTransform:"uppercase", marginBottom:9, fontWeight:500,
};
