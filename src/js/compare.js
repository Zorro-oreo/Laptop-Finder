import { formatPrice } from "./ui.js";

export const COMPARE_ROWS = [
  { key: "price", label: "Price", best: "min", format: (v) => formatPrice(v) },
  { key: "brand", label: "Brand", best: null, format: (v) => v },
  { key: "category", label: "Category", best: null, format: (v) => v },
  { key: "cpu", label: "Processor", best: null, format: (v) => v },
  { key: "ramGB", label: "RAM", best: "max", format: (v) => `${v} GB` },
  { key: "storageGB", label: "Storage", best: "max", format: (v) => `${v} GB` },
  { key: "batteryHours", label: "Battery life", best: "max", format: (v) => `${v} h` },
  { key: "weightKg", label: "Weight", best: "min", format: (v) => `${v} kg` },
  { key: "screenInches", label: "Screen", best: null, format: (v) => `${v}"` },
];

export function findBestValues(laptops) {
  return COMPARE_ROWS.filter((row) => row.best).reduce((best, row) => {
    const values = laptops.map((laptop) => laptop[row.key]);
    const allEqual = values.every((value) => value === values[0]);
    if (!allEqual) {
      best[row.key] = values.reduce((winner, value) =>
        row.best === "min" ? Math.min(winner, value) : Math.max(winner, value));
    }
    return best;
  }, {});
}

export const isBestValue = (bestValues, key, value) => key in bestValues && bestValues[key] === value;
