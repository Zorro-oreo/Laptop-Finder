const FAVORITES_KEY = "favorites";
const THEME_KEY = "theme";

export function getFavorites() {
    try {
        const ids = JSON.parse(localStorage.getItem(FAVORITES_KEY));
        return Array.isArray(ids) ? ids : [];
    } catch {
        return [];
    }
}

export function saveFavorite(ids){
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export const isFavorite = (id) => getFavorites().includes(id);

export function toggleFavorite (id) {
    const favorite = getFavorites();
    const updated = favorite.includes(id) ? favorite.filter((favId) => favId !== id) : [...favorite, id];
    saveFavorite(updated);
    // The comparison is picked from favorites, so an unsaved laptop leaves it too
    if (!updated.includes(id)) saveCompareIds(getCompareIds().filter((compareId) => compareId !== id));
    return updated.includes(id);
}

const THEMES = ["battery", "performance"];

export function getTheme() {
    try {
        const theme = JSON.parse(localStorage.getItem(THEME_KEY));
        return THEMES.includes(theme) ? theme : "battery";
    } catch {
        return "battery";
    }
}

export function setTheme(theme){
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
}

const COMPARE_KEY = "compare";
export const MAX_COMPARE = 4;

export function getCompareIds() {
    try {
        const ids = JSON.parse(localStorage.getItem(COMPARE_KEY));
        return Array.isArray(ids) ? ids : [];
    } catch {
        return [];
    }
}

export function saveCompareIds(ids) {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
}

export const isInCompare = (id) => getCompareIds().includes(id);

export function toggleCompare(id) {
    const ids = getCompareIds();
    if (ids.includes(id)) {
        saveCompareIds(ids.filter((compareId) => compareId !== id));
        return { added: false, blocked: false };
    }
    if (ids.length >= MAX_COMPARE) return { added: false, blocked: true };
    saveCompareIds([...ids, id]);
    return { added: true, blocked: false };
}

export function clearFavorites() {
    saveFavorite([]);
    saveCompareIds([]);
}
