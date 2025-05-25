import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../admin/products.css";
import Sidebar from "../sidebar";
import { FaChevronDown, FaFolderOpen, FaEdit, FaArchive } from "react-icons/fa";
import DataTable from "react-data-table-component";
import ProductTypeModal from './modals/productTypeModal';
import AddProductModal from './modals/addProductModal';
import EditProductModal from './modals/editProductModal';
import ViewProductModal from './modals/viewProductModal';
import { exportProductsToPDF } from '../../utils/pdfExport';

const DEFAULT_PROFILE_IMAGE = "https://media-hosting.imagekit.io/1123dd6cf5c544aa/screenshot_1746457481487.png?Expires=1841065483&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=kiHcXbHpirt9QHbMA4by~Kd4b2BrczywyVUfZZpks5ga3tnO8KlP8s5tdDpZQqinqOG30tGn0tgSCwVausjJ1OJ9~e6qPVjLXbglD-65hmsehYCZgEzeyGPPE-rOlyGJCgJC~GCZOu0jDKKcu2fefrClaqBBT3jaXoK4qhDPfjIFa2GCMfetybNs0RF8BtyKLgFGeEkvibaXhYxmzO8tksUKaLAMLbsPWvHBNuzV6Ar3mj~lllq7r7nrynNfdvbtuED7OGczSqZ8H-iopheAUhaWZftAh9tX2vYZCZZ8UztSEO3XUgLxMMtv9NnTei1omK00iJv1fgBjwR2lSqRk7w__";

