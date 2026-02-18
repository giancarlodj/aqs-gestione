import { useState, useEffect, useCallback, useMemo } from "react";

var DEFAULT_USERS = {
  cinzia:{password:"cinzia2026",nome:"CINZIA",ruolo:"dipendente"},
  nicole:{password:"nicole2026",nome:"NICOLE",ruolo:"dipendente"},
  silvia:{password:"silvia2026",nome:"SILVIA",ruolo:"dipendente"},
  massimo:{password:"massimo2026",nome:"MASSIMO",ruolo:"dipendente"},
  giuseppe:{password:"giuseppe2026",nome:"GIUSEPPE",ruolo:"dipendente"},
  desena:{password:"desena2026",nome:"DE SENA",ruolo:"dipendente"},
  admin:{password:"admin2026",nome:"AMMINISTRAZIONE",ruolo:"admin"},
};

var RESPONSABILI = ["CINZIA","NICOLE","SILVIA","MASSIMO","GIUSEPPE","DE SENA"];

var DEMO = [
  {id:1,data:"2025-02-25",cliente:"CONIZUGNA MEDICA SRL",sede:"MILANO",nc:"SI",lavoro:"NOMINA ADDETTO SICUREZZA LASER",resp:"CINZIA",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:2,data:"2025-03-27",cliente:"TRIPLA A DENTALE",sede:"ROMA",nc:"NO",lavoro:"SOSTITUZIONE OPT TAC",resp:"MASSIMO",dc:"2025-03-27",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
  {id:3,data:"2025-06-13",cliente:"HDENTAL PERGINE",sede:"PERGINE",nc:"NO",lavoro:"PRATICA CAMBIO DIR SANITARIO",resp:"CINZIA",dc:"2025-07-21",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
  {id:4,data:"2025-12-12",cliente:"A.A. Pet S.r.l.",sede:"Roma Prenestina",nc:"NO",lavoro:"DVR ALLEGATI PEM PLANIMETRIE",resp:"NICOLE",dc:"2025-12-12",fatt:"X",note:"",dfa:"",df:"2026-01-29",cBy:"admin",uBy:"",uAt:""},
  {id:5,data:"2025-12-12",cliente:"AMB VET DRSSA PICA",sede:"Tivoli RM",nc:"SI",lavoro:"DVR ALLEGATI NOMINA RSPP",resp:"NICOLE",dc:"",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:6,data:"2025-12-19",cliente:"Clinica Vet Tuscolana",sede:"Roma",nc:"SI",lavoro:"DVR ALLEGATI PLANIMETRIA PEM CPI",resp:"NICOLE",dc:"",fatt:"X",note:"ATTESA PLANIMETRIA",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:7,data:"2026-01-07",cliente:"STUDIO DENT MONTINARO",sede:"LECCE",nc:"NO",lavoro:"DVR AGGIORNAMENTO PLANIMETRIA",resp:"NICOLE",dc:"",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:8,data:"2026-01-07",cliente:"AMB VET DR CIOTOLA",sede:"Casoria NA",nc:"SI",lavoro:"DVR ALLEGATI COMPLETI",resp:"NICOLE",dc:"",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:9,data:"2026-01-08",cliente:"BV PET CARE CINISELLO",sede:"Cinisello",nc:"NO",lavoro:"AGGIORNAMENTO DVR ALLEGATI",resp:"SILVIA",dc:"",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:10,data:"2026-01-13",cliente:"DG DENT SRL",sede:"ROMA",nc:"NO",lavoro:"CORSO AGG LAVORATORI",resp:"NICOLE",dc:"2026-01-20",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:11,data:"2026-02-02",cliente:"DP DENT NERVIANO",sede:"NERVIANO",nc:"NO",lavoro:"RELAZIONE LASER NOMINA ADDETTO",resp:"CINZIA",dc:"2026-02-02",fatt:"X",note:"",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:12,data:"2026-02-02",cliente:"LONGEVITY MEDICAL",sede:"COMO",nc:"SI",lavoro:"DOCUMENTAZIONE SICUREZZA",resp:"NICOLE",dc:"",fatt:"X",note:"DVR PROVVISORIO",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:13,data:"2026-02-04",cliente:"BV CA ZAMPA Sambuco",sede:"Milano",nc:"SI",lavoro:"SICUREZZA E SORVEGLIANZA",resp:"SILVIA",dc:"",fatt:"X",note:"NOMINA RSPP",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:14,data:"2026-02-10",cliente:"CIEMME",sede:"",nc:"NO",lavoro:"CORSO ONLINE STAMPATORE",resp:"NICOLE",dc:"2026-02-17",fatt:"X",note:"VIDEOCALL",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:15,data:"2026-02-10",cliente:"STUDIO DENT GALLO",sede:"NAPOLI",nc:"SI",lavoro:"DVR PLANIMETRIA NOMINA RSPP",resp:"NICOLE",dc:"",fatt:"",note:"ATTESA DOCUMENTI",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
  {id:16,data:"2025-12-20",cliente:"HDENTAL TRENTO",sede:"TRENTO",nc:"NO",lavoro:"RELAZIONE TECNICA LASER",resp:"CINZIA",dc:"2026-01-15",fatt:"X",note:"",dfa:"",df:"2026-02-10",cBy:"admin",uBy:"",uAt:""},
  {id:17,data:"2025-11-15",cliente:"STUDIO BIANCHI",sede:"FIRENZE",nc:"NO",lavoro:"AGG REGISTRO ESPOSTI",resp:"CINZIA",dc:"2025-12-01",fatt:"X",note:"",dfa:"",df:"2026-01-15",cBy:"admin",uBy:"",uAt:""},
  {id:18,data:"2026-02-12",cliente:"CLINICA VET EUROPA",sede:"Roma EUR",nc:"NO",lavoro:"AGG DVR POST ISPEZIONE ASL",resp:"NICOLE",dc:"",fatt:"",note:"URGENTE",dfa:"",df:"",cBy:"admin",uBy:"",uAt:""},
];

function getStato(r) {
  if (!r.data) return "";
  if (r.df) return "FATTURATO";
  if (r.fatt === "X") return "DA FATTURARE";
  return "IN ATTESA";
}

function getAlert(r) {
  if (!r.data || r.df) return "";
  if (r.fatt === "X" && r.dc) return "PRONTO FATTURARE";
  if (r.nc === "SI" && !r.dfa) return "FATTURARE ANTICIPO";
  return "";
}

function getProg(r) {
  if (!r.data) return { n: 0, colors: [] };
  if (r.df) return { n: 4, colors: ["#2E7D32","#2E7D32","#2E7D32","#2E7D32"], label: "Fatturato" };
  if (r.fatt === "X" && r.dc) return { n: 3, colors: ["#EF6C00","#EF6C00","#EF6C00"], label: "Completo e fatturabile" };
  if (r.nc === "SI" && r.dfa) return { n: 2, colors: ["#C62828","#F57C00"], label: "Anticipo fatturato" };
  if (r.nc === "SI") return { n: 2, colors: ["#C62828","#C62828"], label: "Anticipo da fare" };
  return { n: 1, colors: ["#C62828"], label: "Inserito" };
}

function fDate(d) {
  if (!d) return "";
  try { var dt = new Date(d); return dt.getDate() + "/" + String(dt.getMonth()+1).padStart(2,"0") + "/" + dt.getFullYear(); }
  catch(e) { return d; }
}

function timeNow() { return new Date().toISOString().slice(0,16).replace("T"," "); }

/* === SVG ICONS === */
function IconEdit() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
}
function IconMail() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
}
function IconTrash() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
}

