import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "@firebase/firestore";
import { onAuthStateChanged, signOut } from "@firebase/auth";
import { auth, firestore } from "../../modules/firebase";
import { footer, navbar, articleCard, alert, loader } from "../../elements";

// Check user
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location = "/signin/"; //If User is not logged in, redirect to login page
    return;
  }

  // Show HTML Body
  document.body.style.display = "block";

  // add navbar & footer
  document.body.insertAdjacentElement("afterbegin", navbar(true));
  document.body.insertAdjacentElement("beforeend", footer());

  // elements
  const articlesContainer = document.getElementById("articles-container");

  // add loader
  const articlesContainerLoader = loader();
  articlesContainer.insertAdjacentElement("beforeend", articlesContainerLoader);

  // Sign out button event
  const signOutButton = document.getElementById("sign-out-button");
  signOutButton.addEventListener("click", (e) => {
    e.preventDefault();

    const confirmation = window.confirm("Are you sure you want to sign out?");

    if (confirmation) signOut(auth);
  });

  // latest article
  let latestArticle = null;

  // loading articles condition
  let isLoadingArticles = false;

  // load first articles
  getArticles(query(collection(firestore, "articles"), orderBy("id", "desc"), limit(10)));

  // load more articles
  articlesContainer.addEventListener("scroll", onArticlesContainerScrolledToBottom);

  function onArticlesContainerScrolledToBottom() {
    const triggerHeight = articlesContainer.scrollTop + articlesContainer.offsetHeight;
    if (triggerHeight >= articlesContainer.scrollHeight) {
      getArticles(
        query(
          collection(firestore, "articles"),
          orderBy("id", "desc"),
          startAfter(latestArticle),
          limit(10)
        )
      );
    }
  }

  async function getArticles(query) {
    if (isLoadingArticles) return;
    isLoadingArticles = true;
    articlesContainer.insertAdjacentElement("beforeend", articlesContainerLoader);

    try {
      const articles = await getDocs(query);

      if (articles.empty) {
        articlesContainer.removeEventListener("scroll", onArticlesContainerScrolledToBottom);
        return;
      }

      articles.forEach((article) => {
        article = article.data();
        const grid = document.createElement("div");
        grid.classList.add("col-md-6");
        grid.classList.add("mb-2");
        grid.insertAdjacentElement("beforeend", articleCard(article, true));
        articlesContainer.insertAdjacentElement("beforeend", grid);

        // Add event to delete article button
        const confirmDeleteArticleButton = document.getElementById(
          `confirm-delete-article-button-${article.id}`
        );
        confirmDeleteArticleButton.addEventListener("click", () => {
          const articleId = confirmDeleteArticleButton.getAttribute("article-id");
          deleteDoc(doc(firestore, "articles", articleId))
            .then(() => {
              console.log(`${article.title} article successfully deleted!`);

              // delete article in articles container
              articlesContainer.removeChild(grid);
            })
            .catch((error) => console.error(error));
        });
      });

      // increment latest article
      latestArticle = articles.docs[articles.docs.length - 1];
    } catch (error) {
      console.error(error);
      // error alert
      articlesContainer.insertAdjacentElement(
        "beforeend",
        alert("danger", "Failed to load articles!")
      );
    } finally {
      // remove loader
      articlesContainer.removeChild(articlesContainerLoader);
      isLoadingArticles = false;
    }
  }
});
