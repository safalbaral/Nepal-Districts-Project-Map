import "../output.css";
import logo from "../assets/logo.svg";

const Header = () => {
  return (
    <div
      className="w-full h-16 flex items-center justify-center shadow-md"
      style={{ backgroundColor: "#0275c8" }}
    >
      <img src={logo} alt="Logo" className="h-10 brightness-0 invert mt-2" />
    </div>
  );
};

export default Header;
