/* ============================================================
   Baarish-e-Ishq — flow logic
   ============================================================ */
(() => {
  "use strict";

  const STEPS = ["start","name","letter","reasons","timeline","questions","proposal","celebrate"];
  const NICKNAMES = ["Habibti","Duniya","Dil ka Tukda","Sukoon","Sabkuch","Mera Paglu","Goglu","Bachaa","Ghulab Jamun"];

  const REASONS = [
    { tag: "Habibti",       text: "Kyunki tumhare aage har lafz kam pad jaata hai." },
    { tag: "Duniya",        text: "Tum ho toh sab kuch hai, tum nahi toh kuch bhi nahi." },
    { tag: "Dil ka Tukda",  text: "Tumhare bina yeh dil adhoora sa lagta hai." },
    { tag: "Sukoon",        text: "Bhaagti duniya mein, tumhare paas hi thehrav milta hai." },
    { tag: "Sabkuch",       text: "Chhoti si baat ho ya bada faisla — tum hi sabse pehle yaad aati ho." },
    { tag: "Mera Paglu",    text: "Tumhari pagalpan bhari baatein, mera sabse pyaara pal hain." },
    { tag: "Goglu",         text: "Tumhari wo masoom si haasi, meri sabse badi kamzori hai." },
    { tag: "Ghulab Jamun",  text: "Tum meri zindagi ki sabse meethi cheez ho." },
  ];

  const LETTER_TEMPLATE = (name) =>
`Meri jaan,

Mujhe aaj bhi theek se yaad hai — jis din tumne mujhe qubool kiya tha,
us din se main sirf aur sirf tumhara ho gaya tha. Shayad tumhe us waqt
andaza bhi nahi tha ke tumne kisi ki poori duniya badal di hai.

Phir 18 June ko humari baat cheet shuru hui. Shuru mein sab kuch itna
simple sa tha — bas do log baat kar rahe the. Lekin aahista aahista,
har din, har message ke sath, hum ek dusre ke kareeb aate gaye. Pata hi
nahi chala kab tum meri aadat ban gayi, aur main tumhari.

Rasta seedha nahi tha, ${name}. Humare beech kai baar galatfehmiyan hui,
jhagde hue, kabhi kabhi lagta tha shayad baat na bane. Lekin ek cheez
hamesha jeeti rahi — hamari mohabbat. Usne kabhi humein juda nahi hone diya,
chahe halaat kitne bhi mushkil kyun na ho.

Phir shaadi ka waqt aaya, aur uss mein bhi bohot mushkilein aayi. Lekin
Alhamdulillah, sab kuch theek ho gaya — aur sabse khaas baat, jaisa hum
dono chahte the, waisa hi hua. Hamari marzi ke mutabiq.

Aur us din se leke aaj tak, tum mere sath ho. Har subah, har raat. Sach
kahoon toh mujhe tumhare bagair rehna bilkul pasand nahi. Jab bhi khayal
aata hai ke tumhe kabhi apne sasural jaana hoga, mera dil udaas ho jata
hai — main tumhein apne se door nahi dekhna chahta.

Bas ek hi khwahish hai, ${name}: tum hamesha, hamesha khush raho.
Yehi meri sabse badi dua hai.

Yeh kahani abhi khatam nahi hui... aage aur bhi bahut kuch kehna hai.`;

  const QUESTIONS = [
    "Kya tumhe yaad hai jab humari pehli baat cheet hui thi?",
    "Kya tumhe pata hai tumhari ek muskaan mera pura din bana deti hai?",
    "Kya tumhe ehsaas hai humne kitni mushkilein saath mein paar ki hain?",
    "Kya tumhe maloom hai tumhare bagair ek pal bhi mushkil lagta hai?",
    "Kya tum jaanti ho jab tum door hoti ho, mera dil kitna udaas hota hai?",
    "Kya tumhe pata hai tum meri sabse badi dua ho?",
    "Kya tum samajhti ho main tumse kitni mohabbat karta hoon?",
    "Ek aakhri sawaal baaki hai..."
  ];

  let currentIndex = 0;
  let selectedName = "Jaan";
  let songStarted = false;

  const $ = (sel) => document.querySelector(sel);
  const screens = {};
  STEPS.forEach(s => screens[s] = document.querySelector(`.screen[data-step="${s}"]`));

  const bgSong = $("#bgSong");

  /* ---------------- navigation ---------------- */
  function goTo(stepName){
    const nextIndex = STEPS.indexOf(stepName);
    if(nextIndex === -1) return;
    const current = screens[STEPS[currentIndex]];
    const next = screens[stepName];

    current.classList.add("leaving");
    setTimeout(() => {
      current.classList.remove("active","leaving");
      currentIndex = nextIndex;
      next.classList.add("active","entering");
      setTimeout(() => next.classList.remove("entering"), 650);
      onEnterStep(stepName);
      window.scrollTo({top:0, behavior:"instant" in window ? "instant" : "auto"});
    }, 420);
  }

  function onEnterStep(step){
    if(step === "letter") typeLetter();
    if(step === "questions") resetQuestions();
  }

  /* ---------------- music: robust start + persistent toggle ---------------- */
  const musicToggle = $("#musicToggle");
  bgSong.volume = 0.85;

  function tryPlaySong(){
    const p = bgSong.play();
    if(p && typeof p.then === "function"){
      p.then(() => {
        songStarted = true;
        musicToggle.classList.add("playing");
        musicToggle.textContent = "🎵";
      }).catch(() => {
        /* blocked — toggle button stays available for a manual tap */
        musicToggle.classList.add("needs-tap");
        musicToggle.textContent = "▶";
      });
    }
  }

  musicToggle.addEventListener("click", () => {
    if(bgSong.paused){
      tryPlaySong();
      musicToggle.classList.remove("needs-tap");
      musicToggle.textContent = "🎵";
      musicToggle.classList.add("playing");
    } else {
      bgSong.pause();
      musicToggle.classList.remove("playing");
      musicToggle.textContent = "▶";
    }
  });

  /* ---------------- step 0: start ---------------- */
  $("#btnOpen").addEventListener("click", () => {
    if(!songStarted){
      tryPlaySong();
    }
    goTo("name");
  });

  /* Fallback: if autoplay was blocked, the very next tap anywhere
     on the page also tries to start the song (covers strict mobile browsers). */
  document.addEventListener("click", function unlockOnce(){
    if(bgSong.paused && songStarted === false){
      tryPlaySong();
    }
  }, { once:false });

  /* ---------------- step 1: name gate ---------------- */
  const chipRow = $("#chipRow");
  NICKNAMES.forEach(nick => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = nick;
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      $("#nameInput").value = nick;
    });
    chipRow.appendChild(chip);
  });

  $("#btnNameNext").addEventListener("click", () => {
    const val = $("#nameInput").value.trim();
    selectedName = val.length ? val : "Jaan";
    document.querySelectorAll(".name-slot").forEach(el => el.textContent =
      el.id === "letterName" ? selectedName + "," : selectedName);
    document.getElementById("celebrateName").textContent = selectedName;
    goTo("letter");
  });

  /* ---------------- step 2: letter typewriter ---------------- */
  let typingTimer = null;
  function typeLetter(){
    const el = $("#letterText");
    const btn = $("#btnLetterNext");
    const caret = $("#letterCaret");
    btn.classList.remove("shown");
    el.textContent = "";
    caret.style.display = "inline-block";
    const full = LETTER_TEMPLATE(selectedName);
    let i = 0;
    clearInterval(typingTimer);
    typingTimer = setInterval(() => {
      el.textContent = full.slice(0, i);
      i++;
      if(i > full.length){
        clearInterval(typingTimer);
        caret.style.display = "none";
        btn.classList.add("shown");
      }
    }, 22);
  }
  $("#btnLetterNext").addEventListener("click", () => goTo("reasons"));

  /* ---------------- step 3: reasons ---------------- */
  const reasonGrid = $("#reasonGrid");
  REASONS.forEach(r => {
    const card = document.createElement("div");
    card.className = "reason-card";
    card.innerHTML = `<span class="tag">${r.tag}</span><p>${r.text}</p>`;
    reasonGrid.appendChild(card);
  });
  $("#btnReasonsNext").addEventListener("click", () => goTo("timeline"));
  $("#btnTimelineNext").addEventListener("click", () => goTo("questions"));

  /* ---------------- step: questions (many, one at a time) ---------------- */
  let qIndex = 0;
  const questionText = $("#questionText");
  const questionCard = $("#questionCard");
  const questionDots = $("#questionDots");
  const btnQuestionNext = $("#btnQuestionNext");

  function resetQuestions(){
    qIndex = 0;
    questionDots.innerHTML = "";
    QUESTIONS.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "q-dot" + (i === 0 ? " active" : "");
      questionDots.appendChild(dot);
    });
    showQuestion(0);
  }
  function showQuestion(i){
    questionCard.classList.remove("q-in");
    void questionCard.offsetWidth; /* restart animation */
    questionText.textContent = QUESTIONS[i];
    questionCard.classList.add("q-in");
    document.querySelectorAll(".q-dot").forEach((d, idx) => d.classList.toggle("active", idx === i));
    btnQuestionNext.textContent = (i === QUESTIONS.length - 1) ? "Aakhri sawaal →" : "Agla sawaal →";
  }
  btnQuestionNext.addEventListener("click", () => {
    if(qIndex < QUESTIONS.length - 1){
      qIndex++;
      showQuestion(qIndex);
    } else {
      goTo("proposal");
    }
  });

  /* ---------------- step 6: proposal (No dodges) ---------------- */
  const btnNo = $("#btnNo");
  const btnYes = $("#btnYes");
  const proposalBox = document.querySelector(".proposal-buttons");
  let dodgeCount = 0;
  function dodge(){
    const boxRect = proposalBox.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();
    const maxX = Math.max(20, boxRect.width - btnRect.width - 20);
    const maxY = Math.max(20, boxRect.height - btnRect.height - 20);
    const x = Math.random() * maxX - maxX/2;
    const y = Math.random() * maxY - maxY/2;
    btnNo.style.transform = `translate(${x}px, ${y}px)`;
    dodgeCount++;
    if(dodgeCount === 1) btnNo.textContent = "Pakka nahi?";
    if(dodgeCount === 3) btnNo.textContent = "Sochlo dubara...";
    if(dodgeCount === 5) btnNo.textContent = "Haan hi bologi 😌";
  }
  btnNo.addEventListener("mouseenter", dodge);
  btnNo.addEventListener("click", (e) => { e.preventDefault(); dodge(); });
  btnNo.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, {passive:false});

  btnYes.addEventListener("click", () => {
    goTo("celebrate");
    setTimeout(fireConfetti, 500);
  });

  /* ---------------- step 7: replay ---------------- */
  $("#btnReplay").addEventListener("click", () => {
    currentIndex = STEPS.indexOf("celebrate");
    screens["celebrate"].classList.remove("active");
    currentIndex = 0;
    screens["start"].classList.add("active");
    btnNo.style.transform = "";
    dodgeCount = 0;
    btnNo.textContent = "Nahi";
  });

  /* ============================================================
     Ambient background: gentle floating hearts & gold sparkles
     (soft upward drift — not rain, just a quiet romantic glow)
     ============================================================ */
  const rainCanvas = $("#rain");
  const rctx = rainCanvas.getContext("2d");
  let drops = [];
  function sizeCanvas(){
    rainCanvas.width = window.innerWidth * devicePixelRatio;
    rainCanvas.height = window.innerHeight * devicePixelRatio;
    rainCanvas.style.width = window.innerWidth + "px";
    rainCanvas.style.height = window.innerHeight + "px";
    rctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }
  function initDrops(){
    const count = Math.min(34, Math.floor(window.innerWidth / 26));
    drops = Array.from({length: count}, () => spawnDrop(true));
  }
  function spawnDrop(randomY){
    return {
      x: Math.random() * window.innerWidth,
      y: randomY ? Math.random() * window.innerHeight : window.innerHeight + 20,
      size: 4 + Math.random() * 6,
      speed: 0.35 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.01 + Math.random() * 0.015,
      opacity: 0.12 + Math.random() * 0.28,
      heart: Math.random() < 0.35
    };
  }
  function drawDrops(){
    rctx.clearRect(0,0,window.innerWidth, window.innerHeight);
    for(const d of drops){
      rctx.save();
      rctx.globalAlpha = d.opacity;
      const wobbleX = Math.sin(d.wobble) * 8;
      if(d.heart){
        drawHeart(d.x + wobbleX, d.y, d.size, "#d9668a");
      } else {
        rctx.fillStyle = "#d8ae55";
        rctx.beginPath();
        rctx.arc(d.x + wobbleX, d.y, d.size/3.2, 0, Math.PI*2);
        rctx.fill();
      }
      rctx.restore();
      d.y -= d.speed;
      d.wobble += d.wobbleSpeed;
      if(d.y < -20){
        Object.assign(d, spawnDrop(false));
      }
    }
    requestAnimationFrame(drawDrops);
  }
  function drawHeart(x,y,size,color){
    rctx.fillStyle = color;
    rctx.beginPath();
    rctx.moveTo(x, y + size/4);
    rctx.bezierCurveTo(x, y, x - size/2, y, x - size/2, y + size/4);
    rctx.bezierCurveTo(x - size/2, y + size/1.8, x, y + size*1.1, x, y + size*1.3);
    rctx.bezierCurveTo(x, y + size*1.1, x + size/2, y + size/1.8, x + size/2, y + size/4);
    rctx.bezierCurveTo(x + size/2, y, x, y, x, y + size/4);
    rctx.fill();
  }
  window.addEventListener("resize", sizeCanvas);
  sizeCanvas();
  initDrops();
  requestAnimationFrame(drawDrops);

  /* ============================================================
     Confetti hearts burst on "Yes"
     ============================================================ */
  const confettiCanvas = $("#confetti");
  const cctx = confettiCanvas.getContext("2d");
  let confettiPieces = [];
  function sizeConfetti(){
    const rect = screens.celebrate.getBoundingClientRect();
    confettiCanvas.width = window.innerWidth * devicePixelRatio;
    confettiCanvas.height = window.innerHeight * devicePixelRatio;
    confettiCanvas.style.width = window.innerWidth + "px";
    confettiCanvas.style.height = window.innerHeight + "px";
    cctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }
  function fireConfetti(){
    sizeConfetti();
    const colors = ["#d9668a","#d8ae55","#f0aac0","#f0d99a","#ffffff"];
    confettiPieces = Array.from({length: 90}, () => ({
      x: window.innerWidth/2 + (Math.random()-0.5) * 120,
      y: window.innerHeight * 0.25,
      vx: (Math.random()-0.5) * 9,
      vy: -Math.random() * 9 - 4,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360,
      vr: (Math.random()-0.5) * 10,
      shape: Math.random() < 0.4 ? "heart" : "square"
    }));
    animateConfetti();
  }
  function animateConfetti(){
    cctx.clearRect(0,0,window.innerWidth, window.innerHeight);
    let alive = false;
    for(const p of confettiPieces){
      p.vy += 0.22;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if(p.y < window.innerHeight + 40) alive = true;
      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rot * Math.PI/180);
      cctx.fillStyle = p.color;
      if(p.shape === "heart"){
        cctx.scale(0.5,0.5);
        drawHeartAt(cctx, 0,0, p.size*1.6, p.color);
      } else {
        cctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
      }
      cctx.restore();
    }
    if(alive) requestAnimationFrame(animateConfetti);
    else cctx.clearRect(0,0,window.innerWidth, window.innerHeight);
  }
  function drawHeartAt(ctx,x,y,size,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y + size/4);
    ctx.bezierCurveTo(x, y, x - size/2, y, x - size/2, y + size/4);
    ctx.bezierCurveTo(x - size/2, y + size/1.8, x, y + size*1.1, x, y + size*1.3);
    ctx.bezierCurveTo(x, y + size*1.1, x + size/2, y + size/1.8, x + size/2, y + size/4);
    ctx.bezierCurveTo(x + size/2, y, x, y, x, y + size/4);
    ctx.fill();
  }
  window.addEventListener("resize", () => { if(screens.celebrate.classList.contains("active")) sizeConfetti(); });

})();
