const flashImg = document.getElementById('flashImg');
setInterval(() => {
  const now = new Date();
  const show = now.getSeconds() % 2 === 0; // Show every even second
  flashImg.style.display = show ? 'block' : 'none'; // Show/hide based on condition
}, 500);

document.addEventListener("mousemove", function (event) {
  console.log("X: " + event.clientX + " Y: " + event.clientY);
});

class Pokemon {
  constructor(name, type, item1, item2, evolution, rarity, personalName = "Enter", hunger = 5, pokedexNumber = 0) {
    this.name = name;
    this.type = type;
    this.item1 = item1;
    this.item2 = item2;
    this.evolution = evolution; // 1, 2, or 3
    this.rarity = rarity;
    this.personalName = personalName;
    this.hunger = hunger;
    this.pokedexNumber = pokedexNumber;
  }
}

const zubat = new Pokemon("zubat", "poison", "berry", "none", 1, 0, "Enter", 5, 41);
user.team.push(zubat);

const goalSelect = document.getElementById("goalSelect");
const locationSelect = document.getElementById("locationSelect");

// Load from localStorage if available
let user = JSON.parse(localStorage.getItem("user")) || {
  goalType: "",
  pokeball: 0,
  bonusPokeball: 5,
  candy: 0,
  location: "Taupe",
  berryPoints: 0,
};

// Update dropdowns from saved data (if any)
goalSelect.value = user.goalType || "";
locationSelect.value = user.location || "Taupe";

// Save data when dropdown changes
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
