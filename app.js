// app.js

// --- التحقق من رمز التفعيل عبر Netlify Function ---
document.getElementById("secret-submit").addEventListener("click", function() {
  const code = document.getElementById("secret-code").value.trim();
  fetch("/.netlify/functions/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code })
  })
    .then(res => res.json())
    .then(data => {
      if (data.valid) {
        document.getElementById("secret-overlay").style.display = "none";
        initIntro();  // بدء الباقي بعد نجاح التفعيل
      } else {
        document.getElementById("error-message").style.display = "block";
      }
    })
    .catch(err => {
      console.error("Error during verification:", err);
      alert("فشل الاتصال بخدمة التحقق.");
    });
});

// --- شاشة المقدمة والانتقال للعبة ---
function initIntro() {
  const startBtn       = document.getElementById('startBtn');
  const wrapper        = document.getElementById('wrapper');
  const finalText      = document.getElementById('finalText');
  const finalName      = document.getElementById('finalName');
  const playerNameInput= document.getElementById('playerName');
  const fallingContainer= document.getElementById('fallingContainer');
  const gameContainer  = document.getElementById('gameContainer');
  const gamePlayerName = document.getElementById('gamePlayerName');
  const gameTitle      = document.getElementById('gameTitle');

  startBtn.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim() || "بدون اسم";
    finalName.textContent      = playerName;
    gamePlayerName.textContent = playerName;

    // إخفاء الشاشة الأولى
    wrapper.style.transform = 'scale(0)';
    setTimeout(() => { wrapper.style.display = 'none'; }, 500);

    // عرض النص الانتقالي
    finalText.style.display = 'flex';
    finalText.classList.add('animated');

    generateFallingLetters();
  });

  // بعد انتهاء أنيميشن النص الانتقالي
  finalText.addEventListener('animationend', () => {
    fallingContainer.style.opacity = "0";
    finalText.style.display        = 'none';

    // عرض اللعبة
    gameContainer.style.display = 'block';
    setTimeout(() => { gameContainer.style.opacity = "1"; }, 50);

    initializeGame();
  });
}

// --- حروف متساقطة في الخلفية ---
function generateFallingLetters() {
  const container = document.getElementById('fallingContainer');
  container.innerHTML = '';
  const letters = "بتثجحخدذرازسشصضطظعغفقكلمنهوي";
  for (let i = 0; i < 40; i++) {
    const span = document.createElement('span');
    span.className = 'falling-letter';
    span.textContent = letters.charAt(Math.floor(Math.random() * letters.length));
    span.style.left           = Math.random() * 100 + "%";
    span.style.top            = (-50 - Math.random()*250) + "px";
    span.style.animationDuration = (1.5 + Math.random()*1.5) + "s";
    span.style.animationDelay    = (Math.random()*0.3) + "s";
    container.appendChild(span);
  }
}

