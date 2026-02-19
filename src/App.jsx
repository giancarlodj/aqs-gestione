import { useState, useEffect, useMemo } from "react";

var TIPOLOGIE = ["Formazione extra contratto","Sicurezza odontoiatria","Sicurezza sanitario","Sicurezza veterinaria","Sicurezza altro","Medicina del lavoro","Autorizzazione sanitaria","Altre attivita"];


function getStato(r) {
  if (!r.data) return "";
  if (r.nf) return "NO FATT.";
  if (r.df) return "FATTURATO";
  if (r.dc) return "DA FATTURARE";
  return "IN ATTESA";
}

function getAlert(r) {
  if (!r.data || r.df) return "";
  if (r.dc && !r.df) return "SALDO";
  if (r.nc === "SI" && !r.dfa) return "ANTICIPO";
  return "";
}

function getProg(r) {
  if (!r.data) return { n: 0, colors: [] };
  if (r.nf) return { n: 4, colors: ["#9E9E9E","#9E9E9E","#9E9E9E","#9E9E9E"], label: "Non fatturabile" };
  if (r.df) return { n: 4, colors: ["#2E7D32","#2E7D32","#2E7D32","#2E7D32"], label: "Fatturato" };
  if (r.dc) return { n: 3, colors: ["#EF6C00","#EF6C00","#EF6C00"], label: "Completo - pronto saldo" };
  if (r.nc === "SI" && r.dfa) return { n: 2, colors: ["#EF6C00","#EF6C00"], label: "Anticipo fatturato" };
  if (r.nc === "SI") return { n: 2, colors: ["#C62828","#C62828"], label: "Anticipo da fare" };
  return { n: 1, colors: ["#C62828"], label: "Inserito" };
}

function fDate(d) {
  if (!d) return "";
  try { var dt = new Date(d); if (isNaN(dt.getTime())) return d; return String(dt.getDate()).padStart(2,"0") + "/" + String(dt.getMonth()+1).padStart(2,"0") + "/" + dt.getFullYear(); }
  catch(e) { return d; }
}

function timeNow() { return new Date().toISOString().slice(0,16).replace("T"," "); }
function todayStr() { return new Date().toISOString().split("T")[0]; }

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
function IconSearch() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
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
  var m = {"FATTURATO":{bg:"#C8E6C9",c:"#2E7D32"},"DA FATTURARE":{bg:"#FFCDD2",c:"#C62828"},"IN ATTESA":{bg:"#FFE0B2",c:"#E65100"},"NO FATT.":{bg:"#E0E0E0",c:"#616161"}};
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
        {data.map(function(d,i){var a=(d.v/total)*360,sa=cum;cum+=a;if(a<0.5)return null;return <path key={i} d={mp(sa,sa+a-0.5)} fill={d.col}/>;})}
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
      <div onClick={function(e){e.stopPropagation();}} style={{background:"white",borderRadius:16,padding:28,width:wide?750:560,maxHeight:"88vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.25)"}}>{children}</div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel}>
      <h3 style={{margin:"0 0 16px",color:"#1F4E79",fontWeight:800}}>Conferma</h3>
      <p style={{fontSize:14,color:"#374151",margin:"0 0 20px"}}>{message}</p>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
        <button onClick={onCancel} style={{padding:"10px 24px",background:"#F3F4F6",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600}}>Annulla</button>
        <button onClick={onConfirm} style={{padding:"10px 24px",background:"#C62828",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700}}>Elimina</button>
      </div>
    </Modal>
  );
}

