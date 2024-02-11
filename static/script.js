document.addEventListener('DOMContentLoaded', function () {

    var inputBox = document.getElementById('userInput');
    var chatDisplay = document.getElementById('chatBody');
    var defaultValues = ["When has Matt used LLMs?",
        "Ask a question about Matt",
        "What's his experience with Generative AI?",
        "What did he do as a Research Scientist at Amazon?",
        "What's Matt's favorite A24 film?",
        "How did Matt make you?",
        "What are projects where he used PyTorch?",
        "Where does the author John Green live?"];
    var currentIndex = 0;
    var currentCharIndex = 0;
    var typingSpeed = 50; // Speed of typing, in milliseconds

    function typeText() {
        if (currentCharIndex < defaultValues[currentIndex].length) {
            inputBox.placeholder += defaultValues[currentIndex].charAt(currentCharIndex);
            currentCharIndex++;
            setTimeout(typeText, typingSpeed);
        } else {
            setTimeout(rotateText, 5000); // Wait for a bit before rotating to the next text
        }
    }

    function rotateText() {
        currentCharIndex = 0;
        inputBox.placeholder = '';
        currentIndex = (currentIndex + 1) % defaultValues.length;
        typeText();
    }

    document.getElementById('message-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var userMessage = inputBox.value;
        
        chatDisplay.innerHTML += '<div class="user-title"></div>';
        chatDisplay.innerHTML += '<div class="user-message">' + userMessage + '</div>';
        scrollToBottom();
        inputBox.value = '';
        
        // Add loading indicator after user's message
        setTimeout(function () {
            // var loadingIndicator = createLoadingIndicator();
            var loadingIndicator = document.createElement('div');
            chatDisplay.innerHTML += '<div class="assistant-title"></div>';
            loadingIndicator.id = 'loadingContainer';
            if (document.getElementById('radio-gpt').checked) {
                loadingIndicator.innerHTML = '<div class="bouncing-balls" id="loader"><div class="ball1"></div><div class="ball2"></div><div class="ball3"></div></div>';
            } else {
                loadingIndicator.innerHTML = '<div class="loader" id="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
            }
            chatDisplay.appendChild(loadingIndicator);
            scrollToBottom();
        }, 500);

        fetch('/path-to-ajax-handler', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage })
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('loader').remove();
                message = data.response.replace(/【.*?†.*?】/g, "");                
                chatDisplay.innerHTML += '<div class="assistant-message">' + message + '</div>';
                scrollToBottom();
            })
            .catch(error => {
                // Remove loading indicator
                document.getElementById('loader').remove();
                console.error('Error:', error);
            });


        // function createLoadingIndicator() {
        //     var loadingIndicator = document.createElement('div');
        //     loadingIndicator.id = 'loadingContainer';
        //     if (document.getElementById('radio-gpt').checked) {
        //         loadingIndicator.innerHTML = '<div class="bouncing-balls"><div class="ball1"></div><div class="ball2"></div><div class="ball3"></div></div>';
        //     } else {
        //         loadingIndicator.innerHTML = '<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>'
        //     }
        //     return loadingIndicator;
        // };

        // Function to scroll to the bottom when new content is added
        function scrollToBottom() {
            var chatLog = document.getElementById('chatBody');
            chatLog.scrollTop = chatLog.scrollHeight;
        }

        rotateText(); // Start the typing effect
    });

    // const svgElement = document.getElementById('menu-button');
    // svgElement.addEventListener('click', () => {
    //     svgElement.classList.toggle('rotate-90');
    // });

    // Event listener for clicks anywhere in the document
    document.addEventListener('click', function(event) {
        var dropdown_menu = document.getElementById('dropdown-menu');
        // Check if the click is outside the dropdown menu
        if (!dropdown_menu.contains(event.target) & dropdown_menu.style.display === 'block') {
            dropdown_menu.style.display = 'none';
            const svgElement = document.getElementById('menu-button');
            svgElement.classList.toggle('rotate-90');
        }
    });

    // Event listener for the menu button
    document.querySelector('.menu-button').addEventListener('click', function(event) {
        event.stopPropagation();
        var dropdownContent = this.nextElementSibling;
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        const svgElement = document.getElementById('menu-button');
        svgElement.classList.toggle('rotate-90');
    });

    document.querySelectorAll('input[name="theme"]').forEach(function(elem) {
        elem.addEventListener('change', function(event) {
            var theme = event.target.value;
            if (theme === 'gpt') {
                document.getElementById('theme-style').href = 'static/gpt_theme.css';
            } else if (theme === 'terminal') {
                document.getElementById('theme-style').href = 'static/terminal_theme.css';
            }
        });
    });

    rotateText();

});
