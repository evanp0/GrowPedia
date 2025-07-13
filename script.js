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

addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("profile.html")) {
    loadProfile();
  }
})

async function getUserProfile() {
  try {
    const { data: userProfile, error } = await supabase.from("users").select('*');


    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }


    if (!userProfile || userProfile.length === 0) {
      console.log("No user profile found.");
      return null;
    }


    console.log("User Profile Data:", userProfile);
    return userProfile;
  } catch (error) {
    console.error("Unexpected error fetching user profile:", error);
    return null;
  }
}

async function getUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    return;
  }

  const user = data.session.user;
  console.log(user)
  return user;
}

async function loadProfile() {
  const user = await getUser();
  const userId = user.id;
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching user info:", fetchError);
  }
  console.log(userData);
  const max = xpMaxForLevel(userData.level)
  const accuracy = userData.profile_info.questions_correct / userData.profile_info.questions_answered || 0;
  console.log(JSON.stringify(userData))
  console.log((userData.profile_info.questions_answered))
  console.log(userData.profile_info.questions_correct)
  document.getElementById("username").textContent = userData.username;
  document.getElementById("user-bio").textContent = userData.profile_info.bio;
  document.getElementById("level").textContent = userData.level;
  document.getElementById("xp").textContent = userData.exp;
  document.getElementById("maxXp").textContent = max;
  document.getElementById("avatar").src = userData.avatar_url
  console.log(userData.avatar_url)
  document.getElementById("xp-bar").style.width = ((userData.exp / max) * 100) + "%"
  document.getElementById("quizzes-taken").textContent = userData.profile_info.quizzes_completed
  document.getElementById("lessons-completed").textContent = userData.profile_info.lessons_completed
  document.getElementById("accuracy").textContent = (accuracy) * 100 + "%"
}

function xpMaxForLevel(level) {
  return Math.floor(100 + 20 * (level - 1) + (level - 1) ** 1.3);
}

const editBtn = document.getElementById("edit-profile-btn");
editBtn?.addEventListener("click", () => {
  const centerBox = document.querySelector(".custom-center-box");
  const overlay = document.getElementById("centerOverlay");
  centerBox.classList.remove("hidden-custom-center-box");
  centerBox.classList.add("visible-custom-center-box");
  overlay.classList.remove("hidden-overlay");
  overlay.classList.add("visible-overlay");
});
const closeBtn = document.getElementById("cancel-edit");
closeBtn?.addEventListener("click", () => {
  console.log("Close button clicked");
  const centerBox = document.querySelector(".custom-center-box");
  const overlay = document.getElementById("centerOverlay");
  centerBox.classList.remove("visible-custom-center-box");
  centerBox.classList.add("hidden-custom-center-box");
  overlay.classList.remove("visible-overlay");
  overlay.classList.add("hidden-overlay");
});

const submitBtn = document.getElementById("submit-btn");
submitBtn?.addEventListener("click", () => {
  const username = document.getElementById("edit-username").value;
  const bio = document.getElementById("edit-bio").value;
  const fileInput = document.getElementById("myFile");
  const file = fileInput.files[0];
  console.log("Submit clicked")
  updateInfo(username, bio, file);
  const centerBox = document.querySelector(".custom-center-box");
  const overlay = document.getElementById("centerOverlay");
  centerBox.classList.remove("visible-custom-center-box");
  centerBox.classList.add("hidden-custom-center-box");
  overlay.classList.remove("visible-overlay");
  overlay.classList.add("hidden-overlay");
});

async function updateInfo(username, bio, file) {
  let imageUrl = null;
  if (file) {
    console.log("Uploading image...");
    imageUrl = await uploadImage(file);
    if (!imageUrl) {
      alert("Error uploading image. Please try again.");
      return;
    } else {
      console.log("Image URL successfuly generated:", imageUrl)
    }
  }

  const updates = {};
  const user = await getUser();
  const userId = user.id;
  if (username) updates.username = username;
  if (bio){
    const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
    if (fetchError){
      console.log("Error fetching userdata:", fetchError)
    }

    const info = userData.profile_info
    console.log(info)
    info.bio = bio
    console.log(info)
    updates.profile_info = info
  }
  if (imageUrl) updates.avatar_url = imageUrl;

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq("id", userId);
    if (error) {
      console.error("Update failed:", error.message);
    }
    await loadProfile();
  }

  async function uploadImage(file) {
    const filePath = `users/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('profileimages').upload(filePath, file);

    if (error) {
      console.log("Error uploading image:", error);
      return null;
    }

    const { data: publicData, error: urlError } = supabase
      .storage
      .from('profileimages')
      .getPublicUrl(filePath);

    if (urlError) {
      console.log("Error retreiving public URL:", urlError);
      return null;
    }

    console.log("Public URL:", publicData.publicUrl);
    return publicData.publicUrl;
  }
}