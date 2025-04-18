// Global Variables

let clickCount = 0;
let timerRunning = false;
let countdownInterval;
let elapsedTime = 0;

const pressStart = document.getElementById("pressStart");
const welcome = document.getElementById("welcome");
const pomodoroInfo = document.getElementById("pomodoroInfo");
const earnPrizes = document.getElementById("EarnPrizes");
const cleanMenu = document.getElementById("cleanMenu"); // Make sure this exists
const TaupeCave = document.getElementById("TaupeCave");
const timerText = document.getElementById("timerText");
const goalSelect = document.getElementById("goalSelect");
const locationSelect = document.getElementById("locationSelect");


//Game Data Management
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

const GameState = {
  phase: "start",
  location: null,
  studyType: null,
  startTime: null,
  endTime: null,
  elapsedTime: 0,
  pokemonCaught: [],
  timerInterval: null,
};

class User {
  constructor(data = {}) {
    this.goalType = data.goalType || "Study";
    this.pokeball = data.pokeball || 0;
    this.bonusPokeball = data.bonusPokeball || 5;
    this.greatPokeball = data.greatPokeball || 0;
    this.ultraPokeball = data.ultraPokeball || 0;
    this.masterPokeball = data.masterPokeball || 1; 
    this.candy = data.candy || 0;
    this.location = data.location || "TaupeCave";
    this.berryPoints = data.berryPoints || 0;
    this.team = data.team?.map(p => new Pokemon(...Object.values(p))) || User.defaultTeam();
  }

  addPokeball() {
    this.pokeball++;
  }

  subtractPokeball() {
    if (this.pokeball > 0) this.pokeball--;
  }

  subtractBonusPokeball() {
    if (this.bonusPokeball > 0) this.bonusPokeball--;
  }

  addCandy() {
    this.candy++;
  }

  subtractCandy() {
    if (this.candy > 0) this.candy--;
  }

  addToTeam(pokemon) {
    this.team.push(pokemon);
  }

  removeFromTeam() {
    if (this.team.length > 2) {
      return this.team.pop();
    } else {
      console.log("You must keep at least 2 Pokémon in your team!");
      return null;
    }
  }

  save() {
    localStorage.setItem("user", JSON.stringify(this));
  }

  static defaultTeam() {
    return [
      new Pokemon("zubat", "poison", "berry", "none", 1, 1, "Enter", 5, 41),
      new Pokemon("golbat", "poison", "berry", "cookie", 3, 1, "Enter", 10, 42),
      new Pokemon("zubat", "poison", "berry", "none", 1, 1, "Enter", 5, 41),
      new Pokemon("zubat", "poison", "berry", "none", 1, 1, "Enter", 5, 41),
      new Pokemon("cloyster", "water", "berry", "cookie", 3, 1, "Enter", 10, 91),
      new Pokemon("onix", "rock", "candy", "none", 3, 1, "Enter", 20, 95),
    ];
  }
}

function tryCatchPokemon(user) {
  const wildPokemonPool = [
    new Pokemon("geodude", "rock", "berry", "none", 1, 0, "Enter", 7, 74),
    new Pokemon("graveler", "rock", "berry", "berry", 2, 0, "Enter", 14, 75),
    new Pokemon("golem", "rock", "cookie", "cookie", 3, 0, "Enter", 20, 76),
    new Pokemon("caterpie", "bug", "berry", "none", 1, 0, "Enter", 5, 10),
    new Pokemon("metapod", "bug", "berry", "berry", 2, 0, "Enter", 10, 11),
    new Pokemon("butterfree", "bug", "berry", "cookie", 3, 0, "Enter", 15, 12),
    new Pokemon("shellder", "water", "berry", "none", 1, 0, "Enter", 5, 90)
  ];

  for (let evoLevel = 1; evoLevel <= 3; evoLevel++) {
    const candidates = wildPokemonPool
      .filter(p => p.evolutionLevel === evoLevel && p.rarity === 0)
      .sort((a, b) => a.pokedexNumber - b.pokedexNumber);

    if (candidates.length > 0) {
      const wild = candidates[0];

      // Use available pokeballs to reduce hunger
      while (wild.hunger > 0 && (user.pokeball > 0 || user.bonusPokeball > 0)) {
        if (user.bonusPokeball > 0) {
          user.bonusPokeball--;
        } else {
          user.pokeball--;
        }
        wild.hunger--;
      }

      // Only add to team if hunger is now 0
      if (wild.hunger === 0) {
        wild.rarity = 1;
        user.addToTeam(wild); // or user.team.push(wild)
        saveUserData();
        return wild;
      }

      // Could not catch due to hunger
      return null;
    }
  }

  // No catchable Pokémon left
  return null;
}

