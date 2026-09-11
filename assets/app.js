/* ============================================================
   리더스클럽 6기 · 9월 '이기심' — 참가자 발제문 폼
   - 한 화면 한 질문(스텝형), 뒤로/앞으로 상시 노출
   - 답 입력 후 '다음' → 자료(📎) 그 자리에 자동 노출 → 다시 '다음' → 다음 질문
   - 제출마다 새 행 insert. 마지막 제출이 최종. 초안은 로컬에 자동 저장.
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.RC_CONFIG || {};
  var ROUND = CFG.ROUND || "2026-09";
  var STORE_KEY = "rc-" + ROUND;

  // 질문 문구는 발제문 확정본 그대로.
  var QUESTIONS = [
    {
      key: "q1",
      text: "한 문장으로 적어본다면, 당신에게 사랑이란 무엇인가요?",
      hint: "한 문장. 당신만의 정의를 내려봐요.",
      fields: [{ name: "q1", placeholder: "사랑이란 …" }],
      material: { label: '프롬 — "사랑은 기술이다"', img: "assets/materials/q1.jpg" }
    },
    {
      key: "q2",
      text: "두 사람 사이, 당신이 그리는 이상적인 사랑의 관계는 어떤 모습인가요?",
      fields: [{ name: "q2", placeholder: "" }],
      material: { label: "존속의 형태 — 개체성을 보존한 합일", img: "assets/materials/q2.jpg" }
    },
    {
      key: "q3",
      text: "사랑 안에서 이기심(자기애)은 당신에게 무엇인가요?",
      fields: [{ name: "q3", placeholder: "" }],
      material: { label: "이기심 ≠ 자기애", img: "assets/materials/q3.jpg" }
    },
    {
      key: "q4",
      text: "두 사람은 언제 '우리'가 되고, 또 언제 '나'와 '당신'으로 남나요?",
      fields: [{ name: "q4", placeholder: "" }],
      material: { label: "자본주의 현대사회 속 부부 관계", img: "assets/materials/q4.jpg" }
    },
    {
      key: "q5",
      text: "이기심(자기애)은 연인 관계에서 —",
      fields: [
        { name: "q5_1", label: "① 그것은 어떻게 드러나나요? (관찰)", placeholder: "" },
        { name: "q5_2", label: "② 사랑을 저해하나요, 아니면 오히려 사랑을 근원에서 가능하게 하나요? (판단)", placeholder: "" }
      ],
      material: { label: "사랑에 필요한 것 · 자기애 · 자기탐구", img: "assets/materials/q5.jpg" }
    },
    {
      key: "q6",
      text: "사랑과 이기심을 지나온 지금, 당신 안에 새로 생긴 '나만의 질문' 하나는 무엇인가요? (확산)",
      hint: "결론이 아니라, 당신에게 남는 질문.",
      fields: [{ name: "q6", placeholder: "" }],
      material: null
    }
  ];
  var N = QUESTIONS.length;

  var state = { name: "", answers: {}, revealed: {} };
  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved) {
      state.name = saved.name || "";
      state.answers = saved.answers || {};
      state.revealed = saved.revealed || {};
    }
  } catch (e) {}

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        name: state.name, answers: state.answers, revealed: state.revealed
      }));
    } catch (e) {}
  }

  var app = document.getElementById("app");
  var idx = 0; // 0 = 인트로, 1..N = 질문, N+1 = 완료

  // --- DOM 헬퍼 ---
  function n(tag, props, kids) {
    var e = document.createElement(tag);
    if (props) for (var k in props) {
      if (k === "class") e.className = props[k];
      else if (k === "text") e.textContent = props[k];
      else if (k === "html") e.innerHTML = props[k];
      else if (k === "onclick") e.addEventListener("click", props[k]);
      else if (props[k] === true) e.setAttribute(k, "");
      else if (props[k] !== false && props[k] != null) e.setAttribute(k, props[k]);
    }
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  function autoGrow(ta) {
    ta.style.height = "auto";
    ta.style.height = (ta.scrollHeight) + "px";
  }

  function transition(render) {
    app.classList.add("fade-out");
    setTimeout(function () {
      app.innerHTML = "";
      app.className = "app";
      render();
      window.scrollTo(0, 0);
    }, 160);
  }
  function go(i) { idx = i; transition(renderCurrent); }
  function renderCurrent() {
    if (idx <= 0) return renderIntro();
    if (idx <= N) return renderQuestion(idx - 1);
    return renderDone();
  }

  // --- 인트로 ---
  var NAMES = ["김태상", "김지연", "김가람", "정미진", "이환규", "서재은", "송정훈"];

  function renderIntro() {
    var grid = n("div", { class: "name-grid" });
    NAMES.forEach(function (nm) {
      grid.appendChild(n("button", {
        class: "name-btn" + (state.name === nm ? " selected" : ""),
        text: nm + "님",
        onclick: function () { state.name = nm; save(); go(1); }
      }));
    });

    app.appendChild(n("div", { class: "center" }, [
      n("p", { class: "kicker", text: "리더스클럽 6기 · 9월" }),
      n("p", { class: "lead", text: "사랑과 이기심" }),
      n("div", { class: "intro-core" }, [
        n("p", { class: "core-label", text: "핵심 질문" }),
        n("p", { class: "core-q", html: "이기심 혹은 자기애는 사랑을 저해하는가?<br/>오히려 사랑을 가능하게 하는가?" })
      ]),
      n("p", { class: "sub", html: "핵심 질문에 답하기 위한 질문들을 고민해보고,<br/>발제문 후반부에 핵심 질문에 답해보는 방식으로 따라가보겠습니다!" }),
      n("p", { class: "pick-label", text: "당신의 이름을 선택해 주세요" }),
      grid
    ]));
  }

  // --- 질문 ---
  function renderQuestion(qi) {
    var q = QUESTIONS[qi];
    var pct = Math.round(((qi + 1) / N) * 100);

    var progress = n("div", { class: "progress" }, [
      n("div", { class: "count", text: "질문 " + (qi + 1) + " / " + N }),
      n("div", { class: "bar" }, [ (function () { var s = n("span"); s.style.width = pct + "%"; return s; })() ])
    ]);

    var block = n("div", {}, [ n("p", { class: "question", text: q.text }) ]);
    if (q.hint) block.appendChild(n("p", { class: "hint", text: q.hint }));

    q.fields.forEach(function (f) {
      if (f.label) block.appendChild(n("label", { class: "field-label", text: f.label }));
      var ta = n("textarea", { rows: "2", placeholder: f.placeholder || "" });
      ta.value = state.answers[f.name] || "";
      ta.addEventListener("input", function () {
        state.answers[f.name] = ta.value; save(); autoGrow(ta);
      });
      block.appendChild(ta);
      setTimeout(function () { autoGrow(ta); }, 0);
    });

    // 자료: 이미 노출된 경우에만 표시
    if (q.material && state.revealed[q.key]) block.appendChild(buildMaterial(q.material));

    var backBtn = n("button", { class: "btn-back", text: "← 뒤로", onclick: function () { go(idx - 1); } });
    var isLast = qi === N - 1;
    var nextBtn = n("button", { class: "btn-next", text: isLast ? "제출하기" : "다음 →", onclick: function () { onNext(qi); } });

    app.appendChild(progress);
    app.appendChild(block);
    app.appendChild(n("div", { class: "nav" }, [ backBtn, nextBtn ]));
  }

  function buildMaterial(m) {
    var wrap = n("div", { class: "material" }, [
      n("p", { class: "material-label", html: '<span class="clip">📎</span>' + escapeHtml(m.label) })
    ]);
    if (m.img) {
      var img = n("img", { src: m.img, alt: m.label });
      var ph = n("div", { class: "material-placeholder", text: "자료 이미지가 아직 없습니다. (진행자가 넣는 자리)" });
      ph.style.display = "none";
      img.addEventListener("error", function () { img.style.display = "none"; ph.style.display = "block"; });
      wrap.appendChild(img);
      wrap.appendChild(ph);
    }
    return wrap;
  }

  function onNext(qi) {
    var q = QUESTIONS[qi];
    var filled = q.fields.some(function (f) { return (state.answers[f.name] || "").trim().length > 0; });

    // 자료가 있고 아직 안 열렸고 답을 쓴 상태 → 자료 자동 노출(그 자리에서). 이동 안 함.
    if (q.material && !state.revealed[q.key] && filled) {
      state.revealed[q.key] = true; save();
      transition(function () { renderQuestion(qi); });
      return;
    }
    if (qi === N - 1) { submit(); return; }
    go(idx + 1);
  }

  // --- 제출 ---
  function submit() {
    transition(function () {
      app.appendChild(n("div", { class: "center" }, [
        n("p", { class: "lead", text: "제출 중…" })
      ]));
    });

    var payload = {
      round: ROUND,
      participant_name: state.name,
      q1: nn(state.answers.q1), q2: nn(state.answers.q2), q3: nn(state.answers.q3),
      q4: nn(state.answers.q4), q5_1: nn(state.answers.q5_1), q5_2: nn(state.answers.q5_2),
      q6: nn(state.answers.q6)
    };

    fetch(CFG.SUPABASE_URL + "/rest/v1/responses", {
      method: "POST",
      headers: {
        "apikey": CFG.SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + CFG.SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) return res.text().then(function (t) { throw new Error("HTTP " + res.status + " " + t); });
      go(N + 1);
    }).catch(function (e) {
      renderError(e);
    });
  }

  function renderError(e) {
    transition(function () {
      app.appendChild(n("div", { class: "center" }, [
        n("p", { class: "lead", text: "제출에 실패했어요" }),
        n("p", { class: "sub", text: "잠시 뒤 다시 시도해 주세요. 작성한 답은 이 기기에 저장돼 있어요." }),
        n("p", { class: "error", text: String(e && e.message ? e.message : e) }),
        n("div", { class: "nav" }, [
          n("button", { class: "btn-next", text: "다시 제출", onclick: submit })
        ])
      ]));
    });
  }

  // --- 완료 ---
  function bookCard(src, title) {
    var img = n("img", { src: src, alt: title });
    var ph = n("div", { class: "ph", text: "표지 이미지 자리" });
    ph.style.display = "none";
    img.addEventListener("error", function () { img.style.display = "none"; ph.style.display = "flex"; });
    return n("div", { class: "book" }, [
      n("div", { class: "cover" }, [ img, ph ]),
      n("p", { class: "book-title", text: "《" + title + "》" })
    ]);
  }

  function renderDone() {
    app.appendChild(n("div", { class: "center" }, [
      n("p", { class: "kicker", text: state.name + " 님" }),
      n("p", { class: "lead", text: "제출 완료" }),
      n("p", { class: "closing", html: "이것으로 9월 리더스클럽 활동 《사랑과 이기심》 토론을 마치겠습니다!<br/>함께 자리해주셔서 감사합니다!" }),
      n("p", { class: "books-label", text: "추천 도서 · 에리히 프롬" }),
      n("div", { class: "books" }, [
        bookCard("assets/books/love.jpg", "사랑의 기술"),
        bookCard("assets/books/being.jpg", "존재의 기술")
      ]),
      n("div", { class: "nav" }, [
        n("button", { class: "btn-back", text: "← 답 다시 보기 · 수정", onclick: function () { go(1); } })
      ]),
      n("p", { class: "notice", text: "다시 제출하면 마지막에 제출한 답이 최종 답으로 반영돼요." })
    ]));
  }

  function nn(v) { v = (v || "").trim(); return v.length ? v : null; }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // 시작
  if (!CFG.SUPABASE_URL || CFG.SUPABASE_URL.indexOf("YOUR-PROJECT") !== -1) {
    // 설정 전에도 화면은 보이도록: 인트로부터 렌더 (제출 시에만 에러)
  }
  renderCurrent();
})();
