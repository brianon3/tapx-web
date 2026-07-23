// main.js — TAPX 5.3 iOS SAFE

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

document.addEventListener("DOMContentLoaded", () => {
  try {

    /* ===============================
       SUPABASE INIT
    =============================== */
    const SUPABASE_URL = "https://bwzvyygajbnhvjdadevl.supabase.co/rest/v1/";
    const SUPABASE_ANON_KEY =
      "sb_publishable_sCcqs_4UZciDn7Tiu3quCQ_6nDmNmsD";

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase conectado");

    /* ===============================
       TOASTS (errores / avisos menores)
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
       MODAL DE ÉXITO PRO (animado + autocierre)
    =============================== */
    function mostrarModalExito(mensaje) {
      const REDIRECT_URL = "#"; // ← cambiá esto si querés ir a otra página
      const AUTO_CLOSE_MS = 4000;

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
        background: #111;
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
        <div style="font-size:18px; line-height:1.4; margin-bottom:18px;">
          ${mensaje}
        </div>
        <button style="
          padding: 10px 22px;
          border: none;
          border-radius: 8px;
          background: #22c55e;
          color: #000;
          font-weight: 600;
          cursor: pointer;
        ">Aceptar</button>
      `;

      function cerrarModal() {
        modal.style.transform = "scale(.9)";
        modal.style.opacity = "0";
        overlay.style.opacity = "0";

        setTimeout(() => {
          overlay.remove();
          if (REDIRECT_URL) {
            window.location.href = REDIRECT_URL;
          }
        }, 250);
      }

      // Cerrar con botón
      modal.querySelector("button").addEventListener("click", cerrarModal);

      // Cerrar tocando fuera
      overlay.addEventListener("click", e => {
        if (e.target === overlay) cerrarModal();
      });

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Animación entrada
      requestAnimationFrame(() => {
        overlay.style.opacity = "1";
        modal.style.transform = "scale(1)";
        modal.style.opacity = "1";
      });

      // Auto-cierre
      setTimeout(cerrarModal, AUTO_CLOSE_MS);
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
       ENVÍO A SUPABASE
    =============================== */
    async function enviarFormulario(form, tabla, mensaje) {
      const datos = {};

      Array.prototype.forEach.call(form.elements, el => {
        if (el.name) datos[el.name] = el.value?.trim() || "";
      });

      const result = await supabase.from(tabla).insert([datos]);

      if (result.error) {
        console.error("❌ Supabase:", result.error);
        mostrarToast("Error al enviar", "error");
        return;
      }

      mostrarModalExito(mensaje);
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
            "🎉 Registro completado con éxito.<br>Gracias por sumar tu comercio."
          )
        : mostrarToast("Revisá los campos", "error");
    });

    document.getElementById("usuarios")?.addEventListener("submit", e => {
      e.preventDefault();
      validarFormulario(e.target)
        ? enviarFormulario(
            e.target,
            "usuarios",
            "✅ Registro exitoso.<br>Gracias por tu interés, te contactaremos a la brevedad 😊"
          )
        : mostrarToast("Revisá los campos", "error");
    });

  } catch (err) {
    console.error("🔥 Error JS:", err);
    alert("Error en el navegador. Actualizá Safari.");
  }
});