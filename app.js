document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const umbrellaImg = document.getElementById("umbrella-img");
  const logoUpload = document.getElementById("logo-upload");
  const logoPreview = document.getElementById("logo-preview");
  const colorSwatches = document.querySelectorAll(".color-swatch");
  const uploadBtn = document.getElementById("upload-btn");
  const loader = document.getElementById("loader");

  // Upload button elements
  const uploadIcon = document.querySelector(".upload-icon");
  const uploadLoader = document.querySelector(".upload-loader");
  const uploadText = document.getElementById("upload-text");
  const cancelButton = document.querySelector(".cancel-upload");

  // Current state
  let currentColor = "blue";
  let currentUploadTask = null;

  // Set initial state
  setTheme(currentColor);
  colorSwatches[0].classList.add("active");

  // Color swatch click event
  colorSwatches.forEach((swatch) => {
    swatch.addEventListener("click", function () {
      const color = this.getAttribute("data-color");
      if (color !== currentColor) {
        changeUmbrellaColor(color);
      }
    });
  });

  // Logo upload event
  logoUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];

    // Validate file
    if (file) {
      // Check file type
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        alert("Please upload a .jpg or .png file only.");
        logoUpload.value = "";
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        logoUpload.value = "";
        return;
      }

      // Start upload - show loader and filename
      startUploadUI(file.name);

      // Read and display the file
      const reader = new FileReader();
      currentUploadTask = reader;

      reader.onload = function (e) {
        // Simulate loading delay for demonstration
        setTimeout(() => {
          if (currentUploadTask) {
            logoPreview.src = e.target.result;
            logoPreview.style.display = "block";
            resetUploadButton();
          }
        }, 1500);
      };

      reader.onerror = function () {
        alert("Error reading file. Please try again.");
        resetUploadButton();
      };

      reader.readAsDataURL(file);
    }
  });

  // Cancel button click event
  cancelButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    cancelUpload();
  });

  // Function to start upload UI
  function startUploadUI(filename) {
    uploadIcon.style.display = "none";
    uploadLoader.style.display = "block";
    uploadText.textContent = filename;
    cancelButton.style.display = "flex";
  }

  // Function to reset upload button
  function resetUploadButton() {
    uploadIcon.style.display = "block";
    uploadLoader.style.display = "none";
    uploadText.textContent = "UPLOAD LOGO";
    cancelButton.style.display = "none";
    currentUploadTask = null;
  }

  // Function to cancel upload
  function cancelUpload() {
    if (currentUploadTask) {
      currentUploadTask.abort();
      currentUploadTask = null;
    }

    // Reset file input
    logoUpload.value = "";

    // Reset UI
    resetUploadButton();
  }

  // Function to change umbrella color
  function changeUmbrellaColor(color) {
    // Show loader
    showLoader();

    // Update current color
    currentColor = color;

    // Remove active class from all swatches
    colorSwatches.forEach((swatch) => {
      swatch.classList.remove("active");
      if (swatch.getAttribute("data-color") === color) {
        swatch.classList.add("active");
      }
    });

    // Set theme based on color
    setTheme(color);

    // Change umbrella image
    umbrellaImg.style.opacity = 0;

    setTimeout(() => {
      umbrellaImg.src = `images/${capitalizeFirstLetter(color)}.png`;

      // Once new image is loaded
      umbrellaImg.onload = function () {
        umbrellaImg.style.opacity = 1;
        hideLoader();
      };

      // In case image fails to load
      umbrellaImg.onerror = function () {
        console.error("Failed to load umbrella image");
        umbrellaImg.style.opacity = 1;
        hideLoader();
      };
    }, 500);
  }

  // Function to show loader
  function showLoader() {
    loader.style.display = "flex";
  }

  // Function to hide loader
  function hideLoader() {
    loader.style.display = "none";
  }

  // Function to set theme based on color
  function setTheme(color) {
    document.body.className = "";
    document.body.classList.add(`theme-${color}`);
  }

  // Helper function to capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
