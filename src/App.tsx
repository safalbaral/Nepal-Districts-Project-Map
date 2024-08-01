import "./output.css";
import "leaflet/dist/leaflet.css";
import Map from "./components/Map";
import Header from "./components/Header";

const App = () => {
  return (
    <div>
      <Header />
      <Map />
    </div>
  );
};

export default App;
