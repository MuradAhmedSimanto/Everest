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
  profileFeed.innerHTML = "";
  
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

  const feed = document.getElementById("feed");
  const profileFeed = document.getElementById("profileFeed");
  const profilePic = document.getElementById("profilePic");


  let updateText = "";
  if (isProfileUpdate && updateType === "profile") updateText = "updated profile picture";
  if (isProfileUpdate && updateType === "cover") updateText = "updated cover photo";

  const postHTML = `
    <div class="post" data-id="${media}">

      <div class="post-header">
        <div class="post-user-left">
          <img src="${userPhoto}" class="post-user-pic">

          <div>
            <div class="post-user-name">${userName}</div>
            ${updateText ? `<div class="post-update-text">${updateText}</div>` : ""}
          </div>
        </div>

        <div class="post-menu-wrapper">
  <div class="post-menu">⋯</div>

  <div class="post-menu-dropdown">
    <div class="pm-item delete">Delete post</div>
    <div class="pm-item edit">Edit post</div>
    <div class="pm-item pin">Pin post</div>
    <div class="pm-item download">Download post</div>
  </div>
</div>

      </div>


${caption ? (() => {
  const c = formatCaption(caption);

  return `
    <div class="post-text ${c.showReadMore ? "collapsed" : ""}"
         data-full="${c.full}">
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
               </video>`}
        </div>
      `}

      <div class="post-actions">
        <span>👍 Like</span>
        <span>💬 Comment</span>
        <span>↗️ Share</span>
      </div>
    </div>
  `;

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

    createPost({
      type: "image",
      media: r.result,
      userName: MEMORY_PROFILE_NAME,
      userPhoto: r.result,
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

    createPost({
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
  authMsg.textContent = "";
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

  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({
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

     MEMORY_PROFILE_NAME = fullName;


      // UI update
      document.getElementById("profileName").innerText = fullName;

      // switch page
      homePage.style.display = "none";
      profilePage.style.display = "block";
      notificationPage.style.display = "none";
      messagePage.style.display = "none";
      setActive(profileIcon);

      authModal.style.display = "none";
    })
    .catch((err) => {
      authMsg.textContent = err.message;
      console.error(err);
    });
};



//no remove id name
auth.onAuthStateChanged(user => {
  if (!user) return;

  // user still logged in after refresh
  db.collection("users").doc(user.uid).get().then(doc => {
    if (!doc.exists) return;

    const data = doc.data();

    const fullName = data.firstName + " " + data.lastName;
    MEMORY_PROFILE_NAME = fullName;

    document.getElementById("profileName").innerText = fullName;
  });
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
      .where("media", "==", id)
      .get()
      .then(qs => qs.forEach(d => d.ref.delete()));
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

  // EDIT
  if (e.target.classList.contains("edit")) {
    alert("Edit post coming soon");
  }

  // PIN
  if (e.target.classList.contains("pin")) {
    alert("Pin post coming soon");
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
function savePostToFirebase({ type, media, caption = "" }) {

  if (!auth.currentUser) {
    alert("Post করতে login লাগবে");
    return;
  }

  db.collection("posts").add({
    userId: auth.currentUser.uid,
    userName: MEMORY_PROFILE_NAME,
    userPhoto: profilePic.src,
    type,
    media,
    caption,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}






db.collection("posts")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {

    document.getElementById("feed").innerHTML = "";
    document.getElementById("profileFeed").innerHTML = "";

    snapshot.forEach(doc => {
      const p = doc.data();

      createPost({
        type: p.type,
        media: p.media,
        caption: p.caption,
        userName: p.userName,
        userPhoto: p.userPhoto
      });
    });
  });

