<template>
	<h1>Página Web</h1>
	<!--MENU DE LA APLICACION-->
	<nav>
		<RouterLink to="/">Inicio</RouterLink> |
		<RouterLink to="/about">Nosotros</RouterLink> |
		<RouterLink to="/registro">Regístrate</RouterLink> |
		<RouterLink to="/login">Login</RouterLink> |
	</nav>

	<RouterView />
</template>