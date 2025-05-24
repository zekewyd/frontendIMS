import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../admin/merchandise.css"; 
import Sidebar from "../sidebar";
import { FaChevronDown, FaFolderOpen, FaEdit, FaArchive } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddMerchandiseModal from './modals/addMerchandiseModal';
import EditMerchandiseModal from "./modals/editMerchandiseModal";
import ViewMerchandiseModal from "./modals/viewMerchandiseModal";

const API_BASE_URL = process.env.MERCH_API_URL;
const getAuthToken = () => localStorage.getItem("access_token");
const DEFAULT_PROFILE_IMAGE = "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__";

function Merchandise() { 
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [merchandise, setMerchandise] = useState([]);
    const navigate = useNavigate();
    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
    const [loggedInUserDisplay, setLoggedInUserDisplay] = useState({ role: "User", name: "Current User" });

    const [showAddMerchandiseModal, setShowAddMerchandiseModal] = useState(false);
    const [showEditMerchandiseModal, setShowEditMerchandiseModal] = useState(false);
    const [selectedMerchandise, setSelectedMerchandise] = useState(null);
    const [showViewMerchandiseModal, setShowViewMerchandiseModal] = useState(false);

    const currentDate = new Date().toLocaleString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "numeric", minute: "numeric", second: "numeric",
    });

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setLoggedInUserDisplay({
                    name: decodedToken.sub || "Current User",
                    role: decodedToken.role || "User"
                });
            } catch (error) {
                console.error("Error decoding token for display:", error);
            }
        }
    }, []);

    useEffect(() => {
                fetchMerchandise();
            }, []);
    
    const fetchMerchandise = async () => {
        const token = getAuthToken();
        if (!token) {
            alert("Authentication token not found.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/merchandise/merchandise/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch merchandise.");
            }

            const data = await response.json();

            const formattedData = data.map((item) => ({
                id: item.MerchandiseID,
                name: item.MerchandiseName,
                quantity: item.MerchandiseQuantity,
                dateAdded: item.MerchandiseDateAdded,
                status: item.Status,
            }));
            console.log("Fetched data from backend:", data);
            console.log("Formatted merchandise", formattedData);

            setMerchandise(formattedData);
        } catch (error) {
            console.error("Error fetching merchandise:", error);
            alert("Error loading merchandise");
        }
    };

    const handleView = (merchandise) => {
        setSelectedMerchandise(merchandise);
        setShowViewMerchandiseModal(true);
    };

    const handleEdit = (merchandise) => {
        setSelectedMerchandise(merchandise);
        setShowEditMerchandiseModal(true);
    };

    const handleDelete = async (merchIdToDelete) => {

        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_BASE_URL}/merchandise/merchandise/${merchIdToDelete}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getAuthToken()}` },
            });

            if (!response.ok) throw new Error("Failed to delete item.");

            setMerchandise((prev) => prev.filter((merchandise) => merchandise.id !== merchIdToDelete));
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item.");
        }
    };

    const columns = [
        { name: "NO.", selector: (row, index) => index + 1, width: "5%" },
        { name: "NAME", selector: (row) => row.name, sortable: true, width: "30%" },
        { name: "QUANTITY", selector: (row) => row.quantity, width: "10%", center: true },
        { name: "DATE ADDED", selector: (row) => row.dateAdded, width: "20%", center: true },
        { name: "STATUS", selector: (row) => row.status, width: "15%", center: true },
        {
            name: "ACTIONS",
            cell: (row) => (
                <div className="action-buttons">
                    <button className="action-button view" onClick={() => handleView(row)}><FaFolderOpen /></button>
                    <button className="action-button edit" onClick={() => handleEdit(row)}><FaEdit /></button>
                    <button className="action-button delete" onClick={() => handleDelete(row.id)}><FaArchive /></button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            width: "20%",
            center: true
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <div className="merchandise">
            <Sidebar />
            <div className="roles">
                <header className="header">
                    <div className="header-left">
                        <h2 className="page-title">Merchandise</h2>
                    </div>
                    <div className="header-right">
                        <div className="header-date">{currentDate}</div>
                        <div className="header-profile">
                            <div className="profile-pic"style={{ backgroundImage: `url(${DEFAULT_PROFILE_IMAGE})` }}></div>
                            <div className="profile-info">
                                <div className="profile-role">Hi! I'm {loggedInUserDisplay.role}</div>
                                <div className="profile-name">{loggedInUserDisplay.name}</div>
                            </div>
                            <div className="dropdown-icon" onClick={toggleDropdown}><FaChevronDown /></div>
                            {isDropdownOpen && (
                                <div className="profile-dropdown">
                                    <ul>
                                        <li>Edit Profile</li>
                                        <li onClick={handleLogout}>Logout</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="merch-header">
                    <div className="merch-bottom-row">
                        <input
                            type="text"
                            className="merch-search-box"
                            placeholder="Search merchandise..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="filter-merch-container">
                            <label htmlFor="filter-merch">Filter by Status: </label>
                            <select id="filter-merch" className="filter-merch-select">
                                <option value="all">All</option>
                                <option value="Available">Available</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>

                        <div className="sort-merch-container">
                            <label htmlFor="sort-merch">Sort by:</label>
                            <select id="sort-merch" className="sort-merch-select">
                                <option value="nameAsc">Ascending</option>
                                <option value="nameDesc">Descending</option>
                            </select>
                        </div>

                        <button className="add-merch-button"
                            onClick={() => setShowAddMerchandiseModal(true)}
                        >
                        + Add Merchandise
                        </button>
                    </div>
                </div>

                <div className="merch-content">
                    <DataTable
                        columns={columns}
                        data={merchandise}
                        striped
                        highlightOnHover
                        responsive
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
                </div>
            </div>

            {showViewMerchandiseModal && selectedMerchandise && (
                <ViewMerchandiseModal
                    merchandise={selectedMerchandise}
                    onClose={() => setShowViewMerchandiseModal(false)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showAddMerchandiseModal && (
                <AddMerchandiseModal 
                    onClose={() => setShowAddMerchandiseModal(false)} 
                    onSubmit={(newMerchandise) => {
                        setShowAddMerchandiseModal(false);
                        fetchMerchandise();
                    }}
                />
            )}

            {showEditMerchandiseModal && selectedMerchandise && (
                <EditMerchandiseModal
                    merchandise={selectedMerchandise}
                    onClose={() => setShowEditMerchandiseModal(false)}
                    onUpdate={() => {
                        setSelectedMerchandise(null);
                        fetchMerchandise();
                    }}
                />
            )}
        </div>
    );
}

export default Merchandise;
