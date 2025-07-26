import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import productApi from "../api/api";
import { toast } from "react-toastify";

function AddItem() {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setNewVariant("colors");
    setSubVariants([]);
    setShow(false);
  };
  const handleShow = () => {
    setSubVariants([]);
    setNewVariant("colors");
    setShow(true);
  };

  const [formInput, setFormInput] = useState({ name: "", image: "" });
  const [variants, setVariants] = useState([]);
  const [subVariants, setSubVariants] = useState([]);
  const [newSubVariant, setNewSubVariant] = useState("");
  const [newVariant, setNewVariant] = useState("colors");

  const formSubmit = async (e) => {
    e.preventDefault();
    if (!formInput.name) {
      toast.warn("Input Product Name");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", formInput.name);
      formData.append("variants", JSON.stringify(variants));

      if (formInput.image) {
        formData.append("image", formInput.image);
      }
      const response = await productApi.post("/products/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`Product created : ${formInput.name}`);
      setFormInput({ name: "", image: "" });
      setVariants([]);
    } catch (error) {
      if (error.status === 401) toast.warn("authorize first!");
      else if (error.status === 400) toast.error(error.response?.data?.error);
      else toast.warn("Invalid Input");
    }
  };

  const addVariant = () => {
    if (subVariants.length === 0) {
      toast.warn("Add at least one option before saving");
      return;
    }
    setVariants([...variants, { name: newVariant, options: subVariants }]);
    handleClose();
  };
  const addSubVariant = () => {
    if (newSubVariant.length === 0) {
      toast.warn("enter a valid option");
      return;
    }

    if (subVariants.includes(newSubVariant.trim())) {
      toast.warn("Option already exists");
      return;
    }
    setSubVariants([...subVariants, newSubVariant]);
    setNewSubVariant("");
  };

  return (
    <>
      <div className="flex-grow-1 d-flex justify-content-center mt-5">
        <div
          className="w-50 border p-2 border-secondary rounded-1"
          style={{ height: "fit-content" }}
        >
          <form action="">
            <h3>Add New Product</h3>
            <hr />
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              value={formInput.name}
              className="form-control"
              required
              placeholder="Input product name"
              onChange={(e) =>
                setFormInput({ ...formInput, name: e.target.value })
              }
            />
            <label htmlFor="image">Image ( optional)</label>
            <input
              type="file"
              id="image"
              className="form-control"
              onChange={(e) =>
                setFormInput({ ...formInput, image: e.target.files?.[0] })
              }
            />
            <hr />
            <h5>Product Variants</h5>
            <button
              className=" btn btn-sm btn-dark border border-secondary"
              type="button"
              onClick={handleShow}
            >
              Create Variants
            </button>

            {variants.map((i, j) => (
              <div key={j} className="border p-1 ps-3">
                <h6>{i.name}:</h6>
                {i.options.map((k, l) => (
                  <span className="fs-" key={l}>
                    {k}, </span>
                ))}
              </div>
            ))}

            <Modal show={show} onHide={handleClose}>
              <Modal.Header
                closeButton
                className="bg-dark text-white border-0 pb-0"
              >
                <h6>Variant Selection</h6>
              </Modal.Header>
              <Modal.Body className="bg-dark text-white pt-0 d-flex flex-column gap-2">
                <select
                  className="form-control"
                  onChange={(e) => setNewVariant(e.target.value)}
                >
                  <option value="colors">colors</option>
                  <option value="sizes">size</option>
                  <option value="materials">material</option>
                  <option value="lengths">length</option>
                  <option value="widths">width</option>
                  <option value="weights">weight</option>
                  <option value="patterns">pattern</option>
                  <option value="models">model</option>
                </select>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Input variant option"
                    value={newSubVariant}
                    onChange={(e) => setNewSubVariant(e.target.value)}
                  />
                  <input
                    type="button"
                    className="btn btn-success"
                    value="add"
                    onClick={() => addSubVariant()}
                  />
                </div>
                <hr />
                <div className="">
                  <h6>subVariants:</h6>
                  <div className="d-flex w-50 flex-column gap-1">
                    {subVariants.map((i, j) => (
                      <div
                        key={j}
                        className="bg-dark ps-3 pe-3 d-flex border-secondary border align-items-center justify-content-between"
                      >
                        <span>{i}</span>
                        <button
                          className="btn btn-dark"
                          onClick={() =>
                            setSubVariants((prev) =>
                              prev.filter((_, ind) => ind !== j)
                            )
                          }
                        >
                          delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => addVariant()}
                  >
                    Submit
                  </button>
                  <button
                    type="reset"
                    onClick={handleClose}
                    className="btn btn-success"
                  >
                    Cancel
                  </button>
                </div>
              </Modal.Body>
            </Modal>

            <div className="d-flex gap-2">
              <button
                className="btn btn-success mt-3"
                onClick={(e) => formSubmit(e)}
              >
                Create Product
              </button>
              <button type="reset" className="btn btn-secondary mt-3">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddItem;
