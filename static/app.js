(() => {
  const SYMBOL = { add: "+", subtract: "−", multiply: "×", divide: "÷" };
  const $ = (id) => document.getElementById(id);
  const out = $("out"), expr = $("expr"), historyEl = $("history");
  const state = { current: "0", first: null, op: null, fresh: false, count: 0 };

  const fmt = (n) => {
    const num = Number(n);
    if (!Number.isFinite(num)) return String(n);
    return Number.isInteger(num) ? num.toLocaleString("en-US") : num.toLocaleString("en-US", { maximumFractionDigits: 10 });
  };

  function render() {
    out.classList.remove("error");
    out.textContent = state.current === "-" ? "-" : fmt(state.current) + (state.current.endsWith(".") ? "." : "");
    expr.innerHTML = state.op ? `${fmt(state.first)} ${SYMBOL[state.op]}` : "&nbsp;";
    document.querySelectorAll(".op").forEach((b) => b.classList.toggle("active", b.dataset.op === state.op && state.fresh));
  }

  function inputDigit(d) {
    if (state.fresh) { state.current = "0"; state.fresh = false; }
    if (d === "." && state.current.includes(".")) return;
    if (state.current.replace(/[-.]/g, "").length >= 15) return;
    state.current = state.current === "0" && d !== "." ? d : state.current + d;
    render();
  }

  async function chooseOp(op) {
    if (state.op && !state.fresh) await equals();
    state.first = state.current;
    state.op = op;
    state.fresh = true;
    render();
  }

  async function equals() {
    if (!state.op) return;
    const a = state.first, b = state.current, op = state.op;
    const t0 = performance.now();
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a, b, op }),
      });
      const data = await res.json();
      $("statMs").textContent = Math.round(performance.now() - t0) + "ms";
      if (!res.ok) throw new Error(data.error || "Error");
      addHistory(`${fmt(a)} ${SYMBOL[op]} ${fmt(b)}`, fmt(data.result));
      state.current = String(data.result);
      state.first = null; state.op = null; state.fresh = true;
      render();
      out.classList.remove("pop"); void out.offsetWidth; out.classList.add("pop");
    } catch (err) {
      state.first = null; state.op = null; state.current = "0"; state.fresh = true;
      render();
      out.textContent = err.message;
      out.classList.add("error");
    }
  }

  function addHistory(e, r) {
    const empty = historyEl.querySelector(".empty");
    if (empty) empty.remove();
    const li = document.createElement("li");
    li.innerHTML = `<span class="h-expr"></span><span class="h-res"></span>`;
    li.children[0].textContent = e + " =";
    li.children[1].textContent = r;
    historyEl.prepend(li);
    while (historyEl.children.length > 20) historyEl.lastChild.remove();
    $("statCount").textContent = ++state.count;
  }

  function action(a) {
    if (a === "clear") Object.assign(state, { current: "0", first: null, op: null, fresh: false });
    if (a === "sign" && state.current !== "0") state.current = state.current.startsWith("-") ? state.current.slice(1) : "-" + state.current;
    if (a === "back" && !state.fresh) state.current = state.current.length > 1 && state.current !== "-0" ? state.current.slice(0, -1) : "0";
    if (state.current === "-") state.current = "0";
    if (a === "equals") return equals();
    render();
  }

  document.querySelector(".keys").addEventListener("click", (e) => {
    const k = e.target.closest(".key");
    if (!k) return;
    if (k.dataset.num) inputDigit(k.dataset.num);
    else if (k.dataset.op) chooseOp(k.dataset.op);
    else if (k.dataset.action) action(k.dataset.action);
  });

  $("clearHistory").addEventListener("click", () => {
    historyEl.innerHTML = '<li class="empty">No calculations yet</li>';
    state.count = 0; $("statCount").textContent = "0";
  });

  const KEYMAP = { "+": "add", "-": "subtract", "*": "multiply", "x": "multiply", "/": "divide" };
  document.addEventListener("keydown", (e) => {
    let sel = null;
    if (/^[0-9.]$/.test(e.key)) { inputDigit(e.key); sel = `[data-num="${e.key}"]`; }
    else if (KEYMAP[e.key]) { e.preventDefault(); chooseOp(KEYMAP[e.key]); sel = `[data-op="${KEYMAP[e.key]}"]`; }
    else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); action("equals"); sel = '[data-action="equals"]'; }
    else if (e.key === "Backspace") { action("back"); sel = '[data-action="back"]'; }
    else if (e.key === "Escape") { action("clear"); sel = '[data-action="clear"]'; }
    const btn = sel && document.querySelector(sel);
    if (btn) { btn.classList.add("pressed"); setTimeout(() => btn.classList.remove("pressed"), 120); }
  });

  render();
})();
