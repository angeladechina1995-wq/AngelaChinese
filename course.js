
let language=localStorage.getItem("lang")||"zh";
const lang=document.getElementById("lang");
const theme=document.getElementById("theme");

function applyLanguage(){
  document.documentElement.lang=language==="zh"?"zh-CN":"es";
  document.querySelectorAll("[data-zh][data-es]").forEach(el=>{
    el.textContent=el.dataset[language];
  });
  if(lang) lang.textContent=language==="zh"?"ES":"中";
}

if(lang){
  lang.onclick=()=>{
    language=language==="zh"?"es":"zh";
    localStorage.setItem("lang",language);
    applyLanguage();
  };
}

if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
  if(theme) theme.textContent="☀";
}
if(theme){
  theme.onclick=()=>{
    document.body.classList.toggle("dark");
    const dark=document.body.classList.contains("dark");
    theme.textContent=dark?"☀":"☾";
    localStorage.setItem("theme",dark?"dark":"light");
  };
}
applyLanguage();
