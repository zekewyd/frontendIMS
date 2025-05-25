import React, { useState, useEffect } from "react";
import "./productTypeModal.css";
import DataTable from "react-data-table-component";
import { FaEdit, FaArchive } from "react-icons/fa";

const ProductTypeModal = ({ onClose }) => {
    const [productTypes, setProductTypes] = useState([]);
    const [showAddFormModal, setShowAddFormModal] = useState(false);
    const [newTypeName, setNewTypeName] = useState("");
    const [editTypeID, setEditTypeID] = useState(null);
    const [editTypeName, setEditTypeName] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Hardcoded product types
        const hardcodedTypes = [
            { productTypeID: 1, productTypeName: "Drinks" },
            { productTypeID: 2, productTypeName: "Foods" },
        ];
        setProductTypes(hardcodedTypes);
    }, []);

    const handleAddType = () => {
        if (newTypeName.trim() === "") {
            alert("Product type name cannot be empty.");
            return;
        }

        const newID = productTypes.length + 1;
        const newType = {
            productTypeID: newID,
            productTypeName: newTypeName,
        };

        setProductTypes([...productTypes, newType]);
        setNewTypeName("");
        setShowAddFormModal(false);
    };
    
    const handleEdit = (type) => {
        setEditTypeID(type.productTypeID);
        setEditTypeName(type.productTypeName);
        setIsEditing(true);
    };

    const handleUpdateType = (e) => {
        e.preventDefault();
        if (editTypeName.trim() === "") {
            alert("Product type name cannot be empty.");
            return;
        }

        const updatedTypes = productTypes.map((type) =>
            type.productTypeID === editTypeID ? { ...type, productTypeName: editTypeName } : type
        );
        setProductTypes(updatedTypes);
        setIsEditing(false);
        setEditTypeID(null);
        setEditTypeName("");
    };

    const handleDelete = (typeId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product type?");
        if (!confirmDelete) return;

        const updatedTypes = productTypes.filter((pt) => pt.productTypeID !== typeId);
        setProductTypes(updatedTypes);
    };



    const columns = [
        { name: "NO.", selector: (row) => row.productTypeID, sortable: true },
        { name: "Name", selector: (row) => row.productTypeName, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <>
                    <button onClick={() => handleEdit(row)} className="icon-button"><FaEdit /></button>
                    <button onClick={() => handleDelete(row.productTypeID)} className="icon-button"><FaArchive /></button>
                </>
            ),
        },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Manage Product Types</h2>

                <button onClick={() => setShowAddFormModal(true)} className="button-primary">Add Product Type</button>

                <DataTable 
                    columns={columns} 
                    data={productTypes} 
                    pagination 
                    customStyles={{
                        headCells: {
                            style: {
                                backgroundColor: "#4B929D",
                                color: "#fff",
                                fontWeight: "600",
                                fontSize: "14px",
                                padding: "12px",
                                textTransform: "uppercase",
                                textAlign: "center",
                                letterSpacing: "1px",
                            },
                        },
                        rows: {
                            style: {
                                minHeight: "55px",
                            },
                        },
                    }}
                />

                {showAddFormModal && (
                    <div className="modal-overlay">
                        <div className="form-modal">
                            <h3>Add New Product Type</h3>
                            <input
                                type="text"
                                value={newTypeName}
                                onChange={(e) => setNewTypeName(e.target.value)}
                                placeholder="Enter type name"
                            />
                            <div className="modal-actions">
                                <button onClick={handleAddType} className="button-primary">Add</button>
                                <button onClick={() => setShowAddFormModal(false)} className="button-secondary">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {isEditing && (
                    <div className="modal-overlay">
                        <div className="form-modal">
                            <h3>Edit Product Type</h3>
                            <form onSubmit={handleUpdateType}>
                                <input
                                    type="text"
                                    value={editTypeName}
                                    onChange={(e) => setEditTypeName(e.target.value)}
                                    placeholder="Edit type name"
                                />
                                <div className="modal-actions">
                                    <button type="submit" className="button-primary">Update</button>
                                    <button onClick={() => setIsEditing(false)} className="button-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <button onClick={onClose} className="button-secondary" style={{ marginTop: "1em" }}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ProductTypeModal;