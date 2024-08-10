import React, { useEffect, useState } from "react";
import "../styles.css";
import Map from "./Map";
import { loadProjectsData } from "../utils/loaderUtils";
import BigStats from "./BigStats";

const DataDisplay = ({ selectedRegion, selectedMarker, projectsData }) => {
  let dashboardProjects;
  if (projectsData && selectedMarker) {
    dashboardProjects = projectsData.filter((project) =>
      project.district.includes(selectedMarker.district)
    ); //TODO: Possibly make case insensitive because of chance of data value mismatch?
    console.log("Dashboard projects", dashboardProjects);
  }
  return (
    <>
      {projectsData ? (
        selectedMarker ? (
          <div className="w-full max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {dashboardProjects.map((project, index) => {
              return (
                <div className="bg-white flex w-full p-4 rounded-xl flex-row mb-4">
                  <div className="flex flex-col">
                    <div className="flex flex-col pb-2">
                      <div className="text-2xl font-normal">{project.name}</div>
                      {project.ongoing ? (
                        <div className="mt-2 max-w-fit flex border border-blue-500 rounded-full p-1 text-xs justify-center mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 self-center"></div>
                          <p className="font-semibold text-blue-500">ONGOING</p>
                        </div>
                      ) : null}
                    </div>
                    <div className="pb-2 font-light">{project.description}</div>
                    <div className="font-extralight">
                      {project.district.length > 1
                        ? "Locations: "
                        : "Location: "}
                      {project.district.map((district, districtIndex) => (
                        <React.Fragment key={districtIndex}>
                          {district}
                          {districtIndex !== project.district.length - 1 &&
                            ", "}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div
                    onClick={() => window.open(project.url, "_blank")}
                    className="flex justify-center align-middle cursor-pointer hover:bg-blue-100 text-blue-500 text-sm border-blue-500 border-2 ml-auto self-center p-2 rounded-2xl"
                  >
                    View Project
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-pretty text-2xl">
            Click a marker on the map to view associated projects
          </p>
        )
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-bold mb-4 text-center">LOADING</h2>
        </div>
      )}
    </>
  );
};

const Dashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [projectsData, setProjectsData] = useState(null);
  const [districtProjectNumber, setDistrictProjectNumber] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (projectsData && selectedMarker) {
      const selectionProjects = projectsData.filter((project) =>
        project.district.includes(selectedMarker.district)
      );
      setDistrictProjectNumber(selectionProjects.length);
    }
  }, [selectedMarker, projectsData]);

  useEffect(() => {
    loadProjectsData(setProjectsData, setError);
    if (error) {
      console.error("Error in loading marker (district) data", error);
    }
  }, []);

  const handleRegionSelect = (region) => {
    console.log("SELECTED region", region);
    setSelectedRegion(region);
    console.log("proects", projectsData);
  };

  return (
    <div
      className="flex h-screen overflow-scroll pb-12 max-sm:flex-col-reverse"
      style={{ backgroundColor: "#0275c8" }}
    >
      <div className="flex-1 p-4" style={{ backgroundColor: "#0275c8" }}>
        <div className="h-full rounded-lg overflow-hidden shadow-lg max-sm:min-h-96">
          <Map
            onRegionSelect={handleRegionSelect}
            onMarkerSelect={setSelectedMarker}
          />
        </div>
      </div>
      <div
        className="flex flex-col w-full sm:w-1/3 rounded-2xl mr-4 mt-4 h-fit"
        style={{ backgroundColor: "#e6f3fe" }}
      >
        <BigStats
          selectedMarker={selectedMarker}
          totalProjectsInSelected={districtProjectNumber}
        />
        <div
          className="py-4 text-pretty text-3xl font-bold text-center"
          style={{ color: "#0275c8" }}
        >
          Projects List
        </div>
        <div className="w-full p-4 flex items-center">
          <DataDisplay
            selectedRegion={selectedRegion}
            selectedMarker={selectedMarker}
            projectsData={projectsData}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
