// ΠΑΠΑΛΙΝΑ — main script

document.addEventListener('DOMContentLoaded', () => {
  // ---- Header scroll state ----
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

 // ---- Mobile menu ----
const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");

if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});
// Κλείσιμο όταν ο χρήστης πατάει έξω από το menu
document.addEventListener("click", (e) => {
  if (
    nav.classList.contains("open") &&
    !nav.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    nav.classList.remove("open");
  }
});


  // ---- Active nav link ----
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  // ---- Reveal on scroll ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---- Lazy load fallback ----
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading') && !img.classList.contains('hero-img')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // ---- Year ----
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---- Menu page: sticky nav scroll-to + active state ----
  const menuButtons = document.querySelectorAll('.menu-nav button[data-cat]');
  if (menuButtons.length) {
    menuButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cat;
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    const sections = document.querySelectorAll('.menu-section');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          menuButtons.forEach(b => b.classList.toggle('active', b.dataset.cat === id));
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  // ---- Lightbox (gallery page) ----
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  if (items.length && lightbox) {
    const imgs = Array.from(items).map(b => ({
      src: b.dataset.src || b.querySelector('img').src,
      alt: b.dataset.alt || b.querySelector('img').alt
    }));
    let idx = 0;
    const lbImg = lightbox.querySelector('img');
    const lbCap = lightbox.querySelector('.lb-caption');
    const show = (i) => {
      idx = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[idx].src;
      lbImg.alt = imgs[idx].alt;
      lbCap.textContent = imgs[idx].alt;
    };
    const open = (i) => { show(i); lightbox.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const close = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };
    items.forEach((b, i) => b.addEventListener('click', () => open(i)));
    lightbox.querySelector('.lb-close').addEventListener('click', close);
    lightbox.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
    lightbox.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
  }

 // ===== Reservation Form =====
const reservationForm = document.getElementById("reservation-form");
if (reservationForm) {
    console.log("Η φόρμα βρέθηκε!");

    const reservationMessage =
    document.getElementById("reservation-message");
    reservationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitButton =
    reservationForm.querySelector('button[type="submit"]');

submitButton.disabled = true;

submitButton.textContent = "Γίνεται καταχώρηση...";
        reservationMessage.textContent = "Γίνεται καταχώρηση...";
        const firstName = document.getElementById("first-name").value;
const lastName = document.getElementById("last-name").value;
const phone = document.getElementById("reservation-phone").value;
const date = document.getElementById("reservation-date").value;
const time = document.getElementById("reservation-time").value;
const people = document.getElementById("people").value;

console.log({
    firstName,
    lastName,
    phone,
    date,
    time,
    people
});
        console.log("Πάτησες κράτηση!");
    try {

const response = await fetch(
    "https://reservation-backend-cnxc.onrender.com/reserve",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName,
            lastName,
            phone,
            date,
            time,
            people
        })
    }
);

const data = await response.json();

if (!response.ok) {
    reservationMessage.textContent =
        data.message || "Η κράτηση δεν ολοκληρώθηκε.";

    submitButton.disabled = false;
    submitButton.textContent = "Κράτηση";
    return;
}

reservationMessage.textContent =
    data.message || "Η κράτηση καταχωρήθηκε!";

reservationForm.reset();

submitButton.disabled = false;
submitButton.textContent = "Κράτηση";

} catch (error) {

    reservationMessage.textContent =
        "Κάτι πήγε στραβά. Προσπαθήστε ξανά.";

        submitButton.disabled = false;
submitButton.textContent = "Κράτηση";

}
    });
}
});