//Local Storage

let savedData = JSON.parse(localStorage.getItem("user"));
let user = new User(savedData);

goalSelect.value = user.goalType;
locationSelect.value = user.location;

goalSelect.addEventListener("change", () => {
  user.goalType = goalSelect.value;
  user.save(); // cleaner
});

locationSelect.addEventListener("change", () => {
  user.location = locationSelect.value;
  user.save(); // again, use the method inside the class
});




//Start Screen 
document.getElementById("startButton").addEventListener("click", () => {
  clickCount++;

  if (clickCount === 1) {
    welcome.style.display = "block";
  } else if (clickCount === 2) {
    welcome.style.display = "none";
    pomodoroInfo.style.display = "block";
  } else if (clickCount === 3) {
    pomodoroInfo.style.display = "none";
    earnPrizes.style.display = "block";
  } else {
    goToPhase("startIntro");
  }

  if (clickCount < 3) {
    goalSelect.style.display = "inline-block";
    locationSelect.style.display = "inline-block";
  } else {
    goalSelect.style.display = "none";
    locationSelect.style.display = "none";
  }
});

//Page Transition Phases

function goToPhase(newPhase) {
  GameState.phase = newPhase;
  clearInterval(GameState.timerInterval);
  GameState.timerInterval = null;

  pressStart.style.display = "none";
  welcome.style.display = "none";
  pomodoroInfo.style.display = "none";
  earnPrizes.style.display = "none";
  cleanMenu.style.display = "none";
  TaupeCave.style.display = "none";
  timerText.style.display = "none";

  if (newPhase === "startIntro") {
    TaupeCave.style.display = "block";
    timerText.style.display = "block";

    document.getElementById("goalLabel").innerHTML = `Goal selected: <b>${user.goalType}</b>`;
    document.getElementById("PokelocationID").innerHTML = `Location selected: <b>${user.location}</b>`;

    if (!timerRunning) {
      startTimer();
      timerRunning = true;
    }
  }
}

//Timer Functions and Logic
function startTimer() {
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 25 * 60 * 1000);

  countdownInterval = setInterval(() => {
    const now = new Date();
    const remainingTime = endTime - now;

    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      document.getElementById("timerText").innerHTML = "Time's Up!";
    } else {
      elapsedTime++;
      const minutesRemaining = Math.floor(remainingTime / 60000);
      const secondsRemaining = Math.floor((remainingTime % 60000) / 1000);
      const elapsedMinutes = Math.floor(elapsedTime / 60);
      const elapsedSeconds = elapsedTime % 60;

      document.getElementById("timerText").innerHTML = `
        ${String(minutesRemaining).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')} <br> 
        Elapsed Time: ${String(elapsedMinutes).padStart(2, '0')}:${String(elapsedSeconds).padStart(2, '0')} <br> 
        Time Start: ${formatTime(startTime)} <br> 
        Time End: ${formatTime(endTime)}
      `;
    }
  }, 1000);
}

