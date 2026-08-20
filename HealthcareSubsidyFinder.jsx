import { useState, useMemo, useEffect } from "react";

/* ── THEME TOKENS ─────────────────────────────────────────────────────────── */
const LIGHT = {
  bg:         "#FAF8FF",
  surface:    "#FFFFFF",
  surfaceAlt: "#F3EFFF",
  primary:    "#5B21B6",
  accent:     "#F97316",
  border:     "#E4DCFF",
  text:       "#1E1033",
  muted:      "#6B7280",
  heroFrom:   "#3B0764",
  heroMid:    "#6D28D9",
  heroTo:     "#9333EA",
  navBg:      "rgba(250,248,255,0.96)",
  shadow:     "0 2px 10px rgba(91,33,182,0.08)",
  shadowHov:  "0 8px 28px rgba(91,33,182,0.18)",
  badge:      "#EDE9FE",
  badgeText:  "#5B21B6",
  aiBg:       "#FFF7ED",
  aiBorder:   "#FED7AA",
  aiHeading:  "#92400E",
  aiSub:      "#78350F",
};

const DARK = {
  bg:         "#080814",
  surface:    "#12122A",
  surfaceAlt: "#1A1A38",
  primary:    "#9333EA",
  accent:     "#FB923C",
  border:     "#242448",
  text:       "#EDE9FF",
  muted:      "#7B7B9D",
  heroFrom:   "#0A0118",
  heroMid:    "#1E0A4A",
  heroTo:     "#4C1D95",
  navBg:      "rgba(8,8,20,0.97)",
  shadow:     "0 2px 10px rgba(0,0,0,0.5)",
  shadowHov:  "0 8px 28px rgba(147,51,234,0.28)",
  badge:      "#2E1065",
  badgeText:  "#C4B5FD",
  aiBg:       "#1A0E04",
  aiBorder:   "#7C3009",
  aiHeading:  "#FDBA74",
  aiSub:      "#FCA5A5",
};

/* ── ILLNESS COLOUR SYSTEM ────────────────────────────────────────────────── */
const ILLNESS = {
  "Sickle Cell Disease": {
    L: { pill:"#FEE2E2", text:"#991B1B", accent:"#EF4444" },
    D: { pill:"#3D1010", text:"#FCA5A5", accent:"#F87171" },
  },
  "Cancer": {
    L: { pill:"#EDE9FE", text:"#5B21B6", accent:"#8B5CF6" },
    D: { pill:"#2E1065", text:"#C4B5FD", accent:"#A78BFA" },
  },
  "HIV/AIDS": {
    L: { pill:"#FCE7F3", text:"#9D174D", accent:"#EC4899" },
    D: { pill:"#50072A", text:"#F9A8D4", accent:"#F472B6" },
  },
  "Diabetes": {
    L: { pill:"#DBEAFE", text:"#1E3A8A", accent:"#3B82F6" },
    D: { pill:"#172554", text:"#93C5FD", accent:"#60A5FA" },
  },
  "Kidney Disease": {
    L: { pill:"#FEF3C7", text:"#78350F", accent:"#F59E0B" },
    D: { pill:"#451A03", text:"#FDE68A", accent:"#FBBF24" },
  },
  "Mental Health": {
    L: { pill:"#D1FAE5", text:"#064E3B", accent:"#10B981" },
    D: { pill:"#052E1C", text:"#6EE7B7", accent:"#34D399" },
  },
};

const ILLNESS_ICONS = {
  "Sickle Cell Disease": "🩸",
  "Cancer":              "🎗️",
  "HIV/AIDS":            "❤️‍🩹",
  "Diabetes":            "💉",
  "Kidney Disease":      "🫘",
  "Mental Health":       "🧠",
};

const ALL_ILLNESSES = Object.keys(ILLNESS);

