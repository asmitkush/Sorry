const photoInput = document.querySelector("#photo-input");
const photoGrid = document.querySelector("#photo-grid");
const musicToggle = document.querySelector(".music-toggle");
const gifCards = document.querySelectorAll(".gif-card");
const gifNote = document.querySelector("#gif-note");
const heartButton = document.querySelector(".heart-button");
const heartStatus = document.querySelector("#heart-status");

if (photoInput && photoGrid) {
  const createPhotoItem = (file, index) => {
    const url = URL.createObjectURL(file);
    const item = document.createElement("figure");
    item.className = "photo-item";
    item.innerHTML = `
      <img src="${url}" alt="Selected memory ${index + 1}" />
      <button class="photo-remove" type="button" aria-label="Remove selected memory ${index + 1}">×</button>
    `;
    item.querySelector(".photo-remove").addEventListener("click", () => {
      URL.revokeObjectURL(url);
      item.remove();
      if (!photoGrid.querySelector(".photo-item")) {
        photoGrid.innerHTML = `
          <div class="empty-photo">
            <span aria-hidden="true">♡</span>
            <p>Your favorite moments can live here.</p>
          </div>
        `;
      }
    });
    return item;
  };

  photoInput.addEventListener("change", (event) => {
    const files = [...event.target.files].filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    photoGrid.innerHTML = "";
    files.slice(0, 9).forEach((file, index) => photoGrid.append(createPhotoItem(file, index)));
    event.target.value = "";
  });
}

musicToggle.addEventListener("click", () => {
  const isActive = musicToggle.classList.toggle("is-active");
  musicToggle.setAttribute("aria-pressed", String(isActive));
  musicToggle.querySelector(".music-label").textContent = isActive ? "soft mode on" : "soft mode";
});

document.querySelectorAll(".gif-frame img").forEach((image) => {
  image.addEventListener("error", () => {
    const fallback = document.createElement("span");
    fallback.className = "gif-fallback";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", image.dataset.fallback);
    fallback.textContent = image.dataset.fallback;
    image.replaceWith(fallback);
  }, { once: true });
});

gifCards.forEach((card) => {
  card.addEventListener("click", () => {
    gifCards.forEach((item) => item.classList.remove("is-selected"));
    card.classList.add("is-selected");
    gifNote.textContent = card.dataset.note;
  });
});

heartButton.addEventListener("click", () => {
  heartStatus.textContent = "A small heart, with no expectations attached.";
  const bounds = heartButton.getBoundingClientRect();
  for (let index = 0; index < 7; index += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = index % 2 ? "♡" : "♥";
    heart.style.left = `${bounds.left + bounds.width / 2 + (Math.random() * 70 - 35)}px`;
    heart.style.top = `${bounds.top - 3}px`;
    heart.style.setProperty("--heart-drift", `${Math.random() * 90 - 45}px`);
    heart.style.animationDelay = `${index * 45}ms`;
    document.body.append(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  }
});
