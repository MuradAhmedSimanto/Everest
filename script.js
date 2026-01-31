let MEMORY_POSTS = [];


let MEMORY_PROFILE_NAME = "";

//caption secton
function formatCaption(text) {
  const words = text.split(/\s+/).filter(w => w);

  if (words.length <= 50) {
    return {
      preview: text,
      full: text,
      showReadMore: false
    };
  }

  const preview = words.slice(0, 40).join(" ");

  return {
    preview: preview,
    full: text,
    showReadMore: true
  };
}




let posts = [];




/* ================= MENU ================= */
const menuBtn = document.getElementById("menuBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

menuBtn.onclick = () => dropdownMenu.classList.toggle("show");

window.addEventListener("click", e => {
  if (!e.target.closest(".menu-wrapper")) dropdownMenu.classList.remove("show");
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
const notificationIcon = document.getElementById("notificationIcon");
const messageIcon = document.getElementById("messageIcon");

const homePage = document.getElementById("homePage");
const profilePage = document.getElementById("profilePage");
const notificationPage = document.getElementById("notificationPage");
const messagePage = document.getElementById("messagePage");

homeIcon.onclick = () => {
  homePage.style.display = "block";
  profilePage.style.display = "none";
  notificationPage.style.display = "none";
  messagePage.style.display = "none";
  setActive(homeIcon);
  window.scrollTo(0, 0);
};

profileIcon.onclick = () => {
  homePage.style.display = "none";
  profilePage.style.display = "block";
  notificationPage.style.display = "none";
  messagePage.style.display = "none";
  setActive(profileIcon);



  const profileFeed = document.getElementById("profileFeed");
  
  
  window.scrollTo(0, 0);
};

notificationIcon.onclick = () => {
  homePage.style.display = "none";
  profilePage.style.display = "none";
  messagePage.style.display = "none";
  notificationPage.style.display = "block";
  icons.forEach(i => i.classList.remove("active"));
  window.scrollTo(0, 0);
};

messageIcon.onclick = () => {
  homePage.style.display = "none";
  profilePage.style.display = "none";
  notificationPage.style.display = "none";
  messagePage.style.display = "block";
  icons.forEach(i => i.classList.remove("active"));
  window.scrollTo(0, 0);
};

/* ================= POST SYSTEM ================= */
function createPost({
  postId,
  userId,
  type,
  media,
  caption = "",
  userName,
  userPhoto,
 
  reactions = {},
  isProfileUpdate = false,
  updateType = "",
  skipSave = false,
  target = "both"
}) {

const isOwner = auth.currentUser && auth.currentUser.uid === userId;

  const feed = document.getElementById("feed");
  const profileFeed = document.getElementById("profileFeed");
  const profilePic = document.getElementById("profilePic");


  let updateText = "";
  if (isProfileUpdate && updateType === "profile") updateText = "updated profile picture";
  if (isProfileUpdate && updateType === "cover") updateText = "updated cover photo";

 const postHTML = `
  <div class="post" data-id="${postId}">

    <div class="post-header">
      <div class="post-user-left">
        <img class="post-user-pic" data-uid="${userId}" src="${userPhoto || ""}" />

        <div class="post-user-meta">
          <div class="post-user-name">
            <span class="uname" data-uid="${userId}">${userName || ""}</span>

            <span class="verified-badge"
                  data-verified-uid="${userId}"
                  title="Verified"
                  style="display:none;">
              <svg class="verified-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 1.5l2.8 1.7 3.2-.6 1.7 2.8 2.8 1.7-.6 3.2 1.7 2.8-1.7 2.8.6 3.2-2.8 1.7-1.7 2.8-3.2-.6L12 22.5l-2.8-1.7-3.2.6-1.7-2.8-2.8-1.7.6-3.2L.5 12l1.7-2.8-.6-3.2 2.8-1.7 1.7-2.8 3.2.6L12 1.5z"
                  fill="#ff1f1f"
                />
                <path
                  d="M9.3 12.6l1.9 1.9 4.2-4.3"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="2.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>

          ${updateText ? `<div class="post-update-text">${updateText}</div>` : ""}
        </div>
      </div>

      <div class="post-menu-wrapper">
        <div class="post-menu">⋯</div>

        <div class="post-menu-dropdown">
          ${isOwner ? `
            <div class="pm-item delete">Delete post</div>
            <div class="pm-item edit">Edit post</div>
            <div class="pm-item pin">Pin post</div>
          ` : ``}
          <div class="pm-item download">Download post</div>
        </div>
      </div>
    </div>

    ${caption ? (() => {
      const c = formatCaption(caption);
      return `
        <div class="post-text ${c.showReadMore ? "collapsed" : ""}" data-full="${c.full}">
          ${c.preview}
        </div>
        ${c.showReadMore ? `<span class="read-more">Read more</span>` : ""}
      `;
    })() : ""}

    ${type === "text" ? `
      <div class="post-text">${media}</div>
    ` : `
      <div class="post-media">
        ${type === "image"
          ? `<img src="${media}">`
          : `<video controls playsinline preload="metadata">
               <source src="${media}" type="video/mp4">
             </video>`
        }
      </div>
    `}

    <div class="post-actions">
      <span class="like-btn" data-post="${postId}">
        <span class="like-text">👍 Like</span>

        <div class="reaction-box">
          <span>😆</span>
          <span>😥</span>
          <span>❤️</span>
          <span>💔</span>
          <span>😮</span>
          <span>😡</span>
          <span>🤙</span>
        </div>
      </span>

      <div class="reaction-summary">
        ${Object.values(reactions).join(" ")}
      </div>
    </div>

  </div>
`;


const myReaction = reactions?.[auth.currentUser?.uid];

if (myReaction) {     
  setTimeout(() => {
    const btn = document.querySelector(
      `[data-post="${postId}"] .like-text`
    );
    if (btn) btn.innerText = myReaction;
  }, 0);
}


  if ((target === "both" || target === "home") && feed)
    feed.insertAdjacentHTML("afterbegin", postHTML);

  if ((target === "both" || target === "profile") && profileFeed)
    profileFeed.insertAdjacentHTML("afterbegin", postHTML);
  





}

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

//sub profile
profileInput.onchange = () => {
  const file = profileInput.files[0];
  if (!file || !auth.currentUser) return;

  const r = new FileReader();
  r.onload = () => {
    profilePic.src = r.result;
    profilePicBig.src = r.result;

    // ✅ save to firestore
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        profilePic: r.result
      });

  savePostToFirebase({
  type: "image",
  media: r.result,
  isProfileUpdate: true,
  updateType: "profile"
});


  };

  r.readAsDataURL(file);
};


//sub cover
coverInput.onchange = () => {
  const file = coverInput.files[0];
  if (!file || !auth.currentUser) return;

  const r = new FileReader();
  r.onload = () => {
    coverPic.src = r.result;

    // ✅ save cover
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        coverPic: r.result
      });

savePostToFirebase({
  type: "image",
  media: r.result,
  isProfileUpdate: true,
  updateType: "cover"
});

  };

  r.readAsDataURL(file);
};






