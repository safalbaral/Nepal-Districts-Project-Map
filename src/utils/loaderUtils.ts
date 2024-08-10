export const loadProjectsData = async (setProjectsData) => {
  try {
    const response = await fetch("/src/data/projects-data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("PROJECTS DATA", data);
    setProjectsData(data);
  } catch (e) {
    console.error("Error loading projects data:", e);
  }
};

export const loadMarkerData = async (setMarkerData) => {
  try {
    const response = await fetch("/src/data/marker-data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("MARK DATA", data);
    setMarkerData(data);
  } catch (e) {
    console.error("Error loading marker data:", e);
    setError(`Failed to load marker data: ${e.message}`);
  }
};
export const loadGeoJSON = async (url, setData, setError) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setData(data);
    return data;
  } catch (e) {
    console.error(`Error loading GeoJSON from ${url}:`, e);
    setError(`Failed to load GeoJSON: ${e.message}`);
  }
};

export const loadProvinces = async (
  setProvincesData,
  setMapBounds,
  setError
) => {
  const data = await loadGeoJSON(
    "/nepalgeojson/country/province.geojson",
    setProvincesData,
    setError
  );
  if (data && data.features && data.features.length > 0) {
    const bounds = L.geoJSON(data).getBounds();
    setMapBounds(bounds);
  } else {
    setError("GeoJSON data is empty or invalid");
  }
};
