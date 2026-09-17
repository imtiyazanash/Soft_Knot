javascript
/* =========================================================
   SOFT KNOT
   Complete Website JavaScript
   ========================================================= */


/* ================= DOM ELEMENTS ================= */

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

const searchBtn = document.getElementById("searchBtn");
const searchOverlay = document.getElementById("searchOverlay");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");

const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const wishlistCount = document.getElementById("wishlistCount");

const shippingProgress =
    document.getElementById("shippingProgress");

const shippingText =
    document.getElementById("shippingText");

const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMessage = document.getElementById("toastMessage");

const productsGrid =
    document.getElementById("productsGrid");

const emptyProducts =
    document.getElementById("emptyProducts");

const sortProducts =
    document.getElementById("sortProducts");


/* ================= CART DATA ================= */

let cart = JSON.parse(localStorage.getItem("softKnotCart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("softKnotWishlist")) || [];


/* ================= SAVE CART ================= */

function saveCart() {

    localStorage.setItem(
        "softKnotCart",
        JSON.stringify(cart)
    );

}


/* ================= SAVE WISHLIST ================= */

function saveWishlist() {

    localStorage.setItem(
        "softKnotWishlist",
        JSON.stringify(wishlist)
    );

}


/* ================= MOBILE MENU ================= */

menuBtn.addEventListener("click", () => {

    navbar.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (navbar.classList.contains("active")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


/* Close mobile menu after navigation */

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        navbar.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* ================= SEARCH ================= */

searchBtn.addEventListener("click", () => {

    searchOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

    setTimeout(() => {
        searchInput.focus();
    }, 300);

});


function closeSearchOverlay() {

    searchOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

    searchInput.value = "";

    filterProducts();

}


closeSearch.addEventListener(
    "click",
    closeSearchOverlay
);


searchOverlay.addEventListener("click", (event) => {

    if (event.target === searchOverlay) {

        closeSearchOverlay();

    }

});


document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeSearchOverlay();

        closeCartSidebar();

    }

});


/* Search products */

searchInput.addEventListener("input", () => {

    filterProducts();

});


/* ================= CATEGORY FILTER ================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        filterProducts();

    });

});


function filterProducts() {

    const activeFilter =
        document.querySelector(".filter-btn.active")
            ?.dataset.filter || "all";

    const searchTerm =
        searchInput.value.toLowerCase().trim();

    const products =
        Array.from(
            document.querySelectorAll(".product-card")
        );

    let visibleCount = 0;

    products.forEach(product => {

        const category =
            product.dataset.category;

        const name =
            product.dataset.name.toLowerCase();

        const matchesCategory =
            activeFilter === "all" ||
            category === activeFilter;

        const matchesSearch =
            !searchTerm ||
            name.includes(searchTerm) ||
            category.includes(searchTerm);

        if (matchesCategory && matchesSearch) {

            product.classList.remove("hidden");

            visibleCount++;

        } else {

            product.classList.add("hidden");

        }

    });


    if (visibleCount === 0) {

        emptyProducts.classList.add("show");

    } else {

        emptyProducts.classList.remove("show");

    }

}


/* ================= CATEGORY CARDS ================= */

document.querySelectorAll(".category-card")
    .forEach(card => {

        card.addEventListener("click", () => {

            const category =
                card.dataset.category;

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

                if (btn.dataset.filter === category) {
                    btn.classList.add("active");
                }

            });

            filterProducts();

        });

    });


/* ================= SORT ================= */

sortProducts.addEventListener("change", () => {

    const value = sortProducts.value;

    const products =
        Array.from(
            document.querySelectorAll(".product-card")
        );

    if (value === "low") {

        products.sort(
            (a, b) =>
                Number(a.dataset.price) -
                Number(b.dataset.price)
        );

    }

    else if (value === "high") {

        products.sort(
            (a, b) =>
                Number(b.dataset.price) -
                Number(a.dataset.price)
        );

    }

    else if (value === "name") {

        products.sort(
            (a, b) =>
                a.dataset.name.localeCompare(
                    b.dataset.name
                )
        );

    }

    products.forEach(product => {

        productsGrid.appendChild(product);

    });

});


/* ================= ADD TO CART ================= */

