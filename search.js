/* --- Lunisolar Wiki Autocomplete Search Script --- */

document.addEventListener('DOMContentLoaded', () => {

    // This is our "database" of all searchable pages.
    // Add more keywords to any page to improve the search.
    const searchData = [
        { 
            title: 'Getting Started', 
            page: 'index.html', 
            keywords: ['start', 'guide', 'home', 'begin', 'starting', 'island', '/ob'] 
        },
        { 
            title: 'Server Rules', 
            page: 'rules.html', 
            keywords: ['rules', 'ban', 'grief', 'allowed', 'mods', 'cheating', 'hack'] 
        },
        { 
            title: 'Vote Page', 
            page: 'vote.html', 
            keywords: ['vote', 'voting', 'keys', 'links', 'crate', 'key'] 
        },
        { 
            title: 'Commands List', 
            page: 'commands.html', 
            keywords: ['commands', 'cmd', '/ob', '/ah', '/pwarp', '/warp', '/sell', '/duel', '/pg'] 
        },
        { 
            title: 'Ranks & Perks', 
            page: 'ranks.html', 
            keywords: ['ranks', 'perks', 'store', 'buy', 'nebula', 'eclipse', 'solar', 'lunar', 'lunisolar'] 
        },
        { 
            title: 'Economy & Shop', 
            page: 'economy.html', 
            keywords: ['economy', 'money', 'shop', 'sell', 'buy', 'ah', 'auction', 'chestshop'] 
        },
        { 
            title: 'Oneblock Phases', 
            page: 'phases.html', 
            keywords: ['phases', 'oneblock', 'biomes', 'plains', 'jungle', 'desert', 'deep dark'] 
        }
    ];

    // Get the elements
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const suggestionsBox = document.getElementById('search-suggestions');
    
    let activeSuggestionIndex = -1;

    // --- Show/Hide Suggestions ---
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        suggestionsBox.innerHTML = ''; // Clear old suggestions
        activeSuggestionIndex = -1; // Reset keyboard selection

        if (query.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }

        // Filter the search data
        const matches = searchData.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(query);
            const keywordMatch = item.keywords.some(k => k.toLowerCase().includes(query));
            return titleMatch || keywordMatch;
        });

        if (matches.length > 0) {
            matches.forEach((match, index) => {
                const item = document.createElement('div');
                item.classList.add('suggestion-item');
                item.textContent = match.title;
                item.dataset.page = match.page; // Store the page URL
                item.dataset.index = index;     // Store the index for keyboard nav

                // Click to go to page
                item.addEventListener('click', () => {
                    window.location.href = match.page;
                });
                
                suggestionsBox.appendChild(item);
            });
            suggestionsBox.style.display = 'block';
        } else {
            suggestionsBox.style.display = 'none';
        }
    });

    // --- Keyboard Navigation (Up/Down Arrows) ---
    searchInput.addEventListener('keydown', (e) => {
        const items = suggestionsBox.querySelectorAll('.suggestion-item');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
            updateActiveSuggestion(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
            updateActiveSuggestion(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(items);
        }
    });

    // --- Search Button Click ---
    searchButton.addEventListener('click', () => {
        const items = suggestionsBox.querySelectorAll('.suggestion-item');
        performSearch(items);
    });

    // --- Helper: Go to selected page ---
    function performSearch(items) {
        // If an item is highlighted with keys, go there
        if (activeSuggestionIndex > -1) {
            window.location.href = items[activeSuggestionIndex].dataset.page;
        } 
        // Otherwise, go to the *first* item in the list
        else if (items.length > 0) {
            window.location.href = items[0].dataset.page;
        } 
        // If no matches, show an alert
        else {
            alert("No matching page found for '" + searchInput.value + "'.\n\nTry a keyword like 'vote', 'ranks', 'rules', or 'commands'.");
        }
    }

    // --- Helper: Highlight active item ---
    function updateActiveSuggestion(items) {
        items.forEach((item, index) => {
            if (index === activeSuggestionIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // --- Hide suggestions when clicking elsewhere ---
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
            activeSuggestionIndex = -1;
        }
    });
});