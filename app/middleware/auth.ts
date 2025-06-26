export default defineNuxtRouteMiddleware(to => {
  // Liste des routes qui nécessitent une authentification
  const protectedRoutes = ['/dashboard', '/transactions', '/profile', '/transfer'];

  // Si la route actuelle est dans la liste des routes protégées
  if (protectedRoutes.includes(to.path)) {
    // Vérifier la présence du token d'authentification dans les cookies
    const token = useCookie('token');
    
    if (!token.value) {
      // Rediriger vers la page de connexion si pas de token
      return navigateTo('/auth/login');
    }
  }
});
