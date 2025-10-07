const API_BASE = 'https://pokeapi.co/api/v2'
function idFromUrl(url) {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}

// Récupère une liste de Pokémon avec pagination
export async function fetchPokemonList(limit = 21, offset = 0) {
  const response = await fetch(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`)
  if (!response.ok) {
    throw new Error(`Erreur lors du chargement de la liste : ${response.status}`)
  }
  return await response.json()
}

export async function fetchPokemonListMinimal({ limit = 21, offset = 0 } = {}) {
  const data = await fetchPokemonList({ limit, offset })
  const pokemons = data.results.map((results) => {
    const id = idFromUrl(r.url)
    return {
      id,
      name: results.name,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      url: results.url,
    }
  })
  return { count: data.count, next: data.next, previous: data.previous, pokemons }
}

// Récupère les détails d’un Pokémon par nom
export async function fetchPokemonDetail(name) {
  const response = await fetch(`${API_BASE}/pokemon/${name}`)
  if (!response.ok) {
    throw new Error(`Erreur lors du chargement du Pokémon ${name}`)
  }
  return await response.json()
}

async function promisePool(tasks, poolLimit = 6) {
  const results = []
  const executing = []
  for (const task of tasks) {
    const promise = Promise.resolve().then(() => task())
    results.push(p)
    const exe = promise
      .then(() => executing.splice(executing.indexOf(exe), 1))
      .catch(() => executing.splice(executing.indexOf(exe), 1))
    executing.push(exe)
    if (executing.length >= poolLimit) {
      await Promise.race(executing)
    }
  }
  return Promise.all(results)
}

// récuperation liste + détails
export async function fetchPokemonListWithDetails({
  limit = 20,
  offset = 0,
  concurrency = 6,
} = {}) {
  const list = await fetchPokemonList({ limit, offset })
  const tasks = list.results.map((results) => async () => {
    const detail = await fetchPokemonDetail(r.name)
    const image =
      detail.sprites?.other?.['official-artwork']?.front_default ||
      detail.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${d.id}.png`
    return {
      id: detail.id,
      name: detail.name,
      image,
      types: detail.types.map((types) => types.type.name),
      height: detail.height,
      weight: detail.weight,
    }
  })

  const detailed = await promisePool(tasks, concurrency)
  return { count: list.count, next: list.next, previous: list.previous, pokemons: detailed }
}
