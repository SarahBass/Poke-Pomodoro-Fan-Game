/*const flashImg = document.getElementById('flashImg');
setInterval(() => {
  const now = new Date();
  const show = now.getSeconds() % 2 === 0;
  flashImg.style.display = show ? 'block' : 'none';
}, 500);
*/

document.addEventListener("mousemove", function (event) {
  console.log("X: " + event.clientX + " Y: " + event.clientY);
});

let clickCount = 0;

document.addEventListener("click", function () {
  clickCount++;

  const pressStart = document.getElementById("pressStart");
  const welcome = document.getElementById("welcome");
  const pomodoroInfo = document.getElementById("pomodoroInfo");
  const earnPrizes = document.getElementById("EarnPrizes");
  
 let timerRunning = false;
let countdownInterval;
let elapsedTime = 0; // Track the elapsed time in seconds

// Function to start the timer
function startTimer() {
  // Get the current time and calculate the end time (25 minutes from now)
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 25 * 60 * 1000);  // 25 minutes

  // Function to format time as HH:MM
  function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Update the timer every second
  countdownInterval = setInterval(function () {
    const now = new Date();
    const remainingTime = endTime - now; // Time remaining in milliseconds

    if (remainingTime <= 0) {
      clearInterval(countdownInterval);  // Stop the timer when time is up
      document.getElementById("timerText").innerHTML = "Time's Up!";
    } else {
      const minutesRemaining = Math.floor(remainingTime / 60000); // Remaining minutes
      const secondsRemaining = Math.floor((remainingTime % 60000) / 1000); // Remaining seconds

      // Calculate the elapsed time in minutes and seconds
      elapsedTime++;
      const elapsedMinutes = Math.floor(elapsedTime / 60); // Elapsed minutes
      const elapsedSeconds = elapsedTime % 60; // Elapsed seconds

      // Dynamically update the timer display
      document.getElementById("timerText").innerHTML = `
        ${String(minutesRemaining).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')} <br> 
        Elapsed Time: ${String(elapsedMinutes).padStart(2, '0')}:${String(elapsedSeconds).padStart(2, '0')} <br> 
        Time Start: ${formatTime(startTime)} <br> 
        Time End: ${formatTime(endTime)}
      `;
    }
  }, 1000);  // Update every second
}
  
  if (clickCount < 3) {
    goalSelect.style.display = "inline-block";
    locationSelect.style.display = "inline-block";
  } else {
    goalSelect.style.display = "none";
    locationSelect.style.display = "none";
  }

  if (clickCount === 1) {
    // First click: show Pomodoro info
   
    welcome.style.display = "block";
    
  } else if (clickCount ===2) {
    // Second click: show Earn Prizes info
  pressStart.style.display = "none";
    welcome.style.display = "none";
    pomodoroInfo.style.display = "block";
 
    } else if (clickCount ===3) {
    // Second click: show Earn Prizes info
     pressStart.style.display = "none";
    welcome.style.display = "none";
    pomodoroInfo.style.display = "none";
    earnPrizes.style.display = "block";
  }else if (clickCount > 3){
     cleanMenu.style.display = "none";
     pressStart.style.display = "none";
    welcome.style.display = "none";
    pomodoroInfo.style.display = "none";
    earnPrizes.style.display = "none";
    TaupeCave.style.display = "block";
    //zubatContainer.style.display = "block";

    
      // Update the goal label with user's selected goal
  const goalLabel = document.getElementById("goalLabel");
  goalLabel.innerHTML = `Goal selected: <b>${user.goalType}</b>`;
const PokelocationID = document.getElementById("PokelocationID");
PokelocationID.innerHTML = `Location selected: <b>${user.location}</b>`;
 // Make the timer text visible
const timerText = document.getElementById("timerText");
  timerText.style.display = "block";  // Make the timer text visible

  // Start the timer once
  if (!timerRunning) {
    startTimer();
    timerRunning = true;
  }
 
 }
});


class Pokemon {
  constructor(name, type, item1, item2, evolution, rarity, personalName = "Enter", hunger = 5, pokedexNumber = 0) {
    this.name = name;
    this.type = type;
    this.item1 = item1;
    this.item2 = item2;
    this.evolution = evolution;
    this.rarity = rarity;
    this.personalName = personalName;
    this.hunger = hunger;
    this.pokedexNumber = pokedexNumber;
  }
}

// Load from localStorage if available
let user = JSON.parse(localStorage.getItem("user")) || {
  goalType: "Study",
  pokeball: 0,
  bonusPokeball: 5,
  candy: 0,
  location: "TaupeCave",
  berryPoints: 0,
  team: []
};

// Example: add Zubat to team if not already there
if (!user.team.some(p => p.name === "zubat")) {
  const zubat = new Pokemon("zubat", "poison", "berry", "none", 1, 0, "Enter", 5, 41);
  user.team.push(zubat);
  saveUserData(); // Save immediately after adding
}

const goalSelect = document.getElementById("goalSelect");
const locationSelect = document.getElementById("locationSelect");

goalSelect.value = user.goalType || "";
locationSelect.value = user.location || "Taupe";

goalSelect.addEventListener("change", () => {
  user.goalType = goalSelect.value;
  saveUserData();
});

locationSelect.addEventListener("change", () => {
  user.location = locationSelect.value;
  saveUserData();
});

function saveUserData() {
  localStorage.setItem("user", JSON.stringify(user));
}

