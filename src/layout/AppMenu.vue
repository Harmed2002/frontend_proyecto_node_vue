<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
	{
		label: 'Admin',
		items: [
			{ label: 'Administrador', icon: 'pi pi-fw pi-home', to: '/admin' },
			{ label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/admin/perfil' }
		]
	},
	{
		label: 'Gestión de Inventario',
		items: [
			{ label: 'Categorías', icon: 'pi pi-fw pi-list', to: '/admin/categoria' },
			{ label: 'Productos', icon: 'pi pi-fw pi-table', to: '/admin/producto' },
		]
	},
	{
		label: 'Facturación',
		items: [
			{ label: 'Ventas', icon: 'pi pi-fw pi-cart-plus', to: '/blocks', badge: 'NEW' },
			{ label: 'Clientes', icon: 'pi pi-fw pi-users', to: '/blocks', badge: 'NEW' },
			{ label: 'Nuevo Pedido', icon: 'pi pi-fw pi-file-edit', to: '/admin/pedido/nuevo' },
			{ label: 'Lista de Pedidos', icon: 'pi pi-fw pi-list', to: '/admin/pedido' }
		]
	},
	{
		label: 'Cartera',
		items: [
			{ label: 'Listado de Ctas. por Cobrar', icon: 'pi pi-fw pi-prime', to: '/utilities/icons' },
			{ label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', to: '/utilities/icons' }
		]
	},
]);
</script>

<template>
	<ul class="layout-menu">
		<template v-for="(item, i) in model" :key="item">
			<app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
			<li v-if="item.separator" class="menu-separator"></li>
		</template>
	</ul>
</template>

<style lang="scss" scoped></style>