document.querySelectorAll(".add-cart")
    .forEach(button => {

        button.addEventListener("click", () => {

            const id =
                button.dataset.id;

            const name =
                button.dataset.name;

            const price =
                Number(button.dataset.price);

            const image =
                button.dataset.image;


            const existingProduct =
                cart.find(item => item.id === id);


            if (existingProduct) {

                existingProduct.quantity++;

            } else {

                cart.push({

                    id,
                    name,
                    price,
                    image,
                    quantity: 1

                });

            }


            saveCart();

            updateCart();

            showToast(
                "Added to bag",
                `${name} is now in your shopping bag.`
            );

            openCartSidebar();

        });

    });


/* ================= QUICK ADD ================= */

document.querySelectorAll(".quick-add")
    .forEach(button => {

        button.addEventListener("click", () => {

            const card =
                button.closest(".product-card");

            const addButton =
                card.querySelector(".add-cart");

            addButton.click();

        });

    });


/* ================= UPDATE CART ================= */

function updateCart() {

    renderCart();

    updateCartCount();

    updateWishlistCount();

    updateShippingProgress();

}


/* ================= CART COUNT ================= */

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    cartCount.textContent = count;

}


/* ================= RENDER CART ================= */

function renderCart() {

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🧶
                </div>

                <h3>
                    Your bag is feeling light.
                </h3>

                <p>
                    Add something handmade
                    to make it happier.
                </p>

                <button
                    class="btn btn-outline"
                    id="startShopping">
                    Start Shopping
                </button>

            </div>

        `;

        cartTotal.textContent = "₹0";

        document
            .getElementById("startShopping")
            ?.addEventListener(
                "click",
                () => {

                    closeCartSidebar();

                    document
                        .getElementById("shop")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );

        return;

    }


    cartItemsContainer.innerHTML = "";


    cart.forEach(item => {

        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-image">

                <img src="${item.image}"
                     alt="${item.name}">

            </div>


            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <span>
                    ₹${item.price.toLocaleString("en-IN")}
                </span>


                <div class="quantity-controls">

                    <button
                        class="quantity-minus"
                        data-id="${item.id}">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        class="quantity-plus"
                        data-id="${item.id}">
                        +
                    </button>

                </div>

            </div>


            <button
                class="remove-item"
                data-id="${item.id}"
                aria-label="Remove item">

                <i class="fa-solid fa-trash-can"></i>

            </button>

        `;


        cartItemsContainer.appendChild(cartItem);

    });


    /* Quantity buttons */

    document
        .querySelectorAll(".quantity-minus")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    changeQuantity(
                        button.dataset.id,
                        -1
                    );

                }
            );

        });


    document
        .querySelectorAll(".quantity-plus")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    changeQuantity(
                        button.dataset.id,
                        1
                    );

                }
            );

        });


    /* Remove buttons */

    document
        .querySelectorAll(".remove-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    removeFromCart(
                        button.dataset.id
                    );

                }
            );

        });


    calculateTotal();

}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(id, amount) {

    const item =
        cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );

    }


    saveCart();

    updateCart();

}


/* ================= REMOVE CART ITEM ================= */

function removeFromCart(id) {

    const item =
        cart.find(item => item.id === id);

    cart =
        cart.filter(
            product => product.id !== id
        );

    saveCart();

    updateCart();

    if (item) {

        showToast(
            "Removed from bag",
            `${item.name} was removed.`
        );

    }

}


/* ================= TOTAL ================= */

function calculateTotal() {

    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price * item.quantity,
            0
        );

    cartTotal.textContent =
        `₹${total.toLocaleString("en-IN")}`;

}


/* ================= FREE SHIPPING ================= */

function updateShippingProgress() {

    const FREE_SHIPPING = 1500;

    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.price * item.quantity,
            0
        );


    const progress =
        Math.min(
            (total / FREE_SHIPPING) * 100,
            100
        );


    shippingProgress.style.width =
        `${progress}%`;


    if (total >= FREE_SHIPPING) {

        shippingText.textContent =
            "Yay! You unlocked free shipping ♡";

    } else {

        const remaining =
            FREE_SHIPPING - total;

        shippingText.textContent =
            `Add ₹${remaining.toLocaleString("en-IN")} more for free shipping`;

    }

}


/* ================= OPEN CART ================= */

cartBtn.addEventListener(
    "click",
    openCartSidebar
);


function openCartSidebar() {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

}


/* ================= CLOSE CART ================= */

closeCart.addEventListener(
    "click",
    closeCartSidebar
);


cartOverlay.addEventListener(
    "click",
    closeCartSidebar
);


function closeCartSidebar() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

}


/* ================= WISHLIST ================= */

