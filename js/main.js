// main.js — TAPX 5.0 PRODUCCIÓN
document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     INICIALIZAR SUPABASE
  =============================== */
  const SUPABASE_URL = "https://TU_PROJECT.supabase.co";
  const SUPABASE_ANON_KEY = "TU_ANON_KEY";
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  /* ===============================
     TOASTS PROFESIONALES
  =============================== */
  const toastContainer = document.getElementById("toast-container");
  function mostrarToast(msg, tipo = "success") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.textContent = msg;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 3000);
  }

  /* ===============================
     VALIDACIÓN DE FORMULARIOS
  =============================== */
  const validarCampo = input => {
    if (!input.value.trim()) {
      input.classList.add("input-error");
      return false;
    } else {
      input.classList.remove("input-error");
      return true;
    }
  };

  const validarEmail = input => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(input.value.trim())) {
      input.classList.add("input-error");
      return false;
    } else {
      input.classList.remove("input-error");
      return true;
    }
  };

  const validarFormulario = form => {
    let valido = true;
    form.querySelectorAll("input, select").forEach(field => {
      if (field.required) {
        if (field.type === "email") {
          if (!validarEmail(field)) valido = false;
        } else {
          if (!validarCampo(field)) valido = false;
        }
      }
    });
    return valido;
  };

  /* ===============================
     ENVÍO DE FORMULARIOS
  =============================== */
  async function enviarFormulario(form, tabla, mensajeExito) {
    const feedbackPrevio = form.querySelector(".form-feedback");
    if (feedbackPrevio) feedbackPrevio.remove();

    const feedback = document.createElement("div");
    feedback.className = "form-feedback";
    feedback.textContent = "Enviando...";
    form.appendChild(feedback);

    const datos = Object.fromEntries(
      Array.from(form.elements)
        .filter(el => el.name)
        .map(el => [el.name, el.value.trim()])
    );

    try {
      const { error } = await supabase.from(tabla).insert([datos]);
      if (error) throw error;

      feedback.classList.add("success");
      feedback.textContent = mensajeExito;
      form.reset();
      form.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
      mostrarToast(mensajeExito, "success");
    } catch (err) {
      feedback.classList.add("error");
      feedback.textContent = "Hubo un error al enviar tu información.";
      console.error(`Error en ${tabla}:`, err.message);
      mostrarToast("Error al enviar. Intenta nuevamente.", "error");
    }
  }

  /* ===============================
     EVENTOS SUBMIT
  =============================== */
  const formComercios = document.getElementById("comercios");
  const formUsuarios = document.getElementById("usuarios");

  formComercios?.addEventListener("submit", e => {
    e.preventDefault();
    validarFormulario(formComercios)
      ? enviarFormulario(formComercios, "comercios", "Gracias por registrar tu comercio. Pronto nos contactaremos.")
      : mostrarToast("Completa todos los campos correctamente.", "error");
  });

  formUsuarios?.addEventListener("submit", e => {
    e.preventDefault();
    validarFormulario(formUsuarios)
      ? enviarFormulario(formUsuarios, "usuarios", "Gracias por tu interés. Te avisaremos cuando TapX esté disponible.")
      : mostrarToast("Completa todos los campos correctamente.", "error");
  });

  /* ===============================
     LAZY LOAD DE IMÁGENES
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
    }, { rootMargin: "200px" });
    lazyImages.forEach(img => observer.observe(img));
  } else {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }

  /* ===============================
     SCROLL REVEAL (Opcional)
  =============================== */
  if (window.ScrollReveal) {
    ScrollReveal().reveal(
      'header h1, header p, .hero-image, section h2, .section-image, .card, form',
      {
        distance: '50px',
        origin: 'bottom',
        opacity: 0,
        duration: 900,
        easing: 'cubic-bezier(0.5,0,0,1)',
        interval: 150,
        reset: false
      }
    );
  }
});