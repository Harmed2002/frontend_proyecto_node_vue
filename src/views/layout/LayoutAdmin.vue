<template>
	<h1>Administración</h1>
	<!--MENU DE LA APLICACION-->
	<nav>
		<RouterLink to="/admin">Admin</RouterLink> |
		<RouterLink to="/admin/perfil">Mi Perfil</RouterLink> |
		<RouterLink to="/admin/categoria">Categorías</RouterLink> |
	</nav>

	<RouterView />
</template>