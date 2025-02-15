import React from "react";
import HomePage from "@/components/Homepage/Homepage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <HomePage />
      <ToastContainer/>
    </>
  );
};

export default App;
