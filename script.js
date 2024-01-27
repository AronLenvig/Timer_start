let countdown;
const timerDisplay = document.querySelector('.time-left');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const continueButton = document.getElementById('continue');
const resetButton = document.getElementById('reset');
const wakeUpSound = document.getElementById('wake-up-sound');
const timerHeader = document.querySelector('.timer-header');
const breakIcon = document.getElementById('break-icon');

let isPaused = false;
let pauseTime;
let isSleepTime = false;

let awakeTime = 7;
let sleepTime = 5;

function timer(seconds) {
    clearInterval(countdown);
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
        if (!isPaused) {
            const secondsLeft = Math.round((then - Date.now()) / 1000);
            
            if (secondsLeft < 0) {
                if (!isSleepTime) {
                    clearInterval(countdown);
                    alert('Time to sleep');
                    timerHeader.textContent = 'Sleep';
                    isSleepTime = true;
                    timer(sleepTime); // Start 12 seconds countdown
                    return;
                }
                else {
                    clearInterval(countdown);
                    wakeUpSound.play();
                    timerHeader.textContent = 'Awake';
                    isSleepTime = false;
                    // timer(awakeTime); // Start 10 seconds countdown
                    setTimeout(() => timer(awakeTime), 2000); // Restart awaketimer countdown after 2 second
                    return;
                }
            }

            displayTimeLeft(secondsLeft);
        } else {
            pauseTime = Math.round((then - Date.now()) / 1000);
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
    timer(10); // Start 1 minute countdown
    startButton.style.display = 'none'; // Hide start button
    stopButton.style.display = 'initial'; // Show stop button
    resetButton.style.display = 'initial'; // Show reset button
});

stopButton.addEventListener('click', () => {
    isPaused = true;
    timerDisplay.style.color = 'red';
    stopButton.style.display = 'none'; // Hide stop button
    continueButton.style.display = 'initial'; // Show continue button
});

continueButton.addEventListener('click', () => {
    isPaused = false;
    timer(pauseTime);
    timerDisplay.style.color = 'initial';
    continueButton.style.display = 'none'; // Hide continue button
    stopButton.style.display = 'initial'; // Show stop button
});

resetButton.addEventListener('click', () => {
    clearInterval(countdown);
    timerDisplay.textContent = '0:00';
    timerHeader.textContent = 'Awake';
    resetButton.style.display = 'none'; // Hide reset button
    stopButton.style.display = 'none'; // Hide stop button
    continueButton.style.display = 'none'; // Hide continue button
    startButton.style.display = 'initial'; // Show start button
    timerDisplay.style.display = 'initial'; // Show timer text
});

