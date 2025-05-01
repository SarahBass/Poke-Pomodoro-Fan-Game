// ==================== GLOBAL DOM REFERENCES ====================
const pokedexSelect = document.getElementById("pokedexSelect")
const nameInput = document.getElementById("nameInput")
const pokedexImage = document.getElementById("pokedexImage")
const evolveButton = document.getElementById("evolveButton")
const navButtons = document.querySelectorAll(".navigationButton")
const navToggle = document.getElementById("navToggle")
const navMenu = document.getElementById("navMenu")
const basePath =
  "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/pokemongifs/"
const CookiebasePath =
  "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/catchEM/"
const imageElement = document.getElementById("cloyster");
const imageElement2 = document.getElementById("catchThis");
const fps = 6
const frameDuration = 1000 / fps
let currentPokemonIndex = 0
let currentFrameIndex = 0
let currentAnimationFrames = []
let animationLoop
let animationLoop2
let timerRunning = false
let countdownInterval
let elapsedTime = 0
const preloadedFrames = {}
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("collapsed")
})

// ==================== Graphic CONSTANTS ====================
const PokedexbasePath =
  "https://raw.githubusercontent.com/SarahBass/Poke-Pomodoro-Fan-Game/main/pokedex/"
const LocationPathway =
  "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/staticbackgrounds/"
//Menu for Location Selector
document
  .getElementById("locationSelect")
  .addEventListener("change", function () {
    const selectedLocation = this.value
    user.location = selectedLocation
    setLocation(user.location)
    user.team = teamsByLocation[selectedLocation]
      ? teamsByLocation[selectedLocation].map(
          (p) => new Pokemon(...Object.values(p)),
        )
      : User.defaultTeam()

    setLocation(user.location)
  })
const timerTextDiv = document.getElementById("timerText")

document.getElementById("cookieSelect").addEventListener("change", () => {
  const selectedCookie = document.getElementById("cookieSelect").value
  const cookieImageUrl = `${CookiebasePath}${selectedCookie}.png?raw=true`
})
const table = document.getElementById("inventoryTable")
// Function to update the table
function updateInventory() {
  document.getElementById("berryPoints").innerText =
    "Berry: " + user.berryPoints
  document.getElementById("bonusPokeball").innerText =
    "Bonus Cookie: " + user.bonusPokeball
  document.getElementById("pokeball").innerText =
    "Poke Cookie: " + user.pokeball
  document.getElementById("greatPokeball").innerText =
    "Great Cookie: " + user.greatPokeball
  document.getElementById("ultraPokeball").innerText =
    "Ultra Cookie: " + user.ultraPokeball
  document.getElementById("masterPokeball").innerText =
    "Master Cookie: " + user.masterPokeball
}

// ==================== DATA CLASSES ====================
class Pokemon {
  constructor(
    name,
    type,
    item1,
    item2,
    evolution,
    rarity,
    personalName = "Enter",
    hunger = 5,
    pokedexNumber = 0,
    animationName = "",
    animationNumber = 0,
  ) {
    this.name = name
    this.type = type
    this.item1 = item1
    this.item2 = item2
    this.evolution = evolution
    this.rarity = rarity
    this.personalName = personalName
    this.hunger = hunger
    this.pokedexNumber = pokedexNumber
    this.animationName = animationName
    this.animationNumber = animationNumber
  }
}

class User {
  constructor(data = {}) {
    this.goalTime = data.goalTime || 1;
    this.pokeball = data.pokeball || 10;
    this.bonusPokeball = data.bonusPokeball || 0;
    this.greatPokeball = data.greatPokeball || 5;
    this.ultraPokeball = data.ultraPokeball || 5;
    this.masterPokeball = data.masterPokeball || 1;
    this.candy = data.candy || 10;
    this.location = data.location || "taupecave";
    this.berryPoints = data.berryPoints || 0;
    this.team =
      data.team?.map((p) => new Pokemon(...Object.values(p))) || User.defaultTeam();
    this.catch = new Pokemon(
      "caterpie",
      "bug",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      10,
      "ca",
      7
    );
  }

  // Method to check and add the Pokemon to the team
  checkAndAddToTeam() {
      const clonedPokemon = this.clonePokemon(this.catch);
      this.team.push(clonedPokemon);
      console.log(`Wild ${clonedPokemon.name} has been added to your team!`);
  }
  
  earnBerryRewards() {
  if (this.berryPoints >= 500) {
    this.bonusPokeball += 100;
  } else if (this.berryPoints >= 400) {
    this.pokeball += 20;
  } else if (this.berryPoints >= 300) {
    this.ultraPokeball += 5;
  } else if (this.berryPoints >= 200) {
    this.greatPokeball += 5;
  } else if (this.berryPoints >= 100) {
    this.pokeball += 5;
  }
  
}

  // Method to clone a Pokemon
  clonePokemon(pokemon) {
    return new Pokemon(
      pokemon.name,
      pokemon.type,
      pokemon.item1,
      pokemon.item2,
      pokemon.evolution,
      pokemon.rarity,
      pokemon.personalName,
      pokemon.hunger,
      pokemon.pokedexNumber,
      pokemon.animationName,
      pokemon.animationNumber
    );
  }

  // Static method for default team
  static defaultTeam() {
    return [
      new Pokemon("geodude", "rock", "berry", "none", 1, 0, "Enter", 7, 74, "geo", 7),
      new Pokemon("golbat", "poison", "berry", "cookie", 3, 1, "Enter", 10, 42, "gol", 7),
      new Pokemon("zubat", "poison", "berry", "none", 1, 1, "Enter", 5, 41, "zu", 7),
      new Pokemon("specialzubat", "poison", "cookie", "none", 1, 1, "Enter", 5, 941, "specialzu", 6),
      new Pokemon("cloyster", "water", "berry", "cookie", 3, 1, "Enter", 10, 91, "cl", 11),
      new Pokemon("onix", "rock", "candy", "none", 3, 1, "Enter", 20, 95, "o", 11),
      new Pokemon("gastly", "ghost", "berry", "none", 1, 0, "Enter", 7, 92, "gastly", 7),
      new Pokemon("caterpie", "bug", "berry", "none", 1, 0, "Enter", 5, 10, "ca", 7),
      new Pokemon("krabby", "water", "berry", "none", 1, 0, "Enter", 5, 99, "crab", 7)
    ];
  }
}

