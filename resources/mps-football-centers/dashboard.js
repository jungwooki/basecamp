'use strict';
// Entirely fictional personas. Scores use a demo-only 0–100 scale, not actual MPS scoring or diagnostic thresholds.
const players=[
  {
    "id": "DEMO-01",
    "name": "강도윤",
    "group": "U12",
    "coach": "코치 1",
    "date": "2026.09.12",
    "state": "due",
    "next": "2026.09.26",
    "pay": "A안",
    "days": 14,
    "done": 3,
    "target": 4,
    "goal": "체격 강점과 기술 수행을 구분해 관찰하고, 선수 본인이 느끼는 훈련 부담을 기록합니다.",
    "persona": "조기성장 · 피지컬 우세",
    "growth": "조기성장형",
    "growthNote": "동년배보다 성숙이 빠른 것으로 설정한 가상 사례. 현재 체격 강점을 장기 잠재력과 동일시하지 않습니다.",
    "physical": [
      78,
      82,
      86
    ],
    "mental": [
      77,
      75,
      72
    ],
    "traits": [
      90,
      81,
      87
    ],
    "focus": "체격 외 기술·협응의 변화도 함께 기록"
  },
  {
    "id": "DEMO-04",
    "name": "서이준",
    "group": "U12",
    "coach": "코치 2",
    "date": "2026.09.18",
    "state": "active",
    "next": "2026.10.02",
    "pay": "B안",
    "days": 8,
    "done": 2,
    "target": 4,
    "goal": "또래의 체격과 단순 비교하기보다 개인 기술 과제와 이전 측정 대비 변화를 중심으로 피드백합니다.",
    "persona": "지연성장 · 기술 집중",
    "growth": "지연성장형",
    "growthNote": "성숙 시점이 상대적으로 늦은 것으로 설정한 가상 사례. 현재 피지컬 점수만으로 향후 경기력을 판단하지 않는 상황을 보여줍니다.",
    "physical": [
      55,
      59,
      62
    ],
    "mental": [
      80,
      82,
      84
    ],
    "traits": [
      57,
      65,
      64
    ],
    "focus": "개인 기술 과제와 자신감 유지 기록"
  },
  {
    "id": "DEMO-05",
    "name": "문하람",
    "group": "U11",
    "coach": "코치 1",
    "date": "2026.09.19",
    "state": "due",
    "next": "2026.09.26",
    "pay": "A안",
    "days": 7,
    "done": 4,
    "target": 4,
    "goal": "최근 점수 변화에 대해 선수의 이야기를 먼저 듣고, 보호자·측정센터와 확인할 질문을 정리합니다.",
    "persona": "멘탈 점수 하락",
    "growth": "일반성장형",
    "growthNote": "성장 분류보다 최근 멘탈 점수의 변화에 초점을 둔 가상 사례입니다.",
    "physical": [
      77,
      78,
      79
    ],
    "mental": [
      82,
      73,
      58
    ],
    "traits": [
      80,
      77,
      80
    ],
    "focus": "멘탈 82 → 73 → 58점 · 변화 배경 확인"
  },
  {
    "id": "DEMO-06",
    "name": "윤태오",
    "group": "U11",
    "coach": "코치 2",
    "date": "2026.09.11",
    "state": "active",
    "next": "2026.10.03",
    "pay": "B안",
    "days": 15,
    "done": 1,
    "target": 4,
    "goal": "피지컬과 멘탈 강점이 유지되는지 확인하면서 본인이 선택한 기술 목표의 수행 과정을 기록합니다.",
    "persona": "피지컬·멘탈 강점형",
    "growth": "일반성장형",
    "growthNote": "성장 분류와 별개로 피지컬·멘탈 예시 점수가 모두 높은 선수입니다.",
    "physical": [
      89,
      92,
      94
    ],
    "mental": [
      86,
      88,
      90
    ],
    "traits": [
      96,
      92,
      94
    ],
    "focus": "피지컬 94점 · 멘탈 90점의 강점 사례"
  },
  {
    "id": "DEMO-07",
    "name": "정시온",
    "group": "U12",
    "coach": "코치 1",
    "date": "2026.09.20",
    "state": "active",
    "next": "2026.10.04",
    "pay": "A안",
    "days": 6,
    "done": 2,
    "target": 4,
    "goal": "안정적으로 이어진 관리 목표를 유지하고, 이번 달 작은 기술 목표 하나를 선수와 함께 정합니다.",
    "persona": "균형 성장 · 안정형",
    "growth": "일반성장형",
    "growthNote": "세 영역이 비교적 안정적으로 이어지는 가상 비교 사례입니다.",
    "physical": [
      75,
      77,
      78
    ],
    "mental": [
      81,
      83,
      85
    ],
    "traits": [
      78,
      76,
      80
    ],
    "focus": "안정적인 변화와 꾸준한 관리 기록"
  },
  {
    "id": "DEMO-08",
    "name": "오유찬",
    "group": "U11",
    "coach": "코치 2",
    "date": "2026.09.22",
    "state": "active",
    "next": "2026.10.06",
    "pay": "B안",
    "days": 4,
    "done": 3,
    "target": 4,
    "goal": "이번 달 다시 올라온 점수와 코치의 관찰이 일치하는지 확인하고 선수의 경험을 기록합니다.",
    "persona": "컨디션 반등형",
    "growth": "일반성장형",
    "growthNote": "최근 점수의 하락 후 반등을 보여주는 사례이며 부상이나 회복 판정을 뜻하지 않습니다.",
    "physical": [
      76,
      58,
      71
    ],
    "mental": [
      79,
      70,
      76
    ],
    "traits": [
      69,
      74,
      70
    ],
    "focus": "피지컬 76 → 58 → 71점 · 최근 반등"
  },
  {
    "id": "DEMO-02",
    "name": "선수 G",
    "group": "U12",
    "coach": "코치 2",
    "date": "2026.09.24",
    "state": "waiting",
    "next": "결과 수신 후 지정",
    "pay": "B안",
    "days": null,
    "done": 0,
    "target": 4,
    "goal": "결과 수신 후 선수·보호자 설명 일정을 정합니다."
  },
  {
    "id": "DEMO-03",
    "name": "선수 H",
    "group": "U11",
    "coach": "코치 1",
    "date": "표시 제한",
    "state": "consent",
    "next": "공유 절차 확인 후 지정",
    "pay": "A안",
    "days": null,
    "done": null,
    "target": null,
    "goal": ""
  }
];
const labels={due:'점검기한 도래',waiting:'결과 대기',consent:'공유 확인 필요',active:'관리 중'};
const titles={summary:'선수단 상태 요약',physical:'피지컬 컨디션',growth:'성장 단계',mental:'선수단 멘탈',management:'코치 관리'};
let selected=players[0].id,tab='summary';
const $=s=>document.querySelector(s);
function groupPlayers(){const g=$('#group').value;return players.filter(p=>g==='all'||p.group===g);}
const received=p=>p.state==='due'||p.state==='active';
function summary(group){const ready=group.filter(received),due=group.filter(p=>p.state==='due').length,waiting=group.filter(p=>p.state==='waiting').length,consent=group.filter(p=>p.state==='consent').length;
return `<div class="summary-banner panel"><div><div class="author"><span class="avatar" aria-hidden="true">♙</span><div><b>레슨센터 운영 브리핑</b><small>담당 코치 · 선택 선수단 기준</small></div></div><p class="summary-copy">${due?`관리 점검일이 도래한 선수가 ${due}명 있습니다.`:'예정된 선수 관리 일정을 확인하세요.'}<br>측정 결과를 확인하고, 선수별 관리 계획을 이어갑니다.</p></div><div class="summary-score"><span>측정 결과 수신</span><b>${ready.length}<small> / ${group.length}명</small></b></div></div><div class="metrics"><article class="metric panel"><div class="metric-title sand"><span class="round-icon sand">↗</span>관리 점검기한 도래</div><b>${due}<small>명</small></b><p>이번 점검에서 실행·관찰 기록을 확인할 선수</p></article><article class="metric panel"><div class="metric-title purple"><span class="round-icon purple">◈</span>공유 확인 필요</div><b>${consent}<small>명</small></b><p>열람 범위·수신자 확인 후 결과를 제공할 선수</p></article><article class="metric panel"><div class="metric-title blue"><span class="round-icon blue">✚</span>측정 결과 대기</div><b>${waiting}<small>명</small></b><p>측정센터의 결과 회신 일정을 확인할 선수</p></article></div>${personaStrip(ready)}<section class="map-panel panel"><div class="section-head"><div class="map-title"><h2>선수 관리 지도</h2><p>선수를 누르면 아래에서 관리 계획을 확인할 수 있습니다.</p></div><div class="map-legend"><span><i></i>관리 중</span><span><i class="overdue"></i>점검기한 도래</span></div></div><div class="map" role="group" aria-label="가상 업무 지표. 가로는 측정 후 경과일, 세로는 코치 관리기록 완료율"><div class="axis-y"><span>100%</span><span>50%</span><span>0%</span></div><span class="map-label">가상 업무 지표 · 건강 점수 아님</span><div class="plot-area">${ready.map(p=>`<button class="point ${p.state}" data-select="${p.id}" style="left:${p.days/30*100}%;bottom:${(p.done/p.target)*100}%" aria-label="${p.name} 상세 보기, 측정 후 ${p.days}일, 관리기록 ${p.done}/${p.target}회"><i></i><span>${p.name}</span></button>`).join('')||'<div class="no-points">표시할 결과 수신 선수가 없습니다.</div>'}</div></div><div class="axis-x"><span>0일</span><span>15일</span><span>30일</span></div><div class="map-foot"><span>가로: 측정 후 경과일 · 세로: 코치 관리기록 완료율</span><span>결과 대기·공유 미확인 ${group.length-ready.length}명 제외</span></div></section>`;}
const latest=values=>values[values.length-1];
const change=values=>latest(values)-values[values.length-2];
function delta(values){const n=change(values);return `<span class="delta ${n<0?'down':'up'}">${n>0?'+':''}${n}점 <small>직전 대비</small></span>`;}
function personaStrip(list){return `<section class="personas"><div class="section-head"><div><h2>서로 다른 선수, 서로 다른 관리</h2><p>유형·점수는 설명을 위해 만든 가상 사례입니다.</p></div><span class="demo-scale">데모 점수 0~100</span></div><div class="persona-grid">${list.map(p=>`<button class="persona-card" data-select="${p.id}"><span class="type-tag">${p.persona}</span><h3>${p.name}<small> · ${p.group}</small></h3><p>${p.focus}</p><div><span>피지컬 <b>${latest(p.physical)}</b></span><span>멘탈 <b>${latest(p.mental)}</b></span><span class="case-arrow">↗</span></div></button>`).join('')}</div></section>`;}
function domains(group){const cfg={physical:{color:'var(--blue)',tag:'PHYSICAL / 피지컬',desc:'선수별 피지컬 강점과 3회 점수 변화를 비교합니다.'},growth:{color:'var(--sand)',tag:'GROWTH / 성장',desc:'조기·지연·일반 성장 사례별 관리 관점을 살펴봅니다.'},mental:{color:'var(--purple)',tag:'MENTAL / 멘탈',desc:'현재 점수와 직전 대비 변화를 함께 확인합니다.'},management:{color:'var(--green)',tag:'COACH / 관리기록',desc:'선수 특성에 맞춘 코치의 관리계획을 확인합니다.'}}[tab];
return `<div class="domain-heading"><div><h2>선수 전체</h2><p>${cfg.desc}</p></div><span>가상 사례 · 0~100점은 데모 전용 척도</span></div><div class="domain-grid">${group.map(p=>{let inner;if(!received(p)){inner=`<div class="value">${p.state==='consent'?'공유 확인 필요':'결과 대기'}</div><p>점수·유형을 표시하지 않습니다.</p>`;}else if(tab==='growth'){inner=`<div class="value">${p.growth}</div><p>${p.growthNote}</p><small>${p.focus}</small>`;}else if(tab==='management'){inner=`<div class="value">${p.done} / ${p.target}회</div><div class="progress"><i style="width:${p.done/p.target*100}%"></i></div><p>${p.goal}</p>`;}else{const values=p[tab];inner=`<div class="score-line"><div class="value">${latest(values)}<small> / 100</small></div>${delta(values)}</div><div class="progress" role="img" aria-label="${latest(values)}점, 데모 범위 0부터 100"><i style="width:${latest(values)}%"></i></div><p class="history-values">${values.join(' → ')}점 <small>7월 · 8월 · 9월 가상 측정</small></p><small>${p.focus}</small>`;}return `<button class="domain-card" data-select="${p.id}" style="--accent:${cfg.color}" aria-label="${p.name} ${titles[tab]} 상세 보기"><span class="category">${cfg.tag}</span><h3>${p.name} <small>· ${p.group}</small></h3>${inner}</button>`;}).join('')}</div>`;}
function trend(p){const values=p.mental,pts=values.map((v,i)=>`${40+i*110},${128-v}`).join(' ');return `<div class="trend-box"><div class="trend-head"><strong>멘탈 점수 변화</strong>${delta(values)}</div><svg viewBox="0 0 300 165" role="img" aria-label="가상 멘탈 점수. 7월 ${values[0]}점, 8월 ${values[1]}점, 9월 ${values[2]}점. 0부터 100점 척도"><g stroke="#505050" stroke-dasharray="3 4"><path d="M35 28H270M35 78H270M35 128H270"/></g><g fill="#aaa" font-size="9"><text x="3" y="31">100</text><text x="9" y="81">50</text><text x="15" y="131">0</text></g><polyline points="${pts}" fill="none" stroke="var(--purple)" stroke-width="3"/>${values.map((v,i)=>`<circle cx="${40+i*110}" cy="${128-v}" r="4" fill="var(--purple)"/><text x="${40+i*110}" y="${118-v}" text-anchor="middle" fill="white" font-size="11">${v}</text><text x="${40+i*110}" y="153" text-anchor="middle" fill="#aaa" font-size="10">${7+i}월</text>`).join('')}</svg><small>직전 대비는 8월→9월 차이 · 원인이나 진단을 뜻하지 않음</small></div>`;}
function profile(p){return `<div class="profile-type"><span class="type-tag">${p.persona}</span><p>${p.focus}</p></div><div class="profile-stats"><div><span>성장 유형</span><b class="sand">${p.growth}</b></div><div><span>피지컬 · 데모</span><b class="blue">${latest(p.physical)}<small>/100</small></b></div><div><span>멘탈 · 데모</span><b class="purple">${latest(p.mental)}<small>/100</small></b></div></div><h3>가상 측정센터 전달사항</h3><div class="record"><p>${p.growthNote}</p><small>실제 측정·진단 결과가 아닌 사례 설명</small></div><h3>피지컬 세부 항목 · 데모 점수</h3><div class="trait-bars">${['근력','민첩','균형'].map((label,i)=>`<div><span>${label}</span><div class="progress"><i style="width:${p.traits[i]}%"></i></div><b>${p.traits[i]}</b></div>`).join('')}<small>각 항목 0~100점 · 종합점수는 별도 설정값이며 계산식 없음</small></div>${trend(p)}<h3>코치의 관리 계획</h3><div class="record coach"><p>${p.goal}</p><small>${p.coach} · 관리기록 ${p.done}/${p.target}회 · 가상 예시</small></div>`;}
function overview(){const group=groupPlayers();$('#page-title').textContent=titles[tab];$('#overview').setAttribute('aria-labelledby','tab-'+tab);$('#overview').innerHTML=tab==='summary'?summary(group):domains(group);document.querySelectorAll('.tab').forEach(b=>{const active=b.dataset.tab===tab;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});}
function detail(p){if(!p){$('#detail').innerHTML='<div class="empty"><h2>해당하는 선수가 없습니다.</h2><p>검색어나 진행 상태를 바꿔보세요.</p></div>';return;}
let body=`<span class="eyebrow">${p.id} · ${p.group} · 가상 선수</span><h2>${p.name}<span class="badge ${p.state}">${labels[p.state]}</span></h2><p class="meta">담당 ${p.coach} / 측정비 ${p.pay} · 결제 상태 미포함</p>`;
if(p.state==='consent')body+='<div class="locked"><b>측정 결과 표시 보류</b><p>공유 승인 범위·수신자·절차를 확인한 뒤 결과를 표시하는 화면 예시입니다.</p></div>';
else if(p.state==='waiting')body+=`<div class="record"><strong>측정일 ${p.date} · 결과 미수신</strong><p>연계 측정센터의 결과 회신 일정을 확인합니다. 측정값은 아직 표시하지 않습니다.</p></div><h3>코치의 다음 조치</h3><div class="record coach"><p>${p.goal}</p></div>`;
else body+=profile(p);
body+=`<div class="next"><b>다음 관리 점검</b><p>${p.next}</p></div><p class="hint">레슨센터의 업무 점검일이며 의학적 재검 권고일과 구분합니다.</p>`;$('#detail').innerHTML=body;}
function render(){const group=groupPlayers(),query=$('#search').value.trim().toLowerCase(),f=$('#filter').value,rows=group.filter(p=>(f==='all'||p.state===f)&&(p.id+' '+p.name+' '+(p.persona||'')+' '+(p.growth||'')).toLowerCase().includes(query));if(!rows.some(p=>p.id===selected))selected=rows[0]?.id;$('#count').textContent=`현재 목록 ${rows.length}명 / 선택 선수단 ${group.length}명`;$('#players').innerHTML=rows.length?rows.map(p=>`<tr class="${p.id===selected?'selected':''}"><td><button class="player" data-id="${p.id}" aria-pressed="${p.id===selected}">${p.name}<small>${p.id} · ${p.group}</small>${p.persona?`<small class="roster-persona">${p.persona}</small>`:''}</button></td><td>${p.coach}</td><td>${p.date}</td><td><span class="badge ${p.state}">${labels[p.state]}</span></td></tr>`).join(''):'<tr><td colspan="4" class="empty">검색 조건에 맞는 선수가 없습니다.</td></tr>';detail(rows.find(p=>p.id===selected));}
function choose(id){selected=id;$('#search').value='';$('#filter').value='all';render();$('#detail').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});}
$('.tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b){tab=b.dataset.tab;overview();}});
$('.tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const buttons=[...document.querySelectorAll('.tab')];let i=buttons.findIndex(b=>b.dataset.tab===tab);i=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;tab=buttons[i].dataset.tab;overview();buttons[i].focus();});
$('#group').addEventListener('change',()=>{selected=null;overview();render();});$('#search').addEventListener('input',render);$('#filter').addEventListener('change',render);$('#players').addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(b){selected=b.dataset.id;render();}});$('#overview').addEventListener('click',e=>{const b=e.target.closest('[data-select]');if(b)choose(b.dataset.select);});overview();render();
