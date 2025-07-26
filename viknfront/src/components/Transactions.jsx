import React, { useEffect, useState } from 'react'
import productApi from '../api/api';

function Transactions() {
const [sales, setSales] = useState([]);
const [dates, setDates] = useState({ start: "", end: "" });

const fetchData = async () => {
  try {
    const res = await productApi.get("/products/stockreport/", {
      params: {
        start: dates.start,
        end: dates.end
      }
    });
    setSales(res.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchData();
}, []); 

  return (
    <>
        <div className="flex-grow-1 " >
          <h4 className="p-2 text-center">Transactions</h4>
          <div className="input-group p-5 pt-3">
            <span className="input-group-text">from</span>
            <input type="date" className="form-control" onChange={(e)=>setDates(prev => ({ ...prev, start: e.target.value }))} />
            <span className="input-group-text">to</span>
            <input type="date" className="form-control" onChange={(e)=>setDates(prev => ({ ...prev, end: e.target.value }))}/>
            <button className="btn btn-secondary" type="button" id="button-addon2" onClick={()=>fetchData()}>Search</button>
          </div>
          <div className="w-100">
            <table className="w-100 table-dark text-center border border-secondary table-hover table table-striped m-0 ">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>action</th>
                  <th>quantity</th>
                  <th>Date</th>
                  <th>time</th>
                  <th>user</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((i, j) => (
                  <tr key={j}>
                    <td>{i.product}</td>
                    <td>{i.action}</td>
                    <td>{i.quantity}</td>
                    <td>{i.date}</td>
                    <td>{i.time}</td>
                    <td>{i.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </>
  )
}

export default Transactions