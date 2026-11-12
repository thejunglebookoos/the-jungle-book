
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";


// FIREBASE CONFIGURATION

const firebaseConfig = {
    apiKey: "AIzaSyDMHZwr-hsfIHlUFhpMGo_xrQPYKkD1u-s",
    authDomain: "the-jungle-book-oss.firebaseapp.com",
    projectId: "the-jungle-book-oss",
    storageBucket: "the-jungle-book-oss.firebasestorage.app",
    messagingSenderId: "134266340055",
    appId: "1:134266340055:web:a74ff85474277bfabd2692",
    measurementId: "G-5J00RJ1JF2"
};


// INITIALIZE FIREBASE

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ADMIN LOGIN

window.firebaseAdminLogin = async function(email, password) {

    return await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

};


// ADMIN LOGOUT

window.firebaseAdminLogout = async function() {

    return await signOut(auth);

};


// AUTHENTICATION STATUS

window.firebaseAuth = auth;
window.firebaseDb = db;

window.firebaseAuthStatus = function(callback) {

    return onAuthStateChanged(auth, callback);

};


// SAVE CUSTOMER ORDER

window.saveOrderToFirebase = async function(orderData) {

    return await addDoc(
        collection(db, "orders"),
        {
            ...orderData,
            status: "Pending",
            createdAt: serverTimestamp()
        }
    );

};


// GET ALL ORDERS

window.getOrdersFromFirebase = async function() {

    const q = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(item => ({
        id: item.id,
        ...item.data()
    }));

};


// UPDATE ORDER STATUS

window.updateFirebaseOrder = async function(id, status) {

    return await updateDoc(
        doc(db, "orders", id),
        { status: status }
    );

};


// DELETE ORDER

window.deleteFirebaseOrder = async function(id) {

    return await deleteDoc(
        doc(db, "orders", id)
    );

};


console.log("The Jungle Book Firebase Connected!");
