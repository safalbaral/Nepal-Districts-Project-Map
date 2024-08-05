import { MapContainer, GeoJSON, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

import { getDistrictCenter } from "../utils/mapUtils";

function SetMapView({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds, map]);
  return null;
}

function ZoomHandler({ setShowDistricts, setShowMunicipalities }) {
  const map = useMap();
  useEffect(() => {
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      if (currentZoom >= 9.5) {
        setShowDistricts(true);
        setShowMunicipalities(false);
      } else if (currentZoom >= 9) {
        setShowMunicipalities(true);
        setShowDistricts(false);
      } else {
        setShowDistricts(false);
        setShowMunicipalities(false);
      }
    };
    map.on("zoomend", handleZoomEnd);
    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map, setShowDistricts, setShowMunicipalities]);
  return null;
}

const Map = ({ onRegionSelect }) => {
  const [provincesData, setProvincesData] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [error, setError] = useState(null);
  const [districtsData, setDistrictsData] = useState(null);
  const [municipalitiesData, setMunicipalitiesData] = useState(null);
  //const [showDistricts, setShowDistricts] = useState(false);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showMunicipalities, setShowMunicipalities] = useState(false);
  const [markerData, setMarkerData] = useState(null);

  const loadGeoJSON = async (url, setData) => {
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

  useEffect(() => {
    const loadProvinces = async () => {
      const data = await loadGeoJSON(
        "/src/assets/nepalgeojson/country/province.geojson",
        setProvincesData
      );
      if (data && data.features && data.features.length > 0) {
        const bounds = L.geoJSON(data).getBounds();
        setMapBounds(bounds);
      } else {
        setError("GeoJSON data is empty or invalid");
      }
    };
    loadProvinces();

    const loadMarkerData = async () => {
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
    loadMarkerData();
  }, []);

  useEffect(() => {
    if (showDistricts && !districtsData) {
      loadGeoJSON(
        "/src/assets/nepalgeojson/country/district.geojson",
        setDistrictsData
      );
    }
    if (showMunicipalities && !municipalitiesData) {
      loadGeoJSON(
        "/src/assets/nepalgeojson/country/municipality.geojson",
        setMunicipalitiesData
      );
    }
  }, [showDistricts, showMunicipalities, districtsData, municipalitiesData]);

  const style = () => {
    return {
      fillColor: "#0275c8",
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: "#febb4a",
          fillOpacity: 0.9,
        });
        if (feature.properties && feature.properties.PR_NAME) {
          layer.bindTooltip(feature.properties.PR_NAME).openTooltip();
        } else if (feature.properties && feature.properties.DISTRICT) {
          if (feature.properties.GaPa_NaPa) {
            layer.bindTooltip(feature.properties.GaPa_NaPa).openTooltip();
          } else {
            layer.bindTooltip(feature.properties.DISTRICT).openTooltip();
          }
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(style());
        layer.unbindTooltip();
      },
      click: (e) => {
        const region = e.target.feature.properties;
        onRegionSelect({
          name: region.PR_NAME || region.DISTRICT || region.GaPa_NaPa,
        });
      },
    });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <MapContainer
      center={[28.3949, 84.124]}
      zoom={7}
      scrollWheelZoom={true}
      className="h-full w-full"
      style={{ background: "white" }}
    >
      {mapBounds && <SetMapView bounds={mapBounds} />}
      {/*      <ZoomHandler
        setShowDistricts={setShowDistricts}
        setShowMunicipalities={setShowMunicipalities}
      />*/}
      {/*      {provincesData && (
        <GeoJSON
          data={provincesData}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}*/}
      {showDistricts && districtsData && (
        <GeoJSON
          data={districtsData}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}
      {markerData &&
        districtsData &&
        markerData.map((marker, index) => {
          const center = getDistrictCenter(marker.district, districtsData);
          return center ? (
            <Marker key={index} position={[center.lat, center.lng]}>
              <Popup>
                <h3>{marker.name}</h3>
                <p>{marker.description}</p>
                <p>District: {marker.district}</p>
              </Popup>
            </Marker>
          ) : null;
        })}

      {/*      {showMunicipalities && municipalitiesData && (
        <GeoJSON
          data={municipalitiesData}
          style={style}
          onEachFeature={onEachFeature}
        />
      )}*/}
    </MapContainer>
  );
};

export default Map;
