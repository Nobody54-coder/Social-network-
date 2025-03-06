import { auth, db, storage, logout } from "./firebase-config.js";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Create Post
async function createPost() {
    const content = document.getElementById("postInput").value;
    if (content.trim() === "") return alert("Post cannot be empty!");

    await addDoc(collection(db, "posts"), {
        user: auth.currentUser.uid,
        content,
        timestamp: new Date()
    });

    document.getElementById("postInput").value = "";
}

// Load News Feed
const postQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
onSnapshot(postQuery, (snapshot) => {
    const feed = document.getElementById("feed");
    feed.innerHTML = "";
    snapshot.forEach((doc) => {
        let post = document.createElement("p");
        post.textContent = doc.data().content;
        feed.appendChild(post);
    });
});

// Video Upload
function uploadVideo() {
    const file = document.getElementById("videoUpload").files[0];
    if (!file) return alert("Select a video file!");

    const storageRef = ref(storage, "videos/" + file.name);
    uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
            addDoc(collection(db, "videos"), {
                user: auth.currentUser.uid,
                url,
                timestamp: new Date()
            });
        });
    });
}

// Real-Time Chat
function sendMessage() {
    const message = document.getElementById("messageInput").value;
    if (message.trim() === "") return;

    addDoc(collection(db, "messages"), {
        user: auth.currentUser.uid,
        text: message,
        timestamp: new Date()
    });

    document.getElementById("messageInput").value = "";
}

const chatQuery = query(collection(db, "messages"), orderBy("timestamp", "desc"));
onSnapshot(chatQuery, (snapshot) => {
    const messages = document.getElementById("messages");
    messages.innerHTML = "";
    snapshot.forEach((doc) => {
        let msg = document.createElement("p");
        msg.textContent = doc.data().text;
        messages.appendChild(msg);
    });
}

// Expose functions globally
window.createPost = createPost;
window.uploadVideo = uploadVideo;
window.sendMessage = sendMessage;
window.logout = logout;
