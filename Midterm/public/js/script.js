document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.getElementById("hamburger-menu");
  const navMenu = document.getElementById("nav-links");

  hamburger.addEventListener("click", function() {
    if (navMenu.style.display === "block") {
      navMenu.style.display = "none";  // hide if already shown
    } else {
      navMenu.style.display = "block"; // show if hidden
    }
  });
});