//-------------------Pokemon Teams COLLAPSE FOR SCROLLING --------------------------

const teamsByLocation = {
  taupecave: [
    new Pokemon(
      "geodude",
      "rock",
      "berry",
      "none",
      1,
      0,
      "Enter",
      7,
      74,
      "geo",
      7,
    ),
    new Pokemon(
      "golbat",
      "poison",
      "berry",
      "cookie",
      3,
      1,
      "Enter",
      10,
      42,
      "gol",
      7,
    ),
    new Pokemon(
      "zubat",
      "poison",
      "berry",
      "none",
      1,
      1,
      "Enter",
      5,
      41,
      "zu",
      7,
    ),
    new Pokemon(
      "specialzubat",
      "poison",
      "cookie",
      "none",
      1,
      1,
      "Enter",
      5,
      941,
      "specialzu",
      6,
    ),
    new Pokemon(
      "cloyster",
      "water",
      "berry",
      "cookie",
      3,
      1,
      "Enter",
      10,
      91,
      "cl",
      11,
    ),
    new Pokemon(
      "onix",
      "rock",
      "candy",
      "none",
      3,
      1,
      "Enter",
      20,
      95,
      "o",
      11,
    ),
    new Pokemon(
      "gastly",
      "ghost",
      "berry",
      "none",
      1,
      0,
      "Enter",
      7,
      92,
      "gastly",
      7,
    ),
  ],
  NightCamp: [
    new Pokemon(
      "butterfree",
      "bug",
      "berry",
      "cookie",
      3,
      0,
      "Enter",
      15,
      12,
      "butter",
      11,
    ),
    new Pokemon(
      "venomoth",
      "bug",
      "berry",
      "berry",
      3,
      0,
      "Enter",
      7,
      49,
      "venomoth",
      7,
    ),
    new Pokemon(
      "butterfree",
      "bug",
      "berry",
      "cookie",
      3,
      0,
      "Enter",
      15,
      12,
      "butter",
      11,
    ),
    new Pokemon(
      "venonat",
      "bug",
      "berry",
      "none",
      1,
      0,
      "Enter",
      7,
      48,
      "venonaut",
      8,
    ),
    new Pokemon(
      "paras",
      "bug",
      "berry",
      "none",
      1,
      0,
      "Enter",
      7,
      46,
      "paras",
      5,
    ),
    new Pokemon(
      "kangaskhan",
      "water",
      "berry",
      "none",
      3,
      0,
      "Enter",
      5,
      115,
      "specialkang",
      4,
    ),
    new Pokemon(
      "mew",
      "psychic",
      "candy",
      "none",
      3,
      1,
      "Enter",
      5,
      151,
      "mew",
      6,
    ),
    new Pokemon(
      "gastly",
      "ghost",
      "berry",
      "none",
      1,
      0,
      "Enter",
      7,
      92,
      "gastly",
      7,
    ),
    new Pokemon(
      "haunter",
      "ghost",
      "berry",
      "berry",
      2,
      0,
      "Enter",
      7,
      93,
      "haunt",
      5,
    ),
    new Pokemon(
      "gengar",
      "ghost",
      "cookie",
      "cookie",
      3,
      0,
      "Enter",
      7,
      94,
      "gengar",
      5,
    ),
  ],
  MagmaCamp: [
    new Pokemon(
      "geodude",
      "rock",
      "berry",
      "none",
      1,
      0,
      "Enter",
      7,
      74,
      "geo",
      7,
    ),
    new Pokemon(
      "onix",
      "rock",
      "candy",
      "none",
      3,
      1,
      "Enter",
      20,
      95,
      "o",
      11,
    ),
    new Pokemon(
      "charmander",
      "fire",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      4,
      "charmander",
      10,
    ),
    new Pokemon(
      "charmeleon",
      "fire",
      "berry",
      "berry",
      2,
      0,
      "Enter",
      10,
      5,
      "charmeleon",
      8,
    ),
    new Pokemon(
      "SpecialPokemon",
      "normal",
      "candy",
      "none",
      3,
      1,
      "Enter",
      10,
      777,
      "kang",
      10,
    ),
    new Pokemon(
      "moltres",
      "fire",
      "candy",
      "none",
      3,
      1,
      "Enter",
      20,
      146,
      "molt",
      8,
    ),
  ],
  indigocity: [
    new Pokemon(
      "pikachu",
      "electric",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      25,
      "pika",
      7,
    ),
    new Pokemon(
      "raichu",
      "electric",
      "berry",
      "berry",
      3,
      0,
      "Enter",
      10,
      26,
      "raichu",
      4,
    ),
    new Pokemon(
      "venomoth",
      "bug",
      "berry",
      "berry",
      3,
      0,
      "Enter",
      7,
      49,
      "venomoth",
      7,
    ),
    new Pokemon(
      "electabuzz",
      "electric",
      "berry",
      "berry",
      3,
      0,
      "Enter",
      10,
      125,
      "electra",
      7,
    ),
    new Pokemon(
      "SpecialMeowth",
      "normal",
      "berry",
      "berry",
      3,
      0,
      "Enter",
      3,
      333,
      "meowth",
      8,
    ),
  ],
  forestlight: [
    new Pokemon(
      "pikachu",
      "electric",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      25,
      "pika",
      7,
    ),
    new Pokemon(
      "paras",
      "bug",
      "berry",
      "none",
      1,
      0,
      "Enter",
      7,
      46,
      "paras",
      5,
    ),
    new Pokemon(
      "venonat",
      "bug",
      "berry",
      "none",
      1,
      0,
      "Enter",
      7,
      48,
      "venonaut",
      8,
    ),
    new Pokemon(
      "venomoth",
      "bug",
      "berry",
      "berry",
      3,
      0,
      "Enter",
      7,
      49,
      "venomoth",
      7,
    ),
    new Pokemon(
      "butterfree",
      "bug",
      "berry",
      "cookie",
      3,
      0,
      "Enter",
      15,
      12,
      "butter",
      11,
    ),
    new Pokemon(
      "caterpie",
      "bug",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      10,
      "ca",
      7,
    ),
    new Pokemon(
      "bulbasaur",
      "grass",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      1,
      "bulba",
      10,
    ),
    new Pokemon(
      "ivysaur",
      "grass",
      "berry",
      "berry",
      2,
      0,
      "Enter",
      10,
      2,
      "ivy",
      7,
    ),
    new Pokemon(
      "venusaur",
      "grass",
      "berry",
      "cookie",
      3,
      0,
      "Enter",
      15,
      3,
      "venus",
      10,
    ),
  ],
  greengrass: [
    new Pokemon(
      "pikachu",
      "electric",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      25,
      "pika",
      7,
    ),
    new Pokemon(
      "caterpie",
      "bug",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      10,
      "ca",
      7,
    ),
    new Pokemon(
      "bulbasaur",
      "grass",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      1,
      "bulba",
      10,
    ),
    new Pokemon(
      "SquirtleBoss",
      "water",
      "berry",
      "cookie",
      3,
      0,
      " Boss",
      5,
      505,
      "squirt",
      12,
    ),
    new Pokemon(
      "charmander",
      "fire",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      4,
      "charmander",
      10,
    ),
  ],
  cyanbeach: [
    new Pokemon(
      "krabby",
      "water",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      98,
      "crab",
      9,
    ),
    new Pokemon(
      "specialcrabby",
      "water",
      "candy",
      "none",
      3,
      0,
      "Enter",
      5,
      899,
      "specialcrab",
      9,
    ),
    new Pokemon(
      "kingler",
      "water",
      "berry",
      "berry",
      3,
      0,
      "Enter",
      5,
      99,
      "king",
      6,
    ),
    new Pokemon(
      "lapras",
      "water",
      "cookie",
      "none",
      3,
      0,
      "Enter",
      5,
      131,
      "lapas",
      6,
    ),
    new Pokemon(
      "pikachu",
      "electric",
      "cookie",
      "none",
      1,
      0,
      "Enter",
      5,
      25,
      "pika",
      7,
    ),
    new Pokemon(
      "gyarados",
      "water",
      "candy",
      "none",
      3,
      0,
      "Enter",
      5,
      130,
      "gara",
      7,
    ),
    new Pokemon(
      "omanyte",
      "water",
      "berry",
      "none",
      1,
      0,
      "Enter",
      5,
      138,
      "omanyte",
      7,
    ),
    new Pokemon(
      "NaughtySquirtle",
      "water",
      "berry",
      "cookie",
      3,
      0,
      " Prankster",
      5,
      504,
      "squirt",
      12,
    ),
  ],
}

