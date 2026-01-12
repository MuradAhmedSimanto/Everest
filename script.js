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

/* ================= ACTIVE ICON ================= */
const icons = document.querySelectorAll(".menu-icon");

function setActive(icon) {
  icons.forEach(i => i.classList.remove("active"));
  icon.classList.add("active");
}

/* ================= PAGE SWITCH ================= */
const homeIcon = document.getElementById("homeIcon");
const profileIcon = document.getElementById("profileIcon");
const homePage = document.getElementById("homePage");
const profilePage = document.getElementById("profilePage");

homeIcon.onclick = () => {
  homePage.style.display = "block";
  profilePage.style.display = "none";
  setActive(homeIcon);
};

profileIcon.onclick = () => {
  homePage.style.display = "none";
  profilePage.style.display = "block";
  setActive(profileIcon);
};

/* ================= POST SYSTEM ================= */
const postBtn = document.getElementById("postBtn");
const imageInput = document.getElementById("imageInput");
const feed = document.getElementById("feed");

postBtn.onclick = () => imageInput.click();

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const post = document.createElement("div");
    post.className = "post";

    post.innerHTML = file.type.startsWith("image")
      ? `<img src="${reader.result}">`
      : `<video controls><source src="${reader.result}"></video>`;

    feed.prepend(post);
  };
  reader.readAsDataURL(file);
  imageInput.value = "";
};

/* ================= PROFILE & COVER ================= */
const profileCam = document.getElementById("profileCam");
const coverCam = document.getElementById("coverCam");
const profileInput = document.getElementById("profileInput");
const coverInput = document.getElementById("coverInput");

const profilePic = document.getElementById("profilePic");
const profilePicBig = document.getElementById("profilePicBig");
const coverPic = document.getElementById("coverPic");

profileCam.onclick = () => profileInput.click();
coverCam.onclick = () => coverInput.click();

profileInput.onchange = () => {
  const file = profileInput.files[0];
  if (!file) return;

  const r = new FileReader();
  r.onload = () => {
    profilePic.src = r.result;
    profilePicBig.src = r.result;
  };
  r.readAsDataURL(file);
};

coverInput.onchange = () => {
  const file = coverInput.files[0];
  if (!file) return;

  const r = new FileReader();
  r.onload = () => coverPic.src = r.result;
  r.readAsDataURL(file);
};

/* ================= FB STYLE SCROLL ================= */
const navbar = document.querySelector(".navbar");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  if (window.scrollY > lastScrollY && window.scrollY > 20) {
    navbar.classList.add("fb-hide");
  } else {
    navbar.classList.remove("fb-hide");
  }
  lastScrollY = window.scrollY;
});
