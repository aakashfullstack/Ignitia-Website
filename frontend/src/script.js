const menuButton = document.querySelector(".menu");
const menuBar = document.querySelector(".menubar");
const closeButton = document.querySelector(".close");
const learnMore = document.querySelector(".learn-more");
const section1 = document.getElementById("section-1");
const section2 = document.getElementById("section-2");
const section4 = document.getElementById("section-4");
const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const navHeight = nav.getBoundingClientRect().height;
const hoverContainer = document.querySelector(".nav-list");
const hover = document.querySelectorAll(".hover");
const about = document.querySelector(".about");
const dropContainer1 = document.querySelector(".drop-container1");
const dropContainer2 = document.querySelector(".drop-container2");
const dropContainer3 = document.querySelector(".drop-container3");
const dropContainer1menu = document.querySelector(".drop-container1menu");
const dropContainer2menu = document.querySelector(".drop-container2menu");
const dropContainer3menu = document.querySelector(".drop-container3menu");
const logo1 = document.querySelector(".logo-1");
const reveal = document.querySelectorAll(".reveal2");
const reveal3 = document.querySelectorAll(".reveal3");
const reveal4 = document.querySelectorAll(".reveal4");
const leftfade2 = document.querySelectorAll(".left-fade2");
const rightfade2 = document.querySelectorAll(".right-fade2");
const sectionheading1 = document.querySelector(".section-heading1");

document.addEventListener("DOMContentLoaded", function () {
  const largeText = document.querySelector(".large-screen-text");
  const smallText = document.querySelector(".small-screen-text");

  function adjustTextBasedOnScreenWidth() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 800) {
      largeText.style.display = "none";
      smallText.style.display = "inline";
    } else {
      largeText.style.display = "inline";
      smallText.style.display = "none";
    }
  }

  adjustTextBasedOnScreenWidth();
  window.addEventListener("resize", adjustTextBasedOnScreenWidth);

  let isVisible = false;
  let popupInterval;

  function showPopups() {
    if (!isVisible) {
      const popup1 = document.createElement("div");
      popup1.className = "popup";
      popup1.innerHTML = `<img src="Assets/popup1.png" alt="Popup 1" class="popup-image" />`;
      const lastChild = document.querySelector(".header").lastElementChild;
      lastChild.insertAdjacentElement("beforebegin", popup1);

      const popup2 = document.createElement("div");
      popup2.className = "popup2";
      popup2.innerHTML = `<img src="Assets/popup2.png" alt="Popup 2" class="popup-image" />`;
      popup1.appendChild(popup2);

      popup1.style.position = "absolute";
      popup1.style.bottom = "20vh";
      popup1.style.left = "4vw";
      popup1.style.zIndex = "1000";
      popup1.style.borderRadius = "5px";

      popup2.style.position = "absolute";
      popup2.style.top = "calc(12vh + 0.5vh)";
      popup2.style.zIndex = "1000";
      popup2.style.borderRadius = "5px";

      isVisible = true;

      setTimeout(hidePopups, 2000);
    }
  }

  function hidePopups() {
    if (isVisible) {
      const popup1 = document.querySelector(".popup");
      if (popup1) {
        popup1.style.animation = "fadeOut 0.5s";

        popup1.addEventListener("animationend", () => {
          popup1.remove();
          isVisible = false;
        });
      }
    }
  }

  function managePopupCycle() {
    showPopups();
  }

  setTimeout(() => {
    managePopupCycle();

    popupInterval = setInterval(managePopupCycle, 7000);
  }, 1800);

  window.addEventListener("beforeunload", function () {
    clearInterval(popupInterval);
  });

  const heroText = document.querySelector(".hero-text");

  const leftfade = function (entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.classList.remove("hidden4");
  };

  const sectionObserver6 = new IntersectionObserver(leftfade, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });

  sectionObserver6.observe(heroText);

  const logo2 = document.querySelector(".logo-2");

  const rightfade = function (entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.classList.remove("hidden5");
  };

  const sectionObserver7 = new IntersectionObserver(rightfade, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });

  sectionObserver7.observe(logo2);

  const moto = document.querySelector(".moto");

  const upfade = function (entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;
    entry.target.classList.remove("hidden2");
  };

  const sectionObserver8 = new IntersectionObserver(upfade, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });

  sectionObserver8.observe(moto);
});

const downfade = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("hidden6");
};

const sectionObserver9 = new IntersectionObserver(downfade, {
  root: null,
  rootMargin: "0px",
  threshold: 0.5,
});

sectionObserver9.observe(sectionheading1);

const leftfadeIn = function (entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("hidden4");
  });
};

