const API_BASE_URL = 'https://pokeapi.co/api/v2'

// extrait ID du pokémon depuis URL
function extractPokemonIdFromUrl(url) {
  const urlParts = url.split('/').filter(Boolean)
  return Number(urlParts[urlParts.length - 1])
}

// recuperation liste brute de Pokémon depuis API
export async function fetchPokemonList(limit = 21, offset = 0) {
  const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!response.ok) {
    throw new Error(`Erreur lors du chargement de la liste : ${response.status}`)
  }
  return await response.json()
}

// recuperation liste pokemon simplifiée(id, nom, image, url)
export async function fetchPokemonListMinimal({ limit = 21, offset = 0 } = {}) {
  const data = await fetchPokemonList(limit, offset)

  const simplifiedPokemonList = data.results.map((pokemon) => {
    const id = extractPokemonIdFromUrl(pokemon.url)
    return {
      id,
      name: pokemon.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      url: pokemon.url,
    }
  })

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    pokemons: simplifiedPokemonList,
  }
}

// recuperation détails Pokémon par nom ou ID
export async function fetchPokemonDetail(pokemonIdentifier) {
  const response = await fetch(`${API_BASE_URL}/pokemon/${pokemonIdentifier}`)
  if (!response.ok) {
    throw new Error(`Erreur lors du chargement du Pokémon ${pokemonIdentifier}`)
  }
  return await response.json()
}

// gestion pool pour éviter surcharge API
async function promisePool(taskList, poolLimit = 6) {
  const results = []
  const runningTasks = []

  for (const task of taskList) {
    const currentPromise = Promise.resolve().then(() => task())
    results.push(currentPromise)

    const running = currentPromise
      .then(() => runningTasks.splice(runningTasks.indexOf(running), 1))
      .catch(() => runningTasks.splice(runningTasks.indexOf(running), 1))

    runningTasks.push(running)

    if (runningTasks.length >= poolLimit) {
      await Promise.race(runningTasks)
    }
  }

  return Promise.all(results)
}

// recuperation liste pokémon avec détails (nom, image, types, taille,poids)
export async function fetchPokemonListWithDetails({
  limit = 21,
  offset = 0,
  concurrency = 6,
} = {}) {
  const listData = await fetchPokemonList(limit, offset)

  const fetchDetailTasks = listData.results.map((pokemon) => async () => {
    const detailData = await fetchPokemonDetail(pokemon.name)

    const imageUrl =
      detailData.sprites?.other?.['official-artwork']?.front_default ||
      detailData.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detailData.id}.png`

    return {
      id: detailData.id,
      name: detailData.name,
      image: imageUrl,
      types: detailData.types.map((typeEntry) => typeEntry.type.name),
      height: detailData.height,
      weight: detailData.weight,
    }
  })

  const detailedPokemonList = await promisePool(fetchDetailTasks, concurrency)

  return {
    count: listData.count,
    next: listData.next,
    previous: listData.previous,
    pokemons: detailedPokemonList,
  }
}

// recherche pokémon par nom partiel
export async function fetchPokemonByName(query) {
  try {
    const search = query.toLowerCase().trim()

    // récuperer une grande liste avant de filtrer
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
    if (!response.ok) throw new Error('Erreur lors du chargement des données')

    const data = await response.json()

    // filtrer les noms
    const filtered = data.results.filter((pokemon) => pokemon.name.includes(search))

    if (!filtered.length) throw new Error('Aucun Pokémon trouvé')

    // charger les détails des pokémon correspondants
    const limited = filtered.slice(0, 10)
    const detailed = await Promise.all(
      limited.map(async (pokemon) => {
        const res = await fetch(pokemon.url)
        const detail = await res.json()
        return {
          id: detail.id,
          name: detail.name,
          image:
            detail.sprites?.other?.['official-artwork']?.front_default ||
            detail.sprites?.front_default,
          types: detail.types.map((types) => types.type.name),
        }
      }),
    )

    return detailed
  } catch (error) {
    console.error('Erreur recherche Pokémon :', error)
    throw error
  }
}
