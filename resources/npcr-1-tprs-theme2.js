
(() => {
  const STATE_KEY = "npcr1TprsTheme2V2";
  const panels = [1,2,3,4,5].map(n => document.getElementById(`panel${n}`));
  const indicators = [...document.querySelectorAll("[data-step-indicator]")];

  const clueData = {
    date: {
      q: "今天几月几号？",
      a: "今天五月十六号。",
      es: "Hoy es 16 de mayo."
    },
    age: {
      q: "她今年多大？",
      a: "她今年二十一岁。",
      es: "Este año cumple veintiún años."
    },
    family: {
      q: "她家有几口人？",
      a: "她家有四口人。",
      es: "En su familia hay cuatro personas."
    },
    time: {
      q: "她晚上几点有空？",
      a: "她晚上七点有空。",
      es: "Está libre a las siete de la tarde."
    },
    gift: {
      q: "她哥哥送她什么礼物？",
      a: "她哥哥送她一本汉语词典。",
      es: "Su hermano le regala un diccionario de chino."
    }
  };

  const candidateFeedbackCopy = {
    liming: {
      zh: "李明也是二十一岁，生日也是五月十六号，但是他家只有三口人。",
      es: "Li Ming también tiene veintiún años y cumple el 16 de mayo, pero en su familia hay tres personas."
    },
    anna: {
      zh: "安娜家有四口人，生日也是五月十六号，但是她今年二十岁。",
      es: "Ana tiene una familia de cuatro personas y cumple el 16 de mayo, pero tiene veinte años."
    },
    david: {
      zh: "大卫二十一岁，家里有四口人，但是他的生日是五月二十号。",
      es: "David tiene veintiún años y una familia de cuatro personas, pero cumple el 20 de mayo."
    }
  };

  const quiz = [
    {
      q:{zh:"今天几月几号？",es:"¿Qué fecha es hoy?"},
      options:["五月十六号","五月六十号","十六五月号"],
      correct:0,
      explain:{zh:"汉语日期顺序是“月＋日／号”。",es:"El orden de la fecha en chino es mes + día."}
    },
    {
      q:{zh:"王芳今年多大？",es:"¿Cuántos años tiene Wang Fang?"},
      options:["二十岁","二十一岁","十二一岁"],
      correct:1,
      explain:{zh:"年龄用“数字＋岁”：二十一岁。",es:"La edad se expresa con número + 岁."}
    },
    {
      q:{zh:"她家有几口人？",es:"¿Cuántas personas hay en su familia?"},
      options:["她家是四口人。","她家有四口人。","她有家四口人。"],
      correct:1,
      explain:{zh:"表示存在和拥有用“有”：她家有四口人。",es:"Para expresar existencia o posesión se usa 有."}
    },
    {
      q:{zh:"生日会几点开始？",es:"¿A qué hora empieza la fiesta?"},
      options:["晚上七点","七点晚上","晚上七小时"],
      correct:0,
      explain:{zh:"时间一般说“晚上七点”。",es:"La forma natural es 晚上七点."}
    },
    {
      q:{zh:"哪一句用“就”强调王芳的身份？",es:"¿Qué frase usa «就» para enfatizar la identidad de Wang Fang?"},
      options:["王芳就是今天的寿星。","王芳就今天的寿星是。","王芳今天寿星就是的。"],
      correct:0,
      explain:{
        zh:"本课“就”表示强调，通常和“是”组成“就是”，相当于“正是”：王芳就是今天的寿星。",
        es:"En esta lección «就» expresa énfasis y suele formar «就是» con «是»: Wang Fang es precisamente quien cumple años hoy."
      }
    },
    {
      q:{zh:"她哥哥送她什么？",es:"¿Qué le regala su hermano?"},
      options:["一本汉语词典","一汉语词典本","一本词典汉语"],
      correct:0,
      explain:{zh:"书本类量词用“本”：一本汉语词典。",es:"Para libros y diccionarios se usa el clasificador 本."}
    },
    {
      q:{zh:"哪一句的双宾语顺序正确？",es:"¿Qué frase tiene el orden correcto de doble objeto?"},
      options:[
        "她哥哥送她一本汉语词典。",
        "她哥哥送一本汉语词典她。",
        "她一本汉语词典送哥哥。"
      ],
      correct:0,
      explain:{zh:"“送”的顺序是：送＋人＋东西。",es:"Con 送 el orden es: regalar + persona + objeto."}
    }
  ];


  const cluePinyin = {
    date:{
      q:"Jīntiān jǐ yuè jǐ hào?",
      a:"Jīntiān wǔ yuè shíliù hào."
    },
    age:{
      q:"Tā jīnnián duō dà?",
      a:"Tā jīnnián èrshíyī suì."
    },
    family:{
      q:"Tā jiā yǒu jǐ kǒu rén?",
      a:"Tā jiā yǒu sì kǒu rén."
    },
    time:{
      q:"Tā wǎnshang jǐ diǎn yǒu kòng?",
      a:"Tā wǎnshang qī diǎn yǒu kòng."
    },
    gift:{
      q:"Tā gēge sòng tā shénme lǐwù?",
      a:"Tā gēge sòng tā yì běn Hànyǔ cídiǎn."
    }
  };

  const quizPinyin = [
    {
      q:"Jīntiān jǐ yuè jǐ hào?",
      options:["Wǔ yuè shíliù hào","Wǔ yuè liùshí hào","Shíliù wǔ yuè hào"]
    },
    {
      q:"Wáng Fāng jīnnián duō dà?",
      options:["Èrshí suì","Èrshíyī suì","Shí'èr yī suì"]
    },
    {
      q:"Tā jiā yǒu jǐ kǒu rén?",
      options:[
        "Tā jiā shì sì kǒu rén.",
        "Tā jiā yǒu sì kǒu rén.",
        "Tā yǒu jiā sì kǒu rén."
      ]
    },
    {
      q:"Shēngrì huì jǐ diǎn kāishǐ?",
      options:["Wǎnshang qī diǎn","Qī diǎn wǎnshang","Wǎnshang qī xiǎoshí"]
    },
    {
      q:"Nǎ yí jù yòng “jiù” qiángdiào Wáng Fāng de shēnfèn?",
      options:[
        "Wáng Fāng jiù shì jīntiān de shòuxīng.",
        "Wáng Fāng jiù jīntiān de shòuxīng shì.",
        "Wáng Fāng jīntiān shòuxīng jiù shì de."
      ]
    },
    {
      q:"Tā gēge sòng tā shénme?",
      options:[
        "Yì běn Hànyǔ cídiǎn",
        "Yī Hànyǔ cídiǎn běn",
        "Yì běn cídiǎn Hànyǔ"
      ]
    },
    {
      q:"Nǎ yí jù de shuāng bīnyǔ shùnxù zhèngquè?",
      options:[
        "Tā gēge sòng tā yì běn Hànyǔ cídiǎn.",
        "Tā gēge sòng yì běn Hànyǔ cídiǎn tā.",
        "Tā yì běn Hànyǔ cídiǎn sòng gēge."
      ]
    }
  ];

  const datePinyin = {
    "五月十六号":"wǔ yuè shíliù hào",
    "六月八号":"liù yuè bā hào",
    "七月二十号":"qī yuè èrshí hào",
    "九月十二号":"jiǔ yuè shí'èr hào",
    "十二月二十五号":"shí'èr yuè èrshíwǔ hào"
  };
  const timePinyin = {
    "下午三点":"xiàwǔ sān diǎn",
    "下午五点":"xiàwǔ wǔ diǎn",
    "晚上七点":"wǎnshang qī diǎn",
    "晚上八点":"wǎnshang bā diǎn"
  };
  const placePinyin = {
    "学生宿舍":"xuéshēng sùshè",
    "学校食堂":"xuéxiào shítáng",
    "中国饭馆":"Zhōngguó fànguǎn",
    "我家":"wǒ jiā"
  };
  const activityPinyin = {
    "吃蛋糕":"chī dàngāo",
    "吃中国菜":"chī Zhōngguó cài",
    "唱歌":"chàng gē",
    "喝茶、聊天":"hē chá, liáotiān"
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
  distributeQuizAnswers([2,1,0,2,1,0,2]);

  let state = {
    step:1,
    clues:[],
    wrongCandidates:0,
    identified:false,
    quizIndex:0,
    quizScore:0,
    quizAnswered:false,
    finalText:"",
    finalPinyin:"",finalProfile:null,
    completed:false,
    stars:0
  };

  try {
    state = Object.assign(state, JSON.parse(localStorage.getItem(STATE_KEY) || "{}"));
  } catch {}

  function langNow() {
    return typeof language !== "undefined" && language === "es" ? "es" : "zh";
  }

  function save() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {}
  }


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
    {zh:"听生日故事", es:"Historia"},
    {zh:"问生日信息", es:"Preguntas"},
    {zh:"选寿星", es:"Elegir"},
    {zh:"再确认", es:"Confirmar"},
    {zh:"做邀请卡", es:"Invitación"}
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
    button.onclick = () => {
      const target = document.getElementById(button.dataset.speechTarget);
      if (target) speak(target.textContent.trim());
    };
  });

  document.getElementById("startBirthdayMystery").onclick = () => showStep(2);

  const clueBoard = document.getElementById("birthdayClueBoard");
  const clueCounter = document.getElementById("birthdayClueCounter");
  const openFiles = document.getElementById("openBirthdayFiles");

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
      button.classList.toggle("asked",state.clues.includes(button.dataset.question));
    });

    const count = state.clues.length;
    clueCounter.dataset.zh = `已收集${count}/5条线索`;
    clueCounter.dataset.es = `${count}/5 pistas`;
    clueCounter.textContent = langNow() === "zh" ? clueCounter.dataset.zh : clueCounter.dataset.es;
    openFiles.disabled = count < 4;
    const evidenceText = document.getElementById("birthdayEvidenceText");
    const evidenceBar = document.getElementById("birthdayEvidenceBar");
    if (evidenceText) evidenceText.textContent = `${count} / 5`;
    if (evidenceBar) evidenceBar.style.width = `${count / 5 * 100}%`;
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

  const candidateFeedbackBox = document.getElementById("birthdayCandidateFeedback");
  const recap = document.getElementById("birthdayRecap");

  document.querySelectorAll(".birthday-choice").forEach(button => {
    button.onclick = () => {
      const candidate = button.dataset.candidate;

      if (candidate === "wangfang") {
        state.identified = true;
        candidateFeedbackBox.className = "game-feedback good";
        candidateFeedbackBox.textContent = langNow() === "zh"
          ? "推理正确！王芳就是今天的寿星。日期、年龄、家庭人数和时间都符合。"
          : "¡Correcto! Wang Fang es precisamente quien cumple años hoy. Coinciden la fecha, la edad, la familia y la hora.";
        recap.hidden = false;
        document.querySelectorAll(".birthday-choice").forEach(btn => btn.disabled = true);
        save();
        speak("王芳就是今天的寿星。她今年二十一岁，家里有四口人。生日会晚上七点开始。她哥哥送她一本汉语词典。");
      } else {
        state.wrongCandidates += 1;
        candidateFeedbackBox.className = "game-feedback bad";
        candidateFeedbackBox.textContent = candidateFeedbackText(candidate);
        save();
      }
    };
  });

  function candidateFeedbackText(candidate) {
    const item = candidateFeedbackCopy[candidate];
    return item ? item[langNow()] : "";
  }

  document.getElementById("startBirthdayQuiz").onclick = () => {
    state.quizIndex = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    save();
    showStep(4);
    renderQuiz();
  };

  const quizProgress = document.getElementById("birthdayQuizProgress");
  const quizQuestion = document.getElementById("birthdayQuizQuestion");
  const quizOptions = document.getElementById("birthdayQuizOptions");
  const quizFeedback = document.getElementById("birthdayQuizFeedback");
  const nextQuiz = document.getElementById("nextBirthdayQuiz");

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

    item.options.forEach((option,index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.innerHTML = `<span>${option}</span>${pinyinSpan(py.options[index])}`;
      button.onclick = () => answerQuiz(index,button);
      quizOptions.appendChild(button);
    });

    nextQuiz.dataset.zh = state.quizIndex === quiz.length - 1 ? "查看结果 →" : "下一题 →";
    nextQuiz.dataset.es = state.quizIndex === quiz.length - 1 ? "Ver resultado →" : "Siguiente →";
    nextQuiz.textContent = langNow() === "zh" ? nextQuiz.dataset.zh : nextQuiz.dataset.es;
  }

  function answerQuiz(index,button) {
    if (state.quizAnswered) return;
    state.quizAnswered = true;

    const item = quiz[state.quizIndex];
    const buttons = [...quizOptions.children];
    buttons.forEach((btn,i) => {
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

  const finalCard = document.getElementById("birthdayFinalCard");
  const finalText = document.getElementById("birthdayFinalText");
  const resultBox = document.getElementById("birthdayThemeResult");
  const resultStars = document.getElementById("birthdayResultStars");
  const resultMessage = document.getElementById("birthdayResultMessage");
  const birthdayGuest = document.getElementById("birthdayCardGuest");
  const birthdayGuestPy = document.getElementById("birthdayCardGuestPinyin");
  const birthdayHost = document.getElementById("birthdayCardHost");
  const birthdayDate = document.getElementById("birthdayCardDate");
  const birthdayDatePy = document.getElementById("birthdayCardDatePinyin");
  const birthdayTime = document.getElementById("birthdayCardTime");
  const birthdayTimePy = document.getElementById("birthdayCardTimePinyin");
  const birthdayPlace = document.getElementById("birthdayCardPlace");
  const birthdayPlacePy = document.getElementById("birthdayCardPlacePinyin");
  const birthdayActivity = document.getElementById("birthdayCardActivity");
  const birthdayActivityPy = document.getElementById("birthdayCardActivityPinyin");

  function renderBirthdayProfile(profile) {
    if (!profile) return;
    birthdayGuest.textContent = profile.guest || "—";
    birthdayGuestPy.textContent = profile.guest || "";
    birthdayHost.textContent = profile.host || "—";
    birthdayDate.textContent = profile.date || "—";
    birthdayDatePy.textContent = datePinyin[profile.date] || "";
    birthdayTime.textContent = profile.time || "—";
    birthdayTimePy.textContent = timePinyin[profile.time] || "";
    birthdayPlace.textContent = profile.place || "—";
    birthdayPlacePy.textContent = placePinyin[profile.place] || "";
    birthdayActivity.textContent = profile.activity || "—";
    birthdayActivityPy.textContent = activityPinyin[profile.activity] || "";
  }

  function parseLegacyBirthday(text) {
    const m = String(text || "").match(/^(.+?)，你好！(.+?)是我的生日。生日会(.+?)在(.+?)开始。请你来参加！我们一起(.+?)。(.+)$/);
    if (!m) return null;
    return { guest: m[1], date: m[2], time: m[3], place: m[4], activity: m[5], host: m[6] };
  }

  document.getElementById("printBirthdaySolvedCard")?.addEventListener("click", () => printProfile(document.getElementById("birthdaySolvedCard")));
  document.getElementById("printBirthdayCard")?.addEventListener("click", () => printProfile(document.getElementById("printableBirthdayCard")));

  function calculateStars() {
    if (state.wrongCandidates === 0 && state.quizScore >= 6) return 3;
    if (state.quizScore >= 4) return 2;
    return 1;
  }

  document.getElementById("generateBirthdayCard").onclick = () => {
    const host = document.getElementById("birthdayHost").value.trim();
    const guest = document.getElementById("birthdayGuest").value.trim();
    const date = document.getElementById("birthdayDate").value;
    const time = document.getElementById("birthdayTime").value;
    const place = document.getElementById("birthdayPlace").value;
    const activity = document.getElementById("birthdayActivity").value;

    if (!host || !guest || !date || !time || !place || !activity) {
      alert(langNow() === "zh" ? "请先填写全部信息。" : "Completa todos los datos.");
      return;
    }

    const text = `${guest}，你好！${date}是我的生日。生日会${time}在${place}开始。请你来参加！我们一起${activity}。${host}`;
    const pinyin = `${guest}, nǐ hǎo! ${datePinyin[date]} shì wǒ de shēngrì. Shēngrì huì ${timePinyin[time]} zài ${placePinyin[place]} kāishǐ. Qǐng nǐ lái cānjiā! Wǒmen yìqǐ ${activityPinyin[activity]}. ${host}`;
    const profile = { host, guest, date, time, place, activity };
    state.finalText = text;
    state.finalPinyin = pinyin;
    state.finalProfile = profile;
    state.completed = true;
    state.stars = calculateStars();
    save();

    renderBirthdayProfile(profile);
    finalText.textContent = text;
    document.getElementById('birthdayFinalPinyin').textContent = pinyin;
    finalCard.hidden = false;
    resultBox.hidden = false;
    resultStars.textContent = "★".repeat(state.stars) + "☆".repeat(3 - state.stars);
    resultMessage.textContent = langNow() === "zh"
      ? `你收集了${state.clues.length}条线索，生日确认题答对${state.quizScore}/7题，并完成了一张中文生日邀请卡。`
      : `Has reunido ${state.clues.length} pistas, acertado ${state.quizScore}/7 preguntas y creado una invitación de cumpleaños en chino.`;
    speak(text);
  };

  document.getElementById("speakBirthdayCard").onclick = event => {
    const text = state.finalText || finalText.textContent.trim();
    speak(text, event.currentTarget);
  };

  document.getElementById("copyBirthdayCard").onclick = async event => {
    const copied = await copyTextWithFallback(state.finalText || finalText.textContent.trim());
    buttonLabel(event.currentTarget, copied ? "已复制" : "复制失败", copied ? "Copiado" : "No se pudo copiar");
    window.setTimeout(() => restoreButtonLabel(event.currentTarget), 1600);
  };

  document.getElementById("resetBirthdayTheme").onclick = () => {
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
          ? `你收集了${state.clues.length}条线索，生日确认题答对${state.quizScore}/7题，并完成了一张中文生日邀请卡。`
          : `Has reunido ${state.clues.length} pistas, acertado ${state.quizScore}/7 preguntas y creado una invitación de cumpleaños en chino.`;
      }
    },0);
  });

  renderClues();

  if (state.finalText) {
    if (!state.finalProfile) {
      state.finalProfile = parseLegacyBirthday(state.finalText);
      save();
    }
    renderBirthdayProfile(state.finalProfile);
    finalText.textContent = state.finalText;
    document.getElementById('birthdayFinalPinyin').textContent = state.finalPinyin || '';
    finalCard.hidden = false;
    resultBox.hidden = false;
    resultStars.textContent = "★".repeat(state.stars || 1) + "☆".repeat(3 - (state.stars || 1));
  }

  if (state.completed) {
    showStep(5);
  } else if (state.identified) {
    showStep(4);
    state.quizIndex = 0;
    state.quizScore = 0;
    renderQuiz();
  } else if (state.clues.length >= 4) {
    showStep(3);
  } else if (state.clues.length) {
    showStep(2);
  } else {
    showStep(1);
  }
})();
