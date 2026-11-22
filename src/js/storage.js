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