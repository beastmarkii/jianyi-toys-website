// 홈 전용 로고 인트로 / JY logo intro (home only)
// JY 로고가 손잡고 화면 중앙으로 뛰어들어와 → 인사(꾸벅) → 제자리(히어로 위치)로 복귀
(function () {
  if (document.body.getAttribute("data-page") !== "home") return;

  const heroLogo = document.querySelector(".hero-logo img");
  if (!heroLogo || typeof heroLogo.animate !== "function") return;
  // 홈에 들어올 때마다 항상 재생 / always play on home load

  let attempts = 0;
  function play() {
    if (window.__jyIntro) return; // 중복 실행 방지
    // 도착지: 좌측 상단 헤더의 브랜드 로고 / target: brand logo in header (top-left)
    const brandLogo = document.querySelector(".brand-logo");
    const rect = brandLogo ? brandLogo.getBoundingClientRect() : null;
    if (!rect || !rect.width) {
      // 레이아웃 준비 안됨 → 잠시 후 재시도 (최대 10회)
      if (attempts++ < 10) setTimeout(play, 150);
      return;
    }
    window.__jyIntro = "playing";
    const vw = window.innerWidth, vh = window.innerHeight;

    // 오버레이 + 로고 클론
    const overlay = document.createElement("div");
    overlay.className = "intro-overlay";
    const clone = document.createElement("img");
    clone.src = heroLogo.currentSrc || heroLogo.src;
    clone.className = "intro-logo";
    clone.alt = "";
    overlay.appendChild(clone);
    document.body.appendChild(overlay);

    // 헤더 로고는 착지 전까지, 히어로 로고는 인트로 동안 숨김 (중복 노출 방지)
    brandLogo.style.visibility = "hidden";
    heroLogo.style.visibility = "hidden";

    // 중앙(오버레이 grid center) → 헤더 로고 위치까지의 이동량 계산
    const cloneW = clone.getBoundingClientRect().width || Math.min(vw * 0.46, 420);
    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;
    const dx = Math.round(targetCenterX - vw / 2);
    const dy = Math.round(targetCenterY - vh / 2);
    const scaleTo = Math.max(0.04, rect.width / cloneW);

    const frames = [
      // 왼쪽 밖에서 손잡고 달려 들어옴 (좌우 흔들며) / run in from off-screen left
      { transform: "translate(-135vw,0) rotate(-10deg) scale(.78)", offset: 0 },
      { transform: "translate(-60vw,-4px) rotate(8deg) scale(.9)",  offset: 0.12 },
      { transform: "translate(-26vw,0) rotate(-7deg) scale(1)",     offset: 0.22 },
      { transform: "translate(6vw,-6px) rotate(6deg) scale(1.07)",  offset: 0.30 },
      { transform: "translate(0,0) rotate(0) scale(1.05)",          offset: 0.38 }, // 중앙 도착
      // 인사(꾸벅) 2회 / greeting bows
      { transform: "translate(0,20px) scale(1.05,.92)",  offset: 0.47 },
      { transform: "translate(0,-4px) scale(1.05,1)",    offset: 0.54 },
      { transform: "translate(0,16px) scale(1.05,.94)",  offset: 0.61 },
      { transform: "translate(0,0) scale(1.05,1)",       offset: 0.67 },
      // 손 흔들듯 좌우 / little wave
      { transform: "translate(0,0) rotate(-8deg) scale(1.05)", offset: 0.72 },
      { transform: "translate(0,0) rotate(8deg) scale(1.05)",  offset: 0.77 },
      { transform: "translate(0,0) rotate(0) scale(1.05)",     offset: 0.82 },
      // 좌측 상단 로고 자리로 날아가 착지 / fly up to header logo slot
      { transform: `translate(${dx}px,${dy}px) scale(${scaleTo})`, opacity: 1, offset: 0.96 },
      // 자리에 딱 맞춰 스며들며 사라짐 / melt into place
      { transform: `translate(${dx}px,${dy}px) scale(${scaleTo})`, opacity: 0, offset: 1 },
    ];

    const DURATION = 6500;
    const anim = clone.animate(frames, {
      duration: DURATION,
      easing: "cubic-bezier(.34,1.2,.4,1)",
      fill: "forwards",
    });

    let done = false;
    const cleanup = (fade) => {
      if (done) return;
      done = true;
      window.__jyIntro = "finished";
      brandLogo.style.visibility = "visible"; // 헤더 로고 자리에 등장
      heroLogo.style.visibility = "visible";  // 히어로 로고 복원
      if (fade) {
        overlay.classList.add("fade");
        setTimeout(() => overlay.remove(), 520);
      } else {
        overlay.remove();
      }
    };

    // 착지 순간 실제 헤더 로고를 미리 표시해 자연스럽게 겹침 / reveal real logo at touchdown
    setTimeout(() => { brandLogo.style.visibility = "visible"; }, Math.round(DURATION * 0.96));
    anim.finished.then(() => cleanup(true)).catch(() => cleanup(false));
    // 안전장치: finished 가 어떤 이유로든 안 풀려도 로고가 숨겨진 채 남지 않도록
    setTimeout(() => cleanup(true), DURATION + 900);
  }

  // 로고 이미지 로드 후 재생 (rAF 미의존) / play after logo ready, no rAF dependency
  if (heroLogo.complete && heroLogo.naturalWidth > 0) {
    setTimeout(play, 30);
  } else {
    heroLogo.addEventListener("load", () => setTimeout(play, 30), { once: true });
    setTimeout(play, 1200); // 안전장치 (play 내부에서 중복 방지)
  }
})();
