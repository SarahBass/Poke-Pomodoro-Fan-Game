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

  if (clickCount === 1) {
    // First click: show Pomodoro info
   
    welcome.style.display = "block";
    
  } else if (clickCount ===2) {
    // Second click: show Earn Prizes info
    welcome.style.display = "none";
    pomodoroInfo.style.display = "block";
 
    } else if (clickCount ===3) {
    // Second click: show Earn Prizes info
    welcome.style.display = "none";
    pomodoroInfo.style.display = "none";
    earnPrizes.style.display = "block";
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
  goalType: "",
  pokeball: 0,
  bonusPokeball: 5,
  candy: 0,
  location: "Taupe",
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