const BeachPokemonPool = [
  new Pokemon(
    "SquirtleThinker",
    "water",
    "berry",
    "cookie",
    3,
    0,
    " Thinker",
    5,
    501,
    "squirt",
    12,
  ),
  new Pokemon(
    "SquirtleScout",
    "water",
    "berry",
    "cookie",
    3,
    0,
    " Scout",
    5,
    502,
    "squirt",
    12,
  ),
  new Pokemon(
    "SquirtleHeavy",
    "water",
    "berry",
    "cookie",
    3,
    0,
    " Heavy",
    5,
    503,
    "squirt",
    12,
  ),
  new Pokemon(
    "NaughtySquirtle",
    "water",
    "berry",
    "cookie",
    3,
    0,
    " Prankster",
    5,
    504,
    "squirt",
    12,
  ),
  new Pokemon(
    "SquirtleBoss",
    "water",
    "berry",
    "cookie",
    3,
    0,
    "Boss",
    5,
    505,
    "squirt",
    12,
  ),
  new Pokemon(
    "magicarp",
    "water",
    "none",
    "none",
    1,
    0,
    "Enter",
    5,
    129,
    "magi",
    7,
  ),
  new Pokemon(
    "gyarados",
    "water",
    "candy",
    "none",
    3,
    0,
    "Enter",
    5,
    130,
    "gara",
    7,
  ),
  new Pokemon(
    "krabby",
    "water",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    98,
    "crab",
    9,
  ),
  new Pokemon(
    "kingler",
    "water",
    "berry",
    "berry",
    3,
    0,
    "Enter",
    5,
    99,
    "king",
    6,
  ),
  new Pokemon(
    "shellder",
    "water",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    90,
    "shel",
    8,
  ),
  new Pokemon(
    "cloyster",
    "water",
    "berry",
    "cookie",
    3,
    0,
    "Enter",
    5,
    91,
    "cl",
    11,
  ),
  new Pokemon(
    "staryu",
    "water",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    120,
    "staryu",
    6,
  ),
  new Pokemon(
    "starmie",
    "water",
    "berry",
    "berry",
    1,
    0,
    "Enter",
    5,
    121,
    "starme",
    5,
  ),
  new Pokemon(
    "SpecialMeowth",
    "normal",
    "berry",
    "berry",
    3,
    0,
    "Enter",
    3,
    333,
    "meowth",
    8,
  ),
  new Pokemon(
    "pikachu",
    "electric",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    25,
    "pika",
    7,
  ),
  new Pokemon(
    "electabuzz",
    "electric",
    "berry",
    "berry",
    3,
    0,
    "Enter",
    10,
    125,
    "electra",
    7,
  ),
  new Pokemon(
    "kangaskhan",
    "normal",
    "berry",
    "berry",
    3,
    0,
    "Enter",
    5,
    115,
    "specialkang",
    4,
  ),
]

