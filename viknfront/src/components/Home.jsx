import React, { useEffect, useState } from "react";
import axios from "axios";
import productApi from "../api/api";
import InventoryTable from "./InventoryTable";
import Navbar from "./Navbar";
import SideBar from "./SideBar";

function Home() {


  return (
    <>
    <Navbar/>

      <div className="d-flex w-100 w-100 vh-100 d-flex">
        <SideBar/>
        <div className="table-container" >
          <InventoryTable/>
        </div>
      </div>
    </>
  );
}

export default Home;
