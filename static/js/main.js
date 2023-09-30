let isDarkMode = localStorage.getItem('darkMode') === 'true' || false;
console.log("Initial dark mode is ", isDarkMode);
if (isDarkMode === true)
{
    console.log("here");
    toggleDarkModeForElements();
}

const modeToggleButton = document.getElementById('mode-toggle-button');
    
    modeToggleButton.onclick = function(event) {
        
        isDarkMode = !isDarkMode;
        const modeImage = document.getElementById('mode-image');
        modeImage.style.transition = 'all 0.3s ease'

        toggleTransitionsForElements();

        toggleDarkModeForElements();
    };


function toggleDarkModeForElements() {
    const elements = document.querySelectorAll('*');
    const modeImage = document.getElementById('mode-image');

    

    if (isDarkMode) {
        modeImage.src = 'static/data/moon.png'; // Change to the moon image
        modeImage.alt = 'Moon'; // Change alt text to 'Moon'
        localStorage.setItem('darkMode', true);

    } else {
        modeImage.src = 'static/data/sun.png'; // Change back to the sun image
        modeImage.alt = 'Sun'; // Change alt text to 'Sun'
        localStorage.setItem('darkMode', false);

    }

    elements.forEach((element) => {
        element.classList.toggle('dark-mode');
    });
}

function toggleTransitionsForElements() {
    const elements = document.querySelectorAll('*');

    elements.forEach((element) => {
        //console.log(element.style.transition);
        //element.style.transition = 'all 0.3s ease';
    });
}


let lastKeyPressTime = 0.0;


document.onkeypress = function(event) {

    const currentTime = Date.now();
    
    const activeElement = document.activeElement;
    
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        return;
    }

    const modeImage = document.getElementById('mode-image');
    modeImage.style.transition = 'all 0.3s ease';

    if (event.key == 'm') {
        if (currentTime - lastKeyPressTime >= 100) {

            isDarkMode = !isDarkMode;
            lastKeyPressTime = currentTime;
            toggleDarkModeForElements();
        }
        
    }
};