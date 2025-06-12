// app.js

// ====== التحقق من رمز التفعيل عبر Netlify Function ======
document.getElementById("secret-submit").addEventListener("click", () => {
  const code = document.getElementById("secret-code").value.trim();
  fetch("/.netlify/functions/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.valid) {
        document.getElementById("secret-overlay").style.display = "none";
      } else {
        document.getElementById("error-message").style.display = "block";
      }
    })
    .catch((err) => {
      console.error("Error during verification:", err);
      alert("حدث خطأ أثناء التحقق من الرمز.");
    });
});

// ====== المتغيرات والاختيارات الأساسية ======
const startBtn = document.getElementById("startBtn");
const wrapper = document.getElementById("wrapper");
const finalText = document.getElementById("finalText");
const finalName = document.getElementById("finalName");
const playerNameInput = document.getElementById("playerName");
const fallingContainer = document.getElementById("fallingContainer");
const gameContainer = document.getElementById("gameContainer");
const gamePlayerName = document.getElementById("gamePlayerName");
const gameTitle = document.getElementById("gameTitle");
const mainGrid = document.getElementById("mainGrid");

// ====== بدء اللعبة والانتقالات ======
startBtn.addEventListener("click", () => {
  const playerName = playerNameInput.value.trim() || "بدون اسم";
  finalName.textContent = playerName;
  gamePlayerName.textContent = playerName;

  // إخفاء الشاشة الأولى
  wrapper.style.transform = "scale(0)";
  setTimeout(() => (wrapper.style.display = "none"), 500);

  // عرض نص الترانزيشن
  finalText.style.display = "flex";
  finalText.classList.add("animated");

  generateFallingLetters();
});

// ====== إنشاء حروف متساقطة ======
function generateFallingLetters() {
  fallingContainer.innerHTML = "";
  const arabicLetters = "بتثجحخدذرازسشصضطظعغفقكلمنهوي";
  const count = 40;
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.classList.add("falling-letter");
    span.textContent = arabicLetters.charAt(
      Math.floor(Math.random() * arabicLetters.length)
    );
    span.style.left = `${Math.random() * 100}%`;
    span.style.top = `${-50 - Math.random() * 250}px`;
    const duration = 1.5 + Math.random() * 1.5;
    span.style.animationDuration = `${duration}s`;
    span.style.animationDelay = `${Math.random() * 0.3}s`;
    fallingContainer.appendChild(span);
  }
}

// ====== بعد انتهاء الترانزيشن النهائي ======
finalText.addEventListener("animationend", () => {
  fallingContainer.style.opacity = "0";
  finalText.style.display = "none";
  gameContainer.style.display = "block";
  gameContainer.style.opacity = "0";
  setTimeout(() => (gameContainer.style.opacity = "1"), 50);
  initializeGame();
});