document.querySelectorAll(".wishlist-btn")
    .forEach(button => {

        const card =
            button.closest(".product-card");

        const productId =
            card.querySelector(".add-cart")
                .dataset.id;


        /* Restore liked state */

        if (wishlist.includes(productId)) {

            button.classList.add("liked");

            button.innerHTML =
                '<i class="fa-solid fa-heart"></i>';

        }


        button.addEventListener(
            "click",
            () => {

                toggleWishlist(
                    productId,
                    button
                );

            }
        );

    });


function toggleWishlist(id, button) {

    if (wishlist.includes(id)) {

        wishlist =
            wishlist.filter(
                item => item !== id
            );

        button.classList.remove("liked");

        button.innerHTML =
            '<i class="fa-regular fa-heart"></i>';

        showToast(
            "Removed from wishlist",
            "The item was removed from your wishlist."
        );

    } else {

        wishlist.push(id);

        button.classList.add("liked");

        button.innerHTML =
            '<i class="fa-solid fa-heart"></i>';

        showToast(
            "Added to wishlist",
            "We'll remember this little favorite."
        );

    }


    saveWishlist();

    updateWishlistCount();

}


/* ================= WISHLIST COUNT ================= */

function updateWishlistCount() {

    wishlistCount.textContent =
        wishlist.length;

}


/* ================= TOAST ================= */

let toastTimer;


function showToast(title, message) {

    toastTitle.textContent = title;

    toastMessage.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);

}


/* ================= REVIEWS ================= */

const reviews =
    document.querySelectorAll(".review-card");

const dots =
    document.querySelectorAll(".dot");

const prevReview =
    document.getElementById("prevReview");

const nextReview =
    document.getElementById("nextReview");


let currentReview = 0;


function showReview(index) {

    reviews.forEach(review => {

        review.classList.remove("active");

    });


    dots.forEach(dot => {

        dot.classList.remove("active");

    });


    reviews[index].classList.add("active");

    dots[index].classList.add("active");

    currentReview = index;

}


nextReview.addEventListener(
    "click",
    () => {

        let next =
            currentReview + 1;

        if (next >= reviews.length) {
            next = 0;
        }

        showReview(next);

    }
);


prevReview.addEventListener(
    "click",
    () => {

        let previous =
            currentReview - 1;

        if (previous < 0) {
            previous = reviews.length - 1;
        }

        showReview(previous);

    }
);


dots.forEach((dot, index) => {

    dot.addEventListener(
        "click",
        () => showReview(index)
    );

});


/* Automatic slider */

setInterval(() => {

    let next =
        currentReview + 1;

    if (next >= reviews.length) {
        next = 0;
    }

    showReview(next);

}, 6000);


/* ================= NEWSLETTER ================= */

const newsletterForm =
    document.getElementById("newsletterForm");


newsletterForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const email =
            document.getElementById("email")
                .value.trim();

        if (!email) return;

        showToast(
            "Welcome to Soft Knot ♡",
            "You're now on our little mailing list."
        );

        newsletterForm.reset();

    }
);


/* ================= CONTACT FORM ================= */

const contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        showToast(
            "Message received!",
            "We'll get back to you soon."
        );

        contactForm.reset();

    }
);


/* ================= CHECKOUT ================= */

const checkoutBtn =
    document.getElementById("checkoutBtn");


checkoutBtn.addEventListener(
    "click",
    () => {

        if (cart.length === 0) {

            showToast(
                "Your bag is empty",
                "Add a handmade item before checkout."
            );

            return;

        }


        showToast(
            "Checkout coming soon",
            "Connect your payment gateway here."
        );

    }
);


/* ================= ACTIVE NAV ON SCROLL ================= */

const sections =
    document.querySelectorAll("section[id]");


window.addEventListener(
    "scroll",
    () => {

        const scrollPosition =
            window.scrollY + 150;


        sections.forEach(section => {

            const top =
                section.offsetTop;

            const height =
                section.offsetHeight;

            const id =
                section.getAttribute("id");


            if (
                scrollPosition >= top &&
                scrollPosition < top + height
            ) {

                document
                    .querySelectorAll(".nav-link")
                    .forEach(link => {

                        link.classList.remove("active");

                    });


                const activeLink =
                    document.querySelector(
                        `.nav-link[href="#${id}"]`
                    );


                if (activeLink) {

                    activeLink.classList.add(
                        "active"
                    );

                }

            }

        });

    }
);


/* ================= INITIALIZE ================= */

updateCart();

updateWishlistCount();

filterProducts();
```
