const types = [
    'fire',
    'grass',
    'electric',
    'water',
    'ground',
    'rock',
    'fairy',
    'poison',
    'bug',
    'dragon',
    'psychic',
    'flying',
    'fighting',
    'normal',
]

const POKEMON_COUNT = 150;

const cardHTML = `
<div class="card">
<div class="title">
  <h2>{name}</h2>
  <small>#{id}</small>
</div>
<div class="img bg-{type}">
  <img
    src="https://raw.githubusercontent.com/emersonbroga/api.pokedex.react.dev.br/main/public/images/original/{id}.png"
    alt=""
  />
</div>
<div class="type {type}">
  <p>{type}</p>
</div>
<button class="favorite">
  <div class="heart"></div>
</button>
</div>>`

const cards = document.querySelector('.cards')
console.log(cards)
const getType = (data) => { // função para pegar o tipo
    const apiTypes = data.map(type => type.type.name)// busca os tipos na api
    const type = types.find(type => apiTypes.indexOf(type) > -1) // compara se o tipo buscado existe no meu array
    return type // retorna o tipo 
}
const fetchPokemon = async (number) => { //função para pegar nome, id e juntar o tipo buscado na getType
    if (number === undefined) return
    const url = `https://pokeapi.co/api/v2/pokemon/${number}`
    const response = await fetch(url).then((response) => response.json())
    const { id, name, types } = response
    const type = getType(types)

    return { id, name, type }
}
const replacer = (text, source, destination) => {
    const regex = new RegExp(source, 'gi')
    return text.replace(regex, destination)
}

const createPokemonCard = (pokemon) => {
    const { id, name, type } = pokemon
    let newCard = replacer(cardHTML, `\{id\}`, id)
    newCard = replacer(newCard, `\{name\}`, name)
    newCard = replacer(newCard, `\{type\}`, type)

    cards.innerHTML += newCard
}
const fetchPokemons = async () => {// loop para buscar todos pokemons
    for (let i = 1; i <= POKEMON_COUNT; i++) {
        const pokemon = await fetchPokemon(i)
        createPokemonCard(pokemon)
        console.log(pokemon)
    }
}




fetchPokemons()