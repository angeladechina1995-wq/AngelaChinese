
(() => {
  const STATE_KEY="npcr1TprsTheme5V1";
  const panels=[1,2,3,4,5].map(n=>document.getElementById(`panel${n}`));
  const indicators=[...document.querySelectorAll("[data-step-indicator]")];

  const clues={
    weather:{q:"天气怎么了？",a:"天气冷了，也下雪了。",es:"El tiempo se ha vuelto frío y también ha nevado.",pyQ:"Tiānqì zěnme le?",pyA:"Tiānqì lěng le, yě xiàxuě le."},
    place:{q:"力波去哪儿了？",a:"他去王府井了。",es:"Ha ido a Wangfujing.",pyQ:"Lìbō qù nǎr le?",pyA:"Tā qù Wángfǔjǐng le."},
    transport:{q:"他怎么去的？",a:"他坐地铁去的。",es:"Fue en metro.",pyQ:"Tā zěnme qù de?",pyA:"Tā zuò dìtiě qù de."},
    purpose:{q:"他去做什么？",a:"他去给爸爸妈妈买圣诞节礼物。",es:"Fue a comprar regalos de Navidad para sus padres.",pyQ:"Tā qù zuò shénme?",pyA:"Tā qù gěi bàba māma mǎi Shèngdànjié lǐwù."},
    message:{q:"谁让他给妈妈打电话？",a:"他哥哥让他给妈妈打电话。",es:"Su hermano mayor le pidió que llamara a su madre.",pyQ:"Shéi ràng tā gěi māma dǎ diànhuà?",pyA:"Tā gēge ràng tā gěi māma dǎ diànhuà."},
    brother:{q:"弟弟回加拿大了吗？",a:"没有，他去旅行了。",es:"No; se ha ido de viaje.",pyQ:"Dìdi huí Jiānádà le ma?",pyA:"Méiyǒu, tā qù lǚxíng le."}
  };

  const wrong={
    B:{zh:"顺序B先打电话，而且把购物和医院混在了一起，不符合证据。",es:"La secuencia B empieza con la llamada y mezcla compras con el hospital."},
    C:{zh:"顺序C的交通、地点和打电话的人都不对。",es:"En la secuencia C son incorrectos el transporte, el lugar y quien pide llamar."},
    D:{zh:"顺序D说天气热了、坐飞机去王府井，也不符合任何证据。",es:"La secuencia D dice que hace calor y que viaja en avión, lo cual contradice las pistas."}
  };

  const quiz=[
    {scene:{icon:"❄️",label:{zh:"场景一 · 天气变了",es:"Escena 1 · Ha cambiado el tiempo"},who:{zh:"朋友准备出门买礼物。",es:"Tu amigo se prepara para salir a comprar regalos."},prompt:{zh:"他看见外面下雪了。",es:"Ve que está nevando."}},q:{zh:"他会怎么说？",es:"¿Qué diría?"},o:["天气冷了，也下雪了。","天气冷，也下雪。","天气了冷，下雪也。"],c:0,e:{zh:"很好！句末“了”表示天气出现了变化：天气冷了，也下雪了。",es:"¡Muy bien! El 了 final expresa un cambio: ahora hace frío y ha empezado a nevar."},pyQ:"Tā huì zěnme shuō?",py:["Tiānqì lěng le, yě xiàxuě le.","Tiānqì lěng, yě xiàxuě.","Tiānqì le lěng, xiàxuě yě."]},
    {scene:{icon:"🚇",label:{zh:"场景二 · 去买礼物",es:"Escena 2 · Ir a comprar regalos"},who:{zh:"朋友要去王府井。",es:"Tu amigo quiere ir a Wangfujing."},prompt:{zh:"天气冷，路上可能堵车。",es:"Hace frío y puede haber tráfico."}},q:{zh:"你建议他怎么去？",es:"¿Cómo le aconsejarías ir?"},o:["坐地铁去。","地铁坐去。","去坐王府井。"],c:0,e:{zh:"对！表示交通方式可以说“坐地铁去”。",es:"¡Correcto! Para indicar el medio de transporte se puede decir «坐地铁去» (ir en metro)."},pyQ:"Nǐ jiànyì tā zěnme qù?",py:["Zuò dìtiě qù.","Dìtiě zuò qù.","Qù zuò Wángfǔjǐng."]},
    {scene:{icon:"🎁",label:{zh:"场景三 · 商店里",es:"Escena 3 · En la tienda"},who:{zh:"朋友想给爸爸妈妈买礼物。",es:"Tu amigo quiere comprar regalos para sus padres."},prompt:{zh:"店员问：“你给谁买礼物？”",es:"El dependiente pregunta: «¿Para quién compras el regalo?»"}},q:{zh:"他会怎么回答？",es:"¿Cómo respondería?"},o:["我给爸爸妈妈买礼物。","我买爸爸妈妈给礼物。","爸爸妈妈我礼物给。"],c:0,e:{zh:"很好！“给＋人＋动词”表示动作的对象：我给爸爸妈妈买礼物。",es:"¡Muy bien! 给 + persona + verbo indica para quién se realiza la acción."},pyQ:"Tā huì zěnme huídá?",py:["Wǒ gěi bàba māma mǎi lǐwù.","Wǒ mǎi bàba māma gěi lǐwù.","Bàba māma wǒ lǐwù gěi."]},
    {scene:{icon:"📱",label:{zh:"场景四 · 收到短信",es:"Escena 4 · Recibir un mensaje"},who:{zh:"朋友买完礼物以后看到了哥哥的短信。",es:"Después de comprar los regalos, tu amigo ve un mensaje de su hermano."},prompt:{zh:"哥哥让他给妈妈打电话。",es:"Su hermano le pide que llame a su madre."}},q:{zh:"他接下来应该做什么？",es:"¿Qué debería hacer después?"},o:["给妈妈打电话。","给哥哥买地铁。","给天气下雪。"],c:0,e:{zh:"对！哥哥让他给妈妈打电话，所以他接下来应该打电话。",es:"¡Correcto! Su hermano le pide que llame a su madre, así que eso es lo que debe hacer después."},pyQ:"Tā jiēxiàlái yīnggāi zuò shénme?",py:["Gěi māma dǎ diànhuà.","Gěi gēge mǎi dìtiě.","Gěi tiānqì xiàxuě."]},
    {scene:{icon:"✅",label:{zh:"场景五 · 礼物准备好了",es:"Escena 5 · Los regalos ya están listos"},who:{zh:"朋友已经买好了礼物。",es:"Tu amigo ya ha comprado los regalos."},prompt:{zh:"你问：“礼物买好了吗？”",es:"Le preguntas: «¿Ya están comprados los regalos?»"}},q:{zh:"他会怎么回答？",es:"¿Cómo respondería?"},o:["我已经买好礼物了。","我已经礼物买。","我买好是不是礼物。"],c:0,e:{zh:"很好！“已经……了”表示事情已经完成：我已经买好礼物了。",es:"¡Muy bien! «已经…了» indica que la acción ya se ha completado."},pyQ:"Tā huì zěnme huídá?",py:["Wǒ yǐjīng mǎihǎo lǐwù le.","Wǒ yǐjīng lǐwù mǎi.","Wǒ mǎihǎo shì bu shì lǐwù."]},
    {scene:{icon:"🤔",label:{zh:"场景六 · 确认计划",es:"Escena 6 · Confirmar el plan"},who:{zh:"你不确定朋友是不是坐地铁去。",es:"No estás seguro de si tu amigo irá en metro."},prompt:{zh:"你想确认一下。",es:"Quieres confirmarlo."}},q:{zh:"你会怎么问？",es:"¿Cómo lo preguntarías?"},o:["你坐地铁去，是不是？","你是不是地铁坐去。","地铁你去是不是坐。"],c:0,e:{zh:"对！可以在陈述句后加“是不是？”来确认：你坐地铁去，是不是？",es:"¡Correcto! Se puede añadir «是不是？» al final de una afirmación para pedir confirmación."},pyQ:"Nǐ huì zěnme wèn?",py:["Nǐ zuò dìtiě qù, shì bu shì?","Nǐ shì bu shì dìtiě zuò qù.","Dìtiě nǐ qù shì bu shì zuò."]},
    {scene:{icon:"🎉",label:{zh:"场景七 · 节日祝福",es:"Escena 7 · Felicitación"},who:{zh:"朋友已经完成了节日前的准备。",es:"Tu amigo ya ha terminado los preparativos."},prompt:{zh:"你想祝他节日快乐。",es:"Quieres desearle una feliz celebración."}},q:{zh:"你会怎么说？",es:"¿Qué le dirías?"},o:["祝你节日快乐！","你节日祝快乐！","快乐节日你祝！"],c:0,e:{zh:"很好！祝福时可以说：祝你节日快乐！",es:"¡Muy bien! Para felicitar se puede decir «祝你节日快乐！»."},pyQ:"Nǐ huì zěnme shuō?",py:["Zhù nǐ jiérì kuàilè!","Nǐ jiérì zhù kuàilè!","Kuàilè jiérì nǐ zhù!"]},
    {scene:{icon:"🕒",label:{zh:"场景八 · 还原顺序",es:"Escena 8 · Reconstruir el orden"},who:{zh:"朋友向你复述今天发生的事。",es:"Tu amigo te cuenta lo que ha ocurrido hoy."},prompt:{zh:"你要判断哪一句最符合真实顺序。",es:"Debes elegir la frase que mejor respeta el orden real."}},q:{zh:"哪一句最合适？",es:"¿Qué frase es la más adecuada?"},o:["我先坐地铁去王府井买礼物，回来以后看见短信，然后给妈妈打电话。","我先给妈妈打电话，然后才去王府井，最后天气下雪。","我先看见短信，再买礼物，最后才坐地铁。"],c:0,e:{zh:"对！这个顺序和故事一致：出门买礼物 → 回来看短信 → 给妈妈打电话。",es:"¡Correcto! Este orden coincide con la historia: ir a comprar → volver y ver el mensaje → llamar a la madre."},pyQ:"Nǎ yí jù zuì héshì?",py:["Wǒ xiān zuò dìtiě qù Wángfǔjǐng mǎi lǐwù, huílai yǐhòu kànjiàn duǎnxìn, ránhòu gěi māma dǎ diànhuà.","Wǒ xiān gěi māma dǎ diànhuà, ránhòu cái qù Wángfǔjǐng, zuìhòu tiānqì xiàxuě.","Wǒ xiān kànjiàn duǎnxìn, zài mǎi lǐwù, zuìhòu cái zuò dìtiě."]}
  ];

  const festivalPy={"圣诞节":"Shèngdànjié","春节":"Chūnjié"};
  const wishes={"圣诞节":{zh:"圣诞快乐",py:"Shèngdàn kuàilè"},"春节":{zh:"春节快乐",py:"Chūnjié kuàilè"}};
  const weatherPy={"天气冷了，也下雪了":"tiānqì lěng le, yě xiàxuě le","天气暖和了":"tiānqì nuǎnhuo le","天气凉快了":"tiānqì liángkuai le"};
  const transportPy={"坐地铁":"zuò dìtiě","坐公共汽车":"zuò gōnggòng qìchē","打车":"dǎchē"};
  const placePy={"王府井":"Wángfǔjǐng","天安门":"Tiān'ānmén","博物馆":"bówùguǎn","朋友家":"péngyou jiā"};
  const recipientPy={"妈妈":"māma","爸爸妈妈":"bàba māma","朋友":"péngyou","老师":"lǎoshī"};
  const giftPy={"一本书":"yì běn shū","一件衣服":"yí jiàn yīfu","一个小汽车":"yí ge xiǎo qìchē","一盒点心":"yì hé diǎnxin"};
  const callerPy={"哥哥":"gēge","妈妈":"māma","朋友":"péngyou"};
  const callToPy={"妈妈":"māma","外婆":"wàipó","朋友":"péngyou"};


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
  distributeQuizAnswers([1,2,0,1,2,0,2,1]);

  let state={step:1,clues:[],wrongTimelines:0,identified:false,quizIndex:0,quizScore:0,answered:false,finalText:"",finalPinyin:"",finalProfile:null,completed:false,stars:0};
  try{state=Object.assign(state,JSON.parse(localStorage.getItem(STATE_KEY)||"{}"));}catch{}
  const lang=()=>typeof language!=="undefined"&&language==="es"?"es":"zh";
  const py=t=>`<span class="learning-pinyin">${t}</span>`;
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
    {zh:"听节日故事", es:"Historia"},
    {zh:"找时间线索", es:"Pistas"},
    {zh:"排事件顺序", es:"Ordenar"},
    {zh:"帮朋友决定", es:"Ayudar"},
    {zh:"做计划卡", es:"Plan"}
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
  document.getElementById("startHolidayMystery").onclick=()=>show(2);

  const board=document.getElementById("holidayClueBoard"),counter=document.getElementById("holidayClueCounter"),open=document.getElementById("openTimelines");
  function renderClues(){
    board.innerHTML="";
    state.clues.forEach(key=>{const c=clues[key],card=document.createElement("article");card.className="clue-card";card.innerHTML=`<strong>${c.q}${py(c.pyQ)}</strong><p>${c.a}${py(c.pyA)}</p><p lang="es">${c.es}</p>`;const r=document.createElement("button");r.className="clue-repeat";r.type="button";r.textContent=lang()==="zh"?"再听一次":"Escuchar de nuevo";r.onclick=()=>speak(`${c.q} ${c.a}`);card.appendChild(r);board.appendChild(card);});
    document.querySelectorAll(".question-button").forEach(b=>b.classList.toggle("asked",state.clues.includes(b.dataset.question)));
    counter.textContent=lang()==="zh"?`已收集${state.clues.length}/6条线索`:`${state.clues.length}/6 pistas`;open.disabled=state.clues.length<5;
    const evidenceText=document.getElementById("holidayEvidenceText");
    const evidenceBar=document.getElementById("holidayEvidenceBar");
    if(evidenceText) evidenceText.textContent=`${state.clues.length} / 6`;
    if(evidenceBar) evidenceBar.style.width=`${state.clues.length / 6 * 100}%`;
  }
  document.querySelectorAll(".question-button").forEach(b=>b.onclick=()=>{const k=b.dataset.question;if(!state.clues.includes(k))state.clues.push(k);save();speak(`${clues[k].q} ${clues[k].a}`);renderClues();});
  open.onclick=()=>show(3);

  const feedback=document.getElementById("timelineFeedback"),recap=document.getElementById("holidayRecap");
  document.querySelectorAll(".timeline-choice").forEach(b=>b.onclick=()=>{
    const t=b.dataset.timeline;
    if(t==="A"){state.identified=true;feedback.className="game-feedback good";feedback.textContent=lang()==="zh"?"推理正确！顺序A和所有证据一致。":"¡Correcto! La secuencia A coincide con todas las pruebas.";recap.hidden=false;document.querySelectorAll(".timeline-choice").forEach(x=>x.disabled=true);save();speak("天气冷了，也下雪了。力波坐地铁去王府井，给爸爸妈妈买了圣诞节礼物。哥哥让他给妈妈打电话，所以他给妈妈打电话了。");}
    else{state.wrongTimelines++;feedback.className="game-feedback bad";feedback.textContent=wrong[t][lang()];save();}
  });

  document.getElementById("startHolidayQuiz").onclick=()=>{state.quizIndex=0;state.quizScore=0;state.answered=false;save();show(4);renderQuiz();};
  const prog=document.getElementById("holidayQuizProgress"),question=document.getElementById("holidayQuizQuestion"),options=document.getElementById("holidayQuizOptions"),qf=document.getElementById("holidayQuizFeedback"),next=document.getElementById("nextHolidayQuiz");
  function renderQuiz(){
    const item=quiz[state.quizIndex];
    prog.textContent=`${state.quizIndex+1} / ${quiz.length}`;
    const sceneIcon=document.getElementById("holidaySceneIcon"),sceneLabel=document.getElementById("holidaySceneLabel"),sceneWho=document.getElementById("holidaySceneWho"),scenePrompt=document.getElementById("holidayScenePrompt");
    if(sceneIcon)sceneIcon.textContent=item.scene.icon;if(sceneLabel)sceneLabel.textContent=item.scene.label[lang()];if(sceneWho)sceneWho.textContent=item.scene.who[lang()];if(scenePrompt)scenePrompt.textContent=item.scene.prompt[lang()];
    question.innerHTML=(lang()==="zh"?item.q.zh:`${item.q.es}<span class="quiz-chinese-source">${item.q.zh}</span>`)+py(item.pyQ);options.innerHTML="";state.answered=false;next.disabled=true;qf.className="game-feedback";qf.textContent=lang()==="zh"?"选择最能帮助朋友继续准备的回答。":"Elige la respuesta que mejor ayuda a tu amigo a continuar con los preparativos.";
    item.o.forEach((o,i)=>{const b=document.createElement("button");b.className="quiz-option";b.type="button";b.innerHTML=`<span>${o}</span>${py(item.py[i])}`;b.onclick=()=>answer(i,b);options.appendChild(b)});
    next.textContent=state.quizIndex===quiz.length-1?(lang()==="zh"?"查看结果 →":"Ver resultado →"):(lang()==="zh"?"下一个场景 →":"Siguiente situación →");
  }

  function answer(i,b){if(state.answered)return;state.answered=true;const item=quiz[state.quizIndex];[...options.children].forEach((x,j)=>{x.disabled=true;if(j===item.c)x.classList.add("correct")});if(i===item.c){state.quizScore++;qf.className="game-feedback good";qf.textContent=item.e[lang()];speak(item.o[item.c]);}else{b.classList.add("wrong");qf.className="game-feedback bad";qf.textContent=lang()==="zh"?`这个回答不能帮助朋友完成当前准备。再看一次：${item.e.zh}`:`Esta respuesta no ayuda a tu amigo a completar esta parte de los preparativos. Revisa: ${item.e.es}`;}next.disabled=false;save();}

  next.onclick=()=>{if(state.quizIndex<quiz.length-1){state.quizIndex++;save();renderQuiz();}else show(5);};

  const card=document.getElementById("holidayFinalCard"),textEl=document.getElementById("holidayFinalText"),pyEl=document.getElementById("holidayFinalPinyin"),result=document.getElementById("holidayThemeResult");
  const holidayFestivalValue=document.getElementById("holidayFestivalValue");
  const holidayWeatherValue=document.getElementById("holidayWeatherValue");
  const holidayTransportValue=document.getElementById("holidayTransportValue");
  const holidayPlaceValue=document.getElementById("holidayPlaceValue");
  const holidayRecipientValue=document.getElementById("holidayRecipientValue");
  const holidayGiftValue=document.getElementById("holidayGiftValue");
  const holidayCallerValue=document.getElementById("holidayCallerValue");
  const holidayCallToValue=document.getElementById("holidayCallToValue");

  function renderHolidayProfile(profile){
    if(!profile) return;
    holidayFestivalValue.textContent = profile.festival;
    holidayWeatherValue.textContent = profile.weather;
    holidayTransportValue.textContent = profile.transport;
    holidayPlaceValue.textContent = profile.place;
    holidayRecipientValue.textContent = profile.recipient;
    holidayGiftValue.textContent = profile.gift;
    holidayCallerValue.textContent = profile.caller;
    holidayCallToValue.textContent = profile.callTo;
  }

  function parseLegacyHoliday(text){
    const m=String(text||"").match(/^(.+?)。(.+?)快到了。我要(.+?)去(.+?)，给(.+?)买(.+?)。(.+?)让我给(.+?)打电话。我已经买好礼物了。祝你(.+?)！$/);
    if(!m) return null;
    return {weather:m[1],festival:m[2],transport:m[3],place:m[4],recipient:m[5],gift:m[6],caller:m[7],callTo:m[8],wish:m[9]};
  }

  document.getElementById("printHolidaySolvedCard")?.addEventListener("click",()=>printProfile(document.getElementById("holidaySolvedCard")));
  document.getElementById("printHolidayCard")?.addEventListener("click",()=>printProfile(document.getElementById("printableHolidayCard")));
  function stars(){if(state.wrongTimelines===0&&state.quizScore>=7)return 3;if(state.quizScore>=5)return 2;return 1;}
  document.getElementById("generateHolidayCard").onclick=()=>{
    const festival=document.getElementById("planFestival").value,weather=document.getElementById("planWeather").value,transport=document.getElementById("planTransport").value,place=document.getElementById("planPlace").value,recipient=document.getElementById("planRecipient").value,gift=document.getElementById("planGift").value,caller=document.getElementById("planCaller").value,callTo=document.getElementById("planCallTo").value;
    if(!festival||!weather||!transport||!place||!recipient||!gift||!caller||!callTo){alert(lang()==="zh"?"请先填写全部信息。":"Completa todos los datos.");return;}
    const wish=wishes[festival];
    const text=`${weather}。${festival}快到了。我要${transport}去${place}，给${recipient}买${gift}。${caller}让我给${callTo}打电话。我已经买好礼物了。祝你${wish.zh}！`;
    const pinyin=`${weatherPy[weather]}. ${festivalPy[festival]} kuài dào le. Wǒ yào ${transportPy[transport]} qù ${placePy[place]}, gěi ${recipientPy[recipient]} mǎi ${giftPy[gift]}. ${callerPy[caller]} ràng wǒ gěi ${callToPy[callTo]} dǎ diànhuà. Wǒ yǐjīng mǎihǎo lǐwù le. Zhù nǐ ${wish.py}!`;
    const profile={festival,weather,transport,place,recipient,gift,caller,callTo,wish:wish.zh};
    state.finalText=text;state.finalPinyin=pinyin;state.finalProfile=profile;state.completed=true;state.stars=stars();save();renderHolidayProfile(profile);textEl.textContent=text;pyEl.textContent=pinyin;card.hidden=false;result.hidden=false;document.getElementById("holidayResultStars").textContent="★".repeat(state.stars)+"☆".repeat(3-state.stars);document.getElementById("holidayResultMessage").textContent=lang()==="zh"?`你收集了${state.clues.length}条线索，节日确认题答对${state.quizScore}/8题。五个主题全部完成！`:`Has reunido ${state.clues.length} pistas y acertado ${state.quizScore}/8 preguntas. ¡Has completado los cinco temas!`;speak(text);
  };
  document.getElementById("speakHolidayCard").onclick=e=>speak(state.finalText||textEl.textContent.trim(),e.currentTarget);
  document.getElementById("copyHolidayCard").onclick=async e=>{const ok=await copyTextWithFallback(state.finalText||textEl.textContent.trim());buttonLabel(e.currentTarget,ok?"已复制":"复制失败",ok?"Copiado":"No se pudo copiar");window.setTimeout(()=>restoreButtonLabel(e.currentTarget),1600)};
  document.getElementById("resetHolidayTheme").onclick=()=>{if(confirm(lang()==="zh"?"确定重新开始吗？":"¿Reiniciar?")){localStorage.removeItem(STATE_KEY);location.reload();}};
  document.getElementById("lang")?.addEventListener("click",()=>setTimeout(()=>{renderClues();if(!document.getElementById("panel4").hidden)renderQuiz();},0));
  renderClues();if(state.finalText){if(!state.finalProfile){state.finalProfile=parseLegacyHoliday(state.finalText);save();}renderHolidayProfile(state.finalProfile);textEl.textContent=state.finalText;pyEl.textContent=state.finalPinyin;card.hidden=false;result.hidden=false;}
  if(state.completed)show(5);else if(state.identified){show(4);state.quizIndex=0;state.quizScore=0;renderQuiz();}else if(state.clues.length>=5)show(3);else if(state.clues.length)show(2);else show(1);
})();
