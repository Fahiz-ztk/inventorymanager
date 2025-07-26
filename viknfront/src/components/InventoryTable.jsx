import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import productApi from "../api/api";
import { toast } from "react-toastify";
function InventoryTable() {
  const [products, setProducts] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setselected] = useState({});
  const [stock, setStock] = useState(0);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setStock(0);
  };
  const handleShow = (i) => {
    setShow(true);
    setselected(i);
  };

  function dateTime(value) {
    const d = new Date(value);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  const fetchProducts = async (page = 1) => {
    try {
      const res = await productApi.get(`/products/?page=${page}`);
      const data = res.data;

      setProducts(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStock = async (e, action) => {
    if (stock <= 0 || stock > 99999) {
      toast.error("Invalid amount");
      setStock(0);
      return;
    }

    e.preventDefault();
    try {
      const response = await productApi.post(
        `/products/${selected.ProductID}/stock/`,
        {
          action: action,
          quantity: stock,
        }
      );
      if (action === "add") toast.success("Added stock");
      else toast.success("Removed stock");
      fetchProducts();
      handleClose();
    } catch (error) {
      if (error.status === 401) toast.error("Authorize first");
      else if (error.status === 400) toast.error(error.response?.data?.error);
      else toast.error("Invalid Input");
    }
  };

  return (
    <>
      <div className="flex-grow-1">
        <h4 className="p-2 text-center">Products List</h4>
        <div className="w-100">
          <div className="w-100 d-flex justify-content-end align-items-center p-2">
            <div className="d-flex gap-2 mt-4 align-items-center">
              <button className="btn btn-secondary"
                disabled={!prevPage}
                onClick={() => fetchProducts(currentPage - 1)}
              >
                prev
              </button>
              <span>Page {currentPage}</span>
              <button className="btn btn-secondary"
                disabled={!nextPage}
                onClick={() => fetchProducts(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
          <table className="w-100 table-dark text-center border border-secondary table-hover table table-striped m-0 ">
            <thead>
              <tr>
                <th>ProductID</th>
                <th>ProductCode</th>
                <th>Name</th>
                <th>Stock</th>
                <th>Created by</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {products.map((i, j) => (
                <tr
                  key={j}
                  className="cursor-pointer"
                  onClick={() => handleShow(i)}
                >
                  <td>{i.ProductID}</td>
                  <td>{i.ProductCode}</td>
                  <td>{i.ProductName}</td>
                  <td>{Math.floor(i.TotalStock)}</td>
                  <td>{i.CreatedUser}</td>
                  <td>{dateTime(i.CreatedDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="bg-dark text-white border-0 pb-0">
          <h3>{selected.ProductName}</h3>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white pt-0 d-flex flex-column gap-2">
          <form className="d-flex flex-column gap-1">
            <hr />
            {selected.ProductImage && (
              <div
                style={{ height: "400px" }}
                className="d-flex justify-content-center"
              >
                <img src={selected.ProductImage} height={"100%"} alt="" />
              </div>
            )}
            <p>
              <>Product ID/Code:</> {selected.ProductID}:{selected.ProductCode}
            </p>
            <p>
              <b>Current stock:</b> {Math.floor(selected.TotalStock)}
            </p>
            <div>
              {selected.variants &&
                selected.variants.map((i, j) => (
                  <div key={j} className="border border-secondary mt-1 p-2">
                    <h5>{i.name} :</h5>
                    {i.subvariants.map((a, b) => (
                      <span key={b}>{a.value} </span>
                    ))}
                  </div>
                ))}
            </div>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={stock}
                placeholder="Stock amount"
                onChange={(e) => setStock(e.target.value)}
              />
              <button
                className="btn btn-secondary"
                type="button"
                onClick={(e) => updateStock(e, "add")}
              >
                Purchase
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={(e) => updateStock(e, "remove")}
              >
                {" "}
                Sale{" "}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default InventoryTable;