/* ================= TEXT POST ================= */
const mindBox = document.querySelector(".mind");
const textPostModal = document.getElementById("textPostModal");
const textPostInput = document.getElementById("textPostInput");
const textPostBtn = document.getElementById("textPostBtn");

const imageInput = document.getElementById("imageInput");

document.getElementById("postBtn").onclick = () => {
  imageInput.click();
};



mindBox.onclick = () => {
  textPostInput.value = "";
  textPostModal.style.display = "flex";
};

textPostModal.onclick = e => {
  if (e.target === textPostModal) textPostModal.style.display = "none";
};

textPostBtn.onclick = () => {
  const text = textPostInput.value.trim();
  if (!text) return;

  //firebase
savePostToFirebase({
  type: "text",
  media: text
});



  textPostModal.style.display = "none";
};
    //auth btn//
const authSubmit = document.getElementById("authSubmit");

/* ================= FIREBASE INIT ================= */
const firebaseConfig = {
  apiKey: "AIzaSyA1R9taxrRnPJw7GzNDJ9vyz0MZelnNLi4",
  authDomain: "everest-c9a99.firebaseapp.com",
  projectId: "everest-c9a99",
  storageBucket: "everest-c9a99.firebasestorage.app",
  messagingSenderId: "978178022660",
  appId: "1:978178022660:web:9c210ca91c07cabb400451"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();






//save cover/profile
auth.onAuthStateChanged(user => {
  if (!user) return;

  db.collection("users").doc(user.uid).get().then(doc => {
    if (!doc.exists) return;

    const data = doc.data();

    const fullName = data.firstName + " " + data.lastName;
    MEMORY_PROFILE_NAME = fullName;

    document.getElementById("profileName").innerText = fullName;

    // profile pic
    if (data.profilePic) {
      profilePic.src = data.profilePic;
      profilePicBig.src = data.profilePic;
    }

    // cover pic
    if (data.coverPic) {
      coverPic.src = data.coverPic;
    }
  });
});


/* ================= AUTH ELEMENTS ================= */
const authModal   = document.getElementById("authModal");
const authMsg     = document.getElementById("authMsg");

const stepOne     = document.getElementById("stepOne");
const stepTwo     = document.getElementById("stepTwo");

const signupBtn   = document.getElementById("signupBtn");
const continueBtn = document.getElementById("continueBtn");
const authSubmitBtn = document.getElementById("authSubmit");

/* ================= OPEN SIGNUP MODAL ================= */
signupBtn.onclick = (e) => {
  e.preventDefault();

  authModal.style.display = "flex";
  stepOne.style.display = "block";
  stepTwo.style.display = "none";

  authMsg.innerText = "";
};

/* ================= CLOSE MODAL ================= */
authModal.onclick = (e) => {
  if (e.target === authModal) {
    authModal.style.display = "none";
  }
};

/* ================= STEP 1 → CONTINUE ================= */
continueBtn.onclick = () => {
  const contact   = document.getElementById("authContact").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName  = document.getElementById("lastName").value.trim();
  const gender    = document.getElementById("gender").value;
  const dob       = document.getElementById("dob").value;

  if (!contact || !firstName || !lastName || !gender || !dob) {
    authMsg.textContent = "Please fill all fields";
    return;
  }

  authMsg.textContent = "";
  stepOne.style.display = "none";
  stepTwo.style.display = "block";
};

/* ================= STEP 2 → SIGNUP ================= */
/* ================= STEP 2 → SIGNUP ================= */
authSubmitBtn.onclick = () => {
  const contact   = document.getElementById("authContact").value.trim();
  const password  = document.getElementById("password").value;
  const confirm   = document.getElementById("confirmPassword").value;
  const firstName = document.getElementById("firstName").value.trim();
  const lastName  = document.getElementById("lastName").value.trim();
  const gender    = document.getElementById("gender").value;
  const dob       = document.getElementById("dob").value;

  if (!password || !confirm) {
    authMsg.textContent = "Password required";
    return;
  }

  if (password !== confirm) {
    authMsg.textContent = "Passwords do not match";
    return;
  }

  const email = contact.includes("@")
    ? contact
    : contact + "@everest.app";

  // ✅ Add loading spinner
  authSubmitBtn.classList.add("loading");
  authSubmitBtn.disabled = true;

  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({
        contact,
        firstName,
        lastName,
        gender,
        dob,
        verified: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      const fullName = firstName + " " + lastName;
      MEMORY_PROFILE_NAME = fullName;
      document.getElementById("profileName").innerText = fullName;

      // simulate 1.5s loading before showing success
      setTimeout(() => {
        authSubmitBtn.classList.remove("loading");
        authSubmitBtn.disabled = false;

        document.getElementById("signupSuccess").style.display = "block";

        setTimeout(() => {
          document.getElementById("signupSuccess").style.display = "none";
        }, 3000);

        // switch page
        homePage.style.display = "none";
        profilePage.style.display = "block";
        notificationPage.style.display = "none";
        messagePage.style.display = "none";
        setActive(profileIcon);

        authModal.style.display = "none";
      }, 1500);
    })
    .catch((err) => {
      authMsg.textContent = err.message;
      console.error(err);
      authSubmitBtn.classList.remove("loading");
      authSubmitBtn.disabled = false;
    });
};

      
   






/* ================= BIO EDIT ================= */
const editBioBtn = document.getElementById("editBioBtn");
const saveBioBtn = document.getElementById("saveBioBtn");
const bioText    = document.getElementById("bioText");
const bioInput   = document.getElementById("bioInput");

editBioBtn.onclick = () => {
  bioInput.value = bioText.innerText;
  bioText.style.display = "none";
  bioInput.style.display = "block";
  saveBioBtn.style.display = "inline-block";
  editBioBtn.style.display = "none";
};

saveBioBtn.onclick = () => {
  const text = bioInput.value.trim();

  const wordCount = text.split(/\s+/).filter(w => w).length;

  if (wordCount > 100) {
    alert("Bio maximum 100 words allowed");
    return;
  }

  bioText.innerText = text;

  bioText.style.display = "block";
  bioInput.style.display = "none";
  saveBioBtn.style.display = "none";
  editBioBtn.style.display = "inline-block";
};


//post delet section
document.addEventListener("click", e => {

if (e.target.closest(".reaction-box")) return;

  // CLOSE MENUS
  document.querySelectorAll(".post-menu-dropdown").forEach(m => {
    if (!m.parentElement.contains(e.target)) {
      m.classList.remove("show");
    }
  });

  // TOGGLE MENU
  if (e.target.classList.contains("post-menu")) {
    e.target.nextElementSibling.classList.toggle("show");
  }

  // DELETE POST
  if (e.target.classList.contains("delete")) {
    const postEl = e.target.closest(".post");
    if (!postEl) return;

    const id = postEl.dataset.id;
 
 db.collection("posts")
  .doc(id)
  .delete();
  }

  // DOWNLOAD
  if (e.target.classList.contains("download")) {
    const media = e.target.closest(".post")?.querySelector("img,video");
    if (!media) return;

    const a = document.createElement("a");
    a.href = media.src;
    a.download = "post";
    a.click();
  }

 
// EDIT POST
if (e.target.classList.contains("edit")) {
  e.stopPropagation(); // 🔥 THIS IS THE KEY

  const postEl = e.target.closest(".post");
  if (!postEl) return;

  const editPostModal = document.getElementById("editPostModal");
  const editPostCaption = document.getElementById("editPostCaption");
  const editPostImage = document.getElementById("editPostImage");
  const editPostVideo = document.getElementById("editPostVideo");

  const postId = postEl.dataset.id;



  db.collection("posts").doc(postId).get().then(snap => {
    if (!snap.exists) return;

    const data = snap.data();
    editPostCaption.value = data.caption || "";

    if (data.type === "image") {
      editPostImage.src = data.media;
      editPostImage.style.display = "block";
      editPostVideo.style.display = "none";
    } else {
      editPostVideo.src = data.media;
      editPostVideo.style.display = "block";
      editPostImage.style.display = "none";
    }

    editPostModal.style.display = "flex";
  });
}
//edit post save cancle
let editingPostId = null;


// SAVE EDIT
document.getElementById("saveEditPostBtn").onclick = async () => {
  if (!editingPostId) return;

  const newCaption =
    document.getElementById("editPostCaption").value.trim();

  try {
    await db.collection("posts")
      .doc(editingPostId)
      .update({
        caption: newCaption
      });

    document.getElementById("editPostModal").style.display = "none";
    editingPostId = null;

  } catch (err) {
    console.error(err);
    alert("Failed to update post");
  }
};

// CANCEL EDIT
document.getElementById("cancelEditPostBtn").onclick = () => {
  document.getElementById("editPostModal").style.display = "none";
  editingPostId = null;
};



  // PIN
  if (e.target.classList.contains("pin")) {
    alert("developer is working");
  }
  });










let selectedMedia = null;
let selectedMediaType = null;

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    selectedMedia = reader.result;
    selectedMediaType = file.type.startsWith("image") ? "image" : "video";

    document.getElementById("mediaCaptionModal").style.display = "flex";

    const img = document.getElementById("mediaPreview");
    const video = document.getElementById("videoPreview");

    if (selectedMediaType === "image") {
      img.src = selectedMedia;
      img.style.display = "block";
      video.style.display = "none";
    } else {
      video.src = selectedMedia;
      video.style.display = "block";
      img.style.display = "none";
    }
  };

  reader.readAsDataURL(file);
  imageInput.value = "";
};


