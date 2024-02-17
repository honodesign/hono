// Global variable to hold the current color
var currentColor = { r: 255, g: 255, b: 255 }; // Default color, updated dynamically
var currentLogoPath = "logos/001.png"; // Default color, updated dynamically
var originalTitle = ""; // Variable to store the original title for comparison

document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('title');
    const logoElement = document.getElementById('logo');
    const bodyElement = document.body;
    let currentIndex = 0;
    let data = [];
    let colors = [];
    let editedTitle = null;

    // Function to fetch and parse the main data
    function fetchData() {
        fetch('data.csv')
            .then(response => response.text())
            .then(text => {
                const rows = text.split('\n').slice(1); // Skip header row
                data = rows.map(row => {
                    const parts = row.split(',');
                    // Validate row format: it should have exactly 3 parts (title, logo, fontFamily)
                    if (parts.length === 3) {
                        const [title, logoName, fontFamily] = parts;
                        // Further validation can ensure title and logo are not empty
                        if (title.trim() && logoName.trim()) {
                            const logo = `logos/${logoName.trim()}.png`;
                            currentLogoPath = logo; // Update the global color variable
                            document.dispatchEvent(new CustomEvent('logoUpdated'));
                            return { title, logo, fontFamily };
                        }
                    }
                    // For rows that don't meet the criteria, you could return a default object or skip them
                    // Here, we choose to skip invalid rows by returning null and filtering them out
                    return null;
                }).filter(item => item !== null); // Remove invalid rows (nulls)
                fetchColors(); // Continue to fetch colors after validating data
            });
    }
    

    // Function to fetch and parse colors data
    function fetchColors() {
        fetch('colors.csv')
            .then(response => response.text())
            .then(text => {
                const rows = text.split('\n');
                colors = rows.map(row => {
                    const [titleColor, backgroundColor] = row.split(',');
                    return { titleColor, backgroundColor };
                });
                updateContent();
            });
    }

    // Converts a HEX color to an RGB object
    function hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        // 3 digits
        if (hex.length == 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        // 6 digits
        else if (hex.length == 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return { r, g, b };
    }    

    // Function to update the content, apply random colors, and set the font family
    function updateContent() {
        if (data[currentIndex] && colors.length > 0) {
            const { logo, fontFamily } = data[currentIndex];
            const randomIndex = Math.floor(Math.random() * colors.length);
            const { titleColor, backgroundColor } = colors[randomIndex];

            titleElement.textContent = editedTitle ? editedTitle : data[currentIndex].title;
            titleElement.style.color = titleColor;
            if(fontFamily) { // Apply the font family if specified
                titleElement.className = fontFamily; // Assuming you use class names for font families in your CSS
            }
            bodyElement.style.backgroundColor = backgroundColor;

            const rgbColor = hexToRgb(titleColor);
            currentColor = rgbColor; // Update the global color variable
            document.dispatchEvent(new CustomEvent('colorUpdated'));

            // Apply colors to CSS variables.
            document.documentElement.style.setProperty('--primary', titleColor);
            document.documentElement.style.setProperty('--secondary', backgroundColor);

            // Assuming data[currentIndex].logo contains the new logo path
            currentLogoPath = data[currentIndex].logo; // Update the global logo path
            document.dispatchEvent(new CustomEvent('logoUpdated')); // Trigger the canvas update
        }
    }

    // Enable title editing and save changes
    titleElement.setAttribute('contenteditable', 'true');

    titleElement.addEventListener('input', (e) => {
        editedTitle = e.target.textContent; // Update in real-time on input
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % data.length;
            updateContent();
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + data.length) % data.length;
            updateContent();
        }
    }); 
    
    // Prevent 'Enter' from creating new lines
    titleElement.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Stops the Enter key from creating a new line
        }
    });

    fetchData();

    var outboundLink = document.getElementById('on-demand-link');
    if (outboundLink) {
        outboundLink.addEventListener('click', function() {
        // Send an event to GA4
        gtag('event', 'click', {
            'event_category': 'Outbound Link',
            'event_label': 'On-Demand Link',
            'transport_type': 'beacon'
        });
        });
    }
});
