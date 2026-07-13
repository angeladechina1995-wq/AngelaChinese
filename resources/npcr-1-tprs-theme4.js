
(() => {
  const STATE_KEY="npcr1TprsTheme4V1";
  const panels=[1,2,3,4,5].map(n=>document.getElementById(`panel${n}`));
  const indicators=[...document.querySelectorAll("[data-step-indicator]")];

  const clues={
    symptom:{q:"大为哪儿不舒服？",a:"他头疼，嗓子也疼，全身都不舒服。",es:"Le duele la cabeza y la garganta y se encuentra mal.",pyQ:"Dàwèi nǎr bù shūfu?",pyA:"Tā tóuténg, sǎngzi yě téng, quánshēn dōu bù shūfu."},
    xiaoyun:{q:"小云应该买什么？",a:"她应该买四斤苹果，苹果五块五一斤。",es:"Debe comprar cuatro jin de manzanas a 5,5 yuanes por jin.",pyQ:"Xiǎoyún yīnggāi mǎi shénme?",pyA:"Tā yīnggāi mǎi sì jīn píngguǒ, píngguǒ wǔ kuài wǔ yì jīn."},
    linna:{q:"林娜应该买什么衣服？",a:"她应该买一件绿色的大号羽绒服。",es:"Debe comprar un plumífero verde de talla grande.",pyQ:"Lín Nà yīnggāi mǎi shénme yīfu?",pyA:"Tā yīnggāi mǎi yí jiàn lǜsè de dà hào yǔróngfú."},
    songhua:{q:"宋华去药店做什么？",a:"他去药店买中药。",es:"Va a la farmacia a comprar medicina china.",pyQ:"Sòng Huá qù yàodiàn zuò shénme?",pyA:"Tā qù yàodiàn mǎi Zhōngyào."},
    libo:{q:"力波应该买什么喝的？",a:"他应该买一瓶水，不应该买咖啡。",es:"Debe comprar una botella de agua, no café.",pyQ:"Lìbō yīnggāi mǎi shénme hē de?",pyA:"Tā yīnggāi mǎi yì píng shuǐ, bù yīnggāi mǎi kāfēi."}
  };

  const wrong={
    xiaoyun:{zh:"小云买了四斤苹果，数量和价格都正确。",es:"Xiaoyun compró cuatro jin de manzanas; la cantidad es correcta."},
    linna:{zh:"林娜买了绿色大号羽绒服，颜色和号码都正确。",es:"Linna compró el plumífero verde de talla grande correcto."},
    songhua:{zh:"宋华去药店买了中药，符合医生的建议。",es:"Song Hua compró medicina china, de acuerdo con la recomendación médica."}
  };

  const quiz=[
    {
      scene:{
        icon:"🏥",
        label:{zh:"场景一 · 医生问诊",es:"Escena 1 · Consulta"},
        who:{zh:"医生正在问他。",es:"El médico le está preguntando a él."},
        prompt:{zh:"医生问：“哪儿不舒服？”",es:"Pregunta: «¿Dónde te duele?»"}
      },
      q:{zh:"你会帮他怎么回答？",es:"¿Cómo le ayudarías a responder?"},
      o:["我头疼。","我疼头。","头我疼。"],
      c:0,
      e:{
        zh:"很好！他现在能告诉医生哪里不舒服了。虽然你是在帮助他，但这是他替自己回答，所以要说“我头疼”。",
        es:"¡Muy bien! Ahora él puede decirle al médico dónde le duele. Aunque tú le ayudas, él habla de sí mismo y por eso dice «我头疼» (me duele la cabeza)."
      },
      pyQ:"Nǐ huì bāng péngyou zěnme shuō?",
      py:["Wǒ tóuténg.","Wǒ téng tóu.","Tóu wǒ téng."]
    },
    {
      scene:{
        icon:"🌡️",
        label:{zh:"场景二 · 护士量体温",es:"Escena 2 · Temperatura"},
        who:{zh:"护士看了他的体温计。",es:"La enfermera mira su termómetro."},
        prompt:{zh:"她问：“你发烧了吗？”",es:"Pregunta: «¿Tienes fiebre?»"}
      },
      q:{zh:"他发烧了。你会帮他怎么回答？",es:"Él tiene fiebre. ¿Cómo le ayudarías a responder?"},
      o:["我发烧了。","我发烧吗。","我了发烧。"],
      c:0,
      e:{
        zh:"对！他替自己回答时说“我发烧了”。句末“了”表示现在出现了发烧的情况。",
        es:"¡Correcto! Cuando él responde sobre sí mismo dice «我发烧了» (tengo fiebre). El 了 final indica un cambio de situación."
      },
      pyQ:"Péngyou fāshāo le, tā huì zěnme huídá?",
      py:["Wǒ fāshāo le.","Wǒ fāshāo ma.","Wǒ le fāshāo."]
    },
    {
      scene:{
        icon:"🩺",
        label:{zh:"场景三 · 医生给建议",es:"Escena 3 · Consejo médico"},
        who:{zh:"他头疼，嗓子也疼。",es:"Le duele la cabeza y también la garganta."},
        prompt:{zh:"你想劝他去医院。",es:"Quieres aconsejarle ir al médico."}
      },
      q:{zh:"你会对他怎么说？",es:"¿Qué le dirías a él?"},
      o:["你应该去医院看病。","你可以喝很多咖啡。","你要去买牛仔裤。"],
      c:0,
      e:{
        zh:"很好！“应该”可以表示建议：你应该去医院看病。",
        es:"¡Muy bien! 应该 expresa una recomendación: deberías ir al médico."
      },
      pyQ:"Nǐ huì zěnme shuō?",
      py:["Nǐ yīnggāi qù yīyuàn kànbìng.","Nǐ kěyǐ hē hěn duō kāfēi.","Nǐ yào qù mǎi niúzǎikù."]
    },
    {
      scene:{
        icon:"💧",
        label:{zh:"场景四 · 回宿舍以后",es:"Escena 4 · De vuelta"},
        who:{zh:"医生说他要多喝水。",es:"El médico dice que él debe beber más agua."},
        prompt:{zh:"你去商店帮他买需要的东西。",es:"Vas a la tienda a comprar lo que necesita."}
      },
      q:{zh:"你最应该买什么？",es:"¿Qué deberías comprarle?"},
      o:["两瓶水","一杯咖啡","一条牛仔裤"],
      c:0,
      e:{
        zh:"对！他嗓子疼，医生让他多喝水，所以给他买水最合适。",
        es:"¡Correcto! Le duele la garganta y el médico le recomienda beber agua, así que lo más útil es comprarle agua."
      },
      pyQ:"Nǐ zuì yīnggāi mǎi shénme?",
      py:["Liǎng píng shuǐ","Yì bēi kāfēi","Yì tiáo niúzǎikù"]
    },
    {
      scene:{
        icon:"🍎",
        label:{zh:"场景五 · 市场买水果",es:"Escena 5 · Mercado"},
        who:{zh:"你去市场给朋友买苹果。",es:"Vas al mercado a comprarle manzanas a tu amigo."},
        prompt:{zh:"苹果五块五一斤，你买四斤。",es:"Cuestan 5,5 yuanes por jin y compras cuatro."}
      },
      q:{zh:"老板应该收多少钱？",es:"¿Cuánto debe cobrar?"},
      o:["二十二块","二十块五","五十五块"],
      c:0,
      e:{
        zh:"很好！五块五乘四等于二十二块。",
        es:"¡Muy bien! 5,5 × 4 = 22 yuanes."
      },
      pyQ:"Lǎobǎn yīnggāi shōu duōshao qián?",
      py:["Èrshí'èr kuài","Èrshí kuài wǔ","Wǔshíwǔ kuài"]
    },
    {
      scene:{
        icon:"👕",
        label:{zh:"场景六 · 帮朋友买衣服",es:"Escena 6 · Comprar ropa"},
        who:{zh:"天气很冷，朋友需要一件羽绒服。",es:"Hace frío y tu amigo necesita un plumífero."},
        prompt:{zh:"你想先试一下。",es:"Quieres preguntarle al dependiente si tu amigo puede probárselo."}
      },
      q:{zh:"你会对店员怎么说？",es:"¿Qué le dirías al dependiente para ayudar a tu amigo?"},
      o:["我可以试一下吗？","我应该苹果吗？","我能嗓子吗？"],
      c:0,
      e:{
        zh:"对！“可以……吗？”可以礼貌地询问是否允许。",
        es:"¡Correcto! 可以…吗？ sirve para pedir permiso de forma cortés."
      },
      pyQ:"Nǐ huì duì diànyuán zěnme shuō?",
      py:["Wǒ kěyǐ shì yíxià ma?","Wǒ yīnggāi píngguǒ ma?","Wǒ néng sǎngzi ma?"]
    },
    {
      scene:{
        icon:"🛍️",
        label:{zh:"场景七 · 商店里",es:"Escena 7 · En la tienda"},
        who:{zh:"店员拿来一件衬衫和一条牛仔裤。",es:"El dependiente trae una camisa y unos vaqueros para tu amigo."},
        prompt:{zh:"你要说清楚数量。",es:"Tienes que indicar correctamente los clasificadores."}
      },
      q:{zh:"你会怎么说？",es:"¿Qué dirías?"},
      o:["一件衬衫，一条牛仔裤","一条衬衫，一件牛仔裤","一本衬衫，一口牛仔裤"],
      c:0,
      e:{
        zh:"很好！上衣常用“件”，裤子常用“条”。",
        es:"¡Muy bien! Para prendas superiores se usa 件 y para pantalones 条."
      },
      pyQ:"Nǐ huì zěnme shuō?",
      py:["Yí jiàn chènshān, yì tiáo niúzǎikù","Yì tiáo chènshān, yí jiàn niúzǎikù","Yì běn chènshān, yì kǒu niúzǎikù"]
    },
    {
      scene:{
        icon:"💊",
        label:{zh:"场景八 · 去药店",es:"Escena 8 · Farmacia"},
        who:{zh:"医生建议朋友先吃一点儿中药。",es:"El médico recomienda que tu amigo tome un poco de medicina china."},
        prompt:{zh:"你去药店帮他买药。",es:"Vas a la farmacia para comprarle la medicina."}
      },
      q:{zh:"你会怎么说明目的？",es:"¿Cómo explicarías para qué vas a la farmacia?"},
      o:["我去药店买中药。","我药店去中药。","我买去药店。"],
      c:0,
      e:{
        zh:"对！“去药店”是动作，“买中药”是目的。",
        es:"¡Correcto! «Ir a la farmacia» es la acción y «comprar medicina china» expresa la finalidad."
      },
      pyQ:"Nǐ huì zěnme shuōmíng mùdì?",
      py:["Wǒ qù yàodiàn mǎi Zhōngyào.","Wǒ yàodiàn qù Zhōngyào.","Wǒ mǎi qù yàodiàn."]
    }
  ];

  const healthSpanishScaffold={
    symptoms:{
      "头疼":"dolor de cabeza",
      "嗓子疼":"dolor de garganta",
      "发烧":"fiebre",
      "全身不舒服":"malestar general"
    },
    advice:{
      "去医院看病":"ir al médico",
      "多喝水":"beber más agua",
      "早点休息":"descansar pronto",
      "按时吃药":"tomar la medicina a la hora indicada"
    },
    items:{
      "水":"agua",
      "中药":"medicina china",
      "苹果":"manzanas",
      "羽绒服":"plumífero"
    }
  };

  const symptomPy={"头疼":"tóuténg","嗓子疼":"sǎngzi téng","肚子疼":"dùzi téng","发烧了":"fāshāo le"};
  const advicePy={"去医院看病":"qù yīyuàn kànbìng","多喝水":"duō hē shuǐ","多休息":"duō xiūxi","多穿点儿衣服":"duō chuān diǎnr yīfu"};
  const itemPy={"四斤苹果":"sì jīn píngguǒ","两瓶水":"liǎng píng shuǐ","一点儿中药":"yìdiǎnr Zhōngyào","一件羽绒服":"yí jiàn yǔróngfú"};


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
  distributeQuizAnswers([2,0,1,2,1,0,2,1]);

  function randomizeThemeQuizOptions(){
    const targetPositions=quiz.map((_,index)=>index%3);
    for(let i=targetPositions.length-1;i>0;i-=1){
      const j=Math.floor(Math.random()*(i+1));
      [targetPositions[i],targetPositions[j]]=[targetPositions[j],targetPositions[i]];
    }

    quiz.forEach((item,index)=>{
      const entries=item.o.map((option,originalIndex)=>({
        option,
        pinyin:item.py[originalIndex],
        correct:originalIndex===item.c
      }));
      const correctEntry=entries.find(entry=>entry.correct);
      const wrongEntries=entries.filter(entry=>!entry.correct);
      const target=targetPositions[index];
      const arranged=[...wrongEntries];
      arranged.splice(target,0,correctEntry);
      item.o=arranged.map(entry=>entry.option);
      item.py=arranged.map(entry=>entry.pinyin);
      item.c=target;
    });
  }
  randomizeThemeQuizOptions();


  let state={step:1,clues:[],wrongPeople:0,identified:false,quizIndex:0,quizScore:0,answered:false,finalText:"",finalPinyin:"",finalProfile:null,completed:false,stars:0};
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
    {zh:"听帮助故事", es:"Historia"},
    {zh:"问症状", es:"Síntomas"},
    {zh:"找出问题", es:"Detectar"},
    {zh:"帮朋友回答", es:"Ayudar"},
    {zh:"做关怀卡", es:"Tarjeta"}
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
  document.getElementById("startShoppingMystery").onclick=()=>show(2);

  const clueBoard=document.getElementById("shoppingClueBoard"),counter=document.getElementById("shoppingClueCounter"),open=document.getElementById("openShoppingRecords");
  function renderClues(){
    clueBoard.innerHTML="";
    state.clues.forEach(key=>{const c=clues[key],card=document.createElement("article");card.className="clue-card";card.innerHTML=`<strong>${c.q}${py(c.pyQ)}</strong><p>${c.a}${py(c.pyA)}</p><p lang="es">${c.es}</p>`;const r=document.createElement("button");r.className="clue-repeat";r.type="button";r.textContent=lang()==="zh"?"再听一次":"Escuchar de nuevo";r.onclick=()=>speak(`${c.q} ${c.a}`);card.appendChild(r);clueBoard.appendChild(card);});
    document.querySelectorAll(".question-button").forEach(b=>b.classList.toggle("asked",state.clues.includes(b.dataset.question)));
    counter.textContent=lang()==="zh"?`已收集${state.clues.length}/5条线索`:`${state.clues.length}/5 pistas`;open.disabled=state.clues.length<4;
    const evidenceText=document.getElementById("healthEvidenceText");
    const thermometerFill=document.getElementById("healthThermometerFill");
    if(evidenceText) evidenceText.textContent=`${state.clues.length} / 5`;
    if(thermometerFill) thermometerFill.style.height=`${20 + state.clues.length * 16}%`;
  }
  document.querySelectorAll(".question-button").forEach(b=>b.onclick=()=>{const k=b.dataset.question;if(!state.clues.includes(k))state.clues.push(k);save();speak(`${clues[k].q} ${clues[k].a}`);renderClues();});
  open.onclick=()=>show(3);

  const feedback=document.getElementById("shoppingFeedback"),recap=document.getElementById("shoppingRecap");
  document.querySelectorAll(".shopping-choice").forEach(b=>b.onclick=()=>{
    const p=b.dataset.person;
    if(p==="libo"){state.identified=true;feedback.className="game-feedback good";feedback.textContent=lang()==="zh"?"推理正确！力波应该买水，却买了咖啡。":"¡Correcto! Libo debía comprar agua, pero compró café.";recap.hidden=false;document.querySelectorAll(".shopping-choice").forEach(x=>x.disabled=true);save();speak("大为头疼，嗓子也疼。力波本来应该买水，可是他买了咖啡，所以力波买错了。");}
    else{state.wrongPeople++;feedback.className="game-feedback bad";feedback.textContent=wrong[p][lang()];save();}
  });

  document.getElementById("startShoppingQuiz").onclick=()=>{state.quizIndex=0;state.quizScore=0;state.answered=false;save();show(4);renderQuiz();};
  const prog=document.getElementById("shoppingQuizProgress"),question=document.getElementById("shoppingQuizQuestion"),options=document.getElementById("shoppingQuizOptions"),qf=document.getElementById("shoppingQuizFeedback"),next=document.getElementById("nextShoppingQuiz");
  function renderQuiz(){
    const item=quiz[state.quizIndex];
    prog.textContent=`${state.quizIndex+1} / ${quiz.length}`;

    const sceneIcon=document.getElementById("healthSceneIcon");
    const sceneLabel=document.getElementById("healthSceneLabel");
    const sceneWho=document.getElementById("healthSceneWho");
    const scenePrompt=document.getElementById("healthScenePrompt");
    if(sceneIcon) sceneIcon.textContent=item.scene.icon;
    if(sceneLabel) sceneLabel.textContent=item.scene.label[lang()];
    if(sceneWho) sceneWho.textContent=item.scene.who[lang()];
    if(scenePrompt) scenePrompt.textContent=item.scene.prompt[lang()];

    question.innerHTML=(lang()==="zh"?item.q.zh:`${item.q.es}<span class="quiz-chinese-source">${item.q.zh}</span>`)+py(item.pyQ);
    options.innerHTML="";
    state.answered=false;
    next.disabled=true;
    qf.className="game-feedback";
    qf.textContent=lang()==="zh"?"选择最能帮助朋友的回答。":"Elige la respuesta que mejor ayuda.";
    item.o.forEach((o,i)=>{
      const b=document.createElement("button");
      b.className="quiz-option";
      b.type="button";
      b.innerHTML=`<span class="quiz-option-letter">${["A","B","C","D"][i]||i+1}</span><span class="quiz-option-body"><span>${o}</span>${py(item.py[i])}</span>`;
      b.onclick=()=>answer(i,b);
      options.appendChild(b)
    });
    next.textContent=state.quizIndex===quiz.length-1
      ?(lang()==="zh"?"查看结果 →":"Ver resultado →")
      :(lang()==="zh"?"下一个场景 →":"Siguiente situación →");
  }
  function answer(i,b){
    if(state.answered)return;
    state.answered=true;
    const item=quiz[state.quizIndex];
    [...options.children].forEach((x,j)=>{
      x.disabled=true;
      if(j===item.c)x.classList.add("correct")
    });
    if(i===item.c){
      state.quizScore++;
      qf.className="game-feedback good";
      qf.textContent=item.e[lang()];
      speak(item.o[item.c]);
    }else{
      b.classList.add("wrong");
      qf.className="game-feedback bad";
      qf.textContent=lang()==="zh"
        ? `这个回答不能帮助朋友完成当前交流。再看一次：${item.e.zh}`
        : `Esta respuesta no ayuda en esta situación. Revisa: ${item.e.es}`;
    }
    next.disabled=false;
    save();
  }
  next.onclick=()=>{if(state.quizIndex<quiz.length-1){state.quizIndex++;save();renderQuiz();}else show(5);};

  const card=document.getElementById("careFinalCard"),textEl=document.getElementById("careFinalText"),pyEl=document.getElementById("careFinalPinyin"),result=document.getElementById("shoppingThemeResult");
  const careCardFriendTitle=document.getElementById("careCardFriend");
  const careFriendValue=document.getElementById("careFriendValue");
  const careSymptomValue=document.getElementById("careSymptomValue");
  const careSymptomPy=document.getElementById("careSymptomPy");
  const careAdviceValue=document.getElementById("careAdviceValue");
  const careAdvicePy=document.getElementById("careAdvicePy");
  const careItemValue=document.getElementById("careItemValue");
  const careItemPy=document.getElementById("careItemPy");

  function renderCareProfile(profile){
    if(!profile) return;
    careCardFriendTitle.textContent = profile.friend || "—";
    careFriendValue.textContent = profile.friend || "—";
    careSymptomValue.textContent = profile.sym || "—";
    careSymptomPy.textContent = symptomPy[profile.sym] || "";
    careAdviceValue.textContent = profile.advice || "—";
    careAdvicePy.textContent = advicePy[profile.advice] || "";
    careItemValue.textContent = profile.item || "—";
    careItemPy.textContent = itemPy[profile.item] || "";
  }

  function parseLegacyCare(text){
    const m=String(text||"").match(/^(.+?)，你不舒服。你(.+?)，应该(.+?)。我去商店给你买(.+?)。我也可以跟你一起去医院看病。$/);
    if(!m) return null;
    return {friend:m[1],sym:m[2],advice:m[3],item:m[4]};
  }
  document.getElementById("printShoppingSolvedCard")?.addEventListener("click",()=>printProfile(document.getElementById("shoppingSolvedCard")));
  document.getElementById("printCareCard")?.addEventListener("click",()=>printProfile(document.getElementById("printableCareCard")));

  function stars(){if(state.wrongPeople===0&&state.quizScore>=7)return 3;if(state.quizScore>=5)return 2;return 1;}
  document.getElementById("generateCareCard").onclick=()=>{
    const friend=document.getElementById("careFriend").value.trim(),sym=document.getElementById("careSymptom").value,advice=document.getElementById("careAdvice").value,item=document.getElementById("careItem").value;
    if(!friend||!sym||!advice||!item){alert(lang()==="zh"?"请先填写全部信息。":"Completa todos los datos.");return;}
    const text=`${friend}，你不舒服。你${sym}，应该${advice}。我去商店给你买${item}。我也可以跟你一起去医院看病。`;
    const pinyin=`${friend}, nǐ bù shūfu. Nǐ ${symptomPy[sym]}, yīnggāi ${advicePy[advice]}. Wǒ qù shāngdiàn gěi nǐ mǎi ${itemPy[item]}. Wǒ yě kěyǐ gēn nǐ yìqǐ qù yīyuàn kànbìng.`;
    const profile={friend,sym,advice,item};
    state.finalText=text;state.finalPinyin=pinyin;state.finalProfile=profile;state.completed=true;state.stars=stars();save();renderCareProfile(profile);textEl.textContent=text;pyEl.textContent=pinyin;card.hidden=false;result.hidden=false;document.getElementById("shoppingResultStars").textContent="★".repeat(state.stars)+"☆".repeat(3-state.stars);document.getElementById("shoppingResultMessage").textContent=lang()==="zh"?`你收集了${state.clues.length}条线索，确认题答对${state.quizScore}/8题。`:`Has reunido ${state.clues.length} pistas y acertado ${state.quizScore}/8 preguntas.`;speak(text);
  };
  document.getElementById("speakCareCard").onclick=e=>speak(state.finalText||textEl.textContent.trim(),e.currentTarget);
  document.getElementById("copyCareCard").onclick=async e=>{const ok=await copyTextWithFallback(state.finalText||textEl.textContent.trim());buttonLabel(e.currentTarget,ok?"已复制":"复制失败",ok?"Copiado":"No se pudo copiar");window.setTimeout(()=>restoreButtonLabel(e.currentTarget),1600)};
  document.getElementById("resetShoppingTheme").onclick=()=>{if(confirm(lang()==="zh"?"确定重新开始吗？":"¿Reiniciar?")){localStorage.removeItem(STATE_KEY);location.reload();}};
  document.getElementById("lang")?.addEventListener("click",()=>setTimeout(()=>{renderClues();if(!document.getElementById("panel4").hidden)renderQuiz();},0));
  renderClues();if(state.finalText){if(!state.finalProfile){state.finalProfile=parseLegacyCare(state.finalText);save();}renderCareProfile(state.finalProfile);textEl.textContent=state.finalText;pyEl.textContent=state.finalPinyin;card.hidden=false;result.hidden=false;}
  if(state.completed)show(5);else if(state.identified){show(4);state.quizIndex=0;state.quizScore=0;renderQuiz();}else if(state.clues.length>=4)show(3);else if(state.clues.length)show(2);else show(1);
})();
