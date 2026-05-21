// ==========================================================================
// LUXURY JEWELRY ENGINE (PRODUCTION SETUP) - js/shop.js
// Handles: Catalog rendering, Category filters, and Dynamic Details
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Helper Function: Saare arrays (rings, necklaces, watches) ko temporary single flat array banata hai
    function getAllProductsAsList() {
        let allProducts = [];
        if (typeof jewelryProducts !== 'undefined') {
            Object.keys(jewelryProducts).forEach(key => {
                allProducts = allProducts.concat(jewelryProducts[key]);
            });
        }
        return allProducts;
    }

    // --------------------------------------------------------------------------
    // 1. FEATURED GRID (index.html HomePage Grid Router)
    // --------------------------------------------------------------------------
    const featuredGrid = document.getElementById("featured-grid");
    if (featuredGrid) {
        const allList = getAllProductsAsList();
        const featuredItems = allList.slice(0, 4); 
        featuredGrid.innerHTML = featuredItems.map(p => createCardHTML(p)).join("");
    }

    // --------------------------------------------------------------------------
    // 2. FULL PRODUCT LIST & SIDEBAR FILTERS (shop.html Catalog Router)
    // --------------------------------------------------------------------------
    const productListContainer = document.getElementById("product-list-container");
    const gridContainer = productListContainer || document.getElementById("shop-grid");

    if (gridContainer) {
        // Initial Default Catalog Load
        renderShopProducts(getAllProductsAsList(), gridContainer);

        // Dynamic Filtering Core Logic
        const filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                filterBtns.forEach(b => b.classList.remove("active"));
                e.currentTarget.classList.add("active");

                const cat = e.currentTarget.dataset.category;
                const priceMax = e.currentTarget.dataset.priceMax ? parseInt(e.currentTarget.dataset.priceMax) : Infinity;
                const priceMin = e.currentTarget.dataset.priceMin ? parseInt(e.currentTarget.dataset.priceMin) : 0;

                let filtered = [];
                
                if (!cat || cat === "all") {
                    filtered = getAllProductsAsList();
                } else {
                    filtered = jewelryProducts[cat] || [];
                }

                // Range validation checks
                filtered = filtered.filter(p => p.priceValue >= priceMin && p.priceValue <= priceMax);
                renderShopProducts(filtered, gridContainer);
            });
        });
    }

    // --------------------------------------------------------------------------
    // 3. PRODUCT DETAIL ROUTER (product-detail.html Engine Router)
    // --------------------------------------------------------------------------
    // URL se parameters extract karke data populate karne ke liye direct path verify karta hai
    if (window.location.pathname.includes("product-detail.html") || document.getElementById("product-detail-img")) {
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get("id"));
        
        if (productId) {
            const allList = getAllProductsAsList();
            const product = allList.find(p => p.id === productId);

            if (product) {
                populateDetailPage(product);
            } else {
                console.error("Engine Alert: Product ID not matched in database structure ->", productId);
            }
        }
    }
});

// ==========================================================================
// RENDERING & ENGINE INJECTION CALLBACKS
// ==========================================================================

// Card Template Constructor (Pure card element par click injector)
function createCardHTML(product) {
    return `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor: pointer;">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" loading="lazy" />
                <div class="product-overlay">
                    <span class="action-btn" title="View Details">
                        <i class="fas fa-eye"></i>
                    </span>
                </div>
            </div>
            <div class="product-meta">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price}</p>
                <span class="discover-link" style="color: #b3924e; font-size: 0.85rem; font-weight: bold; margin-top: 10px; display: inline-block;">
                    Order Now
                </span>
            </div>
        </div>
    `;
}

// Catalog Display Builder
function renderShopProducts(productsList, container) {
    container.innerHTML = "";
    if (productsList.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: #888; font-size:1.1rem;">No premium pieces match your selection.</div>`;
        return;
    }
    container.innerHTML = productsList.map(p => createCardHTML(p)).join("");
}

