import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import { onAuthStateChanged } from "@firebase/auth";
import { getDoc, doc, setDoc } from "@firebase/firestore";
import { navbar, footer, alert, loader } from "../../../elements";
import { auth, firestore } from "../../../modules/firebase";

// Check user
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location = "/signin/"; //If User is not logged in, redirect to login page
    return;
  }

  // show html body
  document.body.style.display = "block";

  // add navbar & footer
  document.body.insertAdjacentElement("afterbegin", navbar(true));
  document.body.insertAdjacentElement("beforeend", footer());

  const settingsContainer = document.getElementById("settings-container");
  const settingsContainerParent = document.getElementById("settings-container-parent");
  const saveSettingsButton = document.getElementById("save-settings-button");

  // Hide settings container & save button
  settingsContainer.style.display = "none";
  saveSettingsButton.style.display = "none";

  // add loader
  const settingsContainerLoader = loader();
  settingsContainer.insertAdjacentElement("beforebegin", settingsContainerLoader);

  const bannerSetting = {
    title: document.querySelector("#banner-setting .title-input"),
    image: document.querySelector("#banner-setting .image-input"),
    description: document.querySelector("#banner-setting .description-input"),
  };

  // get settings data
  getSettings();

  // set settings event
  saveSettingsButton.addEventListener("click", setSettings);

  // functions
  async function getSettings() {
    try {
      let bannerDoc = (await getDoc(doc(firestore, "settings", "banner"))).data();

      if (bannerDoc == undefined) {
        console.log("kosong");
      } else {
        // Set settings to html element
        bannerSetting.title.value = bannerDoc.title;
        bannerSetting.image.value = bannerDoc.image;
        bannerSetting.description.value = bannerDoc.description;
      }
    } catch (error) {
      console.error(error);
      settingsContainer.insertAdjacentElement(
        "afterbegin",
        alert("danger", "Failed to get your settings data!")
      );
    } finally {
      // show settings container & save button
      settingsContainer.style.display = "block";
      saveSettingsButton.style.display = "block";

      // remove loader
      settingsContainerParent.removeChild(settingsContainerLoader);
    }
  }

  async function setSettings() {
    try {
      await setDoc(doc(firestore, "settings", "banner"), {
        title: bannerSetting.title.value,
        image: bannerSetting.image.value,
        description: bannerSetting.description.value,
      });

      window.alert("Settings saved!");
    } catch (error) {
      console.error(error);
      window.alert("Failed to save settings!");
    }
  }
});
