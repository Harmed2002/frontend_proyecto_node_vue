<template>
	<div class="card">
		<h1>Lista Pedidos</h1>
		<!--pre>{{ pedidos }}</pre-->
		<Toast />
		<DataTable v-model:expandedRows="expandedRows" :value="pedidos" dataKey="id" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" tableStyle="min-width: 60rem">
			<template #header>
				<div class="flex flex-wrap justify-content-end gap-2">
					<Button text icon="pi pi-plus" label="Expandir Todo" @click="expandAll" />
					<Button text icon="pi pi-minus" label="Collapsar Todo" @click="collapseAll" />
				</div>
			</template>
			<Column expander style="width: 5rem" />
			<Column field="id" header="Id" sortable></Column>
			<!--Column header="Image">
                <template #body="slotProps">
                    <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="shadow-4" width="64" />
                </template>
            </Column-->
			<Column field="fecha" header="Fecha" sortable>
				<!--template #body="slotProps">
                    {{ formatCurrency(slotProps.data.price) }}
                </template-->
			</Column>
			<Column field="Cliente" header="Cliente" sortable>
				<template #body="slotProps">
					<span>{{ slotProps.data.Cliente.nombre_completo }}</span><br>
					<span>{{ slotProps.data.Cliente.correo }} - Tel. {{ slotProps.data.Cliente.telefono }}</span>
				</template>
			</Column>
			<!--Column field="rating" header="Reviews">
                <template #body="slotProps">
                    <Rating :modelValue="slotProps.data.rating" readonly :cancel="false" />
                </template>
            </Column-->
			<Column header="Estado">
				<template #body="slotProps">
					<!--Tag :value="slotProps.data.estado" :severity="getSeverity(slotProps.data)" /-->
					<!--:class="'product-badge status-' + slotProps.data.estado" SIRVE PARA DAR NEGRILLA AL CAMPO-->
					<span>{{ slotProps.data.estado == 1 ? 'EN PROCESO' : 'PROCESADO'}}</span>
				</template>
			</Column>
			<template #expansion="slotProps">
				<div class="p-3">
					<h5>Productos del pedido {{ slotProps.data.id }}</h5>
					<DataTable :value="slotProps.data.Productos">
						<Column field="id" header="Id" sortable></Column>
						<Column field="nombre" header="Nombre" sortable></Column>
						<Column field="cantidad" header="Cantidad" sortable></Column>
						<Column field="precio" header="Precio" sortable>
							<template #body="slotProps">
								{{ formatCurrency(slotProps.data.precio) }}
							</template>
						</Column>
						<Column field="stock" header="Stock" sortable>
							<template #body="slotProps">
								<Tag :value="slotProps.data.stock"/>
							</template>
						</Column>
						<!--Column headerStyle="width:4rem">
							<template #body>
								<Button icon="pi pi-search" />
							</template>
						</!--Column-->
					</DataTable>
				</div>
			</template>
		</DataTable>
	</div>
</template>
<script>
import pedidoService from '@/service/PedidoService.js';
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';

export default {
	setup() {
		const pedidos = ref([]);
		const expandedRows = ref([]);
		const toast = useToast();

		onMounted(() => {
			listaPedidos();
		})

		const onRowExpand = (event) => {
			toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
		};

		const onRowCollapse = (event) => {
			toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
		};

		const expandAll = () => {
			expandedRows.value = pedidos.value.filter(p => p.id);
			toast.add({ severity: 'success', summary: 'All rows expanded', life: 3000 });
		};

		const collapseAll = () => {
			expandedRows.value = null;
			toast.add({ severity: 'success', summary: 'All rows collapsed', life: 3000 });
		};

		const formatCurrency = (value) => {
			return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
		}

		const listaPedidos = async () => {
			const { data } = await pedidoService.listar();
			pedidos.value = data.rows;
		}

		return {
			pedidos,
			expandedRows,
			onRowExpand,
			onRowCollapse,
			expandAll,
			collapseAll,
			formatCurrency
		}
	}

}
</script>

<style></style>
