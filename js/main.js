// main.js — TAPX 5.4 iOS SAFE (afinada)

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
       ANALYTICS (SILENCIOSO)
    =============================== */
    function logEvent(event, data = {}) {
      supabase.from("events").insert([{
        event,
        ...data,
        ts: new Date()
      }]).catch(() => {});
    }

    /* ===============================
       MODAL DE ÉXITO PRO
    =============================== */
    function mostrarModalExito(mensaje, tipo = "default") {
      const AUTO_CLOSE_MS = 4000;

      const themes = {
        comercio: { bg: "#0f172a", accent: "#38bdf8", icon: "🎉" },
        usuario: { bg: "#111", accent: "#22c55e", icon: "✅" },
        default: { bg: "#111", accent: "#22c55e", icon: "✔️" }
      };

      const theme = themes[tipo] || themes.default;

      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity .25s ease;
      `;

      const modal = document.createElement("div");
      modal.style.cssText = `
        background: ${theme.bg};
        color: #fff;
        padding: 26px;
        max-width: 420px;
        width: 90%;
        border-radius: 14px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0,0,0,.4);
        transform: scale(.9);
        opacity: 0;
        transition: transform .25s ease, opacity .25s ease;
      `;

      modal.innerHTML = `
        <div style="font-size:32px; margin-bottom:10px; animation: pop .4s ease;">
          ${theme.icon}
        </div>
        <div style="font-size:18px; line-height:1.4; margin-bottom:18px;">
          ${mensaje}
        </div>
        <button style="
          padding: 10px 22px;
          border: none;
          border-radius: 8px;
          background: ${theme.accent};
          color: #000;
          font-weight: 600;
          cursor: pointer;
        ">Aceptar</button>
      `;

      const cerrar = () => {
        modal.style.transform = "scale(.9)";
        modal.style.opacity = "0";
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 250);
      };

      modal.querySelector("button").addEventListener("click", cerrar);
      overlay.addEventListener("click", e => e.target === overlay && cerrar());

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        overlay.style.opacity = "1";
        modal.style.transform = "scale(1)";
        modal.style.opacity = "1";
      });

      setTimeout(cerrar, AUTO_CLOSE_MS);
    }

    /* ===============================
       VALIDACIÓN
    =============================== */
    function validarFormulario(form) {
      let ok = true;
      Array.prototype.forEach.call(form.querySelectorAll("input, select"), el => {
        if (!el.required) return;
        if (!el.value || !el.value.trim()) {
          el.classList.add("input-error");
          ok = false;
        } else {
          el.classList.remove("input-error");
        }
      });
      return ok;
    }

    /* ===============================
       ENVÍO A SUPABASE
    =============================== */
    async function enviarFormulario(form, tabla, mensajes, tipo) {
      const datos = {};
      Array.prototype.forEach.call(form.elements, el => {
        if (el.name) datos[el.name] = el.value?.trim() || "";
      });

      const mensaje =
        mensajes[Math.floor(Math.random() * mensajes.length)];

      const result = await supabase.from(tabla).insert([datos]);

      if (result.error) {
        mostrarToast("Error al enviar", "error");
        logEvent("submit_error", { tipo });
        return;
      }

      logEvent("submit_success", { tipo });
      mostrarModalExito(mensaje, tipo);
      form.reset();
    }

    /* ===============================
       EVENTOS
    =============================== */
    document.getElementById("comercios")?.addEventListener("submit", e => {
      e.preventDefault();
      validarFormulario(e.target)
        ? enviarFormulario(
            e.target,
            "comercios",
            [
              "🎉 Registro completado con éxito.<br>Gracias por sumar tu comercio.",
              "🚀 Comercio registrado correctamente.<br>Te contactaremos pronto."
            ],
            "comercio"
          )
        : mostrarToast("Revisá los campos", "error");
    });

    document.getElementById("usuarios")?.addEventListener("submit", e => {
      e.preventDefault();
      validarFormulario(e.target)
        ? enviarFormulario(
            e.target,
            "usuarios",
            [
              "✅ Registro exitoso.<br>Te contactaremos a la brevedad 😊",
              "💚 Gracias por registrarte.<br>Pronto tendrás novedades."
            ],
            "usuario"
          )
        : mostrarToast("Revisá los campos", "error");
    });

  } catch (err) {
    console.error("🔥 Error JS:", err);
    alert("Error en el navegador. Actualizá Safari.");
  }
});