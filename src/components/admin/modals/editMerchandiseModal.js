import React, { useState, useEffect } from "react";
import "./editMerchandiseModal.css";

const API_BASE_URL = process.env.MERCH_API_URL;
const getAuthToken = () => localStorage.getItem("access_token");

function EditMerchandiseModal({ merchandise, onClose, onUpdate }) {
    const [MerchandiseName, setMerchandiseName] = useState("");
    const [Quantity, setQuantity] = useState("");
    const [DateAdded, setDateAdded] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        merchandiseName: "",
        quantity: "",
        dateAdded: ""
    });

    useEffect(() => {
                console.log("merchandise:", merchandise);
                if (merchandise) {
                    setMerchandiseName(merchandise.name || "");
                    setQuantity(merchandise.quantity || "");
                    setDateAdded(merchandise.dateAdded || "");   
                }
        }, [merchandise]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = getAuthToken();
        if (!token) {
            alert("Authentication token not found.");
            return;
        }

        const payload = {
            MerchandiseName: MerchandiseName,
            MerchandiseQuantity: parseFloat(Quantity),
            MerchandiseDateAdded: DateAdded
        };

        setIsLoading(true);

        // update product
        try {
            const response = await fetch(`${API_BASE_URL}/merchandise/merchandise/${merchandise.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to update item.");
            }

            const updatedData = await response.json();
            onUpdate(updatedData);
            onClose();
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Error updating item.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="editMerchandise-modal-overlay">
            <div className="editMerchandise-modal">
                <h2>Edit Merchandise</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={MerchandiseName}
                            onChange={(e) => {
                                setMerchandiseName(e.target.value);
                                if (form.MerchandiseName) setForm(prev => ({ ...prev, MerchandiseName: "" }));
                            }}
                            className={form.MerchandiseName ? "editItem-error" : ""}
                            required
                        />
                    </label>

                    <label>
                        Quantity:
                        <input
                            type="number"
                            name="quantity"
                            value={Quantity}
                            onChange={(e) => {
                                setQuantity(e.target.value);
                                if (form.MerchandiseQuantity) setForm(prev => ({ ...prev, MerchandiseQuantity: "" }));
                            }}
                            className={form.MerchandiseQuantity ? "editItem-error" : ""}
                            required
                        />
                    </label>

                    <label>
                        Date Added:
                        <input
                            type="date"
                            name="dateAdded"
                            value={DateAdded}
                            onChange={(e) => {
                                setDateAdded(e.target.value);
                                if (form.MerchandiseDateAdded) setForm(prev => ({ ...prev, MerchandiseDateAdded: "" }));
                            }}
                            className={form.MerchandiseDateAdded ? "editItem-error" : ""}
                            required
                        />
                    </label>

                    <div className="editMerchandise-modal-buttons">
                        <button type="submit" className="editMerchandise-save-button"disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" className="editMerchandise-cancel-button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditMerchandiseModal;