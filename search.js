/* --- Lunisolar Wiki Autocomplete Search Script --- */

document.addEventListener('DOMContentLoaded', () => {

    // This is our "database" of all searchable pages.
    // I've added a "headings" array to search for topics *on* each page.
    const searchData = [
        { 
            title: 'Getting Started', 
            page: 'index.html', 
            description: 'The main guide. Covers islands, money, crates, pwarps, ah, koth, and more.',
            keywords: [
                'start', 'guide', 'home', 'begin', 'starting', 'island', '/ob', 
                'how to play', 'new', 'player', 'tutorial', 'basics', 'create', 'go'
            ],
            headings: [
                'Starting Your Island', 'Making Money', 'Crate Keys', 'Player Warps (pwarp)',
                'ChestShops / PlayerShops', 'Auction House (AH)', 'KoTH (King of the Hill)',
                'Envoys', 'Party Games', 'Duels'
            ]
        },
        { 
            title: 'Server Rules', 
            page: 'rules.html', 
            description: 'All server rules for chat, gameplay, cheating, and punishments.',
            keywords: [
                'rules', 'ban', 'grief', 'allowed', 'mods', 'cheating', 'hack', 
                'punishments', 'mute', 'jail', 'kick', 'staff', 'respect', 'spam', 
                'language', 'chat', 'exploits', 'bugs', 'xray', 'allowed mods', 
                'unban', 'appeal', 'be respectful'
            ],
            headings: [
                'General Rules', 'Chat Rules', 'Gameplay Rules', 'Hacking / Cheating',
                'Allowed Modifications', 'Punishment System', 'Appeals'
            ]
        },
        { 
            title: 'Vote Page', 
            page: 'vote.html', 
            description: 'Find all vote links here to get free keys and daily rewards.',
            keywords: [
                'vote', 'voting', 'keys', 'links', 'crate', 'key', 'rewards', 
                'free', 'daily', 'websites', 'vote links', 'vote keys'
            ],
            headings: [
                'Vote Links', 'Voting Rewards', 'Common Key', 'Epic Key', 'Legendary Key', 'VoteParty'
            ]
        },
        { 
            title: 'Commands List', 
            page: 'commands.html', 
            description: 'A complete list of all player commands (/ob, /ah, /warp, /tpa, etc).',
            keywords: [
                'commands', 'cmd', 'list', 'all commands', 'warps', 'player warp', 'island commands', 'party'
            ],
            headings: [
                '/ob', '/is', '/ah', '/pwarp', '/warp', '/sell', '/duel', '/pg', 
                '/msg', '/r', '/pay', '/bal', '/balance', '/spawn', 
                '/sethome', '/home', '/delhome', '/tpa', '/tpaccept', '/tpadeny'
            ]
        },
        { 
            title: 'Ranks & Perks', 
            page: 'ranks.html', 
            description: 'See all perks, kits, and benefits for the Lunar, Solar, Eclipse, and Nebula ranks.',
            keywords: [
                'ranks', 'perks', 'store', 'buy', 'donate', 'donation', 'purchase', 'vip', 
                'benefits', 'features', 'shop', 'buycraft', 'tebex', 'upgrade'
            ],
            headings: [
                'Nebula Rank', 'Eclipse Rank', 'Solar Rank', 'Lunar Rank', 'Lunisolar Rank',
                'Perk List', 'Available Kits', 'Store Link'
            ]
        },
        { 
            title: 'Economy & Shop', 
            page: 'economy.html', 
            description: 'Learn how to make money, use /sell, the auction house, and create chest shops.',
            keywords: [
                'economy', 'money', 'shop', 'sell', 'buy', 'ah', 'auction', 'chestshop', 
                'balance', 'bal', 'eco', 'making money', 'earn', 'how to sell', 
                'how to buy', 'player shop', 'admin shop', 'market', 'price', 'pricing'
            ],
            headings: [
                'How to make money', '/sell command', 'Auction House (AH)', 'ChestShops',
                'Server Shop', '/warp shop', '/balance', '/pay'
            ]
        },
        { 
            title: 'Oneblock Phases', 
            page: 'phases.html', 
            description: 'A list of all OneBlock island phases, levels, and biomes you will unlock.',
            keywords: [
                'phases', 'oneblock', 'biomes', 'levels', 'progress', 'blocks', 
                'list of phases', 'island phases'
            ],
            headings: [
                'Phase 1: Plains', 'Phase 2: Forest', 'Phase 3: Jungle', 'Phase 4: Swamp',
                'Phase 5: Desert', 'Phase 6: Ocean', 'Phase 7: Deep Dark', 'Phase 8: Nether', 'Phase 9: The End'
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
            // *** NEW: Check if the query matches any headings ***
            const headingMatch = item.headings.some(h => h.toLowerCase().includes(query));
            
            return titleMatch || keywordMatch || headingMatch;
        });

        if (matches.length > 0) {
            matches.forEach((match, index) => {
                const item = document.createElement('div');
                item.classList.add('suggestion-item');
                item.dataset.page = match.page; // Store the page URL
                item.dataset.index = index;     // Store the index for keyboard nav

                // Create the inner HTML with title and description
                item.innerHTML = `
                    <div class="suggestion-title">${match.title}</div>
                    <div class="suggestion-desc">${match.description}</div>
                `;

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