function EditForm({ row, onSave, onClose, isAdmin, users, allRows }) {
  var _r = Object.assign({}, row);
  if (!_r.tipo) _r.tipo = "";
  var [f, setF] = useState(_r);
  function set(k,v) { setF(function(p){ return Object.assign({},p,{[k]:v}); }); }
  var inp = {padding:"10px 12px",border:"1.5px solid #D1D5DB",borderRadius:8,fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"};
  var lbl = {fontSize:10,fontWeight:700,color:"#6B7280",marginBottom:3,display:"block",textTransform:"uppercase"};
  var resps = [];
  Object.values(users).forEach(function(u){if(u.ruolo==="dipendente"&&resps.indexOf(u.nome)===-1)resps.push(u.nome);});
  if(allRows) allRows.forEach(function(r){if(r.resp&&resps.indexOf(r.resp)===-1)resps.push(r.resp);});
  if(row && row.resp && resps.indexOf(row.resp)===-1) resps.push(row.resp);
  return (
    <Modal onClose={onClose}>
      <h2 style={{margin:"0 0 20px",fontSize:18,fontWeight:800,color:"#1F4E79"}}>{row.id?"Modifica":"Nuova Attivita"}</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div><label style={lbl}>Data inserimento</label><input type="date" value={f.data} onChange={function(e){set("data",e.target.value);}} style={inp}/></div>
        <div><label style={lbl}>Nuovo contratto</label><select value={f.nc} onChange={function(e){set("nc",e.target.value);}} style={inp}><option value="">--</option><option>SI</option><option>NO</option></select></div>
        <div style={{gridColumn:"1/-1"}}><label style={lbl}>Ragione Sociale completa</label><input value={f.cliente} onChange={function(e){set("cliente",e.target.value);}} placeholder="Nome cliente..." style={inp}/></div>
        <div><label style={lbl}>Sede</label><input value={f.sede} onChange={function(e){set("sede",e.target.value);}} style={inp}/></div>
        <div><label style={lbl}>Tipologia Attivita</label><select value={f.tipo||""} onChange={function(e){set("tipo",e.target.value);}} style={inp}><option value="">-- Seleziona --</option>{TIPOLOGIE.map(function(t){return <option key={t} value={t}>{t}</option>;})}</select></div>
        <div><label style={lbl}>Responsabile</label><input list="resp-list" value={f.resp} onChange={function(e){set("resp",e.target.value.toUpperCase());}} placeholder="Seleziona o scrivi nome..." style={inp}/><datalist id="resp-list">{resps.map(function(r){return <option key={r} value={r}/>;})}</datalist></div>
        <div style={{gridColumn:"1/-1"}}><label style={lbl}>Lavoro da svolgere</label><textarea value={f.lavoro} onChange={function(e){set("lavoro",e.target.value);}} rows={2} style={Object.assign({},inp,{resize:"vertical"})}/></div>
        <div><label style={lbl}>Data completamento</label><input type="date" value={f.dc} onChange={function(e){set("dc",e.target.value);}} style={inp}/></div>
        <div style={{gridColumn:"1/-1"}}><label style={lbl}>Note</label><textarea value={f.note} onChange={function(e){set("note",e.target.value);}} rows={2} style={Object.assign({},inp,{resize:"vertical"})}/></div>
        {isAdmin && <div><label style={lbl}>Data fatt. anticipo</label><input type="date" value={f.dfa} onChange={function(e){set("dfa",e.target.value);}} style={inp}/></div>}
        {isAdmin && <div><label style={lbl}>Data fattura saldo</label><input type="date" value={f.df} onChange={function(e){set("df",e.target.value);}} style={inp}/></div>}
      </div>
      <div style={{display:"flex",gap:10,marginTop:20,justifyContent:"flex-end"}}>
        <button onClick={onClose} style={{padding:"10px 24px",background:"#F3F4F6",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600}}>Annulla</button>
        <button onClick={function(){if(!f.data||!f.cliente){return;}onSave(f);}} style={{padding:"10px 24px",background:"#1F4E79",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontWeight:700,opacity:(!f.data||!f.cliente)?0.5:1}}>Salva</button>
      </div>
    </Modal>
  );
}

function AdminSettings({ users, onSaveUsers, logs, onClose }) {
  var [tab, setTab] = useState("utenti");
  var [uList, setUList] = useState(Object.entries(users).map(function(e){return Object.assign({username:e[0]},e[1]);}));
  var [nu, setNu] = useState({username:"",password:"",nome:"",ruolo:"dipendente"});
  var inp = {padding:"8px 10px",border:"1px solid #D1D5DB",borderRadius:6,fontSize:12,outline:"none",boxSizing:"border-box"};

  function saveAll(){var obj={};uList.forEach(function(u){obj[u.username]={password:u.password,nome:u.nome,ruolo:u.ruolo};});onSaveUsers(obj);}
  function addUser(){
    if(!nu.username||!nu.password||!nu.nome){return;}
    if(uList.find(function(u){return u.username===nu.username.toLowerCase();})){return;}
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
        <h3 style={{color:"#1F4E79"}}>AQS Italia - Gestione Commesse v3.0</h3>
        <p>Login multi-utente con ruoli admin e dipendente</p>
        <p>Dashboard statistiche in tempo reale</p>
        <p>Progressi con indicatori colorati CSS</p>
        <p>Alert automatici anticipo e fatturazione</p>
        <p>Checkbox visto anticipo e saldo (solo admin)</p>
        <p>Tipologia attivita con menu a scelta rapida</p>
        <p>Colonna Note visibile in tabella</p>
        <p>Ordinamento colonne e ricerca avanzata</p>
        <p>Log completo modifiche per utente</p>
        <p>Esportazione CSV e invio email</p>
        <p>Gestione utenti (solo admin)</p>
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

function CheckboxVisto({ checked, date, disabled, onToggle, color, hideDate }) {
  var bg = disabled ? "#F3F4F6" : checked ? (color==="gray"?"#E0E0E0":"#C8E6C9") : (color === "red" ? "#FFCDD2" : color === "blue" ? "#E3F2FD" : color === "gray" ? "#F5F5F5" : "#FFF8E1");
  var border = disabled ? "#D1D5DB" : checked ? (color==="gray"?"#757575":"#2E7D32") : (color === "red" ? "#C62828" : color === "blue" ? "#1565C0" : color === "gray" ? "#9E9E9E" : "#E65100");
  return (
    <div style={{display:"flex",alignItems:"center",gap:3}}>
      <div onClick={disabled ? undefined : onToggle} style={{
        width:18,height:18,borderRadius:4,border:"2px solid "+border,background:bg,
        cursor:disabled?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",
        opacity:disabled?0.4:1
      }}>
        {checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color==="gray"?"#757575":"#2E7D32"} strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>}
      </div>
      {checked && date && !hideDate && <span style={{fontSize:8,color:"#6B7280",whiteSpace:"nowrap"}}>{fDate(date)}</span>}
    </div>
  );
}

var SUPABASE_URL = "https://afqxzhrjuqmtbnwvjmvb.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmcXh6aHJqdXFtdGJud3ZqbXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0OTM3NTYsImV4cCI6MjA4NzA2OTc1Nn0.36AziZSlTxgSXC8ldl0yGpfarLTf9ntI0T_8KozR3ZY";

function sb(table) {
  return {
    select: function(orderCol) {
      var ord = orderCol ? "&order=" + orderCol + ".asc" : "";
      return fetch(SUPABASE_URL + "/rest/v1/" + table + "?select=*" + ord, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY }
      }).then(function(r) { return r.json(); });
    },
    insert: function(data) {
      return fetch(SUPABASE_URL + "/rest/v1/" + table, {
        method: "POST",
        headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY, "Content-Type": "application/json", "Prefer": "return=representation" },
        body: JSON.stringify(data)
      }).then(function(r) { return r.json(); });
    },
    update: function(id, data) {
      return fetch(SUPABASE_URL + "/rest/v1/" + table + "?id=eq." + id, {
        method: "PATCH",
        headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY, "Content-Type": "application/json", "Prefer": "return=representation" },
        body: JSON.stringify(data)
      }).then(function(r) { return r.json(); });
    },
    del: function(id) {
      return fetch(SUPABASE_URL + "/rest/v1/" + table + "?id=eq." + id, {
        method: "DELETE",
        headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY }
      });
    }
  };
}

