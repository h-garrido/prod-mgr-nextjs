// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBm8vu-aYntaKrXLCdxQXEm6MwAA4QB9qg",
  authDomain: "products-store-nextjs.firebaseapp.com",
  projectId: "products-store-nextjs",
  storageBucket: "products-store-nextjs.appspot.com",
  messagingSenderId: "665825848374",
  appId: "1:665825848374:web:7a85918be9ee27ed573c97"
};

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