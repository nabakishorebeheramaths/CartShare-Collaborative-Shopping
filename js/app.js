const STORAGE_KEY = "cartshare_room_v1";
const MEMBER = sessionStorage.getItem("cartshare_member") || "Nabakishore";
let currentMember = MEMBER;
const $ = (id) => document.getElementById(id);
const money = n => "₹" + Number(n || 0).toFixed(2);
const uid = () => Math.random().toString(36).slice(2,9).toUpperCase();
const starter = () => ({code:"CART24",name:"Weekend essentials",members:[MEMBER,"Aarav"],items:[
 {id:uid(),name:"Milk (1 litre)",qty:2,price:30,by:currentMember,at:Date.now()-80000},
 {id:uid(),name:"Whole wheat bread",qty:1,price:42,by:"Aarav",at:Date.now()-50000},
 {id:uid(),name:"Bananas",qty:6,price:6,by:currentMember,at:Date.now()-20000}
],activity:[{id:uid(),icon:"＋",title:"Room is ready",detail:"A shared shopping room was created.",by:currentMember,at:Date.now()-100000}]});
let state = loadState();
function loadState(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY));return v&&v.code?v:starter()}catch(e){return starter()}}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));render()}
function log(title,detail,icon="•"){state.activity.unshift({id:uid(),icon,title,detail,by:currentMember,at:Date.now()});state.activity=state.activity.slice(0,100)}
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("show"),2300)}
function total(){return state.items.reduce((s,i)=>s+i.qty*i.price,0)}
function delivery(){return total()>=75||total()===0?0:25}
function dateLabel(t){return new Date(t).toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderActivity(target,limit){const arr=state.activity.slice(0,limit||state.activity.length);$(target).innerHTML=arr.length?arr.map(a=>`<div class="activity-row"><div class="activity-bullet">${escapeHTML(a.icon)}</div><div><strong>${escapeHTML(a.title)}</strong><p>${escapeHTML(a.detail)} · by ${escapeHTML(a.by)}</p></div><time>${dateLabel(a.at)}</time></div>`).join(""):'<p class="muted">No activity yet. Changes will appear here.</p>'}
function render(){
 const t=total(), d=delivery(), count=state.items.reduce((s,i)=>s+i.qty,0);
 ["stat-code","invite-code","room-code-label","activity-code","receipt-code"].forEach(id=>$(id).textContent=state.code);
 $("stat-items").textContent=count;$("stat-total").textContent=money(t+d);$("stat-people").textContent=state.members.length;
 $("nav-count").textContent=count;$("cart-count").textContent=count;$("room-members").textContent=state.members.length+" member"+(state.members.length===1?"":"s");
 $("subtotal").textContent=money(t);$("delivery").textContent=money(d);$("grand-total").textContent=money(t+d);
 $("progress-fill").style.width=Math.min(100,t/75*100)+"%";$("progress-note").textContent=t>=75?"🎉 Group target reached — delivery estimate is waived.":`Add ${money(75-t)} more to reach the free-delivery target.`;
 $("cart-items").innerHTML=[...state.items].sort((a,b)=>$("sort-items").value==="name"?a.name.localeCompare(b.name):$("sort-items").value==="price"?a.price-b.price:b.at-a.at).map(i=>`<div class="cart-row"><div class="cart-item-name">${escapeHTML(i.name)}<small>${money(i.price)} per unit</small></div><div class="cart-owner">${escapeHTML(i.by)}</div><div class="qty-control"><button data-qty="-1" data-id="${i.id}" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-qty="1" data-id="${i.id}" aria-label="Increase quantity">+</button></div><div class="cart-price">${money(i.qty*i.price)}</div><button class="delete-btn" data-delete="${i.id}" aria-label="Remove item">×</button></div>`).join("");
 $("empty-cart").hidden=state.items.length>0;
 $("dashboard-items").innerHTML=state.items.slice(0,4).map(i=>`<div class="mini-item"><div class="item-emoji">🛍️</div><div><strong>${escapeHTML(i.name)}</strong><small>${i.qty} × ${money(i.price)} · ${escapeHTML(i.by)}</small></div><span class="mini-price">${money(i.qty*i.price)}</span></div>`).join("")||'<p class="muted">No items yet. Add your first item in the shared cart.</p>';
 renderActivity("dashboard-activity",3);renderActivity("full-activity");
 $("receipt-date").textContent=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
 $("receipt-people").textContent=state.members.length;
 $("receipt-lines").innerHTML=state.items.map(i=>`<div class="receipt-line"><span>${escapeHTML(i.name)} <small style="color:#9296a6">× ${i.qty}</small></span><span>${money(i.price)}</span><span>${money(i.qty*i.price)}</span></div>`).join("")||'<p class="muted">No items in this receipt yet.</p>';
 $("receipt-subtotal").textContent=money(t);$("receipt-delivery").textContent=money(d);$("receipt-total").textContent=money(t+d);
}
function navigate(){const route=(location.hash||"#dashboard").slice(1);const valid=["dashboard","room","activity","receipt"].includes(route)?route:"dashboard";document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+valid));document.querySelectorAll(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.route===valid));if(innerWidth<760)$("sidebar").classList.remove("open")}
document.querySelector(".sidebar").id="sidebar";
window.addEventListener("hashchange",navigate);
$("go-room").onclick=() => location.hash="#room";
$("add-form").addEventListener("submit",e=>{e.preventDefault();const name=$("item-name").value.trim(),qty=Number($("item-qty").value),price=Number($("item-price").value||0);if(!name||qty<1||price<0)return;state.items.unshift({id:uid(),name,qty,price,by:currentMember,at:Date.now()});log("Added an item",`${name} · quantity ${qty}`,"＋");save();e.target.reset();$("item-qty").value=1;toast("Item added to the shared cart.")});
$("cart-items").addEventListener("click",e=>{const q=e.target.dataset.qty,id=e.target.dataset.id,del=e.target.dataset.delete;if(q){const item=state.items.find(i=>i.id===id);if(item){item.qty=Math.max(1,item.qty+Number(q));log("Updated quantity",`${item.name} · quantity ${item.qty}`,"↻");save()}}if(del){const item=state.items.find(i=>i.id===del);if(item){state.items=state.items.filter(i=>i.id!==del);log("Removed an item",item.name,"−");save();toast("Item removed.")}}});
$("sort-items").onchange=render;
$("copy-code").onclick=()=>copyText(state.code);
$("share-room").onclick=()=>copyText(`Join my CartShare room. Room code: ${state.code}`);
async function copyText(s){try{await navigator.clipboard.writeText(s);toast("Copied to clipboard.")}catch(e){toast("Copy unavailable. Room code: "+s)}}
$("join-room").onclick=()=>{const code=$("join-code").value.trim().toUpperCase();const name=$("member-name").value.trim().slice(0,24)||currentMember;if(!/^[A-Z0-9]{4,10}$/.test(code)){toast("Enter a valid 4–10 character room code.");return}currentMember=name;sessionStorage.setItem("cartshare_member",name);state.code=code;state.members=[...new Set([...state.members,name])];log("Joined a room",`${name} joined room ${code}`,"↗");save();$("join-code").value="";$("member-name").value="";toast("Room joined in this browser session.")};
$("new-room").onclick=()=>{if(!confirm("Create a new room? The current room data in this browser will be replaced."))return;state={code:uid().slice(0,6),name:"New shopping room",members:[MEMBER,"Aarav"],items:[],activity:[]};log("Created a new room","A fresh shared cart is ready.","✳");save();toast("New room created.")};
$("make-receipt").onclick=()=>location.hash="#receipt";
$("print-receipt").onclick=()=>window.print();
$("clear-activity").onclick=()=>{if(confirm("Clear the activity history for this room?")){state.activity=[];save();toast("Activity history cleared.")}};
$("mobile-menu").onclick=()=>$("sidebar").classList.toggle("open");
window.addEventListener("storage",e=>{if(e.key===STORAGE_KEY){state=loadState();render();toast("Room updated from another tab.")}});
if("BroadcastChannel" in window){const channel=new BroadcastChannel("cartshare_sync");channel.onmessage=()=>{state=loadState();render()};const oldSave=save;save=function(){oldSave();channel.postMessage({updated:true})}}
navigate();render();
