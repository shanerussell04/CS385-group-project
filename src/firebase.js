// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For authentication
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion, // To add to an array in Firestore
  arrayRemove, // To remove from an array in Firestore
} from "firebase/firestore"; // Firestore functions

const firebaseConfig = {
  apiKey: "AIzaSyDIKbAcxsZDgVQ_SCxMFL2BiIN_CklLVJs",
  authDomain: "cs385-user-authentication.firebaseapp.com",
  projectId: "cs385-user-authentication",
  storageBucket: "cs385-user-authentication.firebasestorage.app",
  messagingSenderId: "116664070100",
  appId: "1:116664070100:web:f337d3356869fd13ba7041",
  measurementId: "G-7XH8CHDC4X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// Function to save user's answers and portfolio to Firestore
export const saveUserPortfolio = async (userId, answers, portfolio) => {
  try {
    const userDocRef = doc(db, "users", userId);

    // Save both answers and portfolio data in the Firestore document
    await setDoc(userDocRef, {
      answers: answers, // Store answers
      portfolio: portfolio, // Store portfolio recommendation
      friends: [], // Initialize friends array as empty
    });
    console.log("User portfolio saved successfully.");
  } catch (error) {
    console.error("Error saving user portfolio: ", error);
  }
};

// Function to retrieve user's portfolio from Firestore
export const getUserPortfolio = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId); // Reference to the user's document
    const docSnap = await getDoc(userDocRef); // Get the document snapshot

    if (docSnap.exists()) {
      return docSnap.data(); // returns answers, portfolio, and friends
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user portfolio: ", error);
    return null;
  }
};

// Function to add a friend to the user's list
export const addFriend = async (userId, friendEmail) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const currentFriends = userDoc.data().friends || [];
      if (!currentFriends.includes(friendEmail)) {
        await updateDoc(userDocRef, {
          friends: arrayUnion(friendEmail), // Add friend to the friends array
        });
        console.log("Friend added successfully!");
      } else {
        console.log("This person is already your friend.");
      }
    } else {
      console.log("User not found!");
    }
  } catch (error) {
    console.error("Error adding friend: ", error);
  }
};

// Function to remove a friend from the user's list
export const removeFriend = async (userId, friendEmail) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      friends: arrayRemove(friendEmail), // Remove friend from the friends array
    });
    console.log("Friend removed successfully!");
  } catch (error) {
    console.error("Error removing friend: ", error);
  }
};

// Function to get data for all friends from Firestore
export const getFriendsData = async (friendsEmails) => {
  try {
    const friendsData = [];
    for (const email of friendsEmails) {
      const friendDocRef = doc(db, "users", email);
      const friendDoc = await getDoc(friendDocRef);
      if (friendDoc.exists()) {
        friendsData.push(friendDoc.data()); // Add friend's data to the array
      }
    }
    return friendsData;
  } catch (error) {
    console.error("Error fetching friends' data: ", error);
    return [];
  }
};
