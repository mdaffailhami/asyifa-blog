import { collection, getDocs, limit, orderBy, query, startAfter } from "@firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import { footer, navbar, articleCard, alert, loader } from "../elements";
import { firestore } from "../modules/firebase";

// Show HTML Body
document.body.style.display = "block";

// add navbar & footer
document.body.insertAdjacentElement("afterbegin", navbar());
document.body.insertAdjacentElement("beforeend", footer());

// elements
const articlesContainer = document.getElementById("articles-container");

// add loader
const articlesContainerLoader = loader();
articlesContainer.insertAdjacentElement("beforeend", articlesContainerLoader);

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

    articles.forEach((doc) => {
      const article = doc.data();
      const grid = document.createElement("div");
      grid.classList.add("col-md-6");
      grid.classList.add("mb-2");
      grid.insertAdjacentElement("beforeend", articleCard(article));
      articlesContainer.insertAdjacentElement("beforeend", grid);
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
