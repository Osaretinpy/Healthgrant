
const root = document.getElementById('app');
let state = {
  dark:false, selectedIllnesses:[], selectedState:'All States', searchQuery:'',
  selectedOrg:null, showSubmit:false, aiQuery:'', aiResults:null, aiLoading:false, aiError:''
};

const escapeHtml = (v='') => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const T = () => state.dark ? DARK : LIGHT;

function illnessPill(ill, small=false) {
  const col=(state.dark?ILLNESS[ill]?.D:ILLNESS[ill]?.L)||{pill:'#F3F4F6',text:'#374151'};
  return `<span style="font-size:${small?11:12.5}px;padding:${small?'2px 8px':'4px 12px'};border-radius:999px;background:${col.pill};color:${col.text};font-weight:700;display:inline-flex;align-items:center;gap:4px">
    <span style="font-size:${small?10:12}px">${ILLNESS_ICONS[ill]||''}</span>${escapeHtml(ill)}</span>`;
}
function logo(){ return `<svg width="34" height="34" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="10" fill="#5B21B6"/><rect x="15" y="7" width="6" height="22" rx="3" fill="white"/><rect x="7" y="15" width="22" height="6" rx="3" fill="white"/></svg>`; }
function dotPattern(){ return `<svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.13;pointer-events:none"><defs><pattern id="hsf-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#hsf-dots)"/></svg>`; }

function filteredOrgs(){
  const q=state.searchQuery.toLowerCase();
  return ORGANIZATIONS.filter(org=>{
    const mIll=state.selectedIllnesses.length===0 || org.illnesses.some(i=>state.selectedIllnesses.includes(i));
    const mState=state.selectedState==='All States' || org.states.includes(state.selectedState) || org.states.includes('Nationwide');
    const mQ=!q || org.name.toLowerCase().includes(q) || org.description.toLowerCase().includes(q) ||
      org.services.some(s=>s.toLowerCase().includes(q)) || org.tags.some(t=>t.toLowerCase().includes(q));
    return mIll&&mState&&mQ;
  });
}

function orgCard(org, index=0){
  const ill0=org.illnesses[0], col=state.dark?ILLNESS[ill0]?.D:ILLNESS[ill0]?.L, accent=col?.accent||T().primary;
  const aiReason=org.aiReason ? `<div style="background:${T().aiBg};border-radius:8px;padding:8px 12px;font-size:12px;color:${T().aiHeading};border-left:3px solid ${T().accent};margin-bottom:8px"><strong>Why this helps: </strong>${escapeHtml(org.aiReason)}</div>`:'';
  return `<div class="hsf-card" data-org="${org.id}" style="background:${T().surface};border-radius:16px;padding:18px 20px;cursor:pointer;border:1px solid ${T().border};border-left:4px solid ${accent};box-shadow:${T().shadow};animation-delay:${Math.min(index*.05,.4)}s;position:relative;overflow:hidden">
    <div style="position:absolute;top:-20px;right:-20px;width:90px;height:90px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,${accent}22 0%,transparent 70%);opacity:0"></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px">
      <div style="flex:1"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px">
        <span style="font-weight:800;font-size:15px;color:${T().text}">${escapeHtml(org.name)}</span>
        ${org.verified?`<span style="font-size:10.5px;color:#10B981;font-weight:700;background:${state.dark?'#052E1C':'#D1FAE5'};padding:2px 7px;border-radius:4px">✓ Verified</span>`:''}
      </div><div style="font-size:12.5px;color:${T().muted}">${escapeHtml(org.tagline)}</div></div>
      <span style="font-size:10.5px;background:${T().badge};color:${T().badgeText};padding:4px 10px;border-radius:6px;white-space:nowrap;font-weight:600;flex-shrink:0">${escapeHtml(org.type)}</span>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:${org.aiReason?'10px':'8px'}">
      ${org.illnesses.map(x=>illnessPill(x,true)).join('')}
      <span style="font-size:11px;padding:2px 9px;border-radius:999px;background:${T().surfaceAlt};color:${T().muted};font-weight:500">📍 ${org.states.includes('Nationwide')?'Nationwide':escapeHtml(org.states.slice(0,2).join(', '))}${!org.states.includes('Nationwide')&&org.states.length>2?` +${org.states.length-2}`:''}</span>
    </div>${aiReason}
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${org.tags.map(tag=>`<span style="font-size:11px;padding:2px 8px;border-radius:4px;background:${T().surfaceAlt};color:${T().muted};border:1px solid ${T().border}">${escapeHtml(tag)}</span>`).join('')}</div>
    <div style="font-size:12.5px;color:${T().accent};font-weight:700;display:flex;align-items:center;gap:4px">View details & contact <span class="hsf-arrow">→</span></div>
  </div>`;
}

