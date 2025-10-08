// nimport variables env
const API_BASE_URL = import.meta.env.VITE_POKEAPI_BASE_URL
const SPRITES_BASE_URL = import.meta.env.VITE_POKEAPI_SPRITES_URL
const OFFICIAL_ARTWORK_BASE_URL = import.meta.env.VITE_POKEAPI_OFFICIAL_ARTWORK_URL

function extractPokemonIdFromUrl(pokemonUrl) {
  const urlSegments = pokemonUrl.split('/').filter(Boolean)
  return Number(urlSegments[urlSegments.length - 1])
}

// récupération liste brute depuis API
export async function fetchPokemonList(limit = 21, offset = 0) {
  const pokemonListResponse = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!pokemonListResponse.ok) {
    throw new Error(`Erreur lors du chargement de la liste : ${pokemonListResponse.status}`)
  }
  return await pokemonListResponse.json()
}

// récupérationliste simplifiée
export async function fetchPokemonListMinimal({ limit = 21, offset = 0 } = {}) {
  const pokemonListData = await fetchPokemonList(limit, offset)

  const simplifiedPokemonList = pokemonListData.results.map((pokemonEntry) => {
    const pokemonId = extractPokemonIdFromUrl(pokemonEntry.url)
    return {
      id: pokemonId,
      name: pokemonEntry.name,
      image: `${SPRITES_BASE_URL}/${pokemonId}.png`,
      url: pokemonEntry.url,
    }
  })

  return {
    count: pokemonListData.count,
    next: pokemonListData.next,
    previous: pokemonListData.previous,
    pokemons: simplifiedPokemonList,
  }
}

// recupération détails pokémon par nom ou numero
export async function fetchPokemonDetail(pokemonIdentifier) {
  const pokemonDetailResponse = await fetch(`${API_BASE_URL}/pokemon/${pokemonIdentifier}`)
  if (!pokemonDetailResponse.ok) {
    throw new Error(`Erreur lors du chargement du Pokémon ${pokemonIdentifier}`)
  }
  return await pokemonDetailResponse.json()
}

async function executePromisePool(taskList, poolLimit = 6) {
  const allResults = []
  const runningTasks = []

  for (const task of taskList) {
    const currentPromise = Promise.resolve().then(task)
    allResults.push(currentPromise)

    const cleanup = currentPromise
      .then(() => runningTasks.splice(runningTasks.indexOf(cleanup), 1))
      .catch(() => runningTasks.splice(runningTasks.indexOf(cleanup), 1))

    runningTasks.push(cleanup)

    if (runningTasks.length >= poolLimit) {
      await Promise.race(runningTasks)
    }
  }

  return Promise.all(allResults)
}

// recupération d'une liste complète avec détails
export async function fetchPokemonListWithDetails({
  limit = 21,
  offset = 0,
  concurrency = 6,
} = {}) {
  const basePokemonListData = await fetchPokemonList(limit, offset)

  const pokemonDetailTasks = basePokemonListData.results.map((pokemonEntry) => async () => {
    const pokemonDetailData = await fetchPokemonDetail(pokemonEntry.name)

    const pokemonImageUrl =
      pokemonDetailData.sprites?.other?.['official-artwork']?.front_default ||
      pokemonDetailData.sprites?.front_default ||
      `${SPRITES_BASE_URL}/${pokemonDetailData.id}.png`

    return {
      id: pokemonDetailData.id,
      name: pokemonDetailData.name,
      image: pokemonImageUrl,
      types: pokemonDetailData.types.map((typeEntry) => typeEntry.type.name),
      height: pokemonDetailData.height,
      weight: pokemonDetailData.weight,
    }
  })

  const detailedPokemonList = await executePromisePool(pokemonDetailTasks, concurrency)

  return {
    count: basePokemonListData.count,
    next: basePokemonListData.next,
    previous: basePokemonListData.previous,
    pokemons: detailedPokemonList,
  }
}

//  recherche pokémon par nom ou nom partiel
export async function fetchPokemonByName(searchQuery) {
  try {
    const normalizedQuery = searchQuery.toLowerCase().trim()

    const pokemonListResponse = await fetch(`${API_BASE_URL}/pokemon?limit=1000`)
    if (!pokemonListResponse.ok) {
      throw new Error('Erreur lors du chargement des données')
    }

    const fullPokemonList = await pokemonListResponse.json()

    // filtrage pokémon correspondant
    const matchingPokemons = fullPokemonList.results.filter((pokemonEntry) =>
      pokemonEntry.name.includes(normalizedQuery),
    )

    if (!matchingPokemons.length) {
      throw new Error('Aucun Pokémon trouvé')
    }

    const limitedPokemons = matchingPokemons.slice(0, 10)

    const detailedSearchResults = await Promise.all(
      limitedPokemons.map(async (pokemonEntry) => {
        const pokemonDetailResponse = await fetch(pokemonEntry.url)
        const pokemonDetailData = await pokemonDetailResponse.json()

        return {
          id: pokemonDetailData.id,
          name: pokemonDetailData.name,
          image:
            pokemonDetailData.sprites?.other?.['official-artwork']?.front_default ||
            pokemonDetailData.sprites?.front_default ||
            `${SPRITES_BASE_URL}/${pokemonDetailData.id}.png`,
          types: pokemonDetailData.types.map((typeEntry) => typeEntry.type.name),
        }
      }),
    )

    return detailedSearchResults
  } catch (error) {
    console.error('Erreur recherche Pokémon :', error)
    throw error
  }
}
