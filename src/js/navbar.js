document.addEventListener("DOMContentLoaded", function () {
  fetch("partials/navbar.hbs")
    .then((response) => response.text())
    .then((source) => {
      var template = Handlebars.compile(source);
      document.getElementById("navbar-placeholder").innerHTML = template();
    });
});
