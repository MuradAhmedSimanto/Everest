/* ================= MENU ================= */
const menuBtn = document.getElementById("menuBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

menuBtn.onclick = () => {
  dropdownMenu.classList.toggle("show");
};

window.addEventListener("click", (e) => {
  if (!e.target.closest(".menu-wrapper")) {
    dropdownMenu.classList.remove("show");
  }
});

/* ================= POST SYSTEM ================= */
const postBtn = document.getElementById("postBtn");
const imageInput = document.getElementById("imageInput");
const feed = document.getElementById("feed");

postBtn.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const post = document.createElement("div");
    post.className = "post";

    let mediaHTML = file.type.startsWith("image")
      ? `<img src="${reader.result}">`
      : `<video controls><source src="${reader.result}"></video>`;

    post.innerHTML = `
      ${mediaHTML}

      <div class="post-actions">
        <button onclick="like(this)">
          <i class="fa-regular fa-thumbs-up"></i> Like
        </button>

        <button onclick="toggleComment(this)">
          <i class="fa-regular fa-comment"></i> Comment
        </button>

        <button>
          <i class="fa-solid fa-share"></i> Share
        </button>
      </div>

      <div class="comment-box" style="display:none;">
        <input type="text" placeholder="Write a comment...">
      </div>
    `;

    feed.prepend(post);
    imageInput.value = "";
  };

  reader.readAsDataURL(file);
});

/* ================= LIKE ================= */
function like(btn) {
  btn.innerHTML = '<i class="fa-solid fa-heart"></i> Liked';
}

/* ================= COMMENT TOGGLE ================= */
function toggleComment(btn) {
  const post = btn.closest(".post");
  const box = post.querySelector(".comment-box");
  box.style.display = box.style.display === "block" ? "none" : "block";
}

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
