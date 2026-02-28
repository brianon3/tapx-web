// main.js — TAPX 5.2 FINAL (SUPABASE V2 REAL)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     SUPABASE INIT
  =============================== */
  const SUPABASE_URL = "https://ywxpvbkwlblrcyxuxsop.supabase.co";
  const SUPABASE_ANON_KEY = "PEGA_ACA_TU_ANON_PUBLIC_KEY_REAL";

  const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log("✅ Supabase conectado", supabaseClient);

  /* ===============================
     TOASTS
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
     VALIDACIÓN
  =============================== */
  const validarCampo = el => {
    if (!el.value.trim()) {
      el.classList.add("input-error");
      return false;
    }
    el.classList.remove("input-error");
    return true;
  };

  const validarEmail = el => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validarCampo(el) && re.test(el.value);
  };

  const validarFormulario = form => {
    let ok = true;
    form.querySelectorAll("input, select").forEach(el => {
      if (!el.required) return;
      if (el.type === "email") {
        if (!validarEmail(el)) ok = false;
      } else {
        if (!validarCampo(el)) ok = false;
      }
    });
    return ok;
  };

  /* ===============================
     ENVÍO
  =============================== */
  async function enviarFormulario(form, tabla, mensaje) {

    const datos = Object.fromEntries(
      [...form.elements]
        .filter(el => el.name)
        .map(el => [el.name, el.value.trim()])
    );

    console.log("📤 Insertando en:", tabla, datos);

    const { error } = await supabaseClient
      .from(tabla)
      .insert([datos]);

    if (error) {
      console.error("❌ Supabase error:", error);
      mostrarToast(error.message, "error");
      return;
    }

    mostrarToast(mensaje, "success");
    form.reset();
  }

  /* ===============================
     SUBMITS
  =============================== */
  const formComercios = document.getElementById("comercios");
  const formUsuarios = document.getElementById("usuarios");

  formComercios?.addEventListener("submit", e => {
    e.preventDefault();
    if (validarFormulario(formComercios)) {
      enviarFormulario(
        formComercios,
        "comercios",
        "Gracias por registrar tu comercio"
      );
    } else {
      mostrarToast("Revisá los campos", "error");
    }
  });

  formUsuarios?.addEventListener("submit", e => {
    e.preventDefault();
    if (validarFormulario(formUsuarios)) {
      enviarFormulario(
        formUsuarios,
        "usuarios",
        "Gracias por tu interés"
      );
    } else {
      mostrarToast("Revisá los campos", "error");
    }
  });

});