const wildPokemonPool = [
  new Pokemon(
    "bulbasaur",
    "grass",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    1,
    "bulba",
    10,
  ),
  new Pokemon(
    "ivysaur",
    "grass",
    "berry",
    "berry",
    2,
    0,
    "Enter",
    5,
    2,
    "ivy",
    7,
  ),
  new Pokemon(
    "venusaur",
    "grass",
    "berry",
    "cookie",
    3,
    0,
    "Enter",
    5,
    3,
    "venus",
    10,
  ),

  new Pokemon(
    "charmander",
    "fire",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    4,
    "charmander",
    10,
  ),
  new Pokemon(
    "charmeleon",
    "fire",
    "berry",
    "berry",
    2,
    0,
    "Enter",
    5,
    5,
    "charmeleon",
    8,
  ),
  new Pokemon(
    "charizard",
    "fire",
    "berry",
    "cookie",
    3,
    0,
    "Enter",
    5,
    6,
    "charizard",
    6,
  ),

  new Pokemon(
    "SquirtleThinker",
    "water",
    "berry",
    "cookie",
    3,
    0,
    " Thinker",
    5,
    501,
    "squirt",
    12,
  ),
  new Pokemon(
    "SquirtleScout",
    "water",
    "berry",
    "cookie",
    3,
    0,
    " Scout",
    5,
    502,
    "squirt",
    12,
  ),
  new Pokemon(
    "SquirtleHeavy",
    "water",
    "berry",
    "cookie",
    3,
    0,
    " Heavy",
    5,
    503,
    "squirt",
    12,
  ),
  new Pokemon(
    "NaughtySquirtle",
    "water",
    "berry",
    "cookie",
    3,
    0,
    " Prankster",
    5,
    504,
    "squirt",
    12,
  ),
  new Pokemon(
    "SquirtleBoss",
    "water",
    "berry",
    "cookie",
    3,
    0,
    "Boss",
    5,
    505,
    "squirt",
    12,
  ),

  new Pokemon(
    "specialpokemon",
    "normal",
    "candy",
    "none",
    3,
    0,
    "Enter",
    5,
    777,
    "kang",
    10,
  ),
  new Pokemon(
    "specialcrabby",
    "water",
    "candy",
    "none",
    1,
    0,
    "Enter",
    5,
    899,
    "specialcrab",
    9,
  ),
  new Pokemon(
    "SpecialMeowth",
    "normal",
    "berry",
    "berry",
    3,
    0,
    "Enter",
    5,
    333,
    "meowth",
    8,
  ),

  new Pokemon(
    "magicarp",
    "water",
    "none",
    "none",
    1,
    0,
    "Enter",
    5,
    129,
    "magi",
    7,
  ),
  new Pokemon(
    "gyarados",
    "water",
    "candy",
    "none",
    3,
    0,
    "Enter",
    5,
    130,
    "gara",
    7,
  ),

  new Pokemon(
    "pikachu",
    "electric",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    25,
    "pika",
    7,
  ),
  new Pokemon(
    "raichu",
    "electric",
    "berry",
    "berry",
    3,
    0,
    "Enter",
    5,
    26,
    "raichu",
    4,
  ),
  new Pokemon(
    "electabuzz",
    "electric",
    "berry",
    "berry",
    3,
    0,
    "Enter",
    5,
    125,
    "electra",
    7,
  ),

  new Pokemon(
    "kangaskhan",
    "normal",
    "berry",
    "berry",
    3,
    0,
    "Enter",
    5,
    115,
    "specialkang",
    4,
  ),

  new Pokemon(
    "krabby",
    "water",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    98,
    "crab",
    9,
  ),
  new Pokemon(
    "kingler",
    "water",
    "berry",
    "berry",
    3,
    0,
    "Enter",
    5,
    99,
    "king",
    6,
  ),

  new Pokemon(
    "omanyte",
    "water",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    138,
    "omanyte",
    7,
  ),
  new Pokemon(
    "omastar",
    "water",
    "berry",
    "cookie",
    3,
    0,
    "Enter",
    5,
    139,
    "omastar",
    6,
  ),

  new Pokemon(
    "paras",
    "bug",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    46,
    "paras",
    5,
  ),
  new Pokemon(
    "parasect",
    "bug",
    "berry",
    "berry",
    3,
    0,
    "Enter",
    5,
    47,
    "parasect",
    5,
  ),
  new Pokemon(
    "venonat",
    "bug",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    48,
    "venonaut",
    9,
  ),
  new Pokemon(
    "venomoth",
    "bug",
    "berry",
    "berry",
    3,
    0,
    "Enter",
    5,
    49,
    "venomoth",
    7,
  ),

  new Pokemon(
    "gastly",
    "ghost",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    92,
    "gastly",
    7,
  ),
  new Pokemon(
    "haunter",
    "ghost",
    "berry",
    "berry",
    2,
    0,
    "Enter",
    5,
    93,
    "haunt",
    5,
  ),
  new Pokemon(
    "gengar",
    "ghost",
    "cookie",
    "cookie",
    3,
    0,
    "Enter",
    5,
    94,
    "gengar",
    5,
  ),

  new Pokemon(
    "geodude",
    "rock",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    74,
    "geo",
    7,
  ),
  new Pokemon(
    "graveler",
    "rock",
    "berry",
    "berry",
    2,
    0,
    "Enter",
    5,
    75,
    "grav",
    7,
  ),
  new Pokemon(
    "golem",
    "rock",
    "cookie",
    "cookie",
    3,
    0,
    "Enter",
    5,
    76,
    "gol",
    7,
  ),

  new Pokemon(
    "caterpie",
    "bug",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    10,
    "ca",
    7,
  ),
  new Pokemon(
    "metapod",
    "bug",
    "berry",
    "berry",
    2,
    0,
    "Enter",
    5,
    11,
    "meta",
    6,
  ),
  new Pokemon(
    "butterfree",
    "bug",
    "berry",
    "cookie",
    3,
    0,
    "Enter",
    5,
    12,
    "butter",
    11,
  ),

  new Pokemon(
    "shellder",
    "water",
    "berry",
    "none",
    1,
    0,
    "Enter",
    5,
    90,
    "shel",
    8,
  ),

  new Pokemon(
    "zubat",
    "poison",
    "berry",
    "none",
    1,
    1,
    "Enter",
    5,
    41,
    "zu",
    7,
  ),
  new Pokemon(
    "golbat",
    "poison",
    "berry",
    "cookie",
    3,
    1,
    "Enter",
    5,
    42,
    "gol",
    7,
  ),
  new Pokemon(
    "specialzubat",
    "poison",
    "berry",
    "cookie",
    1,
    1,
    "Enter",
    5,
    941,
    "specialzu",
    6,
  ),
  new Pokemon(
    "specialgolbat",
    "poison",
    "cookie",
    "cookie",
    3,
    1,
    "Enter",
    5,
    942,
    "gol",
    6,
  ),

  new Pokemon(
    "cloyster",
    "water",
    "berry",
    "cookie",
    3,
    0,
    "Enter",
    5,
    91,
    "cl",
    11,
  ),
]

