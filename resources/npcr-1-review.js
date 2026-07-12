
(() => {
  const DATA = window.NPCR1_REVIEW_DATA;
  if (!DATA) return;

  const STORAGE_KEY = "npcr1ReviewChecklistV1";
  const skills = ["vocab", "grammar", "text", "character", "task"];
  const labels = {
    zh: {
      lesson: n => `第${n}课`,
      words: n => `${n}个主生词`,
      allWords: "全部词汇",
      mainWords: "重点词汇",
      lessonPage: "本课目录",
      text: "课文",
      grammar: "语法",
      characters: "汉字",
      practice: "本课练习",
      completed: n => `已完成 ${n}/50 项自检`,
      randomTitle: "今天的复习建议",
      randomSkill: {
        vocab: "重点词汇",
        grammar: "语法",
        text: "课文理解",
        character: "汉字",
        task: "情景表达",
      },
      resetConfirm: "确定清空全部自检记录吗？",
    },
    es: {
      lesson: n => `Lección ${n}`,
      words: n => `${n} palabras principales`,
      allWords: "Todo el vocabulario",
      mainWords: "Vocabulario principal",
      lessonPage: "Índice de la lección",
      text: "Textos",
      grammar: "Gramática",
      characters: "Caracteres",
      practice: "Ejercicios de la lección",
      completed: n => `${n}/50 elementos completados`,
      randomTitle: "Sugerencia de repaso para hoy",
      randomSkill: {
        vocab: "vocabulario principal",
        grammar: "gramática",
        text: "comprensión de textos",
        character: "caracteres",
        task: "expresión situacional",
      },
      resetConfirm: "¿Quieres borrar todo el registro de autoevaluación?",
    }
  };

  function langNow() {
    return typeof language !== "undefined" && language === "es" ? "es" : "zh";
  }
  function L() { return labels[langNow()]; }
  function t(value) { return value[langNow()]; }

  let checklist = {};
  try {
    checklist = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    checklist = {};
  }

  function saveChecklist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checklist));
    } catch {}
  }

  function renderStages() {
    const root = document.getElementById("stageGrid");
    root.innerHTML = "";

    DATA.stages.forEach(stage => {
      const article = document.createElement("article");
      article.className = "stage-card";

      const top = document.createElement("div");
      top.className = "stage-top";
      const number = document.createElement("div");
      number.className = "stage-number";
      number.textContent = stage.id;
      const copy = document.createElement("div");
      copy.innerHTML = `<h3>${t(stage.title)}</h3><p>${t(stage.goal)}</p>`;
      top.append(number, copy);

      const lessons = document.createElement("div");
      lessons.className = "stage-lessons";

      stage.lessons.forEach(id => {
        const title = DATA.lessonTitles[String(id)];
        const card = document.createElement("div");
        card.className = "stage-lesson";

        const grammar = DATA.grammar[String(id)]
          .map(point => `<span class="grammar-chip">${point[langNow()]}</span>`)
          .join("");

        card.innerHTML = `
          <h4>${L().lesson(id)} · ${title.zh}</h4>
          <div class="es">${title.es}</div>
          <div class="grammar-chip-list">${grammar}</div>
          <div class="stage-actions">
            <a href="npcr-1-main-words.html?lesson=${id}">${L().mainWords}</a>
            <a href="npcr-1-lesson-${id}-grammar.html">${L().grammar}</a>
            <a href="../courses/npcr-1-lesson-${id}.html">${L().lessonPage}</a>
            <a class="primary" href="npcr-1-workbook.html?lesson=${id}">${L().practice}</a>
          </div>
        `;
        lessons.appendChild(card);
      });

      article.append(top, lessons);
      root.appendChild(article);
    });
  }

  function renderKnowledgeMap() {
    const root = document.getElementById("knowledgeGrid");
    root.innerHTML = "";

    Object.keys(DATA.lessonTitles).forEach(id => {
      const title = DATA.lessonTitles[id];
      const counts = DATA.counts[id];
      const points = DATA.grammar[id];

      const card = document.createElement("article");
      card.className = "knowledge-card";
      const chips = points
        .map(point => `<span class="grammar-chip">${point[langNow()]}</span>`)
        .join("");

      card.innerHTML = `
        <div class="knowledge-card-head">
          <div>
            <h3>${L().lesson(id)} · ${title.zh}</h3>
            <p class="es">${title.es}</p>
          </div>
          <span class="knowledge-count">${L().words(counts.main)}</span>
        </div>
        <div class="grammar-chip-list">${chips}</div>
        <div class="knowledge-links">
          <a href="../courses/npcr-1-lesson-${id}.html">${L().lessonPage}</a>
          <a href="npcr-1-all-words.html?lesson=${id}">${L().allWords}</a>
          <a href="npcr-1-lesson-${id}-text-1.html">${L().text}1</a>
          <a href="npcr-1-lesson-${id}-text-2.html">${L().text}2</a>
          <a href="npcr-1-lesson-${id}-grammar.html">${L().grammar}</a>
          <a href="npcr-1-lesson-${id}-characters.html">${L().characters}</a>
          <a href="npcr-1-workbook.html?lesson=${id}">${L().practice}</a>
        </div>
      `;
      root.appendChild(card);
    });
  }

  function renderChecklist() {
    const tbody = document.getElementById("checklistBody");
    tbody.innerHTML = "";

    Object.keys(DATA.lessonTitles).forEach(id => {
      const title = DATA.lessonTitles[id];
      const tr = document.createElement("tr");
      const lessonCell = document.createElement("td");
      lessonCell.innerHTML = `<strong>${L().lesson(id)}</strong><br><small>${title.zh}</small>`;
      tr.appendChild(lessonCell);

      skills.forEach(skill => {
        const key = `${id}:${skill}`;
        const td = document.createElement("td");
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = Boolean(checklist[key]);
        input.setAttribute("aria-label", `${L().lesson(id)} ${L().randomSkill[skill]}`);
        input.onchange = () => {
          checklist[key] = input.checked;
          saveChecklist();
          updateProgress();
        };
        label.appendChild(input);
        td.appendChild(label);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
    updateProgress();
  }

  function updateProgress() {
    const checked = Object.values(checklist).filter(Boolean).length;
    const percent = Math.round(checked / 50 * 100);
    document.getElementById("checkProgressBar").style.width = `${percent}%`;
    document.getElementById("checkPercent").textContent = `${percent}%`;
    document.getElementById("checkStatus").textContent = L().completed(checked);
  }

  function randomSuggestion() {
    const candidates = [];
    Object.keys(DATA.lessonTitles).forEach(id => {
      skills.forEach(skill => {
        if (!checklist[`${id}:${skill}`]) candidates.push({id, skill});
      });
    });
    const pool = candidates.length ? candidates : Object.keys(DATA.lessonTitles).flatMap(id =>
      skills.map(skill => ({id, skill}))
    );
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const title = DATA.lessonTitles[pick.id];

    let href = `../courses/npcr-1-lesson-${pick.id}.html`;
    if (pick.skill === "vocab") href = `npcr-1-main-words.html?lesson=${pick.id}`;
    if (pick.skill === "grammar") href = `npcr-1-lesson-${pick.id}-grammar.html`;
    if (pick.skill === "text") href = `npcr-1-lesson-${pick.id}-text-1.html`;
    if (pick.skill === "character") href = `npcr-1-lesson-${pick.id}-characters.html`;
    if (pick.skill === "task") href = `npcr-1-workbook.html?lesson=${pick.id}`;

    const box = document.getElementById("reviewSuggestion");
    box.innerHTML = `
      <strong>${L().randomTitle}</strong>
      <span>${L().lesson(pick.id)} · ${title.zh}：${L().randomSkill[pick.skill]}</span>
      <a href="${href}" style="display:inline-block;margin-left:10px;color:var(--red);font-weight:900">
        ${langNow()==="zh" ? "开始复习 →" : "Empezar →"}
      </a>
    `;
  }

  document.getElementById("randomReview").onclick = randomSuggestion;
  document.getElementById("resetChecklist").onclick = () => {
    if (!confirm(L().resetConfirm)) return;
    checklist = {};
    saveChecklist();
    renderChecklist();
  };

  document.getElementById("lang")?.addEventListener("click", () => setTimeout(() => {
    renderStages();
    renderKnowledgeMap();
    renderChecklist();
    document.getElementById("reviewSuggestion").innerHTML = "";
  }, 0));

  renderStages();
  renderKnowledgeMap();
  renderChecklist();
})();
