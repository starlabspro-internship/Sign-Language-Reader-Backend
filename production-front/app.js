// per me kriju

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

