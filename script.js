const pokedexSelect = document.getElementById("pokedexSelect");
const nameInput = document.getElementById("nameInput");
const pokedexImage = document.getElementById("pokedexImage");
const evolveButton = document.getElementById("evolveButton");
const PokedexbasePath = "https://raw.githubusercontent.com/SarahBass/Poke-Pomodoro-Fan-Game/main/pokedex/";  // Fixed image path
pokedexImage.style.display = "block";

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
    this.candy = data.candy || 4;
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
  new Pokemon("specialzubat", "poison", "cookie", "none", 1, 1, "Enter", 5, 941, "specialzu", 6),
  new Pokemon("specialgolbat", "cookie", "cookie", 3, 1, "Enter", 0, 942, "gol", 6),
  new Pokemon("cloyster", "water", "berry", "cookie", 3, 1, "Enter", 10, 91, "cl", 11),
  new Pokemon("onix", "rock", "candy", "none", 3, 1, "Enter", 20, 95, "o", 11),
];

const user = new User();
document.getElementById('candyDisplay').textContent = "Candy: " + user.candy;

function updateCandyDisplay() {
  document.getElementById('candyDisplay').textContent = "Candy: " + user.candy;
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

  const evolved = wildPokemonPool.find(p => p.pokedexNumber === holdEvolutionNumber);

  if (evolved) {
    evolved.personalName = holdName;
    user.team.push(evolved);
    console.log(`${holdName} has evolved!`);
  } else {
    console.log("No evolved form found.");
  }

  updatePokedexMenu();
}

function updatePokedexMenu() {
  pokedexSelect.innerHTML = "";

  user.team.forEach((pokemon, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `#${pokemon.pokedexNumber} ${pokemon.name}`;
    pokedexSelect.appendChild(option);
  });

  if (user.team.length > 0) {
    const selectedIndex = parseInt(pokedexSelect.value) || 0;
    displayPokemonInfo(selectedIndex);
  }
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

// New refactored function that uses the two above
function displayPokemonInfo(index) {
  displayPokemonVisuals(index);
  updateEvolveButton(index);
}

// Event: dropdown select
pokedexSelect.addEventListener("change", function () {
  const selectedIndex = parseInt(this.value);
  displayPokemonInfo(selectedIndex);
});

// Event: rename input
nameInput.addEventListener("input", function () {
  const selectedIndex = parseInt(pokedexSelect.value);
  user.team[selectedIndex].personalName = this.value;
});

// Event: evolve button
evolveButton.addEventListener("click", function () {
  const selectedIndex = parseInt(pokedexSelect.value);
  evolvePokemon(selectedIndex);
});

// Initialize
function initializePokedex() {
  if (user.team.length > 0) {
    pokedexSelect.value = 0;
    updatePokedexMenu();
    displayPokemonInfo(0);
  }
}

initializePokedex();
