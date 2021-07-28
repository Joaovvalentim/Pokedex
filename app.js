const getgPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`

let pokemonsData = [];
let selectedPokemon = '';

function openPokemon(id) {

    pokemonsData.forEach(pokemon => {
        if (pokemon.id == id) {
            selectedPokemon = pokemon;
        }
    });

    document.querySelector('.modal').style.display = "flex";

    document.querySelector('.modalContent').innerHTML = '';

    document.querySelector('.modalContent').innerHTML = renderPokeDetails();


}

function renderPokeDetails() {
    return (
        `
    <h1>${selectedPokemon.name}.  Nº${selectedPokemon.id}</h1>
    <div class="img">
        <img class="selectImage" src="https://pokeres.bastionbot.org/images/pokemon/${selectedPokemon.id}.png" />
        <div class="status">
            <div class="columUm">
            <ul>    
                <li style="text-align: center;">
                    <span class="atributeTitle">Altura: </span>
                    <span class="atributeValue">${selectedPokemon.height / 10}m.</span>
                </li>
                <li>
                     <span class="atributeTitle">Peso: </span>
                      <span class="atributeValue">${selectedPokemon.weight / 10} Kg.</span>
                </li>
            </ul>
            </div>
            <div class="columDois">
            <ul>  
                <li class="attrLine">
                    <span>Tipo: </span>
                    ${renderTypes()}
                </li> 
                ${renderStats()}
            </ul>
            </div>
        </div>
    </div>
    `
    )
}

function renderStats() {
    const acumulator = [];
    selectedPokemon.stats.forEach(attribute => {
        acumulator.push(
            `
            <li class="attrLine">
                <span class="atributeTitle">${attribute.stat.name}:</span>
                <span class="atributeValue">${attribute.base_stat}.</span>
            </li>
            `
        )
    })
    return acumulator.join('');
}

function renderTypes() {
    const acumulator = [];
    selectedPokemon.types.forEach(attribute => {
        acumulator.push(
            `
            <span class="atributeTitle">${attribute.type.name}</span>
            `
        )
    })
    return acumulator.join('');
}

//gerar e retornar o array de promises de pokemons
const generatePokemonPromises = () => Array(150).fill().map((_, index) =>
    fetch(getgPokemonUrl(index + 1)).then(response => response.json()))

// pega os dados da api (nome,id,tipo) gera o card e a imagem.
const generateHTML = pokemons => pokemons.reduce((accumulator, pokemon) => {
    const elementTypes = pokemon.types.map(typeInfo => typeInfo.type.name)
    accumulator += `
                <li onClick="openPokemon(${pokemon.id})" class="card ${elementTypes[0]}">
                    <img class="card-image" alt="${pokemon.name}" src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" />
                    <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
                    <p class"card-subtitle">${elementTypes.join(' | ')}<p>
                </li>`
    return accumulator
}, '')

// gera todos os dados pegos na API na tela em formato HTML
const insertPokemonsInToPage = pokemons => {
    const ul = document.querySelector('[data-js="pokedex"]')
    ul.innerHTML = pokemons
}

const pokemonPromises = generatePokemonPromises();

Promise.all(pokemonPromises)
    .then(generateHTML)
    .then(insertPokemonsInToPage)

//Isolando os dados dos pokemons em objetos limpos em um array
for (let index = 0; index < pokemonPromises.length; index++) {
    pokemonPromises[index].then((result) => {
        pokemonsData.push(result);
    })
}
function closeModal() {
    document.querySelector('.modal').style.display = "none";
}