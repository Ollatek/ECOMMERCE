
// Sample product data for demonstration
const sampleProducts = [
    {
        id: 1,
        name: "Wireless Noise-Cancelling Headphones",
        category: "Electronics",
        price: 199.99,
        image: "images/speaker.png"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        category: "Electronics",
        price: 149.99,
        image: "images/watch.png"
    },
    {
        id: 3,
        name: "Organic Cotton T-Shirt",
        category: "Clothing",
        price: 29.99,
        image: "images/polo.png"
    },
    {
        id: 4,
        name: "Professional Chef Knife",
        category: "Home & Kitchen",
        price: 79.99,
         image: "images/knife.png"
    },
    {
        id: 5,
        name: "Bestselling Novel",
        category: "Books",
        price: 15.99,
        image: "images/novel.png"
    },
    {
        id: 6,
        name: "Yoga Mat",
        category: "Sports & Outdoors",
        price: 35.99,
        image: "images/yoga.png"
    },
    {
        id: 7,
        name: "Smart Home Speaker",
        category: "Electronics",
        price: 129.99,
        image: "images/home speaker.png"
    },
    {
        id: 8,
        name: "Trainers",
        category: "Shoes, Fashion",
        price: 129.99,
        image: "images/black trainers.png"
    },
    {
        id: 9,
        name: "Shoes",
        category: "Shoes, Fashion",
        price: 129.99,
        image: "images/trainers.png"
    },
    {
        id: 10,
        name: "Loafers",
        category: "Shoes, Fashion",
        price: 129.99,
        image: "images/loafers.png"
    },
    {
        id: 11,
        name: "Iron",
        category: "Electronics, Appliancies",
        price: 129.99,
        image: "images/iron 2.png"
    },
    {
        id: 12,
        name: "Smart Iron",
        category: "Electronics, Appliancies",
        price: 129.99,
        image: "images/iron.png"
    },
    {
        id: 13,
        name: "Leather Wallet",
        category: "Accessories",
        price: 49.99,
        image: "images/wallet.png"
    },
    {
        id: 14,
        name: "Smart TV",
        category: "Electronics, Appliancies",
        price: 129.99,
        image: "images/tv.png"
    },

    {
        id: 15,
        name: "TV",
        category: "Electronics, Appliancies",
        price: 129.99,
        image: "images/lg tv.png"
    },

    {
        id: 16,
        name: "Long Sleeve",
        category: "Clothing, Fashion",
        price: 29.99,
        image: "images/long sleeve.png"
    },
    {
        id: 17,
        name: "Black T-Shirt",
        category: "Clothing, Fashion",
        price: 29.99,
        image: "images/black shirt.png"
    },
    {
        id: 18,
        name: "Chips",
        category: "Snack, Food",
        price: 49.99,
        image: "images/chips.png"
    }
];

// DOM Elements
const recommendedProductsEl = document.getElementById('recommendedProducts');
const trendingProductsEl = document.getElementById('trendingProducts');
const userRecommendationsEl = document.getElementById('userRecommendations');
const dashboardLink = document.getElementById('dashboardLink');
const loginBtn = document.getElementById('loginBtn');
const homePage = document.getElementById('homePage');
const dashboardPage = document.getElementById('dashboardPage');
const productPage = document.getElementById('productPage');
const searchInput = document.getElementById('searchInput');
const autocompleteResults = document.getElementById('autocompleteResults');

// Current user state (would come from auth in real app)
let currentUser = null;

// Mock authentication
loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (!currentUser) {
        // Simulate login
        currentUser = {
            id: 'user123',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            preferences: ['Electronics', 'Books']
        };
        loginBtn.textContent = 'Logout';
        document.getElementById('userDisplayName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
        
        // Refresh recommendations based on user profile
        loadUserRecommendations();
        loadRecommendedProducts();
    } else {
        // Simulate logout
        currentUser = null;
        loginBtn.textContent = 'Login';
        
        // Refresh recommendations for anonymous user
        loadRecommendedProducts();
    }
});

// Navigation between home and dashboard
dashboardLink.addEventListener('click', function(e) {
    e.preventDefault();
    if (!currentUser) {
        alert('Please log in to view your personalized recommendations.');
        return;
    }
    
    homePage.style.display = 'none';
    productPage.style.display = 'none';
    dashboardPage.style.display = 'block';
});

// Dashboard tabs navigation
document.querySelectorAll('.dashboard-menu a').forEach(tab => {
    tab.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active tab in menu
        document.querySelectorAll('.dashboard-menu a').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding content
        const tabId = this.getAttribute('data-tab');
        document.querySelectorAll('.dashboard-section').forEach(section => section.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});

// Recommendation tabs in dashboard
document.querySelectorAll('.recommendation-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Update active tab
        document.querySelectorAll('.recommendation-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding content
        const contentId = this.getAttribute('data-content');
        document.querySelectorAll('#recommendationsTab .tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(contentId).classList.add('active');
        
        // Load data if needed
        if (contentId === 'similar' && document.getElementById('similarProducts').children.length === 0) {
            loadSimilarProducts();
        } else if (contentId === 'trending' && document.getElementById('categoryTrending').children.length === 0) {
            loadCategoryTrending();
        }
    });
});

