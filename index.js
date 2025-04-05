// Firebase Web App Konfigürasyonu
const firebaseConfig = {
    apiKey: "AIzaSyBXbLpzgMa8wiiYcXhVDsOSRzVx_zdplXw",
    authDomain: "cekilisveritabani.firebaseapp.com",
    projectId: "cekilisveritabani",
    storageBucket: "cekilisveritabani.firebasestorage.app",
    messagingSenderId: "246236686196",
    appId: "1:246236686196:web:d22a9b99140626cc04ae21",
    measurementId: "G-YZ6MYCPK8G"
};

// Firebase'i başlat
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Kullanıcıyı doğrulama ve yönetme işlemleri
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Giriş yapan kullanıcı:", user);
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('user-name').textContent = `Ad: ${user.displayName || user.email}`;
        document.getElementById('user-email').textContent = `E-posta: ${user.email}`;
        document.getElementById('logout').style.display = 'inline-block';
        document.getElementById('open-login').style.display = 'none';
        document.getElementById('open-signup').style.display = 'none';

        // Kullanıcı verilerini Firestore'dan alalım
        getUserData(user.uid);
    } else {
        console.log("Kullanıcı giriş yapmamış.");
        document.getElementById('user-info').style.display = 'none';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('open-login').style.display = 'inline-block';
        document.getElementById('open-signup').style.display = 'inline-block';
    }
});

// Kullanıcı kaydı
document.getElementById('open-signup').addEventListener('click', () => {
    const email = prompt("Email adresinizi girin:");
    const password = prompt("Şifrenizi girin:");

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Kayıt başarılı:", userCredential.user);
        })
        .catch((error) => {
            console.error("Kayıt hatası:", error.message);
        });
});

// Kullanıcı girişi
document.getElementById('open-login').addEventListener('click', () => {
    const email = prompt("Email adresinizi girin:");
    const password = prompt("Şifrenizi girin:");

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("Giriş başarılı:", userCredential.user);
        })
        .catch((error) => {
            console.error("Giriş hatası:", error.message);
        });
});

// Çıkış yapma
document.getElementById('logout').addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log("Çıkış yapıldı.");
    }).catch((error) => {
        console.error("Çıkış hatası:", error.message);
    });
});

// Kullanıcı verilerini ekrana yazdırmak
async function getUserData(userId) {
    const userDocRef = doc(db, "users", userId); // Firestore koleksiyonundan 'users' belgesine erişim
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        console.log("Kullanıcı verileri:", userDoc.data());
        const userData = userDoc.data();
        
        // HTML'de kullanıcı bilgilerini gösterme
        document.getElementById("user-name").textContent = `Ad: ${userData.name}`;
        document.getElementById("user-email").textContent = `E-posta: ${userData.email}`;
    } else {
        console.log("Kullanıcı verisi bulunamadı.");
    }
}
