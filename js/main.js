document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     FORMULARIOS (igual que antes)
     =============================== */
  const formComercios = document.getElementById("comercios");
  const formUsuarios = document.getElementById("usuarios");

  formComercios?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Gracias por registrar tu comercio. Pronto nos contactaremos.");
    formComercios.reset();
  });

  formUsuarios?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Gracias por tu interés. Te avisaremos cuando TapX esté disponible.");
    formUsuarios.reset();
  });

  /* ===============================
     LAZY LOAD DE IMÁGENES
     =============================== */
  const lazyImages = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: "100px"
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback viejo
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }

  /* ===============================
     PRELOAD HERO IMAGE
     =============================== */
  const heroImage = document.querySelector("img[data-hero]");
  if (heroImage) {
    const img = new Image();
    img.src = heroImage.src;
  }
});