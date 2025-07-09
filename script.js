const sidebar = document.querySelector("#sidebar");
const toggleBtn = document.querySelector("#toggle-btn");

if (document.documentElement.classList.contains("sidebar-expanded")) {
  sidebar.classList.add("expand");
}

toggleBtn?.addEventListener("click", () => {
  sidebar.classList.toggle("expand");

  const isExpanded = sidebar.classList.contains("expand");
  if (isExpanded) {
    document.documentElement.classList.add("sidebar-expanded");
    localStorage.setItem("sidebarState", "expanded");
  } else {
    document.documentElement.classList.remove("sidebar-expanded");
    localStorage.setItem("sidebarState", "collapsed");
  }
});
