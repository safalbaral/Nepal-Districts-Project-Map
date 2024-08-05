export const getDistrictCenter = (districtName, districtsData) => {
  if (!districtsData) return null;

  const district = districtsData.features.find(
    (feature) =>
      feature.properties.DISTRICT.toLowerCase() === districtName.toLowerCase()
  );

  if (!district) return null;

  const bounds = L.geoJSON(district).getBounds();
  return bounds.getCenter();
};
