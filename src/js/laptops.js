import { loadLaptops } from "./api.js";
import {
  initThemeSwitch, initNavToggle, formatPrice, showError,
  renderLaptopCard, renderSkeletons, setupFavoriteButtons,
} from "./ui.js";

initThemeSwitch();
initNavToggle();

const grid = document.getElementById("laptop-grid");
const resultCount = document.getElementById("result-count");
const noResults = document.getElementById("no-results");
const filtersForm = document.getElementById("filters");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const minRamSelect = document.getElementById("min-ram");
const sortSelect = document.getElementById("sort");
const maxPriceInput = document.getElementById("max-price");
const maxPriceValue = document.getElementById("max-price-value");

let allLaptops = [];

const SORTERS = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "battery-desc": (a, b) => b.batteryHours - a.batteryHours,
  "battery-asc": (a, b) => a.batteryHours - b.batteryHours,
  "weight-asc": (a, b) => a.weightKg - b.weightKg,
  "weight-desc": (a, b) => b.weightKg - a.weightKg,
};

function getFilteredLaptops() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const minRam = Number(minRamSelect.value);
  const maxPrice = Number(maxPriceInput.value);

  return allLaptops.filter((laptop) => (laptop.name.toLowerCase().includes(query) || laptop.brand.toLowerCase().includes(query)) && (category === "all" || laptop.category === category) && laptop.ramGB >= minRam && laptop.price <= maxPrice);
}

function render() {
  maxPriceValue.textContent = formatPrice(Number(maxPriceInput.value));

  const filtered = getFilteredLaptops();
  const sorter = SORTERS[sortSelect.value];
  const results = sorter ? [...filtered].sort(sorter) : filtered;

  grid.innerHTML = results.map(renderLaptopCard).join("");
  resultCount.textContent = `Showing ${results.length} of ${allLaptops.length} laptops`;
  noResults.classList.toggle("hidden", results.length > 0);
}

async function init() {
  grid.innerHTML = renderSkeletons(6);
  try {
    allLaptops = await loadLaptops();
    render();
  } catch (error) {
    grid.innerHTML = "";
    resultCount.textContent = "";
    showError("laptops-error", error.message);
  }
}

filtersForm.addEventListener("input", render);
filtersForm.addEventListener("reset", () => setTimeout(render));
setupFavoriteButtons(grid);

init();
