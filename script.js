let products = [];
let currentCategory = "";

// --------------------------------------
// FUTURO-PROOF: Carica i prodotti (statico ora)
// --------------------------------------
async function loadProductsData() {
    return [
        {
            id: 1,
            name: "Frozen premium 2k26",
            category: "Hash Products",
            farm: "FlyFarm",
            thumb: "img/flyfarm.jpg",
            videoUrl: "media/flyfarm.mp4",
            tariffs: [
                { label: "4g", price: "20€" },
                { label: "10g", price: "50€" },
                { label: "25g", price: "90€" },
                { label: "50g", price: "160€" }
            ]
        },
        {
            id: 2,
            name: "Californiana",
            category: "Weed Flowers",
            farm: "Marocco Farm",
            thumb: "img/californiana.jpg",
            videoUrl: "media/flyfarm.mp4",
            tariffs: [
                { label: "3g", price: "30€" },
                { label: "10g", price: "80€" },
                { label: "25g", price: "170€" },
                { label: "50g", price: "500€" }
            ]
        },
        {
            id: 3,
            name: "purple haze",
            category: "Weed Flowers",
            farm: "amsterdam Farm",
            thumb: "img/purple-haze.jpg",
            videoUrl: "media/flyfarm.mp4",
            tariffs: [
                { label: "3g", price: "30€" },
                { label: "10g", price: "80€" },
                { label: "25g", price: "170€" },
                { label: "50g", price: "500€" }
            ]
        }
    ];
}

// --------------------------------------
// INIT
// --------------------------------------
window.onload = async function () {
    products = await loadProductsData();

    if (window.Telegram?.WebApp) {
        Telegram.WebApp.expand();
        Telegram.WebApp.ready();
    }
};


// --------------------------------------
// NAVIGAZIONE
// --------------------------------------
function showScreen(screenId) {
    // Se sto uscendo dalla pagina prodotto → stoppo il video
    if (screenId !== 'product-screen') {
        const video = document.getElementById('product-video');
        if (video) {
            video.pause();
            video.currentTime = 0; // torni all'inizio
        }
    }

    // Nascondi tutte le schermate
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    // Mostra quella richiesta
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        targetScreen.scrollTop = 0;
    }

    // Aggiorna stato Footer
    updateFooter(screenId);
}


function updateFooter(id) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    if (["home-screen", "category-screen", "product-screen"].includes(id))
        document.getElementById("nav-home").classList.add("active");

    else if (id === "info-screen")
        document.getElementById("nav-info").classList.add("active");

    else if (id === "links-screen")
        document.getElementById("nav-links").classList.add("active");
}

// --------------------------------------
// CATEGORIE
// --------------------------------------
function openCategory(categoryName) {
    currentCategory = categoryName;

    document.getElementById("category-title").innerText = categoryName;
    document.getElementById("search-bar").value = "";

    populateFarmSelect();
    filterProducts();
    showScreen('category-screen');
}


// --------------------------------------
// FILTRI
// --------------------------------------
function populateFarmSelect() {
    const select = document.getElementById("farm-select");
    select.innerHTML = `<option value="all">Tutte le Farm</option>`;

    [...new Set(products
        .filter(p => p.category === currentCategory)
        .map(p => p.farm)
    )].forEach(f => {
        const opt = document.createElement("option");
        opt.value = f;
        opt.innerText = f;
        select.appendChild(opt);
    });
}

function filterProducts() {
    const search = document.getElementById("search-bar").value.toLowerCase();
    const farm = document.getElementById("farm-select").value;
    const box = document.getElementById("product-list");

    box.innerHTML = "";

    const filtered = products.filter(p =>
        p.category === currentCategory &&
        p.name.toLowerCase().includes(search) &&
        (farm === "all" || p.farm === farm)
    );

    filtered.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-item";

    const thumbHTML = prod.thumb
        ? `<img src="${prod.thumb}"
                class="prod-thumb-small"
                loading="lazy"
                alt="${prod.name}">`: "";


        card.innerHTML = `
            ${thumbHTML}
            <div class="product-info">
                <div class="product-name">${prod.name}</div>
                <div class="product-meta">${prod.farm}</div>
            </div>
        `;

        card.onclick = () => openProduct(prod.id);
        box.appendChild(card);
    });
}


// --------------------------------------
// PRODUCT PAGE
// --------------------------------------
function openProduct(id) {
    const p = products.find(pr => pr.id === id);
    if (!p) return;

    document.getElementById("product-title").innerText = p.name;
    document.getElementById("product-farm-top").innerText = p.farm;

    // VIDEO
    const videoWrap = document.getElementById("product-video-wrapper");
    if (p.videoUrl) {
        videoWrap.classList.remove("hidden");
        document.getElementById("product-video-src").src = p.videoUrl;
        document.getElementById("product-video").load();
    } else videoWrap.classList.add("hidden");

    // TARIFE
    const grid = document.getElementById("tariffs-grid");
    grid.innerHTML = "";

    p.tariffs.forEach(t => {
        const box = document.createElement("div");
        box.className = "tariff-card";
        box.innerHTML = `
            <div class="tariff-quantity">${t.label}</div>
            <div class="tariff-price">${t.price}</div>
        `;
        grid.appendChild(box);
    });

    showScreen('product-screen');
}


// --------------------------------------
// INFO CARD
// --------------------------------------
function toggleInfoCard(key) {
    document.querySelectorAll(".info-card").forEach(card => {
        const open = card.id === "info-" + key;
        if (open) card.classList.toggle("open");
        else card.classList.remove("open");
    });
}
