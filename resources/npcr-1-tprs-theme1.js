
(() => {
  const STATE_KEY = "npcr1TprsTheme1V1";
  const panels = [1,2,3,4,5].map(n => document.getElementById(`panel${n}`));
  const indicators = [...document.querySelectorAll("[data-step-indicator]")];

  const clueData = {
    countryYesNo: {
      q: "她是不是美国人？",
      a: "不是，她不是美国人。",
      es: "No, no es estadounidense."
    },
    country: {
      q: "她是哪国人？",
      a: "她是西班牙人。",
      es: "Es española."
    },
    language: {
      q: "她会不会说汉语？",
      a: "会，她会说一点儿汉语。",
      es: "Sí, habla un poco de chino."
    },
    food: {
      q: "她喜欢吃什么？",
      a: "她喜欢吃饺子，喜欢喝茶。",
      es: "Le gusta comer jiaozi y beber té."
    }
  };

  const candidateFeedback = {
    mary: {
      zh: "玛丽是英国人，而且不会说汉语。她不符合国籍和语言线索。",
      es: "María es británica y no habla chino. No coincide con las pistas de país y lengua."
    },
    david: {
      zh: "大卫是美国人，而且老师一直说“她”。他不符合国籍和人物线索。",
      es: "David es estadounidense y la profesora habla de «ella». No coincide con las pistas."
    },
    yamada: {
      zh: "山田会说一点儿汉语，但是他是日本人。他不喜欢吃饺子。",
      es: "Yamada habla un poco de chino, pero es japonés. No le gustan los jiaozi."
    }
  };

  const quiz = [
    {
      q: {zh:"她是不是美国人？",es:"¿Es estadounidense?"},
      options: ["是，她是美国人。","不是，她不是美国人。","她是美国。"],
      correct: 1,
      explain: {zh:"“是不是”问句可以用“是／不是”回答。",es:"La pregunta con «是不是» se responde con «是» o «不是»."}
    },
    {
      q: {zh:"她是哪国人？",es:"¿De qué país es?"},
      options: ["她是英国人。","她是西班牙人。","她是日本人。"],
      correct: 1,
      explain: {zh:"老师已经回答：她是西班牙人。",es:"La profesora ya ha dicho que es española."}
    },
    {
      q: {zh:"她会不会说汉语？",es:"¿Habla chino?"},
      options: ["她不会说汉语。","她会说一点儿汉语。","她会汉语一点儿说。"],
      correct: 1,
      explain: {zh:"“一点儿”放在动词“说”后面的数量位置。",es:"«一点儿» aparece después del verbo «说»."}
    },
    {
      q: {zh:"她喜欢吃什么？",es:"¿Qué le gusta comer?"},
      options: ["她喜欢吃饺子。","她喜欢吃咖啡。","她喜欢喝饺子。"],
      correct: 0,
      explain: {zh:"食物用“吃”，饮料用“喝”。",es:"Con comida se usa «吃» y con bebidas, «喝»."}
    },
    {
      q: {zh:"玛丽喜欢喝茶，安娜呢？",es:"A María le gusta beber té. ¿Y a Ana?"},
      options: ["安娜也喜欢喝茶。","安娜喜欢也喝茶。","安娜也茶喜欢喝。"],
      correct: 0,
      explain: {
        zh:"两个人有相同的情况时，用“也”。“也”放在谓语“喜欢”前：玛丽喜欢喝茶，安娜也喜欢喝茶。",
        es:"Cuando dos personas comparten la misma situación se usa «也», antes del predicado: María toma té y Ana también."
      }
    },
    {
      q: {zh:"大卫会说汉语，安娜呢？",es:"David habla chino. ¿Y Ana?"},
      options: [
        "安娜也会说一点儿汉语。",
        "安娜会也说一点儿汉语。",
        "安娜一点儿汉语也会说。"
      ],
      correct: 0,
      explain: {
        zh:"大卫和安娜都有“会说汉语”这个情况，所以用“也”。“也”放在能愿动词“会”前。",
        es:"David y Ana comparten la situación de hablar chino. «也» se coloca antes del verbo modal «会»."
      }
    }
  ];


  const cluePinyin = {
    countryYesNo:{
      q:"Tā shì bu shì Měiguó rén?",
      a:"Bú shì, tā bú shì Měiguó rén."
    },
    country:{
      q:"Tā shì nǎ guó rén?",
      a:"Tā shì Xībānyá rén."
    },
    language:{
      q:"Tā huì bu huì shuō Hànyǔ?",
      a:"Huì, tā huì shuō yìdiǎnr Hànyǔ."
    },
    food:{
      q:"Tā xǐhuan chī shénme?",
      a:"Tā xǐhuan chī jiǎozi, xǐhuan hē chá."
    }
  };

  const quizPinyin = [
    {
      q:"Tā shì bu shì Měiguó rén?",
      options:[
        "Shì, tā shì Měiguó rén.",
        "Bú shì, tā bú shì Měiguó rén.",
        "Tā shì Měiguó."
      ]
    },
    {
      q:"Tā shì nǎ guó rén?",
      options:[
        "Tā shì Yīngguó rén.",
        "Tā shì Xībānyá rén.",
        "Tā shì Rìběn rén."
      ]
    },
    {
      q:"Tā huì bu huì shuō Hànyǔ?",
      options:[
        "Tā bú huì shuō Hànyǔ.",
        "Tā huì shuō yìdiǎnr Hànyǔ.",
        "Tā huì Hànyǔ yìdiǎnr shuō."
      ]
    },
    {
      q:"Tā xǐhuan chī shénme?",
      options:[
        "Tā xǐhuan chī jiǎozi.",
        "Tā xǐhuan chī kāfēi.",
        "Tā xǐhuan hē jiǎozi."
      ]
    },
    {
      q:"Mǎlì xǐhuan hē chá, Ānnà ne?",
      options:[
        "Ānnà yě xǐhuan hē chá.",
        "Ānnà xǐhuan yě hē chá.",
        "Ānnà yě chá xǐhuan hē."
      ]
    },
    {
      q:"Dàwèi huì shuō Hànyǔ, Ānnà ne?",
      options:[
        "Ānnà yě huì shuō yìdiǎnr Hànyǔ.",
        "Ānnà huì yě shuō yìdiǎnr Hànyǔ.",
        "Ānnà yìdiǎnr Hànyǔ yě huì shuō."
      ]
    }
  ];

  const countryPinyin = {
    "中国":"Zhōngguó","西班牙":"Xībānyá","美国":"Měiguó","英国":"Yīngguó",
    "法国":"Fǎguó","德国":"Déguó","日本":"Rìběn","韩国":"Hánguó",
    "加拿大":"Jiānádà","俄罗斯":"Éluósī","澳大利亚":"Àodàlìyà"
  };
  const foodPinyin = {
    "饺子":"jiǎozi","包子":"bāozi","面条":"miàntiáo","米饭":"mǐfàn","点心":"diǎnxin"
  };
  const drinkPinyin = {
    "茶":"chá","咖啡":"kāfēi","水":"shuǐ","牛奶":"niúnǎi","豆浆":"dòujiāng","橙汁":"chéngzhī"
  };

  function pinyinSpan(text){
    return `<span class="learning-pinyin">${text}</span>`;
  }


  function distributeQuizAnswers(targetPositions){
    quiz.forEach((item,index)=>{
      const correctIndex=item.correct;
      const otherIndices=item.options
        .map((_,optionIndex)=>optionIndex)
        .filter(optionIndex=>optionIndex!==correctIndex);
      const order=[...otherIndices];
      order.splice(targetPositions[index],0,correctIndex);

      item.options=order.map(optionIndex=>item.options[optionIndex]);
      quizPinyin[index].options=order.map(optionIndex=>quizPinyin[index].options[optionIndex]);
      item.correct=targetPositions[index];
    });
  }
  distributeQuizAnswers([1,2,0,2,1,0]);

  let state = {
    step: 1,
    clues: [],
    wrongCandidates: 0,
    identified: false,
    quizIndex: 0,
    quizScore: 0,
    quizAnswered: false,
    finalText: "",
    finalPinyin: "",
    finalProfile: null,
    completed: false,
    stars: 0
  };

  try {
    state = Object.assign(state, JSON.parse(localStorage.getItem(STATE_KEY) || "{}"));
  } catch {}

  function langNow() {
    return typeof language !== "undefined" && language === "es" ? "es" : "zh";
  }

  function save() {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch {}
  }

  function buttonLabel(button, zh, es) {
    if (!button) return;
    button.textContent = langNow() === "zh" ? zh : es;
  }

  function restoreButtonLabel(button) {
    if (!button) return;
    const zh = button.dataset.zh || button.dataset.originalZh || "听一遍";
    const es = button.dataset.es || button.dataset.originalEs || "Escuchar";
    buttonLabel(button, zh, es);
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
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = "zh-CN";
      utterance.rate = 0.78;

      const voices = window.speechSynthesis.getVoices?.() || [];
      utterance.voice = voices.find(v => /^zh-CN/i.test(v.lang))
        || voices.find(v => /^zh/i.test(v.lang))
        || null;

      utterance.onstart = () => buttonLabel(triggerButton, "正在播放…", "Reproduciendo…");
      utterance.onend = () => restoreButtonLabel(triggerButton);
      utterance.onerror = () => {
        buttonLabel(triggerButton, "播放失败", "Error de audio");
        window.setTimeout(() => restoreButtonLabel(triggerButton), 1600);
      };

      window.setTimeout(() => window.speechSynthesis.speak(utterance), 40);
      return true;
    } catch (error) {
      console.error("Speech synthesis failed:", error);
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
    } catch (error) {
      console.warn("Clipboard API unavailable, using fallback.", error);
    }

    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    let copied = false;
    try {
      copied = Boolean(document.execCommand && document.execCommand("copy"));
    } catch (error) {
      console.warn("Legacy copy fallback failed.", error);
    }

    textarea.remove();
    return copied;
  }

  function showStep(step) {
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
    {zh:"听故事", es:"Historia"},
    {zh:"问问题", es:"Preguntas"},
    {zh:"选人物", es:"Identificar"},
    {zh:"再确认", es:"Confirmar"},
    {zh:"做我的卡", es:"Mi tarjeta"}
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
      button.addEventListener("click", () => showStep(step - 1));

      nav.appendChild(button);
      panel.insertBefore(nav, panel.firstChild);
    });

    indicators.forEach((indicator, index) => {
      const target = index + 1;
      const activate = () => {
        if (target <= (Number(state.maxStep) || 1)) {
          showStep(target);
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


  document.querySelectorAll("[data-speech-target]").forEach(button => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.speechTarget);
      if (target) speak(target.textContent.trim(), button);
    });
  });

  function stopSpeech(button) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (button) {
      button.textContent = langNow() === "zh" ? "已停止" : "Detenido";
      window.setTimeout(() => {
        button.textContent = langNow() === "zh" ? "■ 停止朗读" : "■ Detener";
      }, 900);
    }
  }

  document.getElementById("stopIntroStory")?.addEventListener("click", event => {
    stopSpeech(event.currentTarget);
    restoreButtonLabel(document.getElementById("playIntroStory"));
  });

  document.getElementById("stopRecapStory")?.addEventListener("click", event => {
    stopSpeech(event.currentTarget);
    restoreButtonLabel(document.getElementById("playRecapStory"));
  });

  document.getElementById("startMystery").onclick = () => showStep(2);

  const clueBoard = document.getElementById("clueBoard");
  const clueCounter = document.getElementById("clueCounter");
  const openFiles = document.getElementById("openFiles");

  function renderClues() {
    clueBoard.innerHTML = "";
    state.clues.forEach(key => {
      const clue = clueData[key];
      const card = document.createElement("article");
      card.className = "clue-card";
      const py=cluePinyin[key];
      card.innerHTML = `<strong>${clue.q}${pinyinSpan(py.q)}</strong><p>${clue.a}${pinyinSpan(py.a)}</p><p lang="es">${clue.es}</p>`;
      const repeat = document.createElement("button");
      repeat.type = "button";
      repeat.className = "clue-repeat";
      repeat.textContent = langNow() === "zh" ? "再听一次" : "Escuchar de nuevo";
      repeat.onclick = () => speak(`${clue.q} ${clue.a}`);
      card.appendChild(repeat);
      clueBoard.appendChild(card);
    });

    document.querySelectorAll(".question-button").forEach(button => {
      button.classList.toggle("asked", state.clues.includes(button.dataset.question));
    });

    const count = state.clues.length;
    clueCounter.dataset.zh = `已收集${count}/4条线索`;
    clueCounter.dataset.es = `${count}/4 pistas`;
    clueCounter.textContent = langNow() === "zh" ? clueCounter.dataset.zh : clueCounter.dataset.es;
    openFiles.disabled = count < 3;
    const evidenceText = document.getElementById("caseEvidenceText");
    const evidenceBar = document.getElementById("caseEvidenceBar");
    if (evidenceText) evidenceText.textContent = `${count} / 4`;
    if (evidenceBar) evidenceBar.style.width = `${count / 4 * 100}%`;
  }

  document.querySelectorAll(".question-button").forEach(button => {
    button.onclick = () => {
      const key = button.dataset.question;
      if (!state.clues.includes(key)) {
        state.clues.push(key);
        save();
      }
      const clue = clueData[key];
      speak(`${clue.q} ${clue.a}`);
      renderClues();
    };
  });

  openFiles.onclick = () => showStep(3);

  const candidateBox = document.getElementById("candidateFeedback");
  const recap = document.getElementById("storyRecap");

  document.querySelectorAll(".candidate-choice").forEach(button => {
    button.onclick = () => {
      const candidate = button.dataset.candidate;
      if (candidate === "anna") {
        state.identified = true;
        candidateBox.className = "game-feedback good";
        candidateBox.textContent = langNow() === "zh"
          ? "推理正确！新同学是安娜。四条线索都和她的学生卡一致。"
          : "¡Correcto! La estudiante nueva es Ana. Su perfil coincide con las cuatro pistas.";
        recap.hidden = false;
        document.querySelectorAll(".candidate-choice").forEach(btn => btn.disabled = true);
        save();
        speak("新同学叫安娜。她不是美国人，她是西班牙人。她会说一点儿汉语。她喜欢吃饺子，喜欢喝茶。");
      } else {
        state.wrongCandidates += 1;
        candidateBox.className = "game-feedback bad";
        candidateBox.textContent = candidateFeedback[candidate][langNow()];
        save();
      }
    };
  });

  document.getElementById("startQuiz").onclick = () => {
    state.quizIndex = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    save();
    showStep(4);
    renderQuiz();
  };

  const quizProgress = document.getElementById("quizProgress");
  const quizQuestion = document.getElementById("quizQuestion");
  const quizOptions = document.getElementById("quizOptions");
  const quizFeedback = document.getElementById("quizFeedback");
  const nextQuiz = document.getElementById("nextQuiz");

  function renderQuiz() {
    const item = quiz[state.quizIndex];
    quizProgress.textContent = `${state.quizIndex + 1} / ${quiz.length}`;
    const py=quizPinyin[state.quizIndex];
    quizQuestion.innerHTML = langNow()==="zh"
      ? `${item.q.zh}${pinyinSpan(py.q)}`
      : `${item.q.es}<span class="quiz-chinese-source">${item.q.zh}</span>${pinyinSpan(py.q)}`;
    quizOptions.innerHTML = "";
    quizFeedback.className = "game-feedback";
    quizFeedback.textContent = langNow() === "zh" ? "选择一个答案。" : "Elige una respuesta.";
    nextQuiz.disabled = true;
    state.quizAnswered = false;

    item.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.innerHTML = `<span>${option}</span>${pinyinSpan(py.options[index])}`;
      button.onclick = () => answerQuiz(index, button);
      quizOptions.appendChild(button);
    });

    nextQuiz.dataset.zh = state.quizIndex === quiz.length - 1 ? "查看结果 →" : "下一题 →";
    nextQuiz.dataset.es = state.quizIndex === quiz.length - 1 ? "Ver resultado →" : "Siguiente →";
    nextQuiz.textContent = langNow() === "zh" ? nextQuiz.dataset.zh : nextQuiz.dataset.es;
  }

  function answerQuiz(index, button) {
    if (state.quizAnswered) return;
    state.quizAnswered = true;
    const item = quiz[state.quizIndex];
    const buttons = [...quizOptions.children];
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === item.correct) btn.classList.add("correct");
    });

    if (index === item.correct) {
      state.quizScore += 1;
      quizFeedback.className = "game-feedback good";
      quizFeedback.textContent = (langNow() === "zh" ? "回答正确！" : "¡Correcto! ") + item.explain[langNow()];
      speak(item.options[item.correct]);
    } else {
      button.classList.add("wrong");
      quizFeedback.className = "game-feedback bad";
      quizFeedback.textContent = (langNow() === "zh" ? "再看一次核心信息：" : "Revisa la información: ") + item.explain[langNow()];
    }

    nextQuiz.disabled = false;
    save();
  }

  nextQuiz.onclick = () => {
    if (state.quizIndex < quiz.length - 1) {
      state.quizIndex += 1;
      save();
      renderQuiz();
    } else {
      showStep(5);
    }
  };

  const finalCard = document.getElementById("myFinalCard");
  const finalText = document.getElementById("myFinalText");
  const resultBox = document.getElementById("themeResult");
  const resultStars = document.getElementById("resultStars");
  const resultMessage = document.getElementById("resultMessage");
  const myCardName = document.getElementById("myCardName");
  const myCardNamePinyin = document.getElementById("myCardNamePinyin");
  const myCardCountry = document.getElementById("myCardCountry");
  const myCardCountryPinyin = document.getElementById("myCardCountryPinyin");
  const myCardFood = document.getElementById("myCardFood");
  const myCardFoodPinyin = document.getElementById("myCardFoodPinyin");
  const myCardDrink = document.getElementById("myCardDrink");
  const myCardDrinkPinyin = document.getElementById("myCardDrinkPinyin");
  const myAvatarInitial = document.getElementById("myAvatarInitial");

  function parseLegacyProfile(text){
    if(!text) return null;
    const oldMatch=text.match(/^你好！我叫(.+?)。我是(.+?)人。我会说一点儿汉语。我喜欢吃(.+?)，也喜欢喝(.+?)。认识你很高兴！$/);
    if(oldMatch) return {name:oldMatch[1],country:oldMatch[2],food:oldMatch[3],drink:oldMatch[4]};
    const newMatch=text.match(/^你好！我叫(.+?)。我是(.+?)人。我会说一点儿汉语。我喜欢吃(.+?)。我喜欢喝(.+?)。认识你很高兴！$/);
    if(!newMatch) return null;
    return {name:newMatch[1],country:newMatch[2],food:newMatch[3],drink:newMatch[4]};
  }

  function renderPersonalProfile(profile){
    if(!profile) return;
    myCardName.textContent=profile.name;
    myCardNamePinyin.textContent=profile.name;
    myAvatarInitial.textContent=(profile.name.trim().charAt(0)||"我");
    myCardCountry.textContent=`${profile.country}人`;
    myCardCountryPinyin.textContent=`${countryPinyin[profile.country]||profile.country} rén`;
    myCardFood.textContent=profile.food;
    myCardFoodPinyin.textContent=foodPinyin[profile.food]||profile.food;
    myCardDrink.textContent=profile.drink;
    myCardDrinkPinyin.textContent=drinkPinyin[profile.drink]||profile.drink;
  }

  function printProfile(target){
    if(!target) return;
    target.classList.add("print-target");
    document.body.classList.add("print-profile-mode");
    window.print();
    window.setTimeout(()=>{
      document.body.classList.remove("print-profile-mode");
      target.classList.remove("print-target");
    },300);
  }

  document.getElementById("printAnnaProfile")?.addEventListener("click",()=>{
    printProfile(document.getElementById("annaProfileCard"));
  });
  document.getElementById("printMyProfile")?.addEventListener("click",()=>{
    printProfile(document.getElementById("printablePersonalProfile"));
  });

  function calculateStars() {
    if (state.wrongCandidates === 0 && state.quizScore >= 5) return 3;
    if (state.quizScore >= 3) return 2;
    return 1;
  }

  document.getElementById("generateMyCard").onclick = () => {
    const name = document.getElementById("myName").value.trim();
    const country = document.getElementById("myCountry").value;
    const food = document.getElementById("myFood").value;
    const drink = document.getElementById("myDrink").value;

    if (!name || !country || !food || !drink) {
      alert(langNow() === "zh" ? "请先填写全部信息。" : "Completa todos los datos.");
      return;
    }

    const text = `你好！我叫${name}。我是${country}人。我会说一点儿汉语。我喜欢吃${food}。我喜欢喝${drink}。认识你很高兴！`;
    const pinyin = `Nǐ hǎo! Wǒ jiào ${name}. Wǒ shì ${countryPinyin[country]} rén. Wǒ huì shuō yìdiǎnr Hànyǔ. Wǒ xǐhuan chī ${foodPinyin[food]}. Wǒ xǐhuan hē ${drinkPinyin[drink]}. Rènshi nǐ hěn gāoxìng!`;
    const profile = {name, country, food, drink};
    state.finalText = text;
    state.finalPinyin = pinyin;
    state.finalProfile = profile;
    state.completed = true;
    state.stars = calculateStars();
    save();

    renderPersonalProfile(profile);
    finalText.textContent = text;
    document.getElementById('myFinalPinyin').textContent = pinyin;
    finalCard.hidden = false;
    resultBox.hidden = false;
    resultStars.textContent = "★".repeat(state.stars) + "☆".repeat(3 - state.stars);
    resultMessage.textContent = langNow() === "zh"
      ? `你收集了${state.clues.length}条线索，重复确认题答对${state.quizScore}/6题。故事已经变成了你的中文表达。`
      : `Has reunido ${state.clues.length} pistas y acertado ${state.quizScore}/6 preguntas. La historia se ha convertido en tu propia expresión en chino.`;
    speak(text);
  };

  document.getElementById("speakMyCard").onclick = event => {
    const text = state.finalText || finalText.textContent.trim();
    speak(text, event.currentTarget);
  };

  document.getElementById("copyMyCard").onclick = async event => {
    const button = event.currentTarget;
    const text = state.finalText || finalText.textContent.trim();
    const copied = await copyTextWithFallback(text);

    if (copied) {
      buttonLabel(button, "已复制", "Copiado");
    } else {
      buttonLabel(button, "复制失败，请手动选择文字", "No se pudo copiar");
    }
    window.setTimeout(() => restoreButtonLabel(button), 1700);
  };

  document.getElementById("resetTheme").onclick = () => {
    if (!confirm(langNow() === "zh" ? "确定重新开始这个故事吗？" : "¿Quieres reiniciar esta historia?")) return;
    localStorage.removeItem(STATE_KEY);
    location.reload();
  };

  document.getElementById("lang")?.addEventListener("click", () => {
    setTimeout(() => {
      renderClues();
      if (!document.getElementById("panel4").hidden) renderQuiz();
      if (state.completed) {
        resultMessage.textContent = langNow() === "zh"
          ? `你收集了${state.clues.length}条线索，重复确认题答对${state.quizScore}/6题。故事已经变成了你的中文表达。`
          : `Has reunido ${state.clues.length} pistas y acertado ${state.quizScore}/6 preguntas. La historia se ha convertido en tu propia expresión en chino.`;
      }
    }, 0);
  });

  renderClues();
  if (state.finalText) {
    if(!state.finalProfile){
      state.finalProfile=parseLegacyProfile(state.finalText);
      save();
    }
    renderPersonalProfile(state.finalProfile);
    finalText.textContent = state.finalText;
    document.getElementById('myFinalPinyin').textContent = state.finalPinyin || '';
    finalCard.hidden = false;
    resultBox.hidden = false;
    resultStars.textContent = "★".repeat(state.stars || 1) + "☆".repeat(3 - (state.stars || 1));
  }

  // 恢复时只进入安全步骤；人物按钮和测试会重新开始，避免状态不一致。
  if (state.completed) {
    showStep(5);
  } else if (state.identified) {
    showStep(4);
    state.quizIndex = 0;
    state.quizScore = 0;
    renderQuiz();
  } else if (state.clues.length >= 3) {
    showStep(3);
  } else if (state.clues.length) {
    showStep(2);
  } else {
    showStep(1);
  }
})();