//----------------------------------------------------------------
const user = new User();

// ==================== DISPLAY UPDATES ====================


function switchLocation(newLocation) {
  // Save current team to teamsByLocation for the current location
  if (user.location) {
    teamsByLocation[user.location] = user.team
  }

  // Update location
  user.location = newLocation

  // Load existing team from the new location, or fallback to default
  user.team = teamsByLocation[newLocation] || User.defaultTeam()
}
function saveTeamsToStorage() {
  localStorage.setItem("teamsByLocation", JSON.stringify(teamsByLocation))
}

function loadTeamsFromStorage() {
  const saved = localStorage.getItem("teamsByLocation")
  if (saved) {
    const raw = JSON.parse(saved)
    // You’ll need to reconstruct Pokemon objects if needed here
  }
}

function updateCandyDisplay() {
  document.getElementById("candyDisplay").textContent = "Candy: " + user.candy
}

function displayPokemonVisuals(index) {
  const pokemon = user.team[index]
  pokedexImage.src = `${PokedexbasePath}${pokemon.name}.PNG`
  nameInput.value = pokemon.personalName
}

function updateEvolveButton(index) {
  const pokemon = user.team[index]
  if (pokemon.evolution >= 3 || user.candy < 3 || pokemon.evolution < 1) {
    evolveButton.textContent = "Can't Evolve"
    evolveButton.disabled = true
  } else {
    evolveButton.textContent = "Evolve"
    evolveButton.disabled = false
  }
}

function displayPokemonInfo(index) {
  displayPokemonVisuals(index)
  updateEvolveButton(index)
}

function updatePokedexMenu() {
  pokedexSelect.innerHTML = ""

  user.team.forEach((pokemon, index) => {
    const option = document.createElement("option")
    option.value = index
    option.textContent = `#${pokemon.pokedexNumber} ${pokemon.name}`
    pokedexSelect.appendChild(option)
  })

  const selectedIndex = parseInt(pokedexSelect.value) || 0
  if (user.team.length > 0 && selectedIndex < user.team.length) {
    pokedexSelect.value = selectedIndex
    displayPokemonInfo(selectedIndex)
  }
}

function preloadAllAnimations() {
  user.team.forEach((pokemon) => {
    const key = pokemon.pokedexNumber
    if (!preloadedFrames[key]) {
      const frames = []

      const blank = new Image()
      blank.src = `${basePath}blank.png?raw=true`
      frames.push(blank)

      for (let i = 1; i <= pokemon.animationNumber; i++) {
        const img = new Image()
        img.src = `${basePath}${pokemon.animationName}${i}.png?raw=true`
        frames.push(img)
      }

      preloadedFrames[key] = frames
    }
  })
}

function preloadCatchAnimations() {
  const pokemon = user.catch
  const key = pokemon.pokedexNumber

  if (!preloadedFrames[key]) {
    const frames = []
    const blank = new Image()
    blank.src = `${basePath}blank.png?raw=true`
    frames.push(blank)

    let loadedImages = 0

    // Function to check if all images are loaded
    const checkImagesLoaded = () => {
      loadedImages++
      if (loadedImages === pokemon.animationNumber + 1) {
        // +1 for the blank image
        preloadedFrames[key] = frames
        console.log("All frames preloaded")
        console.log("Preloading frames for Pokémon:", pokemon.name)
      }
    }

    // Preload each frame
    for (let i = 1; i <= pokemon.animationNumber; i++) {
      const img = new Image()
      img.src = `${basePath}${pokemon.animationName}${i}.png?raw=true`
      img.onload = checkImagesLoaded // Increment when each image is loaded
      frames.push(img)
    }

    // Add extra blank frames after all other frames are loaded
    blank.onload = checkImagesLoaded
    frames.push(blank)
    frames.push(blank) // Two blank frames at the end for looping
  }
}

function loadAnimationFrames(pokemon) {
  const key = pokemon.pokedexNumber
  return preloadedFrames[key] || []
}

// Function for playing the next frame with imageElement (for main animations)
function playNextFrame(imageElement) {
  if (currentFrameIndex < currentAnimationFrames.length) {
    imageElement.src = currentAnimationFrames[currentFrameIndex].src
    currentFrameIndex++
  } else {
    clearInterval(animationLoop)
    setTimeout(() => {
      currentPokemonIndex = (currentPokemonIndex + 1) % user.team.length
      const nextPokemon = user.team[currentPokemonIndex]
      currentAnimationFrames = loadAnimationFrames(nextPokemon)
      currentFrameIndex = 0
      // Pass the correct imageElement here for the next iteration
      animationLoop = setInterval(
        () => playNextFrame(imageElement),
        frameDuration,
      )
    }, 0) // Pause before moving to next Pokémon
  }
}


function playNextFrame2(imageElement2) {
  const pokemon = user.catch;  // Single Pokémon for the catch animation
  const currentCatchAnimationFrames = loadAnimationFrames(pokemon);  // Preloaded frames for catch

  if (currentFrameIndex < currentCatchAnimationFrames.length) {
    imageElement2.src = currentCatchAnimationFrames[currentFrameIndex].src;
    currentFrameIndex++;
  } else {
    // Reset to the first frame for looping animation
    currentFrameIndex = 0;
  }
}

// Start or reset the animation loop with the correct frame duration
function startCatchAnimation(imageElement2) {
  if (animationLoop2) {
    clearInterval(animationLoop2);  // Clear any existing animation loop
  }
  
  animationLoop2 = setInterval(() => {
    playNextFrame2(imageElement2);
  }, frameDuration);  // Ensure the correct frame rate (6 frames per second)
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
    template.animationNumber,
  )
}

