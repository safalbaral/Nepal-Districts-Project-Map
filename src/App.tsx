import React, { useEffect, useState } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import "./output.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function SetMapView({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds);
    }
  }, [bounds, map]);
  return null;
}

function ZoomHandler({ setShowDistricts }) {
  const map = useMap();
  useEffect(() => {
    const handleZoomEnd = () => {
      const currentZoom = map.getZoom();
      if (currentZoom >= 9.5) {
        // Adjust this threshold as needed
        setShowDistricts(true);
      } else {
        setShowDistricts(false);
      }
    };
    map.on("zoomend", handleZoomEnd);
    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map, setShowDistricts]);
  return null;
}

function App() {
  const [provincesData, setProvincesData] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [error, setError] = useState(null);
  const [districtsData, setDistrictsData] = useState(null);
  const [showDistricts, setShowDistricts] = useState(false);

  const loadDistricts = async () => {
    try {
      const response = await fetch(
        "/src/assets/nepalgeojson/country/district.geojson"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Loaded Districts GeoJSON data:", data);
      setDistrictsData(data);
    } catch (e) {
      console.error("Error loading Districts GeoJSON:", e);
      setError(`Failed to load Districts GeoJSON: ${e.message}`);
    }
  };

  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const response = await fetch(
          "/src/assets/nepalgeojson/country/province.geojson"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Loaded GeoJSON data:", data);
        setProvincesData(data);
        if (data && data.features && data.features.length > 0) {
          const bounds = L.geoJSON(data).getBounds();
          setMapBounds(bounds);
        } else {
          setError("GeoJSON data is empty or invalid");
        }
      } catch (e) {
        console.error("Error loading GeoJSON:", e);
        setError(`Failed to load GeoJSON: ${e.message}`);
      }
    };
    loadProvinces();
  }, []);

  useEffect(() => {
    if (showDistricts && !districtsData) {
      loadDistricts();
    }
  }, [showDistricts, districtsData]);

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
        console.log("feature", feature);
        if (feature.properties && feature.properties.PR_NAME) {
          layer.bindTooltip(feature.properties.PR_NAME).openTooltip();
        } else if (feature.properties && feature.properties.DISTRICT) {
          layer.bindTooltip(feature.properties.DISTRICT).openTooltip();
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(style());
        layer.unbindTooltip();
      },
    });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[28.3949, 84.124]}
        zoom={7}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ background: "white" }}
      >
        {mapBounds && <SetMapView bounds={mapBounds} />}
        <ZoomHandler setShowDistricts={setShowDistricts} />
        {provincesData && (
          <GeoJSON
            data={provincesData}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
        {showDistricts && districtsData && (
          <GeoJSON
            data={districtsData}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default App;
