document.addEventListener('DOMContentLoaded', function () {

    const inputBox = document.getElementById('userInput');
    const messagesEl = document.getElementById('messages');
    const defaultCards = document.getElementById('defaultCards');
    let conversationStarted = false;

    // ── Project card carousel ──
    const cards = Array.from(document.querySelectorAll('.project-card'));
    let activeIndex = 0;

    // Keep --card-travel in sync with the container height so cards travel exactly the right distance
    function updateTravelDistance() {
        const h = defaultCards.offsetHeight;
        defaultCards.style.setProperty('--card-travel', h + 'px');
    }
    updateTravelDistance();
    window.addEventListener('resize', updateTravelDistance);

    // Position all cards below to start, then show the first
    cards.forEach((card, i) => {
        card.classList.add(i === 0 ? 'active' : 'below');
    });

    function advanceCard() {
        if (!conversationStarted) {
            const current = cards[activeIndex];
            activeIndex = (activeIndex + 1) % cards.length;
            const next = cards[activeIndex];

            // Both cards animate simultaneously — new one pushes old one out
            current.classList.remove('active');
            current.classList.add('above');
            next.classList.remove('below');
            next.classList.add('active');

            // Reset outgoing card to below with no transition so it doesn't animate back down
            setTimeout(() => {
                current.style.transition = 'none';
                current.classList.remove('above');
                current.classList.add('below');
                // Re-enable transition after the class swap has been painted
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        current.style.transition = '';
                    });
                });
            }, 1000);
        }
    }

    setInterval(advanceCard, 7000);

    // ── Placeholder typing effect ──
    const placeholders = [
        "When has Matt used LLMs?",
        "What did he do as a Research Scientist at Amazon?",
        "What's his experience with Generative AI?",
        "What are projects where he used PyTorch?",
        "How did Matt get into machine learning?"
    ];
    let placeholderIndex = 0;
    let charIndex = 0;

    function typePlaceholder() {
        if (charIndex < placeholders[placeholderIndex].length) {
            inputBox.placeholder += placeholders[placeholderIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typePlaceholder, 50);
        } else {
            setTimeout(rotatePlaceholder, 3000);
        }
    }

    function rotatePlaceholder() {
        charIndex = 0;
        inputBox.placeholder = '';
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        typePlaceholder();
    }

    typePlaceholder();

    // ── Enter key submits ──
    inputBox.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('submit').click();
        }
    });

    // ── Form submit ──
    document.getElementById('message-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const userMessage = inputBox.value.trim();
        if (!userMessage) return;

        if (!conversationStarted) {
            defaultCards.style.display = 'none';
            conversationStarted = true;
        }

        addMessageCard('user', userMessage);
        inputBox.value = '';
        inputBox.placeholder = '';

        // Loading card
        const loadingCard = document.createElement('div');
        loadingCard.id = 'loadingCard';
        loadingCard.className = 'loading-card';
        loadingCard.innerHTML = `
            <div class="message-label" style="text-align:right;">MattGPT</div>
            <div class="loader" style="justify-content:flex-end;">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;
        messagesEl.appendChild(loadingCard);
        scrollToBottom();

        fetch('/path-to-ajax-handler', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        })
        .then(r => r.json())
        .then(data => {
            document.getElementById('loadingCard').remove();
            const text = data.response.replace(/【.*?†.*?】/g, '');
            addMessageCard('assistant', text);
        })
        .catch(err => {
            document.getElementById('loadingCard').remove();
            addMessageCard('assistant', 'Sorry, something went wrong. Please try again.');
            console.error(err);
        });
    });

    // ── Helpers ──

    function addMessageCard(role, text) {
        const card = document.createElement('div');
        card.className = `message-card ${role}`;

        const label = role === 'user' ? 'You' : 'MattGPT';
        const content = role === 'assistant'
            ? marked.parse(text)
            : escapeHtml(text);

        card.innerHTML = `
            <div class="message-label">${label}</div>
            <div class="message-content">${content}</div>
        `;
        messagesEl.appendChild(card);
        scrollToBottom();
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function scrollToBottom() {
        const chatArea = document.getElementById('chatArea');
        chatArea.scrollTop = chatArea.scrollHeight;
    }

});
