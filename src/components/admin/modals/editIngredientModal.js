import React, { useState, useEffect } from "react";
import "./editIngredientModal.css";

const API_BASE_URL = process.env.INGREDIENTS_API_URL;
const getAuthToken = () => localStorage.getItem("access_token");

function EditIngredientModal({ ingredient, onClose, onUpdate }) {
    const [IngredientName, setIngredientName] = useState("");
    const [Amount, setAmount] = useState("");
    const [Measurement, setMeasurement] = useState("");
    const [BestBeforeDate, setBestBeforeDate] = useState("");
    const [ExpirationDate, setExpirationDate] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        IngredientName: "",
        Amount: "",
        Measurement: "",
        BestBeforeDate: "",
        ExpirationDate: ""
    });

    useEffect(() => {
        console.log("ingredient:", ingredient);
        if (ingredient) {
            setIngredientName(ingredient.name || "");
            setAmount(ingredient.amount || "");
            setMeasurement(ingredient.measurement || "");
            setBestBeforeDate(ingredient.bestBeforeDate || "");
            setExpirationDate(ingredient.expirationDate || "");     
        }
    }, [ingredient]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = getAuthToken();
        if (!token) {
            alert("Authentication token not found.");
            return;
        }

        const payload = {
            IngredientName: IngredientName,
            Amount: parseFloat(Amount),
            Measurement: Measurement,
            BestBeforeDate: BestBeforeDate,
            ExpirationDate: ExpirationDate
        };

        setIsLoading(true);

        // update product
        try {
            const response = await fetch(`${API_BASE_URL}/ingredients/ingredients/${ingredient.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to update ingredient.");
            }

            const updatedData = await response.json();
            onUpdate(updatedData);
            onClose();
        } catch (error) {
            console.error("Error updating ingredient:", error);
            alert("Error updating ingredient.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="editIngredient-modal-overlay">
            <div className="editIngredient-modal">
                <h2>Edit Ingredient</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Ingredient Name:
                        <input
                            type="text"
                            name="IngredientName"
                            value={IngredientName}
                            onChange={(e) => {
                                setIngredientName(e.target.value);
                                if (form.IngredientName) setForm(prev => ({ ...prev, IngredientName: "" }));
                            }}
                            className={form.IngredientName ? "editIngredient-error" : ""}
                            required
                        />
                    </label>

                    <div className="ingredient-group">
                        <div className="ingredient-amount">
                            <label>
                                Amount:
                                <input
                                    type="number"
                                    name="Amount"
                                    value={Amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                        if (form.Amount) setForm(prev => ({ ...prev, Amount: "" }));
                                    }}
                                    className={form.Amount ? "editIngredient-error" : ""}
                                    required
                                />
                            </label>
                        </div>
                        <div className="ingredient-measurement">
                            <label>
                                Unit:
                                <input
                                    type="text"
                                    name="Measurement"
                                    value={Measurement}
                                    onChange={(e) => {
                                        setMeasurement(e.target.value);
                                        if (form.Measurement) setForm(prev => ({ ...prev, Measurement: "" }));
                                    }}
                                    className={form.Measurement ? "editIngredient-error" : ""}
                                    required

                                />
                            </label>
                        </div>
                    </div>

                    <div className="ingredient-group">
                        <div className="ingredient-bestBefore">
                            <label>
                                Best Before Date:
                                <input
                                    type="date"
                                    name="BestBeforeDate"
                                    value={BestBeforeDate}
                                    onChange={(e) => {
                                        setBestBeforeDate(e.target.value);
                                        if (form.BestBeforeDate) setForm(prev => ({ ...prev, BestBeforeDate: "" }));
                                    }}
                                    className={form.BestBeforeDate ? "editIngredient-error" : ""}
                                    required
                                />
                            </label>
                        </div>
                        <div className="ingredient-expiration">
                            <label>
                                Expiration Date:
                                <input
                                    type="date"
                                    name="ExpirationDate"
                                    value={ExpirationDate}
                                    onChange={(e) => {
                                        setExpirationDate(e.target.value);
                                        if (form.ExpirationDate) setForm(prev => ({ ...prev, ExpirationDate: "" }));
                                    }}
                                    className={form.ExpirationDate ? "editIngredient-error" : ""}
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    <div className="editIngredient-modal-buttons">
                        <button type="submit" className="editIngredient-save-button" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" className="editIngredient-cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditIngredientModal;