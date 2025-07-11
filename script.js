const { createClient } = window.supabase;

const supabaseUrl = "https://arjabugyjwxauhyiposo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyamFidWd5and4YXVoeWlwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjI1NTcsImV4cCI6MjA2NzU5ODU1N30.5aBi-wGQsUaGCpnUzaaSlpcGPSWv9I9CZ0BVI__Idxk"
const supabase = createClient(supabaseUrl, supabaseKey);

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

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Error logging out:", error);
    return;
  }
  window.location.href = "login.html";
});
