const stage = document.getElementById("stage");
const scene = document.getElementById("die-scene");
const chipPackage = document.querySelector(".die-pkg");
const blocks = document.querySelectorAll("button.block[data-section]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const phoneLayout = window.matchMedia("(max-width: 700px)");

const ZOOM_MS = 520;
let openSection = null;
let openTimer = null;
let closeTimer = null;

function fitChipPackage() {
  if (!chipPackage) return;
  const bounds = scene.getBoundingClientRect();
  const aspectRatio = phoneLayout.matches ? 4 / 5 : 5 / 4;
  const size = window.ChipLayout.calculateChipSize({
    availableWidth: bounds.width,
    availableHeight: bounds.height,
    aspectRatio,
  });

  chipPackage.style.width = `${size.width}px`;
  chipPackage.style.height = `${size.height}px`;
}

function panelFor(id) {
  return document.getElementById(`panel-${id}`);
}

function blockFor(id) {
  return document.querySelector(`button.block[data-section="${id}"]`);
}

function applyZoom(id) {
  const block = blockFor(id);
  if (!block) return;
  scene.style.transform = "";
  const r = block.getBoundingClientRect();
  const s = scene.getBoundingClientRect();
  // Cap the scale: huge factors force re-rasterization of the die layer and jank.
  const scale = Math.min(
    Math.min(window.innerWidth / r.width, window.innerHeight / r.height) * 1.12,
    2.6
  );
  const dx = window.innerWidth / 2 - (r.left + r.width / 2);
  const dy = window.innerHeight / 2 - (r.top + r.height / 2);
  scene.style.transformOrigin = `${r.left + r.width / 2 - s.left}px ${r.top + r.height / 2 - s.top}px`;
  scene.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
}

function open(id, animate = true) {
  const panel = panelFor(id);
  if (!panel || openSection === id) return;
  if (openSection) close(false);
  clearTimeout(openTimer);
  clearTimeout(closeTimer);

  openSection = id;
  applyZoom(id);
  document.body.classList.add("zoomed");
  stage.setAttribute("inert", "");

  // Reveal the panel only after the zoom lands: laying out the panel (videos,
  // iframes) mid-transform is what makes the animation stutter.
  const reveal = () => {
    panel.hidden = false;
    void panel.offsetHeight;
    panel.classList.add("open");
    panel.scrollTop = 0;
    panel.focus({ preventScroll: true });
  };
  if (animate && !reduceMotion) {
    openTimer = setTimeout(reveal, ZOOM_MS - 30);
  } else {
    reveal();
  }
}

function close(animate = true) {
  if (!openSection) return;
  const id = openSection;
  const panel = panelFor(id);
  openSection = null;
  clearTimeout(openTimer);
  clearTimeout(closeTimer);

  panel.classList.remove("open");

  // Fade the panel out first, then run the reverse zoom on a quiet main thread.
  const finish = () => {
    panel.hidden = true;
    scene.style.transform = "";
    document.body.classList.remove("zoomed");
    stage.removeAttribute("inert");
    const block = blockFor(id);
    if (block) block.focus({ preventScroll: true });
    // Stop leftover media only after the reverse zoom is done; tearing down
    // iframes competes with the animation for the main thread.
    setTimeout(() => {
      if (openSection === id) return;
      panel.querySelectorAll("video").forEach((v) => v.pause());
      panel.querySelectorAll("iframe").forEach((f) => {
        f.src = f.src;
      });
    }, ZOOM_MS);
  };

  if (animate && !reduceMotion) {
    closeTimer = setTimeout(finish, 200);
  } else {
    finish();
  }
}

blocks.forEach((block) => {
  block.addEventListener("click", () => {
    const id = block.dataset.section;
    open(id);
    history.pushState(null, "", `#${id}`);
  });
});

document.querySelectorAll(".panel .back").forEach((btn) => {
  btn.addEventListener("click", () => {
    close();
    history.pushState(null, "", location.pathname + location.search);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && openSection) {
    close();
    history.pushState(null, "", location.pathname + location.search);
  }
});

window.addEventListener("popstate", () => {
  const id = location.hash.slice(1);
  if (id && panelFor(id)) {
    open(id);
  } else {
    close();
  }
});

window.addEventListener("resize", () => {
  fitChipPackage();
  if (openSection) applyZoom(openSection);
});

fitChipPackage();
if ("ResizeObserver" in window) {
  new ResizeObserver(fitChipPackage).observe(scene);
}
document.fonts?.ready.then(fitChipPackage);

// Deep link: open the section instantly, no zoom animation.
const initial = location.hash.slice(1);
if (initial && panelFor(initial)) {
  open(initial, false);
}

// Binary counter on the About panel's LED strip — a nod to the register debug
// LEDs on the CPU project's Basys 3 board.
const leds = document.querySelectorAll(".led");
if (leds.length) {
  const show = (value) => {
    leds.forEach((led, i) => {
      led.classList.toggle("on", Boolean((value >> (leds.length - 1 - i)) & 1));
    });
  };
  if (reduceMotion) {
    show(0x0d);
  } else {
    let count = 0;
    show(count);
    setInterval(() => {
      count = (count + 1) & 0xff;
      show(count);
    }, 700);
  }
}
