// per me kriju

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const useremail = formData.get("useremail");
    const userpassword = formData.get("userpassword");

    try {
        const response = await fetch("https://localhost:5000/api/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ useremail, userpassword }),
            credentials: "include" // ensures cookies are sent with requests
          });       

        if (response.ok) {
            const data = await response.json();
            console.log("Logged in successfully:", data);
            alert("Logged in successfully!");
            event.target.reset();

        } else {
            const errorText = await response.text();
            console.error("Login error:", errorText);
            alert("Login failed. Error: " + errorText);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error occurred.");
    }
});

//Logout
document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
        const response = await fetch("https://localhost:5000/api/users/logout", {
            method: "POST",
            credentials: "include" 
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.msg);
            alert("Logged out successfully!");
        } else {
            const errorText = await response.text();
            console.error("Logout error:", errorText);
            alert("Logout failed. Error: " + errorText);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error occurred.");
    }
});

document.getElementById("signForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch("http://localhost:5000/api/signs", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Sign uploaded successfully:", data);
            alert("Sign uploaded successfully!");
            form.reset();
        } else {
            const errorText = await response.text();
            console.error("Error uploading sign:", errorText);
            alert("Failed to upload sign. Error: " + errorText);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error occurred.");
    }
});

// per translate

document.getElementById("translateButton").addEventListener("click", async () => {
    const input = document.getElementById("translateInput").value;
    const resultsContainer = document.getElementById("translationResults");
    resultsContainer.innerHTML = ''; 

    try {
        const response = await fetch(`http://localhost:5000/api/signs/translate?phrase=${encodeURIComponent(input)}`);
        const data = await response.json();

        data.translation.forEach(item => {
            if (item.image) {
                const img = document.createElement("img");
                img.src = item.image;
                img.alt = item.word;
                img.style.margin = "10px";
                resultsContainer.appendChild(img);
            } else {
                const message = document.createElement("p");
                message.textContent = `${item.word} could not be found for translation.`;
                resultsContainer.appendChild(message);
            }
        });
    } catch (error) {
        console.error("Error fetching translation:", error);
    }
});

document.getElementById("checkLoginStatusButton").addEventListener("click", async () => {
    try {
        const response = await fetch('https://localhost:5000/api/users/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById("loginStatus").textContent = `Logged in as: ${data.userId}`;
            console.log("Login status:", data);
        } else {
            const errorText = await response.text();
            document.getElementById("loginStatus").textContent = "Not logged in.";
            console.error("Error checking login status:", errorText);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error occurred.");
    }
});



