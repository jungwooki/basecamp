'use strict';
window.MPS_CONFIG={
 storageKey:'mps-basecamp-data-v2',authKey:'mps-basecamp-auth-v2',
 types:{Team:['선수팀'],Clinic:['MPS광역클리닉','MPS인증클리닉'],Center:['스킬센터','피지컬센터','종합센터']},
 reportFields:[['mobile','모바일 리포트'],['standard','스탠다드 리포트'],['mental','멘탈 심화'],['physical','피지컬 심화'],['growth','성장체질 심화']],
 seed:{version:2,organizations:[
 {id:'sample-clinic',name:'해온 제휴의료기관 · 샘플',type:'Clinic',subtype:'MPS인증클리닉',region:'서울 신도림',status:'운영 중',dashboardActive:false,dashboardUrl:'',contact:'',note:'구성 확인을 위한 샘플 기관입니다.',sample:true},
 {id:'sample-center',name:'MPS 스킬센터 · 샘플',type:'Center',subtype:'스킬센터',region:'서울',status:'준비 중',dashboardActive:false,dashboardUrl:'',contact:'',note:'구성 확인을 위한 샘플 기관입니다.',sample:true},
 {id:'sample-team',name:'서울AFC U-15 · 샘플',type:'Team',subtype:'선수팀',region:'서울',status:'운영 중',dashboardActive:true,dashboardUrl:'https://sportsmps.com/samples/team-dashboard?birth_year=2012',contact:'',note:'SportsMPS 공개 샘플 대시보드로 연결됩니다.',sample:true}
 ],players:[
 {id:'sample-player-a',name:'샘플 선수 A',active:true,program:'멘탈강화 · 성장 모니터링',orgIds:['sample-team','sample-clinic'],reports:{mobile:'https://sportsmps.com/samples/report-audit-mobile',standard:'https://sportsmps.com/samples/pdf-report',mental:'resources/2026mental2/index.html',physical:'',growth:'../2026growth/index.html'},note:'화면 사용법을 설명하기 위한 가상 선수입니다. 연결된 리포트는 공개 샘플입니다.',sample:true},
 {id:'sample-player-b',name:'샘플 선수 B',active:true,program:'스킬 레슨',orgIds:['sample-team','sample-center'],reports:{mobile:'',standard:'',mental:'',physical:'',growth:''},note:'리포트 주소를 등록하면 상세화면에 연결 버튼이 표시됩니다.',sample:true},
 {id:'sample-player-c',name:'샘플 선수 C',active:false,program:'초기 상담 대기',orgIds:['sample-clinic'],reports:{mobile:'',standard:'',mental:'',physical:'',growth:''},note:'비활성 상태 예시입니다.',sample:true}
 ]}
};
