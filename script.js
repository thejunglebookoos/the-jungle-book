// ==========================================
// THE JUNGLE BOOK
// COMPLETE E-COMMERCE JAVASCRIPT
// ==========================================

// 1. SETTINGS

const ADMIN_PASSWORD = "0000";
const WHATSAPP_NUMBER = "918145060520";


// 2. PRODUCT DATABASE

const defaultProducts = [
    {
        id: 1,
        name: "Money Plant",
        price: 99,
        category: "Indoor Plants",
        image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=600",
        stock: 10
    },
    {
        id: 2,
        name: "Snake Plant",
        price: 199,
        category: "Indoor Plants",
        image: "https://images.unsplash.com/photo-1593482892290-f54927ae2c28?w=600",
        stock: 10
    },
    {
        id: 3,
        name: "Beautiful Succulent",
        price: 149,
        category: "Cactus & Succulents",
        image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600",
        stock: 10
    },
    {
        id: 4,
        name: "Mini Bonsai",
        price: 499,
        category: "Bonsai",
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600",
        stock: 5
    },
    {
        id: 5,
        name: "Terracotta Pot",
        price: 79,
        category: "Gardening Pots",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600",
        stock: 20
    },
    {
        id: 6,
        name: "Garden Plant",
        price: 129,
        category: "Indoor Plants",
        image: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600",
        stock: 10
    }
];

let products = JSON.parse(localStorage.getItem("tjb_products"));

if (!Array.isArray(products)) {
    products = defaultProducts;
    saveProducts();
}

let cart = [];
let currentCategory = "All";


// 3. SAVE PRODUCTS

function saveProducts() {
    localStorage.setItem("tjb_products", JSON.stringify(products));
}


// 4. DISPLAY PRODUCTS

function displayProducts() {

    const container = document.getElementById("product-container");

    if (!container) return;

    let filtered = products.filter(product => {

        const categoryMatch =
            currentCategory === "All" ||
            String(product.category).trim().toLowerCase() ===
String(currentCategory).trim().toLowerCase();

        const searchInput =
            document.getElementById("search-input") ||
            document.getElementById("product-search");

        const searchText = searchInput
            ? searchInput.value.toLowerCase()
            : "";

        const searchMatch =
            product.name.toLowerCase().includes(searchText);

        return categoryMatch && searchMatch;
    });

    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }

    filtered.forEach(product => {

        container.innerHTML += `
            <div class="product-card">

                <img src="${product.image}"
                     alt="${product.name}"
                     onerror="this.src='https://placehold.co/400x300?text=Plant'">

                <h3>${product.name}</h3>

                <p>₹${product.price}</p>

                <p>Category: ${product.category}</p>

                <p>Stock: ${product.stock}</p>

                ${
                    product.stock > 0
                    ? `<button onclick="addToCart(${product.id})">
                        Add to Cart
                       </button>`
                    : `<button disabled>Out of Stock</button>`
                }

            </div>
        `;
    });
}


// 5. CATEGORY FILTER