/* === UI COMPONENTS === */
function Stars({ prog }) {
  var empty = "#E5E7EB";
  return (
    <div style={{display:"flex",gap:3,alignItems:"center"}} title={prog ? prog.label : ""}>
      {[0,1,2,3].map(function(i) {
        var active = prog && i < prog.n;
        var col = active ? (prog.colors[i] || prog.colors[prog.colors.length-1]) : empty;
        return <div key={i} style={{width:14,height:14,borderRadius:3,background:col,boxShadow:active?"0 1px 2px rgba(0,0,0,0.2)":"none"}}/>;
      })}
    </div>
  );
}

function StatoTag({ s }) {
  if (!s) return null;
  var m = {"FATTURATO":{bg:"#C8E6C9",c:"#2E7D32"},"DA FATTURARE":{bg:"#FFCDD2",c:"#C62828"},"IN ATTESA":{bg:"#FFE0B2",c:"#E65100"}};
  var st = m[s] || {bg:"#eee",c:"#666"};
  return <span style={{background:st.bg,color:st.c,padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:700,whiteSpace:"nowrap",display:"inline-block"}}>{s}</span>;
}

function AlertTag({ a }) {
  if (!a) return null;
  return <span style={{background:"#C62828",color:"#fff",padding:"4px 10px",borderRadius:6,fontSize:10,fontWeight:700,whiteSpace:"nowrap",display:"inline-block"}}>{a}</span>;
}

function Pie({ data }) {
  var total = data.reduce(function(s,d){ return s+d.v; },0);
  if (!total) return null;
  var cum = 0, sz = 180, cx = 90, cy = 90, r = 75;
  function mp(sa,ea) {
    var s1=(sa-90)*Math.PI/180, e1=(ea-90)*Math.PI/180, la=ea-sa>180?1:0;
    return "M"+cx+" "+cy+"L"+(cx+r*Math.cos(s1))+" "+(cy+r*Math.sin(s1))+"A"+r+" "+r+" 0 "+la+" 1 "+(cx+r*Math.cos(e1))+" "+(cy+r*Math.sin(e1))+"Z";
  }
  return (
    <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
      <svg width={sz} height={sz}>
        {data.map(function(d,i){var a=(d.v/total)*360,sa=cum;cum+=a;return <path key={i} d={mp(sa,sa+a-0.5)} fill={d.col}/>;})}
        <circle cx={cx} cy={cy} r={36} fill="white"/>
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" style={{fontSize:20,fontWeight:800,fill:"#1F4E79"}}>{total}</text>
      </svg>
      <div>{data.map(function(d,i){
        return <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,marginBottom:6}}>
          <div style={{width:10,height:10,borderRadius:2,background:d.col}}/><span>{d.label}</span>
          <b style={{color:d.col}}>{d.v}</b><span style={{color:"#999",fontSize:11}}>({Math.round(d.v/total*100)}%)</span>
        </div>;
      })}</div>
    </div>
  );
}

