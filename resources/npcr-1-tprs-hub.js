
(() => {
  const themes = [
    {key:"npcr1TprsTheme1V1", href:"npcr-1-tprs-theme-1.html"},
    {key:"npcr1TprsTheme2V2", href:"npcr-1-tprs-theme-2.html"},
    {key:"npcr1TprsTheme3V1", href:"npcr-1-tprs-theme-3.html"},
    {key:"npcr1TprsTheme4V1", href:"npcr-1-tprs-theme-4.html"},
    {key:"npcr1TprsTheme5V1", href:"npcr-1-tprs-theme-5.html"}
  ];

  function completedAt(index){
    const theme=themes[index];
    if(!theme) return false;
    try{
      return Boolean(JSON.parse(localStorage.getItem(theme.key)||"{}").completed);
    }catch{
      return false;
    }
  }

  function updateHub(){
    const completed=themes.filter((_,index)=>completedAt(index)).length;
    const percent=Math.round(completed/5*100);
    const es=typeof language!=="undefined" && language==="es";

    const bar=document.getElementById("hubProgressBar");
    const number=document.getElementById("hubProgressNumber");
    const text=document.getElementById("hubProgressText");

    if(bar) bar.style.width=`${percent}%`;
    if(number) number.textContent=`${percent}%`;
    if(text){
      text.dataset.zh=`已完成${completed}/5个主题`;
      text.dataset.es=`${completed}/5 temas completados`;
      text.textContent=es?text.dataset.es:text.dataset.zh;
    }

    document.querySelectorAll(".theme-card.available").forEach((card,index)=>{
      const action=card.querySelector(".theme-action");
      const done=completedAt(index);
      card.querySelectorAll(".theme-status.done").forEach(badge=>badge.remove());

      if(action){
        action.dataset.zh=done?"再次体验 →":"开始推理 →";
        action.dataset.es=done?"Jugar de nuevo →":"Empezar →";
        action.textContent=es?action.dataset.es:action.dataset.zh;
      }

      if(done){
        const badge=document.createElement("span");
        badge.className="theme-status done";
        badge.dataset.zh="✓ 已完成";
        badge.dataset.es="✓ Completado";
        badge.textContent=es?badge.dataset.es:badge.dataset.zh;
        if(action) action.insertAdjacentElement("beforebegin",badge);
      }
    });
  }

  document.getElementById("lang")?.addEventListener("click",()=>setTimeout(updateHub,0));
  window.addEventListener("pageshow",updateHub);
  updateHub();
})();