function modal(content){
  return `<div id="modal" onclick="if(event.target===this)closeModal()" style="position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(5px);z-index:1000;display:flex;align-items:flex-start;justify-content:center;padding:20px 16px;overflow-y:auto">
    <div class="hsf-modal" style="background:${T().surface};border-radius:20px;max-width:580px;width:100%;margin-top:20px;box-shadow:0 30px 90px rgba(0,0,0,.4);border:1px solid ${T().border}">${content}</div>
  </div>`;
}
function orgDetail(org){
  const col=state.dark?ILLNESS[org.illnesses[0]]?.D:ILLNESS[org.illnesses[0]]?.L;
  const contacts=[
    org.contact.phone&&['📞',org.contact.phone,`tel:${org.contact.phone}`],
    org.contact.email&&['✉️',org.contact.email,`mailto:${org.contact.email}`],
    org.contact.website&&['🌐',org.contact.website.replace('https://',''),org.contact.website],
    org.contact.address&&['📍',org.contact.address,null]
  ].filter(Boolean);
  return modal(`<div>
    <div style="background:${col?.pill||T().surfaceAlt};padding:22px 24px;border-radius:20px 20px 0 0;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid ${T().border}">
      <div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${org.illnesses.map(x=>illnessPill(x)).join('')}</div>
      <h2 style="margin:0 0 4px;font-size:19px;color:${state.dark?col?.text||T().text:T().text};font-weight:800">${escapeHtml(org.name)}</h2>
      <div style="font-size:12px;color:${T().muted}">${escapeHtml(org.type)} · ${org.verified?'✓ Verified listing':'Unverified'}</div></div>
      <button onclick="closeModal()" style="background:none;border:none;font-size:22px;cursor:pointer;color:${T().muted};padding:4px">✕</button>
    </div>
    <div style="padding:22px 24px;overflow-y:auto;max-height:68vh">
      <p style="font-size:13.5px;color:${T().muted};line-height:1.7;margin:0 0 20px">${escapeHtml(org.description)}</p>
      <section style="margin-bottom:20px"><h3 style="font-size:11px;font-weight:800;color:${T().primary};text-transform:uppercase;letter-spacing:.07em;margin:0 0 10px">Services Offered</h3>
      <div style="display:flex;flex-direction:column;gap:7px">${org.services.map(s=>`<div style="display:flex;gap:8px;align-items:flex-start"><span style="color:${T().accent};font-weight:800;line-height:1.6">•</span><span style="font-size:13.5px;color:${T().text}">${escapeHtml(s)}</span></div>`).join('')}</div></section>
      <section style="margin-bottom:20px"><h3 style="font-size:11px;font-weight:800;color:${T().primary};text-transform:uppercase;letter-spacing:.07em;margin:0 0 10px">Coverage Area</h3>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${org.states.map(s=>`<span style="font-size:12px;padding:4px 12px;border-radius:8px;background:${T().surfaceAlt};color:${T().text};font-weight:500;border:1px solid ${T().border}">${escapeHtml(s)}</span>`).join('')}</div></section>
      <section style="background:${T().surfaceAlt};border-radius:14px;padding:18px 20px;border:1px solid ${T().border}"><h3 style="font-size:11px;font-weight:800;color:${T().primary};text-transform:uppercase;letter-spacing:.07em;margin:0 0 14px">Contact Details</h3>
      <div style="display:flex;flex-direction:column;gap:11px">${contacts.map(([icon,label,href])=>`<div style="display:flex;gap:10px;align-items:flex-start"><span style="font-size:15px;line-height:1.5">${icon}</span>${href?`<a href="${escapeHtml(href)}" ${href.startsWith('http')?'target="_blank" rel="noreferrer"':''} style="font-size:13.5px;color:${T().primary};font-weight:500;text-decoration:none">${escapeHtml(label)}</a>`:`<span style="font-size:13.5px;color:${T().text}">${escapeHtml(label)}</span>`}</div>`).join('')}</div></section>
      <p style="font-size:11px;color:${T().muted};margin:16px 0 0;text-align:center;line-height:1.5">Verify contact details before visiting. Information may have changed.</p>
    </div></div>`);
}