const sectionObserver10 = new IntersectionObserver(leftfadeIn, {
  root: null,
  threshold: 0.5,
  rootMargin: "0px",
});

leftfade2.forEach((el) => {
  sectionObserver10.observe(el);
});

const rightfadeIn = function (entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("hidden5");
  });
};

const sectionObserver11 = new IntersectionObserver(rightfadeIn, {
  root: null,
  threshold: 0.5,
  rootMargin: "0px",
});

rightfade2.forEach((el) => {
  sectionObserver11.observe(el);
});

const reveallast = function (entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("hidden2");
  });
};

const sectionObserver4 = new IntersectionObserver(reveallast, {
  root: null,
  threshold: 0.15,
});

reveal4.forEach((el) => {
  el.classList.add("hidden2");
  sectionObserver4.observe(el);
});

logo1.addEventListener("click", () =>
  header.scrollIntoView({ behavior: "smooth" })
);

menuButton.addEventListener("click", () => {
  menuBar.style.height = "89vh";
  menuButton.style.display = "none";
  closeButton.style.display = "block";
});

closeButton.addEventListener("click", () => {
  menuBar.style.height = "0";
  menuButton.style.display = "block";
  closeButton.style.display = "none";
});

learnMore.addEventListener("click", (e) => {
  e.preventDefault();

  section1.scrollIntoView({ behavior: "smooth" });
});

dropContainer1.addEventListener("click", (e) => {
  e.preventDefault();

  section1.scrollIntoView({ behavior: "smooth" });
});

dropContainer1menu.addEventListener("click", (e) => {
  e.preventDefault();

  section1.scrollIntoView({ behavior: "smooth" });
  menuBar.style.height = "0";
  menuButton.style.display = "block";
  closeButton.style.display = "none";
});

dropContainer2.addEventListener("click", (e) => {
  e.preventDefault();

  section2.scrollIntoView({ behavior: "smooth" });
});

dropContainer2menu.addEventListener("click", (e) => {
  e.preventDefault();

  section2.scrollIntoView({ behavior: "smooth" });
  menuBar.style.height = "0";
  menuButton.style.display = "block";
  closeButton.style.display = "none";
});

dropContainer3.addEventListener("click", (e) => {
  e.preventDefault();

  section4.scrollIntoView({ behavior: "smooth" });
});

dropContainer3menu.addEventListener("click", (e) => {
  e.preventDefault();

  section4.scrollIntoView({ behavior: "smooth" });
  menuBar.style.height = "0";
  menuButton.style.display = "block";
  closeButton.style.display = "none";
});

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerobserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerobserver.observe(header);

nav.addEventListener("mouseover", function (e) {
  if (e.target.classList.contains("hover")) {
    const hovered = e.target;
    // console.log(hovered);
    hover.forEach((el) => {
      // el.classList.remove("hover-active");
      if (el !== hovered) el.classList.add("hover-active");
    });
  }
});

nav.addEventListener("mouseout", function (e) {
  if (e.target.classList.contains("hover")) {
    const hovered = e.target;
    // console.log(hovered);
    hover.forEach((el) => {
      el.classList.remove("hover-active");
    });
  }
});

about.addEventListener("mouseover", function () {
  drop1.style.opacity = 1;
});

const reveal2 = function (entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("hidden");
  });
};

const sectionObserver2 = new IntersectionObserver(reveal2, {
  root: null,
  threshold: 0,
});

reveal.forEach((el) => {
  el.classList.add("hidden");
  sectionObserver2.observe(el);
});

const revealofficer = function (entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("hidden3");
  });
};

const sectionObserver3 = new IntersectionObserver(revealofficer, {
  root: null,
  threshold: 0.4,
});

reveal3.forEach((el) => {
  el.classList.add("hidden3");
  sectionObserver3.observe(el);
});

//swiper

new Swiper(".card-wrapper", {
  loop: true,

  autoplay: {
    delay: 5000,
  },

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

//backend

document
  .getElementById("appointment-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: document.querySelector('[name="name"]').value,
      email: document.querySelector('[name="email"]').value,
      mobile: document.querySelector('[name="mobile"]').value,
      serviceType: document.querySelector('[name="serviceType"]').value,
      message: document.querySelector('[name="message"]').value,
    };

    try {
      const response = await fetch(
        "https://backend.vercel.app/api/submit-form",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const result = await response.json();
        showPopup("Successfully Submitted"); // Show success popup
        console.log(result.message); // Log the success message
      } else {
        const errorData = await response.json();
        alert("Validation Errors: " + JSON.stringify(errorData.errors));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  });

function showPopup(message) {
  const popup = document.getElementById("popup");
  popup.textContent = message;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000);
}
