// ================= LOCAL STORAGE KEYS =================
const LS_POSTS = "everest_posts";
const LS_PROFILE_PIC = "everest_profile_pic";
const LS_COVER_PIC = "everest_cover_pic";







// 🔥 FIREBASE INIT (REQUIRED)
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

function createPost({
  type,
  media,
  isProfileUpdate = false,
  updateType = "",
  skipSave = false
}) {
  const feed = document.getElementById("feed");
  const profilePic = document.getElementById("profilePic");
  if (!feed || !profilePic) return;

  const userName =
    localStorage.getItem("everestProfileName") || "Everest User";

  let updateText = "";
  if (isProfileUpdate && updateType === "profile") {
    updateText = "updated profile picture";
  }
  if (isProfileUpdate && updateType === "cover") {
    updateText = "updated cover photo";
  }

  const post = document.createElement("div");
  post.className = "post";

  post.innerHTML = `
    <div class="post-header">
      <div class="post-user-left">
        <img src="${profilePic.src}" class="post-user-pic">
        <div>
          <div class="post-user-name">${userName}</div>
          ${updateText ? `<div class="post-update-text">${updateText}</div>` : ""}
        </div>
      </div>
      <div class="post-menu">⋯</div>
    </div>

    <div class="post-media">
      ${
        type === "image"
          ? `<img src="${media}">`
          : `<video src="${media}" controls></video>`
      }
    </div>

    <div class="post-actions">
      <span>👍 Like</span>
      <span>💬 Comment</span>
      <span>↗️ Share</span>
    </div>
  `;

  feed.prepend(post);

  if (skipSave) return;

  const saved = JSON.parse(localStorage.getItem(LS_POSTS)) || [];
  saved.unshift({
    type,
    media,
    isProfileUpdate,
    updateType,
    time: Date.now()
  });
  localStorage.setItem(LS_POSTS, JSON.stringify(saved));
}


  




/* ================= PROFILE & COVER ================= */
const profileCam = document.getElementById("profileCam");
const coverCam = document.getElementById("coverCam");
const profileInput = document.getElementById("profileInput");
const coverInput = document.getElementById("coverInput");


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
    localStorage.setItem(LS_PROFILE_PIC, r.result);

    createPost({
      type: "image",
      media: r.result,
      isProfileUpdate: true,
      updateType: "profile"
    });
  };
  r.readAsDataURL(file);
};




coverInput.onchange = () => {
  const file = coverInput.files[0];
  if (!file) return;

  const r = new FileReader();
  r.onload = () => {
    coverPic.src = r.result;
    localStorage.setItem(LS_COVER_PIC, r.result);

    createPost({
      type: "image",
      media: r.result,
      isProfileUpdate: true,
      updateType: "cover"
    });
  };
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
/*authSubmit.onclick = () => {
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
};*/


document.getElementById("authSubmit").addEventListener("click", function () {
  const contact = document.getElementById("authContact").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;

  if (!contact || !password || !confirmPassword) {
    alert("All fields required");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  let fakeEmail = contact.includes("@")
    ? contact
    : contact + "@everest.app";

  firebase.auth()
    .createUserWithEmailAndPassword(fakeEmail, password)

    .then((userCredential) => {
      const user = userCredential.user;

      return firebase.firestore()
        .collection("users")
        .doc(user.uid)
        .set({
          contact,
          firstName,
          lastName,
          gender,
          dob,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    })

    .then(() => {
      const fullName = firstName + " " + lastName;

      // save locally
      localStorage.setItem("everestProfileName", fullName);

      // instant UI update
      document.getElementById("profileName").innerText = fullName;

      // page switch fix
      homePage.style.display = "none";
      profilePage.style.display = "block";
      setActive(profileIcon);

      const successMsg = document.getElementById("signupSuccess");
      successMsg.style.display = "block";

      setTimeout(() => {
        document.getElementById("authModal").style.display = "none";
        successMsg.style.display = "none";
      }, 1000);
    })

    .catch((error) => {
      alert(error.message);
    });
});


const profileName = document.getElementById("profileName");
const savedName = localStorage.getItem("everestProfileName");

if (savedName && profileName) {
  profileName.textContent = savedName;
}











window.addEventListener("load", () => {
  const savedProfile = localStorage.getItem(LS_PROFILE_PIC);
  if (savedProfile) {
    profilePic.src = savedProfile;
    profilePicBig.src = savedProfile;
  }

  const savedCover = localStorage.getItem(LS_COVER_PIC);
  if (savedCover) {
    coverPic.src = savedCover;
  }

  const savedPosts = JSON.parse(localStorage.getItem(LS_POSTS)) || [];

  savedPosts.reverse().forEach(p => {
    createPost({
      type: p.type,
      media: p.media,
      isProfileUpdate: p.isProfileUpdate,
      updateType: p.updateType,
      skipSave: true
    });
  });
});








const postBtn = document.getElementById("postBtn");
const imageInput = document.getElementById("imageInput");

postBtn.onclick = () => {
  imageInput.click();
};

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    createPost({
      type: file.type.startsWith("image") ? "image" : "video",
      media: reader.result
    });
  };
  reader.readAsDataURL(file);

  // reset input
  imageInput.value = "";
};
     /*menu bar*/
const menuBar = document.querySelector(".menu-bar");
let lastScroll = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (currentScroll > lastScroll && currentScroll > 80) {
    // scroll down → hide
    menuBar.classList.add("hide");
  } else {
    // scroll up → show
    menuBar.classList.remove("hide");
  }

  lastScroll = currentScroll;
});