function evolvePokemon(index) {
  const pokemon = user.team[index]
  if (!pokemon || pokemon.evolution >= 3 || user.candy < 3) {
    console.log("Can't evolve.")
    return
  }

  user.candy -= 3
  updateCandyDisplay();

  const holdName = pokemon.personalName
  const holdEvolutionNumber = pokemon.pokedexNumber + 1
  user.team.splice(index, 1)

  const evolvedTemplate = wildPokemonPool.find(
    (p) => p.pokedexNumber === holdEvolutionNumber,
  )
  if (evolvedTemplate) {
    const evolved = clonePokemon(evolvedTemplate, holdName)
    user.team.push(evolved)
    console.log(`${holdName} has evolved!`)
  } else {
    console.log("No evolved form found.")
  }

  updatePokedexMenu()
}

function updateUserCatch(user, pool = wildPokemonPool) {
  const randIndex = Math.floor(Math.random() * pool.length)
  user.catch = clonePokemon(pool[randIndex]);
  console.log("New user.catch:", user.catch)
}

function updateUserCYANBEACHCatch(user, pool = BeachPokemonPool) {
  const randIndex = Math.floor(Math.random() * pool.length)
  user.catch = clonePokemon(pool[randIndex]);
  console.log("New user.catch:", user.catch)
}

function alreadyCaught(user, pokemonToCheck) {
  // Check if the Pokémon is already in the team by comparing names or other unique identifiers (e.g., pokedexNumber)
  const isAlreadyCaught = user.team.some(pokemon => pokemon.pokedexNumber === pokemonToCheck.pokedexNumber);

  if (isAlreadyCaught) {
    console.log(`${pokemonToCheck.name} has already been caught and is in your team!`);
    return true; // Pokémon has already been caught
  } else {
    console.log(`${pokemonToCheck.name} has not been caught yet.`);
    return false; // Pokémon has not been caught
  }
}

//=======================PokeTABLE=========================
function updateTeamTable(user) {
  const tableBody = document.getElementById("teamTableBody");
  tableBody.innerHTML = ""; // Clear any previous rows

  const pokeImagePath =
    "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/PokeID/";

  user.team.forEach((pokemon, index) => {
    const row = document.createElement("tr");
    row.setAttribute("draggable", "true");
    row.dataset.index = index;

    // Pokémon image cell
    const pokemonCell = document.createElement("td");
    const img = document.createElement("img");
    img.src = `${pokeImagePath}${pokemon.pokedexNumber}.PNG?raw=true`;
    img.alt = pokemon.name;
    img.width = 40;
    pokemonCell.appendChild(img);

    // Items cell
    const itemsCell = document.createElement("td");
    let itemsText = pokemon.item1;
    if (pokemon.item2 && pokemon.item2 !== "none") {
      itemsText += `, ${pokemon.item2}`;
    }
    itemsCell.innerText = itemsText;

    // Delete button cell
    const deleteCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "❌";
    deleteBtn.onclick = () => {
      user.team.splice(index, 1); // Remove from user.team
      updateTeamTable(user); // Re-render table
    };
    deleteCell.appendChild(deleteBtn);

    row.appendChild(pokemonCell);
    row.appendChild(itemsCell);
    row.appendChild(deleteCell);
    tableBody.appendChild(row);
  });

  // Drag & Drop handling
  let draggedRow = null;

  tableBody.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("dragstart", (e) => {
      draggedRow = row;
      row.style.opacity = "0.5";
    });

    row.addEventListener("dragend", () => {
      draggedRow.style.opacity = "";
    });

    row.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    row.addEventListener("drop", (e) => {
      e.preventDefault();
      if (draggedRow !== row) {
        const fromIndex = parseInt(draggedRow.dataset.index);
        const toIndex = parseInt(row.dataset.index);
        const moved = user.team.splice(fromIndex, 1)[0];
        user.team.splice(toIndex, 0, moved);
        updateTeamTable(user); // Re-render
      }
    });
  });

  document.getElementById("teamTable").style.display = "table";
}

// ==================== NAVIGATION LOGIC ====================
function setLocation(location) {
  const locationImage = document.getElementById("LocationPath")
  if (locationImage) {
    locationImage.src = `${LocationPathway}${location}.PNG?raw=true`
    locationImage.style.display = "block"
  }
}

function hideAllPhases() {
  // Hide all phases
  document.querySelectorAll(".phase").forEach((p) => {
   // console.log("Hiding phase: ", p);  // Debug log
    p.style.display = "none";
  });

  // List of elements to hide
  const elementsToHide = [
    "pokedexContainer",
    "LocationPath",
    "pokedexImage",
    "Pokedexpage",
    "cloyster",
    "catchPage",
    "selectedCookie",
    "cookieSelectorWrapper",
    "hungerColorImage",
    "teamTable",
    "catchThis",
    "timerSelect",
  ];
 hungerCostGraphic.style.display = "none";
  elementsToHide.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      console.log("Hiding element:", id);  // Debug log
      el.style.display = "none";
    } else {
      console.log("Element not found:", id);  // Debug log
    }
  });

  // Clear animation loops (ensure they're set first)
  if (typeof animationLoop !== "undefined") {
    console.log("Stopping animationLoop");
    clearInterval(animationLoop);
  }
  if (typeof animationLoop2 !== "undefined") {
    console.log("Stopping animationLoop2");
    clearInterval(animationLoop2);
  }

  // Hide table and timer text
  if (timerTextDiv) {
    console.log("Hiding timerTextDiv");
    timerTextDiv.style.display = "none";
  }

  if (table) {
    console.log("Hiding table");
    table.style.display = "none";
  }
}
function showStartPhase() {
  hideAllPhases();
  document.querySelector(".StartWrapper").style.display = "block";
  document.getElementById("locationSelectorWrapper").style.display = "block";
  document.getElementById("timerSelect").style.display = "block";
}

function showPomodoroPhase() {
  hideAllPhases();
  clearInterval(animationLoop);
  document.querySelector(".PomodoroWrapper").style.display = "block"
  setLocation(user.location)
  // document.getElementById(".locationImage").style.display = "block";
  document.getElementById("cloyster").style.display = "block"
  timerTextDiv.style.display = "block"

  preloadAllAnimations()
  currentAnimationFrames = loadAnimationFrames(user.team[currentPokemonIndex])
  animationLoop = setInterval(() => playNextFrame(imageElement), frameDuration)

  startTimer();

  document.getElementById("teamTable").style.display = "table"
  updateTeamTable(user)
}

