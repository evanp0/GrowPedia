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
        console.error("Error logging in:", error);
        if (error.status === 400) {
            loginErr.innerText = "Invalid email or password.";
            email.value = "";
            password.value = "";
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
    const email = document.getElementById("outEmail").value;
    const password = document.getElementById("outPassword").value;

    const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        emailRedirectTo: 'https://evanp0.github.io/GrowPedia/auth.html'
    }
});

const signupErr = document.getElementById("signupErr");

if (signupErr) signupErr.innerText = ""; // clear old errors

if (error) {
    signupErr.style.color = "red";
    if (error.message === "User already registered" || error.status === 409) {
        signupErr.innerText = "Email already exists. Try logging in.";
    } else {
        signupErr.innerText = error.message;
    }
} else if (!data.user) {
    // <- Supabase gave no error but also no user
    signupErr.style.color = "red";
    signupErr.innerText = "This email may already be registered. Try logging in.";
} else {
    signupErr.style.color = "green";
    signupErr.innerText = "Signup successful! Please check your email to confirm.";
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
