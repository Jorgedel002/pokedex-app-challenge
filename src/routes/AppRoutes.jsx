import { Routes, Route } from 'react-router-dom'
import Layout from '../shared/components/Layout'
import PokemonListPage from '../features/pokemon/pages/PokemonListPage'
import PokemonDetailPage from '../features/pokemon/pages/PokemonDetailPage'
import TeamPage from '../features/favorites/pages/TeamPage'
import ComparePage from '../features/comparison/pages/ComparePage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PokemonListPage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Route>
    </Routes>
  )
}
