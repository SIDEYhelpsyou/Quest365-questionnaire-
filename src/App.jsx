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
      text: y("🧭 Free Saturday, money to spend. What are you actually doing?",
               "🧭 Rare free Saturday, schedule actually clear. What sounds most like you?"),
      options: y([
        { id:"novelty",  label:"Hunting down somewhere I've never been — the unknown is the point" },
        { id:"balanced", label:"Finally going to that place I've been meaning to check out" },
        { id:"comfort",  label:"Somewhere I already know is good — a free day isn't the day to gamble" },
      ],[
        { id:"novelty",  label:"Somewhere completely new — a part of the city I haven't explored yet" },
        { id:"balanced", label:"That place I bookmarked months ago — feels like the right time" },
        { id:"comfort",  label:"Somewhere I know delivers — free time is too valuable to risk on the unknown" },
      ]),
    },
    q2a: {
      id:"q2a", type:"multi", cap:2,
      text: y("🔍 And what kind of new are we actually talking? Pick 2.","🔍 What does 'new' usually mean for you? Pick 2."),
      options:[
        { id:"place",        label: y("A place I've never been — somewhere off my usual circuit entirely","A place I'd never have found on my own — new area, hidden spot") },
        { id:"intellectual", label: y("Something that will genuinely make me think","Something I'll walk away from having genuinely thought about") },
        { id:"social",       label: y("Meeting people outside my usual circle — the social surprise is the draw","An experience where I might meet someone interesting outside my usual group") },
        { id:"physical",     label: y("Something active I haven't tried before — a new sport, class, or trail","Something physical I haven't done before — I want to feel it") },
        { id:"creative",     label: y("Something creative — making something, or being moved by something made","Something creative or artistic — making or witnessing something that lands") },
      ],
    },
    q2b: {
      id:"q2b", type:"multi", cap:null,
      text: y("⚖️ When you do try something new — what's usually going on? Pick all that feel true.",
               "⚖️ When you're in the mood to try something different — what's usually behind it?"),
      options:[
        { id:"energy",  label: y("I'm in a good headspace and I actually have the energy for it","It's been a good week and I want to mark it with something") },
        { id:"fatigue", label: y("I've been in the same routine too long and I can feel it","I've been in the same loop for too long and it's starting to show") },
        { id:"proof",   label: y("Someone I trust has been or recommended it specifically","Someone I respect went and told me to — that matters to me") },
        { id:"company", label: y("The right person is coming with me — certain people make me bolder","The right person is coming — I'm more adventurous with certain people") },
        { id:"story",   label: y("I want something worth talking about afterwards","I want an experience I'll actually bring up again, not just another evening out") },
      ],
    },
    q2c: {
      id:"q2c", type:"multi", cap:2,
      text: y("✅ When something feels like a guaranteed good time — what's usually behind that? Pick 2.",
               "✅ When something feels reliable and worth it — what's usually at the root of that? Pick 2."),
      options:[
        { id:"known-place",  label: y("I've been before and I know exactly what I'm getting","It's somewhere I've been before and it's earned its place") },
        { id:"known-format", label: y("It's a type of activity I genuinely enjoy — variety within it is fine","It's something I'm comfortable with — the format is familiar even if the place isn't") },
        { id:"company",      label: y("I'm going with the right people — the company matters more than the plan","The right company — who I'm with matters more than where I'm going") },
        { id:"expectation",  label: y("It's a type of activity I've done before — I know how it goes","It's a type of experience I've done before — I know what I'm walking into") },
        { id:"friction",     label: y("It's easy to get to — I'm not fighting the city to get there","It's low-friction to get there — the experience starts before I arrive") },
      ],
    },
    q3a: {
      id:"q3a", type:"rank",
      text: y("👥 Who do you want with you when trying something new? Tap in order of preference.",
               "👥 What's the right social setup when discovering something new? Tap in order of preference."),
      options:[
        { id:"solo",  label: y("Just me — I move faster and I don't have to compromise","Solo — fully at my own pace, no coordinating required") },
        { id:"pair",  label: y("One person, whoever I'm closest to right now","One person I genuinely want there with me") },
        { id:"small", label: y("My close group — three or four people I actually know","Small close group — enough energy, no logistics problem") },
        { id:"large", label: y("The full group — I like the collective energy","Bigger group — I like the collective discovery energy") },
        { id:"open",  label: y("Open to whoever — new people in that context is fine by me","Open to meeting people — if I'm stepping out anyway, why not") },
      ],
    },
    q3b: {
      id:"q3b", type:"rank",
      text: y("👥 Who do you usually end up going out with? Tap in order of preference.",
               "👥 What's your usual social setup? Tap in order of preference."),
      options:[
        { id:"solo",     label: y("On my own, honestly — more than people might expect","Solo — I've learned I genuinely prefer my own company for a lot of this") },
        { id:"pair",     label: y("One person — two is genuinely the right dynamic for me","Partner or one close friend — that's the unit I default to") },
        { id:"small",    label: y("Small close group — my actual friends, not the full group chat","Small group of people I'm actually close to") },
        { id:"large",    label: y("The whole group when possible — I like that energy","Bigger group — smaller plans can feel underwhelming to me") },
        { id:"flexible", label:"Genuinely varies — the activity usually decides it" },
      ],
    },
    q3c: {
      id:"q3c", type:"single",
      text: y("💪 When you're doing something you enjoy — how much do you want to exert?","💪 When you're out doing something you enjoy — how much do you actually want to put in?"),
      options:[
        { id:"high",     label: y("A lot — I feel better when I've actually done something","High — passive experiences rarely feel like enough") },
        { id:"medium",   label:"Engaged but not wiped out — somewhere in the middle" },
        { id:"low",      label: y("Low — show up, enjoy it, no effort required","Low — I want to arrive and have it be good without working for it") },
        { id:"variable", label: y("Completely depends on how my week's gone","Varies too much to call — a long week changes everything") },
      ],
    },
    q4_effort: {
      id:"q4_effort", type:"single",
      text: y("💪 How much do you actually want to be doing when you're out?","💪 How much do you want to put into the experience itself?"),
      options:[
        { id:"high",     label: y("A lot — I want to come home feeling like I actually did something","High — I'd rather push myself and feel it afterwards") },
        { id:"medium",   label:"Active and present, but not at my limit" },
        { id:"low",      label: y("Low — I want to arrive and enjoy without working for it","Low — arrive, settle in, let it come to me") },
        { id:"variable", label: y("Honestly depends on how my week's been","Varies week to week — a rough few days changes everything") },
      ],
    },
    q4_spont: {
      id:"q4_spont", type:"single",
      text: y("🗓️ How do plans usually happen for you?","🗓️ How do you prefer to plan?"),
      options:[
        { id:"spontaneous", label: y("Last minute — something comes up and I just go","Last minute — if I'm free and in the mood, I go") },
        { id:"loose",       label: y("A couple of days ahead — rough idea, that's enough","Loose structure — a few days ahead, nothing rigid") },
        { id:"planned",     label: y("I like it in the calendar — having something to look forward to is part of it","Planned — free time is precious, I'm not winging it") },
      ],
    },
    q5_effort: {
      id:"q5_effort", type:"single",
      text: y("💪 On a typical outing — how much energy do you want to spend?","💪 How much do you want to put into the experience itself?"),
      options:[
        { id:"high",     label: y("A lot — I feel it more when I've actually done something","High — I'd rather push myself and feel it afterwards") },
        { id:"medium",   label:"Engaged but sustainable — active without being drained" },
        { id:"low",      label: y("Low — show up, enjoy it, the effort of getting there is enough","Low — arrive, settle in, let it come to me") },
        { id:"variable", label: y("Depends on the week — I genuinely can't call it in advance","Varies week to week — a rough few days changes everything") },
      ],
    },
    q5_spont: {
      id:"q5_spont", type:"single",
      text: y("🗓️ Do you plan it or just go?","🗓️ How do you prefer to plan?"),
      options:[
        { id:"spontaneous", label: y("I basically just go — if I'm in the mood, I'm there","Last minute — if I'm free and in the mood, I go") },
        { id:"loose",       label: y("A day or two ahead — loose plan, nothing locked in","Loose structure — a few days ahead, nothing rigid") },
        { id:"planned",     label: y("I like it in the calendar — having something to look forward to is part of it","Planned — free time is precious, I'm not winging it") },
      ],
    },
    q4_social: {
      id:"q4_social", type:"rank",
      text: y("👥 Who do you go out and do things with? Tap in order of preference.",
               "👥 What's your social setup preference? Tap in order."),
      options:[
        { id:"solo",   label: y("Just me — I like the freedom of going alone","Solo — fully at my own pace, no coordinating") },
        { id:"pair",   label: y("One person — my partner or whoever I'm closest to","Partner or one close friend — that's what I default to") },
        { id:"small",  label: y("Small close group — three to five people I actually know","Small group of people I'm genuinely close to — three to five max") },
        { id:"large",  label: y("The full group — I like the energy when everyone's there","Bigger group — smaller plans can feel underwhelming to me") },
        { id:"family", label: y("Family, cousins included — honestly some of my best outings","Family — cousins count too, honestly some of my best ones") },
      ],
    },
    q5_spont_comfort: {
      id:"q5_spont_comfort", type:"single",
      text: y("🗓️ Do you plan ahead or go when the mood hits?","🗓️ How do you prefer to plan?"),
      options:[
        { id:"spontaneous", label: y("Whenever the mood hits — advance planning for this feels wrong","Last minute — if I'm free and in the mood, I go") },
        { id:"loose",       label: y("A few days ahead is enough — I don't need it all sorted","Loose structure — a few days ahead, nothing rigid") },
        { id:"planned",     label: y("I'd rather have it planned — free time is too rare to gamble","Planned — free time is precious, I'm not winging it") },
      ],
    },
    q6: {
      id:"q6", type:"single",
      text: y("✨ When a plan has genuinely hit right — what was at the centre of it?",
               "✨ When something has genuinely been worth it — what was at the centre of it?"),
      options:[
        { id:"creative",     label: y("I made something or was genuinely moved by something — that was the whole point","Something creative — I made it, experienced it, or was moved by it") },
        { id:"intellectual", label: y("I walked away thinking differently about something","I came away having thought about something properly") },
        { id:"physical",     label: y("My body actually did something — I felt it physically","I was physically present — moved, exerted, used my body") },
        { id:"social",       label: y("Something real happened between me and the people I was with","The people — something genuine happened between us") },
        { id:"restorative",  label: y("I actually switched off — came home lighter than I arrived","I actually decompressed — came home more like myself") },
      ],
    },
    q7: {
      id:"q7", type:"single",
      text: y("🤔 Last one — when you're figuring out what to do with free time, which are you?",
               "🤔 Last one — when you're deciding what to do with free time, which sounds like you?"),
      options:[
        { id:"surprise", label: y("Just surprise me — I'd rather not have to decide","I'd rather someone just make the call — surprise me") },
        { id:"browse",   label: y("I'd rather see the options and pick myself","I'd rather see everything and choose myself") },
        { id:"hybrid",   label: y("A bit of both — some suggestions, some browsing","A mix — a starting point, then I'll explore") },
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
  else                                flow.push(Q.q2c, Q.q4_social, Q.q3c, Q.q5_spont_comfort);
  flow.push(Q.q6);
  if (answers.q6) {
    flow.push({
      id:"q6b", type:"single", isSecondary:true, text:"Close second?",
      options: buildQ(age || "y").q6.options
        .filter(o => o.id !== answers.q6)
        .concat([{ id:"none", label:"Nope, just that one" }]),
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
    social:            (() => { const r = answers.q3a || answers.q3b || answers.q4_social; if (!r) return "-"; if (Array.isArray(r)) return r.map(id => SCM[id]).filter(Boolean).join(" > "); return SCM[r] || "-"; })(),
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

function Rank({ options, value, onChange }) {
  const toggle = (id) => {
    if (value.includes(id)) onChange(value.filter(x => x !== id));
    else onChange([...value, id]);
  };
  return (
    <>
      {options.map(opt => {
        const rank = value.indexOf(opt.id);
        const selected = rank !== -1;
        return (
          <button key={opt.id} onClick={() => toggle(opt.id)} style={{
            display:"flex", alignItems:"center", gap:12,
            width:"100%", textAlign:"left",
            padding:"14px 16px", marginBottom:10, borderRadius:14,
            border:`1.5px solid ${selected ? C.accent : C.border}`,
            background: selected ? C.accentSoft : C.card,
            color: selected ? C.accentDeep : C.text,
            fontSize:15, lineHeight:1.5, fontFamily:SANS,
            cursor:"pointer", boxShadow: selected ? "none" : SHADOW_SM,
            transition:"all 0.13s ease",
          }}>
            <span style={{
              minWidth:24, height:24, borderRadius:12, flexShrink:0,
              background: selected ? C.accent : C.dim,
              color: selected ? "#fff" : C.muted,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:700, transition:"all 0.13s ease",
            }}>{selected ? rank + 1 : ""}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </>
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
  const [singleSel, setSingleSel] = useState(null);
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
      fade(() => { setStep(s => s + 1); setMultiSel([]); setSingleSel(null); });
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
    setSingleSel(id);
  }

  function handleSingleNext() {
    const a = { ...answers, [currentQ.id]: singleSel };
    setAnswers(a); advance(a);
  }

  function handleMultiNext() {
    const a = { ...answers, [currentQ.id]: multiSel };
    setAnswers(a); advance(a);
  }

  function restart() {
    setScreen("home"); setName(""); setAge(null);
    setAnswers({}); setStep(0); setMultiSel([]); setSingleSel(null);
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
          A few questions.
        </h1>
        <p style={{color:C.textSoft, fontSize:15.5, lineHeight:1.65, margin:"0 0 40px"}}>
          This is where we start. Not where we stop.<br/>
          <span style={{fontSize:14, color:C.muted}}>About 2 minutes — go with your gut.</span>
        </p>
        <button onClick={() => setScreen("setup")} style={BTN_PRIMARY}>Let's go</button>
      </div>
    </div>
  );

  // ── SETUP ───────────────────────────────────────────────────────
  if (screen === "setup") return (
    <div style={PAGE}>
      <link rel="stylesheet" href={GFONT} />
      <div style={{maxWidth:400, width:"100%"}}>
        <div style={{fontFamily:SERIF, fontSize:27, fontWeight:500, color:C.text, marginBottom:6}}>First, the basics</div>
        <p style={{color:C.textSoft, fontSize:14.5, marginBottom:30}}>Just two quick things.</p>
        <label style={LABEL}>Your name</label>
        <input value={name} onChange={e=>setName(e.target.value)}
          onKeyDown={e=>{ if(e.key==="Enter"&&name.trim()&&age){setStep(0);setScreen("quiz");}}}
          placeholder="First name is fine" autoFocus
          style={{ width:"100%", background:C.card, borderRadius:14, padding:"14px 16px",
            fontSize:15.5, color:C.text, fontFamily:SANS, outline:"none", boxSizing:"border-box",
            marginBottom:26, boxShadow:SHADOW_SM, transition:"border-color 0.15s",
            border:`1.5px solid ${name.trim() ? C.borderHi : C.border}`,
          }} />
        <label style={LABEL}>Your age</label>
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

          {currentQ.type === "single" && (<>
            {currentQ.options.map(opt => (
              <Opt key={opt.id} label={opt.label}
                selected={singleSel===opt.id}
                onClick={()=>handleSingle(opt.id)} />
            ))}
            <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",marginTop:8}}>
              <button onClick={handleSingleNext} disabled={singleSel===null} style={{
                background: singleSel!==null ? C.accent : C.dim,
                color: singleSel!==null ? "#fff" : C.muted,
                border:"none", borderRadius:12, padding:"11px 24px",
                fontSize:14.5, fontWeight:600, fontFamily:SANS,
                cursor: singleSel!==null ? "pointer" : "not-allowed",
                transition:"all 0.13s ease",
              }}>next →</button>
            </div>
          </>)}

          {currentQ.type === "rank" && (<>
            <p style={{fontSize:12.5, color:C.muted, marginBottom:16, lineHeight:1.5}}>
              Tap your first preference, then second, and so on. Tap again to remove.
            </p>
            <Rank options={currentQ.options} value={multiSel} onChange={setMultiSel} />
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
              <span style={{color:C.muted,fontSize:13.5}}>
                {multiSel.length === 0 ? "tap to rank" : multiSel.length === 1 ? "tap more to rank further" : `${multiSel.length} ranked`}
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
        <p style={{color:C.muted,fontSize:13.5,textAlign:"center",lineHeight:1.6,margin:"20px 0 8px"}}>
          thanks for filling this in — it really helps.
        </p>
        <p style={{color:C.muted,fontSize:12.5,textAlign:"center",lineHeight:1.6,margin:"0 0 22px",fontStyle:"italic"}}>
          This is a starting point, not a verdict — it changes as you do.
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
