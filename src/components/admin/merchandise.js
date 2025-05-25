import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../admin/merchandise.css"; 
import Sidebar from "../sidebar";
import { FaChevronDown, FaFolderOpen, FaEdit, FaArchive } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddMerchandiseModal from './modals/addMerchandiseModal';
import EditMerchandiseModal from "./modals/editMerchandiseModal";
import ViewMerchandiseModal from "./modals/viewMerchandiseModal";

const DEFAULT_PROFILE_IMAGE = "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__";

function Merchandise() { 
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [merchandise, setMerchandise] = useState([]);
    const navigate = useNavigate();
    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
    const [loggedInUserDisplay, setLoggedInUserDisplay] = useState({ role: "admin", name: "Admin" });

    const [showAddMerchandiseModal, setShowAddMerchandiseModal] = useState(false);
    const [showEditMerchandiseModal, setShowEditMerchandiseModal] = useState(false);
    const [selectedMerchandise, setSelectedMerchandise] = useState(null);
    const [showViewMerchandiseModal, setShowViewMerchandiseModal] = useState(false);

    const currentDate = new Date().toLocaleString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "numeric", minute: "numeric", second: "numeric",
    });

    useEffect(() => {
        setLoggedInUserDisplay({
            name: "Admin",
            role: "admin"
        });

        // harcoded merch
        setMerchandise([
            { id: 1, name: "Vintage Shirt", quantity: 25, dateAdded: "2024-05-01", status: "Available" },
            { id: 2, name: "Tumbler", quantity: 0, dateAdded: "2024-05-02", status: "Not Available" },
            { id: 3, name: "Sticker Pack", quantity: 5, dateAdded: "2024-05-03", status: "Low Stock" },
            { id: 4, name: "Vinyl Record", quantity: 12, dateAdded: "2024-05-04", status: "Available" },
            { id: 5, name: "Poster", quantity: 7, dateAdded: "2024-05-05", status: "Low Stock" },
        ]);
    }, []);

    const handleView = (merchandise) => {
        setSelectedMerchandise(merchandise);
        setShowViewMerchandiseModal(true);
    };

    const handleEdit = (merchandise) => {
        setSelectedMerchandise(merchandise);
        setShowEditMerchandiseModal(true);
    };

    const handleDelete = (merchIdToDelete) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        setMerchandise((prev) => prev.filter((item) => item.id !== merchIdToDelete));
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
                            <div className="profile-pic" style={{ backgroundImage: `url(${DEFAULT_PROFILE_IMAGE})` }}></div>
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
                                <option value="Not Available">Not Available</option>
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
                    }}
                />
            )}

            {showEditMerchandiseModal && selectedMerchandise && (
                <EditMerchandiseModal
                    merchandise={selectedMerchandise}
                    onClose={() => setShowEditMerchandiseModal(false)}
                    onUpdate={() => {
                        setSelectedMerchandise(null);
                    }}
                />
            )}
        </div>
    );
}

export default Merchandise;