function showCatchPhase() {
  hideAllPhases();
  clearInterval(animationLoop);
    clearInterval(animationLoop2);
    if (user.location == "cyanbeach"){ updateUserCYANBEACHCatch(user); }else{
  updateUserCatch(user)}
  
  document.querySelector(".CatchWrapper").style.display = "block";
  document.getElementById("catchPage").style.display = "block";

  //console.log(imageElement2.src);
  document.getElementById("catchThis").style.display = "block";
  document.getElementById("cookieSelectorWrapper").style.display = "block"
  table.style.display = "block";
    preloadCatchAnimations();
  animationLoop = setInterval(() => playNextFrame2(imageElement2), frameDuration);


  const CookiebasePath =
    "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/catchEM/"
  const cookieSelect = document.getElementById("cookieSelect")
  const selectedCookie = cookieSelect.value
  const cookieImage = document.getElementById("selectedCookie")

  cookieImage.src = `${CookiebasePath}${selectedCookie}.png?raw=true`
  cookieImage.style.display = "block"

  // 🛠️ ADD THIS PART TO SET hungerColorImage IMMEDIATELY:
  const hungerColorImage = document.getElementById("hungerColorImage")
  const HungermeterPath =
    "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/catchEM/"
  const hungerString = "nonemeter"

  hungerColorImage.src = `${HungermeterPath}${hungerString}.png?raw=true`
  hungerColorImage.style.display = "block";

  // ✅ Then still keep the event listener in case they change cookie:
  cookieSelect.addEventListener("change", function () {
    const selectedCookie = this.value;
    cookieImage.src = `${CookiebasePath}${selectedCookie}.png?raw=true`
    cookieImage.style.display = "block";
  })
  function updateHungerImage() {
    let hungerString

    // Check the value of user.catch.hunger and set hungerString accordingly
    if (user.catch.hunger === 0) {
      hungerString = "fullmeter" // If hunger is 0, set hungerString to "fullmeter"
    } else {
      hungerString = "nonemeter" // If hunger is 5, set hungerString to "nonemeter"
    }

    // Update the hungerColorImage source dynamically based on hungerString
    const HungermeterPath =
      "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/catchEM/"
    hungerColorImage.src = `${HungermeterPath}${hungerString}.png?raw=true`
    hungerColorImage.style.display = "block" // Ensure the image is displayed
  }

  // Add logic to update the hunger cost graphic based on the Pokémon's evolution
  const hungerCostGraphic = document.getElementById("hungerCostGraphic")
  const evolutionStage = user.catch.evolution // Use the Pokémon's evolution property to determine which graphic to show

  const useButton = document.getElementById("useButton")
  let paymentStatus = {
    pokeballPaid: false,
    bonusBallPaid: false,
  }

  function resetPaymentStatus() {
    paymentStatus.pokeballPaid = false
    paymentStatus.bonusBallPaid = false
  }
  resetPaymentStatus()
  useButton.addEventListener("click", function () {
    const selectedCookie = document.getElementById("cookieSelect").value
    //const evolutionStage = user.catch.evolution;
    console.log("New hunger after feeding:", user.catch.hunger)
   
   if (selectedCookie === "bonus" && user.bonusPokeball >= 1  &&  user.catch.hunger > 0) {
  user.bonusPokeball -= 1;
  paymentStatus.bonusBallPaid = true;
  user.catch.hunger = 0;
  document.getElementById("feedStatus").textContent = "Bonus Cookie used!";
}

   if (evolutionStage === 1) {
      if (selectedCookie === "pokeball" && user.pokeball >= 5 &&  user.catch.hunger > 0) {
        user.pokeball -= 5
        user.catch.hunger = 0
        paymentStatus.pokeballPaid = true
        document.getElementById("feedStatus").textContent =
          "Pokémon fed successfully!"
      } else {
        document.getElementById("feedStatus").textContent =
          "You need 5 Poké Cookies!"
      }
    } else if (evolutionStage === 2) {
      if (
        !paymentStatus.bonusBallPaid &&
        selectedCookie === "great" &&
        user.greatPokeball >= 1
      ) {
        user.greatPokeball -= 1
        paymentStatus.bonusBallPaid = true
        document.getElementById("feedStatus").textContent =
          "Great Cookie used! Now feed 5 Poké Cookies."
      } else if (
        paymentStatus.bonusBallPaid &&
        selectedCookie === "pokeball" &&
        user.pokeball >= 5
      ) {
        user.pokeball -= 5
        user.catch.hunger = 0
        paymentStatus.pokeballPaid = true
        document.getElementById("feedStatus").textContent =
          "Pokémon fed successfully!"
      } else if (!paymentStatus.bonusBallPaid) {
        document.getElementById("feedStatus").textContent =
          "Use 1 Great Cookie first!"
      } else {
        document.getElementById("feedStatus").textContent =
          "You need 5 Poké Cookies!"
      }
    } else if (evolutionStage === 3) {
      if (
        !paymentStatus.bonusBallPaid &&
        selectedCookie === "ultra" &&
        user.ultraPokeball >= 1
      ) {
        user.ultraPokeball -= 1
        paymentStatus.bonusBallPaid = true
        document.getElementById("feedStatus").textContent =
          "Ultra Cookie used! Now feed 5 Poké Cookies."
      } else if (
        paymentStatus.bonusBallPaid &&
        selectedCookie === "pokeball" &&
        user.pokeball >= 5
      ) {
        user.pokeball -= 5
        user.catch.hunger = 0
        paymentStatus.pokeballPaid = true
        document.getElementById("feedStatus").textContent =
          "Pokémon fed successfully!"
      } else if (!paymentStatus.bonusBallPaid) {
        document.getElementById("feedStatus").textContent =
          "Use 1 Ultra Cookie first!"
      } else {
        document.getElementById("feedStatus").textContent =
          "You need 5 Poké Cookies!"
      }
    }
    updateHungerImage()
    // updateUserCatch(user); // 🛠️ Refresh the user's display (hunger, items, etc.)
    console.log("Uodate user.catch:", user.catch)
    console.log("Update user.pokeball:", user.pokeball)
    //       console.log("Update user.catch.hunger:", user.catch.hunger);
    //     console.log("Before updating hunger:", user.catch.hunger);
    //user.catch.hunger = 0; // Reset hunger
    console.log("After updating hunger:", user.catch.hunger)
    updateInventory()
    // (Optional) Check if hunger is fully satisfied
   if (user.catch.hunger <= 0) {
  if (!alreadyCaught(user, user.catch)) {
    user.checkAndAddToTeam();
    document.getElementById("feedStatus").textContent = "Pokémon caught!";
  } else {
    document.getElementById("feedStatus").textContent = "You already caught this Pokémon!";
  }


//Show RARE vs COMMON Update
      if (evolutionStage < 2) {
        hungerCostGraphic.src =
          "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/catchEM/caughtbonus.png?raw=true"
      } else {
        hungerCostGraphic.src =
          "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/catchEM/caught.png?raw=true"
      }
    }
  })

  const hungerStat = user.catch.hunger
  //const evolutionStage = user.catch.evolution;
  console.log("Current hunger:", hungerStat)

  // Update the hunger cost graphic based on evolution stage
  //if (hungerStat > 0) {
  if (evolutionStage === 1) {
    hungerCostGraphic.src =
      "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/catchEM/catch1.png?raw=true"
  } else if (evolutionStage === 2) {
    hungerCostGraphic.src =
      "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/catchEM/catch2.png?raw=true"
  } else if (evolutionStage === 3) {
    hungerCostGraphic.src =
      "https://github.com/SarahBass/Poke-Pomodoro-Fan-Game/blob/main/catchEM/catch3.png?raw=true"
  }
 

  // Ensure the graphic is displayed after being updated
  hungerCostGraphic.style.display = "block"
  console.log("Updated hunger graphic:", hungerCostGraphic.src)
}