function filterProducts(category) {

    currentCategory = category;

    displayProducts();

    // SCROLL TO PRODUCT SECTION
    const productSection =
        document.getElementById("products");

    if (productSection) {
        productSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

window.filterProducts = filterProducts;


// 6. SEARCH PRODUCTS

function searchProducts() {
    displayProducts();
}



 // 7. SORT PRODUCTS

function sortProducts(sortType) {

    // Get selected sorting option
    if (!sortType) {
        sortType = document.getElementById("sort-products").value;
    }

    if (sortType === "low-high") {

        products.sort((a, b) =>
            Number(a.price) - Number(b.price)
        );

    }

    else if (sortType === "high-low") {

        products.sort((a, b) =>
            Number(b.price) - Number(a.price)
        );

    }

    else if (sortType === "a-z") {

        products.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    }

    else if (sortType === "z-a") {

        products.sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    }

    else {

        // Default Order
        products.sort((a, b) =>
            Number(a.id) - Number(b.id)
        );

    }

    displayProducts();

}

window.sortProducts = sortProducts;


// 8. ADD TO CART

function addToCart(id) {

    const product = products.find(p => p.id === id);

    if (!product || product.stock <= 0) {
        alert("Product is out of stock!");
        return;
    }

    const existing = cart.find(item => item.id === id);

    if (existing) {

        if (existing.quantity >= product.stock) {
            alert("Maximum available stock reached!");
            return;
        }

        existing.quantity++;
    }

    else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();
}


// 9. UPDATE CART

function updateCart() {

    const cartContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    let total = 0;

    if (cartContainer) {

        cartContainer.innerHTML = "";

        if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        }

        cart.forEach(item => {

            total += item.price * item.quantity;

            cartContainer.innerHTML += `
                <div class="cart-item">

                    <h4>${item.name}</h4>

                    <p>Price: ₹${item.price}</p>

                    <button onclick="changeQuantity(${item.id}, -1)">-</button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${item.id}, 1)">+</button>

                    <button onclick="removeFromCart(${item.id})">
                        Remove
                    </button>

                </div>
            `;
        });
    }

    if (totalElement) {
        totalElement.innerText = "₹" + total;
    }
}


// 10. CHANGE CART QUANTITY

function changeQuantity(id, change) {

    const item = cart.find(p => p.id === id);
    const product = products.find(p => p.id === id);

    if (!item || !product) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        removeFromCart(id);
        return;
    }

    if (newQuantity > product.stock) {
        alert("Available stock: " + product.stock);
        return;
    }

    item.quantity = newQuantity;

    updateCart();
}


// 11. REMOVE FROM CART

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();
}


// 12. WHATSAPP CHECKOUT

function checkout() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "Hello The Jungle Book! I want to order:\n\n";

    let total = 0;

    cart.forEach(item => {

        message +=
            item.name +
            " x " +
            item.quantity +
            " = ₹" +
            (item.price * item.quantity) +
            "\n";

        total += item.price * item.quantity;
    });

    message += "\nTotal Amount: ₹" + total;

    message += "\n\nPlease confirm my order.";

    const url =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank");
}


// 13. ADMIN LOGIN

async function adminLogin() {

    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;
    const message = document.getElementById("login-message");

    if (!email || !password) {
        message.innerText = "Please enter email and password.";
        return;
    }

    try {

        message.innerText = "Logging in...";

        await window.firebaseAdminLogin(email, password);

        const user = window.firebaseAuth.currentUser;

        if (!user) {
            throw new Error("Authentication failed.");
        }

        if (user.uid !== "c1ExchuwdlWdtMrxr912GtgvA9s2") {
            await window.firebaseAdminLogout();
            throw new Error("You are not authorized as Admin.");
        }

        document.getElementById("admin-login").style.display = "none";
        document.getElementById("admin-panel").style.display = "block";

        message.innerText = "";

        if (typeof displayAdminProducts === "function") {
            displayAdminProducts();
        }

    } catch (error) {

        message.innerText = "Login Failed: " + error.message;
        console.error(error);

    }
}
window.adminLogin = adminLogin;


// 14. ADMIN LOGOUT

async function adminLogout() {

    try {

        await window.firebaseAdminLogout();

        document.getElementById("admin-panel").style.display = "none";
        document.getElementById("admin-login").style.display = "block";

        document.getElementById("admin-email").value = "";
        document.getElementById("admin-password").value = "";

        document.getElementById("login-message").innerText = "";

        alert("Admin Logged Out Successfully!");

    } catch (error) {

        alert("Logout Failed: " + error.message);
        console.error(error);

    }
}
window.adminLogout = adminLogout;



// ==========================================
// 15. ADD NEW PRODUCT WITH FIREBASE CLOUD
// ==========================================

