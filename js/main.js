document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     FORMULARIOS
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
     Solo imágenes con data-src
     =============================== */
  const lazyImages = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          img.src = img.dataset.src;
          img.removeAttribute("data-src");

          img.onload = () => img.classList.add("loaded");

          obs.unobserve(img);
        }
      });
    }, {
      rootMargin: "150px"
    });

    lazyImages.forEach(img => observer.observe(img));
  } else {
    // Fallback para navegadores muy viejos
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }

});