// Search functionality with autocomplete
searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    if (query.length < 2) {
        autocompleteResults.style.display = 'none';
        return;
    }
    
    // Filter products based on search query
    const matchedProducts = sampleProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
    );
    
    // Display autocomplete results
    autocompleteResults.innerHTML = '';
    matchedProducts.slice(0, 5).forEach(product => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = product.name;
        item.addEventListener('click', () => {
            searchInput.value = product.name;
            autocompleteResults.style.display = 'none';
            showProductDetail(product.id);
        });
        autocompleteResults.appendChild(item);
    });
    
    autocompleteResults.style.display = matchedProducts.length > 0 ? 'block' : 'none';
});

// Hide autocomplete when clicking outside
document.addEventListener('click', function(e) {
    if (e.target !== searchInput) {
        autocompleteResults.style.display = 'none';
    }
});

// Generate product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="btn view-product" data-id="${product.id}">View Product</button>
        </div>
    `;
    
    // Add event listener to view product button
    card.querySelector('.view-product').addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        showProductDetail(productId);
        
        // Record this interaction for the recommendation system
        recordUserInteraction(productId, 'view');
    });
    
    return card;
}





// Load recommended products
function loadRecommendedProducts() {
    // In a real app, this would make an API call to get personalized recommendations
    // For demo, we'll use random products with a loading delay
    
    recommendedProductsEl.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
        </div>
    `;
    
    // Simulate API delay
    setTimeout(() => {
        recommendedProductsEl.innerHTML = '';
        
        // In a real app, we would fetch personalized recommendations based on user profile
        // or anonymous session data
        const recommendations = currentUser 
            ? sampleProducts.filter(p => currentUser.preferences.includes(p.category)).slice(0, 40)
            : shuffleArray([...sampleProducts]).slice(0, 4);
        
        recommendations.forEach(product => {
            recommendedProductsEl.appendChild(createProductCard(product));
        });
        
        // If no recommendations yet, show a message
        if (recommendations.length === 0) {
            recommendedProductsEl.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <p>We're still learning your preferences. Browse more products to get personalized recommendations.</p>
                </div>
            `;
        }
    }, 1000);
}

// Load trending products
function loadTrendingProducts() {
    trendingProductsEl.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
        </div>
    `;
    
    // Simulate API delay
    setTimeout(() => {
        trendingProductsEl.innerHTML = '';
        
        // In a real app, these would be the most viewed/purchased products
        const trending = shuffleArray([...sampleProducts]).slice(0, 40);
        
        trending.forEach(product => {
            trendingProductsEl.appendChild(createProductCard(product));
        });
    }, 1500);
}

// Load user-specific recommendations for dashboard
function loadUserRecommendations() {
    if (!currentUser) return;
    
    userRecommendationsEl.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
        </div>
    `;
    
    // Simulate API delay
    setTimeout(() => {
        userRecommendationsEl.innerHTML = '';
        
        // In a real app, these would be recommendations based on collaborative filtering
        const userRecs = sampleProducts.filter(p => currentUser.preferences.includes(p.category));
        
        userRecs.forEach(product => {
            userRecommendationsEl.appendChild(createProductCard(product));
        });
    }, 1000);
}

// Load similar products based on recent views
function loadSimilarProducts() {
    const similarProducts = document.getElementById('similarProducts');
    
    similarProducts.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
        </div>
    `;
    
    // Simulate API delay
    setTimeout(() => {
        similarProducts.innerHTML = '';
        
        // In a real app, these would be based on content-based filtering
        const similar = shuffleArray([...sampleProducts]).slice(0, 40);
        
        similar.forEach(product => {
            similarProducts.appendChild(createProductCard(product));
        });
    }, 1000);
}

// Load trending products in user's preferred categories
function loadCategoryTrending() {
    if (!currentUser) return;
    
    const categoryTrending = document.getElementById('categoryTrending');
    
    categoryTrending.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
        </div>
    `;
    
    // Simulate API delay
    setTimeout(() => {
        categoryTrending.innerHTML = '';
        
        // Filter products by user's preferred categories
        const trendingInCategories = sampleProducts.filter(p => 
            currentUser.preferences.includes(p.category)
        );
        
        if (trendingInCategories.length > 0) {
            trendingInCategories.forEach(product => {
                categoryTrending.appendChild(createProductCard(product));
            });
        } else {
            categoryTrending.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                    <p>No trending items in your preferred categories at the moment.</p>
                </div>
            `;
        }
    }, 1000);
}

