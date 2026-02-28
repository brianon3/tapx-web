// main.js — TAPX 5.1 FIXED PRODUCCIÓN
document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     INICIALIZAR SUPABASE (FIX)
  =============================== */
  const SUPABASE_URL = "https://ywxpvbkwlblrcyxuxsop.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3eHB2Ymt3bGJscmN5eHV4c29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMjA2MzIsImV4cCI6MjA4Nzc5NjYzMn0.9qbiglW-JrYySXhsA0CTlZkVamF_tC95s5byyVqxSmc";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

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
    }, 3200);
  }

  /* ===============================
     VALIDACIÓN
  =============================== */
  const validarCampo = input => {
    if (!input.value.trim()) {
      input.classList.add("input-error");
      return false;
    }
    input.classList.remove("input-error");
    return true;
  };

  const validarEmail = input => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(input.value.trim())) {
      input.classList.add("input-error");
      return false;
    }
    input.classList.remove("input-error");
    return true;
  };

  const validarFormulario = form => {
    let valido = true;
    form.querySelectorAll("input, select").forEach(field => {
      if (!field.required) return;

      if (field.type === "email") {
        if (!validarEmail(field)) valido = false;
      } else {
        if (!validarCampo(field)) valido = false;
      }
    });
    return valido;
  };

  /* ===============================
     ENVÍO A SUPABASE
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
      const { error } = await supabaseClient
        .from(tabla)
        .insert([datos]);

      if (error) throw error;

      feedback.classList.add("success");
      feedback.textContent = mensajeExito;

      form.reset();
      form.querySelectorAll(".input-error")
        .forEach(el => el.classList.remove("input-error"));

      mostrarToast(mensajeExito, "success");

    } catch (err) {
      console.error(`Error Supabase (${tabla}):`, err.message);

      feedback.classList.add("error");
      feedback.textContent = "No se pudo enviar el formulario. Intenta nuevamente.";

      mostrarToast("Error al enviar. Revisá los datos.", "error");
    }
  }

  /* ===============================
     SUBMITS
  =============================== */
  const formComercios = document.getElementById("comercios");
  const formUsuarios = document.getElementById("usuarios");

  formComercios?.addEventListener("submit", e => {
    e.preventDefault();

    validarFormulario(formComercios)
      ? enviarFormulario(
          formComercios,
          "comercios",
          "Gracias por registrar tu comercio. Pronto nos contactaremos."
        )
      : mostrarToast("Completá todos los campos correctamente.", "error");
  });

  formUsuarios?.addEventListener("submit", e => {
    e.preventDefault();

    validarFormulario(formUsuarios)
      ? enviarFormulario(
          formUsuarios,
          "usuarios",
          "Gracias por tu interés. Te avisaremos cuando TapX esté disponible."
        )
      : mostrarToast("Completá todos los campos correctamente.", "error");
  });

  /* ===============================
     SCROLL REVEAL
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
        interval: 120,
        reset: false
      }
    );
  }

});