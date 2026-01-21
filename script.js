// ================= CLOUDINARY =================
const CLOUD_NAME = "ddn8et0q4";
const UPLOAD_PRESET = "everest_user";

// ================= FIREBASE INIT =================
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

// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", () => {

  // ================= MENU =================
  const menuBtn = document.getElementById("menuBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");

  menuBtn.onclick = () => dropdownMenu.classList.toggle("show");
  window.addEventListener("click", e => {
    if (!e.target.closest(".menu-wrapper")) {
      dropdownMenu.classList.remove("show");
    }
  });

  // ================= PAGE SWITCH =================
  const homeIcon = document.getElementById("homeIcon");
  const profileIcon = document.getElementById("profileIcon");
  const notificationIcon = document.getElementById("notificationIcon");
  const messageIcon = document.getElementById("messageIcon");

  const homePage = document.getElementById("homePage");
  const profilePage = document.getElementById("profilePage");
  const notificationPage = document.getElementById("notificationPage");
  const messagePage = document.getElementById("messagePage");

  const icons = document.querySelectorAll(".menu-icon");
  const setActive = (i) => {
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
  };

  messageIcon.onclick = () => {
    homePage.style.display = "none";
    profilePage.style.display = "none";
    notificationPage.style.display = "none";
    messagePage.style.display = "block";
  };

  // ================= AUTH =================
 // ===== AUTH ELEMENTS =====
const authModal = document.getElementById("authModal");
const signupBtn = document.getElementById("signupBtn");
const continueBtn = document.getElementById("continueBtn");
const authSubmit = document.getElementById("authSubmit");

const stepOne = document.getElementById("stepOne");
const stepTwo = document.getElementById("stepTwo");

const authMsg = document.getElementById("authMsg");
const signupSuccess = document.getElementById("signupSuccess");

// ===== OPEN SIGNUP MODAL =====
signupBtn.onclick = (e) => {
  e.preventDefault();
  authModal.style.display = "flex";
  stepOne.style.display = "block";
  stepTwo.style.display = "none";
  signupSuccess.style.display = "none";
  authMsg.textContent = "";
};

// ===== STEP 1 → CONTINUE =====
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

// ===== STEP 2 → SIGNUP =====
authSubmit.onclick = () => {
  const contact = document.getElementById("authContact").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;

  if (!password || !confirmPassword) {
    authMsg.textContent = "Enter password";
    return;
  }

  if (password !== confirmPassword) {
    authMsg.textContent = "Passwords do not match";
    return;
  }

  const email = contact.includes("@")
    ? contact
    : contact + "@everest.app";

  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({
        firstName,
        lastName,
        gender,
        dob,
        contact,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      const fullName = firstName + " " + lastName;

      const profileNameEl = document.getElementById("profileName");
      if (profileNameEl) {
        profileNameEl.innerText = fullName;
      }

      signupSuccess.style.display = "block";
      authMsg.textContent = "";

      setTimeout(() => {
        authModal.style.display = "none";
      }, 800);
    })
    .catch(err => {
      authMsg.textContent = err.message;
    });
};

// ===== CLOSE MODAL (OUTSIDE CLICK) =====
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) {
    authModal.style.display = "none";
  }
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    loadProfilePosts();
  }
});


  // close modal only outside
  authModal.addEventListener("click", (e) => {
    if (!e.target.closest(".auth-box")) {
      authModal.style.display = "none";
    }
  });

});

// ================= POSTS =================
function renderPost(p, target) {
  target.insertAdjacentHTML("beforeend", `
    <div class="post">
      <div class="post-header">
        <img src="${p.profilePic || ""}">
        <strong>${p.name || "Everest User"}</strong>
      </div>
      ${p.type === "text" ? `<p>${p.text}</p>` :
        p.type === "image" ? `<img src="${p.media}">` :
        `<video src="${p.media}" controls></video>`}
    </div>
  `);
}

function loadAllPosts() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  db.collection("posts")
    .orderBy("createdAt", "desc")
    .onSnapshot(snap => {
      feed.innerHTML = "";
      snap.forEach(d => renderPost(d.data(), feed));
    });
}

function loadProfilePosts() {
  const user = auth.currentUser;
  if (!user) return;

  const profileFeed = document.getElementById("profileFeed");
  profileFeed.innerHTML = "";

  db.collection("posts")
    .where("uid", "==", user.uid)
    .orderBy("createdAt", "desc")
    .get()
    .then(snap => {
      snap.forEach(d => renderPost(d.data(), profileFeed));
    });
}

window.addEventListener("load", loadAllPosts);


// ================= CLOUDINARY UPLOAD =================
async function uploadToCloudinary(file) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: "POST", body: fd }
  );

  const data = await res.json();
  return data.secure_url;
}

// ================= SAVE POST =================
async function savePost({ type, media = "", text = "" }) {
  const user = auth.currentUser;
  if (!user) {
    alert("Please signup or login to post");
    return;
  }

  const nameEl = document.getElementById("profileName");
  const picEl = document.getElementById("profilePic");

  await db.collection("posts").add({
    uid: user.uid,
    name: nameEl ? nameEl.innerText : "Everest User",
    profilePic: picEl ? picEl.src : "",
    type,
    media,
    text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// ================= IMAGE / VIDEO POST =================
const postBtn = document.getElementById("postBtn");
const imageInput = document.getElementById("imageInput");

if (postBtn && imageInput) {
  postBtn.onclick = () => imageInput.click();

  imageInput.onchange = async () => {
    const file = imageInput.files[0];
    if (!file) return;

    const url = await uploadToCloudinary(file);

    await savePost({
      type: file.type.startsWith("image") ? "image" : "video",
      media: url

    });

    imageInput.value = "";
  };
}

// ================= TEXT POST =================
const mindBox = document.querySelector(".mind");
const textPostModal = document.getElementById("textPostModal");
const textPostInput = document.getElementById("textPostInput");
const textPostBtn = document.getElementById("textPostBtn");

if (mindBox) {
  mindBox.onclick = () => {
    textPostInput.value = "";
    textPostModal.style.display = "flex";
  };
}

if (textPostModal) {
  textPostModal.onclick = (e) => {
    if (e.target === textPostModal) {
      textPostModal.style.display = "none";
    }
  };
}

if (textPostBtn) {
  textPostBtn.onclick = async () => {
    const text = textPostInput.value.trim();
    if (!text) return;

    await savePost({ type: "text", text });
    textPostModal.style.display = "none";
  };
}






