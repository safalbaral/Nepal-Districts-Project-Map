import React, { useEffect, useState } from "react";
import "../styles.css";
import Map from "./Map";

const DataDisplay = ({ selectedRegion }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-bold mb-4">Region Data</h2>
      {selectedRegion ? (
        <div>
          <p>
            <strong>Name:</strong> {selectedRegion.name}
          </p>
        </div>
      ) : (
        <p>Select a region on the map to view data.</p>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionSelect = (region) => {
    console.log("SELECTED region", region);
    setSelectedRegion(region);
  };

  return (
    <div
      className="flex h-screen overflow-hidden pb-12"
      style={{ backgroundColor: "#0275c8" }}
    >
      <div className="flex-1 p-4" style={{ backgroundColor: "#0275c8" }}>
        <div className="h-full rounded-lg overflow-hidden shadow-lg">
          <Map onRegionSelect={handleRegionSelect} />
        </div>
      </div>
      <div className="flex flex-col w-1/3">
        <div className="py-4 text-pretty text-3xl text-white font-bold text-center">
          Data Visualization Title
        </div>
        <div className="w-full p-4 flex items-center">
          <DataDisplay selectedRegion={selectedRegion} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