async function addNewProduct() {

    const name =
        document.getElementById("new-product-name").value.trim();

    const price =
        Number(document.getElementById("new-product-price").value);

    const category =
        document.getElementById("new-product-category").value;

    const image =
        document.getElementById("new-product-image").value.trim();

    const stock =
        Number(document.getElementById("new-product-stock").value);

    if (!name || !price || !category || !image ||
        document.getElementById("new-product-stock").value === "" ||
        price <= 0 || stock < 0) {

        alert("Please enter valid product details!");
        return;
    }

    if (!window.firebaseAuth ||
        !window.firebaseAuth.currentUser) {

        alert("Please login as Admin first!");
        return;
    }

    const newProduct = {

        id: Date.now(),

        name: name,

        price: price,

        category: category,

        image: image,

        stock: stock

    };

    try {

        alert("Saving Product to Cloud...");

        // SAVE TO FIREBASE FIRST
        await window.saveProductToFirebase(newProduct);

        // SAVE LOCALLY
        products.push(newProduct);

        saveProducts();

        displayProducts();

        displayAdminProducts();

        // CLEAR INPUTS
        document.getElementById("new-product-name").value = "";
        document.getElementById("new-product-price").value = "";
        document.getElementById("new-product-category").value = "";
        document.getElementById("new-product-image").value = "";
        document.getElementById("new-product-stock").value = "";

        alert("Product Added Successfully to Cloud!");

    } catch (error) {

        alert("Product Save Failed: " + error.message);

        console.error(error);

    }

}

window.addNewProduct = addNewProduct;


// 16. DISPLAY ADMIN PRODUCTS

function displayAdminProducts() {

    const container =
        document.getElementById("admin-product-list");

    if (!container) return;

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `

            <div class="admin-product-item">

                <h4>${product.name}</h4>

                <p>Price: ₹${product.price}</p>

                <p>Category: ${product.category}</p>

                <p>Stock: ${product.stock}</p>

                <button onclick="editProduct(${product.id})">
                    Edit Product
                </button>

                <button onclick="deleteProduct(${product.id})">
                    Delete Product
                </button>

                <hr>

            </div>

        `;
    });
}



// ==========================================
// 17. EDIT PRODUCT - FIREBASE CLOUD SYNC
// ==========================================

async function editProduct(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    const newName = prompt(
        "Enter Product Name:",
        product.name
    );

    if (newName === null) return;

    const newPrice = prompt(
        "Enter Product Price:",
        product.price
    );

    if (newPrice === null) return;

    const newCategory = prompt(
        "Enter Category:\nIndoor Plants\nCactus & Succulents\nBonsai\nGardening Pots",
        product.category
    );

    if (newCategory === null) return;

    const newImage = prompt(
        "Enter Product Image URL:",
        product.image
    );

    if (newImage === null) return;

    const newStock = prompt(
        "Enter Stock Quantity:",
        product.stock
    );

    if (newStock === null) return;

    const priceValue = Number(newPrice);
    const stockValue = Number(newStock);

    const allowedCategories = [
        "Indoor Plants",
        "Cactus & Succulents",
        "Bonsai",
        "Gardening Pots"
    ];

    if (
        !newName.trim() ||
        !Number.isFinite(priceValue) ||
        priceValue <= 0 ||
        !allowedCategories.includes(newCategory.trim()) ||
        !newImage.trim() ||
        !Number.isInteger(stockValue) ||
        stockValue < 0
    ) {
        alert("Invalid details! Please try again.");
        return;
    }

    // PREPARE UPDATED PRODUCT
    const updatedProduct = {
        ...product,
        name: newName.trim(),
        price: priceValue,
        category: newCategory.trim(),
        image: newImage.trim(),
        stock: stockValue
    };

    // CHECK ADMIN LOGIN
    if (
        !window.firebaseAuth ||
        !window.firebaseAuth.currentUser
    ) {
        alert("Please login as Admin first!");
        return;
    }

    try {

        alert("Updating Product in Cloud...");

        // SAVE TO FIREBASE FIRST
        await window.saveProductToFirebase(updatedProduct);

        // UPDATE LOCAL PRODUCT
        Object.assign(product, updatedProduct);

        // UPDATE MATCHING CART ITEMS
        cart.forEach(item => {

            if (item.id === id) {

                item.name = product.name;
                item.price = product.price;

                if (item.quantity > product.stock) {
                    item.quantity = product.stock;
                }
            }
        });

        cart = cart.filter(item => item.quantity > 0);

        saveProducts();

        displayProducts();

        displayAdminProducts();

        updateCart();

        alert("Product Updated Successfully in Cloud!");

    } catch (error) {

        alert("Product Update Failed: " + error.message);

        console.error("Product Update Error:", error);
    }
}

