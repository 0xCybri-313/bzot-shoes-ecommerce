const changePage = document.querySelectorAll(".side-bar-options");
const mainSection = document.querySelector("#main-container-root");

changePage.forEach((page) => {
  page.addEventListener("click", (event) => {
    // We pass 'event' here so loadContent can stop the browser navigation
    const urlToLoad = page.getAttribute("data-url");
    const newHash = page.getAttribute("href");

    window.location.hash = newHash;
    loadContent(event, urlToLoad);
  });
});

// 2. HANDLE REFRESH & DEFAULT LOAD
window.addEventListener("load", () => {
  let currentHash = window.location.hash;

  if (!currentHash) {
    currentHash = "#dashboard";
    history.replaceState(null, null, currentHash);
  }

  const activeLink = document.querySelector(
    `.side-bar-options[href="${currentHash}"]`,
  );

  if (activeLink) {
    const urlToLoad = activeLink.getAttribute("data-url");
    // We pass 'null' because there is no click event on page load
    loadContent(null, urlToLoad);
  }
});

// 3. MAIN FUNCTION
async function loadContent(event, url) {
  if (event) event.preventDefault();

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Page not found");
    const htmlText = await response.text();

    // 1. Inject the HTML
    mainSection.innerHTML = htmlText;

    // 2. NOW that the HTML is in the DOM, find the elements and render
    renderProducts();

    // Re-initialize other listeners like searchInput if needed
    // initFilters();
  } catch (error) {
    mainSection.innerHTML = "<p>Error loading content.</p>";
  }
}

import { productsData } from "./productsData.js";

// Select HTML DOM Elements

const productsContainer = document.getElementById("products-container");
const checkbox = document.querySelectorAll(".checkbox");
const filterContainer = document.querySelector("#filter-container");
const searchInput = document.querySelector("#search-input");
console.log(searchInput);

// Init

let cartCountValue = 0;

const productElements = [];

// Move your product rendering into a reusable function
function renderProducts() {
  const productsContainer = document.getElementById("products-container");

  // If we aren't on the products page, this container won't exist. Exit quietly.
  if (!productsContainer) return;

  productsContainer.innerHTML = ""; // Clear existing

  productsData.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.className =
      "flex h-96 w-54 flex-col justify-between rounded-xl border-2 border-[#e8e8e8] p-4 shadow-md";

    // Calculate price
    const finalPrice =
      product.Discount > 0
        ? (product.Price - (product.Price * product.Discount) / 100).toFixed(2)
        : product.Price.toFixed(2);

    productElement.innerHTML = `
      <img class="rounded-md aspect-square w-full" src="/assets/images/product-images/${product.ImageSrc}" alt="${product.Name}"/>

      <h2 class="text-xl font-semibold">${product.Name}</h2>

      <p class="text-sm font-semibold">Product ID: 
        <span class="font-bold text-[#3871c1]">#${product.ID}</span>
      </p>

      <div class="w-full border-b border-[#3871c1]"></div>

      <div class="price-heading flex items-center justify-between">

            <span class="text-base font-semibold">Price:</span>

            <span
              id="product-discount"
              class="rounded-2xl bg-[#D6F4DE] px-2 text-xs font-semibold text-[#275935]"
              >Discount: ${product.Discount}% off</span>

      </div>

      <div class="price-box flex gap-1">

        <span class="text-xl font-bold">$${finalPrice}</span>

        <span class="text-gray-500 line-through">$${product.Price}.00</span>

      </div>
      
      <button
          class="group relative inline-flex h-8 w-full cursor-pointer items-center justify-center rounded-md border-0 bg-[#252525] from-[#3871c1] to-[#00adef] bg-size-[200%] bg-origin-border px-4 py-2 text-sm font-bold whitespace-nowrap text-white transition-transform duration-200 [border:calc(0.08*1rem)_solid_transparent] before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-[20%] before:w-[60%] before:-translate-x-1/2 hover:scale-105 hover:bg-linear-to-l focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
          id="add-to-cart"
          >
          Add To Cart
        </button>
        `;
    // class="w-full rounded-md bg-linear-to-l from-[#3871c1] to-[#00adef] text-white font-bold hover:bg-linear-to-t"
    productElement
      .querySelector("#add-to-cart")
      .addEventListener("click", updateCartCount);
    productsContainer.appendChild(productElement);
  });
}

function updateCartCount(e) {
  const cartCount = document.querySelector("#cart-count");
  const cartBox = document.querySelector("#cart-box");
  const statusEl = e.target;
  if (statusEl.classList.contains("added")) {
    statusEl.classList.remove("bg-green-500", "added");
    statusEl.classList.add("hover:bg-linear-to-l");
    statusEl.innerText = "Add To Card";
    cartCountValue--;
    cartCount.innerText = cartCountValue;
    if (cartCountValue === 0) {
      cartBox.classList.remove("animate-bounce");
    }
  } else {
    statusEl.classList.remove("hover:bg-linear-to-l");
    statusEl.classList.add("added", "bg-green-500");
    statusEl.innerText = "Added";
    cartCountValue++;
    console.log(cartCountValue);
    cartCount.innerText = cartCountValue;
    if (cartCountValue === 1) {
      cartBox.classList.add("animate-bounce");
    }
  }
}
