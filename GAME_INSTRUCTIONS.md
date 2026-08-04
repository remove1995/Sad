# «Волшебный сад» — подробная инструкция по созданию HTML-игры

## 1. Идея игры

«Волшебный сад» — спокойная обучающая браузерная игра для детей. Ребёнок видит слово и печатает его с клавиатуры. Каждое правильно введённое слово меняет сад:

- `дерево` / `tree` выращивает дерево;
- `цветок` / `flower` добавляет цветок;
- `пчела` / `bee` приводит пчелу;
- другие слова могут добавлять траву, бабочек, птиц, солнце и дождь.

Русский и английский должны быть отдельными режимами. В русском режиме показываются и проверяются только русские слова, в английском — только английские. Перевод можно показывать после успешного ответа как дополнительную подсказку, но ребёнку не нужно одновременно печатать оба варианта.

Игра запускается прямо в браузере и не требует сервера, регистрации или базы данных.

---

## 2. Основной игровой цикл

1. Ребёнок выбирает язык: **Русский** или **English**.
2. Игра показывает задание, например: «Напечатай: дерево».
3. Ребёнок вводит слово в поле.
4. Игра сравнивает ответ с ожидаемым словом.
5. Если ответ верный:
   - проигрывается приятный звук;
   - появляется короткое поздравление;
   - в саду возникает соответствующий объект;
   - счёт увеличивается;
   - показывается следующее слово.
6. Если есть ошибка:
   - введённая часть подсвечивается мягким красным цветом;
   - игра не отнимает очки;
   - ребёнок может исправить слово и попробовать снова.

Для детской игры лучше не использовать таймер, штрафы, проигрыш и резкие звуки. Главная награда — постепенно оживающий сад.

---

## 3. Технологии

Для первой версии достаточно трёх файлов:

```text
magic-garden/
├── index.html   # разметка экрана
├── style.css    # внешний вид, сад и анимации
└── game.js      # словари и игровая логика
```

Дополнительно можно создать папки:

```text
magic-garden/
├── assets/
│   ├── images/  # изображения растений и животных
│   └── sounds/  # звуки успеха, птиц и пчёл
```

На старте объекты удобно показывать эмодзи. Это позволит сделать рабочую игру без поиска картинок. Позже эмодзи можно заменить собственными PNG, SVG или WebP-иллюстрациями.

---

## 4. Разметка `index.html`

Создайте файл `index.html`:

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Детская игра для изучения слов о природе">
  <title>Волшебный сад</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="game">
    <header class="top-panel">
      <div>
        <h1 id="game-title">Волшебный сад</h1>
        <p id="subtitle">Печатай слова — и сад оживёт!</p>
      </div>

      <div class="language-switch" aria-label="Выбор языка">
        <button class="language-button active" data-language="ru" type="button">
          Русский
        </button>
        <button class="language-button" data-language="en" type="button">
          English
        </button>
      </div>
    </header>

    <section class="task-panel" aria-labelledby="task-heading">
      <p id="instruction">Напечатай слово:</p>
      <h2 id="task-heading" class="target-word">дерево</h2>

      <label class="visually-hidden" for="word-input">Введите показанное слово</label>
      <input
        id="word-input"
        class="word-input"
        type="text"
        autocomplete="off"
        autocapitalize="none"
        spellcheck="false"
        maxlength="30"
        autofocus
      >

      <button id="check-button" class="check-button" type="button">
        Готово
      </button>

      <p id="message" class="message" aria-live="polite"></p>
      <p class="score"><span id="score-label">Выращено:</span> <span id="score">0</span></p>
    </section>

    <section id="garden" class="garden" aria-label="Волшебный сад">
      <div class="sky-decoration" aria-hidden="true">☀️</div>
      <div id="garden-objects" class="garden-objects"></div>
      <div class="ground"></div>
    </section>

    <button id="reset-button" class="reset-button" type="button">
      Начать сад заново
    </button>
  </main>

  <script src="game.js"></script>
</body>
</html>
```

Важные детали:

- `aria-live="polite"` помогает программам экранного доступа озвучивать результат;
- у кнопок указан `type="button"`, чтобы они случайно не отправляли форму;
- отключены автозамена и проверка орфографии, чтобы браузер не мешал ребёнку;
- `maxlength` ограничивает слишком длинный ввод;
- основной интерфейс можно полностью использовать с клавиатуры.

---

## 5. Оформление `style.css`

Создайте файл `style.css`:

```css
:root {
  --sky: #c9efff;
  --grass: #79c95b;
  --grass-dark: #55a93b;
  --paper: rgba(255, 255, 255, 0.94);
  --text: #25452d;
  --accent: #6f51c7;
  --accent-hover: #5b3fb2;
  --success: #218838;
  --error: #c73b3b;
}