const STATES = [
  "All States","Nationwide","Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa",
  "Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT (Abuja)",
  "Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

/* ── ORGANIZATIONS ────────────────────────────────────────────────────────── */
const ORGANIZATIONS = [
  {
    id:1, name:"Sickle Cell Foundation Nigeria", shortName:"SCFN",
    illnesses:["Sickle Cell Disease"], states:["Lagos","Nationwide"],
    tagline:"Home to Nigeria's first National Sickle Cell Centre",
    description:"The Sickle Cell Foundation Nigeria provides comprehensive care, genetic counselling, and support to individuals and families affected by sickle cell disease. It operates the first dedicated National Sickle Cell Centre in Africa.",
    services:["Free genetic counselling","Hydroxyurea access support","Patient education & awareness","Newborn screening programs","Psychosocial support groups"],
    contact:{ phone:"+234 1 774 0293", email:"info@sicklecellfoundation.com", website:"https://sicklecellfoundation.com", address:"4A Ilabere Avenue, Ilupeju, Lagos" },
    type:"NGO / Foundation", verified:true, tags:["Free counselling","Testing","Patient support"],
  },
  {
    id:2, name:"Sickle Cell Hope Alive Foundation", shortName:"SCHAF",
    illnesses:["Sickle Cell Disease"], states:["Lagos","Rivers","Nationwide"],
    tagline:"Empowering sickle cell warriors with resources and community",
    description:"Sickle Cell Hope Alive Foundation supports individuals and families living with sickle cell disease through financial aid, community building, treatment awareness, and advocacy for improved care access across Nigeria.",
    services:["Financial aid for treatment costs","Patient support groups","Hydroxyurea awareness campaigns","Community advocacy","Educational scholarships for patients"],
    contact:{ phone:"+234 808 521 7800", email:"info@sicklecellfoundation.ng", website:"https://sicklecellfoundation.ng", address:"Lagos, Nigeria" },
    type:"NGO / Foundation", verified:true, tags:["Financial aid","Scholarships","Advocacy"],
  },
  {
    id:3, name:"Project PINK BLUE", shortName:"PPB",
    illnesses:["Cancer"], states:["FCT (Abuja)","Lagos","Nationwide"],
    tagline:"Fighting breast and cervical cancer through free screening",
    description:"Project PINK BLUE is a leading cancer advocacy NGO in Nigeria focused on breast and cervical cancer. They provide free screenings, patient navigation support, and run some of the country's most impactful public awareness campaigns.",
    services:["Free breast cancer screening","Free cervical cancer screening","Patient navigation & support","Awareness campaigns","Treatment fund assistance"],
    contact:{ phone:"+234 818 888 4805", email:"info@projectpinkblue.org", website:"https://projectpinkblue.org", address:"Abuja, FCT" },
    type:"NGO", verified:true, tags:["Free screening","Cancer support","Navigation"],
  },
  {
    id:4, name:"Nigerian Cancer Society", shortName:"NCS",
    illnesses:["Cancer"], states:["Lagos","Nationwide"],
    tagline:"Cancer education, early detection, and patient support",
    description:"The Nigerian Cancer Society promotes early cancer detection, connects patients to treatment support, and runs nationwide education and advocacy programs to improve cancer care outcomes in Nigeria.",
    services:["Cancer awareness & education","Free screening events","Patient support & navigation","Policy advocacy","Caregiver support programs"],
    contact:{ phone:"+234 803 571 1971", email:"info@nigeriancancersociety.org", website:"https://nigeriancancersociety.org", address:"Lagos, Nigeria" },
    type:"Patient Association", verified:true, tags:["Free screening","Advocacy","Caregiver support"],
  },
  {
    id:5, name:"Society for Family Health", shortName:"SFH",
    illnesses:["HIV/AIDS"], states:["FCT (Abuja)","Lagos","Nationwide"],
    tagline:"HIV prevention, testing, and treatment support across Nigeria",
    description:"Society for Family Health is one of Nigeria's largest public health NGOs, providing HIV/AIDS prevention, free testing, counselling, and treatment adherence support across all 36 states and the FCT.",
    services:["Free HIV testing & counselling","Condom distribution","ART adherence support","Prevention programs","Community health outreach"],
    contact:{ phone:"+234 9 461 4751", email:"sfhnig@sfhnigeria.org", website:"https://sfhnigeria.org", address:"8 Port Harcourt Crescent, Area 11, Garki, Abuja" },
    type:"NGO", verified:true, tags:["Free testing","HIV treatment","Nationwide"],
  },
  {
    id:6, name:"National Agency for Control of AIDS", shortName:"NACA",
    illnesses:["HIV/AIDS"], states:["FCT (Abuja)","Nationwide"],
    tagline:"Nigeria's national HIV/AIDS response and free ART coordinator",
    description:"NACA is the federal body coordinating Nigeria's response to HIV/AIDS. Through government health facilities nationwide, NACA oversees free antiretroviral therapy distribution, testing, and PMTCT programs across all states.",
    services:["Free antiretroviral therapy (ART)","HIV counselling & testing","Prevention of mother-to-child transmission","State-level program coordination","Referral network nationwide"],
    contact:{ phone:"+234 9 461 4751", email:"info@naca.gov.ng", website:"https://naca.gov.ng", address:"21 Blantyre Street, Wuse II, Abuja" },
    type:"Government Agency", verified:true, tags:["Free ART","Government","Nationwide"],
  },
  {
    id:7, name:"Lagos State AIDS Control Agency", shortName:"LSACA",
    illnesses:["HIV/AIDS"], states:["Lagos"],
    tagline:"HIV/AIDS prevention and free treatment for Lagos residents",
    description:"LSACA coordinates all HIV/AIDS prevention, treatment, and care programs within Lagos State. They manage free ART distribution and operate testing centres at multiple locations across Lagos.",
    services:["Free antiretrovirals (ART)","HIV testing & counselling","Prevention programs","Palliative care support","Community health outreach"],
    contact:{ phone:"+234 1 460 5700", email:"lsaca@lagosstate.gov.ng", website:"https://lsaca.gov.ng", address:"Secretariat, Alausa, Ikeja, Lagos" },
    type:"Government Agency", verified:true, tags:["Free ART","Lagos residents","Government"],
  },
  {
    id:8, name:"Diabetes Association of Nigeria", shortName:"DAN",
    illnesses:["Diabetes"], states:["Lagos","FCT (Abuja)","Nationwide"],
    tagline:"Education, screening, and support for Nigerians with diabetes",
    description:"The Diabetes Association of Nigeria is dedicated to improving lives of Nigerians with diabetes through patient education, free screening events, insulin access advocacy, and strong support groups across the country.",
    services:["Free blood glucose screening","Patient education programs","Insulin access support","Diabetes support groups","Annual awareness campaigns"],
    contact:{ phone:"+234 803 300 0985", email:"info@diabetesnigeria.org", website:"https://diabetesnigeria.org", address:"Lagos, Nigeria" },
    type:"Patient Association", verified:true, tags:["Free screening","Insulin support","Support groups"],
  },
  {
    id:9, name:"Lagos State Free Dialysis Programme", shortName:"LSFDP",
    illnesses:["Kidney Disease"], states:["Lagos"],
    tagline:"Free kidney dialysis for qualifying Lagos State residents",
    description:"A Lagos State Government initiative providing free or heavily subsidized hemodialysis to qualifying residents. It targets patients who cannot afford the high recurring cost of regular dialysis sessions.",
    services:["Free hemodialysis sessions","Eligibility screening","Referral to partner dialysis centres","Patient nutritional counselling"],
    contact:{ phone:"+234 1 460 5700", email:"info@health.lagosstate.gov.ng", website:"https://health.lagosstate.gov.ng", address:"Lagos State Ministry of Health, Alausa, Ikeja, Lagos" },
    type:"Government Program", verified:true, tags:["Free dialysis","Lagos residents","Government subsidy"],
  },
  {
    id:10, name:"Kidney Foundation of Nigeria", shortName:"KFN",
    illnesses:["Kidney Disease"], states:["Lagos","FCT (Abuja)","Nationwide"],
    tagline:"Advocacy and support for Nigerians with kidney disease",
    description:"The Kidney Foundation of Nigeria promotes kidney health awareness, advocates for affordable dialysis access, and connects patients to subsidized care and financial assistance programs across Nigeria.",
    services:["Kidney disease awareness","Patient referral network","Dialysis access support","Living donor transplant advocacy","Financial assistance programs"],
    contact:{ phone:"+234 802 300 7697", email:"info@kidneyfoundationnigeria.org", website:"https://kidneyfoundationnigeria.org", address:"Lagos, Nigeria" },
    type:"NGO / Foundation", verified:true, tags:["Financial aid","Referrals","Transplant support"],
  },
  {
    id:11, name:"Mentally Aware Nigeria Initiative", shortName:"MANI",
    illnesses:["Mental Health"], states:["Lagos","Nationwide"],
    tagline:"Connecting Nigerians to mental health care and reducing stigma",
    description:"MANI works to reduce mental health stigma and improve access to care in Nigeria. They provide a mental health resource directory, community peer support, mental health first aid training, and patient referrals.",
    services:["Mental health resource directory","Patient referrals to therapists","Online support community","Mental health first aid training","Awareness campaigns"],
    contact:{ phone:"+234 818 880 6607", email:"hello@mani.ng", website:"https://mani.ng", address:"Lagos, Nigeria" },
    type:"NGO", verified:true, tags:["Referrals","Community support","Awareness"],
  },
  {
    id:12, name:"She Writes Woman", shortName:"SWW",
    illnesses:["Mental Health"], states:["Lagos","Nationwide"],
    tagline:"Nigeria's leading 24/7 mental health crisis helpline",
    description:"She Writes Woman operates a 24-hour crisis helpline for Nigerians experiencing mental health distress. Trained counsellors provide free, confidential support for depression, anxiety, trauma, and crisis situations.",
    services:["24/7 mental health crisis helpline","Confidential counselling","Survivor support groups","Peer-to-peer support","Online mental health resources"],
    contact:{ phone:"0800 800 2000", email:"support@shewrites.woman", website:"https://shewrites.woman", address:"Lagos, Nigeria" },
    type:"NGO / Crisis Support", verified:true, tags:["Crisis line","Free support","24/7"],
  },
  {
    id:13, name:"Federal Neuropsychiatric Hospital, Yaba", shortName:"FNH Yaba",
    illnesses:["Mental Health"], states:["Lagos"],
    tagline:"Nigeria's largest federal mental health institution",
    description:"The Federal Neuropsychiatric Hospital Yaba is Nigeria's oldest and largest federal mental health facility, offering inpatient, outpatient, and community psychiatry services. Subsidized treatment is available for qualifying patients.",
    services:["Inpatient psychiatric care","Outpatient counselling & therapy","Substance use disorder treatment","Subsidized medications","Emergency mental health care"],
    contact:{ phone:"+234 1 801 1600", email:"fnhy@fnhyaba.gov.ng", website:"https://fnhyaba.gov.ng", address:"8 Harvey Road, Yaba, Lagos" },
    type:"Government Hospital", verified:true, tags:["Subsidized care","Inpatient","Outpatient"],
  },
];

/* ── SMALL ATOMS ──────────────────────────────────────────────────────────── */
const Logo = () => (
  <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="#5B21B6"/>
    <rect x="15" y="7" width="6" height="22" rx="3" fill="white"/>
    <rect x="7" y="15" width="22" height="6" rx="3" fill="white"/>
  </svg>
);

const DotPattern = () => (
  <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.13,pointerEvents:"none" }}>
    <defs>
      <pattern id="hsf-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="white"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hsf-dots)"/>
  </svg>
);

