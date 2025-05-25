import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../admin/supplies.css";
import Sidebar from "../sidebar";
import { FaChevronDown, FaFolderOpen, FaEdit, FaArchive } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddSupplyModal from './modals/addSupplyModal';
import EditSupplyModal from "./modals/editSupplyModal";
import ViewSupplyModal from "./modals/viewSupplyModal";

const DEFAULT_PROFILE_IMAGE = "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__";

function Supplies() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [supplies, setSupplies] = useState([]);
    const navigate = useNavigate();
    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
    const [loggedInUserDisplay, setLoggedInUserDisplay] = useState({ role: "admin", name: "Admin" });

    const [showAddSupplyModal, setShowAddSupplyModal] = useState(false);
    const [showEditSupplyModal, setShowEditSupplyModal] = useState(false);
    const [selectedSupply, setSelectedSupply] = useState(null);
    const [showViewSupplyModal, setShowViewSupplyModal] = useState(false);

    const currentDate = new Date().toLocaleString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "numeric", minute: "numeric", second: "numeric",
    });

    useEffect(() => {
        setLoggedInUserDisplay({
            name: "Admin",
            role: "admin"
        });
    });
        
    // hardcoded supplies
    useEffect(() => {
        const hardcodedSupplies = [
            { id: 1, name: "Large Cups", quantity: 20, measurement: "pcs", supplyDate: "2025-05-01", status: "Available" },
            { id: 2, name: "Small Cups", quantity: 50, measurement: "pcs", supplyDate: "2025-05-03", status: "Available" },
            { id: 3, name: "Straw", quantity: 5, measurement: "pcs", supplyDate: "2025-05-04", status: "Low Stock" },
            { id: 4, name: "Fork", quantity: 100, measurement: "pcs", supplyDate: "2025-05-05", status: "Available" },
            { id: 5, name: "Spoon", quantity: 0, measurement: "pcs", supplyDate: "2025-05-06", status: "Not Available" },
        ];
        setSupplies(hardcodedSupplies);
    }, []);

    const handleView = (supply) => {
        setSelectedSupply(supply);
        setShowViewSupplyModal(true);
    };

    const handleEdit = (supply) => {
        setSelectedSupply(supply);
        setShowEditSupplyModal(true);
    };

    const handleDelete = (suppliesIdToDelete) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        setSupplies((prev) => prev.filter((supply) => supply.id !== suppliesIdToDelete));
    };

    const columns = [
        { name: "NO.", selector: (row, index) => index + 1, width: "5%" },
        { name: "ITEM NAME", selector: (row) => row.name, sortable: true, width: "30%" },
        { name: "QUANTITY", selector: (row) => row.quantity, width: "15%", center: true },
        { name: "UNIT", selector: (row) => row.measurement, width: "10%", center: true },
        { name: "SUPPLY DATE", selector: (row) => row.supplyDate, width: "15%", center: true },
        { name: "STATUS", selector: (row) => row.status, width: "10%", center: true },
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
            width: "15%",
            center: true
        },
    ];

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className="supplies">
            <Sidebar />
            <div className="roles">
                <header className="header">
                    <div className="header-left">
                        <h2 className="page-title">Supplies</h2>
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

                <div className="supply-header">
                    <div className="supply-bottom-row">
                        <input
                            type="text"
                            className="supply-search-box"
                            placeholder="Search supplies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="filter-supply-container">
                            <label htmlFor="filter-supply">Filter by Status:</label>
                            <select id="filter-supply" className="filter-supply-select">
                                <option value="all">All</option>
                                <option value="Available">Available</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Not Available">Not Available</option>
                            </select>
                        </div>

                        <div className="sort-supply-container">
                            <label htmlFor="sort-supply">Sort by:</label>
                            <select id="sort-supply" className="sort-supply-select">
                                <option value="nameAsc">Ascending</option>
                                <option value="nameDesc">Descending</option>
                            </select>
                        </div>

                        <button className="add-supply-button"
                            onClick={() => setShowAddSupplyModal(true)}
                        >
                            + Add Supply & Materials
                        </button>
                    </div>
                </div>

                <div className="supply-content">
                    <DataTable
                        columns={columns}
                        data={supplies}
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

            {showViewSupplyModal && selectedSupply && (
                <ViewSupplyModal
                    supply={selectedSupply}
                    onClose={() => setShowViewSupplyModal(false)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showAddSupplyModal && (
                <AddSupplyModal 
                    onClose={() => setShowAddSupplyModal(false)} 
                    onSubmit={(newSupply) => {
                        setSupplies((prev) => [...prev, newSupply]);
                        setShowAddSupplyModal(false);
                    }}
                />
            )}

            {showEditSupplyModal && selectedSupply && (
                <EditSupplyModal
                    supply={selectedSupply}
                    onClose={() => setShowEditSupplyModal(false)}
                    onSubmit={(updatedSupply) => {
                        setSupplies((prev) =>
                            prev.map((supply) =>
                                supply.id === updatedSupply.id ? updatedSupply : supply
                            )
                        );
                        setShowEditSupplyModal(false);
                    }}
                />
            )}
        </div>
    );
}

export default Supplies;
