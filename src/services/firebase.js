import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";

//
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();

export const register = async (email, password, username, full_name) => {
  try {
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    if (querySnapshot.size > 0) {
      throw new Error("User already exists!");
    }
    const user = await createUserWithEmailAndPassword(auth, email, password);

    const docRef = doc(db, "users", user.user.uid);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    if (docSnap.exists()) {
      throw new Error("This user database already exists!");
    } else {
      const _JWTToken = await user.user.getIdToken();
      const { displayName, email, emailVerified, photoURL } = user.user;
      await setDoc(docRef, {
        displayName,
        username,
        full_name,
        email,
        emailVerified,
        photoURL,
        workouts: [],
        _JWTToken,
      });
      return user;
    }
  } catch (error) {
    //error.code, erro.message
    return error?.message;
  }

  // .then((userCredential) => {
  //   // Signed in
  //   const user = userCredential.user;
  //   // ...
  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // ..
  // });
};
export const login = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response;
  } catch (err) {
    return err.message;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (err) {
    throw new Error("Log out issue occurred!");
  }
};

//!FIRESTORE
