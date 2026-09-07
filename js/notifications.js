import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging.js";

const firebaseConfig = {
apiKey: "AIzaSyAvs9lHvMqSd3DE3Sd0iYaJ4C-CMJMyHBs",
  authDomain: "papalina-reservations-ab389.firebaseapp.com",
  projectId: "papalina-reservations-ab389",
  storageBucket: "papalina-reservations-ab389.firebasestorage.app",
  messagingSenderId: "666787905741",
  appId: "1:666787905741:web:18a2f616dbeb0e730d2984"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const enableNotificationsBtn =
    document.getElementById("enableNotificationsBtn");

enableNotificationsBtn.addEventListener("click", async () => {
    try {
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            alert("Δεν δόθηκε άδεια για ειδοποιήσεις.");
            return;
        }

       const serviceWorkerRegistration =
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");

await navigator.serviceWorker.ready;

const token = await getToken(messaging, {
            vapidKey:"BPF0nsMOZD2KCpnPXUsO97rlmazieJB_iAGG7i2SUiC0kg9vHdWvCB-0CKVTFFB9WeF-T9sxkqDgLCFTpdYyzPg",
    serviceWorkerRegistration
});

       if (token) {
    console.log("FCM Token:", token);

    const response = await fetch(
        "https://reservation-backend-cnxc.onrender.com/admin/push-token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token })
        }
    );

    if (!response.ok) {
        throw new Error("Αποτυχία αποθήκευσης push token.");
    }

    alert("Οι ειδοποιήσεις ενεργοποιήθηκαν!");
}else {
            alert("Δεν δημιουργήθηκε token ειδοποιήσεων.");
        }

    } catch (error) {
        console.error("Push notification error:", error);
        alert("Παρουσιάστηκε σφάλμα στην ενεργοποίηση ειδοποιήσεων.");
    }
});