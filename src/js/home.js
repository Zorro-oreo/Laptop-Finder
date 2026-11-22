import { loadLaptops } from "./api.js";
import { getFavorites } from "./storage.js";
import { initThemeSwitch, initNavToggle, formatPrice, showError } from "./ui.js";

initThemeSwitch();
initNavToggle();

async function renderStats() {
  document.getElementById("stat-favorites").textContent = getFavorites().length;

  try {
    const laptops = await loadLaptops();

    const lowestPrice = laptops.reduce((min, laptop) => Math.min(min, laptop.price), Infinity);

    document.getElementById("stat-count").textContent = laptops.length;
    document.getElementById("stat-min-price").textContent = formatPrice(lowestPrice);
  } catch (error) {
    showError("stats-error", error.message);
  }
}

renderStats();