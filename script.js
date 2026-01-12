/* ================= MENU ================= */
const menuBtn = document.getElementById("menuBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

if (menuBtn && dropdownMenu) {
  menuBtn.onclick = () => {
    dropdownMenu.classList.toggle("show");
  };

  window.addEventListener("click", (e) => {
    if (!e.target.closest(".menu-wrapper")) {
      dropdownMenu.classList.remove("show");
    }
  });
}

/* ================= POST SYSTEM ================= */
const imageInput = document.getElementById("imageInput");
const feed = document.getElementById("feed");
const postBtn = document.getElementById("postBtn");

let selectedFile = null;

imageInput.addEventListener("change", () => {
  selectedFile = imageInput.files[0];
});

postBtn.addEventListener("click", () => {
  if (!selectedFile) {
    imageInput.click();
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const post = document.createElement("div");
    post.className = "post";

    let mediaHTML = selectedFile.type.startsWith("image")
      ? `<img src="${reader.result}">`
      : `<video controls><source src="${reader.result}"></video>`;

    post.innerHTML = `
      ${mediaHTML}
      <div class="post-actions">
        <button>👍 Like</button>
        <button>💬 Comment</button>
        <button>↗ Share</button>
      </div>
    `;

    feed.prepend(post);
    selectedFile = null;
    imageInput.value = "";
  };

  reader.readAsDataURL(selectedFile);
});

/* ================= FB STYLE SCROLL ================= */
const navbar = document.querySelector(".navbar");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastScrollY && currentScrollY > 20) {
    navbar.classList.add("fb-hide");
  } else {
    navbar.classList.remove("fb-hide");
  }

  lastScrollY = currentScrollY;
});