/* Gentle wave SVG divider under hero */
const HeroWave = ({ fill }) => (
  <div style={{ lineHeight:0, marginTop:-2 }}>
    <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", display:"block" }}>
      <path d="M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z" fill={fill}/>
    </svg>
  </div>
);

const Spinner = () => (
  <span className="hsf-spin" style={{ display:"inline-block", width:15, height:15, border:"2.5px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%" }}/>
);

function IllnessPill({ illness, dark, small }) {
  const col = (dark ? ILLNESS[illness]?.D : ILLNESS[illness]?.L) || { pill:"#F3F4F6", text:"#374151" };
  return (
    <span style={{
      fontSize: small ? 11 : 12.5,
      padding: small ? "2px 8px" : "4px 12px",
      borderRadius: 999, background: col.pill, color: col.text,
      fontWeight:700, display:"inline-flex", alignItems:"center", gap:4,
    }}>
      <span style={{ fontSize: small ? 10 : 12 }}>{ILLNESS_ICONS[illness]}</span>
      {illness}
    </span>
  );
}

/* ── ORG CARD ─────────────────────────────────────────────────────────────── */
function OrgCard({ org, onClick, aiReason, T, dark, index }) {
  const [hov, setHov] = useState(false);
  const ill0 = org.illnesses[0];
  const col = dark ? ILLNESS[ill0]?.D : ILLNESS[ill0]?.L;
  const accent = col?.accent || T.primary;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="hsf-card"
      style={{
        background: T.surface, borderRadius:16,
        padding:"18px 20px", cursor:"pointer",
        border:`1px solid ${T.border}`,
        borderLeft:`4px solid ${accent}`,
        boxShadow: hov ? T.shadowHov : T.shadow,
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        animationDelay:`${Math.min(index*0.05, 0.4)}s`,
        position:"relative", overflow:"hidden",
      }}
    >
      {/* Glow on hover */}
      <div style={{
        position:"absolute", top:-20, right:-20, width:90, height:90,
        borderRadius:"50%", pointerEvents:"none", opacity: hov ? 1 : 0,
        background:`radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
        transition:"opacity 0.2s ease",
      }}/>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:8 }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:3 }}>
            <span style={{ fontWeight:800, fontSize:15, color:T.text }}>{org.name}</span>
            {org.verified && (
              <span style={{ fontSize:10.5, color:"#10B981", fontWeight:700, background: dark?"#052E1C":"#D1FAE5", padding:"2px 7px", borderRadius:4 }}>
                ✓ Verified
              </span>
            )}
          </div>
          <div style={{ fontSize:12.5, color:T.muted }}>{org.tagline}</div>
        </div>
        <span style={{ fontSize:10.5, background:T.badge, color:T.badgeText, padding:"4px 10px", borderRadius:6, whiteSpace:"nowrap", fontWeight:600, flexShrink:0 }}>
          {org.type}
        </span>
      </div>

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:aiReason?10:8 }}>
        {org.illnesses.map(ill => <IllnessPill key={ill} illness={ill} dark={dark} small/>)}
        <span style={{ fontSize:11, padding:"2px 9px", borderRadius:999, background:T.surfaceAlt, color:T.muted, fontWeight:500 }}>
          📍 {org.states.includes("Nationwide")?"Nationwide":org.states.slice(0,2).join(", ")}
          {!org.states.includes("Nationwide") && org.states.length>2 ? ` +${org.states.length-2}` : ""}
        </span>
      </div>

      {aiReason && (
        <div style={{ background:T.aiBg, borderRadius:8, padding:"8px 12px", fontSize:12, color:T.aiHeading, borderLeft:`3px solid ${T.accent}`, marginBottom:8 }}>
          <strong>Why this helps: </strong>{aiReason}
        </div>
      )}

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
        {org.tags.map(tag => (
          <span key={tag} style={{ fontSize:11, padding:"2px 8px", borderRadius:4, background:T.surfaceAlt, color:T.muted, border:`1px solid ${T.border}` }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ fontSize:12.5, color:T.accent, fontWeight:700, display:"flex", alignItems:"center", gap:4 }}>
        View details & contact
        <span className="hsf-arrow" style={{ display:"inline-block", transform: hov?"translateX(4px)":"translateX(0)" }}>→</span>
      </div>
    </div>
  );
}

/* ── MODAL ────────────────────────────────────────────────────────────────── */
function Modal({ children, onClose, T }) {
  return (
    <div
      onClick={e => e.target===e.currentTarget && onClose()}
      style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,0.6)",
        backdropFilter:"blur(5px)", zIndex:1000,
        display:"flex", alignItems:"flex-start", justifyContent:"center",
        padding:"20px 16px", overflowY:"auto",
      }}
    >
      <div className="hsf-modal" style={{
        background:T.surface, borderRadius:20, maxWidth:580, width:"100%",
        marginTop:20, boxShadow:"0 30px 90px rgba(0,0,0,0.4)",
        border:`1px solid ${T.border}`,
      }}>
        {children}
      </div>
    </div>
  );
}

/* ── ORG DETAIL ───────────────────────────────────────────────────────────── */
function OrgDetail({ org, onClose, T, dark }) {
  const col = dark ? ILLNESS[org.illnesses[0]]?.D : ILLNESS[org.illnesses[0]]?.L;
  return (
    <div>
      <div style={{ background:col?.pill||T.surfaceAlt, padding:"22px 24px", borderRadius:"20px 20px 0 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start", borderBottom:`1px solid ${T.border}` }}>
        <div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
            {org.illnesses.map(ill => <IllnessPill key={ill} illness={ill} dark={dark}/>)}
          </div>
          <h2 style={{ margin:"0 0 4px", fontSize:19, color: dark?col?.text||T.text:T.text, fontWeight:800 }}>{org.name}</h2>
          <div style={{ fontSize:12, color:T.muted }}>{org.type} · {org.verified?"✓ Verified listing":"Unverified"}</div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:T.muted, padding:4 }}>✕</button>
      </div>
      <div style={{ padding:"22px 24px", overflowY:"auto", maxHeight:"68vh" }}>
        <p style={{ fontSize:13.5, color:T.muted, lineHeight:1.7, margin:"0 0 20px" }}>{org.description}</p>

        <section style={{ marginBottom:20 }}>
          <h3 style={{ fontSize:11, fontWeight:800, color:T.primary, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 10px" }}>Services Offered</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {org.services.map(s => (
              <div key={s} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                <span style={{ color:T.accent, fontWeight:800, lineHeight:1.6 }}>•</span>
                <span style={{ fontSize:13.5, color:T.text }}>{s}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom:20 }}>
          <h3 style={{ fontSize:11, fontWeight:800, color:T.primary, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 10px" }}>Coverage Area</h3>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {org.states.map(s => (
              <span key={s} style={{ fontSize:12, padding:"4px 12px", borderRadius:8, background:T.surfaceAlt, color:T.text, fontWeight:500, border:`1px solid ${T.border}` }}>{s}</span>
            ))}
          </div>
        </section>

        <section style={{ background:T.surfaceAlt, borderRadius:14, padding:"18px 20px", border:`1px solid ${T.border}` }}>
          <h3 style={{ fontSize:11, fontWeight:800, color:T.primary, textTransform:"uppercase", letterSpacing:"0.07em", margin:"0 0 14px" }}>Contact Details</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
            {[
              org.contact.phone   && ["📞", org.contact.phone,                        `tel:${org.contact.phone}`],
              org.contact.email   && ["✉️", org.contact.email,                        `mailto:${org.contact.email}`],
              org.contact.website && ["🌐", org.contact.website.replace("https://",""), org.contact.website],
              org.contact.address && ["📍", org.contact.address,                        null],
            ].filter(Boolean).map(([icon,label,href],i) => (
              <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:15, lineHeight:1.5 }}>{icon}</span>
                {href
                  ? <a href={href} target={href.startsWith("http")?"_blank":undefined} rel="noreferrer" style={{ fontSize:13.5, color:T.primary, fontWeight:500, textDecoration:"none" }}>{label}</a>
                  : <span style={{ fontSize:13.5, color:T.text }}>{label}</span>
                }
              </div>
            ))}
          </div>
        </section>
        <p style={{ fontSize:11, color:T.muted, marginTop:16, marginBottom:0, textAlign:"center", lineHeight:1.5 }}>
          Verify contact details before visiting. Information may have changed.
        </p>
      </div>
    </div>
  );
}

/* ── SUBMIT FORM ──────────────────────────────────────────────────────────── */
function SubmitForm({ onClose, T }) {
  const [form, setForm] = useState({ name:"", illness:"", state:"", services:"", phone:"", email:"", website:"", notes:"" });
  const [submitted, setSubmitted] = useState(false);
  const s = k => e => setForm(f => ({...f,[k]:e.target.value}));
  const valid = form.name.trim() && form.illness && form.state;
  const INP = { width:"100%", background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:9, padding:"10px 13px", fontSize:13.5, outline:"none", boxSizing:"border-box", marginTop:4, fontFamily:"inherit", color:T.text };

  if (submitted) return (
    <div style={{ padding:"52px 32px", textAlign:"center" }}>
      <div style={{ fontSize:54, marginBottom:12 }} className="hsf-pulse">✅</div>
      <h2 style={{ color:T.text, margin:"0 0 10px", fontSize:20 }}>Submission Received!</h2>
      <p style={{ color:T.muted, fontSize:14, lineHeight:1.6, maxWidth:340, margin:"0 auto 24px" }}>
        Thank you. This organization will be reviewed and added to the directory if it meets our verification standards.
      </p>
      <button onClick={onClose} style={{ background:T.primary, color:"#fff", border:"none", borderRadius:10, padding:"12px 30px", fontSize:14, fontWeight:700, cursor:"pointer" }}>Done</button>
    </div>
  );

  return (
    <div>
      <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <h2 style={{ margin:0, fontSize:17, color:T.text, fontWeight:800 }}>Add an Organization</h2>
          <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>Submit for review and listing</div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:T.muted }}>✕</button>
      </div>
      <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14, maxHeight:"68vh", overflowY:"auto" }}>
        <p style={{ fontSize:13, color:T.muted, margin:0, lineHeight:1.5 }}>Know an organization not listed here? Submit it below — verified entries get added to the directory.</p>

        <div>
          <label style={{ fontSize:13, fontWeight:700, color:T.text, display:"block" }}>Organization Name *</label>
          <input style={INP} value={form.name} onChange={s("name")} placeholder="e.g. Lagos Cancer Foundation"/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:T.text, display:"block" }}>Illness Category *</label>
            <select style={{ ...INP, cursor:"pointer" }} value={form.illness} onChange={s("illness")}>
              <option value="">Select…</option>
              {ALL_ILLNESSES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:T.text, display:"block" }}>State *</label>
            <select style={{ ...INP, cursor:"pointer" }} value={form.state} onChange={s("state")}>
              <option value="">Select…</option>
              {STATES.filter(x => x!=="All States").map(x => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={{ fontSize:13, fontWeight:700, color:T.text, display:"block" }}>Services Offered</label>
          <textarea style={{ ...INP, resize:"vertical", minHeight:72 }} value={form.services} onChange={s("services")} placeholder="e.g. Free screening, Patient counselling, Grants…"/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:T.text, display:"block" }}>Phone</label>
            <input style={INP} value={form.phone} onChange={s("phone")} placeholder="+234…"/>
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:700, color:T.text, display:"block" }}>Email</label>
            <input style={INP} value={form.email} onChange={s("email")} placeholder="org@email.com"/>
          </div>
        </div>
        <div>
          <label style={{ fontSize:13, fontWeight:700, color:T.text, display:"block" }}>Website</label>
          <input style={INP} value={form.website} onChange={s("website")} placeholder="https://…"/>
        </div>
        <div>
          <label style={{ fontSize:13, fontWeight:700, color:T.text, display:"block" }}>Additional Notes</label>
          <textarea style={{ ...INP, resize:"vertical", minHeight:56 }} value={form.notes} onChange={s("notes")} placeholder="Anything else about this organization…"/>
        </div>
        <button
          onClick={() => valid && setSubmitted(true)}
          disabled={!valid}
          style={{ background:valid?T.primary:T.border, color:valid?"#fff":T.muted, border:"none", borderRadius:10, padding:"13px", fontSize:14, fontWeight:700, cursor:valid?"pointer":"not-allowed", marginTop:4 }}
        >
          Submit for Review
        </button>
      </div>
    </div>
  );
}

/* ── MAIN APP ─────────────────────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark]                   = useState(false);
  const [selectedIllnesses, setSelIll]    = useState([]);
  const [selectedState, setSelState]      = useState("All States");
  const [searchQuery, setSearch]          = useState("");
  const [selectedOrg, setSelOrg]          = useState(null);
  const [showSubmit, setShowSubmit]       = useState(false);
  const [aiQuery, setAiQuery]             = useState("");
  const [aiResults, setAiResults]         = useState(null);
  const [aiLoading, setAiLoading]         = useState(false);
  const [aiError, setAiError]             = useState("");

  const T = dark ? DARK : LIGHT;

  /* Inject Google Font + keyframe CSS once on mount */
  useEffect(() => {
    const link = document.createElement("link");
    link.rel   = "stylesheet";
    link.href  = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "hsf-anim";
    style.textContent = `
      @keyframes fadeSlideUp {
        from { opacity:0; transform:translateY(20px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes heroGrad {
        0%   { background-position:0% 60%; }
        50%  { background-position:100% 40%; }
        100% { background-position:0% 60%; }
      }
      @keyframes modalIn {
        from { opacity:0; transform:scale(0.95) translateY(12px); }
        to   { opacity:1; transform:scale(1)    translateY(0); }
      }
      @keyframes spinR { to { transform:rotate(360deg); } }
      @keyframes beatPulse {
        0%,100% { transform:scale(1); }
        50%     { transform:scale(1.1); }
      }
      @keyframes shimmer {
        from { background-position:-200px 0; }
        to   { background-position:calc(200px + 100%) 0; }
      }

      /* Dark mode smooth colour transitions */
      * { transition: background-color 0.25s ease, color 0.2s ease, border-color 0.25s ease; }

      .hsf-card {
        animation: fadeSlideUp 0.38s ease both;
        transition: box-shadow 0.18s ease, transform 0.18s ease,
                    background-color 0.25s ease, border-color 0.25s ease !important;
      }
      .hsf-arrow  { transition: transform 0.15s ease !important; }
      .hsf-modal  { animation: modalIn 0.22s ease both; }
      .hsf-spin   { animation: spinR 0.75s linear infinite; }
      .hsf-pulse  { animation: beatPulse 1.4s ease infinite; display:inline-block; }
      .hsf-hero   {
        background-size: 300% 300% !important;
        animation: heroGrad 14s ease infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      const s = document.getElementById("hsf-anim");
      if (s) document.head.removeChild(s);
    };
  }, []);

  const toggleIll = ill => setSelIll(p => p.includes(ill) ? p.filter(i=>i!==ill) : [...p,ill]);

  const filtered = useMemo(() => ORGANIZATIONS.filter(org => {
    const mIll   = selectedIllnesses.length===0 || org.illnesses.some(i=>selectedIllnesses.includes(i));
    const mState = selectedState==="All States" || org.states.includes(selectedState) || org.states.includes("Nationwide");
    const q      = searchQuery.toLowerCase();
    const mQ     = !q || org.name.toLowerCase().includes(q) || org.description.toLowerCase().includes(q)
                      || org.services.some(s=>s.toLowerCase().includes(q)) || org.tags.some(t=>t.toLowerCase().includes(q));
    return mIll && mState && mQ;
  }), [selectedIllnesses, selectedState, searchQuery]);

  const handleAI = async () => {
    if (!aiQuery.trim() || aiLoading) return;
    setAiLoading(true); setAiError(""); setAiResults(null);
    const orgsText = ORGANIZATIONS.map(o =>
      `ID ${o.id}: ${o.name} | Conditions: ${o.illnesses.join(",")} | Location: ${o.states.join("/")} | Services: ${o.services.join(", ")}`
    ).join("\n");
    const prompt = `You are a healthcare support assistant for Nigeria. Identify the 2–4 most relevant organizations for the user's situation.

Organizations:
${orgsText}

User: "${aiQuery}"

Respond ONLY with valid JSON: [{"id":1,"reason":"one sentence"}]. No markdown, no preamble.`;
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, messages:[{role:"user",content:prompt}] }),
      });
      const data = await res.json();
      const raw  = data.content.map(c=>c.type==="text"?c.text:"").join("").replace(/```json|```/g,"").trim();
      const recs = JSON.parse(raw);
      setAiResults(recs.map(r=>({...ORGANIZATIONS.find(o=>o.id===r.id),aiReason:r.reason})).filter(o=>o.id));
    } catch {
      setAiError("Could not get recommendations. Please try again.");
    }
    setAiLoading(false);
  };

  const hasFilters = selectedIllnesses.length>0 || selectedState!=="All States" || searchQuery;
  const clearAll   = () => { setSelIll([]); setSelState("All States"); setSearch(""); };

  /* Hero gradient string */
  const heroBg = `linear-gradient(135deg, ${T.heroFrom} 0%, ${T.heroMid} 50%, ${T.heroTo} 100%)`;

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif", background:T.bg, minHeight:"100vh", color:T.text }}>

      {/* ── NAV ── */}
      <header style={{ background:T.navBg, backdropFilter:"blur(14px)", borderBottom:`1px solid ${T.border}`, padding:"0 22px", display:"flex", alignItems:"center", justifyContent:"space-between", height:62, position:"sticky", top:0, zIndex:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Logo/>
          <div>
            <div style={{ fontWeight:800, fontSize:14.5, color:T.text, lineHeight:1.2 }}>HealthFinder Nigeria</div>
            <div style={{ fontSize:10.5, color:T.muted }}>Healthcare Subsidy Finder</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button
            onClick={() => setDark(d=>!d)}
            style={{ background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:9, padding:"7px 13px", fontSize:13, fontWeight:600, cursor:"pointer", color:T.text, display:"flex", alignItems:"center", gap:6 }}
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button
            onClick={() => setShowSubmit(true)}
            style={{ background:T.accent, color:"#fff", border:"none", borderRadius:9, padding:"8px 16px", fontSize:12.5, fontWeight:700, cursor:"pointer" }}
          >
            + Add Org
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <div className="hsf-hero" style={{ background:heroBg, padding:"52px 20px 68px", position:"relative", overflow:"hidden" }}>
        <DotPattern/>

        {/* Decorative blobs */}
        <div style={{ position:"absolute", top:-60, right:-80, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-40, left:-60, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:660, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>

          {/* Country badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:999, padding:"5px 16px", marginBottom:22, fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.9)", backdropFilter:"blur(8px)" }}>
            🇳🇬 Nigeria's Healthcare Subsidy Directory
          </div>

          <h1 style={{ color:"#fff", fontSize:"clamp(24px,5vw,40px)", fontWeight:800, margin:"0 0 12px", lineHeight:1.15, letterSpacing:"-0.02em" }}>
            Find Free Healthcare<br/>Support in Nigeria
          </h1>
          <p style={{ color:"rgba(255,255,255,0.72)", fontSize:14.5, margin:"0 0 30px", lineHeight:1.7 }}>
            Discover grants, free treatment, and subsidies for chronic illnesses<br/>across all 36 states and the FCT.
          </p>

          {/* Stats row */}
          <div style={{ display:"flex", gap:28, justifyContent:"center", marginBottom:32, flexWrap:"wrap" }}>
            {[["🏥","13","Organizations"],["📍","36","States Covered"],["💊","6","Illness Types"]].map(([icon,num,label]) => (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.5)", marginBottom:2 }}>{icon} {label}</div>
                <div style={{ fontSize:28, fontWeight:800, color:"#fff", lineHeight:1 }}>{num}</div>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ background:"rgba(255,255,255,0.97)", borderRadius:16, padding:"6px 6px 6px 16px", display:"flex", gap:8, alignItems:"center", boxShadow:"0 10px 40px rgba(0,0,0,0.3)", marginBottom:22 }}>
            <span style={{ fontSize:16, flexShrink:0 }}>🔍</span>
            <input
              type="text" placeholder="Search organizations or services…"
              value={searchQuery} onChange={e=>setSearch(e.target.value)}
              style={{ flex:1, border:"none", outline:"none", padding:"10px 6px", fontSize:13.5, background:"transparent", fontFamily:"inherit", color:"#1E1033" }}
            />
            <select
              value={selectedState} onChange={e=>setSelState(e.target.value)}
              style={{ border:"1px solid #E4DCFF", borderRadius:11, padding:"10px 12px", fontSize:12.5, color:"#1E1033", background:"#FAF8FF", cursor:"pointer", outline:"none", fontFamily:"inherit" }}
            >
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Illness chips */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
            {ALL_ILLNESSES.map(illness => {
              const active = selectedIllnesses.includes(illness);
              const C = ILLNESS[illness]?.L;
              return (
                <button
                  key={illness}
                  onClick={() => toggleIll(illness)}
                  style={{
                    padding:"7px 14px", borderRadius:999, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                    border:`2px solid ${active?C?.accent:"rgba(255,255,255,0.32)"}`,
                    background: active ? C?.pill : "rgba(255,255,255,0.11)",
                    color: active ? C?.text : "rgba(255,255,255,0.9)",
                    display:"flex", alignItems:"center", gap:5,
                  }}
                >
                  <span style={{ fontSize:11 }}>{ILLNESS_ICONS[illness]}</span>
                  {illness}
                </button>
              );
            })}
          </div>

          {selectedIllnesses.length>0 && (
            <button onClick={()=>setSelIll([])} style={{ marginTop:12, background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
              Clear illness filters ✕
            </button>
          )}
        </div>
      </div>

      {/* Wave divider */}
      <HeroWave fill={T.bg}/>

      {/* ── AI HELPER ── */}
      <div style={{ background:T.aiBg, borderBottom:`1.5px solid ${T.aiBorder}`, padding:"14px 22px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:180 }}>
              <div style={{ fontSize:13, fontWeight:800, color:T.aiHeading, marginBottom:2 }}>✨ AI Helper</div>
              <div style={{ fontSize:11.5, color:T.aiSub }}>Describe your situation and we'll match you to the right support.</div>
            </div>
            <div style={{ display:"flex", gap:8, flex:2, minWidth:260 }}>
              <input
                value={aiQuery} onChange={e=>setAiQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAI()}
                placeholder='e.g. "My child has sickle cell disease in Lagos…"'
                style={{ flex:1, border:`1px solid ${T.aiBorder}`, borderRadius:10, padding:"9px 13px", fontSize:13, outline:"none", background:T.surface, fontFamily:"inherit", color:T.text }}
              />
              <button
                onClick={handleAI} disabled={aiLoading||!aiQuery.trim()}
                style={{
                  background:aiQuery.trim()&&!aiLoading?T.accent:T.border,
                  color:aiQuery.trim()&&!aiLoading?"#fff":T.muted,
                  border:"none", borderRadius:10, padding:"9px 18px", fontSize:13, fontWeight:700,
                  cursor:aiQuery.trim()&&!aiLoading?"pointer":"not-allowed",
                  whiteSpace:"nowrap", fontFamily:"inherit", minWidth:105,
                  display:"flex", alignItems:"center", gap:7,
                }}
              >
                {aiLoading ? <><Spinner/> Matching…</> : "Find Help →"}
              </button>
            </div>
          </div>
          {aiError && <div style={{ fontSize:12, color:"#EF4444", marginTop:8 }}>⚠ {aiError}</div>}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ maxWidth:860, margin:"0 auto", padding:"30px 20px 60px" }}>

        {/* AI results */}
        {aiResults && aiResults.length>0 && (
          <div style={{ marginBottom:36 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ fontSize:16 }}>✨</span>
              <h2 style={{ margin:0, fontSize:15, fontWeight:800, color:T.text }}>AI-Recommended Support</h2>
              <button onClick={()=>{setAiResults(null);setAiQuery("");}} style={{ marginLeft:"auto", background:T.surfaceAlt, border:`1px solid ${T.border}`, borderRadius:6, padding:"3px 10px", color:T.muted, fontSize:11.5, cursor:"pointer" }}>Clear ✕</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {aiResults.map((org,i) => <OrgCard key={org.id} org={org} onClick={()=>setSelOrg(org)} aiReason={org.aiReason} T={T} dark={dark} index={i}/>)}
            </div>
            <div style={{ margin:"28px 0 0", borderTop:`1px solid ${T.border}`, paddingTop:28 }}/>
          </div>
        )}

        {/* Results header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:800, color:T.text }}>
            {filtered.length} Organization{filtered.length!==1?"s":""}
            {selectedIllnesses.length>0 && <span style={{ fontWeight:500, color:T.muted, fontSize:13 }}> — {selectedIllnesses.join(", ")}</span>}
            {selectedState!=="All States" && <span style={{ fontWeight:500, color:T.muted, fontSize:13 }}> — {selectedState}</span>}
          </h2>
          {hasFilters && (
            <button onClick={clearAll} style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:7, padding:"4px 12px", fontSize:12, color:T.muted, cursor:"pointer" }}>
              Clear all
            </button>
          )}
        </div>

        {filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"60px 24px", background:T.surface, borderRadius:18, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:50, marginBottom:12 }}>🔍</div>
            <div style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:8 }}>No organizations found</div>
            <div style={{ fontSize:13.5, color:T.muted }}>Try different filters, or use the AI Helper above to describe your situation.</div>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {filtered.map((org,i) => (
              <OrgCard key={org.id} org={org} onClick={()=>setSelOrg(org)} T={T} dark={dark} index={i}/>
            ))}
          </div>
        )}

        {/* Legend */}
        <div style={{ marginTop:36, background:T.surface, borderRadius:16, border:`1px solid ${T.border}`, padding:"16px 20px" }}>
          <div style={{ fontSize:11, fontWeight:800, color:T.primary, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:12 }}>Illness Colour Guide</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {ALL_ILLNESSES.map(ill => <IllnessPill key={ill} illness={ill} dark={dark}/>)}
          </div>
        </div>

        <div style={{ marginTop:14, padding:"12px 16px", background:T.surface, borderRadius:10, border:`1px solid ${T.border}`, fontSize:11.5, color:T.muted, lineHeight:1.6 }}>
          <strong style={{ color:T.text }}>⚠ Disclaimer: </strong>
          Always verify organization details independently before making contact. Information may change over time.
        </div>
      </div>

      {/* ── MODALS ── */}
      {selectedOrg && (
        <Modal onClose={()=>setSelOrg(null)} T={T}>
          <OrgDetail org={selectedOrg} onClose={()=>setSelOrg(null)} T={T} dark={dark}/>
        </Modal>
      )}
      {showSubmit && (
        <Modal onClose={()=>setShowSubmit(false)} T={T}>
          <SubmitForm onClose={()=>setShowSubmit(false)} T={T} dark={dark}/>
        </Modal>
      )}
    </div>
  );
}
