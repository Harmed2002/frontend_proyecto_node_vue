<template>
	<Toast />
	<div class="card"><h1>Productos</h1></div>

	<Toolbar class="mb-4">
		<template #start>
			<Button label="Nuevo" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
			<Button label="Eliminar" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
		</template>
		<template #end>
			<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Importar" class="mr-2 inline-block" />
			<Button label="Exportar" icon="pi pi-upload" severity="help" @click="exportCSV($event)"  />
		</template>
	</Toolbar>

	<DataTable ref="dt" :value="products" :lazy="true" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters" 
		:totalRecords="totalRecords" :loading="loading" @page="onPage($event)"
		paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
		currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos">
		<template #header>
			<div class="flex flex-wrap gap-2 align-items-center justify-content-between">
				<h4 class="m-0">Administración de Productos</h4>
				<span class="p-input-icon-left">
					<i class="pi pi-search" />
					<InputText v-model="filters['global'].value" placeholder="Buscar..." />
				</span>
			</div>
		</template>
		<Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
		<Column field="id" header="Id" sortable style="min-width:1rem"></Column>
		<Column field="nombre" header="Nombre" sortable style="min-width:16rem"></Column>
		<Column header="Imagen">
			<template #body="slotProps">
				<img :src="`http://127.0.0.1:3000/imagenes/${slotProps.data.imagen}`" :alt="slotProps.data.imagen" class="shadow-2 border-round" style="width: 64px" />
			</template>
		</Column>
		<Column field="stock" header="Stock" sortable style="min-width:3rem"></Column>
		<Column field="precio" header="Precio" sortable style="min-width:8rem">
			<template #body="slotProps">
				{{formatCurrency(slotProps.data.precio)}}
			</template>
		</Column>
		<!--Column field="estado" header="Estado" sortable style="min-width:10rem"></!--Column-->
		<Column field="descripcion" header="Descripcion" sortable style="min-width:10rem"></Column>
		<Column field="Categorium.nombre" header="Categoría" sortable style="min-width:10rem"></Column>
		<!--Column field="rating" header="Reviews" sortable style="min-width:12rem">
			<template #body="slotProps">
				<Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
			</template>
		</Column>
		<Column-- field="inventoryStatus" header="Status" sortable style="min-width:12rem">
			<template #body="slotProps">
				<Tag :value="slotProps.data.inventoryStatus" :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
			</template>
		</Column-->
		<Column :exportable="false" style="min-width:8rem">
			<template #body="slotProps">
				<Button icon="pi pi-image" @click="openModalImagen(slotProps.data)" />
				<Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
				<Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
			</template>
		</Column>
	</DataTable>

	<Dialog v-model:visible="productDialog" :style="{width: '450px'}" header="Detalle de Producto" :modal="true" class="p-fluid">
		<!--img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block m-auto pb-3" /-->
		<div class="field">
			<label for="nombre">Nombre</label>
			<InputText id="nombre" v-model.trim="product.nombre" required="true" autofocus :class="{'p-invalid': submitted && !product.nombre}" />
			<small class="p-error" v-if="submitted && !product.nombre">El nombre es obligatorio.</small>
		</div>

		<div class="field">
			<label for="descripcion">Descripción</label>
			<Textarea id="descripcion" v-model="product.descripcion" required="true" rows="3" cols="20" />
		</div>

		<!--div class="field">
			<label for="estado" class="mb-3">Estado en Inventario</label>
			<Dropdown id="estado" v-model="product.estado" :options="statuses" optionLabel="label" placeholder="Seleccione un estado">
				<template #value="slotProps">
					<div v-if="slotProps.value && slotProps.value.value">
						<Tag :value="slotProps.value.value" :severity="getStatusLabel(slotProps.value.label)" />
					</div>
					<div v-else-if="slotProps.value && !slotProps.value.value">
						<Tag :value="slotProps.value" :severity="getStatusLabel(slotProps.value)" />
					</div>
					<span v-else>
						{{slotProps.placeholder}}
					</span>
				</template>
			</Dropdown>
		</!--div-->

		<div class="field">
			<label class="mb-3">Categorías</label>
			<div class="formgrid grid">
				<div class="field-radiobutton col-6" v-for="cat in categorias" :key="cat.id">
					<RadioButton id="category1" name="category" :value="cat.id" v-model="product.categoriaId" />
					<label for="category1">{{ cat.nombre }}</label>
				</div>
			</div>

			<!--
			<label class="mb-3">Categorías</label>
			<div class="formgrid grid">
				<div class="field-radiobutton col-6">
					<RadioButton id="category1" name="category" value="Accessories" v-model="product.category" />
					<label for="category1">Accessories</label>
				</div>
				<div class="field-radiobutton col-6">
					<RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
					<label for="category2">Clothing</label>
				</div>
				<div class="field-radiobutton col-6">
					<RadioButton id="category3" name="category" value="Electronics" v-model="product.category" />
					<label for="category3">Electronics</label>
				</div>
				<div class="field-radiobutton col-6">
					<RadioButton id="category4" name="category" value="Fitness" v-model="product.category" />
					<label for="category4">Fitness</label>
				</div>
			</div>
			-->
		</div>

		<div class="formgrid grid">
			<div class="field col">
				<label for="precio">Precio</label>
				<InputNumber id="precio" v-model="product.precio" mode="currency" currency="USD" locale="en-US" />
			</div>
			<div class="field col">
				<label for="stock">Stock</label>
				<InputNumber id="stock" v-model="product.stock" integeronly />
			</div>
		</div>
		<template #footer>
			<Button label="Cancelar" icon="pi pi-times" text @click="hideDialog"/>
			<Button label="Guardar" icon="pi pi-save" text @click="saveProduct" />
		</template>
	</Dialog>

	<Dialog v-model:visible="deleteProductDialog" :style="{width: '450px'}" header="Confirme" :modal="true">
		<div class="confirmation-content">
			<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
			<span v-if="product">¿Está usted seguro de querer borrar <b>{{product.nombre}}</b>?</span>
		</div>
		<template #footer>
			<Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false"/>
			<Button label="Sí" icon="pi pi-check" text @click="deleteProduct(product.id)" />
		</template>
	</Dialog>

	<Dialog v-model:visible="deleteProductsDialog" :style="{width: '450px'}" header="Confirme" :modal="true">
		<div class="confirmation-content">
			<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
			<span v-if="product">¿Está usted seguro de querer borrar el producto seleccionado?</span>
		</div>
		<template #footer>
			<Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false"/>
			<Button label="Sí" icon="pi pi-check" text @click="deleteSelectedProducts" />
		</template>
	</Dialog>

	<Dialog v-model:visible="displayModal" modal header="Cargar Imagen" :style="{ width: '50vw' }">
		<FileUpload :customUpload="true" @uploader="subirImagenServidor" :multiple="false" accept="image/*" :maxFileSize="1000000">
			<template #empty>
				<p>Arrastrar y soltar imágenes aquí para cargar.</p>
			</template>
		</FileUpload>

		<template #footer>
			<Button label="Cerrar" icon="pi pi-times" @click="displayModal = false" text />
		</template>
	</Dialog>

