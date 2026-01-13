/* ================= MENU ================= */
const menuBtn = document.getElementById("menuBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

menuBtn.onclick = () => {
  dropdownMenu.classList.toggle("show");
};

window.addEventListener("click", e => {
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
   document.documentElement.scrollTo({
  top: 0,
  behavior: "smooth"
});
document.body.scrollTop = 0;
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

/* ================= BIO ================= */
const bioText = document.getElementById("bioText");
const bioInput = document.getElementById("bioInput");
const editBioBtn = document.getElementById("editBioBtn");
const saveBioBtn = document.getElementById("saveBioBtn");

editBioBtn.onclick = () => {
  bioInput.value = bioText.textContent === "Add your bio" ? "" : bioText.textContent;
  bioText.style.display = "none";
  bioInput.style.display = "block";
  editBioBtn.style.display = "none";
  saveBioBtn.style.display = "inline";
};

saveBioBtn.onclick = () => {
  bioText.textContent = bioInput.value || "Add your bio";
  bioText.style.display = "block";
  bioInput.style.display = "none";
  editBioBtn.style.display = "inline";
  saveBioBtn.style.display = "none";
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






/* ================= AUTH MODAL SYSTEM ================= */

// ELEMENTS
const authModal = document.getElementById("authModal");
const authMsg = document.getElementById("authMsg");

const stepOne = document.getElementById("stepOne");
const stepTwo = document.getElementById("stepTwo");

const continueBtn = document.getElementById("continueBtn");
const authSubmit = document.getElementById("authSubmit");
const signupBtn = document.getElementById("signupBtn");

/* ================= OPEN MODAL ================= */
signupBtn.onclick = (e) => {
  e.preventDefault();
  authModal.style.display = "flex";

  // reset
  stepOne.style.display = "block";
  stepTwo.style.display = "none";
  authMsg.textContent = "";
};

/* ================= CLOSE MODAL (OUTSIDE CLICK) ================= */
authModal.onclick = (e) => {
  if (e.target === authModal) {
    authModal.style.display = "none";
  }
};

/* ================= STEP 1 → CONTINUE ================= */
continueBtn.onclick = () => {
  const authContact = document.getElementById("authContact").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;

  if (!authContact || !firstName || !lastName || !gender || !dob) {
    authMsg.textContent = "Please fill all fields";
    return;
  }

  authMsg.textContent = "";
  stepOne.style.display = "none";
  stepTwo.style.display = "block";
};

/* ================= STEP 2 → SIGNUP ================= */
authSubmit.onclick = () => {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password.length < 5 || password.length > 10) {
    authMsg.textContent = "Password must be 5 to 10 characters";
    return;
  }

  if (password !== confirmPassword) {
    authMsg.textContent = "Passwords do not match";
    return;
  }

  const user = {
    contact: document.getElementById("authContact").value,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    gender: document.getElementById("gender").value,
    dob: document.getElementById("dob").value,
    password: password,
    everestId: "EV-" + Date.now()
  };

  localStorage.setItem("everestUser", JSON.stringify(user));

  authMsg.textContent = "";
  authModal.style.display = "none";
};
