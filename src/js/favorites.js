import { loadLaptops } from "./api.js";
import { getFavorites, clearFavorites } from "./storage.js";
import {
  initThemeSwitch, initNavToggle, formatPrice, showError,
  renderLaptopCard, renderSkeletons, setupFavoriteButtons,
} from "./ui.js";

initThemeSwitch();
initNavToggle();

const grid = document.getElementById("favorites-grid");
const emptyState = document.getElementById("favorites-empty");
const clearButton = document.getElementById("clear-favorites");
const countEl = document.getElementById("fav-count");
const totalEl = document.getElementById("fav-total");
const averageEl = document.getElementById("fav-average");

let allLaptops = [];

const getFavoriteLaptops = () => {
  const ids = getFavorites();
  return allLaptops.filter((laptop) => ids.includes(laptop.id));
};

function renderSummary(laptops) {
  const total = laptops.reduce((sum, laptop) => sum + laptop.price, 0);
  const average = laptops.length > 0 ? Math.round(total / laptops.length) : 0;

  countEl.textContent = laptops.length;
  totalEl.textContent = formatPrice(total);
  averageEl.textContent = formatPrice(average);
}

function render() {
  const favorites = getFavoriteLaptops();

  grid.innerHTML = favorites.map(renderLaptopCard).join("");
  emptyState.classList.toggle("hidden", favorites.length > 0);
  clearButton.disabled = favorites.length === 0;
  renderSummary(favorites);
}

async function init() {
  grid.innerHTML = renderSkeletons(Math.max(getFavorites().length, 1));
  try {
    allLaptops = await loadLaptops();
    render();
  } catch (error) {
    grid.innerHTML = "";
    showError("favorites-error", error.message);
  }
}

setupFavoriteButtons(grid, render);

clearButton.addEventListener("click", () => {
  clearFavorites();
  render();
});

init();
