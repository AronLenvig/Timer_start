let countdown;
const timerDisplay = document.querySelector('.time-left');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const continueButton = document.getElementById('continue');
const resetButton = document.getElementById('reset');
const wakeUpSound = document.getElementById('wake-up-sound');
const timerHeader = document.querySelector('.timer-header');
const breakIcon = document.getElementById('break-icon');
const sleepModal = document.getElementById("sleepModal");
const sleepOkButton = document.getElementById("sleepOkButton");
const awakeTimeInput = document.getElementById('awake-time');
const sleepTimeInput = document.getElementById('sleep-time');

let isPaused = false;
let pauseTime;
let isSleepTime = false;

let awakeTime = awakeTimeInput.value ? awakeTimeInput.value : 60;
let sleepTime = sleepTimeInput.value ? sleepTimeInput.value : 12;

function timer(seconds) {
    clearInterval(countdown);

    if (!isPaused) {
        startTime = Date.now();
        targetTime = startTime + seconds * 1000;
        displayTimeLeft(seconds);
        console.log(targetTime);
    } else {
        // Calculate new target time based on the remaining pause time
        targetTime = Date.now() + pauseTime * 1000;
        isPaused = false; // Reset pause state
        console.log(targetTime);
    }

    countdown = setInterval(() => {
        const currentTime = Date.now();
        const secondsLeft = Math.round((targetTime - currentTime) / 1000);

        if (secondsLeft < 0) {
            clearInterval(countdown);

            if (!isSleepTime) {
                clearInterval(countdown);
                // stop the timer and display the sleep modal
                sleepModal.style.display = "block";
                timerHeader.textContent = 'Sleep';
                isSleepTime = true;
                isPaused = true;
                pauseTime = Math.round((targetTime - Date.now()) / 1000);
                pauseTime = pauseTime < 0 ? 0 : pauseTime; // Ensure pause time is not negative
                return;
            }
            else {
                clearInterval(countdown);
                wakeUpSound.play();
                timerHeader.textContent = 'Awake';
                isSleepTime = false;
                setTimeout(() => timer(awakeTime), 2000); // Restart awaketimer countdown after 2 second
                return;
            }
        } else {
            displayTimeLeft(secondsLeft);
        }
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = display;
}

startButton.addEventListener('click', () => {
    isPaused = false;
    timerHeader.textContent = 'Awake';
    timer(awakeTime); // Start 1 minute countdown
    timerDisplay.style.color = 'initial';
    startButton.style.display = 'none'; // Hide start button
    stopButton.style.display = 'initial'; // Show stop button
    resetButton.style.display = 'initial'; // Show reset button
});
// Update the stop and continue button event listeners
stopButton.addEventListener('click', () => {
    isPaused = true;
    pauseTime = Math.round((targetTime - Date.now()) / 1000);
    pauseTime = pauseTime < 0 ? 0 : pauseTime; // Ensure pause time is not negative
    clearInterval(countdown); // Stop the current countdown interval
    timerDisplay.style.color = 'red';
    stopButton.style.display = 'none'; // Hide stop button
    awakeTimeInput.style.display = 'none'; // Hide awake time input
    sleepTimeInput.style.display = 'none'; // Hide sleep time input
    continueButton.style.display = 'initial'; // Show continue button

    // Display break icon or other UI changes for pause
});

continueButton.addEventListener('click', () => {
    isPaused = false;
    console.log(pauseTime);
    timer(pauseTime);
    timerDisplay.style.color = 'initial';
    continueButton.style.display = 'none'; // Hide continue button
    stopButton.style.display = 'initial'; // Show stop button
});

resetButton.addEventListener('click', () => {
    clearInterval(countdown);
    timerDisplay.textContent = '0:00';
    timerHeader.textContent = 'Awake';
    timerDisplay.style.color = 'initial';
    resetButton.style.display = 'none'; // Hide reset button
    stopButton.style.display = 'none'; // Hide stop button
    continueButton.style.display = 'none'; // Hide continue button
    startButton.style.display = 'initial'; // Show start button
    timerDisplay.style.display = 'initial'; // Show timer text
});


// When the user clicks on <span> (x), close the modal
sleepOkButton.onclick = function() {
    sleepModal.style.display = "none";
    isPaused = false;
    timer(12); // Start 12 seconds countdown    
    // document.getElementById('break-icon').style.display = 'block'; // Show break icon
}

// Close the modal and start the sleep timer
sleepOkButton.addEventListener('click', () => {
    sleepModal.style.display = "none";
    timer(sleepTime); // Start 12 seconds countdown
});

