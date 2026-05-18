// File: hamburger-menu.js
document.addEventListener("DOMContentLoaded", function() {
  const hamburger = document.getElementById("hamburger-menu");
  const navMenu = document.getElementById("nav-links");

  hamburger.addEventListener("click", function() {
    navMenu.classList.toggle("active");
  });
});