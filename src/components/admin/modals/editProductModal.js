import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types'; 
import "./editProductModal.css";

const API_BASE_URL = process.env.PRODUCTS_API_URL;
const getAuthToken = () => localStorage.getItem("access_token");

function EditProductModal({ product, onClose, onUpdate }) {
    // camel case the prop
    const [productTypeID, setProductTypeID] = useState("");
    const [productName, setProductName] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productTypes, setProductTypes] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [formErrors, setFormErrors] = useState({
        productTypeID: "",
        productName: "",
        productCategory: "",
    });

    useEffect(() => {
        if (product) {
            setProductTypeID(String(product.productTypeID || ""));
            setProductName(product.productName || "");
            setProductCategory(product.productCategory || "");
            setProductDescription(product.productDescription || "");
        }
    }, [product]);

    // fetch product types
    useEffect(() => {
        const fetchProductTypes = async () => {
            const token = getAuthToken();
            if (!token) {
                setApiError("Authentication token not found. Please log in.");
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/ProductType/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ detail: "Failed to parse error from server" }));
                    throw new Error(errorData.detail || `Failed to fetch product types (${response.status})`);
                }
                const data = await response.json();
                setProductTypes(data);
            } catch (error) {
                console.error("Error fetching product types:", error);
                setApiError(error.message || "Could not fetch product types.");
            }
        };
        fetchProductTypes();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!productTypeID) newErrors.productTypeID = "Product Type is required";
        if (!productName.trim()) newErrors.productName = "Product Name is required";
        if (!productCategory.trim()) newErrors.productCategory = "Product Category is required";

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) {
            return;
        }

        const token = getAuthToken();
        if (!token) {
            setApiError("Authentication token not found. Please log in again.");
            return;
        }

        setIsLoading(true);

        const payloadToApi = {
            ProductTypeID: parseInt(productTypeID, 10),
            ProductName: productName,
            ProductCategory: productCategory,
            ProductDescription: productDescription,
        };

        // update product 
        try {
            const response = await fetch(`${API_BASE_URL}/products/products/${product.productID}`, { 
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payloadToApi), // send pascal case payload
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: `HTTP Error: ${response.status}` }));
                let errorMessage = `Failed to update product. Status: ${response.status};`;
                if (errorData.detail) {
                    if (Array.isArray(errorData.detail)) {
                        errorMessage += `\nDetails: ${errorData.detail.map(d => `${d.loc.join('.')} - ${d.msg}`).join('; ')}`;
                    } else {
                        errorMessage += `\nDetails: ${errorData.detail}`;
                    }
                }
                throw new Error(errorMessage);
            }

            const updatedProductFromServer = await response.json();
            onUpdate(updatedProductFromServer);
            onClose();
        } catch (error) {
            console.error("Error updating product:", error);
            setApiError(error.message || "An unexpected error occurred during update.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="editProduct-modal-overlay">
            <div className="editProduct-modal-container">
                <div className="editProduct-modal-header">
                    <h3>Edit Product</h3>
                    <span className="editProduct-close-button" onClick={onClose}>&times;</span>
                </div>
                {apiError && <p className="error-message" style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{apiError}</p>}
                <form className="editProduct-modal-form" onSubmit={handleSubmit}>
                    <label>
                        Product Type <span className="editProduct-required-asterisk">*</span>
                        <select
                            id="edit-productTypeID"
                            value={productTypeID}
                            onChange={(e) => {
                                setProductTypeID(e.target.value);
                                if (formErrors.productTypeID) setFormErrors(prev => ({ ...prev, productTypeID: "" }));
                            }}
                            className={formErrors.productTypeID ? "editProduct-error" : ""}
                        >
                            <option value="">Select Type</option>
                            {productTypes.map((type) => (
                                <option key={type.productTypeID} value={type.productTypeID}>
                                    {type.productTypeName}
                                </option>
                            ))}
                        </select>
                        {formErrors.productTypeID && <p className="editProduct-error-message">{formErrors.productTypeID}</p>}
                    </label>

                    <label>
                        Product Name <span className="editProduct-required-asterisk">*</span>
                        <input
                            id="edit-productName"
                            type="text"
                            value={productName}
                            onChange={(e) => {
                                setProductName(e.target.value);
                                if (formErrors.productName) setFormErrors(prev => ({ ...prev, productName: "" }));
                            }}
                            className={formErrors.productName ? "editProduct-error" : ""}
                        />
                        {formErrors.productName && <p className="editProduct-error-message">{formErrors.productName}</p>}
                    </label>

                    <label>
                        Category <span className="editProduct-required-asterisk">*</span>
                        <input
                            id="edit-productCategory"
                            type="text"
                            value={productCategory}
                            onChange={(e) => {
                                setProductCategory(e.target.value);
                                if (formErrors.productCategory) setFormErrors(prev => ({ ...prev, productCategory: "" }));
                            }}
                            className={formErrors.productCategory ? "editProduct-error" : ""}
                        />
                        {formErrors.productCategory && <p className="editProduct-error-message">{formErrors.productCategory}</p>}
                    </label>

                    <label>
                        Description
                        <textarea
                            id="edit-productDescription"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                        ></textarea>
                    </label>

                    <div className="editProduct-button-container">
                        <button type="submit" className="editProduct-submit-button" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" className="editProduct-cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditProductModal.propTypes = {
    product: PropTypes.shape({
        productID: PropTypes.number.isRequired,
        productName: PropTypes.string,
        productTypeID: PropTypes.any,
        productCategory: PropTypes.string,
        productDescription: PropTypes.string,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default EditProductModal;