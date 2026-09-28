(() => {
  const dialog=document.querySelector('#report-viewer');
  const image=document.querySelector('#report-image');
  const caption=document.querySelector('#report-caption');
  let group='general', index=0;
  function show(key,n){
    group=key;
    const pages=reportData[key].pages;
    index=Math.max(0,Math.min(pages.length-1,n));
    image.src=pages[index].image;
    image.alt=pages[index].title;
    caption.textContent=pages[index].title+' · '+reportData[key].kind;
    document.querySelector('#report-position').textContent=(index+1)+' / '+pages.length;
    document.querySelector('#report-prev').disabled=index===0;
    document.querySelector('#report-next').disabled=index===pages.length-1;
    document.querySelector('.viewer-scroll').scrollTo(0,0);
    if(!dialog.open)dialog.showModal();
  }
  document.querySelectorAll('[data-key]').forEach(button=>{
    button.addEventListener('click',()=>show(button.dataset.key,Number(button.dataset.index)));
  });
  document.querySelector('#report-prev').onclick=()=>show(group,index-1);
  document.querySelector('#report-next').onclick=()=>show(group,index+1);
  document.querySelector('#report-close').onclick=()=>dialog.close();
  document.querySelector('#report-size').onclick=(event)=>{
    const large=dialog.classList.toggle('full-size');
    event.currentTarget.textContent=large?'한 화면에 맞추기':'크게 보기';
    event.currentTarget.setAttribute('aria-pressed',String(large));
  };
  document.addEventListener('keydown',event=>{
    if(!dialog.open)return;
    if(event.key==='ArrowRight'){event.preventDefault();show(group,index+1);}
    if(event.key==='ArrowLeft'){event.preventDefault();show(group,index-1);}
  });
})();
