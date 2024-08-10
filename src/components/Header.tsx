import "../output.css";

const Header = () => {
  return (
    <div
      className="w-full h-18 flex items-center justify-center shadow-md py-4"
      style={{ backgroundColor: "#0275c8" }}
    >
      <div className="h-fit text-white font-extrabold text-3xl border-white p-2 rounded-full">
        Dashboard Demo
      </div>
    </div>
  );
};

export default Header;
