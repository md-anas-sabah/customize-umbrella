document.addEventListener("DOMContentLoaded", function () {
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

  let currentColor = "blue";
  let currentUploadTask = null;

  setTheme(currentColor);
  colorSwatches[0].classList.add("active");

  colorSwatches.forEach((swatch) => {
    swatch.addEventListener("click", function () {
      const color = this.getAttribute("data-color");
      if (color !== currentColor) {
        changeUmbrellaColor(color);
      }
    });
  });

  logoUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        alert("Please upload a .jpg or .png file only.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB.");
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

      reader.readAsDataURL(file);
    }
  });

  cancelButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    cancelUpload();
  });

  function startUploadUI(filename) {
    uploadIcon.style.display = "none";
    uploadLoader.style.display = "block";
    uploadText.textContent = filename;
    cancelButton.style.display = "flex";
  }

  function resetUploadButton() {
    uploadIcon.style.display = "block";
    uploadLoader.style.display = "none";
    uploadText.textContent = "UPLOAD LOGO";
    cancelButton.style.display = "none";
    currentUploadTask = null;
  }

  function cancelUpload() {
    if (currentUploadTask) {
      currentUploadTask.abort();
      currentUploadTask = null;
    }

    logoUpload.value = "";
    resetUploadButton();
  }

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
    }, 500);
  }

  function showLoader() {
    loader.style.display = "flex";
  }

  function hideLoader() {
    loader.style.display = "none";
  }

  function setTheme(color) {
    document.body.className = "";
    document.body.classList.add(`theme-${color}`);
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
});
