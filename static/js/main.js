let isDarkMode = localStorage.getItem('darkMode') === 'true' || false;
console.log("Initial dark mode is ", isDarkMode);
if (isDarkMode === true)
{
    console.log("here");
    toggleDarkModeForElements();
}

const modeToggleButton = document.getElementById('mode-toggle-button');

    
    modeToggleButton.addEventListener('click', function() {

        const modeImage = document.getElementById('mode-image');
        modeImage.style.transition = 'all 0.3s ease'
        
        toggleTransitionsForElements();

        console.log("Dark mode is ", isDarkMode);
        isDarkMode = !isDarkMode;
        localStorage.setItem("darkMode", isDarkMode);
        console.log("Changed dark mode to ", isDarkMode);
        console.log("Dark mode is ", isDarkMode);

    

        toggleDarkModeForElements();
    });


function toggleDarkModeForElements() {
    const elements = document.querySelectorAll('*');
    const modeImage = document.getElementById('mode-image');
    

    if (isDarkMode) {
        modeImage.src = 'static/data/moon.png'; // Change to the moon image
        modeImage.alt = 'Moon'; // Change alt text to 'Moon'
    } else {
        modeImage.src = 'static/data/sun.png'; // Change back to the sun image
        modeImage.alt = 'Sun'; // Change alt text to 'Sun'
    }

    elements.forEach((element) => {
        element.classList.toggle('dark-mode');
    });
}

function toggleTransitionsForElements() {
    const elements = document.querySelectorAll('*');

    elements.forEach((element) => {
        console.log(element.style.transition);
        //element.style.transition = 'all 0.3s ease';
    });
}
