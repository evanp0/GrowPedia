const { createClient } = window.supabase;

const supabaseUrl = "https://arjabugyjwxauhyiposo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyamFidWd5and4YXVoeWlwb3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjI1NTcsImV4cCI6MjA2NzU5ODU1N30.5aBi-wGQsUaGCpnUzaaSlpcGPSWv9I9CZ0BVI__Idxk"
const supabase = createClient(supabaseUrl, supabaseKey);

//login
const loginBtn = document.getElementById("loginBtn");
loginBtn?.addEventListener("click", async () => {
    const email = document.getElementById("inEmail").value;
    const password = document.getElementById("inPassword").value;
    const { error, session } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.log(error.message);
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
    const username = document.getElementById("outUsername").value;

    const { error: signUpError, user } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signUpError) {
        console.log(signUpError.message);
    } else {
        window.location.href = "auth.html";
    }
});


//username
const userBtn = document.getElementById("userBtn");
userBtn?.addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const { insertError } = await supabase.from("users").insert([
        {
            username: username,
        },
    ]);

    if (insertError){
        console.log(insertError);
    } else {
        window.location.href = "index.html"
    }
});