window.editProduct = editProduct;



// ==========================================
// 18. DELETE PRODUCT - FIREBASE CLOUD SYNC
// ==========================================

async function deleteProduct(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    // CHECK ADMIN LOGIN
    if (
        !window.firebaseAuth ||
        !window.firebaseAuth.currentUser
    ) {
        alert("Please login as Admin first!");
        return;
    }

    try {

        alert("Deleting Product from Cloud...");

        // DELETE FROM FIREBASE FIRST
        await window.deleteProductFromFirebase(id);

        // DELETE FROM LOCAL PRODUCTS
        products = products.filter(p => p.id !== id);

        // REMOVE FROM CART
        cart = cart.filter(item => item.id !== id);

        // SAVE LOCAL DATA
        saveProducts();

        // REFRESH WEBSITE
        displayProducts();

        displayAdminProducts();

        updateCart();

        alert("Product Deleted Successfully from Cloud!");

    } catch (error) {

        alert("Product Delete Failed: " + error.message);

        console.error("Product Delete Error:", error);
    }
}

window.deleteProduct = deleteProduct;


// 19. MAKE FUNCTIONS AVAILABLE TO HTML

window.displayProducts = displayProducts;
window.addToCart = addToCart;
window.updateCart = updateCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.filterProducts = filterProducts;
window.searchProducts = searchProducts;
window.sortProducts = sortProducts;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.addNewProduct = addNewProduct;
window.displayAdminProducts = displayAdminProducts;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;


// 20. START WEBSITE

document.addEventListener("DOMContentLoaded", function() {

    displayProducts();

    updateCart();

});


// ==========================================
// CUSTOMER ORDER MANAGEMENT
// ==========================================

async function displayOrders() {

    const container = document.getElementById("admin-order-list");

    container.innerHTML = "<p>Loading orders...</p>";

    try {

        if (!window.firebaseAuth.currentUser) {
            container.innerText = "Please login as Admin first.";
            return;
        }

        const orders = await window.getOrdersFromFirebase();

        container.innerHTML = "";

        if (orders.length === 0) {
            container.innerHTML = "<p>No customer orders found.</p>";
            return;
        }

        orders.forEach(function(order) {

            const card = document.createElement("div");

            card.style.border = "1px solid #9ab493";
            card.style.padding = "15px";
            card.style.margin = "15px 0";
            card.style.borderRadius = "10px";
            card.style.background = "#f7fff5";

            const title = document.createElement("h3");
            title.textContent = "Order ID: " + order.id;
            card.appendChild(title);

            const customer = document.createElement("p");
            customer.textContent = "Customer: " + (order.customerName || "");
            card.appendChild(customer);

            const phone = document.createElement("p");
            phone.textContent = "Phone: " + (order.phone || "");
            card.appendChild(phone);

            const address = document.createElement("p");
            address.textContent = "Address: " + (order.address || "");
            card.appendChild(address);

            const itemsTitle = document.createElement("strong");
            itemsTitle.textContent = "Products:";
            card.appendChild(itemsTitle);

            (order.items || []).forEach(function(item) {

                const line = document.createElement("p");

                line.textContent =
                    (item.name || item.productName || "Product") +
                    " × " + (item.quantity || 1) +
                    " — ₹" + (item.price || 0);

                card.appendChild(line);

            });

            const total = document.createElement("h3");
            total.textContent
