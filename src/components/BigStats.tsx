import { useEffect, useState } from "react";
import { loadProjectsData } from "../utils/loaderUtils";

const BigStats = ({ selectedMarker, totalProjectsInSelected }) => {
  const [projectsData, setProjectsData] = useState(null);
  const [totalDistricts, setTotalDistricts] = useState(null);

  useEffect(() => {
    loadProjectsData(setProjectsData);
    const calculateUniqueDistricts = () => {
      // Use a Set to keep track of unique districts
      const uniqueDistricts = new Set();

      projectsData.forEach((project) => {
        // Add each district in the current project's district array to the Set
        project.district.forEach((district) => {
          uniqueDistricts.add(district);
        });
      });
      setTotalDistricts(uniqueDistricts.size);
    };

    if (projectsData) {
      calculateUniqueDistricts();
    }
  }, []);

  if (selectedMarker) {
    return (
      <div>
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg">
          <div className="text-3xl font-bold mb-2">
            {totalProjectsInSelected} Projects Completed
          </div>
          <div className="text-xl">In {selectedMarker.district} District</div>
        </div>
      </div>
    );
  }

  return !projectsData ? (
    <div className="flex items-center justify-center h-screen text-lg font-semibold">
      Loading...
    </div>
  ) : (
    <div>
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg">
        <div className="text-3xl font-bold mb-2">
          {projectsData.length} Projects Completed
        </div>
        <div className="text-xl">Across {totalDistricts} Districts</div>
      </div>
    </div>
  );
};

export default BigStats;
