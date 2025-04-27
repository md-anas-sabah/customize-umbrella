document.addEventListener("DOMContentLoaded", function () {
  // Get all the necessary DOM elements for our umbrella customizer
  const umbrellaImg = document.getElementById("umbrella-img");
  const logoUpload = document.getElementById("logo-upload");
  const logoPreview = document.getElementById("logo-preview");
  const colorSwatches = document.querySelectorAll(".color-swatch");
  const uploadBtn = document.getElementById("upload-btn");
  const loader = document.getElementById("loader");
  const uploadIcon = document.querySelector(".upload-icon");
  const uploadLoader = document.querySelector(".upload-loader");
  const uploadText = document.getElementById("upload-text");
  const cancelButton = document.querySelector(".cancel-upload");

  // Set initial state
  let currentColor = "blue";
  let currentUploadTask = null;

  setTheme(currentColor);
  colorSwatches[0].classList.add("active");

  /**
   * Handles color swatch clicks
   * Changes umbrella color when user clicks on a different color swatch
   */

  colorSwatches.forEach((swatch) => {
    swatch.addEventListener("click", function () {
      const color = this.getAttribute("data-color");
      if (color !== currentColor) {
        changeUmbrellaColor(color);
      }
    });
  });

  /**
   * Handles file upload
   * Validates file type and size, shows upload progress, and displays preview
   */

  logoUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      // Validate file type
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        alert("Please upload a .jpg or .png file only.");
        logoUpload.value = "";
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
        logoUpload.value = "";
        return;
      }
      startUploadUI(file.name);

      const reader = new FileReader();
      currentUploadTask = reader;

      reader.onload = function (e) {
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

  /**
   * Handles upload cancellation
   * Stops current upload and resets UI
   */

  cancelButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    cancelUpload();
  });

  /**
   * Updates upload button UI to show uploading state
   * @param {string} filename - Name of the file being uploaded
   */

  function startUploadUI(filename) {
    uploadIcon.style.display = "none";
    uploadLoader.style.display = "block";
    uploadText.textContent = filename;
    cancelButton.style.display = "flex";
  }

  /**
   * Resets upload button to initial state
   * Shows the upload icon and default text
   */

  function resetUploadButton() {
    uploadIcon.style.display = "block";
    uploadLoader.style.display = "none";
    uploadText.textContent = "UPLOAD LOGO";
    cancelButton.style.display = "none";
    currentUploadTask = null;
  }

  /**
   * Cancels ongoing file upload
   * Aborts FileReader operation and resets UI
   */

  function cancelUpload() {
    if (currentUploadTask) {
      currentUploadTask.abort();
      currentUploadTask = null;
    }

    logoUpload.value = "";

    resetUploadButton();
  }

  /**
   * Changes the umbrella color with a smooth transition
   * Shows loading animation while image loads
   * @param {string} color - The new color to apply
   */

  function changeUmbrellaColor(color) {
    showLoader();

    currentColor = color;

    colorSwatches.forEach((swatch) => {
      swatch.classList.remove("active");
      if (swatch.getAttribute("data-color") === color) {
        swatch.classList.add("active");
      }
    });

    setTheme(color);
    umbrellaImg.style.opacity = 0;

    setTimeout(() => {
      umbrellaImg.src = `images/${capitalizeFirstLetter(color)}.png`;

      umbrellaImg.onload = function () {
        umbrellaImg.style.opacity = 1;
        hideLoader();
      };

      umbrellaImg.onerror = function () {
        console.error("Failed to load umbrella image");
        umbrellaImg.style.opacity = 1;
        hideLoader();
      };
    }, 500);
  }

  /**
   * Shows the loading spinner overlay
   * Used during color transitions to smooth the experience
   */

  function showLoader() {
    loader.style.display = "flex";
  }

  /**
   * Hides the loading spinner overlay
   * Called after color transition is complete
   */

  function hideLoader() {
    loader.style.display = "none";
  }

  function setTheme(color) {
    document.body.className = "";
    document.body.classList.add(`theme-${color}`);
  }

  /**
   * Capitalizes the first letter of a string
   * Used to match image filenames (e.g., "blue" -> "Blue.png")
   * @param {string} string - String to capitalize
   * @returns {string} Capitalized string
   */

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
