// import {
//   collection,
//   query,
//   where,
//   doc,
//   setDoc,
//   getDoc,
//   getDocs,
//   updateDoc,
//   deleteDoc,
// } from "firebase/firestore";
// import { database } from "./firebase";

// class Collection {
//   constructor(database, collectionId) {
//     if (database == undefined || collectionId == undefined) {
//       console.log("database and collectionId is undefined!");
//     } else {
//       this.database = database;
//       this.collectionId = collectionId;
//     }
//   }

//   async setDocument(documentId, data) {
//     await setDoc(doc(this.database, this.collectionId, documentId), data);
//   }

//   async getDocument(documentId) {
//     const docSnap = await getDoc(doc(this.database, this.collectionId, documentId));
//     if (docSnap.exists()) return docSnap.data();
//     else return "No such document!";
//   }

//   async getMultipleDocuments(field, condition, value) {
//     const querySnapshot = await getDocs(
//       query(collection(this.database, this.collectionId), where(field, condition, value))
//     );
//     const documents = [];
//     querySnapshot.forEach((doc) => {
//       documents.push(doc.data());
//     });
//     return documents;
//   }

//   async getAllDocuments() {
//     const querySnapshot = await getDocs(collection(this.database, this.collectionId));
//     const documents = [];
//     querySnapshot.forEach((doc) => {
//       documents.push(doc.data());
//     });
//     return documents;
//   }

//   async updateDocument(documentId, data) {
//     await updateDoc(doc(this.database, this.collectionId, documentId), data);
//   }

//   async deleteDocument(documentId) {
//     await deleteDoc(doc(this.database, this.collectionId, documentId));
//   }
// }

// const articles = new Collection(database, "articles");

// export { articles };
