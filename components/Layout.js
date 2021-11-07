import Head from "next/head";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Nunito:400,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="w-screen h-screen bg-white dark:bg-gray-800 font-nunito">
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default Layout;
