import React from "react";
import DataBases from "../database/DatabaseList";
import Header from '../layout/Header';

const MainPage = () => {
  return (
    <>
      <Header />
      <DataBases />
    </>
  )
};

export default MainPage;