
(() => {
  const KEY = "npcr1TprsPinyinVisibleV1";

  function currentLang() {
    return typeof language !== "undefined" && language === "es" ? "es" : "zh";
  }

  function readVisible() {
    try {
      return localStorage.getItem(KEY) === "true";
    } catch {
      return false;
    }
  }

  function saveVisible(value) {
    try {
      localStorage.setItem(KEY, String(value));
    } catch {}
  }

  function addStaticPinyin() {
    document.querySelectorAll("[data-pinyin]").forEach(element => {
      if (element.closest(".story-box") || element.closest(".recap-box")) return;
      if (element.querySelector(":scope > .learning-pinyin")) return;
      const pinyin = document.createElement("span");
      pinyin.className = "learning-pinyin";
      pinyin.textContent = element.dataset.pinyin;
      element.appendChild(pinyin);
    });
  }

  function updateButton() {
    const button = document.getElementById("pinyinToggle");
    if (!button) return;
    const visible = document.body.classList.contains("show-pinyin");
    const es = currentLang() === "es";
    button.dataset.zh = visible ? "隐藏拼音" : "显示拼音";
    button.dataset.es = visible ? "Ocultar pinyin" : "Mostrar pinyin";
    button.textContent = es ? button.dataset.es : button.dataset.zh;
    button.setAttribute("aria-pressed", String(visible));
  }

  function setVisible(value) {
    document.body.classList.toggle("show-pinyin", value);
    saveVisible(value);
    updateButton();
  }

  function init() {
    addStaticPinyin();
    setVisible(readVisible());

    const button = document.getElementById("pinyinToggle");
    if (button) {
      button.addEventListener("click", () => {
        setVisible(!document.body.classList.contains("show-pinyin"));
      });
    }

    document.getElementById("lang")?.addEventListener("click", () => {
      window.setTimeout(updateButton, 0);
    });
  }

  window.TPRSPinyin = {
    init,
    addStaticPinyin,
    isVisible: () => document.body.classList.contains("show-pinyin")
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