</template>

<script>
	import { ref, onMounted } from 'vue'
	import productoService from "@/service/ProductoService.js"
	import categoriaService from "@/service/CategoriaService.js"

	import { FilterMatchMode } from 'primevue/api';
	import { useToast } from 'primevue/usetoast';

	export default {
		setup() {
			const products = ref([]);
			const categorias = ref([]); // array
			const product = ref({});
			const producto_id = ref(0);

			const toast = useToast();
			const dt = ref();
			const loading = ref(false);
			const totalRecords = ref(0);
			const lazyParams = ref({});
			const displayModal = ref(false);
			const productDialog = ref(false);
			const deleteProductDialog = ref(false);
			const deleteProductsDialog = ref(false);
			const selectedProducts = ref();
			const filters = ref({
				'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
			});
			const submitted = ref(false);
			const statuses = ref([
				{label: 'INSTOCK', value: 'instock'},
				{label: 'LOWSTOCK', value: 'lowstock'},
				{label: 'OUTOFSTOCK', value: 'outofstock'}
			]);

			onMounted(() => {
				listarProductos();
				cargarCategorias();
				loading.value = true;
				lazyParams.value = {
					first: 0,
					rows: dt.value.rows,
					sortField: null,
					sortOrder: null,
					filters: filters.value
				};

				//loadLazyData();
			})

			const formatCurrency = (value) => {
				if(value)
					return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
				return;
			};

			const openNew = () => {
				product.value = {};
				submitted.value = false;
				productDialog.value = true;
			};

			const openModalImagen = (prod) => {
				producto_id.value = prod.id
				displayModal.value = true;
			}

			const hideDialog = () => {
				productDialog.value = false;
				submitted.value = false;
			};

			const saveProduct = async () => {
				submitted.value = true;

				if (product.value.nombre.trim()) {
					if (product.value.id) {
						/*
						product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
						products.value[findIndexById(product.value.id)] = product.value;
						*/

						const {data} = await productoService.modificar(product.value.id, product.value);
						listarProductos();
						toast.add({severity:'success', summary: 'Successful', detail: 'Producto actualizado exitosamente', life: 3000});
					}
					else {
						/*product.value.id = createId();
						product.value.code = createId();
						product.value.image = 'product-placeholder.svg';
						product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
						products.value.push(product.value);*/
						
						const {data} = await productoService.guardar(product.value);
						listarProductos();
						toast.add({severity:'success', summary: 'Successful', detail: 'Producto registrado exitosamente', life: 3000});
					}

					productDialog.value = false;
					product.value = {};
				}
			};

			const editProduct = (prod) => {
				product.value = {...prod};
				productDialog.value = true;
			};

			const confirmDeleteProduct = (prod) => {
				product.value = prod;
				deleteProductDialog.value = true;
			};

			const deleteProduct = async (id) => {
				/*
				products.value = products.value.filter(val => val.id !== product.value.id);
				deleteProductDialog.value = false;
				product.value = {};
				*/
				// aca no uso un try catch xq en productoController ya lo tiene
				const {data} = await productoService.eliminar(id);
				deleteProductDialog.value = false;
				product.value = {};
				listarProductos();
				toast.add({severity:'success', summary: 'Successful', detail: 'Producto eliminado', life: 3000});
			};

			const findIndexById = (id) => {
				let index = -1;
				for (let i = 0; i < products.value.length; i++) {
					if (products.value[i].id === id) {
						index = i;
						break;
					}
				}

				return index;
			};

			const createId = () => {
				let id = '';
				var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
				for ( var i = 0; i < 5; i++ ) {
					id += chars.charAt(Math.floor(Math.random() * chars.length));
				}
				return id;
			};

			const exportCSV = () => {
				dt.value.exportCSV();
			};

			const confirmDeleteSelected = () => {
				deleteProductsDialog.value = true;
			};

			const deleteSelectedProducts = () => {
				products.value = products.value.filter(val => !selectedProducts.value.includes(val));
				deleteProductsDialog.value = false;
				selectedProducts.value = null;
				toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
			};

			const onPage = (event) => {
				lazyParams.value = event;
				//loadLazyData();
				listarProductos();
			};

			const getStatusLabel = (status) => {
				switch (status) {
					case 'INSTOCK':
						return 'success';

					case 'LOWSTOCK':
						return 'warning';

					case 'OUTOFSTOCK':
						return 'danger';

					default:
						return null;
				}
			};

			const getCategoryLabel = (status) => {
				switch (status) {
					case 'INSTOCK':
						return 'success';

					case 'LOWSTOCK':
						return 'warning';

					case 'OUTOFSTOCK':
						return 'danger';

					default:
						return null;
				}
			};

			const subirImagenServidor = async (event) => {
				//console.log(event.files);

				try {
					let formData = new FormData();
					formData.append("imagen", event.files[0]);

					const { data } = await productoService.actualizarImagen(producto_id.value, formData);

					listarProductos();

					//toast.add({severity:'success', summary: 'Successful', detail: 'Imagen de producto actualizada', life: 3000});

				} catch (error) {
					console.log(error);
				}

				displayModal.value = false;

			}

			const cargarCategorias = async () => {
				try {
					const {data} = await categoriaService.listarCategoria();
					categorias.value = data;

				} catch (error) {
					console.log(error)
				}
				
			};
			
			const listarProductos = async () => {
				try {
					loading.value = true;
					
					const { data } = await productoService.listar(lazyParams.value.page? lazyParams.value.page + 1 : 1, lazyParams.value.rows);
					products.value = data.rows;
					totalRecords.value = data.count;
					
					loading.value = false;

				} catch (error) {
					console.log("Error: ", error);
				}
				
			};

			const guardarProducto = async () => {
				if (producto.value.id) {
					// Modificar
					const { data } = await productoService.modificarProducto(producto.value.id, producto.value)
				} else {
					// Guardar
					const { data } = await productoService.guardarProducto(producto.value)
				}

				listarProductos()
				clearProducto()

			};

			const editarProducto = (prod) => {
				producto.value = prod
			};

			const clearProducto = () => {
				producto.value = { nombre: '', detalle: '' }
			};

			const eliminarProducto = async (prod) => {
				const { data } = await productoService.eliminarProducto(prod.id)

				listarProductos()
				clearProducto()
			};

			return {
				dt,
				totalRecords,
				loading,
				lazyParams,
				onPage,
				productDialog,
				deleteProductDialog,
				deleteProductsDialog,
				selectedProducts,
				filters,
				submitted,
				statuses,
				formatCurrency,
				openNew,
				displayModal,
				openModalImagen,
				subirImagenServidor,
				producto_id,
				hideDialog,
				saveProduct,
				editProduct,
				confirmDeleteProduct,
				deleteProduct,
				findIndexById,
				createId,
				exportCSV,
				confirmDeleteSelected,
				deleteSelectedProducts,
				getStatusLabel,
				getCategoryLabel,
				cargarCategorias,
				categorias,
				products,
				product,
				guardarProducto,
				editarProducto,
				clearProducto,
				eliminarProducto
			}
		}
	}
</script>

<style></style>