function Products() {
    const [loggedInUserDisplay, setLoggedInUserDisplay] = useState({ role: "admin", name: "Admin" });
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

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(null);
    const [showProductTypeModal, setShowProductTypeModal] = useState(false);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [viewedProduct, setViewedProduct] = useState(null);
    const [editModalData, setEditModalData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("nameAsc");
    const navigate = useNavigate();
    
    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const productTypes = [
        { productTypeID: 1, productTypeName: "Drinks" },
        { productTypeID: 2, productTypeName: "Food" }
    ];

    const [products, setProducts] = useState([
        // Drinks
        { ProductID: 1, ProductImage: "Espresso.jpg", ProductName: "Espresso", ProductDescription: "Strong and bold coffee shot", ProductCategory: "Premium Coffee", ProductPrice: "120", ProductTypeID: 1 },
        { ProductID: 2, ProductImage: "Cappucino.jpg", ProductName: "Cappuccino", ProductDescription: "Espresso with steamed milk and foam", ProductCategory: "Specialty Coffee", ProductPrice: "120", ProductTypeID: 1 },
        { ProductID: 3, ProductImage: "Latte.jpg", ProductName: "Latte", ProductDescription: "Smooth espresso with milk", ProductCategory: "Specialty Coffee", ProductPrice: "120", ProductTypeID: 1 },
        { ProductID: 4, ProductImage: "IcedAmericano.jpg", ProductName: "Iced Americano", ProductDescription: "Espresso with ice and water", ProductCategory: "Premium Coffee", ProductPrice: "120", ProductTypeID: 1 },
        { ProductID: 5, ProductImage: "Mocha.jpg", ProductName: "Mocha", ProductDescription: "Chocolate-flavored coffee", ProductCategory: "Specialty Coffee", ProductPrice: "120", ProductTypeID: 1 },
        // Food
        { ProductID: 6, ProductImage: "Croissant.jpg", ProductName: "Croissant", ProductDescription: "Buttery flaky pastry", ProductCategory: "Bread", ProductPrice: "120", ProductTypeID: 2 },
        { ProductID: 7, ProductImage: "Muffin.jpg", ProductName: "Muffin", ProductDescription: "Soft baked treat", ProductCategory: "Bread", ProductPrice: "120", ProductTypeID: 2 },
        { ProductID: 8, ProductImage: "Bagel.jpg", ProductName: "Bagel", ProductDescription: "Chewy round bread", ProductCategory: "Bread", ProductPrice: "120", ProductTypeID: 2 },
        { ProductID: 9, ProductImage: "Brownie.jpg", ProductName: "Brownie", ProductDescription: "Rich chocolate dessert", ProductCategory: "Bread", ProductPrice: "120", ProductTypeID: 2 },
        { ProductID: 10, ProductImage: "Banana Bread.jpg", ProductName: "Banana Bread", ProductDescription: "Moist banana-flavored bread", ProductCategory: "Bread", ProductPrice: "120", ProductTypeID: 2 },
    ]);

    const handleView = (product) => setViewedProduct(product);

    const handleSearchChange = (e) => setSearchTerm(e.target.value);

    const handleSortChange = (e) => setSortOption(e.target.value);

    const handleEdit = (product) => {
        const normalized = {
            productID: product.ProductID,
            productTypeID: product.ProductTypeID,
            productName: product.ProductName,
            productCategory: product.ProductCategory,
            productDescription: product.ProductDescription,
            productPrice: product.ProductPrice,     
            productImage: product.ProductImage, 
        };
        setEditModalData(normalized);
        setShowEditProductModal(true);
    }

    const handleUpdateProduct = (updated) => {
        setProducts(prev =>
            prev.map(p => p.ProductID === updated.ProductID ? updated : p)
        );
        setShowEditProductModal(false);
        setEditModalData(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setProducts(prev => prev.filter(p => p.ProductID !== id));
        }
    };

    const filteredAndSortedProducts = () => {
        let filtered = products.filter(
            p => p.ProductTypeID === activeTab && p.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortOption === "nameAsc") {
            filtered.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
        } else if (sortOption === "nameDesc") {
            filtered.sort((a, b) => b.ProductName.localeCompare(a.ProductName));
        }

        return filtered;
    };

    const sortProducts = (productsToSort) => {
        if (sortOption === "nameAsc") {
            return [...productsToSort].sort((a, b) => a.ProductName.localeCompare(b.ProductName));
        } else if (sortOption === "nameDesc") {
            return [...productsToSort].sort((a, b) => b.ProductName.localeCompare(a.ProductName));
        }
        return productsToSort;
    };

    const handleLogout = () => {
        navigate('/login');
    };

    const columns = [
        { name: "NO.", selector: (_row, index) => index + 1, width: "5%" },
        {
            name: "PRODUCT IMAGE",
            cell: (row) => (
                <img
                    src={row.ProductImage || DEFAULT_PROFILE_IMAGE}
                    alt={row.ProductName}
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                />
            ),
            width: "15%",
            ignoreRowClick: true,
            allowOverflow: true,
        },
        { name: "PRODUCT NAME", selector: (row) => row.ProductName, sortable: true, width: "17%" },
        { name: "PRODUCT DESCRIPTION", selector: (row) => row.ProductDescription, wrap: true, width: "20%" },
        { name: "PRODUCT CATEGORY", selector: (row) => row.ProductCategory, wrap: true, width: "15%" },
        {
            name: "PRODUCT PRICE",
            selector: (row) => `₱${parseFloat(row.ProductPrice).toFixed(2)}`,
            sortable: true,
            width: "13%",
        },
        {
            name: "ACTIONS",
            cell: (row) => (
                <div className="action-buttons">
                    <button className="action-button view" onClick={() => handleView(row)}><FaFolderOpen /></button>
                    <button className="action-button edit" onClick={() => handleEdit(row)}><FaEdit /></button>
                    <button className="action-button delete" onClick={() => handleDelete(row.ProductID)}><FaArchive /></button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            width: "15%",
            center: true,
        },
    ];

    return (
        <div className="products">
            <Sidebar />
            <div className="roles">
                <header className="header">
                    <div className="header-left">
                        <h2 className="page-title">Products</h2>
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

                <div className="product-header">
                    <div className="product-top-row">
                        {productTypes.map((type) => (
                            <button
                                key={type.productTypeID}
                                className={`product-tab-button ${activeTab === type.productTypeID ? "active" : ""}`}
                                onClick={() => setActiveTab(type.productTypeID)}
                            >
                                {type.productTypeName}
                            </button>
                        ))}
                    </div>
                    <div className="product-bottom-row">
                        <input 
                            type="text" 
                            className="product-search-box" 
                            placeholder="Search products..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <div className="sort-product-container">
                            <label htmlFor="sort-product">Sort by:</label>
                            <select 
                                id="sort-product" 
                                className="sort-product-select"
                                value={sortOption}
                                onChange={handleSortChange}
                            >
                                <option value="nameAsc">Newest</option>
                                <option value="nameDesc">Oldest</option>
                            </select>
                        </div>
                        <button className="add-product-button" onClick={() => setShowAddProductModal(true)}>
                            + Add Product
                        </button>
                        <button className="product-type-button" onClick={() => {
                            setShowProductTypeModal(true);
                        }}>
                            Product Type
                        </button>
                        <button 
                            className="export-pdf-button" 
                            onClick={() => {
                                const filteredProducts = activeTab !== null
                                    ? sortProducts(products.filter((product) => 
                                        product.ProductTypeID === activeTab && 
                                        product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
                                    ))
                                    : sortProducts(products.filter((product) => 
                                        product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
                                    ));
                                exportProductsToPDF(filteredProducts, columns.filter(col => col.name !== "ACTIONS"));
                            }}
                        >
                            <FaFilePdf /> Export PDF
                        </button>
                    </div>
                </div>

                <div className="products-content">
                    <DataTable
                        columns={columns}
                        data={
                            activeTab !== null
                                ? sortProducts(products.filter((product) => 
                                    product.ProductTypeID === activeTab && 
                                    product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
                                ))
                                : sortProducts(products.filter((product) => 
                                    product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
                                ))
                        }
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
                                    minHeight: "100px",
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {viewedProduct && (
                <ViewProductModal
                    product={viewedProduct}
                    onClose={() => setViewedProduct(null)}
                    onEdit={handleEdit}
                    onDelete={(id) => {
                        handleDelete(id);
                        setViewedProduct(null);
                    }}
                />
            )}

            {showProductTypeModal && (
                <ProductTypeModal
                    onClose={() => setShowProductTypeModal(false)}
                    onProductTypeAdded={() => {
                        setShowProductTypeModal(false);
                    }}
                />
            )}

            {showAddProductModal && (
                <AddProductModal
                    productTypes={productTypes}
                    onClose={() => setShowAddProductModal(false)}
                    onSubmit={(newProductFromBackend) => {
                        setProducts((prevProducts) => [...prevProducts, newProductFromBackend]);
                    }}
                />
            )}

            {showEditProductModal && editModalData && (
                <EditProductModal
                    product={editModalData}
                    onClose={() =>  {
                        setShowEditProductModal(false);
                        setEditModalData(null);
                    }}
                    onUpdate={handleUpdateProduct}
                />
            )}
        </div>
    );
}

export default Products;