// ====== إعداد الشبكة السداسية ولون الخلايا ======
function initializeGame() {
  const letters = "بتثجحخدذرازسشصضطظعغفقكلمنهوي".split("");
  const overlay = document.querySelector(".overlay");
  const restartBtn = document.querySelector(".restart");
  const settingsBtn = document.querySelector(".settings-btn");
  const cellSettings = document.getElementById("cellSettings");
  const closeSettings = document.getElementById("closeSettings");
  const nameInputContainer = document.getElementById("nameInputContainer");
  const newNameInput = document.getElementById("newNameInput");
  const saveNameBtn = document.getElementById("saveNameBtn");
  const hideTitleBtn = document.getElementById("hideTitleBtn");
  const changeNameBtn = document.getElementById("changeNameBtn");
  const congratsBtn = document.querySelector(".congrats-btn");

  // أدوات اختيار الألوان
  const orangePicker = document.getElementById("orangeColorPicker");
  const greenPicker = document.getElementById("greenColorPicker");
  const cellPicker1 = document.getElementById("cellColorPicker1");
  const cellPicker2 = document.getElementById("cellColorPicker2");
  const resetColorsBtn = document.getElementById("resetColors");

  // إعادة إعداد الألوان الافتراضية
  function resetAllColors() {
    orangePicker.value = "#F7931E";
    greenPicker.value = "#39B54A";
    cellPicker1.value = "#22c55e";
    cellPicker2.value = "#f97316";
    document.querySelector(".container").style.backgroundColor =
      orangePicker.value;
    document
      .querySelectorAll(".top-bottom")
      .forEach((el) => (el.style.backgroundColor = greenPicker.value));
    refreshCellColors();
  }

  function refreshCellColors() {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.style.backgroundColor = getColorForState(cell.dataset.state);
    });
  }

  // إنشاء الشبكة: 5 خلايا × 5 صفوف
  function createHexGrid() {
    const rows = [5, 5, 5, 5, 5];
    let idx = 0;
    mainGrid.innerHTML = "";
    rows.forEach((count) => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "row";
      for (let i = 0; i < count; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.state = "0";
        rowDiv.appendChild(cell);
        idx++;
      }
      mainGrid.appendChild(rowDiv);
    });
  }

  // تجهيز الحروف العشوائية داخل الخلايا
  function initLetters() {
    const cells = document.querySelectorAll(".cell");
    const shuffled = [...letters].sort(() => Math.random() - 0.5).slice(0, 25);
    cells.forEach((cell, i) => {
      cell.textContent = shuffled[i];
      cell.dataset.state = "0";
      cell.style.backgroundColor = "rgb(218, 218, 218)";
    });
  }

  // الحالة الدورية 0→1→2→0
  function nextState(s) {
    if (s === "0") return "1";
    if (s === "1") return "2";
    return "0";
  }

  function getColorForState(s) {
    if (s === "0") return "rgb(218, 218, 218)";
    if (s === "1") return cellPicker1.value;
    return cellPicker2.value;
  }

  // التعامل مع نقر الخلايا
  mainGrid.addEventListener("click", (e) => {
    if (!e.target.classList.contains("cell")) return;
    const cell = e.target;
    const ns = nextState(cell.dataset.state);
    cell.dataset.state = ns;
    cell.style.backgroundColor = getColorForState(ns);
  });

  // الضغط يمين للون خاص
  mainGrid.addEventListener("contextmenu", (e) => {
    if (!e.target.classList.contains("cell")) return;
    e.preventDefault();
    const c = e.target;
    c.style.backgroundColor =
      c.style.backgroundColor === "rgb(255, 215, 75)"
        ? "rgb(218, 218, 218)"
        : "#ffd74b";
  });

  // إعادة الضبط
  restartBtn.addEventListener("click", () => {
    document.querySelectorAll(".cell").forEach((c) => {
      c.dataset.state = "0";
      c.style.backgroundColor = "rgb(218, 218, 218)";
    });
    initLetters();
  });

  // مبروك
  congratsBtn.addEventListener("click", () => {
    overlay.classList.add("active");
    setTimeout(() => overlay.classList.remove("active"), 3000);
  });

  // إعدادات
  settingsBtn.addEventListener("click", () =>
    cellSettings.classList.toggle("active")
  );
  closeSettings.addEventListener("click", () =>
    cellSettings.classList.remove("active")
  );

  orangePicker.addEventListener("input", (e) => {
    document.querySelector(".container").style.backgroundColor = e.target.value;
  });
  greenPicker.addEventListener("input", (e) => {
    document
      .querySelectorAll(".top-bottom")
      .forEach((el) => (el.style.backgroundColor = e.target.value));
  });
  cellPicker1.addEventListener("input", refreshCellColors);
  cellPicker2.addEventListener("input", refreshCellColors);
  resetColorsBtn.addEventListener("click", resetAllColors);

  // إخفاء/إظهار الشعار
  hideTitleBtn.addEventListener("click", () => {
    gameTitle.classList.toggle("hidden");
    hideTitleBtn.textContent = gameTitle.classList.contains("hidden")
      ? "إظهار الشعار"
      : "إخفاء الشعار";
  });

  // تغيير الاسم
  changeNameBtn.addEventListener("click", () =>
    nameInputContainer.classList.add("active")
  );
  saveNameBtn.addEventListener("click", () => {
    gamePlayerName.textContent = newNameInput.value.trim() || "بدون اسم";
    nameInputContainer.classList.remove("active");
  });

  // أخيراً: إنشاء الشبكة وتعبئة الحروف
  createHexGrid();
  initLetters();
}