function submitForm(){
  return modal(`<div>
    <div style="padding:20px 24px;border-bottom:1px solid ${T().border};display:flex;justify-content:space-between;align-items:center"><div><h2 style="margin:0;font-size:17px;color:${T().text};font-weight:800">Add an Organization</h2><div style="font-size:12px;color:${T().muted};margin-top:2px">Submit for review and listing</div></div><button onclick="closeModal()" style="background:none;border:none;font-size:22px;cursor:pointer;color:${T().muted}">✕</button></div>
    <form id="orgForm" style="padding:20px 24px;display:flex;flex-direction:column;gap:14px;max-height:68vh;overflow-y:auto">
      <p style="font-size:13px;color:${T().muted};margin:0;line-height:1.5">Know an organization not listed here? Submit it below — verified entries get added to the directory.</p>
      <div><label style="font-size:13px;font-weight:700;color:${T().text};display:block">Organization Name *</label><input required name="name" style="${inputStyle()}" placeholder="e.g. Lagos Cancer Foundation"></div>
      <div class="form-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><label style="font-size:13px;font-weight:700;color:${T().text};display:block">Illness Category *</label><select required name="illness" style="${inputStyle()}"><option value="">Select…</option>${ALL_ILLNESSES.map(i=>`<option>${escapeHtml(i)}</option>`).join('')}</select></div>
      <div><label style="font-size:13px;font-weight:700;color:${T().text};display:block">State *</label><select required name="state" style="${inputStyle()}"><option value="">Select…</option>${STATES.filter(x=>x!=='All States').map(x=>`<option>${escapeHtml(x)}</option>`).join('')}</select></div></div>
      <div><label style="font-size:13px;font-weight:700;color:${T().text};display:block">Services Offered</label><textarea name="services" style="${inputStyle()}resize:vertical;min-height:72px" placeholder="e.g. Free screening, Patient counselling, Grants…"></textarea></div>
      <div class="form-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div><label style="font-size:13px;font-weight:700;color:${T().text};display:block">Phone</label><input name="phone" style="${inputStyle()}" placeholder="+234…"></div><div><label style="font-size:13px;font-weight:700;color:${T().text};display:block">Email</label><input name="email" type="email" style="${inputStyle()}" placeholder="org@email.com"></div></div>
      <div><label style="font-size:13px;font-weight:700;color:${T().text};display:block">Website</label><input name="website" style="${inputStyle()}" placeholder="https://…"></div>
      <div><label style="font-size:13px;font-weight:700;color:${T().text};display:block">Additional Notes</label><textarea name="notes" style="${inputStyle()}resize:vertical;min-height:56px" placeholder="Anything else about this organization…"></textarea></div>
      <button type="submit" style="background:${T().primary};color:#fff;border:none;border-radius:10px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;margin-top:4px">Submit for Review</button>
    </form></div>`);
}
function inputStyle(){ return `width:100%;background:${T().surfaceAlt};border:1px solid ${T().border};border-radius:9px;padding:10px 13px;font-size:13.5px;outline:none;box-sizing:border-box;margin-top:4px;font-family:inherit;color:${T().text};`; }

