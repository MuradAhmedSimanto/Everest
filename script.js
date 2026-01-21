// ===== CLOUDINARY CONFIG =====
const CLOUD_NAME = "ddn8et0q4";
const UPLOAD_PRESET = "everest_user";

// ===== FIREBASE INIT =====
const firebaseConfig = {
  apiKey: "AIzaSyA1R9taxrRnPJw7GzNDJ9vyz0MZelnNLi4",
  authDomain: "everest-c9a99.firebaseapp.com",
  projectId: "everest-c9a99",
  storageBucket: "everest-c9a99.firebasestorage.app",
  messagingSenderId: "978178022660",
  appId: "1:978178022660:web:9c210ca91c07cabb400451"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

/* ================= MENU ================= */
const menuBtn = document.getElementById("menuBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

menuBtn.onclick = () => dropdownMenu.classList.toggle("show");
window.addEventListener("click", e => {
  if (!e.target.closest(".menu-wrapper")) dropdownMenu.classList.remove("show");
});

/* ================= PAGE SWITCH ================= */
const homeIcon = document.getElementById("homeIcon");
const profileIcon = document.getElementById("profileIcon");
const notificationIcon = document.getElementById("notificationIcon");
const messageIcon = document.getElementById("messageIcon");

const homePage = document.getElementById("homePage");
const profilePage = document.getElementById("profilePage");
const notificationPage = document.getElementById("notificationPage");
const messagePage = document.getElementById("messagePage");

const icons = document.querySelectorAll(".menu-icon");
const setActive = i => {
  icons.forEach(x => x.classList.remove("active"));
  i.classList.add("active");
};

homeIcon.onclick = () => {
  homePage.style.display = "block";
  profilePage.style.display = "none";
  notificationPage.style.display = "none";
  messagePage.style.display = "none";
  setActive(homeIcon);
};

profileIcon.onclick = () => {
  homePage.style.display = "none";
  profilePage.style.display = "block";
  notificationPage.style.display = "none";
  messagePage.style.display = "none";
  setActive(profileIcon);
  loadProfilePosts();
};

notificationIcon.onclick = () => {
  homePage.style.display = "none";
  profilePage.style.display = "none";
  messagePage.style.display = "none";
  notificationPage.style.display = "block";
  setActive(notificationIcon);
};

messageIcon.onclick = () => {
  homePage.style.display = "none";
  profilePage.style.display = "none";
  notificationPage.style.display = "none";
  messagePage.style.display = "block";
  setActive(messageIcon);
};

/* ================= POST RENDER ================= */
function renderPost(p, target) {
  const html = `
    <div class="post">
      <div class="post-header">
        <img src="${p.profilePic}" class="post-user-pic">
        <div class="post-user-name">${p.name}</div>
      </div>

      ${
        p.type === "text"
          ? `<div class="post-text">${p.text}</div>`
          : p.type === "image"
          ? `<img src="${p.media}">`
          : `<video src="${p.media}" controls></video>`
      }

      <div class="post-actions">
        <span>👍 Like</span>
        <span>💬 Comment</span>
        <span>↗️ Share</span>
      </div>
    </div>
  `;
  target.insertAdjacentHTML("beforeend", html);
}

/* ================= LOAD POSTS ================= */
function loadAllPosts() {
  const feed = document.getElementById("feed");
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .onSnapshot(snap => {
      feed.innerHTML = "";
      snap.forEach(doc => renderPost(doc.data(), feed));
    });
}

function loadProfilePosts() {
  const profileFeed = document.getElementById("profileFeed");
  profileFeed.innerHTML = "";
  const user = auth.currentUser;
  if (!user) return;

  db.collection("posts")
    .where("uid", "==", user.uid)
    .orderBy("createdAt", "desc")
    .get()
    .then(snap => {
      snap.forEach(doc => renderPost(doc.data(), profileFeed));
    });
}

/* ================= CREATE POSTS ================= */
async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);

  const r = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: "POST", body: fd }
  );
  return (await r.json()).secure_url;
}

async function savePost({ type, media = "", text = "" }) {
  const user = auth.currentUser;
  if (!user) return;

  await db.collection("posts").add({
    uid: user.uid,
    name: document.getElementById("profileName").innerText,
    profilePic: document.getElementById("profilePic").src,
    type,
    media,
    text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

/* ================= IMAGE / VIDEO POST ================= */
const postBtn = document.getElementById("postBtn");
const imageInput = document.getElementById("imageInput");

postBtn.onclick = () => imageInput.click();
imageInput.onchange = async () => {
  const file = imageInput.files[0];
  if (!file) return;
  const url = await uploadToCloudinary(file);
  await savePost({
    type: file.type.startsWith("image") ? "image" : "video",
    media: url
  });
};

/* ================= TEXT POST ================= */
const mindBox = document.querySelector(".mind");
const textPostModal = document.getElementById("textPostModal");
const textPostInput = document.getElementById("textPostInput");
const textPostBtn = document.getElementById("textPostBtn");

mindBox.onclick = () => textPostModal.style.display = "flex";
textPostModal.onclick = e => {
  if (e.target === textPostModal) textPostModal.style.display = "none";
};

textPostBtn.onclick = async () => {
  if (!textPostInput.value.trim()) return;
  await savePost({ type: "text", text: textPostInput.value.trim() });
  textPostModal.style.display = "none";
};

/* ================= AUTH ================= */
firebase.auth().onAuthStateChanged(user => {
  if (user) loadAllPosts();
});