function showPokedexPhase() {
  hideAllPhases()
  document.getElementById("pokedexContainer").style.display = "block" // Show Pokedex explicitly here
  document.getElementById("Pokedexpage").style.display = "block"
  document.getElementById("pokedexImage").style.display = "block"
  initializePokedex()
}

// ==================== EVENT LISTENERS ====================
navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navButtons.forEach((btn) => btn.classList.remove("selected"))
    button.classList.add("selected")
  })
})

document
  .querySelector(".StartWrapper button")
  .addEventListener("click", showStartPhase)
document
  .querySelector(".PomodoroWrapper button")
  .addEventListener("click", showPomodoroPhase)
document
  .querySelector(".CatchWrapper button")
  .addEventListener("click", showCatchPhase)
document
  .querySelector(".PokedexWrapper button")
  .addEventListener("click", showPokedexPhase)

pokedexSelect.addEventListener("change", function () {
  const selectedIndex = parseInt(this.value)
  displayPokemonInfo(selectedIndex)
})

nameInput.addEventListener("input", function () {
  const selectedIndex = parseInt(pokedexSelect.value)
  user.team[selectedIndex].personalName = this.value
})

evolveButton.addEventListener("click", function () {
  const selectedIndex = parseInt(pokedexSelect.value)
  evolvePokemon(selectedIndex)
})

// ==================== TIME LISTENERS ====================
let totalDuration = user.goalTime * 60;

document.getElementById("timerSelect").addEventListener("change", function () {
  const selectedValue = parseInt(this.value, 10);
  user.goalTime = selectedValue;
  totalDuration = user.goalTime * 60; // ✅ just assign, don’t redeclare
  console.log("Updated duration:", totalDuration);
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

function getCurrentTimeFormatted() {
  const now = new Date()
  let hours = now.getHours()
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // 0 becomes 12
  return `${hours}:${minutes} ${ampm}`
}

function startTimer() {
  if (timerRunning) return;

  // Format current time in 12-hour format with AM/PM
  const now = new Date();
  let startHours = now.getHours();
  const startMinutes = String(now.getMinutes()).padStart(2, "0");
  const startAMPM = startHours >= 12 ? "PM" : "AM";
  startHours = startHours % 12 || 12;
  const startTimeFormatted = `${startHours}:${startMinutes} ${startAMPM}`;

  // Calculate and format end time in 12-hour format with AM/PM
  const endTime = new Date(Date.now() + totalDuration * 1000);
  let endHours = endTime.getHours();
  const endMinutes = String(endTime.getMinutes()).padStart(2, "0");
  const endAMPM = endHours >= 12 ? "PM" : "AM";
  endHours = endHours % 12 || 12;
  const endTimeFormatted = `${endHours}:${endMinutes} ${endAMPM}`;

  timerRunning = true;
  elapsedTime = 0;

  countdownInterval = setInterval(() => {
    if (elapsedTime >= totalDuration) {
      clearInterval(countdownInterval);
      timerRunning = false;

      // ==================== REWARD PLAYER AFTER 25 MINUTES ====================
      
      // Adding berry points, cookies, candies, and updating user stats
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
        flying: 24,
      };

// Reward logic
      user.team.forEach((pokemon) => {
        [pokemon.item1, pokemon.item2].forEach((item) => {
          if (item === "cookie") {
            user.pokeball += 1;
            console.log("Pokeball increased:", user.pokeball);
          } else if (item === "candy") {
            user.candy += 1;
            console.log("Candy increased:", user.candy);
          } else if (item === "berry") {
            const score = BerryValues[pokemon.type] || 0;
            user.berryPoints += score;
            console.log("Berry points increased:", user.berryPoints);
          }
        });
      });

      // Call the reward method
      user.earnBerryRewards();
      console.log("Berry rewards earned");
      updateInventory();
      updateCandyDisplay(); 

      // (Optional: update any UI elements here if needed)
    }

    const timeRemaining = totalDuration - elapsedTime;
    timerTextDiv.innerHTML = `${formatTime(timeRemaining)}<br>Time Start: ${startTimeFormatted}<br>Time End: ${endTimeFormatted}`;
    elapsedTime++;
  }, 1000);
}

// ==================== INITIALIZATION ====================
function initializePokedex() {
  if (user.team.length > 0) {
    updatePokedexMenu()
    displayPokemonInfo(0)
  }
}

updateCandyDisplay()
// Call the function to update the table on page load or when needed
updateInventory()
