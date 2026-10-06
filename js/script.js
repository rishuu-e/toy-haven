
const products = [
    {id: 1, name: "Signature Kylian Mbappe Figure", category: "Figurines", price: 25.99, image: "images/Mbappe.jpeg"},
    {id: 2, name: "RC Off-Road Buggy", category: "Toys", price: 55.00, image: "images/RC buggy.jpeg"},
    {id: 3, name: "Monopoly: Gamer Edition", category: "Board Games", price: 39.99, image: "images/Monopoly.jpeg"},
    {id: 4, name: "1:18 Cyber-Sports Car", category: "Diecast Cars", price: 18.50, image: "images/Cyber-sport-car.jpeg"},
    {id: 5, name: "Jett Duelist Statue", category: "Figurines", price: 35.00, image: "images/Jett.jpeg"},
    {id: 6, name: "Neon Cyber-Katana", category: "Toys", price: 45.00, image: "images/Neon sword.jpeg"},
    {id: 7, name: "Scrabble Classic Edition", category: "Board Games", price: 29.99, image: "images/Scrabble.jpeg"}, 
    {id: 8, name: "Vintage Safari Land Cruiser", category: "Diecast Cars", price: 14.50, image: "images/Safari cab.jpeg"}
];

function getLocal(key) { return JSON.parse(localStorage.getItem(key)) || []; }
function setLocal(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

document.addEventListener("DOMContentLoaded", function() {
    updateCartBadge();
    
    const hamburger = document.getElementById('hamburger');
    if(hamburger) {
        hamburger.addEventListener('click', function() {
            document.getElementById('nav-links').classList.toggle('active');
        });
    }

    const nlForm = document.getElementById('nl-form');
    if(nlForm) {
        nlForm.addEventListener('submit', function(e) {
            e.preventDefault();
            localStorage.setItem('newsletter_sub', document.getElementById('nl-email').value);
            alert('Subscribed successfully!');
            nlForm.reset();
        });
    }

    const path = window.location.pathname;
    if(path.includes("index.html") || path.endsWith("/")) initHome();
    else if(path.includes("products.html")) initProducts();
    else if(path.includes("cart.html")) initCart();
    else if(path.includes("checkout.html")) initCheckout();
    else if(path.includes("wishlist.html")) initWishlist();
    else if(path.includes("feedback.html")) initFeedback();
});

function isWishlisted(id) {
    let w = getLocal('wishlist');
    let found = false;
    let i = 0;
    while(i < w.length) {
        if(w[i].id === id) found = true;
        i++;
    }
    return found;
}

window.toggleWishlist = function(id, btnElement) {
    let w = getLocal('wishlist');
    let foundIndex = -1;
    let i = 0;
    while(i < w.length) {
        if(w[i].id === id) foundIndex = i;
        i++;
    }
    
    if(foundIndex > -1) {
        w.splice(foundIndex, 1);
        btnElement.classList.remove('active');
        btnElement.innerHTML = '♡ Add to Wishlist';
    } else {
        let j = 0;
        while(j < products.length) {
            if(products[j].id === id) {
                w.push({
                    id: products[j].id,
                    name: products[j].name,
                    category: products[j].category,
                    price: products[j].price,
                    image: products[j].image,
                    wStatus: 'Interested'
                });
            }
            j++;
        }
        btnElement.classList.add('active');
        btnElement.innerHTML = '❤ Added to Wishlist';
    }
    setLocal('wishlist', w);

    console.log("Item added to Wishlist!");
    console.log(JSON.parse(localStorage.getItem('wishlist')));
}

function createCardHTML(p) {
    let activeClass = "";
    let heartIcon = "♡ Add to Wishlist";
    
    if (isWishlisted(p.id) == true) {
        activeClass = "active";
        heartIcon = "❤ Added to Wishlist";
    }

    let htmlString = "<div class='card fade-in'>";
    htmlString = htmlString + "<div class='img-placeholder' style='background:transparent;'>";
    htmlString = htmlString + "<img src='" + p.image + "' alt='" + p.name + "' class='product-img'>";
    htmlString = htmlString + "</div>";
    htmlString = htmlString + "<p class='card-cat'>" + p.category + "</p>";
    htmlString = htmlString + "<h4 class='card-title'>" + p.name + "</h4>";
    htmlString = htmlString + "<p class='card-price'>$" + p.price.toFixed(2) + "</p>";
    htmlString = htmlString + "<button class='btn btn-dark w-100' onclick='addToCart(" + p.id + ")'>Add to Cart</button>";
    htmlString = htmlString + "<button class='card-wishlist " + activeClass + "' onclick='toggleWishlist(" + p.id + ", this)'>" + heartIcon + "</button>";
    htmlString = htmlString + "</div>";

    return htmlString;
}

function initHome() {
    const grid = document.getElementById('featured-grid');
    if(grid) {
        let html = '';
        let j = 0;
        while(j < 4 && j < products.length) {
            html = html + createCardHTML(products[j]);
            j++;
        }
        grid.innerHTML = html;
    }
}

function initProducts() {
    const grid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');
    const pills = document.querySelectorAll('.pill-btn');
    
    let activeCategory = "All";

    let k = 0;
    while(k < pills.length) {
        pills[k].addEventListener('click', function() {
            let m = 0;
            while(m < pills.length) { 
                pills[m].classList.remove('active'); 
                m++; 
            }
            this.classList.add('active');
            activeCategory = this.getAttribute('data-cat');
            renderProducts();
        });
        k++;
    }

    if(searchInput) {
        searchInput.addEventListener('input', renderProducts);
    }

    function renderProducts() {
        let html = '';
        let searchVal = "";
        if (searchInput) {
            searchVal = searchInput.value.toLowerCase();
        }
        
        let i = 0;
        while(i < products.length) {
            const p = products[i];
            const matchSearch = p.name.toLowerCase().includes(searchVal) || p.category.toLowerCase().includes(searchVal);
            const matchCat = (activeCategory === "All" || p.category === activeCategory);
            
            if(matchSearch && matchCat) {
                html = html + createCardHTML(p);
            }
            i++;
        }
        if(grid) grid.innerHTML = html;
    }
    
    renderProducts();
}

window.addToCart = function(id) {
    let cart = getLocal('cart');
    let found = false;
    let i = 0;
    while(i < cart.length) {
        if(cart[i].id === id) {
            cart[i].qty++;
            found = true;
        }
        i++;
    }
    
    if(found == false) {
        let j = 0;
        while(j < products.length) {
            if(products[j].id === id) {
                cart.push({
                    id: products[j].id,
                    name: products[j].name,
                    category: products[j].category,
                    price: products[j].price,
                    image: products[j].image,
                    qty: 1
                });
            }
            j++;
        }
    }
    setLocal('cart', cart);
    updateCartBadge();
    alert('Item added to cart!');

    console.log("Item added to Cart!");
    console.log(JSON.parse(localStorage.getItem('cart')));
}

function updateCartBadge() {
    const cart = getLocal('cart');
    let count = 0;
    let i = 0;
    while(i < cart.length) { 
        count = count + cart[i].qty; 
        i++; 
    }
    const el = document.getElementById('cart-count');
    if(el) el.textContent = count;
}

function initCart() {
    const container = document.getElementById('cart-items');
    const subTotalEl = document.getElementById('summary-subtotal');
    const totalEl = document.getElementById('summary-total');
    const clearBtn = document.getElementById('clear-cart-btn');
    
    function renderCart() {
        const cart = getLocal('cart');
        if(cart.length === 0) {
            container.innerHTML = '<p style="padding:1rem;">Your cart is empty.</p>';
            subTotalEl.textContent = '$0.00';
            totalEl.textContent = '$0.00';
            return;
        }

        let html = '';
        let total = 0;
        let i = 0;
        while(i < cart.length) {
            const item = cart[i];
            const sub = item.price * item.qty;
            total = total + sub;

            let rowHtml = "<div class='cart-item-row fade-in'>";
            rowHtml = rowHtml + "<div class='cart-product-info'>";
            rowHtml = rowHtml + "<div class='img-placeholder' style='width:60px;height:60px; background:transparent;'>";
            rowHtml = rowHtml + "<img src='" + item.image + "' alt='" + item.name + "' style='width:100%; height:100%; object-fit:contain; border-radius:4px;'>";
            rowHtml = rowHtml + "</div>";
            rowHtml = rowHtml + "<div><h4>" + item.name + "</h4><p>" + item.category + "</p></div>";
            rowHtml = rowHtml + "</div>";
            rowHtml = rowHtml + "<div style='font-weight:600;'>$" + item.price.toFixed(2) + "</div>";
            rowHtml = rowHtml + "<div class='qty-control'>";
            rowHtml = rowHtml + "<button onclick='updateQty(" + item.id + ", -1)'>-</button>";
            rowHtml = rowHtml + "<span>" + item.qty + "</span>";
            rowHtml = rowHtml + "<button onclick='updateQty(" + item.id + ", 1)'>+</button>";
            rowHtml = rowHtml + "</div>";
            rowHtml = rowHtml + "<div style='font-weight:600;'>$" + sub.toFixed(2) + "</div>";
            rowHtml = rowHtml + "<button class='remove-btn' onclick='removeCartItem(" + item.id + ")'>✖</button>";
            rowHtml = rowHtml + "</div>";

            html = html + rowHtml;
            i++;
        }
        container.innerHTML = html;
        subTotalEl.textContent = '$' + total.toFixed(2);
        totalEl.textContent = '$' + total.toFixed(2);
    }

    window.updateQty = function(id, delta) {
        let cart = getLocal('cart');
        let i = 0;
        while(i < cart.length) {
            if(cart[i].id === id) {
                cart[i].qty = cart[i].qty + delta;
                if(cart[i].qty <= 0) { 
                    cart.splice(i, 1); 
                    i--; 
                }
            }
            i++;
        }
        setLocal('cart', cart);
        updateCartBadge();
        renderCart();
    };

    window.removeCartItem = function(id) {
        let cart = getLocal('cart');
        let i = 0;
        while(i < cart.length) {
            if(cart[i].id === id) { 
                cart.splice(i, 1); 
                i--; 
            }
            i++;
        }
        setLocal('cart', cart);
        updateCartBadge();
        renderCart();
    };

    if(clearBtn) {
        clearBtn.addEventListener('click', function() {
            setLocal('cart', []);
            updateCartBadge();
            renderCart();
        });
    }

    renderCart();
}

function initCheckout() {
    const cart = getLocal('cart');
    const container = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');
    
    let html = '';
    let total = 0;
    let i = 0;
    while(i < cart.length) {
        const item = cart[i];
        let itemHtml = "<div class='co-item'>";
        itemHtml = itemHtml + "<span>" + item.qty + "x " + item.name + "</span>";
        itemHtml = itemHtml + "<span>$" + (item.price * item.qty).toFixed(2) + "</span>";
        itemHtml = itemHtml + "</div>";
        
        html = html + itemHtml;
        total = total + (item.price * item.qty);
        i++;
    }
    if(container) container.innerHTML = html;
    if(totalEl) totalEl.textContent = '$' + total.toFixed(2);

    const triggerBtn = document.getElementById('trigger-checkout');
    const hiddenSubmit = document.getElementById('hidden-submit');
    const form = document.getElementById('checkout-form');
    
    const radios = document.getElementsByName('payment');
    const cardBox = document.getElementById('card-details');
    let j = 0;
    while(j < radios.length) {
        radios[j].addEventListener('change', function() {
            if(this.value === 'cod') cardBox.style.display = 'none';
            else cardBox.style.display = 'block';
        });
        j++;
    }

    if(triggerBtn) {
        triggerBtn.addEventListener('click', function() { 
            hiddenSubmit.click(); 
        });
    }
    
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if(cart.length === 0) { 
                alert('Your cart is empty!'); 
                return; 
            }
            
            setLocal('cart', []);
            updateCartBadge();
            
            form.style.display = 'none';
            if(container) container.parentElement.style.display = 'none';
            const successBox = document.getElementById('checkout-success');
            if(successBox) successBox.style.display = 'block';
        });
    }
}

