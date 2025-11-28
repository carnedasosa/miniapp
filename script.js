// DATABASE PRODOTTI (Dummy Data)
const products = [
    { id: 1, name: "Frozen premium 2k26", category: "Hash Products", price: "€ 12.00/g", farm: "FlyFarm" },

    { id: 2, name: "Lemon Kush", category: "Weed Flowers", price: "€ 6.50/g", farm: "GreenHouse" },

    { id: 3, name: "Rosin", category: "Extracts", price: "€ 60/g", farm: "Amsterdam" },


];

let currentCategory = "";

// INIZIALIZZAZIONE TELEGRAM WEBAPP
window.onload = function() {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand(); // Espande l'app a tutto schermo
        window.Telegram.WebApp.ready();  // Segnala che l'app è pronta
    }
};

// NAVIGAZIONE SPA
function showScreen(screenId) {
    // Nascondi tutte le schermate
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });

    // Mostra quella richiesta
    const targetScreen = document.getElementById(screenId);
    if(targetScreen) {
        targetScreen.classList.remove('hidden');
        // Reset scroll
        targetScreen.scrollTop = 0;
    }

    // Aggiorna stato Footer Tab
    updateFooter(screenId);
}

function updateFooter(activeScreenId) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    
    if (activeScreenId === 'home-screen' || activeScreenId === 'category-screen') {
        document.getElementById('nav-home').classList.add('active');
    } else if (activeScreenId === 'info-screen') {
        document.getElementById('nav-info').classList.add('active');
    } else if (activeScreenId === 'links-screen') {
        document.getElementById('nav-links').classList.add('active');
    }
}


// LOGICA CATEGORIE E PRODOTTI
function openCategory(categoryName) {
    currentCategory = categoryName;
    document.getElementById('category-title').innerText = categoryName;
    
    // Resetta filtri
    document.getElementById('search-bar').value = "";
    populateFarmSelect(categoryName);
    
    // Renderizza prodotti
    filterProducts();
    
    // Cambia schermata
    showScreen('category-screen');
}

function populateFarmSelect(category) {
    const farmSelect = document.getElementById('farm-select');
    // Resetta le option mantenendo la prima
    farmSelect.innerHTML = '<option value="all">Tutte le Farm</option>';
    
    // Trova farm uniche per questa categoria
    const farms = [...new Set(products
        .filter(p => p.category === category)
        .map(p => p.farm))];
    
    farms.forEach(farm => {
        const option = document.createElement('option');
        option.value = farm;
        option.innerText = farm;
        farmSelect.appendChild(option);
    });
}

function filterProducts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const selectedFarm = document.getElementById('farm-select').value;
    const container = document.getElementById('product-list');
    
    container.innerHTML = ""; // Pulisci lista

    const filtered = products.filter(p => {
        const matchCategory = p.category === currentCategory;
        const matchSearch = p.name.toLowerCase().includes(searchTerm);
        const matchFarm = selectedFarm === "all" || p.farm === selectedFarm;
        
        return matchCategory && matchSearch && matchFarm;
    });

    if (filtered.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#666; margin-top:20px;'>Nessun prodotto trovato.</p>";
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-item';
        card.innerHTML = `
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-meta">Farm: ${product.farm}</div>
                <div class="product-price">${product.price}</div>
            </div>
        `;
        container.appendChild(card);
    });
}





// LOGICA ACCORDION INFO
function toggleInfoCard(key) {
    const cards = document.querySelectorAll('.info-card');
    
    cards.forEach(card => {
        const isTarget = card.id === 'info-' + key;
        
        if (isTarget) {
            // se è già aperta, chiudila; altrimenti apri e chiudi le altre
            const alreadyOpen = card.classList.contains('open');
            if (alreadyOpen) {
                card.classList.remove('open');
            } else {
                card.classList.add('open');
            }
        } else {
            card.classList.remove('open');
        }
    });
}