document.getElementById("mediaPostBtn").onclick = () => {
  const caption = document.getElementById("mediaCaptionInput").value.trim();

savePostToFirebase({
  type: selectedMediaType,
  media: selectedMedia,
  caption: caption
});


  document.getElementById("mediaCaptionInput").value = "";
  document.getElementById("mediaCaptionModal").style.display = "none";
};



 




  //firebase
async function savePostToFirebase({
  type,
  media,
  caption = "",
  isProfileUpdate = false,
  updateType = ""
}) {
  if (!auth.currentUser) {
    alert("Post করতে login লাগবে");
    return;
  }

  const uid = auth.currentUser.uid;

  // ✅ ensure username always available
  let userName = (MEMORY_PROFILE_NAME || "").trim();
  let userPhoto = "";

  if (!userName) {
    const snap = await db.collection("users").doc(uid).get();
    if (snap.exists) {
      const d = snap.data();
      userName = [d.firstName, d.lastName].filter(Boolean).join(" ").trim();
      MEMORY_PROFILE_NAME = userName; // cache
    userPhoto = d.profilePic || "";
  }
}
  await db.collection("posts").add({
    userId: uid,
    userName: userName || "User",   // fallback
    userPhoto: userPhoto || "",
    type,
    media,
    caption,
    isProfileUpdate,
    updateType,
    reactions: {},
    createdAt: Date.now()
  });
}