function render(){
  const theme=T(), filtered=filteredOrgs(), heroBg=`linear-gradient(135deg,${theme.heroFrom} 0%,${theme.heroMid} 50%,${theme.heroTo} 100%)`;
  root.innerHTML=`<div style="font-family:'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif;background:${theme.bg};min-height:100vh;color:${theme.text}">
    <header class="nav" style="background:${theme.navBg};backdrop-filter:blur(14px);border-bottom:1px solid ${theme.border};padding:0 22px;display:flex;align-items:center;justify-content:space-between;height:62px;position:sticky;top:0;z-index:200">
      <div style="display:flex;align-items:center;gap:10px">${logo()}<div><div style="font-weight:800;font-size:14.5px;color:${theme.text};line-height:1.2">HealthFinder Nigeria</div><div class="nav-brand-sub" style="font-size:10.5px;color:${theme.muted}">Healthcare Subsidy Finder</div></div></div>
      <div style="display:flex;gap:8px;align-items:center"><button onclick="toggleDark()" style="background:${theme.surfaceAlt};border:1px solid ${theme.border};border-radius:9px;padding:7px 13px;font-size:13px;font-weight:600;cursor:pointer;color:${theme.text}">${state.dark?'☀️ Light':'🌙 Dark'}</button><button class="nav-add" onclick="openSubmit()" style="background:${theme.accent};color:#fff;border:none;border-radius:9px;padding:8px 16px;font-size:12.5px;font-weight:700;cursor:pointer">+ Add Org</button></div>
    </header>
    <div class="hsf-hero hero" style="background:${heroBg};padding:52px 20px 68px;position:relative;overflow:hidden">${dotPattern()}<div style="position:absolute;top:-60px;right:-80px;width:280px;height:280px;border-radius:50%;background:rgba(255,255,255,.05);pointer-events:none"></div><div style="position:absolute;bottom:-40px;left:-60px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.04);pointer-events:none"></div>
      <div style="max-width:660px;margin:0 auto;text-align:center;position:relative;z-index:1"><div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:5px 16px;margin-bottom:22px;font-size:12px;font-weight:600;color:rgba(255,255,255,.9)">🇳🇬 Nigeria's Healthcare Subsidy Directory</div>
      <h1 style="color:#fff;font-size:clamp(24px,5vw,40px);font-weight:800;margin:0 0 12px;line-height:1.15;letter-spacing:-.02em">Find Free Healthcare<br>Support in Nigeria</h1><p style="color:rgba(255,255,255,.72);font-size:14.5px;margin:0 0 30px;line-height:1.7">Discover grants, free treatment, and subsidies for chronic illnesses<br>across all 36 states and the FCT.</p>
      <div style="display:flex;gap:28px;justify-content:center;margin-bottom:32px;flex-wrap:wrap">${[['🏥','13','Organizations'],['📍','36','States Covered'],['💊','6','Illness Types']].map(([i,n,l])=>`<div style="text-align:center"><div style="font-size:10.5px;color:rgba(255,255,255,.5);margin-bottom:2px">${i} ${l}</div><div style="font-size:28px;font-weight:800;color:#fff;line-height:1">${n}</div></div>`).join('')}</div>
      <div class="hero-search" style="background:rgba(255,255,255,.97);border-radius:16px;padding:6px 6px 6px 16px;display:flex;gap:8px;align-items:center;box-shadow:0 10px 40px rgba(0,0,0,.3);margin-bottom:22px"><span style="font-size:16px">🔍</span><input id="search" type="text" placeholder="Search organizations or services…" value="${escapeHtml(state.searchQuery)}" style="flex:1;border:none;outline:none;padding:10px 6px;font-size:13.5px;background:transparent;font-family:inherit;color:#1E1033"><select id="stateSelect" style="border:1px solid #E4DCFF;border-radius:11px;padding:10px 12px;font-size:12.5px;color:#1E1033;background:#FAF8FF;cursor:pointer;outline:none;font-family:inherit">${STATES.map(s=>`<option ${s===state.selectedState?'selected':''}>${escapeHtml(s)}</option>`).join('')}</select></div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">${ALL_ILLNESSES.map(ill=>{const active=state.selectedIllnesses.includes(ill),C=ILLNESS[ill]?.L;return `<button onclick="toggleIll('${escapeHtml(ill)}')" style="padding:7px 14px;border-radius:999px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;border:2px solid ${active?C?.accent:'rgba(255,255,255,.32)'};background:${active?C?.pill:'rgba(255,255,255,.11)'};color:${active?C?.text:'rgba(255,255,255,.9)'};display:flex;align-items:center;gap:5px"><span style="font-size:11px">${ILLNESS_ICONS[ill]}</span>${escapeHtml(ill)}</button>`}).join('')}</div>
      ${state.selectedIllnesses.length?`<button onclick="clearIllness()" style="margin-top:12px;background:none;border:none;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer;font-family:inherit">Clear illness filters ✕</button>`:''}</div></div>
    <div style="line-height:0;margin-top:-2px"><svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block"><path d="M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z" fill="${theme.bg}"/></svg></div>
    <div style="background:${theme.aiBg};border-bottom:1.5px solid ${theme.aiBorder};padding:14px 22px"><div style="max-width:860px;margin:0 auto"><div class="ai-row" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:180px"><div style="font-size:13px;font-weight:800;color:${theme.aiHeading};margin-bottom:2px">✨ AI Helper</div><div style="font-size:11.5px;color:${theme.aiSub}">Describe your situation and we'll match you to the right support.</div></div><div class="ai-input-row" style="display:flex;gap:8px;flex:2;min-width:260px"><input id="aiInput" value="${escapeHtml(state.aiQuery)}" placeholder='e.g. "My child has sickle cell disease in Lagos…"' style="flex:1;border:1px solid ${theme.aiBorder};border-radius:10px;padding:9px 13px;font-size:13px;outline:none;background:${theme.surface};font-family:inherit;color:${theme.text}"><button id="aiBtn" onclick="handleAI()" style="background:${state.aiQuery.trim()&&!state.aiLoading?theme.accent:theme.border};color:${state.aiQuery.trim()&&!state.aiLoading?'#fff':theme.muted};border:none;border-radius:10px;padding:9px 18px;font-size:13px;font-weight:700;cursor:${state.aiQuery.trim()&&!state.aiLoading?'pointer':'not-allowed'};white-space:nowrap;font-family:inherit;min-width:105px">${state.aiLoading?'Matching…':'Find Help →'}</button></div></div>${state.aiError?`<div style="font-size:12px;color:#EF4444;margin-top:8px">⚠ ${escapeHtml(state.aiError)}</div>`:''}</div></div>
    <main style="max-width:860px;margin:0 auto;padding:30px 20px 60px">
      ${state.aiResults?.length?`<div style="margin-bottom:36px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:14px"><span>✨</span><h2 style="margin:0;font-size:15px;font-weight:800;color:${theme.text}">AI-Recommended Support</h2><button onclick="clearAI()" style="margin-left:auto;background:${theme.surfaceAlt};border:1px solid ${theme.border};border-radius:6px;padding:3px 10px;color:${theme.muted};font-size:11.5px;cursor:pointer">Clear ✕</button></div><div style="display:flex;flex-direction:column;gap:12px">${state.aiResults.map((o,i)=>orgCard(o,i)).join('')}</div><div style="margin:28px 0 0;border-top:1px solid ${theme.border};padding-top:28px"></div></div>`:''}
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px"><h2 style="margin:0;font-size:15px;font-weight:800;color:${theme.text}">${filtered.length} Organization${filtered.length!==1?'s':''}${state.selectedIllnesses.length?` <span style="font-weight:500;color:${theme.muted};font-size:13px">— ${escapeHtml(state.selectedIllnesses.join(', '))}</span>`:''}${state.selectedState!=='All States'?` <span style="font-weight:500;color:${theme.muted};font-size:13px">— ${escapeHtml(state.selectedState)}</span>`:''}</h2>${(state.selectedIllnesses.length||state.selectedState!=='All States'||state.searchQuery)?`<button onclick="clearAll()" style="background:none;border:1px solid ${theme.border};border-radius:7px;padding:4px 12px;font-size:12px;color:${theme.muted};cursor:pointer">Clear all</button>`:''}</div>
      ${filtered.length?`<div style="display:flex;flex-direction:column;gap:12px">${filtered.map((o,i)=>orgCard(o,i)).join('')}</div>`:`<div style="text-align:center;padding:60px 24px;background:${theme.surface};border-radius:18px;border:1px solid ${theme.border}"><div style="font-size:50px;margin-bottom:12px">🔍</div><div style="font-size:16px;font-weight:700;color:${theme.text};margin-bottom:8px">No organizations found</div><div style="font-size:13.5px;color:${theme.muted}">Try different filters, or use the AI Helper above to describe your situation.</div></div>`}
      <div style="margin-top:36px;background:${theme.surface};border-radius:16px;border:1px solid ${theme.border};padding:16px 20px"><div style="font-size:11px;font-weight:800;color:${theme.primary};text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px">Illness Colour Guide</div><div style="display:flex;flex-wrap:wrap;gap:8px">${ALL_ILLNESSES.map(i=>illnessPill(i)).join('')}</div></div>
      <div style="margin-top:14px;padding:12px 16px;background:${theme.surface};border-radius:10px;border:1px solid ${theme.border};font-size:11.5px;color:${theme.muted};line-height:1.6"><strong style="color:${theme.text}">⚠ Disclaimer: </strong>Always verify organization details independently before making contact. Information may change over time.</div>
    </main></div>`;
  bindEvents();
}
function bindEvents(){
  document.getElementById('search').addEventListener('input',e=>{state.searchQuery=e.target.value;render();const el=document.getElementById('search');el.focus();el.setSelectionRange(el.value.length,el.value.length);});
  document.getElementById('stateSelect').addEventListener('change',e=>{state.selectedState=e.target.value;render();});
  document.getElementById('aiInput').addEventListener('input',e=>{state.aiQuery=e.target.value;const b=document.getElementById('aiBtn');b.style.background=state.aiQuery.trim()&&!state.aiLoading?T().accent:T().border;b.style.color=state.aiQuery.trim()&&!state.aiLoading?'#fff':T().muted;b.style.cursor=state.aiQuery.trim()&&!state.aiLoading?'pointer':'not-allowed';});
  document.getElementById('aiInput').addEventListener('keydown',e=>{if(e.key==='Enter')handleAI();});
  document.querySelectorAll('[data-org]').forEach(el=>el.addEventListener('click',()=>openOrg(Number(el.dataset.org))));
}
function toggleIll(ill){state.selectedIllnesses=state.selectedIllnesses.includes(ill)?state.selectedIllnesses.filter(x=>x!==ill):[...state.selectedIllnesses,ill];render();}
function clearIllness(){state.selectedIllnesses=[];render();}
function clearAll(){state.selectedIllnesses=[];state.selectedState='All States';state.searchQuery='';render();}
function toggleDark(){state.dark=!state.dark;render();}
function openOrg(id){const org=ORGANIZATIONS.find(o=>o.id===id)||state.aiResults?.find(o=>o.id===id);if(org){document.body.insertAdjacentHTML('beforeend',orgDetail(org));}}
function openSubmit(){document.body.insertAdjacentHTML('beforeend',submitForm());document.getElementById('orgForm').addEventListener('submit',e=>{e.preventDefault();document.getElementById('modal').innerHTML=`<div style="padding:52px 32px;text-align:center"><div style="font-size:54px;margin-bottom:12px" class="hsf-pulse">✅</div><h2 style="color:${T().text};margin:0 0 10px;font-size:20px">Submission Received!</h2><p style="color:${T().muted};font-size:14px;line-height:1.6;max-width:340px;margin:0 auto 24px">Thank you. This organization will be reviewed and added to the directory if it meets our verification standards.</p><button onclick="closeModal()" style="background:${T().primary};color:#fff;border:none;border-radius:10px;padding:12px 30px;font-size:14px;font-weight:700;cursor:pointer">Done</button></div>`;});}
function closeModal(){document.getElementById('modal')?.remove();}
function clearAI(){state.aiResults=null;state.aiQuery='';state.aiError='';render();}