* {
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  color: var(--text);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  background: linear-gradient(#f8fdff, #eaf9e5);
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.game {
  width: min(100% - 24px, 1000px);
  margin: 0 auto;
  padding: 24px 0 40px;
}

.top-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.top-panel p {
  margin: 6px 0 0;
}

.language-switch {
  display: flex;
  padding: 5px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 5px 18px rgba(33, 76, 46, 0.12);
}

.language-button {
  min-height: 44px;
  padding: 9px 16px;
  border: 0;
  border-radius: 999px;
  color: var(--text);
  background: transparent;
}

.language-button.active {
  color: #fff;
  background: var(--accent);
}

.task-panel {
  position: relative;
  z-index: 2;
  max-width: 580px;
  margin: 0 auto -35px;
  padding: 24px;
  text-align: center;
  border-radius: 24px;
  background: var(--paper);
  box-shadow: 0 12px 35px rgba(38, 78, 48, 0.18);
}

.task-panel p {
  margin-top: 0;
}

.target-word {
  margin: 8px 0 18px;
  font-size: clamp(2rem, 8vw, 4rem);
  letter-spacing: 0.03em;
}

.word-input {
  width: min(100%, 340px);
  min-height: 56px;
  padding: 10px 16px;
  border: 3px solid #b9d8bd;
  border-radius: 14px;
  outline: none;
  text-align: center;
  font-size: 1.5rem;
}

.word-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(111, 81, 199, 0.16);
}

.word-input.error {
  border-color: var(--error);
  animation: shake 0.25s linear;
}

.check-button,
.reset-button {
  min-height: 48px;
  padding: 11px 20px;
  border: 0;
  border-radius: 14px;
  color: #fff;
  background: var(--accent);
  box-shadow: 0 5px 0 #49328f;
}

.check-button {
  margin-left: 8px;
}

.check-button:hover,
.reset-button:hover {
  background: var(--accent-hover);
}

.check-button:active,
.reset-button:active {
  transform: translateY(3px);
  box-shadow: 0 2px 0 #49328f;
}

.message {
  min-height: 28px;
  margin: 15px 0 0;
  font-weight: 700;
}

.message.success {
  color: var(--success);
}

.message.error {
  color: var(--error);
}

.score {
  margin: 8px 0 0;
}

.garden {
  position: relative;
  min-height: 460px;
  overflow: hidden;
  border: 6px solid #fff;
  border-radius: 32px;
  background: linear-gradient(var(--sky) 0 63%, var(--grass) 63% 100%);
  box-shadow: 0 14px 35px rgba(38, 78, 48, 0.16);
}

.sky-decoration {
  position: absolute;
  top: 34px;
  right: 40px;
  font-size: 4rem;
}

.ground {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 17%;
  opacity: 0.45;
  background: var(--grass-dark);
}

.garden-objects {
  position: absolute;
  inset: 0;
}

.garden-object {
  position: absolute;
  z-index: 1;
  line-height: 1;
  filter: drop-shadow(0 7px 3px rgba(30, 70, 35, 0.2));
  animation: grow 0.55s cubic-bezier(0.2, 1.4, 0.5, 1) both;
}

.garden-object.plant {
  bottom: 11%;
  font-size: clamp(3rem, 9vw, 6rem);
  transform-origin: center bottom;
}

.garden-object.visitor {
  top: var(--top);
  font-size: clamp(2rem, 6vw, 4rem);
  animation: arrive 0.8s ease-out both, float 2.4s ease-in-out 0.8s infinite;
}

.reset-button {
  display: block;
  margin: 20px auto 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes grow {
  from { opacity: 0; transform: translateY(30px) scale(0.1); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes arrive {
  from { opacity: 0; transform: translateX(70px) scale(0.5); }
  to { opacity: 1; transform: translateX(0) scale(1); }
}

@keyframes float {
  50% { transform: translateY(-12px) rotate(4deg); }
}

@keyframes shake {
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@media (max-width: 650px) {
  .top-panel {
    flex-direction: column;
    text-align: center;
  }

  .task-panel {
    padding: 20px 14px;
  }

  .word-input {
    display: block;
    margin: 0 auto 12px;
  }

  .check-button {
    margin-left: 0;
  }

  .garden {
    min-height: 400px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

---

## 6. Игровая логика `game.js`

Создайте файл `game.js`:

```javascript
const words = {
  ru: [
    { word: "дерево", translation: "tree", icon: "🌳", type: "plant" },
    { word: "цветок", translation: "flower", icon: "🌷", type: "plant" },
    { word: "пчела", translation: "bee", icon: "🐝", type: "visitor" },
    { word: "трава", translation: "grass", icon: "🌱", type: "plant" },
    { word: "бабочка", translation: "butterfly", icon: "🦋", type: "visitor" },
    { word: "птица", translation: "bird", icon: "🐦", type: "visitor" },
    { word: "гриб", translation: "mushroom", icon: "🍄", type: "plant" }
  ],
  en: [
    { word: "tree", translation: "дерево", icon: "🌳", type: "plant" },
    { word: "flower", translation: "цветок", icon: "🌷", type: "plant" },
    { word: "bee", translation: "пчела", icon: "🐝", type: "visitor" },
    { word: "grass", translation: "трава", icon: "🌱", type: "plant" },
    { word: "butterfly", translation: "бабочка", icon: "🦋", type: "visitor" },
    { word: "bird", translation: "птица", icon: "🐦", type: "visitor" },
    { word: "mushroom", translation: "гриб", icon: "🍄", type: "plant" }
  ]
};

const interfaceText = {
  ru: {
    title: "Волшебный сад",
    subtitle: "Печатай слова — и сад оживёт!",
    instruction: "Напечатай слово:",
    check: "Готово",
    reset: "Начать сад заново",
    score: "Выращено:",
    success: (translation) => `Правильно! По-английски: ${translation}`,
    error: "Почти! Проверь буквы и попробуй ещё раз."
  },
  en: {
    title: "Magic Garden",
    subtitle: "Type words and watch the garden grow!",
    instruction: "Type this word:",
    check: "Done",
    reset: "Start a new garden",
    score: "Garden friends:",
    success: (translation) => `Great! In Russian: ${translation}`,
    error: "Almost! Check the letters and try again."
  }
};

const elements = {
  html: document.documentElement,
  title: document.querySelector("#game-title"),
  subtitle: document.querySelector("#subtitle"),
  instruction: document.querySelector("#instruction"),
  targetWord: document.querySelector("#task-heading"),
  input: document.querySelector("#word-input"),
  checkButton: document.querySelector("#check-button"),
  message: document.querySelector("#message"),
  score: document.querySelector("#score"),
  scoreLabel: document.querySelector("#score-label"),
  garden: document.querySelector("#garden-objects"),
  resetButton: document.querySelector("#reset-button"),
  languageButtons: document.querySelectorAll(".language-button")
};

let language = "ru";
let currentWord = null;
let previousWord = null;
let score = 0;
let isChecking = false;

function chooseWord() {
  const list = words[language];
  let nextWord;

  do {
    nextWord = list[Math.floor(Math.random() * list.length)];
  } while (list.length > 1 && nextWord.word === previousWord);

  currentWord = nextWord;
  previousWord = nextWord.word;
  elements.targetWord.textContent = currentWord.word;
  elements.input.value = "";
  elements.input.classList.remove("error");
  elements.input.focus();
}

function normalize(text) {
  return text.trim().toLocaleLowerCase(language === "ru" ? "ru-RU" : "en-US");
}

function checkAnswer() {
  if (isChecking) return;

  const answer = normalize(elements.input.value);
  const expected = normalize(currentWord.word);

  if (answer === expected) {
    isChecking = true;
    score += 1;
    elements.score.textContent = score;
    elements.message.textContent = interfaceText[language].success(currentWord.translation);
    elements.message.className = "message success";
    elements.input.classList.remove("error");
    addObjectToGarden(currentWord);

    window.setTimeout(() => {
      chooseWord();
      isChecking = false;
    }, 900);
  } else {
    elements.message.textContent = interfaceText[language].error;
    elements.message.className = "message error";
    elements.input.classList.remove("error");

    // Повторное добавление класса перезапускает анимацию ошибки.
    requestAnimationFrame(() => elements.input.classList.add("error"));
    elements.input.focus();
  }
}

function addObjectToGarden(item) {
  const object = document.createElement("span");
  object.className = `garden-object ${item.type}`;
  object.textContent = item.icon;
  object.setAttribute("role", "img");
  object.setAttribute("aria-label", item.word);

  // Объект получает случайное положение, но остаётся внутри сцены.
  object.style.left = `${5 + Math.random() * 82}%`;

  if (item.type === "visitor") {
    object.style.setProperty("--top", `${24 + Math.random() * 35}%`);
  }

  elements.garden.append(object);
}

function updateInterface() {
  const text = interfaceText[language];

  elements.html.lang = language;
  elements.title.textContent = text.title;
  elements.subtitle.textContent = text.subtitle;
  elements.instruction.textContent = text.instruction;
  elements.checkButton.textContent = text.check;
  elements.resetButton.textContent = text.reset;
  elements.scoreLabel.textContent = text.score;
  elements.message.textContent = "";

  elements.languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function changeLanguage(newLanguage) {
  language = newLanguage;
  isChecking = false;
  previousWord = null;
  updateInterface();
  chooseWord();
}

function resetGarden() {
  score = 0;
  isChecking = false;
  elements.score.textContent = "0";
  elements.garden.replaceChildren();
  elements.message.textContent = "";
  chooseWord();
}

elements.checkButton.addEventListener("click", checkAnswer);

elements.input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

elements.input.addEventListener("input", () => {
  elements.input.classList.remove("error");
});

elements.languageButtons.forEach((button) => {
  button.addEventListener("click", () => changeLanguage(button.dataset.language));
});

elements.resetButton.addEventListener("click", resetGarden);

updateInterface();
chooseWord();
```

---

## 7. Как работает код

### Словарь

Объект `words` содержит два независимых массива: `ru` и `en`. Каждая запись описывает:

- `word` — слово, которое должен напечатать ребёнок;
- `translation` — перевод, показываемый после успеха;
- `icon` — объект, который появится в саду;
- `type` — тип размещения: `plant` находится у земли, `visitor` летает выше.

Новое слово добавляется одной строкой в каждый языковой массив:

```javascript
{ word: "улитка", translation: "snail", icon: "🐌", type: "plant" }
```

```javascript
{ word: "snail", translation: "улитка", icon: "🐌", type: "plant" }
```

### Проверка ответа

Функция `normalize()`:

- удаляет пробелы в начале и конце;
- переводит буквы в нижний регистр;
- учитывает выбранный язык.

Поэтому ответы `Дерево`, `дерево` и `  дерево ` будут считаться одинаковыми. При этом слово с опечаткой не принимается.

### Выбор следующего слова

`chooseWord()` выбирает случайный элемент активного словаря и старается не показывать одно и то же слово два раза подряд.

### Создание сада

`addObjectToGarden()` создаёт новый `<span>`, присваивает ему эмодзи и случайную позицию. Растения появляются возле земли, а пчёлы, птицы и бабочки — в воздухе.

---

## 8. Запуск игры

Самый простой способ:

1. Поместите `index.html`, `style.css` и `game.js` в одну папку.
2. Дважды щёлкните по `index.html`.
3. Файл откроется в браузере.

Для разработки удобнее запустить локальный сервер. Если установлен Python:

```bash
python -m http.server 8000
```

Затем откройте в браузере:

```text
http://localhost:8000
```

Локальный сервер особенно пригодится позже, когда появятся звуки, изображения, сохранение и дополнительные файлы.

---

## 9. Правила хорошего детского интерфейса

- Размер основного текста — не менее 18 пикселей.
- Высота кнопок и полей — не менее 44 пикселей.
- У элементов должны быть понятные подписи, а не только значки.
- Ошибка должна предлагать повторить попытку, а не ругать ребёнка.
- Нельзя полагаться только на цвет: результат сообщается и текстом.
- Анимации должны быть короткими и спокойными.
- Следует поддерживать `prefers-reduced-motion` для пользователей, отключивших анимацию.
- Не следует автоматически включать фоновую музыку: ребёнок или родитель должен запускать звук сам.
- Игра не должна собирать имя, возраст, адрес или другие персональные данные.

---

## 10. Улучшение механики

### Прогресс по раундам

Можно завершать раунд после десяти слов и показывать экран:

```text
Сад расцвёл!
Ты вырастил 10 волшебных друзей.
[Продолжить] [Начать новый сад]
```

### Последовательное изучение

Вместо случайного порядка можно хранить индекс текущего слова:

```javascript
let currentIndex = 0;

function chooseWordInOrder() {
  currentWord = words[language][currentIndex];
  currentIndex = (currentIndex + 1) % words[language].length;
  elements.targetWord.textContent = currentWord.word;
}
```

Для первого знакомства последовательный режим обычно понятнее. Случайный режим лучше подходит для повторения.

### Подсветка набираемых букв

Для раннего обучения можно показывать буквы слова отдельно и отмечать совпавшую часть зелёным. Это потребует отрисовывать слово по символам и сравнивать его с полем после каждого события `input`.

### Озвучивание

Простая версия может использовать браузерный синтез речи:

```javascript
function pronounce(word, language) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = language === "ru" ? "ru-RU" : "en-US";
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}
```

Добавьте кнопку «🔊 Послушать» и вызывайте `pronounce(currentWord.word, language)` только после нажатия. Качество голоса зависит от устройства, поэтому для стабильного результата лучше позднее добавить заранее записанные аудиофайлы.

### Сохранение сада

Прогресс можно хранить в `localStorage`:

```javascript
localStorage.setItem("magicGardenScore", String(score));
```

При загрузке:

```javascript
score = Number(localStorage.getItem("magicGardenScore")) || 0;
```

Если сохранять не только счёт, но и весь сад, храните массив созданных объектов и восстанавливайте его при запуске. Кнопка сброса должна явно удалять эти данные.

---

## 11. Возможная структура расширенной версии

Когда прототип станет больше, разделите код:

```text
magic-garden/
├── index.html
├── css/
│   ├── base.css
│   ├── interface.css
│   └── garden.css
├── js/
│   ├── words.js
│   ├── ui.js
│   ├── garden.js
│   ├── storage.js
│   └── main.js
└── assets/
    ├── images/
    └── sounds/
```

Не стоит усложнять структуру до того, как базовая версия заработает.

---

## 12. План разработки

### Этап 1. Рабочий прототип

- создать три основных файла;
- добавить переключение языков;
- показать текущее слово;
- проверить ввод по кнопке и клавише Enter;
- добавить объект после правильного ответа;
- реализовать сброс сада.

### Этап 2. Улучшение для детей

- заменить часть эмодзи единым набором иллюстраций;
- добавить озвучивание слова;
- добавить мягкие звуки успеха;
- показывать совпадающие и ошибочные буквы;
- добавить короткое обучение при первом запуске.

### Этап 3. Прогресс

- разбить слова на уровни сложности;
- показывать статистику изученных слов;
- сохранять сад на устройстве;
- добавить награды без соревновательного давления.

### Этап 4. Проверка

- протестировать игру на компьютере, планшете и телефоне;
- проверить русскую и английскую раскладки;
- проверить управление только клавиатурой;
- проверить крупный масштаб страницы, например 200%;
- проверить режим уменьшенной анимации;
- дать прототип нескольким детям и посмотреть, где им нужны подсказки.

---

## 13. Чек-лист готовности

- [ ] Игра открывается без ошибок в консоли браузера.
- [ ] Русский режим содержит только русские задания.
- [ ] Английский режим содержит только английские задания.
- [ ] Регистр букв и внешние пробелы не мешают правильному ответу.
- [ ] Неправильный ответ не увеличивает счёт.
- [ ] Правильный ответ создаёт ровно один объект.
- [ ] Одно нажатие Enter не засчитывает слово дважды.
- [ ] После смены языка новое задание появляется сразу.
- [ ] Кнопка сброса очищает сад и обнуляет счёт.
- [ ] Интерфейс помещается на экране телефона шириной 320 пикселей.
- [ ] Все кнопки доступны с клавиатуры и имеют заметный фокус.
- [ ] Звук, если он добавлен, включается только по действию пользователя.

---

## 14. Защита от повторного нажатия

В прототип уже добавлена переменная `isChecking`. Сразу после правильного ответа она блокирует кнопку и клавишу Enter на 900 миллисекунд — до появления следующего задания:

```javascript
let isChecking = false;

function checkAnswer() {
  if (isChecking) return;

  const answer = normalize(elements.input.value);
  const expected = normalize(currentWord.word);

  if (answer === expected) {
    isChecking = true;

    // Здесь остаются увеличение счёта, сообщение и создание объекта.

    window.setTimeout(() => {
      chooseWord();
      isChecking = false;
    }, 900);
  } else {
    // Здесь остаётся обработка ошибки.
  }
}
```

Такая защита не позволяет получить несколько объектов за одно и то же слово быстрыми повторными нажатиями.

---

## 15. Итог

Минимальная версия «Волшебного сада» строится вокруг простой связи: **правильно напечатанное слово → приятная обратная связь → новый объект в саду**. Сначала важно добиться безошибочной работы этого цикла в двух раздельных языковых режимах. Иллюстрации, звук, уровни и сохранение можно добавлять постепенно, не меняя основную механику.