function Modal({ children, onClose, wide }) {
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      <div onClick={function(e){e.stopPropagation();}} style={{background:"white",borderRadius:16,padding:28,width:wide?700:540,maxHeight:"88vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>{children}</div>
    </div>
  );
}

function EditForm({ row, onSave, onClose, isAdmin, users }) {
  var [f, setF] = useState(Object.assign({}, row));
  function set(k,v) { setF(function(p){ return Object.assign({},p,{[k]:v}); }); }
  var inp = {padding:"10px 12px",border:"1.5px solid #D1D5DB",borderRadius:8,fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"};
  var lbl = {fontSize:10,fontWeight:700,color:"#6B7280",marginBottom:3,display:"block",textTransform:"uppercase"};
  var resps = [];
  Object.values(users).forEach(function(u){if(u.ruolo==="dipendente"&&resps.indexOf(u.nome)===-1)resps.push(u.nome);});
  return (
    <Modal onClose={onClose}>
      <h2 style={{margin:"0 0 20px",fontSize:18,fontWeight:800,color:"#1F4E79"}}>{row.id?"Modifica":"Nuova Attivita"}</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><label style={lbl}>Data</label><input type="date" value={f.data} onChange={function(e){set("data",e.target.value);}} style={inp}/></div>
        <div><label style={lbl}>Nuovo contratto</label><select value={f.nc} onChange={function(e){set("nc",e.target.value);}} style={inp}><option value="">--</option><option>SI</option><option>NO</option></select></div>
        <div style={{gridColumn:"1/-1"}}><label style={lbl}>Cliente</label><input value={f.cliente} onChange={function(e){set("cliente",e.target.value);}} style={inp}/></div>
        <div><label style={lbl}>Sede</label><input value={f.sede} onChange={function(e){set("sede",e.target.value);}} style={inp}/></div>
        <div><label style={lbl}>Responsabile</label><select value={f.resp} onChange={function(e){set("resp",e.target.value);}} style={inp}><option value="">--</option>{resps.map(function(r){return <option key={r}>{r}</option>;})}</select></div>
        <div style={{gridColumn:"1/-1"}}><label style={lbl}>Lavoro</label><textarea value={f.lavoro} onChange={function(e){set("lavoro",e.target.value);}} rows={2} style={Object.assign({},inp,{resize:"vertical"})}/></div>
        <div><label style={lbl}>Completamento</label><input type="date" value={f.dc} onChange={function(e){set("dc",e.target.value);}} style={inp}/></div>
        <div><label style={lbl}>Fatturabile?</label><select value={f.fatt} onChange={function(e){set("fatt",e.target.value);}} style={inp}><option value="">No</option><option value="X">Si</option></select></div>
        <div style={{gridColumn:"1/-1"}}><label style={lbl}>Note</label><input value={f.note} onChange={function(e){set("note",e.target.value);}} style={inp}/></div>
        {isAdmin && <div><label style={lbl}>Fatt. anticipo</label><input type="date" value={f.dfa} onChange={function(e){set("dfa",e.target.value);}} style={inp}/></div>}
        {isAdmin && <div><label style={lbl}>Data fattura</label><input type="date" value={f.df} onChange={function(e){set("df",e.target.value);}} style={inp}/></div>}
      </div>
      <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
        <button onClick={onClose} style={{padding:"10px 24px",background:"#F3F4F6",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600}}>Annulla</button>
        <button onClick={function(){if(!f.data||!f.cliente){alert("Compilare Data e Cliente");return;}onSave(f);}} style={{padding:"10px 24px",background:"#1F4E79",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700}}>Salva</button>
      </div>
    </Modal>
  );
}

function AdminSettings({ users, onSaveUsers, logs, onClose }) {
  var [tab, setTab] = useState("utenti");
  var [uList, setUList] = useState(Object.entries(users).map(function(e){return Object.assign({username:e[0]},e[1]);}));
  var [nu, setNu] = useState({username:"",password:"",nome:"",ruolo:"dipendente"});
  var inp = {padding:"8px 10px",border:"1px solid #D1D5DB",borderRadius:6,fontSize:12,outline:"none",boxSizing:"border-box"};

  function saveAll(){var obj={};uList.forEach(function(u){obj[u.username]={password:u.password,nome:u.nome,ruolo:u.ruolo};});onSaveUsers(obj);alert("Salvato!");}
  function addUser(){
    if(!nu.username||!nu.password||!nu.nome){alert("Compilare tutti i campi");return;}
    if(uList.find(function(u){return u.username===nu.username.toLowerCase();})){alert("Username esistente");return;}
    setUList(uList.concat([Object.assign({},nu,{username:nu.username.toLowerCase()})]));
    setNu({username:"",password:"",nome:"",ruolo:"dipendente"});
  }

  return (
    <Modal onClose={onClose} wide>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:800,color:"#1F4E79"}}>Impostazioni Admin</h2>
        <button onClick={onClose} style={{background:"#F3F4F6",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16}}>X</button>
      </div>
      <div style={{display:"flex",marginBottom:20,background:"#F3F4F6",borderRadius:8,overflow:"hidden"}}>
        {["utenti","log","info"].map(function(k){return <button key={k} onClick={function(){setTab(k);}} style={{padding:"10px 18px",background:tab===k?"#1F4E79":"transparent",color:tab===k?"white":"#6B7280",border:"none",fontSize:12,fontWeight:600,cursor:"pointer",flex:1,textTransform:"capitalize"}}>{k}</button>;})}
      </div>

      {tab==="utenti" && <div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,marginBottom:16}}>
          <thead><tr style={{borderBottom:"2px solid #E5E7EB"}}>
            {["Username","Password","Nome","Ruolo",""].map(function(h){return <th key={h} style={{padding:"8px",textAlign:"left",fontWeight:700,color:"#6B7280",fontSize:10,textTransform:"uppercase"}}>{h}</th>;})}
          </tr></thead>
          <tbody>{uList.map(function(u){return <tr key={u.username} style={{borderBottom:"1px solid #F3F4F6"}}>
            <td style={{padding:"6px 8px"}}><b style={{color:"#1F4E79"}}>{u.username}</b></td>
            <td style={{padding:"6px 8px"}}><input value={u.password} onChange={function(e){setUList(uList.map(function(x){return x.username===u.username?Object.assign({},x,{password:e.target.value}):x;}));}} style={Object.assign({},inp,{width:120})}/></td>
            <td style={{padding:"6px 8px"}}><input value={u.nome} onChange={function(e){setUList(uList.map(function(x){return x.username===u.username?Object.assign({},x,{nome:e.target.value.toUpperCase()}):x;}));}} style={Object.assign({},inp,{width:120})}/></td>
            <td style={{padding:"6px 8px"}}><select value={u.ruolo} onChange={function(e){setUList(uList.map(function(x){return x.username===u.username?Object.assign({},x,{ruolo:e.target.value}):x;}));}} style={Object.assign({},inp,{width:100})}><option>dipendente</option><option>admin</option></select></td>
            <td style={{padding:"6px 8px"}}>{u.username!=="admin"&&<button onClick={function(){setUList(uList.filter(function(x){return x.username!==u.username;}));}} style={{background:"#FEE2E2",color:"#C62828",border:"none",borderRadius:4,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Elimina</button>}</td>
          </tr>;})}</tbody>
        </table>
        <div style={{padding:14,background:"#F8FAFC",borderRadius:8,marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#1F4E79",marginBottom:8}}>NUOVO UTENTE</div>
          <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}>
            <div><label style={{fontSize:9,color:"#6B7280"}}>Username</label><input value={nu.username} onChange={function(e){setNu(Object.assign({},nu,{username:e.target.value}));}} style={Object.assign({},inp,{width:100})}/></div>
            <div><label style={{fontSize:9,color:"#6B7280"}}>Password</label><input value={nu.password} onChange={function(e){setNu(Object.assign({},nu,{password:e.target.value}));}} style={Object.assign({},inp,{width:100})}/></div>
            <div><label style={{fontSize:9,color:"#6B7280"}}>Nome</label><input value={nu.nome} onChange={function(e){setNu(Object.assign({},nu,{nome:e.target.value.toUpperCase()}));}} style={Object.assign({},inp,{width:100})}/></div>
            <button onClick={addUser} style={{padding:"8px 16px",background:"#2E75B6",color:"white",border:"none",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",height:34}}>+ Aggiungi</button>
          </div>
        </div>
        <button onClick={saveAll} style={{padding:"10px 24px",background:"#1F4E79",color:"white",border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer"}}>Salva Utenti</button>
      </div>}

      {tab==="log" && <div style={{maxHeight:400,overflow:"auto"}}>
        {logs.length>0 ? logs.slice().reverse().map(function(l,i){
          return <div key={i} style={{padding:"8px 12px",borderBottom:"1px solid #F3F4F6",fontSize:11,display:"flex",gap:10}}>
            <span style={{color:"#9CA3AF",whiteSpace:"nowrap",minWidth:120}}>{l.when}</span>
            <span style={{fontWeight:700,color:"#1F4E79",minWidth:80}}>{l.who}</span>
            <span style={{color:l.action==="CREATO"?"#2E7D32":l.action==="ELIMINATO"?"#C62828":"#E65100",fontWeight:600,minWidth:70}}>{l.action}</span>
            <span style={{color:"#374151"}}>{l.detail}</span>
          </div>;
        }) : <div style={{padding:30,textAlign:"center",color:"#9CA3AF"}}>Nessun log</div>}
      </div>}

      {tab==="info" && <div style={{fontSize:13,color:"#374151",lineHeight:1.8}}>
        <h3 style={{color:"#1F4E79"}}>AQS Italia - Gestione Commesse v2.0</h3>
        <p>Login multi-utente con ruoli admin e dipendente</p>
        <p>Dashboard statistiche in tempo reale</p>
        <p>Progressi con indicatori colorati</p>
        <p>Alert automatici anticipo e fatturazione</p>
        <p>Log completo modifiche per utente</p>
        <p>Esportazione CSV e invio email</p>
        <p>Gestione utenti (solo admin)</p>
        <p style={{marginTop:12,fontWeight:700}}>Prossimo: Scadenzario Clienti</p>
      </div>}
    </Modal>
  );
}

function LegendaModal({ onClose }) {
  var items = [
    {colors:["#C62828","#E5E7EB","#E5E7EB","#E5E7EB"],label:"Lavoro inserito"},
    {colors:["#C62828","#C62828","#E5E7EB","#E5E7EB"],label:"Nuovo contratto - anticipo da fare"},
    {colors:["#C62828","#F57C00","#E5E7EB","#E5E7EB"],label:"Anticipo fatturato"},
    {colors:["#EF6C00","#EF6C00","#EF6C00","#E5E7EB"],label:"Completo e fatturabile"},
    {colors:["#2E7D32","#2E7D32","#2E7D32","#2E7D32"],label:"Fatturato"},
  ];
  return (
    <Modal onClose={onClose}>
      <h3 style={{margin:"0 0 16px",color:"#1F4E79",fontWeight:800}}>Legenda Progressi</h3>
      {items.map(function(it,idx){
        return <div key={idx} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:idx<4?"1px solid #F3F4F6":"none"}}>
          <div style={{display:"flex",gap:3}}>
            {it.colors.map(function(c,j){return <div key={j} style={{width:16,height:16,borderRadius:3,background:c}}/>;
            })}
          </div>
          <span style={{fontSize:13,color:"#374151"}}>{it.label}</span>
        </div>;
      })}
    </Modal>
  );
}

export default function App() {
  var [user, setUser] = useState(null);
  var [section, setSection] = useState(null);
  var [rows, setRows] = useState(DEMO);
  var [users, setUsers] = useState(DEFAULT_USERS);
  var [logs, setLogs] = useState([]);
  var [view, setView] = useState("dashboard");
  var [editing, setEditing] = useState(null);
  var [filter, setFilter] = useState("TUTTI");
  var [search, setSearch] = useState("");
  var [showSettings, setShowSettings] = useState(false);
  var [showLegenda, setShowLegenda] = useState(false);

  useEffect(function(){
    (async function(){
      try {
        if (!window.storage) return;
        var rd = await window.storage.get("aq7-rows",true); if(rd&&rd.value) setRows(JSON.parse(rd.value));
        var ud = await window.storage.get("aq7-users",true); if(ud&&ud.value) setUsers(JSON.parse(ud.value));
        var ld = await window.storage.get("aq7-logs",true); if(ld&&ld.value) setLogs(JSON.parse(ld.value));
      } catch(e){console.log("init",e);}
    })();
  },[]);

  var persist = useCallback(async function(key,val){try{if(window.storage)await window.storage.set(key,JSON.stringify(val),true);}catch(e){}},[]);
  function saveRows(nr){setRows(nr);persist("aq7-rows",nr);}
  function saveUsers(nu){setUsers(nu);persist("aq7-users",nu);}
  function addLog(who,action,detail){setLogs(function(prev){var nl=prev.concat([{when:timeNow(),who:who,action:action,detail:detail}]);persist("aq7-logs",nl);return nl;});}

  var stats = useMemo(function(){
    var f=rows.filter(function(r){return r.data;});
    var fat=f.filter(function(r){return getStato(r)==="FATTURATO";}).length;
    var df=f.filter(function(r){return getStato(r)==="DA FATTURARE";}).length;
    var att=f.filter(function(r){return getStato(r)==="IN ATTESA";}).length;
    var tot=f.length,pct=tot?Math.round(fat/tot*100):0;
    var byR={};f.forEach(function(r){var k=r.resp||"?";if(!byR[k])byR[k]={t:0,f:0,d:0,a:0};byR[k].t++;var s=getStato(r);if(s==="FATTURATO")byR[k].f++;else if(s==="DA FATTURARE")byR[k].d++;else byR[k].a++;});
    var alc=f.filter(function(r){return getAlert(r);}).length;
    return {tot:tot,fat:fat,df:df,att:att,nv:f.filter(function(r){return r.nc==="SI";}).length,pct:pct,byR:byR,alc:alc};
  },[rows]);

  var filtered = useMemo(function(){
    var r=rows.filter(function(x){return x.data;});
    if(user&&user.ruolo==="dipendente") r=r.filter(function(x){return x.resp===user.nome;});
    if(filter==="DA FATTURARE") r=r.filter(function(x){return getStato(x)==="DA FATTURARE";});
    else if(filter==="IN ATTESA") r=r.filter(function(x){return getStato(x)==="IN ATTESA";});
    else if(filter==="FATTURATO") r=r.filter(function(x){return getStato(x)==="FATTURATO";});
    else if(filter==="ALERT") r=r.filter(function(x){return getAlert(x);});
    if(search){var s=search.toLowerCase();r=r.filter(function(x){return [x.cliente,x.lavoro,x.sede,x.resp].some(function(v){return (v||"").toLowerCase().indexOf(s)>=0;});});}
    r.sort(function(a,b){return b.data.localeCompare(a.data);});
    return r;
  },[rows,user,filter,search]);

  function doSave(form){
    if(form.id){form.uBy=user.nome;form.uAt=timeNow();saveRows(rows.map(function(r){return r.id===form.id?form:r;}));addLog(user.nome,"MODIFICATO",form.cliente);}
    else{form.id=Date.now();form.cBy=user.nome;saveRows(rows.concat([form]));addLog(user.nome,"CREATO",form.cliente);}
    setEditing(null);
  }
  function doDelete(id){
    var r=rows.find(function(x){return x.id===id;});
    if(!r) return;
    if(confirm("Eliminare "+r.cliente+"?")){
      var newRows=rows.filter(function(x){return x.id!==id;});
      saveRows(newRows);
      addLog(user.nome,"ELIMINATO",r.cliente);
    }
  }
  function sendEmail(row){var stato=getStato(row);var subj=encodeURIComponent("[FATT] "+stato+" - "+row.cliente);var body="Cliente: "+row.cliente+"\nSede: "+row.sede+"\nLavoro: "+row.lavoro+"\nResp: "+row.resp+"\nStato: "+stato+(row.note?"\nNote: "+row.note:"")+"\n\nCordiali saluti";window.open("mailto:amministrazione@aqsitalia.it?subject="+subj+"&body="+encodeURIComponent(body));}
  function exportCSV(){var h=["Data","Cliente","Sede","Contratto","Lavoro","Resp","Completamento","Fatturabile","Note","Anticipo","Fattura","Stato","Creato","Modificato"];var csv=[h.join(";")];filtered.forEach(function(r){csv.push([fDate(r.data),r.cliente,r.sede,r.nc,(r.lavoro||"").replace(/;/g,","),r.resp,fDate(r.dc),r.fatt,(r.note||"").replace(/;/g,","),fDate(r.dfa),fDate(r.df),getStato(r),r.cBy||"",r.uBy||""].join(";"));});var blob=new Blob([csv.join("\n")],{type:"text/csv;charset=utf-8"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download="commesse.csv";a.click();}

  if(!user) return <LoginPage users={users} onLogin={function(u){setUser(u);addLog(u.nome,"LOGIN","Accesso");}}/>;

  if(!section) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0A1628,#1F4E79,#2E75B6)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.5)",marginBottom:8}}>Benvenuto, {user.nome}</div>
        <h1 style={{color:"white",fontSize:28,fontWeight:800,margin:"0 0 40px"}}>Seleziona Servizio</h1>
        <div style={{display:"flex",gap:24,justifyContent:"center",flexWrap:"wrap"}}>
          <div onClick={function(){setSection("fatt");}} style={{background:"white",borderRadius:20,padding:"40px 36px",width:260,cursor:"pointer",boxShadow:"0 10px 40px rgba(0,0,0,0.2)"}}>
            <div style={{width:48,height:48,borderRadius:10,background:"#1F4E79",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/></svg></div>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1F4E79",margin:"0 0 8px"}}>Lavori da Fatturare</h2>
            <p style={{fontSize:13,color:"#6B7280",margin:0}}>Gestione commesse e fatturazione</p>
            {stats.df>0&&<div style={{marginTop:14,background:"#FFCDD2",color:"#C62828",padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:700}}>{stats.df} da fatturare</div>}
          </div>
          <div style={{background:"white",borderRadius:20,padding:"40px 36px",width:260,opacity:0.55,position:"relative"}}>
            <div style={{position:"absolute",top:16,right:16,background:"#FFB74D",color:"white",padding:"3px 8px",borderRadius:4,fontSize:9,fontWeight:700}}>PRESTO</div>
            <div style={{width:48,height:48,borderRadius:10,background:"#9CA3AF",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg></div>
            <h2 style={{fontSize:18,fontWeight:800,color:"#1F4E79",margin:"0 0 8px"}}>Scadenzario Clienti</h2>
            <p style={{fontSize:13,color:"#6B7280",margin:0}}>Scadenze e rinnovi contratti</p>
          </div>
        </div>
        <button onClick={function(){setUser(null);setSection(null);}} style={{marginTop:36,padding:"8px 20px",background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,fontSize:12,cursor:"pointer"}}>Cambia utente</button>
      </div>
    </div>
  );

  var isAdmin = user.ruolo==="admin";

  return (
    <div style={{minHeight:"100vh",background:"#F0F4F8",fontFamily:"system-ui,sans-serif"}}>
    <div style={{background:"linear-gradient(135deg,#0A1628,#1F4E79)",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:36,height:36,background:"rgba(255,255,255,0.12)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:12}}>AQS</div>
        <div><div style={{color:"white",fontSize:15,fontWeight:700}}>Gestione Commesse</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:10}}>{new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div></div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",background:"rgba(255,255,255,0.08)",borderRadius:8,overflow:"hidden"}}>
          {["dashboard","lista","riepilogo"].map(function(v){return <button key={v} onClick={function(){setView(v);}} style={{padding:"7px 14px",background:view===v?"rgba(255,255,255,0.18)":"transparent",color:"white",border:"none",fontSize:11,fontWeight:view===v?700:400,cursor:"pointer",textTransform:"capitalize"}}>{v}</button>;})}
        </div>
        {stats.alc>0&&<div onClick={function(){setView("lista");setFilter("ALERT");}} style={{background:"#C62828",color:"white",borderRadius:20,padding:"3px 10px",fontSize:10,fontWeight:700,cursor:"pointer",minWidth:20,textAlign:"center"}}>{stats.alc}</div>}
        {isAdmin&&<button onClick={function(){setShowSettings(true);}} style={{background:"rgba(255,255,255,0.08)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:"white",display:"flex",alignItems:"center"}} title="Impostazioni"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>}
        <div style={{color:"white",fontSize:11,padding:"5px 10px",background:"rgba(255,255,255,0.08)",borderRadius:6}}><b>{user.nome}</b></div>
        <button onClick={function(){setSection(null);}} style={{padding:"6px 12px",background:"transparent",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,fontSize:10,cursor:"pointer"}}>Servizi</button>
        <button onClick={function(){addLog(user.nome,"LOGOUT","");setUser(null);setSection(null);}} style={{padding:"6px 12px",background:"transparent",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,fontSize:10,cursor:"pointer"}}>Esci</button>
      </div>
    </div>

    <div style={{padding:"20px 24px",maxWidth:1440,margin:"0 auto"}}>

    {view==="dashboard"&&<div>
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        {[["Totale",stats.tot,"#1F4E79"],["Da fatturare",stats.df,"#C62828"],["In attesa",stats.att,"#E65100"],["Fatturato",stats.fat,"#2E7D32"],["% Fatturato",stats.pct+"%","#1F4E79"],["Nuovi contratti",stats.nv,"#2E75B6"]].map(function(item){
          return <div key={item[0]} style={{background:"white",borderRadius:12,padding:"16px 20px",flex:1,minWidth:120,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase"}}>{item[0]}</div>
            <div style={{fontSize:28,fontWeight:800,color:item[2],marginTop:4}}>{item[1]}</div>
          </div>;
        })}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <div style={{background:"white",borderRadius:14,padding:22}}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#1F4E79"}}>Stato</h3><Pie data={[{label:"Da fatturare",v:stats.df,col:"#E57373"},{label:"In attesa",v:stats.att,col:"#FFB74D"},{label:"Fatturato",v:stats.fat,col:"#81C784"}]}/></div>
        <div style={{background:"white",borderRadius:14,padding:22}}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#1F4E79"}}>Per Responsabile</h3>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"2px solid #E5E7EB"}}>{["Nome","Tot","Da f.","Att.","Fatt","%"].map(function(h){return <th key={h} style={{padding:"6px",textAlign:"left",color:"#9CA3AF",fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{h}</th>;})}</tr></thead>
          <tbody>{Object.entries(stats.byR).sort(function(a,b){return b[1].t-a[1].t;}).map(function(entry){var n=entry[0],s=entry[1];return <tr key={n} style={{borderBottom:"1px solid #F3F4F6"}}><td style={{padding:"6px",fontWeight:700,color:"#1F4E79"}}>{n}</td><td style={{padding:"6px",fontWeight:700}}>{s.t}</td><td style={{padding:"6px",color:"#C62828"}}>{s.d}</td><td style={{padding:"6px",color:"#E65100"}}>{s.a}</td><td style={{padding:"6px",color:"#2E7D32"}}>{s.f}</td><td style={{padding:"6px",fontWeight:700}}>{s.t?Math.round(s.f/s.t*100):0}%</td></tr>;})}</tbody>
        </table></div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={function(){setView("lista");setFilter("DA FATTURARE");}} style={{padding:"8px 14px",background:"#FFCDD2",color:"#C62828",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Da Fatturare ({stats.df})</button>
        <button onClick={function(){setView("lista");setFilter("ALERT");}} style={{padding:"8px 14px",background:"#FFF3E0",color:"#E65100",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Alert ({stats.alc})</button>
        <button onClick={function(){setShowLegenda(true);}} style={{padding:"8px 14px",background:"#F3F4F6",color:"#374151",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Legenda</button>
      </div>
    </div>}

    {view==="riepilogo"&&<div>
      <h2 style={{fontSize:18,fontWeight:800,color:"#1F4E79",marginBottom:16}}>Riepilogo</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
        {Object.entries(stats.byR).sort(function(a,b){return b[1].t-a[1].t;}).map(function(entry){var n=entry[0],s=entry[1],p=s.t?Math.round(s.f/s.t*100):0;return <div key={n} style={{background:"white",borderRadius:12,padding:18}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><b style={{color:"#1F4E79",fontSize:15}}>{n}</b><span style={{fontSize:22,fontWeight:800,color:p>=60?"#2E7D32":p>=30?"#E65100":"#C62828"}}>{p}%</span></div>
          <div style={{background:"#F3F4F6",borderRadius:4,height:6,marginBottom:12}}><div style={{height:"100%",borderRadius:4,background:p>=60?"#81C784":p>=30?"#FFB74D":"#E57373",width:p+"%"}}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,fontSize:11,textAlign:"center"}}><div style={{padding:6,background:"#FFEBEE",borderRadius:6}}><div style={{fontWeight:800,fontSize:16,color:"#C62828"}}>{s.d}</div>Da fatt.</div><div style={{padding:6,background:"#FFF8E1",borderRadius:6}}><div style={{fontWeight:800,fontSize:16,color:"#E65100"}}>{s.a}</div>Attesa</div><div style={{padding:6,background:"#E8F5E9",borderRadius:6}}><div style={{fontWeight:800,fontSize:16,color:"#2E7D32"}}>{s.f}</div>Fatt.</div></div>
        </div>;})}
      </div>
    </div>}

    {view==="lista"&&<div>
      <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
        <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Cerca..." style={{padding:"9px 14px",border:"1.5px solid #D1D5DB",borderRadius:8,fontSize:13,outline:"none",width:250,background:"white"}}/>
        <div style={{display:"flex",background:"white",borderRadius:8,overflow:"hidden",border:"1.5px solid #D1D5DB"}}>
          {["TUTTI","DA FATTURARE","IN ATTESA","FATTURATO","ALERT"].map(function(f){
            var cnt=f==="ALERT"?stats.alc:f==="DA FATTURARE"?stats.df:f==="IN ATTESA"?stats.att:f==="FATTURATO"?stats.fat:stats.tot;
            return <button key={f} onClick={function(){setFilter(f);}} style={{padding:"7px 10px",background:filter===f?"#1F4E79":"transparent",color:filter===f?"white":"#6B7280",border:"none",fontSize:10,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{f} ({cnt})</button>;
          })}
        </div>
        <div style={{flex:1}}/>
        <button onClick={function(){setShowLegenda(true);}} style={{padding:"8px 14px",background:"#F3F4F6",color:"#374151",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Legenda</button>
        <button onClick={exportCSV} style={{padding:"8px 14px",background:"white",color:"#374151",border:"1.5px solid #D1D5DB",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>CSV</button>
        <button onClick={function(){setEditing({data:new Date().toISOString().split("T")[0],cliente:"",sede:"",nc:"",lavoro:"",resp:user.ruolo==="dipendente"?user.nome:"",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:user.nome,uBy:"",uAt:""});}} style={{padding:"8px 14px",background:"#1F4E79",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Nuova</button>
      </div>
      <div style={{background:"white",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
        <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,tableLayout:"fixed"}}>
          <colgroup>
            <col style={{width:"75px"}}/>
            <col style={{width:"180px"}}/>
            <col style={{width:"100px"}}/>
            <col style={{width:"200px"}}/>
            <col style={{width:"70px"}}/>
            <col style={{width:"110px"}}/>
            <col style={{width:"80px"}}/>
            <col style={{width:"140px"}}/>
            <col style={{width:"70px"}}/>
            <col style={{width:"110px"}}/>
          </colgroup>
          <thead><tr style={{background:"#1F4E79"}}>{["Data","Cliente","Sede","Lavoro","Resp.","Stato","Progr.","Alert","Modif.","Azioni"].map(function(h){return <th key={h} style={{padding:"10px 8px",textAlign:"left",color:"white",fontWeight:700,fontSize:9,textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>;})}</tr></thead>
          <tbody>{filtered.map(function(r,i){var stato=getStato(r);var alrt=getAlert(r);var prog=getProg(r);
            return <tr key={r.id} style={{background:i%2===0?"white":"#EDF4FC",borderBottom:"1px solid #E5E7EB"}}>
              <td style={{padding:"9px 8px",whiteSpace:"nowrap",fontSize:11}}>{fDate(r.data)}</td>
              <td style={{padding:"9px 8px",fontWeight:600,color:"#1F4E79",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.cliente}</td>
              <td style={{padding:"9px 8px",color:"#6B7280",fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.sede}</td>
              <td style={{padding:"9px 8px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:11}}>{r.lavoro}</td>
              <td style={{padding:"9px 8px",fontWeight:600,color:"#2E75B6",fontSize:10}}>{r.resp}</td>
              <td style={{padding:"9px 8px"}}><StatoTag s={stato}/></td>
              <td style={{padding:"9px 8px"}}><Stars prog={prog}/></td>
              <td style={{padding:"9px 8px"}}><AlertTag a={alrt}/></td>
              <td style={{padding:"9px 8px",fontSize:9,color:"#9CA3AF",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.uBy||r.cBy||""}</td>
              <td style={{padding:"9px 8px",whiteSpace:"nowrap"}}>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={function(){setEditing(Object.assign({},r));}} style={{background:"#F3F4F6",border:"none",borderRadius:5,padding:"5px 7px",cursor:"pointer",display:"flex",alignItems:"center",color:"#374151"}} title="Modifica"><IconEdit/></button>
                  <button onClick={function(){sendEmail(r);}} style={{background:"#EDE9FE",border:"none",borderRadius:5,padding:"5px 7px",cursor:"pointer",display:"flex",alignItems:"center",color:"#6D28D9"}} title="Invia email"><IconMail/></button>
                  {isAdmin&&<button onClick={function(e){e.stopPropagation();doDelete(r.id);}} style={{background:"#FEE2E2",border:"none",borderRadius:5,padding:"5px 7px",cursor:"pointer",display:"flex",alignItems:"center",color:"#C62828"}} title="Elimina"><IconTrash/></button>}
                </div>
              </td>
            </tr>;})}
            {filtered.length===0&&<tr><td colSpan={10} style={{padding:30,textAlign:"center",color:"#9CA3AF"}}>Nessuna attivita</td></tr>}
          </tbody>
        </table></div>
        <div style={{padding:"8px 14px",borderTop:"1px solid #E5E7EB",color:"#9CA3AF",fontSize:11}}>{filtered.length} attivita - {user.nome}</div>
      </div>
    </div>}

    </div>
    {editing&&<EditForm row={editing} onSave={doSave} onClose={function(){setEditing(null);}} isAdmin={isAdmin} users={users}/>}
    {showSettings&&<AdminSettings users={users} onSaveUsers={saveUsers} logs={logs} onClose={function(){setShowSettings(false);}}/>}
    {showLegenda&&<LegendaModal onClose={function(){setShowLegenda(false);}}/>}
    </div>
  );
}

function LoginPage({ users, onLogin }) {
  var [u,setU] = useState("");
  var [p,setP] = useState("");
  var [err,setErr] = useState("");
  function go(){var usr=users[u.toLowerCase().trim()];if(usr&&usr.password===p){onLogin(Object.assign({username:u.toLowerCase().trim()},usr));}else{setErr("Credenziali non valide");}}
  var inp = {padding:"12px 14px",border:"1.5px solid #D1D5DB",borderRadius:8,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"};
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0A1628,#1F4E79,#2E75B6)",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"white",borderRadius:18,padding:"44px 36px",width:370,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:30}}>
          <div style={{width:60,height:60,background:"linear-gradient(135deg,#1F4E79,#2E75B6)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:18,color:"white",fontWeight:800,letterSpacing:1}}>AQS</div>
          <h1 style={{fontSize:22,fontWeight:800,color:"#1F4E79",margin:0}}>AQS Italia</h1>
          <p style={{color:"#9CA3AF",fontSize:13,marginTop:4}}>Gestione Commesse e Fatturazione</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input value={u} onChange={function(e){setU(e.target.value);setErr("");}} placeholder="Username" onKeyDown={function(e){if(e.key==="Enter")go();}} style={inp}/>
          <input value={p} onChange={function(e){setP(e.target.value);setErr("");}} placeholder="Password" type="password" onKeyDown={function(e){if(e.key==="Enter")go();}} style={inp}/>
          {err&&<div style={{color:"#C62828",fontSize:12,textAlign:"center"}}>{err}</div>}
          <button onClick={go} style={{padding:"13px",background:"linear-gradient(135deg,#1F4E79,#2E75B6)",color:"white",border:"none",borderRadius:8,fontSize:15,fontWeight:700,cursor:"pointer",marginTop:4}}>Accedi</button>
        </div>
        <div style={{marginTop:24,padding:"12px 14px",background:"#F8FAFC",borderRadius:8,fontSize:11,color:"#6B7280"}}>
          <b style={{color:"#1F4E79"}}>Demo:</b> admin / admin2026
        </div>
      </div>
    </div>
  );
}