function dbToRow(r) {
  return { id:r.id, data:r.data||"", cliente:r.cliente||"", sede:r.sede||"", nc:r.nc||"", tipo:r.tipo||"", lavoro:r.lavoro||"", resp:r.resp||"", dc:r.dc||"", fatt:r.fatt||"", note:r.note||"", dfa:r.dfa||"", df:r.df||"", nf:r.nf||"", cBy:r.cby||"", uBy:r.uby||"", uAt:r.uat||"" };
}

function rowToDb(r) {
  return { data:r.data||"", cliente:r.cliente||"", sede:r.sede||"", nc:r.nc||"", tipo:r.tipo||"", lavoro:r.lavoro||"", resp:r.resp||"", dc:r.dc||"", fatt:r.fatt||"", note:r.note||"", dfa:r.dfa||"", df:r.df||"", nf:r.nf||"", cby:r.cBy||"", uby:r.uBy||"", uat:r.uAt||"" };
}

export default function App() {
  var [user, setUser] = useState(null);
  var [rows, setRows] = useState([]);
  var [users, setUsers] = useState({});
  var [logs, setLogs] = useState([]);
  var [loading, setLoading] = useState(true);
  var [view, setView] = useState("dashboard");
  var [editing, setEditing] = useState(null);
  var [filter, setFilter] = useState("TUTTI");
  var [search, setSearch] = useState("");
  var [showSettings, setShowSettings] = useState(false);
  var [showLegenda, setShowLegenda] = useState(false);
  var [confirmDel, setConfirmDel] = useState(null);
  var [sortCol, setSortCol] = useState("data");
  var [sortDir, setSortDir] = useState("desc");

  function loadAll() {
    Promise.all([sb("commesse").select("id"), sb("utenti").select(), sb("logs").select("id")]).then(function(res) {
      if (Array.isArray(res[0])) setRows(res[0].map(dbToRow));
      if (Array.isArray(res[1])) {
        var uObj = {};
        res[1].forEach(function(u) { uObj[u.username] = { password: u.password, nome: u.nome, ruolo: u.ruolo }; });
        setUsers(uObj);
      }
      if (Array.isArray(res[2])) setLogs(res[2].map(function(l) { return { when: l["when"], who: l.who, action: l.action, detail: l.detail }; }));
      setLoading(false);
    }).catch(function(e) { console.log("load error", e); setLoading(false); });
  }

  useEffect(function() {
    loadAll();
    var interval = setInterval(function() { loadAll(); }, 30000);
    return function() { clearInterval(interval); };
  }, []);

  function addLog(who, action, detail) {
    var entry = { "when": timeNow(), who: who, action: action, detail: detail || "" };
    setLogs(function(prev) { return prev.concat([entry]); });
    sb("logs").insert(entry);
  }

  var stats = useMemo(function(){
    var f=rows.filter(function(r){return r.data;});
    var fat=f.filter(function(r){return getStato(r)==="FATTURATO";}).length;
    var df=f.filter(function(r){return getStato(r)==="DA FATTURARE";}).length;
    var att=f.filter(function(r){return getStato(r)==="IN ATTESA";}).length;
    var tot=f.length,pct=tot?Math.round(fat/tot*100):0;
    var byR={};f.forEach(function(r){var k=r.resp||"N/A";if(!byR[k])byR[k]={t:0,f:0,d:0,a:0};byR[k].t++;var s=getStato(r);if(s==="FATTURATO")byR[k].f++;else if(s==="DA FATTURARE")byR[k].d++;else byR[k].a++;});
    var byT={};f.forEach(function(r){var k=r.tipo||"Non classificato";if(!byT[k])byT[k]={t:0,f:0,d:0,a:0};byT[k].t++;var s=getStato(r);if(s==="FATTURATO")byT[k].f++;else if(s==="DA FATTURARE")byT[k].d++;else byT[k].a++;});
    var compl=f.filter(function(r){return r.dc;}).length;
    var antic=f.filter(function(r){return r.dfa;}).length;
    var saldo=f.filter(function(r){return r.df;}).length;
    var alc=f.filter(function(r){return getAlert(r);}).length;
    // Ritardi: non completate, piu vecchie di 30 giorni
    var today=new Date();
    var ritardi=f.filter(function(r){
      if(r.df||r.dc) return false;
      var d=new Date(r.data);
      return (today-d)/(1000*60*60*24)>30;
    }).sort(function(a,b){return new Date(a.data)-new Date(b.data);});
    // Tempo medio completamento (giorni)
    var completati=f.filter(function(r){return r.data&&r.dc;});
    var tempoMedio=0;
    if(completati.length>0){
      var somma=completati.reduce(function(acc,r){var diff=(new Date(r.dc)-new Date(r.data))/(1000*60*60*24);return acc+(diff>0?diff:0);},0);
      tempoMedio=Math.round(somma/completati.length);
    }
    // Tempo medio fatturazione (giorni)
    var fatturati=f.filter(function(r){return r.data&&r.df;});
    var tempoFatt=0;
    if(fatturati.length>0){
      var sommaF=fatturati.reduce(function(acc,r){var diff=(new Date(r.df)-new Date(r.data))/(1000*60*60*24);return acc+(diff>0?diff:0);},0);
      tempoFatt=Math.round(sommaF/fatturati.length);
    }
    // Trend mensile (ultimi 6 mesi)
    var byM={};f.forEach(function(r){if(!r.data)return;var m=r.data.slice(0,7);if(!byM[m])byM[m]={t:0,f:0};byM[m].t++;if(getStato(r)==="FATTURATO")byM[m].f++;});
    var mesi=Object.keys(byM).sort().slice(-6);
    var byMese=mesi.map(function(m){return {mese:m,t:byM[m].t,f:byM[m].f};});
    return {tot:tot,fat:fat,df:df,att:att,nv:f.filter(function(r){return r.nc==="SI";}).length,pct:pct,byR:byR,byT:byT,compl:compl,antic:antic,saldo:saldo,alc:alc,ritardi:ritardi,tempoMedio:tempoMedio,tempoFatt:tempoFatt,byMese:byMese};
  },[rows]);

  var filtered = useMemo(function(){
    var r=rows.filter(function(x){return x.data;});
    if(user&&user.ruolo==="dipendente") r=r.filter(function(x){return x.resp===user.nome;});
    if(filter==="DA FATTURARE") r=r.filter(function(x){return getStato(x)==="DA FATTURARE";});
    else if(filter==="IN ATTESA") r=r.filter(function(x){return getStato(x)==="IN ATTESA";});
    else if(filter==="FATTURATO") r=r.filter(function(x){return getStato(x)==="FATTURATO";});
    else if(filter==="ALERT") r=r.filter(function(x){return getAlert(x);});
    if(search){var s=search.toLowerCase();r=r.filter(function(x){return [x.cliente,x.lavoro,x.sede,x.resp,x.note,x.tipo||""].some(function(v){return (v||"").toLowerCase().indexOf(s)>=0;});});}
    r.sort(function(a,b){
      var va,vb;
      if(sortCol==="cliente"){va=(a.cliente||"").toLowerCase();vb=(b.cliente||"").toLowerCase();}
      else if(sortCol==="tipo"){va=(a.tipo||"").toLowerCase();vb=(b.tipo||"").toLowerCase();}
      else if(sortCol==="resp"){va=(a.resp||"").toLowerCase();vb=(b.resp||"").toLowerCase();}
      else if(sortCol==="stato"){va=getStato(a);vb=getStato(b);}
      else{va=a.data||"";vb=b.data||"";}
      if(va<vb) return sortDir==="asc"?-1:1;
      if(va>vb) return sortDir==="asc"?1:-1;
      return 0;
    });
    return r;
  },[rows,user,filter,search,sortCol,sortDir]);

  function toggleSort(col){
    if(sortCol===col){setSortDir(sortDir==="asc"?"desc":"asc");}
    else{setSortCol(col);setSortDir("asc");}
  }

  function doSave(form){
    if(form.id){
      form.uBy=user.nome;form.uAt=timeNow();
      sb("commesse").update(form.id, rowToDb(form)).then(function(){ loadAll(); });
      setRows(rows.map(function(r){return r.id===form.id?form:r;}));
      addLog(user.nome,"MODIFICATO",form.cliente);
    } else {
      var dbData = rowToDb(form); dbData.cby = user.nome;
      sb("commesse").insert(dbData).then(function(res){
        if(Array.isArray(res)&&res[0]) { loadAll(); }
      });
      addLog(user.nome,"CREATO",form.cliente);
    }
    setEditing(null);
  }
  function doDelete(id){
    var r=rows.find(function(x){return x.id===id;});
    if(!r) return;
    setConfirmDel(r);
  }
  function confirmDelete(){
    if(!confirmDel) return;
    sb("commesse").del(confirmDel.id).then(function(){ loadAll(); });
    setRows(rows.filter(function(x){return x.id!==confirmDel.id;}));
    addLog(user.nome,"ELIMINATO",confirmDel.cliente);
    setConfirmDel(null);
  }
  function toggleAnticipo(r){
    var newVal=r.dfa?"":todayStr();
    var updated=Object.assign({},r,{dfa:newVal,uBy:user.nome,uAt:timeNow()});
    sb("commesse").update(r.id, rowToDb(updated)).then(function(){ loadAll(); });
    setRows(rows.map(function(x){return x.id===r.id?updated:x;}));
    addLog(user.nome,newVal?"VISTO ANTICIPO":"RIMOSSO ANTICIPO",r.cliente);
  }
  function toggleSaldo(r){
    var newVal=r.df?"":todayStr();
    var updated=Object.assign({},r,{df:newVal,uBy:user.nome,uAt:timeNow()});
    sb("commesse").update(r.id, rowToDb(updated)).then(function(){ loadAll(); });
    setRows(rows.map(function(x){return x.id===r.id?updated:x;}));
    addLog(user.nome,newVal?"VISTO SALDO":"RIMOSSO SALDO",r.cliente);
  }
  function toggleCompleto(r){
    var newVal=r.dc?"":todayStr();
    var updated=Object.assign({},r,{dc:newVal,uBy:user.nome,uAt:timeNow()});
    sb("commesse").update(r.id, rowToDb(updated)).then(function(){ loadAll(); });
    setRows(rows.map(function(x){return x.id===r.id?updated:x;}));
    addLog(user.nome,newVal?"COMPLETATO":"RIMOSSO COMPLETAMENTO",r.cliente);
  }
  function toggleNoFatt(r){
    var newVal=r.nf?"":"SI";
    var updated=Object.assign({},r,{nf:newVal,uBy:user.nome,uAt:timeNow()});
    sb("commesse").update(r.id, rowToDb(updated)).then(function(){ loadAll(); });
    setRows(rows.map(function(x){return x.id===r.id?updated:x;}));
    addLog(user.nome,newVal?"NO FATTURAZIONE":"RIMOSSO NO FATTURAZIONE",r.cliente);
  }
  function saveUsers(nu){
    setUsers(nu);
    var promises = Object.entries(nu).map(function(e) {
      return fetch(SUPABASE_URL + "/rest/v1/utenti?username=eq." + encodeURIComponent(e[0]), {
        method: "PATCH",
        headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY, "Content-Type": "application/json", "Prefer": "return=representation" },
        body: JSON.stringify({ password: e[1].password, nome: e[1].nome, ruolo: e[1].ruolo })
      }).then(function(r) { return r.json(); }).then(function(res) {
        if (!Array.isArray(res) || res.length === 0) {
          return sb("utenti").insert({ username: e[0], password: e[1].password, nome: e[1].nome, ruolo: e[1].ruolo });
        }
      });
    });
    Promise.all(promises).then(function(){ loadAll(); });
  }
  function sendEmail(row){var stato=getStato(row);var subj=encodeURIComponent("[FATT] "+stato+" - "+row.cliente);var body="Cliente: "+row.cliente+"\nSede: "+row.sede+"\nLavoro: "+row.lavoro+"\nResp: "+row.resp+"\nStato: "+stato+(row.note?"\nNote: "+row.note:"")+"\n\nCordiali saluti";window.open("mailto:amministrazione@aqsitalia.it?subject="+subj+"&body="+encodeURIComponent(body));}
  function exportCSV(){var h=["Data","Cliente","Sede","Contratto","Tipologia","Lavoro","Resp","Completamento","Fatturabile","Note","Anticipo","Fattura","Stato","Creato","Modificato"];var csv=[h.join(";")];filtered.forEach(function(r){csv.push([fDate(r.data),r.cliente,r.sede,r.nc,r.tipo||"",(r.lavoro||"").replace(/;/g,","),r.resp,fDate(r.dc),r.dc?"SI":"NO",(r.note||"").replace(/;/g,","),fDate(r.dfa),fDate(r.df),getStato(r),r.cBy||"",r.uBy||""].join(";"));});var blob=new Blob(["\ufeff"+csv.join("\n")],{type:"text/csv;charset=utf-8"});var url=URL.createObjectURL(blob);var a=document.createElement("a");a.href=url;a.download="commesse_aqs.csv";a.click();}

  if(loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0A1628,#1F4E79,#2E75B6)",fontFamily:"system-ui,sans-serif"}}>
      <div style={{textAlign:"center",color:"white"}}>
        <div style={{width:64,height:64,background:"rgba(255,255,255,0.12)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
        </div>
        <div style={{fontSize:16,fontWeight:700}}>Caricamento...</div>
      </div>
    </div>
  );

  if(!user) return <LoginPage users={users} onLogin={function(u){setUser(u);addLog(u.nome,"LOGIN","Accesso");}}/>;

  var isAdmin = user.ruolo==="admin";

  var sortArrow = function(col){
    if(sortCol!==col) return <span style={{opacity:0.3,fontSize:8,marginLeft:2}}>^</span>;
    return <span style={{fontSize:8,marginLeft:2}}>{sortDir==="asc"?"^":"v"}</span>;
  };

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
        <button onClick={function(){addLog(user.nome,"LOGOUT","");setUser(null);}} style={{padding:"6px 12px",background:"transparent",color:"rgba(255,255,255,0.6)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,fontSize:10,cursor:"pointer"}}>Esci</button>
      </div>
    </div>

    <div style={{padding:"20px 24px",maxWidth:1600,margin:"0 auto"}}>

    {view==="dashboard"&&<div>
      {/* RIGA 1: KPI Principali */}
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        {[["Totale",stats.tot,"#1F4E79"],["Da fatturare",stats.df,"#C62828"],["In attesa",stats.att,"#E65100"],["Fatturato",stats.fat,"#2E7D32"],["% Fatturato",stats.pct+"%","#1F4E79"],["Nuovi contratti",stats.nv,"#2E75B6"]].map(function(item){
          return <div key={item[0]} style={{background:"white",borderRadius:12,padding:"14px 18px",flex:1,minWidth:110,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:9,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase"}}>{item[0]}</div>
            <div style={{fontSize:26,fontWeight:800,color:item[2],marginTop:2}}>{item[1]}</div>
          </div>;
        })}
      </div>
      {/* RIGA 2: KPI Tempi e Performance */}
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        {[
          ["Tempo medio compl.",stats.tempoMedio+" gg","#1565C0","Dalla creazione al completamento"],
          ["Tempo medio fatt.",stats.tempoFatt+" gg","#6A1B9A","Dalla creazione alla fatturazione"],
          ["In ritardo (>30gg)",stats.ritardi.length,"#C62828","Attivita non completate oltre 30 giorni"],
          ["Alert attivi",stats.alc,"#E65100","Azioni richieste"]
        ].map(function(item){
          return <div key={item[0]} style={{background:"white",borderRadius:12,padding:"14px 18px",flex:1,minWidth:140,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:9,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase"}}>{item[0]}</div>
            <div style={{fontSize:26,fontWeight:800,color:item[2],marginTop:2}}>{item[1]}</div>
            <div style={{fontSize:9,color:"#9CA3AF",marginTop:2}}>{item[3]}</div>
          </div>;
        })}
      </div>
      {/* RIGA 3: Grafici Stato + Responsabile */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:"white",borderRadius:14,padding:22}}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#1F4E79"}}>Stato Commesse</h3><Pie data={[{label:"Da fatturare",v:stats.df,col:"#E57373"},{label:"In attesa",v:stats.att,col:"#FFB74D"},{label:"Fatturato",v:stats.fat,col:"#81C784"}]}/></div>
        <div style={{background:"white",borderRadius:14,padding:22}}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#1F4E79"}}>Per Responsabile</h3>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"2px solid #E5E7EB"}}>{["Nome","Tot","Da f.","Att.","Fatt","%"].map(function(h){return <th key={h} style={{padding:"6px",textAlign:"left",color:"#9CA3AF",fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{h}</th>;})}</tr></thead>
          <tbody>{Object.entries(stats.byR).sort(function(a,b){return b[1].t-a[1].t;}).map(function(entry){var n=entry[0],s=entry[1];return <tr key={n} style={{borderBottom:"1px solid #F3F4F6"}}><td style={{padding:"6px",fontWeight:700,color:"#1F4E79"}}>{n}</td><td style={{padding:"6px",fontWeight:700}}>{s.t}</td><td style={{padding:"6px",color:"#C62828"}}>{s.d}</td><td style={{padding:"6px",color:"#E65100"}}>{s.a}</td><td style={{padding:"6px",color:"#2E7D32"}}>{s.f}</td><td style={{padding:"6px",fontWeight:700}}>{s.t?Math.round(s.f/s.t*100):0}%</td></tr>;})}</tbody>
        </table></div>
      </div>
      {/* RIGA 4: Tipologia + Avanzamento */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:"white",borderRadius:14,padding:22}}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#1F4E79"}}>Per Tipologia</h3>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:"2px solid #E5E7EB"}}>{["Tipologia","Tot","Da f.","Att.","Fatt","%"].map(function(h){return <th key={h} style={{padding:"6px",textAlign:"left",color:"#9CA3AF",fontSize:9,fontWeight:700,textTransform:"uppercase"}}>{h}</th>;})}</tr></thead>
          <tbody>{Object.entries(stats.byT).sort(function(a,b){return b[1].t-a[1].t;}).map(function(entry){var n=entry[0],s=entry[1];return <tr key={n} style={{borderBottom:"1px solid #F3F4F6"}}><td style={{padding:"6px",fontWeight:600,color:"#1F4E79",fontSize:11}}>{n}</td><td style={{padding:"6px",fontWeight:700}}>{s.t}</td><td style={{padding:"6px",color:"#C62828"}}>{s.d}</td><td style={{padding:"6px",color:"#E65100"}}>{s.a}</td><td style={{padding:"6px",color:"#2E7D32"}}>{s.f}</td><td style={{padding:"6px",fontWeight:700}}>{s.t?Math.round(s.f/s.t*100):0}%</td></tr>;})}</tbody>
        </table></div>
        <div style={{background:"white",borderRadius:14,padding:22}}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#1F4E79"}}>Avanzamento Fatturazione</h3>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {[["Completati",stats.compl,stats.tot,"#1565C0"],["Anticipi emessi",stats.antic,stats.nv||1,"#6A1B9A"],["Saldi emessi",stats.saldo,stats.tot,"#2E7D32"]].map(function(item){var pct=item[2]?Math.round(item[1]/item[2]*100):0;return <div key={item[0]}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,fontWeight:600,color:"#374151"}}>{item[0]}</span><span style={{fontSize:12,fontWeight:800,color:item[3]}}>{item[1]}/{item[2]} ({pct}%)</span></div>
            <div style={{background:"#F3F4F6",borderRadius:4,height:8}}><div style={{height:"100%",borderRadius:4,background:item[3],width:pct+"%",transition:"width 0.3s"}}/></div>
          </div>;})}
        </div></div>
      </div>
      {/* RIGA 5: Trend Mensile + Ritardi */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:"white",borderRadius:14,padding:22}}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#1F4E79"}}>Trend Mensile (ultimi 6 mesi)</h3>
        {stats.byMese.length>0?<div>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:140,marginBottom:12}}>
            {stats.byMese.map(function(m){var maxV=Math.max.apply(null,stats.byMese.map(function(x){return x.t;}))||1;var h1=Math.round((m.t/maxV)*120);var h2=Math.round((m.f/maxV)*120);return <div key={m.mese} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <div style={{fontSize:10,fontWeight:700,color:"#1F4E79"}}>{m.t}</div>
              <div style={{width:"100%",display:"flex",gap:2,alignItems:"flex-end",justifyContent:"center"}}>
                <div style={{width:"40%",height:h1,background:"#BBDEFB",borderRadius:"4px 4px 0 0"}}/>
                <div style={{width:"40%",height:h2,background:"#2E7D32",borderRadius:"4px 4px 0 0"}}/>
              </div>
            </div>;})}
          </div>
          <div style={{display:"flex",gap:8}}>
            {stats.byMese.map(function(m){var parts=m.mese.split("-");var nomiMesi=["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];return <div key={m.mese} style={{flex:1,textAlign:"center",fontSize:9,color:"#6B7280",fontWeight:600}}>{nomiMesi[parseInt(parts[1])-1]} {parts[0].slice(2)}</div>;})}
          </div>
          <div style={{display:"flex",gap:16,marginTop:12,justifyContent:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}><div style={{width:10,height:10,background:"#BBDEFB",borderRadius:2}}/> Totale</div>
            <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}><div style={{width:10,height:10,background:"#2E7D32",borderRadius:2}}/> Fatturato</div>
          </div>
        </div>:<div style={{color:"#9CA3AF",fontSize:12,textAlign:"center",padding:30}}>Nessun dato disponibile</div>}
        </div>
        <div style={{background:"white",borderRadius:14,padding:22}}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:"#C62828"}}>In Ritardo ({stats.ritardi.length})</h3>
        <div style={{fontSize:10,color:"#6B7280",marginBottom:10}}>Attivita non completate da oltre 30 giorni</div>
        {stats.ritardi.length>0?<div style={{maxHeight:200,overflow:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr style={{borderBottom:"2px solid #E5E7EB"}}>{["Data","Cliente","Resp.","Giorni"].map(function(h){return <th key={h} style={{padding:"5px",textAlign:"left",color:"#9CA3AF",fontSize:9,fontWeight:700,textTransform:"uppercase",position:"sticky",top:0,background:"white"}}>{h}</th>;})}</tr></thead>
            <tbody>{stats.ritardi.slice(0,15).map(function(r){var gg=Math.round((new Date()-new Date(r.data))/(1000*60*60*24));return <tr key={r.id} style={{borderBottom:"1px solid #F3F4F6",cursor:"pointer"}} onClick={function(){setView("lista");setSearch(r.cliente);}}>
              <td style={{padding:"5px",fontSize:10}}>{fDate(r.data)}</td>
              <td style={{padding:"5px",fontWeight:600,color:"#1F4E79"}}>{r.cliente}</td>
              <td style={{padding:"5px",color:"#6B7280"}}>{r.resp||"-"}</td>
              <td style={{padding:"5px",fontWeight:800,color:gg>90?"#C62828":gg>60?"#E65100":"#F57C00"}}>{gg}gg</td>
            </tr>;})}</tbody>
          </table>
          {stats.ritardi.length>15&&<div style={{textAlign:"center",padding:6,fontSize:10,color:"#9CA3AF"}}>...e altri {stats.ritardi.length-15}</div>}
        </div>:<div style={{color:"#2E7D32",fontSize:13,textAlign:"center",padding:30,fontWeight:600}}>Nessun ritardo</div>}
        </div>
      </div>
      {/* RIGA 6: Bottoni azione */}
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
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF"}}><IconSearch/></span>
          <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Cerca cliente, sede, lavoro, note..." style={{padding:"9px 14px 9px 30px",border:"1.5px solid #D1D5DB",borderRadius:8,fontSize:13,outline:"none",width:280,background:"white"}}/>
        </div>
        <div style={{display:"flex",background:"white",borderRadius:8,overflow:"hidden",border:"1.5px solid #D1D5DB"}}>
          {["TUTTI","DA FATTURARE","IN ATTESA","FATTURATO","ALERT"].map(function(f){
            var cnt=f==="ALERT"?stats.alc:f==="DA FATTURARE"?stats.df:f==="IN ATTESA"?stats.att:f==="FATTURATO"?stats.fat:stats.tot;
            return <button key={f} onClick={function(){setFilter(f);}} style={{padding:"7px 10px",background:filter===f?"#1F4E79":"transparent",color:filter===f?"white":"#6B7280",border:"none",fontSize:10,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{f} ({cnt})</button>;
          })}
        </div>
        <div style={{flex:1}}/>
        <button onClick={function(){setShowLegenda(true);}} style={{padding:"8px 14px",background:"#F3F4F6",color:"#374151",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>Legenda</button>
        <button onClick={exportCSV} style={{padding:"8px 14px",background:"white",color:"#374151",border:"1.5px solid #D1D5DB",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>CSV</button>
        <button onClick={function(){setEditing({data:todayStr(),cliente:"",sede:"",nc:"",tipo:"",lavoro:"",resp:user.ruolo==="dipendente"?user.nome:"",dc:"",fatt:"",note:"",dfa:"",df:"",cBy:user.nome,uBy:"",uAt:""});}} style={{padding:"8px 14px",background:"#1F4E79",color:"white",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Nuova</button>
      </div>
      <div style={{background:"white",borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
        <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,tableLayout:"fixed",minWidth:1880}}>
          <colgroup>
            <col style={{width:"68px"}}/>
            <col style={{width:"170px"}}/>
            <col style={{width:"76px"}}/>
            <col style={{width:"30px"}}/>
            <col style={{width:"86px"}}/>
            <col style={{width:"230px"}}/>
            <col style={{width:"54px"}}/>
            <col style={{width:"30px"}}/>
            <col style={{width:"70px"}}/>
            <col style={{width:"180px"}}/>
            <col style={{width:"70px"}}/>
            <col style={{width:"70px"}}/>
            <col style={{width:"34px"}}/>
            <col style={{width:"82px"}}/>
            <col style={{width:"62px"}}/>
            <col style={{width:"66px"}}/>
            <col style={{width:"66px"}}/>
            <col style={{width:"84px"}}/>
          </colgroup>
          <thead><tr style={{background:"#1F4E79"}}>
            {[
              {k:"data",l:"Data"},
              {k:"cliente",l:"Cliente"},
              {k:"sede",l:"Sede"},
              {k:"nc",l:"NC"},
              {k:"tipo",l:"Tipologia"},
              {k:"lavoro",l:"Lavoro"},
              {k:"resp",l:"Resp."},
              {k:"fatt",l:"Fatt."},
              {k:"compl",l:"Compl."},
              {k:"note",l:"Note"},
              {k:"dfa",l:"V.Antic."},
              {k:"dfs",l:"V.Saldo"},
              {k:"nf",l:"No.Fatt"},
              {k:"stato",l:"Stato"},
              {k:"prog",l:"Progr."},
              {k:"alert",l:"Alert"},
              {k:"mod",l:"Modif."},
              {k:"azioni",l:"Azioni"}
            ].map(function(h){
              var sortable=["data","cliente","tipo","resp","stato"].indexOf(h.k)>=0;
              return <th key={h.k} onClick={sortable?function(){toggleSort(h.k);}:undefined} style={{padding:"10px 6px",textAlign:"left",color:"white",fontWeight:700,fontSize:9,textTransform:"uppercase",whiteSpace:"nowrap",cursor:sortable?"pointer":"default",userSelect:"none"}}>{h.l}{sortable?sortArrow(h.k):null}</th>;
            })}
          </tr></thead>
          <tbody>{filtered.map(function(r,i){var stato=getStato(r);var alrt=getAlert(r);var prog=getProg(r);
            var hasNf = !!r.nf;
            var anticDisabled = r.nc !== "SI" || !!r.df || hasNf;
            var saldoDisabled = !r.dc || hasNf;
            var nfDisabled = !!r.df || !!r.dfa;
            return <tr key={r.id} style={{background:i%2===0?"white":"#EDF4FC",borderBottom:"1px solid #E5E7EB"}}>
              <td style={{padding:"8px 6px",whiteSpace:"nowrap",fontSize:10}}>{fDate(r.data)}</td>
              <td style={{padding:"8px 6px",fontWeight:600,color:"#1F4E79",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={r.cliente}>{r.cliente}</td>
              <td style={{padding:"8px 6px",color:"#6B7280",fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={r.sede}>{r.sede}</td>
              <td style={{padding:"8px 6px",fontSize:10,fontWeight:600,color:r.nc==="SI"?"#2E75B6":"#9CA3AF",textAlign:"center"}}>{r.nc}</td>
              <td style={{padding:"8px 6px",fontSize:9,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#6B7280"}} title={r.tipo}>{r.tipo||""}</td>
              <td style={{padding:"8px 6px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:10}} title={r.lavoro}>{r.lavoro}</td>
              <td style={{padding:"8px 6px",fontWeight:600,color:"#2E75B6",fontSize:10}}>{r.resp}</td>
              <td style={{padding:"8px 6px",textAlign:"center"}}>{r.dc?<div style={{width:12,height:12,borderRadius:"50%",background:"#2E7D32",margin:"0 auto"}} title="Fatturabile"/>:<div style={{width:12,height:12,borderRadius:"50%",background:"#E5E7EB",margin:"0 auto"}} title="Non fatturabile"/>}</td>
              <td style={{padding:"8px 4px"}}><CheckboxVisto checked={!!r.dc} date={r.dc} disabled={false} onToggle={function(){toggleCompleto(r);}} color="blue"/></td>
              <td style={{padding:"8px 6px",fontSize:9,color:"#6B7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={r.note}>{r.note}</td>
              <td style={{padding:"8px 4px"}}><CheckboxVisto checked={!!r.dfa} date={r.dfa} disabled={anticDisabled||!isAdmin} onToggle={function(){toggleAnticipo(r);}} color="red"/></td>
              <td style={{padding:"8px 4px"}}><CheckboxVisto checked={!!r.df} date={r.df} disabled={saldoDisabled||!isAdmin} onToggle={function(){toggleSaldo(r);}} color="orange"/></td>
              <td style={{padding:"8px 4px"}}><CheckboxVisto checked={hasNf} disabled={nfDisabled||!isAdmin} onToggle={function(){toggleNoFatt(r);}} color="gray" hideDate/></td>
              <td style={{padding:"8px 6px"}}><StatoTag s={stato}/></td>
              <td style={{padding:"8px 6px"}}><Stars prog={prog}/></td>
              <td style={{padding:"8px 6px"}}><AlertTag a={alrt}/></td>
              <td style={{padding:"8px 6px",fontSize:9,color:"#9CA3AF",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.uBy||r.cBy||""}</td>
              <td style={{padding:"8px 6px",whiteSpace:"nowrap"}}>
                <div style={{display:"flex",gap:3}}>
                  <button onClick={function(){setEditing(Object.assign({},r));}} style={{background:"#F3F4F6",border:"none",borderRadius:5,padding:"5px 6px",cursor:"pointer",display:"flex",alignItems:"center",color:"#374151"}} title="Modifica"><IconEdit/></button>
                  <button onClick={function(){sendEmail(r);}} style={{background:"#EDE9FE",border:"none",borderRadius:5,padding:"5px 6px",cursor:"pointer",display:"flex",alignItems:"center",color:"#6D28D9"}} title="Invia email"><IconMail/></button>
                  <button onClick={function(e){e.stopPropagation();doDelete(r.id);}} style={{background:"#FEE2E2",border:"none",borderRadius:5,padding:"5px 6px",cursor:"pointer",display:"flex",alignItems:"center",color:"#C62828"}} title="Elimina"><IconTrash/></button>
                </div>
              </td>
            </tr>;})}
            {filtered.length===0&&<tr><td colSpan={18} style={{padding:30,textAlign:"center",color:"#9CA3AF"}}>Nessuna attivita trovata</td></tr>}
          </tbody>
        </table></div>
        <div style={{padding:"8px 14px",borderTop:"1px solid #E5E7EB",color:"#9CA3AF",fontSize:11}}>{filtered.length} attivita - {user.nome}</div>
      </div>
    </div>}

    </div>
    {editing&&<EditForm row={editing} onSave={doSave} onClose={function(){setEditing(null);}} isAdmin={isAdmin} users={users} allRows={rows}/>}
    {showSettings&&<AdminSettings users={users} onSaveUsers={saveUsers} logs={logs} onClose={function(){setShowSettings(false);}}/>}
    {showLegenda&&<LegendaModal onClose={function(){setShowLegenda(false);}}/>}
    {confirmDel&&<ConfirmModal message={"Eliminare l'attivita per "+confirmDel.cliente+"?"} onConfirm={confirmDelete} onCancel={function(){setConfirmDel(null);}}/>}
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
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#0A1628,#1F4E79,#2E75B6)",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"white",borderRadius:18,padding:"44px 36px",width:370,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:30}}>
          <div style={{width:64,height:64,background:"linear-gradient(135deg,#1F4E79,#2E75B6)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </div>
          <h1 style={{fontSize:22,fontWeight:800,color:"#1F4E79",margin:0}}>AQS Italia</h1>
          <p style={{color:"#9CA3AF",fontSize:13,marginTop:4}}>Gestione Commesse e Fatturazione</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <input value={u} onChange={function(e){setU(e.target.value);setErr("");}} placeholder="Username" onKeyDown={function(e){if(e.key==="Enter")go();}} style={inp}/>
          <input value={p} onChange={function(e){setP(e.target.value);setErr("");}} placeholder="Password" type="password" onKeyDown={function(e){if(e.key==="Enter")go();}} style={inp}/>
          {err&&<div style={{color:"#C62828",fontSize:12,textAlign:"center"}}>{err}</div>}
          <button onClick={go} style={{padding:"13px",background:"linear-gradient(135deg,#1F4E79,#2E75B6)",color:"white",border:"none",borderRadius:8,fontSize:15,fontWeight:700,cursor:"pointer",marginTop:4}}>Accedi</button>
        </div>
      </div>
      <div style={{marginTop:28,textAlign:"center",color:"rgba(255,255,255,0.35)",fontSize:11}}>AQS Italia srl - 2026 tutti i diritti riservati</div>
    </div>
  );
}
