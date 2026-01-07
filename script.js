const imageInput = document.getElementById("imageInput");
const feed = document.getElementById("feed");
const profileUpload = document.getElementById("profileUpload");
const profilePic = document.getElementById("profilePic");
const postBtn = document.getElementById("postBtn");

let currentProfilePic = profilePic.src;
let selectedImage = null;

/* Change profile pic */
profileUpload.addEventListener("change", () => {
  const file = profileUpload.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    profilePic.src = reader.result;
    currentProfilePic = reader.result;
  };
  reader.readAsDataURL(file);
});

/* Select post image */
imageInput.addEventListener("change", () => {
  selectedImage = imageInput.files[0];
});

/* Create post */
postBtn.addEventListener("click", () => {
  if (!selectedImage) {
    alert("Please select a photo");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const post = document.createElement("div");
    post.className = "post";

    post.innerHTML = `
      <div class="post-header">
        <img src="${currentProfilePic}">
        <b>Everest User</b>
      </div>

      <img src="${reader.result}" class="post-img">

      <div class="post-actions">
        <button onclick="like(this)">👍 Like</button>
        <button onclick="alert('Comment demo')">💬 Comment</button>
        <button onclick="alert('Share demo')">↗ Share</button>
      </div>
    `;

    feed.prepend(post);
    selectedImage = null;
  };

  reader.readAsDataURL(selectedImage);
});

/* Like */
function like(btn) {
  btn.innerText = "❤️ Liked";
}
