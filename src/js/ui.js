import { getTheme, setTheme, isFavorite, toggleFavorite } from "./storage.js";

export const formatPrice = (price) => `${price.toLocaleString("en-EG")} EGP`;

function applyTheme(theme) {
  if (theme === "performance") {
    document.documentElement.dataset.theme = "performance";
  } else {
    delete document.documentElement.dataset.theme;
  }
  const button = document.getElementById("theme-toggle");
  if (button) button.textContent = theme === "performance" ? "Performance" : "Battery Saver";
}

export function initThemeSwitch() {
  applyTheme(getTheme());
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const next = getTheme() === "performance" ? "battery" : "performance";
    setTheme(next);
    applyTheme(next);
  });
}

export function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("flex");
    menu.classList.toggle("hidden", !isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

export function showError(elementId, message) {
  const box = document.getElementById(elementId);
  box.textContent = message;
  box.classList.remove("hidden");
}

const favoriteLabel = (saved) => (saved ? "♥ Saved" : "♡ Save");

export function renderLaptopCard(laptop) {
  const saved = isFavorite(laptop.id);
  return `
    <article class="laptop-card flex flex-col">
      <img src="${laptop.image}" alt="${laptop.name}" class="h-40 w-full rounded-lg bg-page object-contain" loading="lazy">
      <div class="mt-4 flex items-start justify-between gap-2">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-ink/60">${laptop.brand}</p>
          <h3 class="text-lg font-bold leading-tight">${laptop.name}</h3>
        </div>
        <span class="shrink-0 rounded-full bg-accent/15 px-2 py-1 text-xs font-semibold text-accent">${laptop.category}</span>
      </div>
      <p class="mt-2 text-2xl font-extrabold text-accent">${formatPrice(laptop.price)}</p>
      <ul class="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-ink/80">
        <li class="col-span-2 truncate" title="${laptop.cpu}">${laptop.cpu}</li>
        <li>${laptop.ramGB} GB RAM</li>
        <li>${laptop.storageGB} GB SSD</li>
        <li>${laptop.batteryHours} h battery</li>
        <li>${laptop.weightKg} kg</li>
      </ul>
      <div class="mt-auto flex gap-2 pt-4">
        <a href="details.html?id=${laptop.id}" class="btn-action flex-1 text-center">View details</a>
        <button type="button" class="fav-btn rounded-lg border border-accent px-3 py-2 text-sm text-accent transition hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent aria-pressed:bg-accent aria-pressed:text-white"
                data-fav-id="${laptop.id}" aria-pressed="${saved}">${favoriteLabel(saved)}</button>
      </div>
    </article>`;
}

export function renderSkeletons(count) {
  const skeleton = `
    <div class="laptop-card animate-pulse hover:translate-y-0" aria-hidden="true">
      <div class="h-40 w-full rounded-lg bg-ink/10"></div>
      <div class="mt-4 h-3 w-1/4 rounded bg-ink/10"></div>
      <div class="mt-2 h-5 w-3/4 rounded bg-ink/10"></div>
      <div class="mt-3 h-7 w-1/2 rounded bg-ink/10"></div>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <div class="h-3 rounded bg-ink/10"></div><div class="h-3 rounded bg-ink/10"></div>
        <div class="h-3 rounded bg-ink/10"></div><div class="h-3 rounded bg-ink/10"></div>
      </div>
      <div class="mt-5 flex gap-2"><div class="h-10 flex-1 rounded-lg bg-ink/10"></div><div class="h-10 w-20 rounded-lg bg-ink/10"></div></div>
    </div>`;
  return Array.from({ length: count }, () => skeleton).join("");
}

export function updateFavoriteButton(button, saved) {
  button.setAttribute("aria-pressed", String(saved));
  button.textContent = favoriteLabel(saved);
}

export function setupFavoriteButtons(container, onChange) {
  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-fav-id]");
    if (!button) return;
    const id = Number(button.dataset.favId);
    const saved = toggleFavorite(id);
    updateFavoriteButton(button, saved);
    onChange?.(id, saved);
  });
}
