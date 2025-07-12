const { createClient } = window.supabase;

const supabaseUrl = "https://arjabugyjwxauhyiposo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyamFidWd5and4YXVoeWlwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjI1NTcsImV4cCI6MjA2NzU5ODU1N30.5aBi-wGQsUaGCpnUzaaSlpcGPSWv9I9CZ0BVI__Idxk"
const supabase = createClient(supabaseUrl, supabaseKey);

//login
const loginBtn = document.getElementById("loginBtn");
loginBtn?.addEventListener("click", async () => {
    const email = document.getElementById("inEmail");
    const password = document.getElementById("inPassword");
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    });

    if (error) {
        const loginErr = document.getElementById("loginErr");
        loginErr.style.color = "red";
        email.value = "";
        password.value = "";
        console.error("Error logging in:", error);
        if (error.status === 400) {
            loginErr.innerText = "Invalid email or password.";
        } else if (error.status === 401) {
            loginErr.innerText = "Unauthorized: Please verify your email.";
        } else {
            loginErr.innerText = error.message;
        }

        return;
    } else {
        const userId = data.user.id;

        const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("username")
            .eq("id", userId)
            .single();

        if (profileError) {
            console.error(profileError.message);
        } else if (!profile.username) {
            window.location.href = "username.html";
        } else {  
            window.location.href = "index.html";
        }
    }
});

//signup
const signupBtn = document.getElementById("signupBtn");
signupBtn?.addEventListener("click", async () => {
    const email = document.getElementById("outEmail")
    const password = document.getElementById("outPassword");

    const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
            emailRedirectTo: 'https://evanp0.github.io/GrowPedia/confirm.html'
        }
    });

    const signupErr = document.getElementById("signupErr");
    if (signupErr) {
        signupErr.innerText = "";
        signupErr.style.color = "red";
        email.value = ""
        password.value = ""
    }
    if (error) {
        if (error.status === 400) {
            signupErr.innerText = "Invalid email or password.";

        } else if (!data.user || data.user?.identities?.length === 0) {
            signupErr.style.color = "red";
            signupErr.innerText = "This email is already registered";
        }
    } else {
        signupErr.style.color = "green";
        signupErr.innerText = "Signup successful! Check your email to confirm and sign in.";
    }

});



//username
const userBtn = document.getElementById("userBtn");
userBtn?.addEventListener("click", async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error("Error fetching session:", error);
        return;
    }
    const userId = data.session.user.id;
    console.log("User ID:", userId);
    const username = document.getElementById("username").value;
    await supabase
        .from("users")
        .update({ username: username })
        .eq("id", userId)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Update failed:", error);
        });
});

window.addEventListener("DOMContentLoaded", () => {
    const loginBox = document.querySelector(".login-box");
    loginBox.classList.remove("hidden-login-box");
    loginBox.classList.add("visible-login-box");
});
