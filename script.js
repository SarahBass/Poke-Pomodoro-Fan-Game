// ==================== GLOBAL DOM REFERENCES ====================
const pokedexSelect = document.getElementById("pokedexSelect");
const nameInput = document.getElementById("nameInput");
const pokedexImage = document.getElementById("pokedexImage");
const evolveButton = document.getElementById("evolveButton");
const navButtons = document.querySelectorAll('.navigationButton');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const basePath = "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/pokemongifs/";
const imageElement = document.getElementById("cloyster");
const fps = 6;
const frameDuration = 1000 / fps;
let currentPokemonIndex = 0;
let currentFrameIndex = 0;
let currentAnimationFrames = [];
let animationLoop;
let timerRunning = false;
let countdownInterval;
let elapsedTime = 0;
const preloadedFrames = {};
navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('collapsed');
});
// ==================== CONSTANTS ====================
const PokedexbasePath = "https://raw.githubusercontent.com/SarahBass/Poke-Pomodoro-Fan-Game/main/pokedex/";
const TaupeCave = document.getElementById("TaupeCave");
// ==================== DATA CLASSES ====================
class Pokemon {
  constructor(name, type, item1, item2, evolution, rarity, personalName = "Enter", hunger = 5, pokedexNumber = 0, animationName = "", animationNumber = 0) {
    this.name = name;
    this.type = type;
    this.item1 = item1;
    this.item2 = item2;
    this.evolution = evolution;
    this.rarity = rarity;
    this.personalName = personalName;
    this.hunger = hunger;
    this.pokedexNumber = pokedexNumber;
    this.animationName = animationName;
    this.animationNumber = animationNumber;
  }
}

class User {
  constructor(data = {}) {
    this.goalType = data.goalType || "Study";
    this.pokeball = data.pokeball || 0;
    this.bonusPokeball = data.bonusPokeball || 5;
    this.greatPokeball = data.greatPokeball || 0;
    this.ultraPokeball = data.ultraPokeball || 0;
    this.masterPokeball = data.masterPokeball || 1;
    this.candy = data.candy || 10;
    this.location = data.location || "TaupeCave";
    this.berryPoints = data.berryPoints || 0;
    this.team = data.team?.map(p => new Pokemon(...Object.values(p))) || User.defaultTeam();
  }

  static defaultTeam() {
    return [
      new Pokemon("zubat", "poison", "berry", "none", 1, 1, "Enter", 5, 41, "zu", 7),
      new Pokemon("golbat", "poison", "berry", "cookie", 3, 1, "Enter", 10, 42, "gol", 7),
      new Pokemon("zubat", "poison", "berry", "none", 1, 1, "Enter", 5, 41, "zu", 7),
      new Pokemon("specialzubat", "poison", "cookie", "none", 1, 1, "Enter", 5, 941, "specialzu", 6),
      new Pokemon("cloyster", "water", "berry", "cookie", 3, 1, "Enter", 10, 91, "cl", 11),
      new Pokemon("onix", "rock", "candy", "none", 3, 1, "Enter", 20, 95, "o", 11),
      new Pokemon("geodude", "rock", "berry", "none", 1, 0, "Enter", 7, 74),
    ];
  }
}

const wildPokemonPool = [
  new Pokemon("geodude", "rock", "berry", "none", 1, 0, "Enter", 7, 74),
  new Pokemon("graveler", "rock", "berry", "berry", 2, 0, "Enter", 14, 75),
  new Pokemon("golem", "rock", "cookie", "cookie", 3, 0, "Enter", 20, 76),
  new Pokemon("caterpie", "bug", "berry", "none", 1, 0, "Enter", 5, 10),
  new Pokemon("metapod", "bug", "berry", "berry", 2, 0, "Enter", 10, 11),
  new Pokemon("butterfree", "bug", "berry", "cookie", 3, 0, "Enter", 15, 12),
  new Pokemon("shellder", "water", "berry", "none", 1, 0, "Enter", 5, 90),
  new Pokemon("zubat", "poison", "berry", "none", 1, 1, "Enter", 5, 41, "zu", 7),
  new Pokemon("golbat", "poison", "berry", "cookie", 3, 1, "Enter", 10, 42, "gol", 7),
  new Pokemon("specialzubat", "poison", "berry","cookie", 1, 1, "Enter", 0, 941, "specialzu", 6),
  new Pokemon("specialgolbat", "poison", "cookie", "cookie", 3, 0, "Enter", 0, 942, "gol", 6),
  new Pokemon("cloyster", "water", "berry", "cookie", 3, 1, "Enter", 10, 91, "cl", 11),
  new Pokemon("onix", "rock", "candy", "none", 3, 1, "Enter", 20, 95, "o", 11),
];

const user = new User();

// ==================== DISPLAY UPDATES ====================
function updateCandyDisplay() {
  document.getElementById('candyDisplay').textContent = "Candy: " + user.candy;
}

function displayPokemonVisuals(index) {
  const pokemon = user.team[index];
  pokedexImage.src = `${PokedexbasePath}${pokemon.name}.PNG`;
  nameInput.value = pokemon.personalName;
}

function updateEvolveButton(index) {
  const pokemon = user.team[index];
  if (pokemon.evolution >= 3 || user.candy < 3 || pokemon.evolution < 1) {
    evolveButton.textContent = "Can't Evolve";
    evolveButton.disabled = true;
  } else {
    evolveButton.textContent = "Evolve";
    evolveButton.disabled = false;
  }
}

function displayPokemonInfo(index) {
  displayPokemonVisuals(index);
  updateEvolveButton(index);
}

