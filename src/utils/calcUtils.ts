import { loadProjectsData } from "./loaderUtils";

export const calculateProjectsInDistrict = async (district) => {
  try {
    const response = await fetch("/src/data/projects-data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const filteredProjects = data.filter((project) =>
      project.district.includes(district)
    );

    // Return the number of filtered projects
    return filteredProjects.length;
  } catch (e) {
    console.error("Error loading projects data:", e);
  }
};
