
(() => {
  const vocabularyData = window.NPCR1_VOCABULARY || {};
  const section = document.getElementById("vocabulario");
  const tabs = document.getElementById("lessonVocabTabs");
  const grid = document.getElementById("lessonWordGrid");
  const title = document.getElementById("currentLessonTitle");
  const subtitle = document.getElementById("currentLessonSubtitle");
  const count = document.getElementById("currentLessonCount");
  const search = document.getElementById("homeVocabSearch");
  const revealButton = document.getElementById("revealAllWords");
  const shuffleButton = document.getElementById("shuffleWords");
  const links = document.getElementById("lessonVocabLinks");
  const empty = document.getElementById("vocabEmpty");

  if (!section || !tabs || !grid || !vocabularyData["1"]) return;

  let selectedLesson = localStorage.getItem("homeVocabularyLesson") || "1";
  if (!vocabularyData[selectedLesson]) selectedLesson = "1";

  let query = "";
  let revealAll = false;
  let shuffledOrder = null;
  const revealedWords = new Set();

  const labels = {
    zh: {
      lesson: n => `第${n}课`,
      count: n => `本课共 ${n} 个词`,
      total: n => `第一册共收录 ${n} 个词`,
      hidden: "点击查看拼音和西语",
      hide: "隐藏答案",
      revealAll: "显示全部答案",
      hideAll: "隐藏全部答案",
      shuffle: "随机排列",
      sourceMain1: "生词1",
      sourceMain2: "生词2",
      sourceSupp: "补充词汇",
      enterLesson: "进入本课",
      words1: "生词1",
      words2: "生词2",
      supplementary: "补充词汇",
      noResult: "本课没有符合搜索条件的词汇。",
      placeholder: "搜索汉字、拼音或西语",
      audio: word => `朗读${word}`,
    },
    es: {
      lesson: n => `Lección ${n}`,
      count: n => `${n} palabras en esta lección`,
      total: n => `${n} palabras en el Libro 1`,
      hidden: "Pulsa para ver pinyin y significado",
      hide: "Ocultar respuesta",
      revealAll: "Mostrar todas las respuestas",
      hideAll: "Ocultar todas las respuestas",
      shuffle: "Orden aleatorio",
      sourceMain1: "Vocab. 1",
      sourceMain2: "Vocab. 2",
      sourceSupp: "Adicional",
      enterLesson: "Entrar en la lección",
      words1: "Vocabulario 1",
      words2: "Vocabulario 2",
      supplementary: "Vocabulario adicional",
      noResult: "No hay palabras que coincidan con la búsqueda.",
      placeholder: "Buscar carácter, pinyin o español",
      audio: word => `Escuchar ${word}`,
    }
  };

  function currentLang() {
    return typeof language !== "undefined" && language === "es" ? "es" : "zh";
  }

  function label() {
    return labels[currentLang()];
  }

  function speakChinese(text) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.82;
    const voices = speechSynthesis.getVoices();
    const voice = voices.find(v => /^zh-CN/i.test(v.lang))
      || voices.find(v => /^zh/i.test(v.lang));
    if (voice) utterance.voice = voice;
    speechSynthesis.speak(utterance);
  }

  function createTabs() {
    tabs.innerHTML = "";
    Object.keys(vocabularyData).forEach(lesson => {
      const data = vocabularyData[lesson];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lesson-vocab-tab";
      button.dataset.lesson = lesson;
      button.setAttribute("aria-pressed", String(lesson === selectedLesson));
      button.classList.toggle("active", lesson === selectedLesson);

      const number = document.createElement("strong");
      number.textContent = label().lesson(lesson);

      const small = document.createElement("span");
      small.textContent = data.title[currentLang()];

      button.append(number, small);
      button.addEventListener("click", () => {
        selectedLesson = lesson;
        localStorage.setItem("homeVocabularyLesson", selectedLesson);
        query = "";
        search.value = "";
        revealAll = false;
        shuffledOrder = null;
        revealedWords.clear();
        renderAll();
      });
      tabs.appendChild(button);
    });
  }

  function sourceText(source) {
    if (source === "main1") return label().sourceMain1;
    if (source === "main2") return label().sourceMain2;
    return label().sourceSupp;
  }

  function getFilteredItems() {
    const data = vocabularyData[selectedLesson];
    let items = [...data.items];

    if (shuffledOrder) {
      const position = new Map(shuffledOrder.map((word, index) => [word, index]));
      items.sort((a, b) =>
        (position.get(a.word) ?? 9999) - (position.get(b.word) ?? 9999)
      );
    }

    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return items;

    return items.filter(item => {
      const haystack = [
        item.word,
        item.pinyin,
        item.meaning,
        item.pos,
        ...item.sources.map(sourceText)
      ].join(" ").toLocaleLowerCase();
      return haystack.includes(normalized);
    });
  }

  function makeCard(item) {
    const article = document.createElement("article");
    article.className = "home-vocab-card";
    article.dataset.word = item.word;

    const sourceRow = document.createElement("div");
    sourceRow.className = "home-vocab-source-row";
    item.sources.forEach(source => {
      const chip = document.createElement("span");
      chip.className = "home-vocab-source";
      chip.textContent = sourceText(source);
      sourceRow.appendChild(chip);
    });

    const audioButton = document.createElement("button");
    audioButton.type = "button";
    audioButton.className = "home-vocab-audio";
    audioButton.setAttribute("aria-label", label().audio(item.word));
    audioButton.textContent = "▶";
    audioButton.addEventListener("click", event => {
      event.stopPropagation();
      speakChinese(item.word);
    });

    sourceRow.appendChild(audioButton);

    const mainButton = document.createElement("button");
    mainButton.type = "button";
    mainButton.className = "home-vocab-main";

    const word = document.createElement("strong");
    word.className = "home-vocab-hanzi";
    word.textContent = item.word;

    const answer = document.createElement("span");
    answer.className = "home-vocab-answer";

    const isRevealed = revealAll || revealedWords.has(item.word);
    article.classList.toggle("revealed", isRevealed);
    mainButton.setAttribute("aria-expanded", String(isRevealed));

    if (isRevealed) {
      const pinyin = document.createElement("span");
      pinyin.className = "home-vocab-pinyin";
      pinyin.textContent = item.pinyin;

      const meaning = document.createElement("b");
      meaning.textContent = item.meaning;

      answer.append(pinyin, meaning);

      if (item.pos) {
        const pos = document.createElement("small");
        pos.textContent = item.pos;
        answer.appendChild(pos);
      }
    } else {
      answer.textContent = label().hidden;
    }

    mainButton.append(word, answer);
    mainButton.addEventListener("click", () => {
      if (revealedWords.has(item.word)) {
        revealedWords.delete(item.word);
      } else {
        revealedWords.add(item.word);
      }
      renderCards();
    });

    article.append(sourceRow, mainButton);
    return article;
  }

  function renderHeader() {
    const data = vocabularyData[selectedLesson];
    title.textContent = `${label().lesson(selectedLesson)} · ${data.title.zh}`;
    subtitle.textContent = data.title.es;
    count.textContent = label().count(data.items.length);
    count.title = label().total(
      Object.values(vocabularyData).reduce((sum, lesson) => sum + lesson.items.length, 0)
    );

    search.placeholder = label().placeholder;
    revealButton.textContent = revealAll ? label().hideAll : label().revealAll;
    shuffleButton.textContent = label().shuffle;

    links.innerHTML = "";
    const linkDefinitions = [
      [data.links.lesson, label().enterLesson, "primary"],
      [data.links.words1, label().words1, ""],
      [data.links.words2, label().words2, ""],
      [data.links.supplementary, label().supplementary, ""]
    ];
    linkDefinitions.forEach(([href, text, className]) => {
      const a = document.createElement("a");
      a.href = href;
      a.textContent = text;
      if (className) a.className = className;
      links.appendChild(a);
    });
  }

  function renderCards() {
    const items = getFilteredItems();
    grid.innerHTML = "";
    empty.hidden = items.length > 0;
    empty.textContent = label().noResult;
    items.forEach(item => grid.appendChild(makeCard(item)));
  }

  function renderAll() {
    createTabs();
    renderHeader();
    renderCards();
  }

  search.addEventListener("input", () => {
    query = search.value;
    renderCards();
  });

  revealButton.addEventListener("click", () => {
    revealAll = !revealAll;
    if (!revealAll) revealedWords.clear();
    renderHeader();
    renderCards();
  });

  shuffleButton.addEventListener("click", () => {
    const words = vocabularyData[selectedLesson].items.map(item => item.word);
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    shuffledOrder = words;
    renderCards();
  });

  if (typeof lang !== "undefined") {
    lang.addEventListener("click", () => {
      window.setTimeout(renderAll, 0);
    });
  }

  renderAll();
})();
