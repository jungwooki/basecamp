'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const clubs = window.MPS_CLUBS || [];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeURL = url => { try { const u = new URL(url); return /^https?:$/.test(u.protocol) ? esc(u.href) : ''; } catch { return ''; } };
  const norm = s => String(s || '').normalize('NFC').replace(/[\s\-]/g, '').toLowerCase();
  const located = c => Number.isFinite(c.lat) && Number.isFinite(c.lng) && c.locationStatus === 'verified';
  const badge = c => `<span class="badge${c.certified ? ' certified' : ''}">${c.certified ? '<img class="badge-symbol" src="assets/mps-symbol-black.png" alt=""> MPS 인증' : '일반 클럽'}</span>`;
  const tel = c => c.phone ? 'tel:' + c.phone.replace(/[^+\d]/g, '') : '';
  let region = '전체', query = '', certification = 'all', onlyLocated = false, radius = 'all';
  let user = null, active = null, geoRequest = 0, currentClubs = [], map = null, cluster = null, userLayer = null;
  let markers = new Map(), messageTimer;
  const mobile = () => window.matchMedia('(max-width:820px)').matches;
  function message(text, persistent = false) {
    clearTimeout(messageTimer); $('mapStatus').textContent = text; $('mapStatus').hidden = !text;
    if (text && !persistent) messageTimer = setTimeout(() => { $('mapStatus').hidden = true; }, 7000);
  }
  function distance(c) {
    if (!user || !located(c)) return Infinity;
    const rad = Math.PI / 180, dlat = (c.lat-user.lat)*rad, dlng = (c.lng-user.lng)*rad;
    const a = Math.sin(dlat/2)**2 + Math.cos(user.lat*rad)*Math.cos(c.lat*rad)*Math.sin(dlng/2)**2;
    return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(Math.max(0,1-a)));
  }
  const distanceLabel = c => user && located(c) ? `<span class="distance">직선 ${distance(c).toFixed(1)}km</span>` : '';
  function filtered() {
    return clubs.filter(c => (region === '전체' || c.region === region) &&
      (certification === 'all' || c.certified === (certification === 'certified')) &&
      (!onlyLocated || located(c)) && (!query || norm([c.name,c.address,c.venue,c.region,...(c.aliases || [])].join(' ')).includes(norm(query))) &&
      (!user || radius === 'all' || distance(c) <= Number(radius)))
      .sort((a,b) => {
        if (a.certified !== b.certified && !user) return a.certified ? -1 : 1;
        if (located(a) !== located(b)) return located(a) ? -1 : 1;
        if (user && located(a)) { const diff = distance(a)-distance(b); if (Math.abs(diff)>0.001) return diff; }
        return Number(b.certified)-Number(a.certified) || a.name.localeCompare(b.name,'ko');
      });
  }
  function details(c) {
    const sources = (c.sources || []).filter(s => safeURL(s.url));
    const sourceHTML = sources.map(s => `<a href="${safeURL(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label || '주소 출처')} ↗</a>`).join(' · ');
    const link = safeURL(c.url);
    const mapLink = `https://map.naver.com/p/search/${encodeURIComponent(c.address || c.name)}`;
    return `<article class="popup"><div class="popup-kicker">${esc(c.region)} · YOUTH FOOTBALL</div><h2>${esc(c.name)}</h2>${badge(c)}
      <dl><dt>${esc(c.locationType || '소재지')}</dt><dd>${esc(c.venue || '')}${c.venue ? '<br>' : ''}${esc(c.address || '주소 확인 중')}</dd>
      <dt>${esc(c.phoneType || '팀 연락처')}</dt><dd>${c.phone ? `<a class="phone-link" href="${tel(c)}">${esc(c.phone)}</a>` : '<span class="muted">연락처 확인 중</span>'}</dd></dl>
      ${c.note ? `<p>${esc(c.note)}</p>` : ''}${distanceLabel(c)}
      ${c.certified && c.benefits?.length ? `<p>${c.benefits.map(esc).join('<br>')}</p>` : ''}
      <div class="popup-actions">${c.phone ? `<a class="primary" href="${tel(c)}">전화 문의</a>` : ''}<a href="${esc(mapLink)}" target="_blank" rel="noopener noreferrer">${c.address ? '네이버 지도' : '팀 검색'} ↗</a>${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer">클럽 ↗</a>` : ''}</div>
      <div class="source-links">${sourceHTML || '공개 주소와 연락처를 확인하고 있습니다.'}${sources.length ? `<br>자료 확인 ${esc(c.checkedAt || '')}` : ''}</div></article>`;
  }
  function toggleList(open) {
    if (open && mobile()) map?.closePopup();
    $('sidebar').classList.toggle('open', open); $('mobileToggle').setAttribute('aria-expanded', String(open));
    $('sidebar').inert = mobile() && !open;
    $('mobileToggle').innerHTML = `${open ? '지도로 돌아가기' : '클럽 목록 보기'} <span id="mobileCount">${currentClubs.length}</span>`;
  }
  function select(c, move = true) {
    active = c.id;
    document.querySelectorAll('.club-card').forEach(el => el.classList.toggle('active', el.dataset.id === c.id));
    if (!map || !located(c)) {
      $('detailContent').innerHTML = details(c); $('detailDialog').showModal(); return;
    }
    const marker = markers.get(c.id); if (!marker) return;
    if (mobile()) toggleList(false);
    if (move) {
      map.closePopup();
      // zoomToShowLayer waits for cluster expansion and spiderfies colocated teams.
      cluster.zoomToShowLayer(marker, () => { if (active === c.id && markers.get(c.id) === marker) { map.panTo(marker.getLatLng()); marker.openPopup(); } });
    }
    const card = document.querySelector(`.club-card[data-id="${c.id}"]`);
    if (card && !move) card.scrollIntoView({block:'nearest'});
  }
  function labels() {
    if (!map) return;
    const boxes = [];
    for (const [id,m] of [...markers].sort((a,b)=>Number(b[1].options.certified)-Number(a[1].options.certified))) {
      m.closeTooltip();
      if ((!m.options.certified && map.getZoom()<14) || !m.getElement() || !map.getBounds().contains(m.getLatLng())) continue;
      const c = clubs.find(c=>c.id===id), p = map.latLngToContainerPoint(m.getLatLng());
      const w = Math.min(180,c.name.length*10+18), box = {x:p.x+12,y:p.y-12,w,h:25};
      if (boxes.some(b=>box.x < b.x+b.w && box.x+box.w > b.x && box.y < b.y+b.h && box.y+box.h > b.y)) continue;
      boxes.push(box);m.openTooltip();
    }
  }
  function render() {
    currentClubs = filtered(); const count = currentClubs.filter(located).length;
    $('resultCount').textContent = `${currentClubs.length}팀 · 지도 ${count}`;
    $('sortLabel').textContent = user ? '가까운 순 · 직선거리' : '인증 · 위치 확인순';
    $('mobileCount').textContent = currentClubs.length;
    $('clubList').replaceChildren();
    if (!currentClubs.length) {
      $('clubList').innerHTML = `<div class="empty"><strong>${certification === 'certified' ? '등록된 MPS 인증 클럽이 없습니다' : '조건에 맞는 클럽이 없습니다'}</strong>${certification === 'certified' ? '현재 검색 조건에 맞는 인증 클럽이 없습니다.' : '지역이나 거리, 검색어를 바꿔보세요.'}<br><button id="resetBtn">모든 클럽 보기</button></div>`;
      $('resetBtn').onclick = reset;
    }
    const frag = document.createDocumentFragment();
    currentClubs.forEach(c => {
      const card = document.createElement('article');card.className='club-card'+(active===c.id?' active':'');card.dataset.id=c.id;card.tabIndex=0;
      card.setAttribute('aria-label',c.name+' 상세 보기');
      card.innerHTML=`<div class="club-top"><span class="club-name">${esc(c.name)}</span>${badge(c)}</div><p class="address">${esc(c.address || c.region+' · 주소 확인 중')}</p><div class="card-bottom"><span>${c.phone ? `<a href="${tel(c)}" aria-label="${esc(c.name)} 전화 문의">${esc(c.phone)}</a><small class="phone-type">${esc(c.phoneType)}</small>` : '연락처 확인 중'}</span>${distanceLabel(c) || `<span class="place-type">${located(c) ? esc(c.locationType) : '<i class="pending-dot"></i>위치 확인 중'}</span>`}</div>`;
      card.onclick = e => { if (!e.target.closest('a')) select(c); };
      card.onkeydown = e => { if(e.target===card && ['Enter',' '].includes(e.key)){e.preventDefault();select(c);} };
      frag.append(card);
    });
    $('clubList').append(frag);
    if (!map) return;
    map.closePopup();cluster.clearLayers();markers.clear();
    const all=[];
    currentClubs.filter(located).forEach(c => {
      const size=c.certified?34:22;
      const icon=L.divIcon({className:'',html:`<div class="club-pin${c.certified?' certified':''}">${c.certified?'<img src="assets/mps-symbol-white.png" alt="">':''}</div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
      const marker=L.marker([c.lat,c.lng],{icon,title:c.name,alt:c.name,certified:c.certified,keyboard:true,zIndexOffset:c.certified?1000:0});
      marker.bindPopup(details(c),{maxWidth:310,autoPanPaddingTopLeft:[15,90],autoPanPaddingBottomRight:[20,80]});
      marker.bindTooltip(esc(c.name),{className:'team-label'+(c.certified?' certified-label':''),direction:'right',offset:[9,0],permanent:false,opacity:1});
      marker.on('click',()=>select(c,false));markers.set(c.id,marker);all.push(marker);
    });
    cluster.addLayers(all);labels();
  }
  function fit() {
    if (!map) return;
    const points=currentClubs.filter(located).map(c=>[c.lat,c.lng]);
    if(!points.length){message('현재 조건에는 위치가 확인된 팀이 없습니다. 목록에서 팀 정보를 확인해 주세요.');return;}
    map.fitBounds(points,{paddingTopLeft:[30,105],paddingBottomRight:[65,105],maxZoom:15,animate:false});
  }
  function regionButtons() {
    $('regions').replaceChildren();
    ['전체','서울','인천','경기'].forEach(r=>{const b=document.createElement('button');b.textContent=r;b.className=r===region?'active':'';b.setAttribute('aria-pressed',String(r===region));b.onclick=()=>{region=r;regionButtons();render();fit();};$('regions').append(b);});
  }
  function reset() {
    region='전체';query='';certification='all';onlyLocated=false;radius='all';
    $('searchInput').value='';$('certFilter').value='all';$('locatedOnly').checked=false;$('radius').value='all';
    regionButtons();render();fit();
  }
  $('totalCount').textContent=clubs.length;$('mappedCount').textContent=clubs.filter(located).length;$('certCount').textContent=new Set(clubs.filter(c=>c.certified).map(c=>c.group ?? c.id)).size;
  if (window.L && L.markerClusterGroup) {
    map=L.map('map',{zoomControl:false,minZoom:7,maxZoom:19}).setView([37.48,127.03],10);
    L.control.zoom({position:'bottomright'}).addTo(map);
    const tiles=L.tileLayer(window.MPS_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,opacity:.58,className:'base-tiles',attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'}).addTo(map);
    let tileErrors=0;
    tiles.on('tileerror',()=>{if(++tileErrors===3)message('배경 지도를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요. 클럽 목록은 계속 볼 수 있습니다.',true);});
    cluster=L.markerClusterGroup({showCoverageOnHover:false,spiderfyOnMaxZoom:true,spiderfyDistanceMultiplier:2.1,removeOutsideVisibleBounds:true,animate:!matchMedia('(prefers-reduced-motion:reduce)').matches,maxClusterRadius:z=>z<=10?64:z<=12?48:z<=15?30:18,
      iconCreateFunction:g=>{const n=g.getChildCount(),cert=g.getAllChildMarkers().some(m=>m.options.certified);const s=n>50?58:n>10?50:42;return L.divIcon({className:'',html:`<div class="cluster-pin${cert?' has-cert':''}">${n}${cert?'<small><img src="assets/mps-symbol-white.png" alt="MPS 인증 포함"></small>':''}</div>`,iconSize:[s,s]});}}).addTo(map);
    userLayer=L.layerGroup().addTo(map);map.on('zoomend moveend',labels);cluster.on('animationend spiderfied unspiderfied',labels);
  } else message('지도 파일을 불러오지 못했습니다. vendor 폴더가 함께 있는지 확인해 주세요. 클럽 목록은 이용할 수 있습니다.',true);
  let debounce;
  $('searchInput').oninput=e=>{query=e.target.value;clearTimeout(debounce);debounce=setTimeout(()=>{active=null;render();if(query.trim())fit();},180);};
  $('certFilter').onchange=e=>{certification=e.target.value;render();fit();};
  $('locatedOnly').onchange=e=>{onlyLocated=e.target.checked;render();};
  $('radius').onchange=e=>{radius=e.target.value;render();fit();};
  $('fitBtn').onclick=fit;
  $('locateBtn').onclick=()=>{
    if(!navigator.geolocation){message('이 브라우저에서는 현위치를 지원하지 않습니다. 팀명이나 주소로 검색해 주세요.');return;}
    if(!window.isSecureContext){message('현위치는 HTTPS 또는 localhost에서 사용할 수 있습니다. 주소로 검색하거나 로컬 서버로 열어 주세요.',true);return;}
    const token=++geoRequest;$('locateBtn').disabled=true;message('기기의 위치를 확인하고 있습니다. 위치 접근을 허용해 주세요.',true);
    navigator.geolocation.getCurrentPosition(pos=>{
      if(token!==geoRequest)return;$('locateBtn').disabled=false;
      user={lat:pos.coords.latitude,lng:pos.coords.longitude};$('nearby').hidden=false;
      if(map){userLayer.clearLayers();L.circle([user.lat,user.lng],{radius:pos.coords.accuracy,color:'#799bf4',fillOpacity:.08,weight:1}).addTo(userLayer);L.marker([user.lat,user.lng],{icon:L.divIcon({className:'',html:'<div class="user-dot"></div>',iconSize:[16,16]}),title:'내 위치'}).bindPopup('내 위치 · 오차 약 '+Math.round(pos.coords.accuracy)+'m').addTo(userLayer);map.setView([user.lat,user.lng],13);}
      render();message('내 위치를 중심으로 이동했습니다. 목록은 가까운 순입니다. 위치 오차 약 '+Math.round(pos.coords.accuracy)+'m.');
    },err=>{if(token!==geoRequest)return;$('locateBtn').disabled=false;message(({1:'위치 접근이 허용되지 않았습니다. 브라우저의 사이트 권한에서 위치를 허용한 후 다시 눌러 주세요.',2:'현재 위치를 확인할 수 없습니다. 기기의 위치 서비스를 확인해 주세요.',3:'위치 확인 시간이 초과됐습니다. 다시 시도해 주세요.'})[err.code]||'위치를 확인하지 못했습니다.',true);},{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
  };
  $('clearLocation').onclick=()=>{geoRequest++;user=null;radius='all';$('radius').value='all';$('nearby').hidden=true;$('locateBtn').disabled=false;userLayer?.clearLayers();message('');render();fit();};
  $('mobileToggle').onclick=()=>toggleList(!$('sidebar').classList.contains('open'));
  matchMedia('(max-width:820px)').addEventListener('change',()=>{toggleList(false);map?.invalidateSize();});
  $('aboutBtn').onclick=()=>$('aboutDialog').showModal();
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
  regionButtons();render();toggleList(false);if(map)fit();
  if (!clubs.length) message('클럽 데이터를 읽지 못했습니다. clubs-data.js 파일을 확인해 주세요.',true);
  // Read-only inspection surface for local QA, without persisting the user's location.
  window.MPS_MAP={map,cluster,getVisibleClubs:()=>currentClubs.slice(),getMarkers:()=>new Map(markers)};
})();
