import React, { useState, useEffect } from "react";
import "./addProductModal.css";

const API_BASE_URL = process.env.TYPE_API_URL;
const BASE_URL = process.env.PRODUCTS_API_URL;
const getAuthToken = () => localStorage.getItem("access_token");

function AddProductModal({ onClose, onSubmit }) {
    const [productTypes, setProductTypes] = useState([]);
    const [productTypeID, setProductTypeID] = useState("");
    const [productName, setProductName] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productDescription, setProductDescription] = useState("");

    const [errors, setErrors] = useState({
        productTypeID: "",
        productName: "",
        productCategory: "",
        productDescription: ""
    });

    useEffect(() => {
        const fetchProductTypes = async () => {
            const token = getAuthToken();
            if (!token) {
                alert("Authentication token not found.");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch product types");

                const data = await response.json();
                setProductTypes(data);
            } catch (error) {
                console.error("Error fetching product types:", error);
                alert("Failed to fetch product types.");
            }
        };

        fetchProductTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!productTypeID) newErrors.productTypeID = "This field is required";
        if (!productName) newErrors.productName = "This field is required";
        if (!productCategory) newErrors.productCategory = "This field is required";
        if (!productDescription) newErrors.productDescription = "This field is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const token = getAuthToken();
            if (!token) {
                alert("Authentication token not found.");
                return;
            }

            const newProduct = {
                ProductTypeID: parseInt(productTypeID),
                ProductName: productName,
                ProductCategory: productCategory,
                ProductDescription: productDescription
            };

            try {
                const response = await fetch(`${BASE_URL}/products/products/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(newProduct)
                });

                if (!response.ok) {
                    throw new Error("Failed to add product.");
                }

                const result = await response.json();
                if (onSubmit) onSubmit(result);
                onClose();

            } catch (error) {
                console.error("Error adding product:", error);
                alert("Failed to add product.");
            }
        }
    };


    const handleFocus = (field) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: "",
        }));
    };

    return (
        <div className="addProduct-modal-overlay">
            <div className="addProduct-modal-container">
                <div className="addProduct-modal-header">
                    <h3>Add Product</h3>
                    <span className="addProduct-close-button" onClick={onClose}>&times;</span>
                </div>
                <form className="addProduct-modal-form" onSubmit={handleSubmit}>
                    <label>
                        Product Type <span className="addProduct-required-asterisk">*</span>
                        <select
                            value={productTypeID}
                            onChange={(e) => setProductTypeID(e.target.value)}
                            onFocus={() => handleFocus('productTypeID')}
                            className={errors.productTypeID ? "addProduct-error" : ""}
                        >
                            <option value="">Select a product type</option>
                            {productTypes.map((type) => (
                                <option key={type.productTypeID} value={type.productTypeID}>
                                    {type.productTypeName}
                                </option>
                            ))}
                        </select>
                        {errors.productTypeID && <p className="addProduct-error-message">{errors.productTypeID}</p>}
                    </label>

                    <label>
                        Product Name <span className="addProduct-required-asterisk">*</span>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            onFocus={() => handleFocus('productName')}
                            className={errors.productName ? "addProduct-error" : ""}
                        />
                        {errors.productName && <p className="addProduct-error-message">{errors.productName}</p>}
                    </label>

                    <label>
                        Category <span className="addProduct-required-asterisk">*</span>
                        <input
                            type="text"
                            value={productCategory}
                            onChange={(e) => setProductCategory(e.target.value)}
                            onFocus={() => handleFocus('productCategory')}
                            className={errors.productCategory ? "addProduct-error" : ""}
                        />
                        {errors.productCategory && <p className="addProduct-error-message">{errors.productCategory}</p>}
                    </label>

                    <label>
                        Description <span className="addProduct-required-asterisk">*</span>
                        <textarea
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            onFocus={() => handleFocus('productDescription')}
                            className={errors.productDescription ? "addProduct-error" : ""}
                        />
                        {errors.productDescription && <p className="addProduct-error-message">{errors.productDescription}</p>}
                    </label>

                    <div className="addProduct-button-container">
                        <button className="addProduct-submit-button" type="submit">Add Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;
