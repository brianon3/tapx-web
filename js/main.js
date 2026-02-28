// main.js — TAPX 5.3 iOS SAFE

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

document.addEventListener("DOMContentLoaded", () => {
  try {

    /* ===============================
       SUPABASE INIT
    =============================== */
    const SUPABASE_URL = "https://ywxpvbkwlblrcyxuxsop.supabase.co";
    const SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3eHB2Ymt3bGJscmN5eHV4c29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMjA2MzIsImV4cCI6MjA4Nzc5NjYzMn0.9qbiglW-JrYySXhsA0CTlZkVamF_tC95s5byyVqxSmc";

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase conectado");

    /* ===============================
       TOASTS
    =============================== */
    const toastContainer = document.getElementById("toast-container");

    function mostrarToast(msg, tipo) {
      if (!toastContainer) return;

      const toast = document.createElement("div");
      toast.className = "toast " + (tipo || "success");
      toast.textContent = msg;

      toastContainer.appendChild(toast);
      setTimeout(() => toast.classList.add("show"), 10);

      setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    /* ===============================
       VALIDACIÓN
    =============================== */
    function validarFormulario(form) {
      let ok = true;

      Array.prototype.forEach.call(
        form.querySelectorAll("input, select"),
        el => {
          if (!el.required) return;

          if (!el.value || !el.value.trim()) {
            el.classList.add("input-error");
            ok = false;
          } else {
            el.classList.remove("input-error");
          }
        }
      );

      return ok;
    }

    /* ===============================
       ENVÍO A SUPABASE (iOS SAFE)
    =============================== */
    async function enviarFormulario(form, tabla, mensaje) {
      const datos = {};

      Array.prototype.forEach.call(form.elements, el => {
        if (el.name) {
          datos[el.name] = el.value ? el.value.trim() : "";
        }
      });

      console.log("📤 Insertando en", tabla, datos);

      const result = await supabase.from(tabla).insert([datos]);

      if (result.error) {
        console.error("❌ Supabase:", result.error);
        mostrarToast("Error al enviar", "error");
        return;
      }

      mostrarToast(mensaje, "success");
      form.reset();
    }

    /* ===============================
       EVENTOS
    =============================== */
    const comercios = document.getElementById("comercios");
    if (comercios) {
      comercios.addEventListener("submit", e => {
        e.preventDefault();
        validarFormulario(e.target)
          ? enviarFormulario(e.target, "comercios", "Gracias por registrar tu comercio")
          : mostrarToast("Revisá los campos", "error");
      });
    }

    const usuarios = document.getElementById("usuarios");
    if (usuarios) {
      usuarios.addEventListener("submit", e => {
        e.preventDefault();
        validarFormulario(e.target)
          ? enviarFormulario(e.target, "usuarios", "Gracias por tu interés")
          : mostrarToast("Revisá los campos", "error");
      });
    }

  } catch (err) {
    console.error("🔥 Error JS:", err);
    alert("Error en el navegador. Actualizá Safari.");
  }
});