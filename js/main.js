document.addEventListener("DOMContentLoaded", () => {

  const formComercios = document.getElementById("comercios");
  const formUsuarios = document.getElementById("usuarios");

  formComercios.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Gracias por registrar tu comercio. Pronto nos contactaremos.");
    formComercios.reset();
  });

  formUsuarios.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Gracias por tu interés. Te avisaremos cuando TapX esté disponible.");
    formUsuarios.reset();
  });

});