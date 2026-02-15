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




/* ================= LEFT DRAWER MENU ================= */
const menuBtn = document.getElementById("menuBtn");
const leftDrawer = document.getElementById("leftDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const drawerCloseBtn = document.getElementById("drawerCloseBtn");

function openDrawer(){
  if (!leftDrawer || !drawerOverlay) return;

  // header sync (name, pic, badge uid)
  const dn = document.getElementById("drawerName");
  if (dn) dn.textContent = (MEMORY_PROFILE_NAME || "Your Name");

  const av = document.getElementById("drawerAvatar");
  const pp = document.getElementById("profilePicBig")?.src || document.getElementById("profilePic")?.src;
  if (av && pp) av.src = pp;

  const dvb = document.getElementById("drawerVerifiedBadge");
  if (dvb) dvb.dataset.verifiedUid = auth.currentUser?.uid || "";

  // open
  leftDrawer.classList.add("open");
  drawerOverlay.classList.add("open");
  document.body.classList.add("drawer-open");
  leftDrawer.setAttribute("aria-hidden", "false");

  // refresh verified badge display using your existing hydrator
  VERIFIED_CACHE?.clear?.();
  hydrateVerifiedBadges?.();
}

function closeDrawer(){
  if (!leftDrawer || !drawerOverlay) return;
  leftDrawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
  document.body.classList.remove("drawer-open");
  leftDrawer.setAttribute("aria-hidden", "true");
}

menuBtn?.addEventListener("click", (e)=>{
  e.preventDefault();
  e.stopPropagation();
  openDrawer();
});

drawerOverlay?.addEventListener("click", closeDrawer);
drawerCloseBtn?.addEventListener("click", closeDrawer);

document.addEventListener("keydown", (e)=>{
  if (e.key === "Escape") closeDrawer();
});

// drawer এর ভিতরে যে কোন link চাপলে drawer বন্ধ
leftDrawer?.addEventListener("click", (e)=>{
  const a = e.target.closest("a");
  if (!a) return;
  if (a.classList.contains("logo-item")) return;
  closeDrawer();
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

  document.body.classList.remove("profile-mode"); // ✅ add
};

profileIcon.onclick = () => {

  // guest হলে শুধু message দেখাবে, modal খুলবে না
  if (typeof auth === "undefined" || !auth.currentUser) {
    alert("Please signup to view profile");
    return;
  }

  homePage.style.display = "none";
  profilePage.style.display = "block";
  notificationPage.style.display = "none";
  messagePage.style.display = "none";
  setActive(profileIcon);



  const profileFeed = document.getElementById("profileFeed");
  
  
  window.scrollTo(0, 0);

  document.body.classList.add("profile-mode"); // ✅ add
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








/* ================= SETTINGS: CLEAN PAGE MODE ================= */
const settingsBtn = document.getElementById("settingsBtn");
const settingsPage = document.getElementById("settingsPage");
const settingsBackBtn = document.getElementById("settingsBackBtn");

let PREV_PAGE = "home";

function hideAllPages(){
  homePage.style.display = "none";
  profilePage.style.display = "none";
  notificationPage.style.display = "none";
  messagePage.style.display = "none";
  if (settingsPage) settingsPage.style.display = "none";
}

function detectCurrentPage(){
  if (profilePage.style.display === "block") return "profile";
  if (notificationPage.style.display === "block") return "notification";
  if (messagePage.style.display === "block") return "message";
  return "home";
}

function showPrevPage(){
  hideAllPages();
  document.body.classList.remove("settings-open");

  if (PREV_PAGE === "profile") profilePage.style.display = "block";
  else if (PREV_PAGE === "notification") notificationPage.style.display = "block";
  else if (PREV_PAGE === "message") messagePage.style.display = "block";
  else homePage.style.display = "block";

  window.scrollTo(0,0);
}

function openSettings(){
  PREV_PAGE = detectCurrentPage();

  hideAllPages();
  document.body.classList.add("settings-open");
  if (settingsPage) settingsPage.style.display = "block";

  window.scrollTo(0,0);
}

settingsBtn?.addEventListener("click", (e)=>{
  e.preventDefault();
  openSettings();
});

settingsBackBtn?.addEventListener("click", (e)=>{
  e.preventDefault();
  showPrevPage();
});




/* ================= POST SYSTEM ================= */
function createPost({
  postId,
  userId,
  type,
  media,
  caption = "",
  userName,
  userPhoto,
 

  isProfileUpdate = false,
  updateType = "",
  skipSave = false,
  target = "both"
}) {

const isOwner = !!(auth.currentUser && auth.currentUser.uid === userId);



  const feed = document.getElementById("feed");
  const profileFeed = document.getElementById("profileFeed");
  


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
                   d="M12 2l2.09 2.09 2.96-.39 1.2 2.73 2.73 1.2-.39 2.96L22 12l-2.09 2.09.39 2.96-2.73 1.2-1.2 2.73-2.96-.39L12 22l-2.09-2.09-2.96.39-1.2-2.73-2.73-1.2.39-2.96L2 12l2.09-2.09-.39-2.96 2.73-1.2 1.2-2.73 2.96.39L12 2z"
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

<!-- ✅ Reaction summary (UP) -->
<div class="reaction-summary"></div>

<!-- ✅ Actions row (Like / Comment / Share) -->
<div class="post-actions">
  <span class="action-btn like-btn" data-post="${postId}">
    <span class="like-text">👍 Like</span>

    <!-- reaction box stays inside like btn -->
    <div class="reaction-box">
      <span class="rx rx-like"  data-type="like">👍</span>
      <span class="rx rx-love"  data-type="love">❤️</span>
      <span class="rx rx-haha"  data-type="haha">😆</span>
      <span class="rx rx-wow"   data-type="wow">😮</span>
      <span class="rx rx-sad"   data-type="sad">😥</span>
      <span class="rx rx-angry" data-type="angry">😡</span>
    </div>
  </span>

  <span class="action-btn comment-btn" data-post="${postId}">💬 Comment</span>
  <span class="action-btn share-btn" data-post="${postId}">↗️ Share</span>
</div>
 </div>
`;





  if ((target === "both" || target === "home") && feed)
  feed.insertAdjacentHTML("beforeend", postHTML);

if ((target === "both" || target === "profile") && profileFeed)
  profileFeed.insertAdjacentHTML("beforeend", postHTML);

  
setTimeout(() => {
  document
    .querySelectorAll(`.post[data-id="${postId}"]`)
    .forEach(el => attachReactionListener(postId, el));
}, 0);




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

/* ===== GUEST POST BLOCK ===== */
auth.onAuthStateChanged(user => {
  const postBtn = document.getElementById("postBtn");
  const mindBox = document.querySelector(".mind");

  if (!postBtn || !mindBox) return;

  if (!user) {
    postBtn.style.display = "none";
    mindBox.style.pointerEvents = "none";
    mindBox.style.opacity = "0.6";
    mindBox.innerText = "what are you thinking";
  } else {
    postBtn.style.display = "";
    mindBox.style.pointerEvents = "";
    mindBox.style.opacity = "";
  }
});




//save cover/profile
auth.onAuthStateChanged(user => {
  if (!user) return;

  db.collection("users").doc(user.uid).get().then(doc => {
    if (!doc.exists) return;

    const data = doc.data();

    const fullName = data.firstName + " " + data.lastName;
    MEMORY_PROFILE_NAME = fullName;

    document.getElementById("profileName").innerText = fullName;

    // ✅ profile badge uid set + hydrate
const pb = document.getElementById("profileVerifiedBadge");
if (pb) pb.dataset.verifiedUid = user.uid;

VERIFIED_CACHE.clear();
hydrateVerifiedBadges();


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
const authModal = document.getElementById("authModal");
const authMsg   = document.getElementById("authMsg");

const stepOne = document.getElementById("stepOne");
const stepTwo = document.getElementById("stepTwo");
//sinup model back aro//
const step1Arrow = document.getElementById("step1Arrow");
const step2Arrow = document.getElementById("step2Arrow");

function goStep1(){
  stepOne.style.display = "block";
  stepTwo.style.display = "none";
  if (authMsg) authMsg.textContent = "";

  // optional: password clear
  const p1 = document.getElementById("password");
  const p2 = document.getElementById("confirmPassword");
  if (p1) p1.value = "";
  if (p2) p2.value = "";
}

// STEP 1 arrow: close modal + open drawer
step1Arrow?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  goStep1();
  authModal.style.display = "none";

  // drawer open (তোমার already আছে)
  if (typeof openDrawer === "function") openDrawer();
});

// STEP 2 arrow: go back to step 1
step2Arrow?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  goStep1();
});

/* ================= SIGNUP PROMPT ================= */
function promptSignup(message = "Please signup to react") {
  alert(message);

  if (authModal) {
    authModal.style.display = "flex";
    if (stepOne) stepOne.style.display = "block";
    if (stepTwo) stepTwo.style.display = "none";
  }
}

/* ================= GUEST BLOCK: PROFILE CLICK ================= */
/* ⚠️ এটা শুধু একবারই থাকবে */
document.addEventListener("click", (e) => {
  const clickedUser = e.target.closest(
    ".post-user-pic[data-uid], .uname[data-uid]"
  );
  if (!clickedUser) return;

  // guest হলে signup দেখাবে
  if (!auth || !auth.currentUser) {
    promptSignup("Please signup to view profiles");
    return;
  }

  // future: logged-in হলে profile open
  // const uid = clickedUser.dataset.uid;
});


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

      
   //cahnge id name section//
// ===== CHANGE NAME (FULL) =====
const changeNameBtn   = document.getElementById("changeNameBtn");
const changeNameModal = document.getElementById("changeNameModal");
const saveNameBtn     = document.getElementById("saveNameBtn");
const changeNameMsg   = document.getElementById("changeNameMsg");

function openChangeNameModal() {
  if (!auth.currentUser) {
    promptSignup("Please signup/login to change name");
    return;
  }

  // prefll current name
  const current = (MEMORY_PROFILE_NAME || "").trim().split(" ");
  const first = current.slice(0, 1).join(" ");
  const last  = current.slice(1).join(" ");

  document.getElementById("newFirstName").value = first || "";
  document.getElementById("newLastName").value  = last || "";

  if (changeNameMsg) changeNameMsg.textContent = "";
  changeNameModal.style.display = "flex";
}

function closeChangeNameModal() {
  if (!changeNameModal) return;
  changeNameModal.style.display = "none";
}

if (changeNameBtn) {
  changeNameBtn.onclick = (e) => {
    e.preventDefault();
    openChangeNameModal();
  };
}

if (changeNameModal) {
  changeNameModal.onclick = (e) => {
    if (e.target === changeNameModal) closeChangeNameModal();
  };
}

async function saveUserName(firstName, lastName) {
  const uid = auth.currentUser.uid;

  await db.collection("users").doc(uid).update({
    firstName,
    lastName,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  const fullName = (firstName + " " + lastName).trim();
  MEMORY_PROFILE_NAME = fullName;

  // Profile header update
  const pn = document.getElementById("profileName");
  if (pn) pn.textContent = fullName;

  // Also update all rendered post names (fast)
  updateRenderedNamesForUid(uid, fullName);
}

if (saveNameBtn) {
  saveNameBtn.onclick = async () => {
    if (!auth.currentUser) return;

    const fn = (document.getElementById("newFirstName").value || "").trim();
    const ln = (document.getElementById("newLastName").value || "").trim();

    if (!fn || !ln) {
      if (changeNameMsg) changeNameMsg.textContent = "First name এবং Last name দিন";
      return;
    }

    if ((fn + " " + ln).length > 40) {
      if (changeNameMsg) changeNameMsg.textContent = "Name অনেক বড় হয়ে গেছে (max ~40 chars)";
      return;
    }

    saveNameBtn.disabled = true;
    saveNameBtn.classList.add("loading");

    try {
      await saveUserName(fn, ln);
      closeChangeNameModal();
    } catch (err) {
      console.error(err);
      if (changeNameMsg) changeNameMsg.textContent = "Failed to update name";
    } finally {
      saveNameBtn.disabled = false;
      saveNameBtn.classList.remove("loading");
    }
  };
}



// ===== PROFILE SUB DROPDOWN (SIDE) =====
// ===== DROPDOWN PANEL SWITCH =====
const menuProfileEl      = document.getElementById("menuProfile");
const mainMenuPanel      = document.getElementById("mainMenuPanel");
const changeMenuPanel    = document.getElementById("changeMenuPanel");
const closeChangeMenuBtn = document.getElementById("closeChangeMenu");
const changeNameBtnEl    = document.getElementById("changeNameBtn");

function showMainMenu(){
  if (mainMenuPanel) mainMenuPanel.style.display = "block";
  if (changeMenuPanel) changeMenuPanel.style.display = "none";
}

function showChangeMenu(){
  if (mainMenuPanel) mainMenuPanel.style.display = "none";
  if (changeMenuPanel) changeMenuPanel.style.display = "block";
}

function closeAllDropdown(){
  const dropdownMenu =
    document.getElementById("dropdownMenu") || document.querySelector(".dropdown-menu");

  if (dropdownMenu) dropdownMenu.classList.remove("show");
  showMainMenu();
}


// Profile -> open change panel
if (menuProfileEl) {
  menuProfileEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showChangeMenu();
  });
}

// Change name -> open modal + close dropdown
if (changeNameBtnEl) {
  changeNameBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openChangeNameModal();
    closeAllDropdown();
  });
}

// X -> close everything
if (closeChangeMenuBtn) {
  closeChangeMenuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeAllDropdown();
  });
}

// outside click -> close + reset
window.addEventListener("click", (e) => {
  if (!e.target.closest(".menu-wrapper")) {
    closeAllDropdown();
  }
});





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
  promptSignup("Please signup to react");
  return;
}


  const postEl = likeBtn.closest(".post");
  const box = likeBtn.querySelector(".reaction-box");
  if (!box) return;

  activePost = postEl;

  // 0.5s hold → reaction box open
  holdTimer = setTimeout(() => {
    closeAllReactionBoxes(); // ensure only this box open
    box.classList.add("open");

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
    if (!box.classList.contains("open")) {

  if (!auth.currentUser) {
    promptSignup("Please signup to react");
    return;
  }

  try {
    const uid = auth.currentUser.uid;
    const rRef = db.collection("posts").doc(postId).collection("reactions").doc(uid);
    const snap = await rRef.get();

    if (snap.exists && snap.data()?.emoji === "👍") {
      await rRef.delete(); // remove reaction
    } else {
     //show reaction 
let userName = (MEMORY_PROFILE_NAME || "").trim();
let userPhoto = "";

if (!userName || !userPhoto) {
  const us = await db.collection("users").doc(uid).get();
  if (us.exists) {
    const d = us.data();
    userName = userName || [d.firstName, d.lastName].filter(Boolean).join(" ").trim();
    userPhoto = d.profilePic || "";
    MEMORY_PROFILE_NAME = userName || MEMORY_PROFILE_NAME;
  }
}

await rRef.set({
  type: "like",
  emoji: "👍",
  userId: uid,
  userName: userName || "User",
  userPhoto: userPhoto || "",
  createdAt: Date.now()
});


    }
  } catch (err) {
    console.error(err);
  }
}

  }

  activePost = null;
}

// ================= CLICK HANDLER (REACTION + CLOSE) =================
document.addEventListener("click", async (e) => {
  // 1) emoji select
  const emojiEl = e.target.closest(".reaction-box span");
  if (emojiEl) {
    const postEl = emojiEl.closest(".post");
    if (!postEl) return;

    const postId = postEl.dataset.id;
    const emoji = emojiEl.innerText;

    if (!auth.currentUser) {
      promptSignup("Please signup to react");
      return;
    }

    try {
      const uid = auth.currentUser.uid;

      const rRef = db
        .collection("posts")
        .doc(postId)
        .collection("reactions")
        .doc(uid);

      const type = emojiEl.dataset.type; // data-type থেকে আসবে
let userName = (MEMORY_PROFILE_NAME || "").trim();

if (!userName) {
  const us = await db.collection("users").doc(uid).get();
  if (us.exists) {
    const d = us.data();
    userName = [d.firstName, d.lastName].filter(Boolean).join(" ").trim();
    MEMORY_PROFILE_NAME = userName;
  }
}

let userPhoto = "";

const us = await db.collection("users").doc(uid).get();
if (us.exists) {
  const d = us.data();
  userName = userName || [d.firstName, d.lastName].filter(Boolean).join(" ").trim();
  userPhoto = d.profilePic || "";
  MEMORY_PROFILE_NAME = userName || MEMORY_PROFILE_NAME;
}

await rRef.set({
  type,
  emoji: emojiEl.innerText,
  userId: uid,
  userName: userName || "User",
  userPhoto: userPhoto || "",
  createdAt: Date.now()
});



      // close this box
      const box = postEl.querySelector(".reaction-box");
      if (box) box.classList.remove("open");

    } catch (err) {
      console.error(err);
    }

    return; // stop here so it doesn't trigger closeAll below
  }

  // 2) clicked outside → close all boxes
  if (!e.target.closest(".like-btn") && !e.target.closest(".reaction-box")) {
    closeAllReactionBoxes();
  }
});


// ================= CLOSE ALL BOXES =================
function closeAllReactionBoxes() {
  document.querySelectorAll(".reaction-box.open").forEach(box => {
    box.classList.remove("open");
  });
}

// ================= REACTION LISTENER CACHE =================
const REACTION_LISTENER_ATTACHED = new Set();
//reaction count//
const reactionEmoji = {
  like: "👍",
  love: "❤️",
  haha: "😆",
  wow:  "😮",
  sad:  "😥",
  angry:"😡",
};

const reactionLabel = {
  like: "Like",
  love: "Love",
  haha: "Haha",
  wow: "Wow",
  sad: "Sad",
  angry: "Angry"
};

const reactionColor = {
  like:  "#e0245e",
  love:  "#e0245e",
  angry: "#800000",
  haha:  "#f7b125",
  wow:   "#f7b125",
  sad:   "#f7b125",
};


function renderFbReactionSummary(reactions, container){
  if (!container) return;

  if (!reactions.length){
    container.innerHTML = "";
    return;
  }

  // count by type
  const typeCount = {};
  for (const r of reactions){
    const t = r.type || "like";
    typeCount[t] = (typeCount[t] || 0) + 1;
  }

  // top 3 types
  const topTypes = Object.entries(typeCount)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(([t])=>t);

  // first reactor (oldest)
  const first = reactions.slice().sort((a,b)=>a.createdAt - b.createdAt)[0];
  const firstName = first.userName || "User";
  const total = reactions.length;

  const iconsHTML = topTypes
    .map(t => `<span>${reactionEmoji[t] || "👍"}</span>`)
    .join("");

  const text = total > 1 ? `${firstName} +${total-1}` : firstName;

  container.innerHTML = `
    <div class="reaction-icons">${iconsHTML}</div>
    <div class="reaction-text">${text}</div>
  `;
}

function attachReactionListener(postId, postEl) {
  const key = postId + "|" + (postEl.closest("#profileFeed") ? "profile" : "home");
  if (REACTION_LISTENER_ATTACHED.has(key)) return;
  REACTION_LISTENER_ATTACHED.add(key);

  const summaryEl = postEl.querySelector(".reaction-summary");
  const likeTextEl = postEl.querySelector(".like-text");

  db.collection("posts").doc(postId).collection("reactions")
    .onSnapshot((snap) => {
      const reactions = [];
      let myEmoji = null;
      const myUid = auth.currentUser?.uid;

      snap.forEach((d) => {
        const data = d.data() || {};
        reactions.push({
          type: data.type,
          emoji: data.emoji,
          userName: data.userName,
          createdAt: data.createdAt || 0,
        });

        if (myUid && d.id === myUid) myEmoji = data.emoji;
      });

      renderFbReactionSummary(reactions, summaryEl);
    if (likeTextEl) {

  let myType = null;
  const myUid2 = auth.currentUser?.uid;

  // নিজের reaction খুঁজে বের কর
  snap.forEach((d) => {
    if (myUid2 && d.id === myUid2) {
      const data = d.data() || {};
      myType = data.type || "like";
    }
  });

  if (myType) {
    const emoji = reactionEmoji[myType] || "👍";
    likeTextEl.textContent = emoji + " " + (reactionLabel[myType] || "Like");
    likeTextEl.style.color = reactionColor[myType] || "#65676b";
  } else {
    likeTextEl.textContent = "👍 Like";
    likeTextEl.style.color = "#65676b";
  }
}
 });
}


//show reaction//
const reactorsModal = document.getElementById("reactorsModal");
const reactorsList  = document.getElementById("reactorsList");
const reactTabsEl   = document.getElementById("reactTabs");
const reactorsClose = document.getElementById("reactorsClose");

function openReactorsModal(){ reactorsModal?.classList.add("open"); }
function closeReactorsModal(){ reactorsModal?.classList.remove("open"); }

reactorsClose?.addEventListener("click", closeReactorsModal);
reactorsModal?.addEventListener("click", (e) => {
  if (e.target === reactorsModal) closeReactorsModal();
});

const TAB_ORDER = ["all","love","like","haha","wow","sad","angry"];

function tabIcon(type){
  if (type === "all") return "";
  return reactionEmoji[type] || "👍";
}

function buildCounts(list){
  const counts = { all: list.length };
  for (const r of list){
    const t = r.type || "like";
    counts[t] = (counts[t] || 0) + 1;
  }
  return counts;
}

function renderTabs(counts, active){
  if (!reactTabsEl) return;

  const html = TAB_ORDER
    .filter(t => t === "all" ? true : (counts[t] || 0) > 0)
    .map(t => {
      const isActive = t === active ? "active" : "";
      const icon = t === "all" ? "" : `<span class="ticon">${tabIcon(t)}</span>`;
      const label = t === "all" ? "All" : "";
      const num = t === "all" ? counts.all : counts[t];
      return `<div class="react-tab ${isActive}" data-tab="${t}">${icon}${label}${num}</div>`;
    })
    .join("");

  reactTabsEl.innerHTML = html;
}

function renderReactorsList(list, filterType){
  if (!reactorsList) return;

  const filtered = (filterType === "all")
    ? list
    : list.filter(r => (r.type || "like") === filterType);

  if (!filtered.length){
    reactorsList.innerHTML = `<div style="padding:14px;color:#666;">No reactions</div>`;
    return;
  }

  const rows = filtered.map(r => {
    const name = r.userName || "User";
    const pic = r.userPhoto || "";
    const badge = r.emoji || reactionEmoji[r.type] || "👍";

    return `
      <div class="reactor-row">
        <div class="reactor-pic-wrap">
          <img class="reactor-pic"
     src="${pic}"
     onerror="this.onerror=null; this.src='https://i.imgur.com/6VBx3io.png';" />

          <div class="reactor-badge">${badge}</div>
        </div>
        <div class="reactor-name">${name}</div>
      </div>
    `;
  }).join("");

  reactorsList.innerHTML = rows;
}

//reaction show model//
async function showReactorsForPost(postId){
  if (!reactorsList || !reactTabsEl) return;

  // ✅ open immediately (0ms)
  openReactorsModal();

  // ✅ show skeleton (no "Loading..." text)
  reactTabsEl.innerHTML = `
    <div class="react-tab active">All</div>
  `;
  reactorsList.innerHTML = Array.from({ length: 6 }).map(() => `
    <div class="reactor-row" style="opacity:.7;">
      <div class="reactor-pic-wrap">
        <div class="reactor-pic" style="width:40px;height:40px;border-radius:50%;background:#eee;"></div>
        <div class="reactor-badge" style="background:#eee;color:transparent;">🙂</div>
      </div>
      <div class="reactor-name" style="height:12px;width:140px;background:#eee;border-radius:6px;"></div>
    </div>
  `).join("");

  try {
    // 1) reactions list fetch
    const snap = await db.collection("posts").doc(postId)
      .collection("reactions")
      .orderBy("createdAt", "desc")
      .limit(50) // ✅ speed cap
      .get();

    const raw = snap.docs.map(doc => {
      const r = doc.data() || {};
      const uid = r.userId || doc.id;
      return {
        type: r.type || "like",
        emoji: r.emoji || (reactionEmoji[r.type] || "👍"),
        userId: uid,
        userName: r.userName || "User",
        userPhoto: r.userPhoto || "",
        createdAt: r.createdAt || 0
      };
    });

    // 2) find missing users (only those without photo or real name)
    const needUids = Array.from(new Set(
      raw
        .filter(x => !x.userPhoto || x.userName === "User")
        .map(x => x.userId)
    ));

    // ✅ parallel fetch users (fast)
    const userDocs = await Promise.all(
      needUids.map(uid => db.collection("users").doc(uid).get())
    );

    const userMap = new Map();
    userDocs.forEach((us, i) => {
      const uid = needUids[i];
      userMap.set(uid, us.exists ? us.data() : null);
    });

    // 3) merge
    const list = raw.map(x => {
      const ud = userMap.get(x.userId);
      const nameFromUser = ud ? [ud.firstName, ud.lastName].filter(Boolean).join(" ").trim() : "";
      const photoFromUser = ud ? (ud.profilePic || "") : "";

      return {
        ...x,
        userName: (x.userName !== "User" ? x.userName : (nameFromUser || "User")),
        userPhoto: (x.userPhoto || photoFromUser || ""),
      };
    });

    // 4) render real UI
    const counts = buildCounts(list);
    let active = "all";

    renderTabs(counts, active);
    renderReactorsList(list, active);

    reactTabsEl.onclick = (e) => {
      const tab = e.target.closest(".react-tab")?.dataset?.tab;
      if (!tab) return;
      active = tab;

      reactTabsEl.querySelectorAll(".react-tab").forEach(x => x.classList.remove("active"));
      reactTabsEl.querySelector(`.react-tab[data-tab="${tab}"]`)?.classList.add("active");

      renderReactorsList(list, active);
    };

  } catch (err) {
    console.error(err);
    reactTabsEl.innerHTML = "";
    reactorsList.innerHTML = `<div style="padding:14px;color:#c00;">Failed to load</div>`;
  }
}


// ✅ click reaction summary -> open modal
document.addEventListener("click", (e) => {
  const sum = e.target.closest(".reaction-summary");
  if (!sum) return;

  const postEl = sum.closest(".post");
  const postId = postEl?.dataset?.id;
  if (!postId) return;

  showReactorsForPost(postId);
});



// ================= POSTS FEED LISTENER (guest can see) =================
let postsUnsub = null;

auth.onAuthStateChanged((user) => {
  // stop previous listener (prevents duplicates)
  if (typeof postsUnsub === "function") postsUnsub();

  postsUnsub = db.collection("posts")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      const feed = document.getElementById("feed");
      const profileFeed = document.getElementById("profileFeed");

      if (feed) feed.innerHTML = "";
      if (profileFeed) profileFeed.innerHTML = "";

      snapshot.forEach((doc) => {
        const p = doc.data();

        // HOME: সবাই দেখবে
        createPost({
          postId: doc.id,
          userId: p.userId,
          type: p.type,
          media: p.media,
          caption: p.caption,
          userName: p.userName,
          userPhoto: p.userPhoto,
          isProfileUpdate: p.isProfileUpdate,
          updateType: p.updateType,
          target: "home"
        });

        // PROFILE: শুধু logged-in user তার নিজের পোস্ট দেখবে
        if (user && p.userId === user.uid) {
          createPost({
            postId: doc.id,
            userId: p.userId,
            type: p.type,
            media: p.media,
            caption: p.caption,
            userName: p.userName,
            userPhoto: p.userPhoto,
            isProfileUpdate: p.isProfileUpdate,
            updateType: p.updateType,
            target: "profile"
          });
        }
      });

      hydratePostUserPhoto();
      hydratePostUserNames();
      VERIFIED_CACHE.clear();
      hydrateVerifiedBadges();
    }, (err) => {
      console.error("posts listener error:", err);
    });
});



// ===== USER NAME CACHE (FAST) =====
const USER_NAME_CACHE = new Map(); // uid -> fullName

function updateRenderedNamesForUid(uid, fullName) {
  document.querySelectorAll(`.uname[data-uid="${uid}"]`).forEach(el => {
    el.textContent = fullName;
  });
}

async function getUserFullName(uid) {
  if (USER_NAME_CACHE.has(uid)) return USER_NAME_CACHE.get(uid);

  const snap = await db.collection("users").doc(uid).get();
  let full = "User";

  if (snap.exists) {
    const d = snap.data() || {};
    full = [d.firstName, d.lastName].filter(Boolean).join(" ").trim() || "User";
  }

  USER_NAME_CACHE.set(uid, full);
  return full;
}

async function hydratePostUserNames() {
  const els = document.querySelectorAll(".uname[data-uid]");
  const uids = Array.from(new Set(Array.from(els).map(el => el.dataset.uid)));

  // fetch each uid once, then paint all elements
  await Promise.all(uids.map(async (uid) => {
    const full = await getUserFullName(uid);
    updateRenderedNamesForUid(uid, full);
  }));
}



//veryfi badge//
// ===== VERIFIED BADGE (FAST + GUEST FRIENDLY) =====
const VERIFIED_CACHE = new Map(); // uid -> true/false

async function hydrateVerifiedBadges() {
  const badges = Array.from(document.querySelectorAll(".verified-badge[data-verified-uid]"));
  if (!badges.length) return;

  const uids = Array.from(new Set(
    badges.map(b => (b.dataset.verifiedUid || "").trim()).filter(Boolean)
  ));

  const need = uids.filter(uid => !VERIFIED_CACHE.has(uid));

  if (need.length) {
    const docs = await Promise.all(
      need.map(uid => db.collection("users").doc(uid).get().catch(() => null))
    );

    docs.forEach((snap, i) => {
      const uid = need[i];
      const verified = !!(snap && snap.exists && snap.data()?.verified === true);
      VERIFIED_CACHE.set(uid, verified);
    });
  }

  for (const b of badges) {
    const uid = (b.dataset.verifiedUid || "").trim();
    b.style.display = (uid && VERIFIED_CACHE.get(uid) === true) ? "inline-flex" : "none";
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



// ================= LOGIN OPTION (REPLACE FULL) =================

// ===== LOGIN MODAL OPEN/CLOSE =====
const loginMenuBtn = document.getElementById("loginMenuBtn");
const loginModal   = document.getElementById("loginModal");

const loginBtn     = document.getElementById("loginBtn");
const loginMsg     = document.getElementById("loginMsg");
const loginSuccess = document.getElementById("loginSuccess");

function normalizeContact(raw) {
  let c = (raw || "").trim();

  // remove spaces/dashes
  c = c.replace(/[\s-]/g, "");

  // +88017... -> 017...
  if (c.startsWith("+880")) c = "0" + c.slice(4);

  // 88017... -> 017...
  if (c.startsWith("880")) c = "0" + c.slice(3);

  return c;
}

function toAuthEmail(contact) {
  const c = normalizeContact(contact);
  return c.includes("@") ? c : (c + "@everest.app");
}

function setLoginLoading(isLoading) {
  if (!loginBtn) return;
  loginBtn.disabled = isLoading;
  loginBtn.classList.toggle("loading", isLoading);
  loginBtn.textContent = isLoading ? "Logging in..." : "Login";
}


// MODAL BACK (works for any modal)
function bindBack(btnId, modalId){
  const btn = document.getElementById(btnId);
  const modal = document.getElementById(modalId);
  if (!btn || !modal) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    modal.style.display = "none";
  }, true); // ✅ capture phase, তাই stopPropagation থাকলেও কাজ করবে
}

bindBack("loginBackBtn", "loginModal");
bindBack("changeNameBackBtn", "changeNameModal");


if (loginMenuBtn) {
  loginMenuBtn.onclick = (e) => {
    e.preventDefault();
    if (!loginModal) return;

    loginModal.style.display = "flex";
    if (loginMsg) loginMsg.textContent = "";
    if (loginSuccess) loginSuccess.style.display = "none";

    // optional: clear input
    const c = document.getElementById("loginContact");
    const p = document.getElementById("loginPassword");
    if (c) c.value = "";
    if (p) p.value = "";
  };
}

if (loginModal) {
  loginModal.onclick = (e) => {
    if (e.target === loginModal) loginModal.style.display = "none";
  };
}

if (loginBtn) {
  loginBtn.onclick = async () => {
    const rawContact = document.getElementById("loginContact")?.value || "";
    const pass = (document.getElementById("loginPassword")?.value || "").trim();

    if (loginMsg) loginMsg.textContent = "";
    if (loginSuccess) loginSuccess.style.display = "none";

    if (!rawContact.trim() || !pass) {
      if (loginMsg) loginMsg.textContent = "Email/Phone এবং Password দিন";
      return;
    }




    const email = toAuthEmail(rawContact);

    setLoginLoading(true);

    try {
      await auth.signInWithEmailAndPassword(email, pass);

      if (loginSuccess) loginSuccess.style.display = "block";

setTimeout(() => {
  if (loginSuccess) loginSuccess.style.display = "none";
  if (loginModal) loginModal.style.display = "none";

  // 🔥 IMPORTANT FIX
  document.body.classList.remove("nav-hidden");
  document.querySelector(".navbar")?.classList.remove("fb-hide");
  window.scrollTo(0, 0);

  // profile page show
  homePage.style.display = "none";
  profilePage.style.display = "block";
  notificationPage.style.display = "none";
  messagePage.style.display = "none";
  setActive(profileIcon);

}, 700);


    } catch (err) {
      // Firebase মাঝে মাঝে INVALID_LOGIN_CREDENTIALS দেয়
      const code = err?.code || "";
      let msg = "Login failed. Email/Phone বা Password ভুল (অথবা account নেই)";

      if (code === "auth/user-not-found") msg = "এই account পাওয়া যায়নি";
      else if (code === "auth/wrong-password") msg = "Password ভুল";
      else if (code === "auth/invalid-email") msg = "Email/Phone ঠিক নেই";
      else if (code === "auth/too-many-requests") msg = "অনেকবার চেষ্টা হয়েছে, একটু পরে আবার চেষ্টা করো";

      if (loginMsg) loginMsg.textContent = msg;
      console.error("LOGIN ERROR:", err);

    } finally {
      setLoginLoading(false);
    }
  };
}

//scrol 
// ===== Scroll DOWN: hide navbar + lift menu-bar | Scroll UP: show navbar =====
(() => {
  const navbar = document.querySelector(".navbar");
  const body = document.body;
  if (!navbar) return;

  let lastY = window.scrollY;
  let ticking = false;

  const THRESHOLD = 8;   // small movement ignore
  const MIN_Y = 20;      // top এ থাকলে hide না

  function update() {
    const y = window.scrollY;
    const delta = y - lastY;

    // top area: keep normal
    if (y <= MIN_Y) {
      navbar.classList.remove("fb-hide");
      body.classList.remove("nav-hidden");
      lastY = y;
      ticking = false;
      return;
    }

    if (Math.abs(delta) < THRESHOLD) {
      ticking = false;
      return;
    }

    if (delta > 0) {
      // ✅ scroll DOWN -> hide navbar, menu-bar goes top
      navbar.classList.add("fb-hide");
      body.classList.add("nav-hidden");
    } else {
      // ✅ scroll UP -> show navbar, menu-bar goes back down
      navbar.classList.remove("fb-hide");
      body.classList.remove("nav-hidden");
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
})();





//post model of//
// ===== CLOSE MODALS ON OUTSIDE CLICK =====
function closeModal(modal) {
  if (!modal) return;
  modal.style.display = "none";
}

function wireOutsideClose(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // outside (overlay) click -> close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });

  // inside box click -> don't close
  const box = modal.querySelector(".auth-box, .create-post-box");
  if (box) {
    box.addEventListener("click", (e) => e.stopPropagation());
  }
}

wireOutsideClose("textPostModal");
wireOutsideClose("mediaCaptionModal");
wireOutsideClose("editPostModal");
wireOutsideClose("authModal");
wireOutsideClose("loginModal");

// Esc চাপলে close (optional)
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  ["textPostModal","mediaCaptionModal","editPostModal","authModal","loginModal"].forEach(id=>{
    closeModal(document.getElementById(id));
  });
});


//coment section//
// ===== COMMENTS MODAL SYSTEM (FULL) =====
const commentsModal = document.getElementById("commentsModal");
const cmodalClose   = document.getElementById("cmodalClose");
const cmodalList    = document.getElementById("cmodalList");
const cmodalInput   = document.getElementById("cmodalInput");
const cmodalSend    = document.getElementById("cmodalSend");



const confirmModal  = document.getElementById("confirmModal");
const confirmTextEl = document.getElementById("confirmText");
const confirmOkBtn  = document.getElementById("confirmOk");
const confirmCancelBtn = document.getElementById("confirmCancel");

function confirmBox(message){
  return new Promise((resolve) => {
    if (!confirmModal) return resolve(false);

    confirmTextEl.textContent = message;
    confirmModal.classList.add("open");

    const cleanup = () => {
      confirmModal.classList.remove("open");
      confirmOkBtn.onclick = null;
      confirmCancelBtn.onclick = null;
      confirmModal.onclick = null;
    };

    confirmOkBtn.onclick = () => { cleanup(); resolve(true); };
    confirmCancelBtn.onclick = () => { cleanup(); resolve(false); };

    confirmModal.onclick = (e) => {
      if (e.target === confirmModal) { cleanup(); resolve(false); }
    };
  });
}





let ACTIVE_POST_ID = null;
let COMMENTS_UNSUB = null;
const REPLY_UNSUBS = new Map(); // commentId -> unsub

function openCommentsModal(postId){
  ACTIVE_POST_ID = postId;
  commentsModal.classList.add("open");
  cmodalList.innerHTML = "";
  cmodalInput.value = "";

  // stop old listener
  if (COMMENTS_UNSUB) COMMENTS_UNSUB();
  REPLY_UNSUBS.forEach(un => un && un());
  REPLY_UNSUBS.clear();

  COMMENTS_UNSUB = db.collection("posts").doc(postId)
    .collection("comments")
    .orderBy("createdAt", "asc")
    .limit(50)
    .onSnapshot((snap)=>{
     
const myUid = auth.currentUser?.uid || "";

// ✅ যদি কোনো comment না থাকে
if (snap.empty) {
  cmodalList.innerHTML = `
    <div class="no-comments">No comments</div>
  `;
  return;
}

// ✅ comment থাকলে আগের লেখা মুছে নতুন render হবে
cmodalList.innerHTML = "";


      snap.forEach((d)=>{
        const c = d.data() || {};
        const cid = d.id;

        const isOwner = myUid && c.userId === myUid;
        const likeCount = c.likeCount || 0;
        const liked = !!(c.likedBy && myUid && c.likedBy[myUid]);

        const row = document.createElement("div");
        row.className = "crow";
        row.dataset.cid = cid;

        row.innerHTML = `
          <img class="cpic" src="${c.userPhoto || "https://i.imgur.com/6VBx3io.png"}"
           onerror="this.onerror=null; this.src='https://i.imgur.com/6VBx3io.png';"/>

          <div class="cbody">
            <div class="cbubble">
              <div class="cname">${c.userName || "User"}</div>
              <div class="ctext">${(c.text || "").replace(/[<>]/g,"")}</div>
            </div>

            <div class="cactions">
              <span class="cact c-like ${liked ? "active":""}" data-act="like">
                Like ${likeCount ? `(${likeCount})` : ""}
              </span>
              <span class="cact c-reply" data-act="reply">Reply</span>
              ${isOwner ? `
                <span class="cact c-edit" data-act="edit">Edit</span>
                <span class="cact c-del" data-act="del">Delete</span>
              ` : ``}
            </div>

            <div class="replybox">
              <input type="text" placeholder="Write a reply..." />
              <button data-act="replysend">Send</button>
            </div>

            <div class="editbox" style="display:none; gap:8px; margin-top:8px;">
              <input class="edit-input" type="text" />
              <button data-act="editsave">Save</button>
              <button data-act="editcancel">Cancel</button>
            </div>

            <div class="replies"></div>
          </div>
        `;

        cmodalList.appendChild(row);

        // replies realtime (limit 20)
        const ref = db.collection("posts").doc(postId)
          .collection("comments").doc(cid)
          .collection("replies")
          .orderBy("createdAt","asc")
          .limit(20);

        const oldUn = REPLY_UNSUBS.get(cid);
        if (oldUn) oldUn();

        const unsub = ref.onSnapshot((rsnap)=>{
          const repliesBox = row.querySelector(".replies");
          if (!repliesBox) return;
          repliesBox.innerHTML = "";

          rsnap.forEach(rdoc=>{
            const r = rdoc.data() || {};
            const isReplyOwner = myUid && r.userId === myUid;

            const div = document.createElement("div");
            div.className = "rrow";
            div.dataset.rid = rdoc.id;

            div.innerHTML = `
              <div style="display:flex; gap:10px; margin-top:10px;">
                <img class="cpic" style="width:30px;height:30px;"
                  src="${r.userPhoto || "https://i.imgur.com/6VBx3io.png"}"
                  onerror="this.onerror=null; this.src='https://i.imgur.com/6VBx3io.png';" />
                <div style="flex:1;">
                  <div class="cbubble">
                    <div class="cname">${r.userName || "User"}</div>
                    <div class="ctext">${(r.text || "").replace(/[<>]/g,"")}</div>
                  </div>
                  ${isReplyOwner ? `
                    <div class="cactions">
                      <span class="cact" data-act="rdel">Delete</span>
                    </div>
                  ` : ``}
                </div>
              </div>
            `;

            repliesBox.appendChild(div);
          });
        });

        REPLY_UNSUBS.set(cid, unsub);
      });

      // bottom
      cmodalList.scrollTop = cmodalList.scrollHeight;
    });
}

function closeCommentsModal(){
  commentsModal.classList.remove("open");
  ACTIVE_POST_ID = null;

  if (COMMENTS_UNSUB) COMMENTS_UNSUB();
  COMMENTS_UNSUB = null;

  REPLY_UNSUBS.forEach(un => un && un());
  REPLY_UNSUBS.clear();
}

cmodalClose?.addEventListener("click", closeCommentsModal);
commentsModal?.addEventListener("click",(e)=>{
  if (e.target === commentsModal) closeCommentsModal();
});

function ensureLoggedInForComment() {
  if (!auth.currentUser) {
    promptSignup("Please signup to comment");
    return false;
  }
  return true;
}

async function getMyUserMeta(){
  const uid = auth.currentUser.uid;

  let userName = (MEMORY_PROFILE_NAME || "").trim();
  let userPhoto = "";

  const us = await db.collection("users").doc(uid).get();
  if (us.exists){
    const d = us.data() || {};
    userName = userName || [d.firstName, d.lastName].filter(Boolean).join(" ").trim();
    userPhoto = d.profilePic || "";
    MEMORY_PROFILE_NAME = userName || MEMORY_PROFILE_NAME;
  }

  return {
    uid,
    userName: userName || "User",
    userPhoto: userPhoto || ""
  };
}

// add comment
async function addCommentToPost(postId, text){
  if (!ensureLoggedInForComment()) return;

  const me = await getMyUserMeta();

  await db.collection("posts").doc(postId)
    .collection("comments")
    .add({
      userId: me.uid,
      userName: me.userName,
      userPhoto: me.userPhoto,
      text: text.trim(),
      createdAt: Date.now(),
      likeCount: 0,
      likedBy: {}
    });
}

// FIX: Post button
cmodalSend.onclick = async ()=>{
  if (!ACTIVE_POST_ID) return;
  const t = (cmodalInput.value || "").trim();
  if (!t) return;
  await addCommentToPost(ACTIVE_POST_ID, t);
  cmodalInput.value = "";
};

cmodalInput.onkeydown = async (e)=>{
  if (e.key === "Enter"){
    e.preventDefault();
    cmodalSend.click();
  }
};

// open modal on comment btn click
document.addEventListener("click", (e)=>{
  const cb = e.target.closest(".comment-btn");
  if (!cb) return;
  openCommentsModal(cb.dataset.post);
});

// actions inside modal
document.addEventListener("click", async (e)=>{
  if (!commentsModal.classList.contains("open")) return;

  const btn = e.target.closest("[data-act]");
  if (!btn) return;

  const act = btn.dataset.act;
  const row = e.target.closest(".crow");
  const cid = row?.dataset?.cid;
  if (!ACTIVE_POST_ID || !cid) return;

  const cRef = db.collection("posts").doc(ACTIVE_POST_ID).collection("comments").doc(cid);

  // LIKE comment (anyone can like)
  if (act === "like"){
    if (!ensureLoggedInForComment()) return;
    const uid = auth.currentUser.uid;

    await db.runTransaction(async (tx)=>{
      const snap = await tx.get(cRef);
      const d = snap.data() || {};
      const likedBy = d.likedBy || {};
      let likeCount = d.likeCount || 0;

      if (likedBy[uid]) {
        delete likedBy[uid];
        likeCount = Math.max(0, likeCount - 1);
      } else {
        likedBy[uid] = true;
        likeCount = likeCount + 1;
      }

      tx.update(cRef, { likedBy, likeCount });
    });

    return;
  }

  // REPLY toggle
  if (act === "reply"){
    if (!ensureLoggedInForComment()) return;
    row.querySelector(".replybox")?.classList.toggle("open");
    row.querySelector(".replybox input")?.focus();
    return;
  }

  // SEND reply (anyone can reply)
  if (act === "replysend"){
    if (!ensureLoggedInForComment()) return;

    const input = row.querySelector(".replybox input");
    const text = (input?.value || "").trim();
    if (!text) return;

    const me = await getMyUserMeta();

    await cRef.collection("replies").add({
      userId: me.uid,
      userName: me.userName,
      userPhoto: me.userPhoto,
      text,
      createdAt: Date.now()
    });

    input.value = "";
    row.querySelector(".replybox")?.classList.remove("open");
    return;
  }

  // EDIT comment (only owner UI দেখায়, কিন্তু আবারও check)
  if (act === "edit"){
    if (!ensureLoggedInForComment()) return;
    const snap = await cRef.get();
    const d = snap.data() || {};
    if (d.userId !== auth.currentUser.uid) return;

    const editBox = row.querySelector(".editbox");
    const editInput = row.querySelector(".edit-input");
    if (!editBox || !editInput) return;

    editInput.value = d.text || "";
    editBox.style.display = "flex";
    editInput.focus();
    return;
  }

  if (act === "editsave"){
    if (!ensureLoggedInForComment()) return;
    const snap = await cRef.get();
    const d = snap.data() || {};
    if (d.userId !== auth.currentUser.uid) return;

    const editInput = row.querySelector(".edit-input");
    const newText = (editInput?.value || "").trim();
    if (!newText) return;

    await cRef.update({ text: newText });
    row.querySelector(".editbox").style.display = "none";
    return;
  }

  if (act === "editcancel"){
    row.querySelector(".editbox").style.display = "none";
    return;
  }

  // DELETE comment (only owner)
 if (act === "del"){
  if (!ensureLoggedInForComment()) return;

  const snap = await cRef.get();
  const d = snap.data() || {};
  if (d.userId !== auth.currentUser.uid) return;

  const yes = await confirmBox("Do you want to delete your comment?");
  if (!yes) return;

  await cRef.delete();
  return;
}

  // DELETE reply (only owner)
  if (act === "rdel"){
    if (!ensureLoggedInForComment()) return;

    const rrow = e.target.closest(".rrow");
    const rid = rrow?.dataset?.rid;
    if (!rid) return;

    const rRef = cRef.collection("replies").doc(rid);
    const snap = await rRef.get();
    const d = snap.data() || {};
    if (d.userId !== auth.currentUser.uid) return;

    await rRef.delete();
    return;
  }
});


//coment delet section//
function renderCommentRow(c, canDelete) {
  const name = c.userName || "User";
  const pic = c.userPhoto || "https://i.imgur.com/6VBx3io.png";
  const text = (c.text || "").replace(/[<>]/g, "");

  return `
    <div class="comment-row" data-cid="${c.id}">
      <img class="comment-pic" src="${pic}" onerror="this.onerror=null; this.src='https://i.imgur.com/6VBx3io.png';" />
      <div class="comment-body">
        <div class="comment-name">${name}</div>
        <div class="comment-text">${text}</div>

        <div class="comment-actions">
          <span class="comment-like">Like</span>
          <span class="comment-reply">Reply</span>
          ${canDelete ? `<span class="comment-del">Delete</span>` : ``}
        </div>
      </div>
    </div>
  `;
}


// change send button color based on input
cmodalInput.addEventListener("input", () => {
  const hasText = cmodalInput.value.trim().length > 0;

  if (hasText) {
    cmodalSend.style.color = "#ff2d2d";  // red
  } else {
    cmodalSend.style.color = "#cfd2d6";  // light grey
  }
});


// ================= INIT THEME =================
(function initTheme(){
  const toggle = document.getElementById("darkModeToggle");
  if (!toggle) return;

  // ✅ default always LIGHT if nothing saved
  const saved = localStorage.getItem("theme"); // "dark" | "light" | null
  const theme = (saved === "dark" || saved === "light") ? saved : "light";

  document.body.classList.toggle("dark", theme === "dark");
  toggle.checked = (theme === "dark");

  toggle.addEventListener("change", () => {
    const isDark = toggle.checked;
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
})();
