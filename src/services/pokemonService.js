const BASE_URL = 'https://pokeapi.co/api/v2'

// fonction pour récupérer la liste des pokémons de l'API
export async function fetchPokemonList(limit = 20, offset = 0) {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`)
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`)
  }
  return await response.json()
}

// fonction pour récupérer les détails des pokémons
export async function fetchPokemonDetail(nameOrId) {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`)
  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`)
  }
  return await response.json()
}