// --- بقية منطق اللعبة ---
function initializeGame() {
  const arabicLetters = "بتثجحخدذرازسشصضطظعغفقكلمنهوي".split("");
  const main       = document.querySelector(".main");
  const overlay    = document.getElementById("congratsOverlay");
  const restartBtn = document.querySelector(".restart");
  const settingsBtn= document.querySelector(".settings-btn");
  const cellSettings = document.getElementById("cellSettings");
  const closeSettings= document.getElementById("closeSettings");
  const nameInputContainer = document.getElementById("nameInputContainer");
  const newNameInput  = document.getElementById("newNameInput");
  const saveNameBtn   = document.getElementById("saveNameBtn");
  const hideTitleBtn  = document.getElementById("hideTitleBtn");
  const changeNameBtn = document.getElementById("changeNameBtn");
  const congratsBtn   = document.querySelector(".congrats-btn");

  const orangePicker = document.getElementById("orangeColorPicker");
  const greenPicker  = document.getElementById("greenColorPicker");
  const cellPicker1  = document.getElementById("cellColorPicker1");
  const cellPicker2  = document.getElementById("cellColorPicker2");
  const resetColors  = document.getElementById("resetColors");

  // إنشاء الشبكة السداسية
  function createHexGrid() {
    main.innerHTML = '';
    let idx = 0;
    for (let r = 0; r < 5; r++) {
      const row = document.createElement('div');
      row.className = 'row';
      for (let c = 0; c < 5; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.state = '0';
        row.appendChild(cell);
        idx++;
      }
      main.appendChild(row);
    }
  }

  // توزيع الحروف عشوائيًا
  function initializeLetters() {
    const cells = document.querySelectorAll('.cell');
    const shuffled = [...arabicLetters].sort(() => 0.5 - Math.random()).slice(0, cells.length);
    cells.forEach((cell, i) => {
      cell.textContent     = shuffled[i];
      cell.dataset.state   = '0';
      cell.style.backgroundColor = 'rgb(218,218,218)';
    });
  }

  // حالة تالية للحلقة 0→1→2→0
  function nextState(s) {
    return s==='0'? '1' : s==='1'? '2' : '0';
  }
  function colorForState(s) {
    if (s==='0') return 'rgb(218,218,218)';
    if (s==='1') return cellPicker1.value;
    return cellPicker2.value;
  }

  // نقر الخلايا
  main.addEventListener('click', e => {
    if (!e.target.classList.contains('cell')) return;
    const cell = e.target;
    cell.dataset.state = nextState(cell.dataset.state);
    cell.style.backgroundColor = colorForState(cell.dataset.state);
  });
  // كليك يمين يبدّل إلى لون أصفر مؤقت
  main.addEventListener('contextmenu', e => {
    if (!e.target.classList.contains('cell')) return;
    e.preventDefault();
    e.target.style.backgroundColor =
      e.target.style.backgroundColor==='rgb(255,215,75)'? 'rgb(218,218,218)' : '#ffd74b';
  });

  // إعادة التعيين
  restartBtn.addEventListener('click', () => initializeLetters());

  // تبريكات
  congratsBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    setTimeout(()=> overlay.classList.remove('active'), 3000);
  });

  // إعدادات
  settingsBtn.addEventListener('click', () => cellSettings.classList.toggle('active'));
  closeSettings.addEventListener('click', () => cellSettings.classList.remove('active'));

  orangePicker.addEventListener('input', e => {
    document.querySelector('.container').style.backgroundColor = e.target.value;
  });
  greenPicker.addEventListener('input', e => {
    document.querySelectorAll('.top-bottom').forEach(el=> el.style.backgroundColor=e.target.value);
  });
  cellPicker1.addEventListener('input', ()=> document.querySelectorAll('.cell').forEach(c=> c.style.backgroundColor=colorForState(c.dataset.state)));
  cellPicker2.addEventListener('input', ()=> document.querySelectorAll('.cell').forEach(c=> c.style.backgroundColor=colorForState(c.dataset.state)));
  resetColors.addEventListener('click', () => {
    orangePicker.value = "#F7931E";
    greenPicker.value  = "#39B54A";
    cellPicker1.value  = "#22c55e";
    cellPicker2.value  = "#f97316";
    document.querySelector('.container').style.backgroundColor = orangePicker.value;
    document.querySelectorAll('.top-bottom').forEach(el=> el.style.backgroundColor=greenPicker.value);
    document.querySelectorAll('.cell').forEach(c=> c.style.backgroundColor='rgb(218,218,218)');
    initializeLetters();
  });

  // إخفاء/إظهار الشعار
  hideTitleBtn.addEventListener('click', () => {
    document.getElementById('gameTitle').classList.toggle('hidden');
    hideTitleBtn.textContent = document.getElementById('gameTitle').classList.contains('hidden')? 'إظهار الشعار' : 'إخفاء الشعار';
  });

  // تعديل الاسم أثناء اللعب
  changeNameBtn.addEventListener('click', () => {
    document.getElementById('nameInputContainer').classList.add('active');
    document.getElementById('newNameInput').value = document.getElementById('gamePlayerName').textContent;
  });
  saveNameBtn.addEventListener('click', () => {
    const nn = document.getElementById('newNameInput').value.trim() || 'بدون اسم';
    document.getElementById('gamePlayerName').textContent = nn;
    document.getElementById('nameInputContainer').classList.remove('active');
  });

  // إنشاء وتهيئة
  createHexGrid();
  initializeLetters();
}
