const nav = document.querySelector(".nav");
const indicator = document.querySelector(".nav-indicator");
const items = document.querySelectorAll(".nav-item");
const toggle = document.querySelector(".nav-toggle");

let activeItem = document.querySelector(".nav-item.active");
let isClickScrolling = false; 

/* ========================= */
/* NAV PILL POSITIONING & COLOR FIX */
/* ========================= */

function moveIndicator(el, opacity = 1) {
  if (!el || !nav || !indicator) return;
  if (!window.matchMedia("(min-width: 1050px)").matches) return;

  const rect = el.getBoundingClientRect();
  const parentRect = nav.getBoundingClientRect();
  const leftPos = rect.left - parentRect.left;

  indicator.style.width = rect.width + "px";
  indicator.style.transform = `translateX(${leftPos}px)`;
  indicator.style.opacity = opacity;

  if (el.getAttribute("href") === "#services") {
    indicator.classList.add("light-pill");
  } else {
    indicator.classList.remove("light-pill");
  }
}

/* INIT */
window.addEventListener("load", () => {
  if (activeItem) {
    setTimeout(() => {
      moveIndicator(activeItem, 1);
    }, 50);
  }
});

/* HOVER & CLICK */
items.forEach(item => {
  item.addEventListener("mouseenter", () => {
    if (!isClickScrolling) moveIndicator(item, 0.4);
  });

  item.addEventListener("click", (e) => {
    const href = item.getAttribute("href");

    if (!href || href === "#") {
      e.preventDefault();
      return;
    }

    const target = document.querySelector(href);

    if (target) {
      e.preventDefault();

      isClickScrolling = true;

      document.querySelector(".nav-item.active")?.classList.remove("active");
      item.classList.add("active");
      activeItem = item;
      moveIndicator(item, 1);

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      setTimeout(() => {
        isClickScrolling = false;
      }, 800); 
    }

    nav.classList.remove("open");
  });
});

/* RESET ON EXIT */
nav.addEventListener("mouseleave", () => {
  if (!isClickScrolling && activeItem) moveIndicator(activeItem, 1);
});

/* RESIZE SAFETY */
window.addEventListener("resize", () => {
  if (!activeItem) return;
  requestAnimationFrame(() => moveIndicator(activeItem, 1));
});

/* MOBILE MENU */
if (toggle) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

/* NAVBAR SCROLL EFFECT */
window.addEventListener("scroll", () => {
  document.body.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

/* ========================= */
/* ROBUST SCROLL-SPY         */
/* ========================= */

const sections = [
  "services",
  "packages",
  "about",
  "process",
  "pricing",
  "contact"
]
.map(id => document.getElementById(id))
.filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    if (isClickScrolling) return;

    for (const entry of entries) {
      // Using entry.isIntersecting ensures it updates both when entering 
      // AND exiting sections from top or bottom.
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const matchingLink = document.querySelector(`.nav-item[href="#${id}"]`);

        if (!matchingLink || matchingLink === activeItem) continue;

        document.querySelector(".nav-item.active")?.classList.remove("active");
        matchingLink.classList.add("active");

        activeItem = matchingLink;
        moveIndicator(matchingLink, 1);
      }
    }
  },
  {
    root: null,
    threshold: 0.1, // Lower threshold means it catches sections instantly when scrolling up
    rootMargin: "-81px 0px -60% 0px" // Accounts perfectly for your 80px fixed header offset
  }
);

sections.forEach(sec => observer.observe(sec));2

/* ========================= */
/* PROCESS DOT NAVIGATION */
/* ========================= */

const processGrid = document.querySelector(".process-grid");
const dots = document.querySelectorAll(".process-dots .dot");

if (processGrid && dots.length) {

  processGrid.addEventListener("scroll", () => {
    const index = Math.round(
      processGrid.scrollLeft / processGrid.offsetWidth
    );

    dots.forEach(d => d.classList.remove("active"));
    if (dots[index]) dots[index].classList.add("active");
  });

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.index);

      processGrid.scrollTo({
        left: index * processGrid.offsetWidth,
        behavior: "smooth"
      });
    });
  });
}
