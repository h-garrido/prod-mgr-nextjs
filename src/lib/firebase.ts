// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

export const auth = getAuth(app);
export const db = getFirestore(app);


/* ==== Auth functions ==== */

/* ===== Sign Up user with email and password ===== */
export const createUser = async (user: {email: string, password: string}) => {
    return await createUserWithEmailAndPassword(auth, user.email, user.password);  
}

/* ===== Sign In with email and password ===== */
export const signIn = async (user: {email: string, password: string}) => {
    return await signInWithEmailAndPassword(auth, user.email, user.password);  
}

/* ===== Update user's displayName & photoURL ===== */
export const updateUser = (user: { displayName?: string | null | undefined; photoURL?: string | null | undefined; }) => {
    if (auth.currentUser) return updateProfile(auth.currentUser, user)
}

/* ===== Sign Out ===== */
export const signOut = () => {
    localStorage.removeItem('user');
    return auth.signOut();
}




/* ==== Database functions ==== */

/* ===== Get a document from a collection ===== */
export const getDocument = async (path: string) => {
    return (await getDoc(doc(db, path))).data();
}

/* ===== Set document in a collection ===== */
export const setDocument = (path: string, data: any) => {
    data.createdAt = serverTimestamp();
    return setDoc(doc(db, path), data);
}