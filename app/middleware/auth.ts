export default defineNuxtRouteMiddleware((to) => {
  // Liste des routes qui nécessitent une authentification
  const protectedRoutes = [
    '/dashboard',
    '/transactions',
    '/profile',
    '/transfer'
  ]

  // Si la route actuelle est dans la liste des routes protégées
  if (protectedRoutes.includes(to.path)) {
    // Ici, vous pouvez ajouter votre logique d'authentification
    // Pour l'instant, nous laissons passer toutes les routes
    return
  }
}) 