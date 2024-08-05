import { MapContainer, GeoJSON, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

import { getDistrictCenter } from "../utils/mapUtils";
import {
  loadGeoJSON,
  loadMarkerData,
  loadProvinces,
} from "../utils/loaderUtils";

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

const Map = ({ onRegionSelect, onMarkerSelect }) => {
  const [provincesData, setProvincesData] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);
  const [error, setError] = useState(null);
  const [districtsData, setDistrictsData] = useState(null);
  const [municipalitiesData, setMunicipalitiesData] = useState(null);
  //const [showDistricts, setShowDistricts] = useState(false);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showMunicipalities, setShowMunicipalities] = useState(false);
  const [markerData, setMarkerData] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [plottedDistricts, setPlottedDistricts] = useState([]);

  useEffect(() => {
    loadProvinces(setProvincesData, setMapBounds, setError);
    loadMarkerData(setMarkerData, setError);
  }, []);

  useEffect(() => {
    if (showDistricts && !districtsData) {
      loadGeoJSON(
        "/src/assets/nepalgeojson/country/district.geojson",
        setDistrictsData,
        setError
      );
    }
    if (showMunicipalities && !municipalitiesData) {
      loadGeoJSON(
        "/src/assets/nepalgeojson/country/municipality.geojson",
        setMunicipalitiesData,
        setError
      );
    }
  }, [showDistricts, showMunicipalities, districtsData, municipalitiesData]);

  const createCustomIcon = (isSelected) => {
    return L.divIcon({
      className: "custom-icon",
      html: `<div style="
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: ${isSelected ? "#ff0000" : "#0275c8"};
        border: 2px solid white;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-weight: bold;
      ">M</div>`, //TODO: Implement number of projects in district?
    });
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    onMarkerSelect(marker);
    console.log("Marker clicked:", marker);
  };

  // TODO: Change marker function so that markers aren't linked, conditionally display markers only if it hasn't already been plotted
  const renderMarkers = () => {
    if (!markerData || !districtsData) return null;

    // Create a plotted district state
    // For each district, check if it's in plotted district, if not then only render

    return markerData.map((marker, index) => {
      const district = marker.district;
      const center = getDistrictCenter(district, districtsData);
      const isSelected =
        selectedMarker && selectedMarker.district === marker.district;

      return (
        <Marker
          key={`${index}`}
          position={[center.lat, center.lng]}
          icon={createCustomIcon(isSelected)}
          eventHandlers={{
            click: () => handleMarkerClick(marker),
            mouseover: (e) => {
              e.target.openPopup();
            },
            mouseout: (e) => {
              e.target.closePopup();
            },
          }}
        >
          <Popup>
            <h3>{marker.district}</h3>
            <p>Total Projects: {marker.totalProjects}</p>
            <p className="text-gray-500">Click to see projects on sidebar</p>
          </Popup>
        </Marker>
      );
    });

    return markerData.flatMap((marker, index) => {
      const districts = Array.isArray(marker.district)
        ? marker.district
        : [marker.district];

      return districts
        .map((district, districtIndex) => {
          const center = getDistrictCenter(district, districtsData);
          const isSelected =
            selectedMarker && selectedMarker.name === marker.name;

          return center ? (
            <Marker
              key={`${index}-${districtIndex}`}
              position={[center.lat, center.lng]}
              icon={createCustomIcon(isSelected)}
              eventHandlers={{
                click: () => handleMarkerClick(marker),
                mouseover: (e) => {
                  e.target.openPopup();
                },
                mouseout: (e) => {
                  e.target.closePopup();
                },
              }}
            >
              <Popup>
                <h3>{marker.name}</h3>
                <p>{marker.description}</p>
                <p>District: {district}</p>
              </Popup>
            </Marker>
          ) : null;
        })
        .filter(Boolean);
    });
  };

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
      {renderMarkers()}

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
