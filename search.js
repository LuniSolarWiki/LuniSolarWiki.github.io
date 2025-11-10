/* --- Lunisolar Wiki Autocomplete Search Script --- */

document.addEventListener('DOMContentLoaded', () => {

    // This is our "database" of all searchable pages.
    // I've added a "description" field to each item.
    const searchData = [
        { 
            title: 'Getting Started', 
            page: 'index.html', 
            description: 'The main guide for new players. Covers islands, money, crates, and more.',
            keywords: [
                'start', 'guide', 'home', 'begin', 'starting', 'island', '/ob', 
                'how to play', 'new', 'player', 'tutorial', 'basics', 'create', 
                'go', 'money', 'making money', 'crates', 'keys', 'pwarp', 'chestshop', 
                'ah', 'auction house', 'koth', 'envoys', 'party games', 'duels'
            ] 
        },
        { 
            title: 'Server Rules', 
            page: 'rules.html', 
            description: 'All server rules about chat, griefing, cheating, and allowed mods.',
            keywords: [
                'rules', 'ban', 'grief', 'allowed', 'mods', 'cheating', 'hack', 
                'punishments', 'mute', 'jail', 'kick', 'staff', 'respect', 'spam', 
                'language', 'chat', 'exploits', 'bugs', 'xray', 'allowed mods', 
                'unban', 'appeal', 'be respectful'
            ] 
        },
        { 
            title: 'Vote Page', 
            page: 'vote.html', 
            description: 'Find all vote links here to get free keys and rewards.',
            keywords: [
                'vote', 'voting', 'keys', 'links', 'crate', 'key', 'rewards', 
                'free', 'daily', 'websites', 'vote links', 'vote keys', 
                'common', 'epic', 'legendary', 'koth key'
            ] 
        },
        { 
            title: 'Commands List', 
            page: 'commands.html', 
            description: 'A complete list of all player commands available on the server.',
            keywords: [
                'commands', 'cmd', '/ob', '/ah', '/pwarp', '/warp', '/sell', '/duel', '/pg', 
                'list', 'all commands', '/msg', '/r', '/pay', '/bal', '/balance', '/spawn', 
                '/sethome', '/home', '/delhome', '/tpa', '/tpaccept', '/tpadeny', 
                'warps', 'player warp', '/is', 'island commands', 'party'
            ] 
        },
        { 
            title: 'Ranks & Perks', 
            page: 'ranks.html', 
            description: 'See all the perks, kits, and benefits for each donation rank.',
            keywords: [
                'ranks', 'perks', 'store', 'buy', 'nebula', 'eclipse', 'solar', 'lunar', 'lunisolar', 
                'donate', 'donation', 'purchase', 'vip', 'kits', 'fly', 'benefits', 
                'features', 'shop', 'buycraft', 'tebex', 'upgrade'
            ] 
        },
        { 
            title: 'Economy & Shop', 
            page: 'economy.html', 
            description: 'Learn how to make money, use the auction house, and create chest shops.',
            keywords: [
                'economy', 'money', 'shop', 'sell', 'buy', 'ah', 'auction', 'chestshop', 
                'balance', 'bal', 'eco', 'making money', 'earn', 'how to sell', 
                'how to buy', 'player shop', 'admin shop', '/sell', 'auction house', 
                'pwarp', 'market', 'price', 'pricing'
            ] 
        },
        { 
            title: 'Oneblock Phases', 
            page: 'phases.html', 
            description: 'A list of all OneBlock island phases and the biomes you will unlock.',
            keywords: [
                'phases', 'oneblock', 'biomes', 'plains', 'jungle', 'desert', 'deep dark', 
                'island phases', 'levels', 'progress', 'blocks', 'list of phases', 
                'ocean', 'swamp', 'nether', 'end', 'ice', 'mushroom', 'dungeon', 
                'stronghold', 'forest', 'cave', 'winter'
            ] 
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
                item.dataset.page = match.page; // Store the page URL
                item.dataset.index = index;     // Store the index for keyboard nav

                // *** NEW: Create the inner HTML with title and description ***
                item.innerHTML = `
                    <div class="suggestion-title">${match.title}</div>
                    <div class="suggestion-desc">${match.description}</div>
                `;
                // *** END OF NEW PART ***

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
