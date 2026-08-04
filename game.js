"use strict";

const words = {
  ru: [
    { word: "дерево", translation: "tree", sprite: "tree", type: "plant" },
    { word: "цветок", translation: "flower", sprite: "flower", type: "plant" },
    { word: "пчела", translation: "bee", sprite: "bee", type: "visitor" },
    { word: "трава", translation: "grass", sprite: "grass", type: "plant" },
    { word: "бабочка", translation: "butterfly", sprite: "butterfly", type: "visitor" },
    { word: "птица", translation: "bird", sprite: "bird", type: "visitor" },
    { word: "гриб", translation: "mushroom", sprite: "mushroom", type: "plant" }
  ],
  en: [
    { word: "tree", translation: "дерево", sprite: "tree", type: "plant" },
    { word: "flower", translation: "цветок", sprite: "flower", type: "plant" },
    { word: "bee", translation: "пчела", sprite: "bee", type: "visitor" },
    { word: "grass", translation: "трава", sprite: "grass", type: "plant" },
    { word: "butterfly", translation: "бабочка", sprite: "butterfly", type: "visitor" },
    { word: "bird", translation: "птица", sprite: "bird", type: "visitor" },
    { word: "mushroom", translation: "гриб", sprite: "mushroom", type: "plant" }
  ]
};

const copy = {
  ru: {
    title: "Волшебный сад", eyebrow: "Игра для юных садовников",
    subtitle: "Печатай слова — и сад оживёт!", instruction: "Напечатай слово:",
    inputLabel: "Введите показанное слово", check: "Готово", reset: "Начать сад заново",
    score: "Выращено:", empty: "Здесь скоро появятся первые растения…",
    success: translation => `Правильно! По-английски: ${translation}`,
    error: "Почти! Проверь буквы и попробуй ещё раз."
  },
  en: {
    title: "Magic Garden", eyebrow: "A game for young gardeners",
    subtitle: "Type words and watch the garden grow!", instruction: "Type this word:",
    inputLabel: "Type the word shown", check: "Done", reset: "Start a new garden",
    score: "Garden friends:", empty: "The first plants will appear here soon…",
    success: translation => `Great! In Russian: ${translation}`,
    error: "Almost! Check the letters and try again."
  }
};

const $ = selector => document.querySelector(selector);
const elements = {
  title: $("#game-title"), eyebrow: $("#eyebrow"), subtitle: $("#subtitle"),
  instruction: $("#instruction"), target: $("#task-heading"), input: $("#word-input"),
  inputLabel: $("#input-label"), check: $("#check-button"), message: $("#message"),
  score: $("#score"), scoreLabel: $("#score-label"), garden: $("#garden-objects"),
  gardenScene: $("#garden"), empty: $("#empty-garden"), reset: $("#reset-button"),
  languages: document.querySelectorAll(".language-button")
};

let language = "ru";
let currentWord;
let previousWord = "";
let score = 0;
let locked = false;
let nextWordTimer;

function normalize(value) {
  return value.trim().toLocaleLowerCase(language === "ru" ? "ru-RU" : "en-US");
}

function chooseWord() {
  const list = words[language];
  let next;
  do next = list[Math.floor(Math.random() * list.length)];
  while (list.length > 1 && next.word === previousWord);

  currentWord = next;
  previousWord = next.word;
  elements.target.textContent = next.word;
  elements.input.value = "";
  elements.input.disabled = false;
  elements.check.disabled = false;
  elements.input.classList.remove("error");
  locked = false;
  elements.input.focus();
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function addGardenObject(item) {
  const object = document.createElement("span");
  object.className = `garden-object ${item.type} sprite-${item.sprite}`;
  object.setAttribute("role", "img");
  object.setAttribute("aria-label", item.word);
  object.style.left = `${randomBetween(3, 86)}%`;
  object.style.setProperty("--top", `${randomBetween(25, 55)}%`);
  object.style.setProperty("--bottom", `${randomBetween(7, 13)}%`);
  object.style.zIndex = String(Math.floor(randomBetween(2, 8)));
  elements.garden.append(object);
  elements.empty.classList.add("hidden");

  // Старые объекты удаляются незаметно, чтобы сад не замедлял браузер.
  if (elements.garden.children.length > 30) elements.garden.firstElementChild.remove();
}

function showError() {
  elements.message.textContent = copy[language].error;
  elements.message.className = "message error";
  elements.input.classList.remove("error");
  requestAnimationFrame(() => elements.input.classList.add("error"));
  elements.input.focus();
}

function checkAnswer() {
  if (locked || !currentWord) return;
  if (normalize(elements.input.value) !== normalize(currentWord.word)) {
    showError();
    return;
  }

  locked = true;
  elements.input.disabled = true;
  elements.check.disabled = true;
  score += 1;
  elements.score.textContent = String(score);
  elements.message.textContent = copy[language].success(currentWord.translation);
  elements.message.className = "message success";
  addGardenObject(currentWord);
  nextWordTimer = window.setTimeout(chooseWord, 900);
}

function updateInterface() {
  const text = copy[language];
  document.documentElement.lang = language;
  document.title = text.title;
  elements.title.textContent = text.title;
  elements.eyebrow.textContent = text.eyebrow;
  elements.subtitle.textContent = text.subtitle;
  elements.instruction.textContent = text.instruction;
  elements.inputLabel.textContent = text.inputLabel;
  elements.check.textContent = text.check;
  elements.reset.querySelector("span").textContent = text.reset;
  elements.scoreLabel.textContent = text.score;
  elements.empty.textContent = text.empty;
  elements.gardenScene.setAttribute("aria-label", text.title);
  elements.message.textContent = "";
  elements.message.className = "message";
  elements.languages.forEach(button => {
    const active = button.dataset.language === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function changeLanguage(newLanguage) {
  if (!words[newLanguage] || newLanguage === language) return;
  window.clearTimeout(nextWordTimer);
  language = newLanguage;
  previousWord = "";
  updateInterface();
  chooseWord();
}

function resetGarden() {
  window.clearTimeout(nextWordTimer);
  score = 0;
  elements.score.textContent = "0";
  elements.garden.replaceChildren();
  elements.empty.classList.remove("hidden");
  elements.message.textContent = "";
  elements.message.className = "message";
  chooseWord();
}

elements.check.addEventListener("click", checkAnswer);
elements.input.addEventListener("keydown", event => {
  if (event.key === "Enter") checkAnswer();
});
elements.input.addEventListener("input", () => {
  elements.input.classList.remove("error");
  if (elements.message.classList.contains("error")) {
    elements.message.textContent = "";
    elements.message.className = "message";
  }
});
elements.languages.forEach(button => button.addEventListener("click", () => changeLanguage(button.dataset.language)));
elements.reset.addEventListener("click", resetGarden);

updateInterface();
chooseWord();