// Asli Dynamic Data Router and FORCE WHATSAPP REDIRECT ENGINE
function populateDetailPage(product) {
    console.log("Loading data for dynamic piece:", product.name);
    
    // 1. Image Element Dynamic Injector
    const mainImg = document.getElementById("product-detail-img");
    if (mainImg) {
        mainImg.src = product.image;
        mainImg.alt = product.name;
    }

    // 2. Texts Elements Dynamic Injectors
    const titleText = document.getElementById("product-detail-title");
    const priceText = document.getElementById("product-detail-price");
    const descText = document.getElementById("product-detail-desc");

    if (titleText) titleText.textContent = product.name;
if (priceText) priceText.textContent = product.price;

// textContent ko badal kar innerHTML kar diya taake bold tags active ho sakein
if (descText && product.description) descText.innerHTML = product.description;

    // 3. FORCE WHATSAPP CLICK ENGINE (Bypasses any browser lock)
    const whatsappBtn = document.getElementById("whatsapp-order-btn");
    if (whatsappBtn) {
        
        // Click event ko shuru se rewrite karte hain
        whatsappBtn.onclick = function(e) {
            e.preventDefault(); // Kisi bhi purane link restriction ko roko
            
            const phoneNumber = "923378057450"; 
            const currentProductUrl = window.location.href;
            
            // Aapka customized prompt content
            const textTemplate = `Salam Luxe Aura,\n\nI would like to place an order for this premium piece:\n\n✨ *Product:* ${product.name}\n💰 *Price:* ${product.price}\n🔗 *Page Link:* ${currentProductUrl}\n\nPlease confirm the availability status. Thanks!`;
            const encodedMessage = encodeURIComponent(textTemplate);
            
            const finalWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            
            console.log("Force launching WhatsApp window...");
            // Forcefully new tab mein open karega bina fail hue
            window.open(finalWhatsappUrl, '_blank', 'noopener,noreferrer');
        };
        
    } else {
        console.error("HTML Error: id='whatsapp-order-btn' element missing from template structure.");
    }
}

// ==========================================================================
// UNIVERSAL SMART HAMBURGER CONTROLLER (FOR ALL PAGES)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Automatically detect triggers on any page (New IDs or Old Classes)
    const trigger = document.getElementById("luxe-hamburger-trigger") || 
                    document.getElementById("hamburger") || 
                    document.querySelector(".hamburger");
                    
    const menuDrawer = document.getElementById("luxury-nav-links") || 
                       document.querySelector(".nav-links") || 
                       document.querySelector("nav ul");

    if (trigger && menuDrawer) {
        // Toggle Logic when Hamburger is clicked
        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            
            // Toggle classes for both structural design versions
            menuDrawer.classList.toggle("drawer-active");
            menuDrawer.classList.toggle("active");
            trigger.classList.toggle("active");
            
            // Clean inline animation styles for the 3 spans (if they exist)
            const bars = trigger.querySelectorAll("span");
            if (bars.length >= 3) {
                if (menuDrawer.classList.contains("drawer-active") || menuDrawer.classList.contains("active")) {
                    bars[0].style.transform = "rotate(45deg) translate(6px, 5px)";
                    bars[1].style.opacity = "0";
                    bars[2].style.transform = "rotate(-45deg) translate(6px, -5px)";
                    bars[0].style.background = "#fdfbf7"; 
                    bars[2].style.background = "#fdfbf7";
                } else {
                    resetHamburgerBars(bars);
                }
            }
        });

        // Auto close if user clicks anywhere outside the menu box
        document.addEventListener("click", (e) => {
            if (!menuDrawer.contains(e.target) && !trigger.contains(e.target)) {
                menuDrawer.classList.remove("drawer-active");
                menuDrawer.classList.remove("active");
                trigger.classList.remove("active");
                
                const bars = trigger.querySelectorAll("span");
                if (bars.length >= 3) resetHamburgerBars(bars);
            }
        });
    }

    function resetHamburgerBars(bars) {
        bars[0].style.transform = "none";
        bars[1].style.opacity = "1";
        bars[2].style.transform = "none";
        bars[0].style.background = "#222";
        bars[2].style.background = "#222";
    }
});