function updatePokedexMenu() {
  pokedexSelect.innerHTML = "";

  user.team.forEach((pokemon, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `#${pokemon.pokedexNumber} ${pokemon.name}`;
    pokedexSelect.appendChild(option);
  });

  const selectedIndex = parseInt(pokedexSelect.value) || 0;
  if (user.team.length > 0 && selectedIndex < user.team.length) {
    pokedexSelect.value = selectedIndex;
    displayPokemonInfo(selectedIndex);
  }
}

function preloadAllAnimations() {
  user.team.forEach(pokemon => {
    const key = pokemon.pokedexNumber;
    if (!preloadedFrames[key]) {
      const frames = [];

      const blank = new Image();
      blank.src = `${basePath}blank.png?raw=true`;
      frames.push(blank);

      for (let i = 1; i <= pokemon.animationNumber; i++) {
        const img = new Image();
        img.src = `${basePath}${pokemon.animationName}${i}.png?raw=true`;
        frames.push(img);
      }

      preloadedFrames[key] = frames;
    }
  });
}

function loadAnimationFrames(pokemon) {
  const key = pokemon.pokedexNumber;
  return preloadedFrames[key] || [];
}

function playNextFrame() {
  if (currentFrameIndex < currentAnimationFrames.length) {
    imageElement.src = currentAnimationFrames[currentFrameIndex].src;
    currentFrameIndex++;
  } else {
    clearInterval(animationLoop);
    setTimeout(() => {
      currentPokemonIndex = (currentPokemonIndex + 1) % user.team.length;
      const nextPokemon = user.team[currentPokemonIndex];
      currentAnimationFrames = loadAnimationFrames(nextPokemon);
      currentFrameIndex = 0;
      animationLoop = setInterval(playNextFrame, frameDuration);
    },0 ); // 500ms pause before next Pokémon
  }
}

// ==================== FUNCTIONAL ACTIONS ====================
function clonePokemon(template, personalName = "Enter") {
  return new Pokemon(
    template.name,
    template.type,
    template.item1,
    template.item2,
    template.evolution,
    template.rarity,
    personalName,
    template.hunger,
    template.pokedexNumber,
    template.animationName,
    template.animationNumber
  );
}

function evolvePokemon(index) {
  const pokemon = user.team[index];
  if (!pokemon || pokemon.evolution >= 3 || user.candy < 3) {
    console.log("Can't evolve.");
    return;
  }

  user.candy -= 3;
  updateCandyDisplay();

  const holdName = pokemon.personalName;
  const holdEvolutionNumber = pokemon.pokedexNumber + 1;
  user.team.splice(index, 1);

  const evolvedTemplate = wildPokemonPool.find(p => p.pokedexNumber === holdEvolutionNumber);
  if (evolvedTemplate) {
    const evolved = clonePokemon(evolvedTemplate, holdName);
    user.team.push(evolved);
    console.log(`${holdName} has evolved!`);
  } else {
    console.log("No evolved form found.");
  }

  updatePokedexMenu();
}

// ==================== NAVIGATION LOGIC ====================
function hideAllPhases() {
  document.querySelectorAll(".phase").forEach(p => p.style.display = "none");
  document.getElementById("pokedexContainer").style.display = "none";  // Hide Pokedex explicitly here
document.getElementById("pokedexImage").style.display = "none";
  document.getElementById("Pokedexpage").style.display = "none";  // Hide Pokedex images here
  document.getElementById("cloyster").style.display = "none";
    TaupeCave.style.display = "none";
    clearInterval(animationLoop);
}

function showStartPhase() {
  hideAllPhases();
  document.querySelector(".StartWrapper").style.display = "block";
}

function showPomodoroPhase() {
  hideAllPhases();
  document.querySelector(".PomodoroWrapper").style.display = "block";
  TaupeCave.style.display = "block";
  document.getElementById("cloyster").style.display = "block";
 preloadAllAnimations();
currentAnimationFrames = loadAnimationFrames(user.team[currentPokemonIndex]);
animationLoop = setInterval(playNextFrame, frameDuration);
}

function showCatchPhase() {
  hideAllPhases();
  document.querySelector(".CatchWrapper").style.display = "block";
}

function showPokedexPhase() {
  hideAllPhases();
  document.getElementById("pokedexContainer").style.display = "block";  // Show Pokedex explicitly here
  document.getElementById("Pokedexpage").style.display = "block";
  document.getElementById("pokedexImage").style.display = "block";
  initializePokedex();
}

// ==================== EVENT LISTENERS ====================
navButtons.forEach(button => {
  button.addEventListener('click', () => {
    navButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});

document.querySelector(".StartWrapper button").addEventListener("click", showStartPhase);
document.querySelector(".PomodoroWrapper button").addEventListener("click", showPomodoroPhase);
document.querySelector(".CatchWrapper button").addEventListener("click", showCatchPhase);
document.querySelector(".PokedexWrapper button").addEventListener("click", showPokedexPhase);

pokedexSelect.addEventListener("change", function () {
  const selectedIndex = parseInt(this.value);
  displayPokemonInfo(selectedIndex);
});

nameInput.addEventListener("input", function () {
  const selectedIndex = parseInt(pokedexSelect.value);
  user.team[selectedIndex].personalName = this.value;
});

evolveButton.addEventListener("click", function () {
  const selectedIndex = parseInt(pokedexSelect.value);
  evolvePokemon(selectedIndex);
});

// ==================== INITIALIZATION ====================
function initializePokedex() {
  if (user.team.length > 0) {
    updatePokedexMenu();
    displayPokemonInfo(0);
  }
}

updateCandyDisplay();