function initWishlist() {
    const grid = document.getElementById('wishlist-grid');
    
    function renderWishlist() {
        const w = getLocal('wishlist');
        if(w.length === 0) { 
            grid.innerHTML = '<p>Your wishlist is empty.</p>'; 
            return; 
        }
        
        let html = '';
        let i = 0;
        while(i < w.length) {
            const p = w[i];
            
            let colorClass = "interested";
            if(p.wStatus === "Owned") colorClass = "";
            else if(p.wStatus === "Not Interested") colorClass = "not-interested";

            let opt1 = "<option value='Owned'> Owned</option>";
            if(p.wStatus === "Owned") opt1 = "<option value='Owned' selected> Owned</option>";

            let opt2 = "<option value='Interested'> Interested</option>";
            if(p.wStatus === "Interested") opt2 = "<option value='Interested' selected> Interested</option>";

            let opt3 = "<option value='Not Interested'> Not Interested</option>";
            if(p.wStatus === "Not Interested") opt3 = "<option value='Not Interested' selected> Not Interested</option>";

            let opt4 = "<option value='Future Buy'> Future Buy</option>";
            if(p.wStatus === "Future Buy") opt3 = "<option value='Future Buy' selected> Future Buy</option>";


            let cardHtml = "<div class='card fade-in'>";
            cardHtml = cardHtml + "<div class='img-placeholder' style='background:transparent;'>";
            cardHtml = cardHtml + "<img src='" + p.image + "' alt='" + p.name + "' class='product-img'>";
            cardHtml = cardHtml + "</div>";
            cardHtml = cardHtml + "<h4 class='card-title'>" + p.name + "</h4>";
            cardHtml = cardHtml + "<p class='card-price'>$" + p.price.toFixed(2) + "</p>";
            cardHtml = cardHtml + "<select class='wishlist-select " + colorClass + "' onchange='updateWStatus(" + p.id + ", this.value)'>";
            cardHtml = cardHtml + opt1 + opt2 + opt3 + opt4;
            cardHtml = cardHtml + "</select>";
            cardHtml = cardHtml + "<button class='btn-remove mt-1' onclick='removeWishlistItem(" + p.id + ")'>Remove</button>";
            cardHtml = cardHtml + "</div>";

            html = html + cardHtml;
            i++;
        }
        grid.innerHTML = html;
    }

    window.updateWStatus = function(id, status) {
        let w = getLocal('wishlist');
        let i = 0;
        while(i < w.length) {
            if(w[i].id === id) w[i].wStatus = status;
            i++;
        }
        setLocal('wishlist', w);
        renderWishlist(); 
    };

    window.removeWishlistItem = function(id) {
        let w = getLocal('wishlist');
        let i = 0;
        while(i < w.length) {
            if(w[i].id === id) { 
                w.splice(i, 1); 
                i--; 
            }
            i++;
        }
        setLocal('wishlist', w);
        renderWishlist();
    };

    renderWishlist();
}

function initFeedback() {
    const form = document.getElementById('feedback-form');
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let fb = getLocal('feedback');
            fb.push({
                name: document.getElementById('fb-name').value,
                email: document.getElementById('fb-email').value,
                msg: document.getElementById('fb-message').value
            });
            setLocal('feedback', fb);
            form.reset();
            
            const successBox = document.getElementById('fb-success');
            if(successBox) {
                successBox.style.display = 'block';
                setTimeout(function() { 
                    successBox.style.display = 'none'; 
                }, 3000);
            }
        });
    }

    const headers = document.querySelectorAll('.acc-btn');
    let i = 0;
    while(i < headers.length) {
        headers[i].addEventListener('click', function() {
            this.classList.toggle('active');
            const arrow = this.querySelector('.acc-arrow');
            if(this.classList.contains('active')) {
                arrow.textContent = '^';
            } else {
                arrow.textContent = 'v';
            }
            
            const content = this.nextElementSibling;
            if(content.style.maxHeight) { 
                content.style.maxHeight = null; 
            } else { 
                content.style.maxHeight = content.scrollHeight + "px"; 
            }
        });
        i++;
    }
}
