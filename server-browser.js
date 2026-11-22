/* Live server browser: live player counts only; never substitutes advertised averages. */
(function(){
  "use strict";
  var root=document.getElementById("servers");
  if(!root)return;
  var servers=[
    {name:"ArchMC",edition:"eagler",host:"arch.mc",address:"wss://arch.mc",source:"TopEaglerServers"},
    {name:"Voidsent MC",edition:"eagler",host:"mc.voidsent.net",address:"wss://mc.voidsent.net",source:"TopEaglerServers"},
    {name:"Bagel SMP",edition:"eagler",host:"esl.bagelsmp.com",address:"wss://esl.bagelsmp.com",source:"TopEaglerServers",note:"Listing notes report potentially inflated traffic; verify independently."},
    {name:"TuffNET",edition:"eagler",host:"tuff.ws",address:"wss://tuff.ws",source:"TopEaglerServers"},
    {name:"Pixel Craft",edition:"eagler",host:"pcsmp.net",address:"wss://pcsmp.net",source:"TopEaglerServers"},
    {name:"Carrotcraft",edition:"eagler",host:"eagler.carrot-craft.org",address:"wss://eagler.carrot-craft.org",source:"TopEaglerServers"},
    {name:"Zentic Network",edition:"eagler",host:"zentic.cc",address:"wss://zentic.cc",source:"TopEaglerServers"},
    {name:"HeartSMP",edition:"eagler",host:"play.heartsmp.net",address:"wss://play.heartsmp.net",source:"TopEaglerServers"},
    {name:"MercuryMC",edition:"eagler",host:"mercurymc.net",address:"wss://mercurymc.net",source:"TopEaglerServers"},
    {name:"FKAS Survival",edition:"eagler",host:"eaglercraft.co.uk",address:"wss://eaglercraft.co.uk",source:"TopEaglerServers"},
    {name:"ZythMC",edition:"eagler",host:"mc.zyth.me",address:"wss://mc.zyth.me",source:"TopEaglerServers"},
    {name:"TotalFreedom",edition:"eagler",host:"eagler.totalfreedom.tf",address:"wss://eagler.totalfreedom.tf",source:"TopEaglerServers"},
    {name:"KrypticMC",edition:"eagler",host:"krypticmc.net",address:"wss://krypticmc.net",source:"TopEaglerServers"},
    {name:"Aeon Network",edition:"eagler",host:"aeon-network.net",address:"wss://aeon-network.net",source:"TopEaglerServers"},
    {name:"MytheriaMC",edition:"eagler",host:"play.mytheriamc.net",address:"wss://play.mytheriamc.net",source:"TopEaglerServers"},
    {name:"GG SMP",edition:"eagler",host:"ggsmp.net",address:"wss://ggsmp.net",source:"TopEaglerServers"},
    {name:"WanderwoodSMP",edition:"eagler",host:"wanderwoodsmp.com",address:"wss://wanderwoodsmp.com",source:"TopEaglerServers"},
    {name:"SHADOW NETWORK 2",edition:"eagler",host:"play.shadownetwork.shop",address:"wss://play.shadownetwork.shop",source:"TopEaglerServers"},
    {name:"Ethereal",edition:"eagler",host:"ethereal.mov",address:"wss://ethereal.mov",source:"TopEaglerServers"},
    {name:"RagePVP Network",edition:"eagler",host:"ragepvp.us",address:"wss://ragepvp.us",source:"TopEaglerServers"},
    {name:"Hypixel",edition:"java",host:"mc.hypixel.net",address:"mc.hypixel.net",source:"MCSrvStat",modes:["Minigames","SkyBlock"]},
    {name:"Wynncraft",edition:"java",host:"play.wynncraft.com",address:"play.wynncraft.com",source:"MCSrvStat",modes:["RPG"]},
    {name:"CubeCraft",edition:"java",host:"play.cubecraft.net",address:"play.cubecraft.net",source:"MCSrvStat",modes:["Minigames"]},
    {name:"MCC Island",edition:"java",host:"play.mccisland.net",address:"play.mccisland.net",source:"MCSrvStat",modes:["Minigames"]},
    {name:"PvP Legacy",edition:"java",host:"play.pvplegacy.net",address:"play.pvplegacy.net",source:"MCSrvStat",modes:["PvP"]},
    {name:"JartexNetwork",edition:"java",host:"play.jartexnetwork.com",address:"play.jartexnetwork.com",source:"MCSrvStat",modes:["Minigames","Survival","SkyBlock"]},
    {name:"DonutSMP",edition:"java",host:"donutsmp.net",address:"donutsmp.net",source:"MCSrvStat",modes:["Survival","SMP","PvP"]},
    {name:"Minehut",edition:"java",host:"minehut.com",address:"minehut.com",source:"MCSrvStat",modes:["Survival","SMP"]},
    {name:"Minemen Club",edition:"java",host:"minemen.club",address:"minemen.club",source:"MCSrvStat",modes:["PvP"]},
    {name:"Complex Gaming",edition:"java",host:"hub.mc-complex.com",address:"hub.mc-complex.com",source:"MCSrvStat",modes:["Survival","Prison","SkyBlock"]},
    {name:"ManaCube",edition:"java",host:"hub.manacube.net",address:"hub.manacube.net",source:"MCSrvStat",modes:["Survival","Prison","SkyBlock"]},
    {name:"PikaNetwork",edition:"java",host:"play.pika-network.net",address:"play.pika-network.net",source:"MCSrvStat",modes:["Minigames","SkyBlock","PvP"]},
    {name:"OPBlocks",edition:"java",host:"play.opblocks.com",address:"play.opblocks.com",source:"MCSrvStat",modes:["SkyBlock","Survival","Prison"]},
    {name:"Purple Prison",edition:"java",host:"purpleprison.net",address:"purpleprison.net",source:"MCSrvStat",modes:["Prison","PvP"]},
    {name:"EarthMC",edition:"java",host:"play.earthmc.net",address:"play.earthmc.net",source:"MCSrvStat",modes:["Survival","SMP"]},
    {name:"MC Central",edition:"java",host:"mccentral.org",address:"mccentral.org",source:"MCSrvStat",modes:["Minigames","Survival"]},
    {name:"Vortex Network",edition:"java",host:"sm.vortexnetwork.net",address:"sm.vortexnetwork.net",source:"MCSrvStat",modes:["SkyBlock"]},
    {name:"Mineberry",edition:"java",host:"go.mineberry.org",address:"go.mineberry.org",source:"MCSrvStat",modes:["Survival","Minigames","PvP"]},
    {name:"FadeCloud",edition:"java",host:"mbs.fadecloud.com",address:"mbs.fadecloud.com",source:"MCSrvStat",modes:["Prison","SkyBlock","Survival"]},
    {name:"EnchantedMC",edition:"java",host:"jms.enchantedmc.net",address:"jms.enchantedmc.net",source:"MCSrvStat",modes:["SkyBlock"]},
    {name:"WildNetwork",edition:"java",host:"mbs.wildnetwork.net",address:"mbs.wildnetwork.net",source:"MCSrvStat",modes:["Survival","Prison"]},
    {name:"FreshSMP",edition:"java",host:"play.freshsmp.fun",address:"play.freshsmp.fun",source:"MCSrvStat",modes:["Survival","SMP"]},
    {name:"MinePeak",edition:"java",host:"go.minepeak.org",address:"go.minepeak.org",source:"MCSrvStat",modes:["Survival","PvP","Minigames"]},
    {name:"Hoplite",edition:"java",host:"play.hoplite.gg",address:"play.hoplite.gg",source:"MCSrvStat",modes:["PvP","Minigames"]}
  ];
  var state={filter:"all",mode:"all",search:"",loading:false,updated:null};
  var list=root.querySelector(".server-list"),summary=root.querySelector(".server-summary"),refresh=root.querySelector(".server-refresh"),modeSelect=root.querySelector(".server-mode-filter"),searchInput=root.querySelector(".server-search");
  if(!list||!summary||!refresh)return;
  function safeText(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function firstNumber(obj,paths){for(var i=0;i<paths.length;i++){var v=obj;for(var j=0;j<paths[i].length;j++)v=v&&v[paths[i][j]];if(typeof v==="number"&&isFinite(v))return v}return null}
  function parseEagler(data){
    var payload=data&&data.data&&typeof data.data==="object"?data.data:data;
    var online=payload.online===true||payload.status==="online"||payload.isOnline===true||data.online===true||data.status==="online";
    var count=firstNumber(payload,[["players","online"],["players","current"],["playerCount"],["onlinePlayers"],["online"],["playersOnline"]]);
    var max=firstNumber(payload,[["players","max"],["maxPlayers"],["max"]]);
    if(count===null)count=firstNumber(data,[["players","online"],["playerCount"],["onlinePlayers"]]);
    if(max===null)max=firstNumber(data,[["players","max"],["maxPlayers"]]);
    if(typeof payload.online==="number"&&count===null)count=payload.online;
    return {online:online,players:count,max:max,version:payload.version||data.version||"",latency:firstNumber(payload,[["latency"],["responseTime"],["ping"]])};
  }
  function timeoutFetch(url,ms){
    var controller=new AbortController(),timer=setTimeout(function(){controller.abort()},ms);
    return fetch(url,{signal:controller.signal,cache:"no-store"}).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}).finally(function(){clearTimeout(timer)});
  }
  var STATUS_API="https://dicestack-netlify-api.netlify.app/.netlify/functions/server-status";
  function fetchStatuses(){
    var requested=servers.map(function(s){return s.edition+":"+s.host}).join(",");
    var url=STATUS_API+"?servers="+encodeURIComponent(requested);
    return timeoutFetch(url,15000).then(function(payload){
      if(!payload||!payload.results||typeof payload.results!=="object")throw new Error("Invalid status response");
      servers.forEach(function(s){
        var result=payload.results[s.host];
        s.live=result&&typeof result==="object"?result:{online:false,players:null,max:null,version:"",error:"Status unavailable"};
      });
    });
  }
  function render(){
    var shown=servers.filter(function(s){
      var editionMatch=state.filter==="all"||state.filter===s.edition;
      var modes=s.modes||[];
      var modeMatch=state.mode==="all"||(state.mode==="Other"?!modes.length:modes.indexOf(state.mode)>=0);
      var searchText=(s.name+" "+s.host+" "+modes.join(" ")).toLowerCase();
      return editionMatch&&modeMatch&&(!state.search||searchText.indexOf(state.search)>=0);
    });
    shown.sort(function(a,b){
      var ao=a.live&&a.live.online&&typeof a.live.players==="number",bo=b.live&&b.live.online&&typeof b.live.players==="number";
      if(ao!==bo)return ao?-1:1;
      if(ao&&bo&&a.live.players!==b.live.players)return b.live.players-a.live.players;
      return a.name.localeCompare(b.name);
    });
    var online=servers.filter(function(s){return s.live&&s.live.online}).length;
    var total=servers.reduce(function(n,s){return n+(s.live&&s.live.online&&typeof s.live.players==="number"?s.live.players:0)},0);
    summary.innerHTML="<span><strong>"+online+"</strong> online</span><span><strong>"+total.toLocaleString()+"</strong> players across checked servers</span><span class='server-updated'>"+(state.updated?"Updated "+state.updated.toLocaleTimeString():"Waiting for first refresh")+"</span>";
    if(!shown.length){list.innerHTML='<div class="server-empty">No servers in this view.</div>';return}
    list.innerHTML=shown.map(function(s){
      var d=s.live||{},status=d.online?"online":d.error?"unknown":"offline";
      var count=d.online&&typeof d.players==="number"?d.players.toLocaleString():"—";
      var max=d.online&&typeof d.max==="number"?"/ "+d.max.toLocaleString():"";
      var modeLabels=(s.modes||[]).map(safeText).join(" · ")||"Community server";
      var version=d.version?safeText(d.version):"Version not reported";
      var countLabel=d.online?(typeof d.players==="number"?"LIVE PLAYERS":"PLAYERS UNAVAILABLE"):(d.error?"LIVE STATUS UNAVAILABLE":"SERVER OFFLINE");
      return '<article class="server-row"><div class="server-main"><div class="server-name-line"><span class="server-name">'+safeText(s.name)+'</span><span class="server-edition '+(s.edition==="java"?"java":"")+'">'+(s.edition==="java"?"JAVA":"EAGLERCRAFT")+'</span></div><code class="server-address">'+safeText(s.address)+'</code><div class="server-meta"><span class="server-status '+status+'"><i class="server-dot"></i>'+ (d.online?"Online":d.error?"Status unavailable":"Offline")+'</span><span>'+version+'</span><span class="server-modes">'+modeLabels+'</span></div></div><div class="server-count"><strong>'+count+'</strong><small>'+countLabel+' '+max+'</small></div><div class="server-actions"><button class="server-copy" type="button" data-copy="'+safeText(s.address)+'">Copy address</button></div></article>';
    }).join("");
  }
  function refreshAll(){
    if(state.loading)return;
    state.loading=true;refresh.disabled=true;refresh.textContent="Refreshing…";
    return fetchStatuses().catch(function(){
      servers.forEach(function(s){s.live={online:false,players:null,max:null,version:"",error:"Status service unavailable"}});
    }).finally(function(){
      state.updated=new Date();state.loading=false;refresh.disabled=false;refresh.textContent="↻ Refresh";render();
    });
  }
  root.addEventListener("click",function(e){
    var tab=e.target.closest("[data-server-filter]");
    if(tab){state.filter=tab.dataset.serverFilter;root.querySelectorAll("[data-server-filter]").forEach(function(b){b.setAttribute("aria-pressed",String(b===tab))});render();return}
    var copy=e.target.closest("[data-copy]");
    if(copy){var value=copy.dataset.copy;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(value).then(function(){copy.textContent="Copied!"}).catch(function(){copy.textContent=value})}else{var input=document.createElement("textarea");input.value=value;document.body.appendChild(input);input.select();try{document.execCommand("copy");copy.textContent="Copied!"}catch(x){copy.textContent="Select address"}input.remove()}setTimeout(function(){copy.textContent="Copy address"},1800)}
  });
  if(modeSelect)modeSelect.addEventListener("change",function(){state.mode=modeSelect.value;render()});
  if(searchInput)searchInput.addEventListener("input",function(){state.search=searchInput.value.trim().toLowerCase();render()});
  refresh.addEventListener("click",refreshAll);
  render();refreshAll();setInterval(refreshAll,120000);
})();