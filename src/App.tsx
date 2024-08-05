import "./output.css";
import "leaflet/dist/leaflet.css";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import BigStats from "./components/BigStats";

const App = () => {
  return (
    <div>
      <Header />
      <Dashboard />
    </div>
  );
};

export default App;
