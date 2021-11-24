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
  getDoc,
  where,
} from "@firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";
import { auth, firestore } from "../../modules/firebase";
import { footer, navbar, articleCard, alert, loader, banner } from "../../elements";

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

  // add banner
  getDoc(doc(firestore, "settings", "banner"))
    .then((bannerDoc) => {
      const bannerData = bannerDoc.data();
      document
        .getElementById("banner-container")
        .insertAdjacentElement(
          "afterbegin",
          banner(bannerData.title, bannerData.image, bannerData.description)
        );
    })
    .catch((error) => console.error(error));

  // elements
  const articlesContainer = document.getElementById("articles-container");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.querySelector("#search-form input");

  // add loader
  const articlesContainerLoader = loader();
  articlesContainer.insertAdjacentElement("beforeend", articlesContainerLoader);

  // articles limit
  const articlesLimit = 10;

  // latest article
  let latestArticle = null;

  // loading articles condition
  let isLoadingArticles = false;

  // articles first load
  articlesFirstLoad();

  // load more articles
  articlesContainer.addEventListener("scroll", onArticlesContainerScrolledToBottom);

  // Search articles event
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchArticles();
  });

  function articlesFirstLoad() {
    getArticles(
      query(collection(firestore, "articles"), orderBy("id", "desc"), limit(articlesLimit))
    );
  }

  function onArticlesContainerScrolledToBottom() {
    const triggerHeight = articlesContainer.scrollTop + articlesContainer.offsetHeight;
    if (triggerHeight >= articlesContainer.scrollHeight) {
      getArticles(
        query(
          collection(firestore, "articles"),
          orderBy("id", "desc"),
          startAfter(latestArticle),
          limit(articlesLimit)
        )
      );
    }
  }

  async function getArticles(query, clearArticles = false) {
    if (isLoadingArticles) return;
    isLoadingArticles = true;
    articlesContainer.insertAdjacentElement("beforeend", articlesContainerLoader);

    try {
      const articles = await getDocs(query);

      if (clearArticles) {
        articlesContainer.innerHTML = "";
        articlesContainer.insertAdjacentElement("beforeend", articlesContainerLoader);
      }

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
            .catch((error) => {
              console.error(error);
              window.alert("Failed to delete article!");
            });
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

  function searchArticles() {
    const searchKeywords = searchInput.value.toLowerCase().split(" ");

    // Jika tidak ada yg di-search
    if (searchKeywords.length == 1 && searchKeywords[0] == "") {
      articlesContainer.addEventListener("scroll", onArticlesContainerScrolledToBottom);
      articlesContainer.innerHTML = "";
      articlesFirstLoad();
      return;
    }

    getArticles(
      query(
        collection(firestore, "articles"),
        where("keywords", "array-contains-any", searchKeywords)
      ),
      true
    );
  }
});
