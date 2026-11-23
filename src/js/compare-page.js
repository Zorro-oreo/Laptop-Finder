import { loadLaptops } from "./api.js";
import { getFavorites, getCompareIds, saveCompareIds, toggleCompare, MAX_COMPARE } from "./storage.js";
import { initThemeSwitch, initNavToggle, showError } from "./ui.js";
import { COMPARE_ROWS, findBestValues, isBestValue } from "./compare.js";

initThemeSwitch();
initNavToggle();

const picker = document.getElementById("picker");
const pickerSection = document.getElementById("picker-section");
const selectedCount = document.getElementById("selected-count");
const message = document.getElementById("compare-msg");
const emptyState = document.getElementById("compare-empty");
const hint = document.getElementById("compare-hint");
const tableWrap = document.getElementById("compare-table-wrap");

let favoriteLaptops = [];

const showMessage = (text) => {
  message.textContent = text;
  message.classList.toggle("hidden", !text);
};

function renderPicker() {
  const selectedIds = getCompareIds();
  picker.innerHTML = favoriteLaptops.map((laptop) => `
    <label class="flex cursor-pointer items-center gap-3 rounded-lg border border-ink/15 p-3 transition hover:border-accent has-checked:border-accent has-checked:bg-accent/10">
      <input type="checkbox" value="${laptop.id}" class="size-5 rounded border-ink/30 bg-[#f3f4f6] checked:bg-accent text-page focus:ring-accent" ${selectedIds.includes(laptop.id) ? "checked" : ""}>
      <span class="min-w-0">
        <span class="block truncate font-semibold">${laptop.name}</span>
        <span class="block text-xs text-ink/60">${laptop.brand}</span>
      </span>
    </label>`).join("");
  selectedCount.textContent = `${selectedIds.length} of ${MAX_COMPARE} selected`;
}

function renderTable() {
  const selectedIds = getCompareIds();
  const laptops = favoriteLaptops.filter((laptop) => selectedIds.includes(laptop.id));

  if (laptops.length < 2) {
    tableWrap.innerHTML = "";
    tableWrap.classList.add("hidden");
    hint.classList.remove("hidden");
    return;
  }
  hint.classList.add("hidden");
  tableWrap.classList.remove("hidden");

  const bestValues = findBestValues(laptops);

  tableWrap.innerHTML = `
    <table class="w-full min-w-[40rem] text-left text-sm">
      <thead>
        <tr class="border-b border-ink/10">
          <th scope="col" class="sticky left-0 z-10 w-36 bg-surface px-4 py-4 text-ink/60">Specification</th>
          ${laptops.map((laptop) => `
            <th scope="col" class="px-4 py-4 align-top">
              <img src="${laptop.image}" alt="" class="h-20 w-full rounded-lg bg-page object-contain">
              <a href="details.html?id=${laptop.id}" class="mt-2 block font-bold leading-tight transition hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent">${laptop.name}</a>
              <button type="button" data-remove-id="${laptop.id}" class="mt-2 text-xs text-ink/60 underline transition hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-accent">Remove</button>
            </th>`).join("")}
        </tr>
      </thead>
      <tbody class="divide-y divide-ink/10">
        ${COMPARE_ROWS.map((row) => `
          <tr>
            <th scope="row" class="sticky left-0 z-10 bg-surface px-4 py-3 font-medium text-ink/60">${row.label}</th>
            ${laptops.map((laptop) => {
              const value = laptop[row.key];
              return isBestValue(bestValues, row.key, value)
                ? `<td class="bg-accent/15 px-4 py-3 font-bold text-accent">${row.format(value)} <span class="ml-1 rounded bg-accent px-1.5 py-0.5 text-[10px] uppercase text-white">Best</span></td>`
                : `<td class="px-4 py-3">${row.format(value)}</td>`;
            }).join("")}
          </tr>`).join("")}
      </tbody>
    </table>`;
}

function render() {
  renderPicker();
  renderTable();
}

picker.addEventListener("change", (event) => {
  const checkbox = event.target;
  const { added, blocked } = toggleCompare(Number(checkbox.value));
  if (blocked) {
    checkbox.checked = false;
    showMessage(`You can compare at most ${MAX_COMPARE} laptops. Untick one first.`);
    return;
  }
  showMessage("");
  render();
});

tableWrap.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-id]");
  if (!button) return;
  toggleCompare(Number(button.dataset.removeId));
  showMessage("");
  render();
});

async function init() {
  try {
    const laptops = await loadLaptops();
    const favoriteIds = getFavorites();
    favoriteLaptops = laptops.filter((laptop) => favoriteIds.includes(laptop.id));

    saveCompareIds(getCompareIds().filter((id) => favoriteIds.includes(id)).slice(0, MAX_COMPARE));

    if (favoriteLaptops.length < 2) {
      emptyState.classList.remove("hidden");
      pickerSection.classList.add("hidden");
      hint.classList.add("hidden");
      tableWrap.classList.add("hidden");
      return;
    }
    render();
  } catch (error) {
    pickerSection.classList.add("hidden");
    tableWrap.classList.add("hidden");
    showError("compare-error", error.message);
  }
}

init();
