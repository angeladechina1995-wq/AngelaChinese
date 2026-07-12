
(() => {
  const DATA = window.NPCR1_VOCABULARY || {};
  const root = document.getElementById("volumeWordApp");
  if (!root) return;

  const mode = root.dataset.mode === "main" ? "main" : "all";
  const search = document.getElementById("summaryWordSearch");
  const lessonFilter = document.getElementById("summaryLessonFilter");
  const sourceFilter = document.getElementById("summarySourceFilter");
  const revealButton = document.getElementById("summaryRevealAll");
  const shuffleButton = document.getElementById("summaryShuffle");
  const groups = document.getElementById("volumeWordGroups");
  const status = document.getElementById("summaryLiveStatus");
  const empty = document.getElementById("summaryWordEmpty");

  let revealAll = false;
  let shuffled = false;
  const revealed = new Set();

  const labels = {
    zh: {
      allLessons: "全部课次",
      lesson: n => `第${n}课`,
      allSources: "全部来源",
      main1: "生词1",
      main2: "生词2",
      supplementary: "补充词汇",
      reveal: "显示全部答案",
      hide: "隐藏全部答案",
      shuffle: "随机排列",
      restore: "恢复教材顺序",
      hidden: "点击查看拼音和西语",
      result: n => `当前显示 ${n} 个词`,
      groupCount: n => `${n}个词`,
      empty: "没有符合条件的词汇。",
      search: "搜索汉字、拼音、西语或词性",
      audio: word => `朗读${word}`,
    },
    es: {
      allLessons: "Todas las lecciones",
      lesson: n => `Lección ${n}`,
      allSources: "Todas las fuentes",
      main1: "Vocabulario 1",
      main2: "Vocabulario 2",
      supplementary: "Vocabulario adicional",
      reveal: "Mostrar todas las respuestas",
      hide: "Ocultar todas las respuestas",
      shuffle: "Orden aleatorio",
      restore: "Restaurar orden",
      hidden: "Pulsa para ver pinyin y significado",
      result: n => `${n} palabras visibles`,
      groupCount: n => `${n} palabras`,
      empty: "No hay palabras que coincidan con los filtros.",
      search: "Buscar carácter, pinyin, español o categoría",
      audio: word => `Escuchar ${word}`,
    }
  };

  function currentLang() {
    return typeof language !== "undefined" && language === "es" ? "es" : "zh";
  }
  function L() { return labels[currentLang()]; }

  function sourceName(source) {
    return L()[source] || source;
  }

  function speak(word) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "zh-CN";
    u.rate = .82;
    const voices = speechSynthesis.getVoices();
    u.voice = voices.find(v => /^zh-CN/i.test(v.lang))
      || voices.find(v => /^zh/i.test(v.lang))
      || null;
    speechSynthesis.speak(u);
  }

  function eligibleItem(item) {
    if (mode === "all") return true;
    return item.sources.some(source => source === "main1" || source === "main2");
  }

  function buildFilters() {
    const chosenLesson = lessonFilter.value;
    const chosenSource = sourceFilter.value;

    lessonFilter.innerHTML = "";
    const allLessonOption = document.createElement("option");
    allLessonOption.value = "all";
    allLessonOption.textContent = L().allLessons;
    lessonFilter.appendChild(allLessonOption);
    Object.keys(DATA).forEach(id => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = `${L().lesson(id)} · ${DATA[id].title[currentLang()]}`;
      lessonFilter.appendChild(option);
    });
    lessonFilter.value = DATA[chosenLesson] ? chosenLesson : "all";

    sourceFilter.innerHTML = "";
    const sourceOptions = mode === "main"
      ? ["all", "main1", "main2"]
      : ["all", "main1", "main2", "supplementary"];
    sourceOptions.forEach(source => {
      const option = document.createElement("option");
      option.value = source;
      option.textContent = source === "all" ? L().allSources : sourceName(source);
      sourceFilter.appendChild(option);
    });
    sourceFilter.value = sourceOptions.includes(chosenSource) ? chosenSource : "all";

    search.placeholder = L().search;
    revealButton.textContent = revealAll ? L().hide : L().reveal;
    shuffleButton.textContent = shuffled ? L().restore : L().shuffle;
  }

  function filteredLessons() {
    const query = search.value.trim().toLocaleLowerCase();
    const lessonChoice = lessonFilter.value;
    const sourceChoice = sourceFilter.value;
    const output = [];

    Object.entries(DATA).forEach(([lessonId, lesson]) => {
      if (lessonChoice !== "all" && lessonChoice !== lessonId) return;
      let items = lesson.items
        .filter(eligibleItem)
        .filter(item => sourceChoice === "all" || item.sources.includes(sourceChoice))
        .filter(item => {
          if (!query) return true;
          const haystack = [
            item.word, item.pinyin, item.meaning, item.pos,
            ...item.sources.map(sourceName)
          ].join(" ").toLocaleLowerCase();
          return haystack.includes(query);
        });

      if (shuffled) {
        items = [...items].sort(() => Math.random() - .5);
      }
      if (items.length) output.push({lessonId, lesson, items});
    });
    return output;
  }

  function createCard(item, lessonId) {
    const article = document.createElement("article");
    article.className = "volume-word-card";

    const top = document.createElement("div");
    top.className = "volume-word-source-row";

    item.sources
      .filter(source => mode === "all" || source !== "supplementary")
      .forEach(source => {
        const chip = document.createElement("span");
        chip.className = "volume-word-source";
        chip.textContent = sourceName(source);
        top.appendChild(chip);
      });

    const audio = document.createElement("button");
    audio.type = "button";
    audio.className = "volume-word-audio";
    audio.textContent = "▶";
    audio.setAttribute("aria-label", L().audio(item.word));
    audio.onclick = event => {
      event.stopPropagation();
      speak(item.word);
    };
    top.appendChild(audio);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "volume-word-main";

    const hanzi = document.createElement("strong");
    hanzi.className = "volume-word-hanzi";
    hanzi.textContent = item.word;

    const answer = document.createElement("span");
    answer.className = "volume-word-answer";

    const key = `${lessonId}:${item.word}`;
    const isOpen = revealAll || revealed.has(key);

    if (isOpen) {
      const pinyin = document.createElement("span");
      pinyin.className = "pinyin";
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
      answer.textContent = L().hidden;
    }

    button.setAttribute("aria-expanded", String(isOpen));
    button.append(hanzi, answer);
    button.onclick = () => {
      if (revealed.has(key)) revealed.delete(key);
      else revealed.add(key);
      render();
    };

    article.append(top, button);
    return article;
  }

  function render() {
    buildFilters();
    groups.innerHTML = "";
    const result = filteredLessons();
    const total = result.reduce((sum, lesson) => sum + lesson.items.length, 0);
    status.textContent = L().result(total);
    empty.hidden = total > 0;

    result.forEach(({lessonId, lesson, items}) => {
      const section = document.createElement("section");
      section.className = "volume-lesson-group";
      section.id = `lesson-${lessonId}`;

      const head = document.createElement("div");
      head.className = "volume-lesson-head";
      const copy = document.createElement("div");
      const h2 = document.createElement("h2");
      h2.textContent = `${L().lesson(lessonId)} · ${lesson.title.zh}`;
      const p = document.createElement("p");
      p.textContent = lesson.title.es;
      copy.append(h2, p);

      const count = document.createElement("span");
      count.className = "volume-lesson-count";
      count.textContent = L().groupCount(items.length);
      head.append(copy, count);

      const grid = document.createElement("div");
      grid.className = "volume-word-grid";
      items.forEach(item => grid.appendChild(createCard(item, lessonId)));

      section.append(head, grid);
      groups.appendChild(section);
    });
  }

  const params = new URLSearchParams(location.search);
  if (DATA[params.get("lesson")]) lessonFilter.value = params.get("lesson");
  const requestedSource = params.get("source");
  if (["main1", "main2", "supplementary"].includes(requestedSource)) {
    sourceFilter.value = requestedSource;
  }
  if (params.get("q")) search.value = params.get("q");

  search.addEventListener("input", render);
  lessonFilter.addEventListener("change", render);
  sourceFilter.addEventListener("change", render);
  revealButton.onclick = () => {
    revealAll = !revealAll;
    if (!revealAll) revealed.clear();
    render();
  };
  shuffleButton.onclick = () => {
    shuffled = !shuffled;
    render();
  };
  document.getElementById("lang")?.addEventListener("click", () => setTimeout(render, 0));

  render();
})();
