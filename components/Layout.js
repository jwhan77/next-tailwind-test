import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="w-screen h-screen bg-white dark:bg-gray-800">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
