import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import { alert, articleCard, footer, loader, navbar } from "../../elements";
import { marked } from "marked";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "@firebase/firestore";
import { firestore } from "../../modules/firebase";

// show html body
document.body.style.display = "block";

// add navbar & footer
document.body.insertAdjacentElement("afterbegin", navbar());
document.body.insertAdjacentElement("beforeend", footer());

// elements
const articleContainer = document.getElementById("article-container");
const otherArticlesContainer = document.getElementById("other-articles-container");

// latest article
let latestOtherArticle = null;

// loading articles condition
let isLoadingOtherArticles = false;

// add loader
const articleContainerLoader = loader();
const otherArticlesContainerLoader = loader();
articleContainer.insertAdjacentElement("beforeend", articleContainerLoader);
otherArticlesContainer.insertAdjacentElement("beforeend", otherArticlesContainerLoader);

// load article
getArticle(getQueryVariable("id"));

// load other articles
getOtherArticles(query(collection(firestore, "articles"), orderBy("id", "desc"), limit(10)));

// load more other articles
otherArticlesContainer.addEventListener("scroll", onOtherArticlesContainerScrolledToBottom);

async function getArticle(id) {
  try {
    const article = (await getDoc(doc(firestore, "articles", id))).data();

    // article head
    const articleHeadContainer = document.createElement("div");
    articleHeadContainer.innerHTML = `
      <h1>${article.title}</h1>
      <image src="${article.image}"/>
      <p>${marked(article.description)}</p>
    `;

    // divider line
    const dividerLine = document.createElement("hr");

    // article body
    const articleBodyContainer = document.createElement("div");
    articleBodyContainer.innerHTML = marked(article.body);

    // inserting
    articleContainer.insertAdjacentElement("beforeend", articleHeadContainer);
    articleContainer.insertAdjacentElement("beforeend", dividerLine);
    articleContainer.insertAdjacentElement("beforeend", articleBodyContainer);
  } catch (error) {
    console.error(error);
    // error alert
    articleContainer.insertAdjacentElement("beforeend", alert("danger", "Failed to load article!"));
  } finally {
    // remove loader
    articleContainer.removeChild(articleContainerLoader);
  }
}

function onOtherArticlesContainerScrolledToBottom() {
  const triggerHeight = otherArticlesContainer.scrollTop + otherArticlesContainer.offsetHeight;
  if (triggerHeight >= otherArticlesContainer.scrollHeight) {
    getOtherArticles(
      query(
        collection(firestore, "articles"),
        orderBy("id", "desc"),
        startAfter(latestOtherArticle),
        limit(10)
      )
    );
  }
}

async function getOtherArticles(query) {
  if (isLoadingOtherArticles) return;
  isLoadingOtherArticles = true;
  otherArticlesContainer.insertAdjacentElement("beforeend", otherArticlesContainerLoader);

  try {
    const articles = await getDocs(query);

    if (articles.empty) {
      otherArticlesContainer.removeEventListener(
        "scroll",
        onOtherArticlesContainerScrolledToBottom
      );
      return;
    }

    articles.forEach((doc) => {
      const article = doc.data();
      otherArticlesContainer.insertAdjacentElement("beforeend", articleCard(article));
    });

    // increment latest article
    latestOtherArticle = articles.docs[articles.docs.length - 1];
  } catch (error) {
    console.error(error);
    // error alert
    otherArticlesContainer.insertAdjacentElement(
      "beforeend",
      alert("danger", "Failed to load articles!")
    );
  } finally {
    // remove loader
    otherArticlesContainer.removeChild(otherArticlesContainerLoader);
    isLoadingOtherArticles = false;
  }
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log("Query variable %s not found", variable);
}
