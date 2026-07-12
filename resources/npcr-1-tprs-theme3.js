
(() => {
  const STATE_KEY="npcr1TprsTheme3V1";
  const panels=[1,2,3,4,5].map(n=>document.getElementById(`panel${n}`));
  const indicators=[...document.querySelectorAll("[data-step-indicator]")];

  const clues={
    canteen:{q:"食堂在哪儿？",a:"食堂在校门右边。",es:"El comedor está a la derecha de la puerta.",pyQ:"Shítáng zài nǎr?",pyA:"Shítáng zài xiàomén yòubian."},
    library:{q:"图书馆在哪儿？",a:"图书馆在食堂北边。",es:"La biblioteca está al norte del comedor.",pyQ:"Túshūguǎn zài nǎr?",pyA:"Túshūguǎn zài shítáng běibian."},
    west:{q:"图书馆西边是什么？",a:"图书馆西边是体育馆。",es:"Al oeste de la biblioteca está el polideportivo.",pyQ:"Túshūguǎn xībian shì shénme?",pyA:"Túshūguǎn xībian shì tǐyùguǎn."},
    east:{q:"图书馆东边是什么？",a:"图书馆东边是银行。",es:"Al este de la biblioteca está el banco.",pyQ:"Túshūguǎn dōngbian shì shénme?",pyA:"Túshūguǎn dōngbian shì yínháng."},
    teaching:{q:"教学楼在哪儿？",a:"教学楼在食堂东边。",es:"El edificio de aulas está al este del comedor.",pyQ:"Jiàoxuélóu zài nǎr?",pyA:"Jiàoxuélóu zài shítáng dōngbian."}
  };

  const mapFeedback={
    B:{zh:"地图B把图书馆放在了体育馆西边，不符合“体育馆在图书馆西边”。",es:"El mapa B coloca la biblioteca al oeste del polideportivo, pero la pista dice lo contrario."},
    C:{zh:"地图C把银行放在图书馆西边，不符合“银行在图书馆东边”。",es:"El mapa C coloca el banco al oeste de la biblioteca, pero debe estar al este."},
    D:{zh:"地图D把教学楼和食堂的位置换了。食堂应该在校门右边，教学楼在食堂东边。",es:"El mapa D intercambia el comedor y el edificio de aulas."}
  };

  const quiz=[
    {
      scene:{
        icon:"🏫",
        label:{zh:"场景一 · 校门口",es:"Escena 1 · Entrada"},
        who:{zh:"新同学第一次来到学校。",es:"Una estudiante llega por primera vez al campus."},
        prompt:{zh:"她问：“食堂在哪儿？”",es:"Pregunta: «¿Dónde está el comedor?»"}
      },
      q:{zh:"你会怎么回答？",es:"¿Cómo responderías?"},
      o:["在校门右边。","在图书馆北边。","在银行东边。"],
      c:0,
      e:{
        zh:"很好！她现在知道食堂在校门右边了。表示位置时可以说：地点＋在＋地点＋方位。",
        es:"¡Muy bien! Ahora sabe que el comedor está a la derecha de la entrada. Para indicar posición: lugar + 在 + lugar + dirección."
      },
      pyQ:"Nǐ huì zěnme huídá?",
      py:["Zài xiàomén yòubian.","Zài túshūguǎn běibian.","Zài yínháng dōngbian."]
    },
    {
      scene:{
        icon:"🗺️",
        label:{zh:"场景二 · 校园地图",es:"Escena 2 · Mapa del campus"},
        who:{zh:"你和新同学一起看校园地图。",es:"Miras el mapa con la estudiante nueva."},
        prompt:{zh:"她问：“图书馆在哪儿？”",es:"Pregunta: «¿Dónde está la biblioteca?»"}
      },
      q:{zh:"你会告诉她什么？",es:"¿Qué le dirías?"},
      o:["在食堂北边。","在食堂南边。","在教学楼东边。"],
      c:0,
      e:{
        zh:"对！这样她就能找到图书馆了。图书馆在食堂北边。",
        es:"¡Correcto! Así podrá encontrarla: la biblioteca está al norte del comedor."
      },
      pyQ:"Nǐ huì gàosu tā shénme?",
      py:["Zài shítáng běibian.","Zài shítáng nánbian.","Zài jiàoxuélóu dōngbian."]
    },
    {
      scene:{
        icon:"🏀",
        label:{zh:"场景三 · 图书馆门口",es:"Escena 3 · Frente a la biblioteca"},
        who:{zh:"朋友站在图书馆门口。",es:"Tu amigo está frente a la biblioteca."},
        prompt:{zh:"他问：“西边是什么？”",es:"Pregunta: «¿Qué hay al oeste?»"}
      },
      q:{zh:"你会怎么回答？",es:"¿Cómo responderías?"},
      o:["体育馆","银行","教学楼"],
      c:0,
      e:{
        zh:"很好！图书馆西边是体育馆。",
        es:"¡Muy bien! Al oeste de la biblioteca está el polideportivo."
      },
      pyQ:"Nǐ huì zěnme huídá?",
      py:["Tǐyùguǎn","Yínháng","Jiàoxuélóu"]
    },
    {
      scene:{
        icon:"🏦",
        label:{zh:"场景四 · 找银行",es:"Escena 4 · Buscar el banco"},
        who:{zh:"新同学想去银行。",es:"La estudiante quiere ir al banco."},
        prompt:{zh:"她已经站在图书馆前面。",es:"Ya está delante de la biblioteca."}
      },
      q:{zh:"你会告诉她银行在哪儿？",es:"¿Dónde le dirías que está el banco?"},
      o:["银行在图书馆东边。","银行在体育馆西边。","银行在校门南边。"],
      c:0,
      e:{
        zh:"对！银行在图书馆东边，她现在知道往哪边走了。",
        es:"¡Correcto! El banco está al este de la biblioteca; ahora sabe hacia dónde ir."
      },
      pyQ:"Nǐ huì gàosu tā yínháng zài nǎr?",
      py:["Yínháng zài túshūguǎn dōngbian.","Yínháng zài tǐyùguǎn xībian.","Yínháng zài xiàomén nánbian."]
    },
    {
      scene:{
        icon:"🏫",
        label:{zh:"场景五 · 介绍校园",es:"Escena 5 · Presentar el campus"},
        who:{zh:"你带新同学参观学校。",es:"Acompañas a la estudiante por el campus."},
        prompt:{zh:"你想告诉她学校里有银行。",es:"Quieres decirle que hay un banco en la escuela."}
      },
      q:{zh:"你会怎么说？",es:"¿Qué dirías?"},
      o:["学校里有一个银行。","银行是学校里。","学校有在银行。"],
      c:0,
      e:{
        zh:"很好！“处所＋有＋事物”表示某个地方存在某物：学校里有一个银行。",
        es:"¡Muy bien! Lugar + 有 + objeto expresa existencia: hay un banco en la escuela."
      },
      pyQ:"Nǐ huì zěnme shuō?",
      py:["Xuéxiào lǐ yǒu yí ge yínháng.","Yínháng shì xuéxiào lǐ.","Xuéxiào yǒu zài yínháng."]
    },
    {
      scene:{
        icon:"🧭",
        label:{zh:"场景六 · 看地图",es:"Escena 6 · Mirar el mapa"},
        who:{zh:"老师指着图书馆西边的位置。",es:"La profesora señala el lado oeste de la biblioteca."},
        prompt:{zh:"她问：“这里是什么？”",es:"Pregunta: «¿Qué hay aquí?»"}
      },
      q:{zh:"你会怎么回答？",es:"¿Cómo responderías?"},
      o:["图书馆西边是体育馆。","图书馆西边有在体育馆。","体育馆在是西边。"],
      c:0,
      e:{
        zh:"对！“方位＋是＋地点”可以说明某个位置是什么：图书馆西边是体育馆。",
        es:"¡Correcto! Posición + 是 + lugar indica qué hay allí."
      },
      pyQ:"Nǐ huì zěnme huídá?",
      py:["Túshūguǎn xībian shì tǐyùguǎn.","Túshūguǎn xībian yǒu zài tǐyùguǎn.","Tǐyùguǎn zài shì xībian."]
    },
    {
      scene:{
        icon:"🙂",
        label:{zh:"场景七 · 帮助新同学",es:"Escena 7 · Ayudar"},
        who:{zh:"新同学第一次来学校，不认识校园。",es:"La estudiante no conoce el campus."},
        prompt:{zh:"你想主动帮助她。",es:"Quieres ayudarla."}
      },
      q:{zh:"你会怎么说？",es:"¿Qué le dirías?"},
      o:["我给你介绍一下校园。","我跟你校园介绍。","你给我校园。"],
      c:0,
      e:{
        zh:"很好！“给＋人＋动词”表示动作的对象：我给你介绍一下校园。",
        es:"¡Muy bien! 给 + persona + verbo marca el destinatario de la acción."
      },
      pyQ:"Nǐ huì zěnme shuō?",
      py:["Wǒ gěi nǐ jièshào yíxià xiàoyuán.","Wǒ gēn nǐ xiàoyuán jièshào.","Nǐ gěi wǒ xiàoyuán."]
    }
  ];

  const routes={
    "图书馆":{zh:"你先到食堂。图书馆在食堂北边，体育馆在图书馆西边，银行在图书馆东边。",py:"Nǐ xiān dào shítáng. Túshūguǎn zài shítáng běibian, tǐyùguǎn zài túshūguǎn xībian, yínháng zài túshūguǎn dōngbian."},
    "教学楼":{zh:"食堂在校门右边，教学楼在食堂东边。",py:"Shítáng zài xiàomén yòubian, jiàoxuélóu zài shítáng dōngbian."},
    "食堂":{zh:"食堂在校门右边。",py:"Shítáng zài xiàomén yòubian."},
    "银行":{zh:"你先到食堂，再到图书馆。银行在图书馆东边。",py:"Nǐ xiān dào shítáng, zài dào túshūguǎn. Yínháng zài túshūguǎn dōngbian."}
  };


  function distributeQuizAnswers(targetPositions){
    quiz.forEach((item,index)=>{
      const correctIndex=item.c;
      const otherIndices=item.o
        .map((_,optionIndex)=>optionIndex)
        .filter(optionIndex=>optionIndex!==correctIndex);
      const order=[...otherIndices];
      order.splice(targetPositions[index],0,correctIndex);

      item.o=order.map(optionIndex=>item.o[optionIndex]);
      item.py=order.map(optionIndex=>item.py[optionIndex]);
      item.c=targetPositions[index];
    });
  }
  distributeQuizAnswers([1,2,0,2,1,0,1]);

  let state={step:1,clues:[],wrongMaps:0,identified:false,quizIndex:0,quizScore:0,answered:false,finalText:"",finalPinyin:"",finalProfile:null,completed:false,stars:0};
  try{state=Object.assign(state,JSON.parse(localStorage.getItem(STATE_KEY)||"{}"));}catch{}

  const lang=()=>typeof language!=="undefined"&&language==="es"?"es":"zh";
  const pySpan=t=>`<span class="learning-pinyin">${t}</span>`;
  function save(){try{localStorage.setItem(STATE_KEY,JSON.stringify(state));}catch{}}

  function buttonLabel(button, zh, es) {
    if (!button) return;
    button.textContent = (langNow ? langNow() : lang()) === "zh" ? zh : es;
  }

  function restoreButtonLabel(button) {
    if (!button) return;
    buttonLabel(button, button.dataset.zh || "听一遍", button.dataset.es || "Escuchar");
  }

  function speak(text, triggerButton = null) {
    const content = String(text || "").trim();
    if (!content) {
      buttonLabel(triggerButton, "没有可朗读的内容", "No hay contenido");
      window.setTimeout(() => restoreButtonLabel(triggerButton), 1400);
      return false;
    }
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      buttonLabel(triggerButton, "浏览器不支持朗读", "Audio no compatible");
      window.setTimeout(() => restoreButtonLabel(triggerButton), 1800);
      return false;
    }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(content);
      u.lang = "zh-CN";
      u.rate = .78;
      const voices = window.speechSynthesis.getVoices?.() || [];
      u.voice = voices.find(v => /^zh-CN/i.test(v.lang)) || voices.find(v => /^zh/i.test(v.lang)) || null;
      u.onstart = () => buttonLabel(triggerButton, "正在播放…", "Reproduciendo…");
      u.onend = () => restoreButtonLabel(triggerButton);
      u.onerror = () => {
        buttonLabel(triggerButton, "播放失败", "Error de audio");
        window.setTimeout(() => restoreButtonLabel(triggerButton), 1600);
      };
      window.setTimeout(() => window.speechSynthesis.speak(u), 40);
      return true;
    } catch (error) {
      console.error("speech failed", error);
      buttonLabel(triggerButton, "播放失败", "Error de audio");
      window.setTimeout(() => restoreButtonLabel(triggerButton), 1600);
      return false;
    }
  }

  async function copyTextWithFallback(text) {
    const content = String(text || "").trim();
    if (!content) return false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(content);
        return true;
      }
    } catch {}
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    let copied = false;
    try {
      copied = Boolean(document.execCommand && document.execCommand("copy"));
    } catch {}
    textarea.remove();
    return copied;
  }

  function printProfile(target) {
    if (!target) return;
    target.classList.add("print-target");
    document.body.classList.add("print-profile-mode");
    window.print();
    window.setTimeout(() => {
      document.body.classList.remove("print-profile-mode");
      target.classList.remove("print-target");
    }, 300);
  }

  function show(step) {
    const requested = Math.max(1, Math.min(5, Number(step) || 1));
    state.maxStep = Math.max(Number(state.maxStep) || Number(state.step) || 1, requested);
    state.step = requested;

    panels.forEach((panel, index) => {
      panel.hidden = index + 1 !== requested;
    });

    indicators.forEach((indicator, index) => {
      const n = index + 1;
      const unlocked = n <= state.maxStep;
      indicator.classList.toggle("active", n === requested);
      indicator.classList.toggle("done", n < state.maxStep);
      indicator.classList.toggle("unlocked", unlocked);
      indicator.classList.toggle("locked", !unlocked);
      indicator.setAttribute("aria-disabled", unlocked ? "false" : "true");
      indicator.tabIndex = unlocked ? 0 : -1;
    });

    updateStageNavigation();
    save();
    window.scrollTo({top:0, behavior:"smooth"});
  }

  const stageNavigationLabels = [
    {zh:"听校园故事", es:"Historia"},
    {zh:"问方位", es:"Posiciones"},
    {zh:"选地图", es:"Mapa"},
    {zh:"再确认", es:"Confirmar"},
    {zh:"做向导卡", es:"Guía"}
  ];

  function currentStageLanguage() {
    try {
      if (typeof langNow === "function") return langNow();
      if (typeof lang === "function") return lang();
    } catch (error) {}
    return "zh";
  }

  function stageLabel(step) {
    const item = stageNavigationLabels[step - 1] || stageNavigationLabels[0];
    return currentStageLanguage() === "zh" ? item.zh : item.es;
  }

  function updateStageNavigation() {
    const current = Number(state.step) || 1;
    document.querySelectorAll("[data-stage-prev]").forEach(button => {
      const target = Number(button.dataset.stagePrev);
      button.hidden = current <= 1 || target !== current - 1;
      button.disabled = target < 1;
      button.textContent = currentStageLanguage() === "zh"
        ? `← 返回${stageLabel(target)}`
        : `← Volver a ${stageLabel(target)}`;
    });
  }

  function installStageNavigation() {
    state.maxStep = Math.max(Number(state.maxStep) || 1, Number(state.step) || 1);

    panels.forEach((panel, index) => {
      const step = index + 1;
      if (step <= 1 || panel.querySelector("[data-stage-prev]")) return;

      const nav = document.createElement("div");
      nav.className = "stage-back-navigation";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "game-button stage-back-button";
      button.dataset.stagePrev = String(step - 1);
      button.addEventListener("click", () => show(step - 1));

      nav.appendChild(button);
      panel.insertBefore(nav, panel.firstChild);
    });

    indicators.forEach((indicator, index) => {
      const target = index + 1;
      const activate = () => {
        if (target <= (Number(state.maxStep) || 1)) {
          show(target);
        }
      };

      indicator.addEventListener("click", activate);
      indicator.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
    });

    updateStageNavigation();
  }

  installStageNavigation();


  document.querySelectorAll("[data-speech-target]").forEach(b=>b.onclick=()=>{const el=document.getElementById(b.dataset.speechTarget);if(el)speak(el.textContent.trim());});
  document.getElementById("startCampusMystery").onclick=()=>show(2);

  const clueBoard=document.getElementById("campusClueBoard");
  const counter=document.getElementById("campusClueCounter");
  const openMaps=document.getElementById("openCampusMaps");

  function renderClues(){
    clueBoard.innerHTML="";
    state.clues.forEach(key=>{
      const c=clues[key];
      const card=document.createElement("article");
      card.className="clue-card";
      card.innerHTML=`<strong>${c.q}${pySpan(c.pyQ)}</strong><p>${c.a}${pySpan(c.pyA)}</p><p lang="es">${c.es}</p>`;
      const repeat=document.createElement("button");
      repeat.className="clue-repeat";repeat.type="button";repeat.textContent=lang()==="zh"?"再听一次":"Escuchar de nuevo";repeat.onclick=()=>speak(`${c.q} ${c.a}`);
      card.appendChild(repeat);clueBoard.appendChild(card);
    });
    document.querySelectorAll(".question-button").forEach(b=>b.classList.toggle("asked",state.clues.includes(b.dataset.question)));
    counter.textContent=lang()==="zh"?`已收集${state.clues.length}/5条线索`:`${state.clues.length}/5 pistas`;
    openMaps.disabled=state.clues.length<4;
    const evidenceText=document.getElementById("campusEvidenceText");
    const evidenceBar=document.getElementById("campusEvidenceBar");
    if(evidenceText) evidenceText.textContent=`${state.clues.length} / 5`;
    if(evidenceBar) evidenceBar.style.width=`${state.clues.length / 5 * 100}%`;
  }

  document.querySelectorAll(".question-button").forEach(b=>b.onclick=()=>{const key=b.dataset.question;if(!state.clues.includes(key))state.clues.push(key);save();speak(`${clues[key].q} ${clues[key].a}`);renderClues();});
  openMaps.onclick=()=>show(3);

  const feedback=document.getElementById("campusMapFeedback");
  const recap=document.getElementById("campusRecap");
  document.querySelectorAll(".map-choice").forEach(b=>b.onclick=()=>{
    const map=b.dataset.map;
    if(map==="A"){
      state.identified=true;feedback.className="game-feedback good";feedback.textContent=lang()==="zh"?"推理正确！地图A符合全部方位线索。":"¡Correcto! El mapa A coincide con todas las pistas.";recap.hidden=false;document.querySelectorAll(".map-choice").forEach(x=>x.disabled=true);save();speak("食堂在校门右边。图书馆在食堂北边。体育馆在图书馆西边，银行在图书馆东边。教学楼在食堂东边。");
    }else{
      state.wrongMaps++;feedback.className="game-feedback bad";feedback.textContent=mapFeedback[map][lang()];save();
    }
  });

  document.getElementById("startCampusQuiz").onclick=()=>{state.quizIndex=0;state.quizScore=0;state.answered=false;save();show(4);renderQuiz();};
  const qProgress=document.getElementById("campusQuizProgress");
  const qQuestion=document.getElementById("campusQuizQuestion");
  const qOptions=document.getElementById("campusQuizOptions");
  const qFeedback=document.getElementById("campusQuizFeedback");
  const qNext=document.getElementById("nextCampusQuiz");

  function renderQuiz(){
    const item=quiz[state.quizIndex];
    qProgress.textContent=`${state.quizIndex+1} / ${quiz.length}`;

    const sceneIcon=document.getElementById("campusSceneIcon");
    const sceneLabel=document.getElementById("campusSceneLabel");
    const sceneWho=document.getElementById("campusSceneWho");
    const scenePrompt=document.getElementById("campusScenePrompt");
    if(sceneIcon) sceneIcon.textContent=item.scene.icon;
    if(sceneLabel) sceneLabel.textContent=item.scene.label[lang()];
    if(sceneWho) sceneWho.textContent=item.scene.who[lang()];
    if(scenePrompt) scenePrompt.textContent=item.scene.prompt[lang()];

    qQuestion.innerHTML=(lang()==="zh"?item.q.zh:`${item.q.es}<span class="quiz-chinese-source">${item.q.zh}</span>`)+pySpan(item.pyQ);
    qOptions.innerHTML="";state.answered=false;qNext.disabled=true;qFeedback.className="game-feedback";qFeedback.textContent=lang()==="zh"?"选择一个答案。":"Elige una respuesta.";
    item.o.forEach((o,i)=>{const b=document.createElement("button");b.className="quiz-option";b.type="button";b.innerHTML=`<span>${o}</span>${pySpan(item.py[i])}`;b.onclick=()=>answerQuiz(i,b);qOptions.appendChild(b);});
    qNext.textContent=state.quizIndex===quiz.length-1?(lang()==="zh"?"查看结果 →":"Ver resultado →"):(lang()==="zh"?"下一题 →":"Siguiente →");
  }
  function answerQuiz(i,b){
    if(state.answered)return;state.answered=true;const item=quiz[state.quizIndex];[...qOptions.children].forEach((x,j)=>{x.disabled=true;if(j===item.c)x.classList.add("correct")});
    if(i===item.c){
      state.quizScore++;
      qFeedback.className="game-feedback good";
      qFeedback.textContent=item.e[lang()];
      speak(item.o[item.c]);
    }else{
      b.classList.add("wrong");
      qFeedback.className="game-feedback bad";
      qFeedback.textContent=lang()==="zh"
        ? `这个回答不能帮助对方。再看线索：${item.e.zh}`
        : `Esta respuesta no ayuda en la escena. Revisa: ${item.e.es}`;
    }
    qNext.disabled=false;save();
  }
  qNext.onclick=()=>{if(state.quizIndex<quiz.length-1){state.quizIndex++;save();renderQuiz();}else show(5);};

  const finalCard=document.getElementById("campusFinalCard");
  const finalText=document.getElementById("campusFinalText");
  const finalPy=document.getElementById("campusFinalPinyin");
  const result=document.getElementById("campusThemeResult");
  const campusGuide=document.getElementById("campusCardGuide");
  const campusFriend=document.getElementById("campusCardFriend");
  const campusDestination=document.getElementById("campusCardDestination");
  const campusRoute=document.getElementById("campusCardRoute");
  const campusRoutePy=document.getElementById("campusCardRoutePinyin");

  function renderCampusProfile(profile){
    if(!profile) return;
    campusGuide.textContent = profile.name;
    campusFriend.textContent = profile.friend;
    campusDestination.textContent = profile.destination;
    campusRoute.textContent = profile.routeZh;
    campusRoutePy.textContent = profile.routePy;
  }

  function parseLegacyCampus(text){
    const m=String(text||"").match(/^(.+?)，你好！你跟我来，我给你介绍一下校园。你现在在校门。(.*) (.+)$/);
    if(!m) return null;
    let destination="";
    for(const key in routes){ if(routes[key].zh===m[2]) destination=key; }
    return {friend:m[1], routeZh:m[2], name:m[3], destination, routePy: destination && routes[destination] ? routes[destination].py : ""};
  }

  document.getElementById("printCampusSolvedCard")?.addEventListener("click",()=>printProfile(document.getElementById("campusSolvedCard")));
  document.getElementById("printCampusCard")?.addEventListener("click",()=>printProfile(document.getElementById("printableCampusCard")));
  function stars(){if(state.wrongMaps===0&&state.quizScore>=6)return 3;if(state.quizScore>=4)return 2;return 1;}
  document.getElementById("generateCampusCard").onclick=()=>{
    const name=document.getElementById("guideName").value.trim();
    const friend=document.getElementById("guideFriend").value.trim();
    const destination=document.getElementById("guideDestination").value;
    if(!name||!friend||!destination){alert(lang()==="zh"?"请先填写全部信息。":"Completa todos los datos.");return;}
    const route=routes[destination];
    const text=`${friend}，你好！你跟我来，我给你介绍一下校园。你现在在校门。${route.zh} ${name}`;
    const py=`${friend}, nǐ hǎo! Nǐ gēn wǒ lái, wǒ gěi nǐ jièshào yíxià xiàoyuán. Nǐ xiànzài zài xiàomén. ${route.py} ${name}`;
    const profile={name,friend,destination,routeZh:route.zh,routePy:route.py};
    state.finalText=text;state.finalPinyin=py;state.finalProfile=profile;state.completed=true;state.stars=stars();save();
    renderCampusProfile(profile);finalText.textContent=text;finalPy.textContent=py;finalCard.hidden=false;result.hidden=false;
    document.getElementById("campusResultStars").textContent="★".repeat(state.stars)+"☆".repeat(3-state.stars);
    document.getElementById("campusResultMessage").textContent=lang()==="zh"?`你收集了${state.clues.length}条线索，路线确认题答对${state.quizScore}/7题。`:`Has reunido ${state.clues.length} pistas y acertado ${state.quizScore}/7 preguntas.`;
    speak(text);
  };
  document.getElementById("speakCampusCard").onclick=e=>speak(state.finalText||finalText.textContent.trim(),e.currentTarget);
  document.getElementById("copyCampusCard").onclick=async e=>{const ok=await copyTextWithFallback(state.finalText||finalText.textContent.trim());buttonLabel(e.currentTarget,ok?"已复制":"复制失败",ok?"Copiado":"No se pudo copiar");window.setTimeout(()=>restoreButtonLabel(e.currentTarget),1600)};
  document.getElementById("resetCampusTheme").onclick=()=>{if(confirm(lang()==="zh"?"确定重新开始吗？":"¿Reiniciar?")){localStorage.removeItem(STATE_KEY);location.reload();}};

  document.getElementById("lang")?.addEventListener("click",()=>setTimeout(()=>{renderClues();if(!document.getElementById("panel4").hidden)renderQuiz();},0));
  renderClues();
  if(state.finalText){if(!state.finalProfile){state.finalProfile=parseLegacyCampus(state.finalText);save();}renderCampusProfile(state.finalProfile);finalText.textContent=state.finalText;finalPy.textContent=state.finalPinyin;finalCard.hidden=false;result.hidden=false;}
  if(state.completed)show(5);else if(state.identified){show(4);state.quizIndex=0;state.quizScore=0;renderQuiz();}else if(state.clues.length>=4)show(3);else if(state.clues.length)show(2);else show(1);
})();