function formatTime(date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

//Pomodoro Phase Page
function startPomodoroPhase() {
  GameState.startTime = new Date();
  GameState.endTime = new Date(GameState.startTime.getTime() + 25 * 60000);
  updatePomodoroUI();
  GameState.timerInterval = setInterval(updatePomodoroUI, 1000);
}

function updatePomodoroUI() {
  const now = new Date();
  const remaining = GameState.endTime - now;

  if (remaining <= 0) {
    goToPhase("catch");
    return;
  }

  const minutes = String(Math.floor(remaining / 1000 / 60)).padStart(2, "0");
  const seconds = String(Math.floor(remaining / 1000) % 60).padStart(2, "0");
  const startTimeStr = formatTime(GameState.startTime);
  const endTimeStr = formatTime(GameState.endTime);

  document.getElementById("pomodoroTimerText").innerHTML = 
    `${minutes}:${seconds}<br>Time Start: ${startTimeStr}<br>Time End: ${endTimeStr}`;
}
/*
function populateDropdowns(user) {
  const typeSelect = document.getElementById("pokeballTypeSelect");
  const amountSelect = document.getElementById("pokeballAmountSelect");

  typeSelect.innerHTML = ""; // Clear existing
  if (user.pokeball > 0) {
    typeSelect.innerHTML += `<option value="pokeball">Pokeball (${user.pokeball})</option>`;
  }
  if (user.bonusPokeball > 0) {
    typeSelect.innerHTML += `<option value="bonusPokeball">BonusPokeball (${user.bonusPokeball})</option>`;
  }

  // Initial amount setup
  updateAmountOptions(user, typeSelect.value);
  
  // Update amount when type changes
  typeSelect.onchange = () => updateAmountOptions(user, typeSelect.value);
}

function updateAmountOptions(user, type) {
  const amountSelect = document.getElementById("pokeballAmountSelect");
  amountSelect.innerHTML = "";

  const max = type === "pokeball" ? user.pokeball : user.bonusPokeball;
  for (let i = 0; i <= max; i++) {
    amountSelect.innerHTML += `<option value="${i}">${i}</option>`;
  }
}

function generateWildPokemon(user, allWildPokemonList) {
  if (user.wildPokemon) return; // Already generated

  const levels = [1, 2, 3];

  for (let level of levels) {
    const candidates = allWildPokemonList
      .filter(p =>
        p.evolutionLevel === level &&
        p.rarity === 0 // hasn't been caught
      )
      .sort((a, b) => a.pokedexNumber - b.pokedexNumber); // lowest dex first

    if (candidates.length > 0) {
      const selected = Object.assign({}, candidates[0]); // clone to avoid modifying master list
      selected.hunger = 1; // or set randomly: Math.floor(Math.random() * 3) + 1
      user.wildPokemon = selected;
      break;
    }
  }
}



function feedWildPokemon(user, pokeballType, amount, allWildPokemonList) {
  if (!user.wildPokemon || user.wildPokemon.hunger <= 0) return;

  const currentCount = pokeballType === "pokeball" ? user.pokeball : user.bonusPokeball;

  if (amount > currentCount) {
    console.warn("Not enough pokeballs!");
    return;
  }

  // Subtract pokeballs
  if (pokeballType === "pokeball") {
    user.pokeball -= amount;
  } else {
    user.bonusPokeball -= amount;
  }

  // Decrease hunger
  user.wildPokemon.hunger -= amount;
  if (user.wildPokemon.hunger <= 0) {
    user.wildPokemon.hunger = 0;

    // Set rarity = 1 on master list so it can't appear again
    const masterPoke = allWildPokemonList.find(p => p.pokedexNumber === user.wildPokemon.pokedexNumber);
    if (masterPoke) masterPoke.rarity = 1;

    // Add to user team
    user.team.push(user.wildPokemon);
    user.wildPokemon = null;

    saveUserData(); // Optional: save after catch
  }
}


//Under construction

function showCatchScreen() {
  // Generate wild Pokémon and assign to user
  const wildPokemon = generateWildPokemon(user, allWildPokemonList);
  user.wildPokemon = wildPokemon;

  if (wildPokemon) {
    console.log(`A wild ${wildPokemon.name} has appeared!`);
    console.log(`Hunger level: ${wildPokemon.hunger}`);
  } else {
    console.log("No eligible wild Pokémon was found.");
  }

  saveUserData();
}

function calculateBerryScore() {
  const BerryValues = {
    dragon: 35,
    grass: 33,
    poison: 32,
    water: 31,
    rock: 30,
    fighting: 27,
    normal: 28,
    fire: 27,
    ghost: 26,
    psychic: 26,
    fairy: 26,
    electric: 25,
    bug: 24,
    flying: 24
  };

  user.berryPoints = 0; // reset berryPoints

  for (let i = 0; i < user.team.length; i++) {
    const pokemon = user.team[i];
    const berryValue = BerryValues[pokemon.type] || 0;

    if (pokemon.item1 === "berry") {
      user.berryPoints += berryValue;
    }

    if (pokemon.item2 === "berry") {
      user.berryPoints += berryValue;
    }
  }
}

function showPokedexScreen() {
  const container = document.getElementById("pokedexContainer");
  container.innerHTML = "<h2>Your Pokédex</h2>";

  user.team.forEach(pokemon => {
    const imageUrl = `https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/pokedex/${pokemon.name}.PNG?raw=true`;

    const entry = document.createElement("div");
    entry.innerHTML = `
      <img src="${imageUrl}" alt="${pokemon.name}" style="width:100px;height:auto;">
      <p>${pokemon.name}</p>
    `;

    container.appendChild(entry);
  });
}*/
