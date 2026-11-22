const DAtA_URL = "data/laptops.json";

export async function loadLaptops() {
    try{
        const response = await fetch(DAtA_URL);
        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    }catch(error){
        console.error(error);
        throw new Error("Could not load laptop data.");
    }
}