async function handleAI(){
  if(!state.aiQuery.trim()||state.aiLoading)return;
  state.aiLoading=true;state.aiError='';state.aiResults=null;render();
  const orgsText=ORGANIZATIONS.map(o=>`ID ${o.id}: ${o.name} | Conditions: ${o.illnesses.join(',')} | Location: ${o.states.join('/')} | Services: ${o.services.join(', ')}`).join('\n');
  const prompt=`You are a healthcare support assistant for Nigeria. Identify the 2–4 most relevant organizations for the user's situation.\n\nOrganizations:\n${orgsText}\n\nUser: "${state.aiQuery}"\n\nRespond ONLY with valid JSON: [{"id":1,"reason":"one sentence"}]. No markdown, no preamble.`;
  try{
    // NOTE: Direct browser calls to Anthropic may require a configured proxy/CORS setup.
    const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1000,messages:[{role:'user',content:prompt}]})});
    const data=await res.json();
    const raw=data.content.map(c=>c.type==='text'?c.text:'').join('').replace(/```json|```/g,'').trim();
    const recs=JSON.parse(raw);
    state.aiResults=recs.map(r=>({...ORGANIZATIONS.find(o=>o.id===r.id),aiReason:r.reason})).filter(o=>o.id);
  }catch(e){state.aiError='Could not get recommendations. Please try again.';}
  state.aiLoading=false;render();
}
render();