// ==========================================================================
// UNIVERSAL DATABASE MATCHING ENGINE - INDEX & SHOP COMPATIBLE
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const mainSearchInput = document.getElementById("search-input");
    const searchWrapper = document.querySelector(".nav-search.search-wrapper");

    if (mainSearchInput && searchWrapper) {
        // 1. Dropdown Check & Template Setup
        let suggestionDropdown = searchWrapper.querySelector(".search-suggestions-dropdown");
        if (!suggestionDropdown) {
            suggestionDropdown = document.createElement("div");
            suggestionDropdown.className = "search-suggestions-dropdown";
            suggestionDropdown.style.cssText = `
                position: absolute;
                top: calc(100% + 10px);
                left: 0;
                width: 100%;
                background: rgba(253, 251, 247, 0.98);
                backdrop-filter: blur(15px);
                border: 1px solid #eae5da;
                border-radius: 12px;
                max-height: 260px;
                overflow-y: auto;
                z-index: 999999 !important;
                box-shadow: 0 12px 30px rgba(0,0,0,0.08);
                display: none;
            `;
            searchWrapper.appendChild(suggestionDropdown);
        }

        let filteredMatches = [];

        // Helper Function inside scope to ensure fresh pool on keystroke
        function getLiveSearchPool() {
            let list = [];
            if (typeof jewelryProducts !== 'undefined') {
                Object.keys(jewelryProducts).forEach(key => {
                    list = list.concat(jewelryProducts[key]);
                });
            }
            return list;
        }

        // 2. Input Listening Engine
        mainSearchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            suggestionDropdown.innerHTML = "";
            filteredMatches = [];

            const allProductCards = document.querySelectorAll(".product-card");

            if (query.length === 0) {
                suggestionDropdown.style.display = "none";
                if (allProductCards.length > 0) {
                    allProductCards.forEach(card => card.style.display = "");
                }
                return;
            }

            // Fetch live master data directly from global database structure
            const activePool = getLiveSearchPool();

            if (activePool && activePool.length > 0) {
                activePool.forEach(product => {
                    const productName = product.name;
                    const linkUrl = `product-detail.html?id=${product.id}`;

                    if (productName.toLowerCase().includes(query)) {
                        filteredMatches.push({ name: productName, url: linkUrl });

                        const row = document.createElement("div");
                        row.style.cssText = "padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #f9f6f0; font-size: 0.88rem; color: #333; font-family: sans-serif; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;";
                        row.innerHTML = `<span>✨ <strong>${productName}</strong></span> <span style="color:#b3924e; font-weight:600; font-size:0.85rem;">${product.price}</span>`;
                        
                        row.addEventListener("mouseenter", () => row.style.background = "#f5f0e6");
                        row.addEventListener("mouseleave", () => row.style.background = "transparent");
                        
                        row.addEventListener("click", (evt) => {
                            evt.preventDefault();
                            evt.stopPropagation();
                            mainSearchInput.value = productName;
                            suggestionDropdown.style.display = "none";
                            window.location.href = linkUrl;
                        });

                        suggestionDropdown.appendChild(row);
                    }
                });
            }

            // 3. Shop Page Real-time Card Syncing
            if (allProductCards.length > 0) {
                allProductCards.forEach(card => {
                    const titleElement = card.querySelector("h3") || card.querySelector(".product-title") || card.querySelector("[class*='title']");
                    if (titleElement) {
                        const cardText = titleElement.innerText.toLowerCase();
                        card.style.display = cardText.includes(query) ? "" : "none";
                    }
                });
            }

            // Dropdown visibility controller (Strict Match or Not Found Status)
            if (filteredMatches.length > 0) {
                suggestionDropdown.style.display = "block";
            } else {
                suggestionDropdown.style.display = "block";
                suggestionDropdown.innerHTML = `<div style="padding: 15px; color: #888; font-size: 0.85rem; text-align: center; font-family: sans-serif;">"${e.target.value}" Product Not Found...</div>`;
            }
        });

        // 4. ENTER KEY ACCURATE REDIRECT CONTROLLER
        mainSearchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault(); 
                e.stopPropagation(); 

                if (filteredMatches.length > 0) {
                    suggestionDropdown.style.display = "none";
                    const finalTargetUrl = filteredMatches[0].url;
                    if (finalTargetUrl) {
                        window.location.assign(finalTargetUrl);
                    }
                }
            }
        });

        document.addEventListener("click", (e) => {
            if (!searchWrapper.contains(e.target)) {
                suggestionDropdown.style.display = "none";
            }
        });
    }
});