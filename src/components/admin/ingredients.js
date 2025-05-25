import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../admin/ingredients.css";
import Sidebar from "../sidebar";
import { FaChevronDown, FaFolderOpen, FaEdit, FaArchive } from "react-icons/fa";
import DataTable from "react-data-table-component";
import AddIngredientModal from './modals/addIngredientModal';
import EditIngredientModal from './modals/editIngredientModal';
import ViewIngredientModal from './modals/viewIngredientModal';

const DEFAULT_PROFILE_IMAGE = "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__";
function Ingredients() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('nameAsc');
    const [statusFilter, setStatusFilter] = useState('all');
    const [ingredients, setIngredients] = useState([]);
    const navigate = useNavigate();
    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
    const [loggedInUserDisplay, setLoggedInUserDisplay] = useState({ role: "admin", name: "Admin" });

    const [showAddIngredientModal, setShowAddIngredientModal] = useState(false);
    const [showEditIngredientModal, setShowEditIngredientModal] = useState(false);
    const [currentIngredient, setCurrentIngredient] = useState(null);
    const [showViewIngredientModal, setShowViewIngredientModal] = useState(false);

    const filteredIngredients = ingredients
        .filter(ingredient => {
            const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || ingredient.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            return sortOrder === 'nameAsc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });

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

    // hardcoded ingredients
    useEffect(() => {
        const sampleIngredients = [
            {
                id: 1,
                name: "Coffee Beans",
                amount: 100,
                measurement: "g",
                bestBefore: "2025-06-01",
                expiration: "2025-06-10",
                status: "Available",
            },
            {
                id: 2,
                name: "Milk",
                amount: 2,
                measurement: "l",
                bestBefore: "2025-06-15",
                expiration: "2025-07-01",
                status: "Available",
            },
            {
                id: 3,
                name: "Sugar",
                amount: 10,
                measurement: "g",
                bestBefore: "2025-06-05",
                expiration: "2025-06-07",
                status: "Low Stock",
            },
            {
                id: 4,
                name: "Maple Syrup",
                amount: 0,
                measurement: "ml",
                bestBefore: "2025-05-30",
                expiration: "2025-06-02",
                status: "Not Available",
            },
            {
                id: 5,
                name: "Vanila Syrup",
                amount: 200,
                measurement: "ml",
                bestBefore: "2025-06-03",
                expiration: "2025-06-05",
                status: "Available",
            },
        ];
        setIngredients(sampleIngredients);
    }, []);

    const handleView = (ingredient) => {
        setCurrentIngredient(ingredient);
        setShowViewIngredientModal(true);
    };

    const handleEdit = (ingredient) => {
        setCurrentIngredient(ingredient);
        setShowEditIngredientModal(true);
    };

    const handleDelete = (ingredientIdToDelete) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this ingredient?");
        if (!confirmDelete) return;

        setIngredients(prev => prev.filter(i => i.id !== ingredientIdToDelete));
    };

    const columns = [
        { name: "NO.", selector: (row, index) => index + 1, width: "5%" },
        { name: "INGREDIENT NAME", selector: (row) => row.name, sortable: true, width: "20%" },
        { name: "AMOUNT", selector: (row) => row.amount, width: "10%", center: true },
        { name: "UNIT", selector: (row) => row.measurement, width: "10%", center: true },
        { name: "BEST BEFORE DATE", selector: (row) => row.bestBefore, width: "15%", center: true },
        { name: "EXPIRATION DATE", selector: (row) => row.expiration, width: "15%", center: true },
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
            center: true,
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    };

    return (
        <div className="ingredients">
            <Sidebar />
            <div className="roles">
                <header className="header">
                    <div className="header-left">
                        <h2 className="page-title">Ingredients</h2>
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

                <div className="ingredient-header">
                    <div className="ingredient-bottom-row">
                        <input
                            type="text"
                            className="ingredient-search-box"
                            placeholder="Search ingredients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="filter-ingredient-container">
                            <label htmlFor="filter-ingredient">Filter by Status:</label>
                            <select 
                                id="filter-ingredient" 
                                className="filter-ingredient-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="Available">Available</option>
                                <option value="Low Stock">Low Stock</option>
                                <option value="Out of Stock">Out of Stock</option>
                            </select>
                        </div>

                        <div className="sort-ingredient-container">
                            <label htmlFor="sort-ingredient">Sort by:</label>
                            <select 
                                id="sort-ingredient" 
                                className="sort-ingredient-select"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="nameAsc">Newest</option>
                                <option value="nameDesc">Oldest</option>
                            </select>
                        </div>

                        <button
                            className="add-ingredient-button"
                            onClick={() => setShowAddIngredientModal(true)}
                        >
                            + Add Ingredient
                        </button>
                    </div>
                </div>

                <div className="ingredient-content">
                    <DataTable
                        columns={columns}
                        data={filteredIngredients}
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

            {showAddIngredientModal && <AddIngredientModal onClose={() => setShowAddIngredientModal(false)} />}
            {showEditIngredientModal && <EditIngredientModal ingredient={currentIngredient} onClose={() => setShowEditIngredientModal(false)} />}
            {showViewIngredientModal && <ViewIngredientModal ingredient={currentIngredient} onClose={() => setShowViewIngredientModal(false)} />}
        </div>
    );
}

export default Ingredients;
