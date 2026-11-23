import { loadLaptops } from "./api.js";
import { isInCompare, toggleCompare, isFavorite, toggleFavorite, MAX_COMPARE } from "./storage.js";
import { initThemeSwitch, initNavToggle, formatPrice, setupFavoriteButtons, updateFavoriteButton } from "./ui.js";

initThemeSwitch();
initNavToggle();

const detailsBox = document.getElementById("details");
const errorBox = document.getElementById("details-error");
const errorText = document.getElementById("details-error-text");

const SPEC_ROWS = [
  { label: "Brand", value: (l) => l.brand },
  { label: "Model", value: (l) => l.name },
  { label: "Category", value: (l) => l.category },
  { label: "Price", value: (l) => formatPrice(l.price) },
  { label: "Processor", value: (l) => l.cpu },
  { label: "Memory (RAM)", value: (l) => `${l.ramGB} GB` },
  { label: "Storage", value: (l) => `${l.storageGB} GB SSD` },
  { label: "Battery life", value: (l) => `${l.batteryHours} hours` },
  { label: "Weight", value: (l) => `${l.weightKg} kg` },
  { label: "Screen size", value: (l) => `${l.screenInches}"` },
  { label: "Laptop ID", value: (l) => l.id },
];

const compareLabel = (added) => (added ? "✓ In comparison" : "+ Add to compare");

function showMessage(message) {
  detailsBox.innerHTML = "";
  errorText.textContent = message;
  errorBox.classList.remove("hidden");
}

function renderSkeleton() {
  detailsBox.innerHTML = `
    <div class="grid animate-pulse gap-8 md:grid-cols-2" aria-hidden="true">
      <div class="laptop-card h-72 hover:translate-y-0"><div class="h-full rounded-lg bg-ink/10"></div></div>
      <div class="space-y-4">
        <div class="h-4 w-1/4 rounded bg-ink/10"></div>
        <div class="h-8 w-3/4 rounded bg-ink/10"></div>
        <div class="h-8 w-1/3 rounded bg-ink/10"></div>
        <div class="h-24 rounded bg-ink/10"></div>
      </div>
    </div>`;
}

function renderDetails(laptop) {
  const saved = isFavorite(laptop.id);
  const inCompare = isInCompare(laptop.id);

  detailsBox.innerHTML = `
    <article class="grid gap-8 md:grid-cols-2">
      <div class="laptop-card hover:translate-y-0">
        <img src="${laptop.image}" alt="${laptop.name}" class="h-64 w-full rounded-lg bg-page object-contain md:h-80">
      </div>

      <div>
        <p class="text-sm font-semibold uppercase tracking-wide text-ink/60">${laptop.brand}</p>
        <h1 class="mt-1 text-2xl font-extrabold sm:text-3xl">${laptop.name}</h1>
        <span class="mt-2 inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">${laptop.category}</span>
        <p class="mt-4 text-3xl font-extrabold text-accent">${formatPrice(laptop.price)}</p>
        <p class="mt-4 leading-relaxed text-ink/80">${laptop.description}</p>

        <div id="detail-actions" class="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" class="fav-btn flex-1 rounded-lg border border-accent px-4 py-2 text-accent transition hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent aria-pressed:bg-accent aria-pressed:text-white"
                  data-fav-id="${laptop.id}" aria-pressed="${saved}">${saved ? "♥ Saved" : "♡ Save"}</button>
          <button id="compare-btn" type="button" class="btn-action flex-1" aria-pressed="${inCompare}">${compareLabel(inCompare)}</button>
        </div>
        <p id="compare-msg" class="mt-3 text-sm text-ink/70" aria-live="polite"></p>
      </div>
    </article>

    <section class="mt-10" aria-labelledby="specs-title">
      <h2 id="specs-title" class="mb-4 text-xl font-bold">Full specifications</h2>
      <div class="laptop-card overflow-x-auto p-0 hover:translate-y-0">
        <table class="w-full text-left text-sm">
          <tbody class="divide-y divide-ink/10">
            ${SPEC_ROWS.map((row) => `
              <tr>
                <th scope="row" class="w-1/3 px-4 py-3 font-medium text-ink/60">${row.label}</th>
                <td class="px-4 py-3 font-semibold">${row.value(laptop)}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;

  document.title = `${laptop.name} | Student Laptop Finder`;
  setupCompareButton(laptop.id);
}

function setupCompareButton(id) {
  const button = document.getElementById("compare-btn");
  const message = document.getElementById("compare-msg");
  const favButton = detailsBox.querySelector("[data-fav-id]");

  button.addEventListener("click", () => {
    const { added, blocked } = toggleCompare(id);
    if (blocked) {
      message.textContent = `You can compare up to ${MAX_COMPARE} laptops. Remove one on the compare page first.`;
      return;
    }
    if (added && !isFavorite(id)) {
      toggleFavorite(id);
      updateFavoriteButton(favButton, true);
    }
    button.textContent = compareLabel(added);
    button.setAttribute("aria-pressed", String(added));
    message.innerHTML = added ? `Added. <a href="compare.html" class="text-accent underline">Open comparison</a>` : "Removed from comparison.";
  });
}

async function init() {
  const idParam = new URLSearchParams(window.location.search).get("id");
  const id = Number(idParam);
  if (!idParam || !Number.isInteger(id)) {
    showMessage("No laptop was selected. Pick one from the catalogue.");
    return;
  }

  renderSkeleton();
  try {
    const laptops = await loadLaptops();
    const laptop = laptops.find((item) => item.id === id);
    if (!laptop) {
      showMessage(`We couldn't find a laptop with id ${id}.`);
      return;
    }
    renderDetails(laptop);
  } catch (error) {
    showMessage(error.message);
  }
}

setupFavoriteButtons(detailsBox);
init();
