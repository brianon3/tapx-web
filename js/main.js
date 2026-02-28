// main.js
document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     INICIALIZAR SUPABASE
     =============================== */
  const SUPABASE_URL = "tapx-web.vercel.app"; // tu URL de Supabase
  const SUPABASE_ANON_KEY = "sb_publishable_o3gkafnJ-gxeqX-ZcEeIeg_tn0Am7Ue"; // tu anon/public key
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  /* ===============================
     FUNCIONES DE VALIDACIÓN
     =============================== */
  function validarCampo(input) {
    if (!input.value.trim()) {
      input.classList.add("input-error");
      return false;
    } else {
      input.classList.remove("input-error");
      return true;
    }
  }

  function validarEmail(input) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(input.value.trim())) {
      input.classList.add("input-error");
      return false;
    } else {
      input.classList.remove("input-error");
      return true;
    }
  }

  function validarFormulario(form) {
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
  }

  /* ===============================
     MANEJO DE FORMULARIOS
     =============================== */
  const formComercios = document.getElementById("comercios");
  const formUsuarios = document.getElementById("usuarios");

  async function enviarFormulario(form, tabla, mensajeExito) {
    const feedback = form.querySelector(".form-feedback");
    if (feedback) feedback.remove();

    const feedbackEl = document.createElement("div");
    feedbackEl.className = "form-feedback";
    feedbackEl.textContent = "Enviando...";
    form.appendChild(feedbackEl);

    const fields = Object.fromEntries(
      Array.from(form.elements)
        .filter(el => el.name)
        .map(el => [el.name, el.value.trim()])
    );

    try {
      const { error } = await supabase.from(tabla).insert([fields]);
      if (error) throw error;

      feedbackEl.classList.add("success");
      feedbackEl.textContent = mensajeExito;
      form.reset();
      form.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    } catch (err) {
      feedbackEl.classList.add("error");
      feedbackEl.textContent = "Hubo un error al enviar tu información. Intenta nuevamente.";
      console.error(Error al registrar en ${tabla}:, err.message);
    }
  }

  formComercios?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (validarFormulario(formComercios)) {
      await enviarFormulario(formComercios, "comercios", "Gracias por registrar tu comercio. Pronto nos contactaremos.");
    } else {
      if (!formComercios.querySelector(".form-feedback")) {
        const f = document.createElement("div");
        f.className = "form-feedback error";
        f.textContent = "Por favor, completa todos los campos correctamente.";
        formComercios.appendChild(f);
      }
    }
  });

  formUsuarios?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (validarFormulario(formUsuarios)) {
      await enviarFormulario(formUsuarios, "usuarios", "Gracias por tu interés. Te avisaremos cuando TapX esté disponible.");
    } else {
      if (!formUsuarios.querySelector(".form-feedback")) {
        const f = document.createElement("div");
        f.className = "form-feedback error";
        f.textContent = "Por favor, completa todos los campos correctamente.";
        formUsuarios.appendChild(f);
      }
    }
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
    }, { rootMargin: "150px" });

    lazyImages.forEach(img => observer.observe(img));
  } else {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });
  }

});