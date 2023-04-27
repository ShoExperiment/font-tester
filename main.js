document.addEventListener("DOMContentLoaded", () => {
  const drawerToggleButton = document.querySelector(".drawer-toggle");
  const drawer = document.querySelector(".drawer");

  drawerToggleButton.addEventListener("click", () => {
    drawer.classList.toggle("open");
  });

});