// Show product detail page
function showProductDetail(productId) {
    // Find the product
    const product = sampleProducts.find(p => p.id == productId);
    if (!product) return;
    
    // Hide other pages
    homePage.style.display = 'none';
    dashboardPage.style.display = 'none';
    productPage.style.display = 'block';
    
    // Create product detail view
    const productDetail = document.querySelector('.product-detail');
    productDetail.innerHTML = `
        <div style="display: flex; gap: 2rem; flex-wrap: wrap; margin-bottom: 2rem;">
            <div style="flex: 1; min-width: 300px;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: var(--border-radius);">
            </div>
            <div style="flex: 2; min-width: 300px;">
                <h2>${product.name}</h2>
                <p style="color: #666; margin-bottom: 1rem;">${product.category}</p>
                <p style="font-size: 1.8rem; font-weight: bold; color: var(--secondary-color); margin-bottom: 1rem;">$${product.price.toFixed(2)}</p>
                <div style="margin-bottom: 1.5rem;">
                    <div style="display: flex; gap: 0.2rem; margin-bottom: 0.5rem;">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                        <span style="margin-left: 0.5rem;">(42 reviews)</span>
                    </div>
                </div>
                <p style="margin-bottom: 1.5rem;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                    <select style="padding: 0.6rem; border-radius: var(--border-radius); border: 1px solid #ddd;">
                        <option>Select Size</option>
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                    </select>
                    <select style="padding: 0.6rem; border-radius: var(--border-radius); border: 1px solid #ddd;">
                        <option>Qty: 1</option>
                        <option>Qty: 2</option>
                        <option>Qty: 3</option>
                        <option>Qty: 4</option>
                        <option>Qty: 5</option>
                    </select>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button class="btn" style="flex: 2;">Add to Cart</button>
                    <button class="btn btn-secondary" style="flex: 1;">Save</button>
                </div>
            </div>
        </div>
        <div>
            <h3 style="margin-bottom: 1rem;">Product Description</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            <ul style="margin-top: 1rem; margin-left: 1.5rem;">
                <li>Feature 1: Lorem ipsum dolor sit amet</li>
                <li>Feature 2: Consectetur adipiscing elit</li>
                <li>Feature 3: Sed do eiusmod tempor incididunt</li>
                <li>Feature 4: Ut labore et dolore magna aliqua</li>
            </ul>
        </div>
    `;
    
    // Load related products
    loadRelatedProducts(product);
    
    // Add a back button
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-secondary';
    backButton.style.margin = '1rem 0';
    backButton.textContent = 'Back to Shopping';
    backButton.addEventListener('click', () => {
        productPage.style.display = 'none';
        homePage.style.display = 'block';
    });
    productDetail.prepend(backButton);
}

// Load related products based on current product
function loadRelatedProducts(currentProduct) {
    const relatedProductsEl = document.getElementById('relatedProducts');
    
    relatedProductsEl.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
        </div>
    `;
    
    // Simulate API delay
    setTimeout(() => {
        relatedProductsEl.innerHTML = '';
        
        // In a real app, these would be determined by the recommendation model
        // Here we'll just filter by the same category
        const related = sampleProducts
            .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
            .slice(0, 4);
        
        if (related.length === 0) {
            // If not enough in same category, just show random products
            const randomRelated = sampleProducts
                .filter(p => p.id !== currentProduct.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            
            randomRelated.forEach(product => {
                relatedProductsEl.appendChild(createProductCard(product));
            });
        } else {
            related.forEach(product => {
                relatedProductsEl.appendChild(createProductCard(product));
            });
        }
    }, 1000);
}

// Record user interactions for recommendation engine
function recordUserInteraction(productId, actionType) {
    // In a real app, this would send data to the backend API
    console.log(`Recorded user interaction: ${actionType} on product ${productId}`);
    
    // We would include details like:
    const interactionData = {
        userId: currentUser ? currentUser.id : 'anonymous',
        productId: productId,
        actionType: actionType, // view, click, add-to-cart, purchase, etc.
        timestamp: new Date().toISOString(),
        sessionId: 'mock-session-id', // Would be tracked in cookies
        referrer: document.referrer || 'direct'
    };
    
    // In a real app, we would send this to an API endpoint
    // fetch('/api/interactions', {
    //    method: 'POST',
    //    headers: { 'Content-Type': 'application/json' },
    //    body: JSON.stringify(interactionData)
    // });
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Set up event listeners for page navigation
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.textContent !== 'Login' && this.textContent !== 'My Recommendations') {
            e.preventDefault();
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // If it's the Home link, show the home page
            if (this.textContent === 'Home') {
                homePage.style.display = 'block';
                dashboardPage.style.display = 'none';
                productPage.style.display = 'none';
            }
        }
    });
});

// Initialize the app
function initApp() {
    // Load initial product data
    loadRecommendedProducts();
    loadTrendingProducts();
    
    // Set up preferences form
    const preferencesForm = document.getElementById('preferencesForm');
    preferencesForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Preferences saved! Your recommendations will be updated.');
        
        // In a real app, we would send the preferences to the backend
        // and update the currentUser object
        
        // Refresh recommendations based on new preferences
        loadUserRecommendations();
    });
}

// Start the app
initApp();