let holdTimer = null;
let activePost = null;

// ================= LONG PRESS DETECTION =================
document.addEventListener("mousedown", startHold);
document.addEventListener("touchstart", startHold);

function startHold(e) {
  const likeBtn = e.target.closest(".like-btn");
  if (!likeBtn) return;

  if (!auth.currentUser) {
    alert("Reaction দিতে login লাগবে");
    return;
  }

  const postEl = likeBtn.closest(".post");
  const box = likeBtn.querySelector(".reaction-box");
  if (!box) return;

  activePost = postEl;

  // 0.5s hold → reaction box open
  holdTimer = setTimeout(() => {
    closeAllReactionBoxes(); // ensure only this box open
    box.style.display = "flex";
  }, 500);
}

// ================= CLICK OR HOLD END =================
document.addEventListener("mouseup", endHold);
document.addEventListener("touchend", endHold);

async function endHold(e) {
  if (!activePost) return;

  const likeBtn = e.target.closest(".like-btn");
  const postEl = activePost;
  const postId = postEl.dataset.id;
  const uid = auth.currentUser?.uid;
  const postRef = db.collection("posts").doc(postId);
  const box = postEl.querySelector(".reaction-box");

  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;

    // Normal click → ❤️ toggle only if box not open
    if (box.style.display !== "flex" && uid) {
      try {
        await db.runTransaction(async transaction => {
          const doc = await transaction.get(postRef);
          if (!doc.exists) return;
          const data = doc.data();
          const reactions = data.reactions || {};

          reactions[uid] = reactions[uid] === "❤️" ? null : "❤️";

          transaction.update(postRef, { reactions });
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  activePost = null;
}

// ================= BOX REACTION SELECT =================
document.addEventListener("click", async e => {
  const emojiEl = e.target.closest(".reaction-box span");
  if (emojiEl) {
    const postEl = emojiEl.closest(".post");
    const postId = postEl.dataset.id;
    const uid = auth.currentUser?.uid;
    const emoji = emojiEl.innerText;
    const postRef = db.collection("posts").doc(postId);

    try {
      await db.runTransaction(async transaction => {
        const doc = await transaction.get(postRef);
        if (!doc.exists) return;

        const data = doc.data();
        const reactions = data.reactions || {};

        reactions[uid] = emoji; // user reaction set

        transaction.update(postRef, { reactions });

        // Close box after selecting reaction
        const box = postEl.querySelector(".reaction-box");
        if (box) box.style.display = "none";
      });
    } catch (err) {
      console.error(err);
    }

    return; // prevent box-close below
  }

  // ================= CLOSE ALL BOXES IF clicked outside =================
  if (!e.target.closest(".like-btn") && !e.target.closest(".reaction-box")) {
    closeAllReactionBoxes();
  }
});

// ================= CLOSE ALL BOXES =================
function closeAllReactionBoxes() {
  document.querySelectorAll(".reaction-box").forEach(box => {
    box.style.display = "none";
  });
}

// ================= LIVE REACTION DISPLAY =================
auth.onAuthStateChanged(user => {
  if (!user) return;

  db.collection("posts")
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      const feed = document.getElementById("feed");
      const profileFeed = document.getElementById("profileFeed");

    if (feed) feed.innerHTML = "";
if (profileFeed) profileFeed.innerHTML = "";


      snapshot.forEach(doc => {
        const p = doc.data();

 

  createPost({
  postId: doc.id,
  userId: p.userId,
  type: p.type,
  media: p.media,
  caption: p.caption,
  userName: p.userName,
  userPhoto: p.userPhoto,
 
  reactions: p.reactions || {},
  isProfileUpdate: p.isProfileUpdate,
  updateType: p.updateType,
  target: "home"
});



        if (p.userId === user.uid) {
         createPost({
  postId: doc.id,
  userId: p.userId,
  type: p.type,
  media: p.media,
  caption: p.caption,
  userName: p.userName,
  userPhoto: p.userPhoto,
 
  reactions: p.reactions || {},
  isProfileUpdate: p.isProfileUpdate,
  updateType: p.updateType,
  target: "profile"
});

        }
      });

hydratePostUserPhoto();
hydratePostUserNames();   // ✅ add this
VERIFIED_CACHE.clear();
hydrateVerifiedBadges();


    });
});



async function hydratePostUserNames() {
  const els = document.querySelectorAll(".uname[data-uid]");

  for (const el of els) {
    if (el.textContent.trim()) continue; // already has name

    const uid = el.dataset.uid;
    const snap = await db.collection("users").doc(uid).get();

    if (snap.exists) {
      const d = snap.data();
      const full = [d.firstName, d.lastName].filter(Boolean).join(" ").trim();
      if (full) el.textContent = full;
    }
  }
}







//user veryfied
const VERIFIED_CACHE = new Map();

async function hydrateVerifiedBadges() {
  const badges = document.querySelectorAll(".verified-badge[data-verified-uid]");

  for (const badge of badges) {
    const uid = badge.dataset.verifiedUid;

    // cache hit
    if (VERIFIED_CACHE.has(uid)) {
      badge.style.display = VERIFIED_CACHE.get(uid) ? "inline-flex" : "none";
      continue;
    }

    // fetch user doc
    const doc = await db.collection("users").doc(uid).get();
    const verified = !!(doc.exists && doc.data().verified);

    VERIFIED_CACHE.set(uid, verified);
    badge.style.display = verified ? "inline-flex" : "none";
  }
}





async function hydrateFirebaseVerifiedBadges() {
  const badges = document.querySelectorAll(".firebase-verified");

  for (const badge of badges) {
    const uid = badge.dataset.verifiedUid;
    const snap = await db.collection("users").doc(uid).get();

    if (snap.exists && snap.data().verified === true) {
      badge.style.display = "inline-flex";
    }
  }
}




async function hydratePostUserPhoto() {
  const imgs = document.querySelectorAll(".post-user-pic[data-uid]");

  for (const img of imgs) {
    if (img.src && !img.src.endsWith("/") && img.getAttribute("src")) continue;

    const uid = img.dataset.uid;
    const snap = await db.collection("users").doc(uid).get();
    if (snap.exists) {
      const d = snap.data();
      if (d.profilePic) img.src = d.profilePic;
    }
  }
}
