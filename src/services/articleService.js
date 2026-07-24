import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/firebase/firebase";

const articlesRef = collection(db, "articles");

/**
 * Create a new article
 */
export async function addArticle(articleData) {
  try {
    const docRef = await addDoc(articlesRef, {
      ...articleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error adding article:", error);
    throw error;
  }
}

/**
 * Get all articles
 */
export async function getArticles() {
  try {
    const q = query(articlesRef, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
}

/**
 * Get one article by ID
 */
export async function getArticleById(id) {
  try {
    const articleRef = doc(db, "articles", id);

    const snapshot = await getDoc(articleRef);

    if (!snapshot.exists()) {
      throw new Error("Article not found.");
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    throw error;
  }
}

/**
 * Update an article
 */
export async function updateArticle(id, articleData) {
  try {
    const articleRef = doc(db, "articles", id);

    await updateDoc(articleRef, {
      ...articleData,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
}

/**
 * Delete an article
 */
export async function deleteArticle(id) {
  try {
    const articleRef = doc(db, "articles", id);

    await deleteDoc(articleRef);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}

/**get published articles */
export async function getPublishedArticles() {
  const publishedArticlesQuery = query(
    collection(db, "articles"),
    where("status", "==", "Published")
  );

  const snapshot = await getDocs(
    publishedArticlesQuery
  );

  const articles = snapshot.docs.map(
    (articleDocument) => ({
      id: articleDocument.id,
      ...articleDocument.data(),
    })
  );

  // Show the newest articles first
  return articles.sort((firstArticle, secondArticle) => {
    const firstDate =
      firstArticle.createdAt?.toMillis?.() || 0;

    const secondDate =
      secondArticle.createdAt?.toMillis?.() || 0;

    return secondDate - firstDate;
  });
}