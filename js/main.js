// main.js — TAPX 5.3 FINAL (SUPABASE V2 MODULE)

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/* ===============================
   SUPABASE INIT
=============================== */
const SUPABASE_URL = "https://ywxpvbkwlblrcyxuxsop.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3eHB2Ymt3bGJscmN5eHV4c29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMjA2MzIsImV4cCI6MjA4Nzc5NjYzMn0.9qbiglW-JrYySXhsA0CTlZkVamF_tC95s5byyVqxSmc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("✅ Supabase conectado", supabase);

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
function validarFormulario(form) {
  let ok = true;

  form.querySelectorAll("input, select").forEach(el => {
    if (!el.required) return;

    if (!el.value.trim()) {
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
async function enviarFormulario(form, tabla, mensaje) {
  const datos = Object.fromEntries(
    [...form.elements]
      .filter(el => el.name)
      .map(el => [el.name, el.value.trim()])
  );

  console.log("📤 Insertando en", tabla, datos);

  const { error } = await supabase.from(tabla).insert([datos]);

  if (error) {
    console.error("❌ Supabase error:", error);
    mostrarToast(error.message, "error");
    return;
  }

  mostrarToast(mensaje, "success");
  form.reset();
}

/* ===============================
   EVENTOS
=============================== */
document.getElementById("comercios")?.addEventListener("submit", e => {
  e.preventDefault();
  if (validarFormulario(e.target)) {
    enviarFormulario(
      e.target,
      "comercios",
      "Gracias por registrar tu comercio"
    );
  } else {
    mostrarToast("Revisá los campos", "error");
  }
});

document.getElementById("usuarios")?.addEventListener("submit", e => {
  e.preventDefault();
  if (validarFormulario(e.target)) {
    enviarFormulario(
      e.target,
      "usuarios",
      "Gracias por tu interés"
    );
  } else {
    mostrarToast("Revisá los campos", "error");
  }
});