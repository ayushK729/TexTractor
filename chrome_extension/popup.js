document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("drop-area");
    const output = document.getElementById("output");
    const exportBtn = document.getElementById("export-btn");
    const browseBtn = document.getElementById("browse-btn");
    const fileInput = document.getElementById("file-input");

    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.style.borderColor = "#000";
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.style.borderColor = "#ccc";
    });

    dropArea.addEventListener("drop", async (event) => {
        event.preventDefault();
        dropArea.style.borderColor = "#ccc";
        
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            handleImage(file);
        } else {
            alert("Please drop a valid image file.");
        }
    });

    // Browse button functionality
    browseBtn.addEventListener("click", () => {
        fileInput.click(); // Trigger the file input dialog
    });

    // Handle the file input change event
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            handleImage(file);
        } else {
            alert("Please select a valid image file.");
        }
    });

    // Function to handle the image (both drop and browse)
    async function handleImage(file) {
        // Create an image element and display it in the drop area
        const imagePreview = document.createElement("img");
        imagePreview.id = "image-preview";
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = "block";
        imagePreview.style.maxWidth = "100%";
        imagePreview.style.maxHeight = "100%";
        imagePreview.style.objectFit = "contain"; // Ensures the image fits within the drop box
        dropArea.innerHTML = ""; // Clear the text and show image
        dropArea.appendChild(imagePreview);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("http://localhost:5000/ocr", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            output.value = data.text;
        } catch (error) {
            console.error("Error:", error);
            output.value = "Failed to extract text.";
        }
    }

    // Export extracted text to a text file
    exportBtn.addEventListener("click", () => {
        const text = output.value;
        if (text) {
            const blob = new Blob([text], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "extracted-text.txt";
            link.click();
        } else {
            alert("No text to export.");
        }
    });
});
