<template>
    <div id="app">
        <header class="app-header">
            <h1>🎭 Reusable Modal System Demo</h1>
            <p>A Vue 3 modal system with proper MVC architecture</p>
        </header>

        <main class="app-main">
            <!-- User Management Section -->
            <section class="demo-section">
                <h2>👥 User Management</h2>
                <div class="section-actions">
                    <button @click="createUser" class="btn btn-primary">➕ Create User</button>
                </div>

                <div class="data-grid" v-if="users.length > 0">
                    <div v-for="user in users" :key="user.email" class="data-card">
                        <div class="card-content">
                            <h3>{{ user.name }}</h3>
                            <p>{{ user.email }}</p>
                            <p v-if="user.age">Age: {{ user.age }}</p>
                        </div>
                        <div class="card-actions">
                            <button @click="editUser(user)" class="btn btn-sm btn-secondary">
                                ✏️ Edit
                            </button>
                            <button @click="deleteUser(user)" class="btn btn-sm btn-danger">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
                <p v-else class="empty-state">No users yet. Create one to get started!</p>
            </section>

            <!-- Product Management Section -->
            <section class="demo-section">
                <h2>📦 Product Management</h2>
                <div class="section-actions">
                    <button @click="createProduct" class="btn btn-primary">
                        ➕ Create Product
                    </button>
                </div>

                <div class="data-grid" v-if="products.length > 0">
                    <div v-for="product in products" :key="product.name" class="data-card">
                        <div class="card-content">
                            <h3>{{ product.name }}</h3>
                            <p class="price">
                                {{ product.getFormattedPrice() }}
                            </p>
                            <p class="category">{{ product.category }}</p>
                            <p v-if="product.description" class="description">
                                {{ product.description }}
                            </p>
                        </div>
                        <div class="card-actions">
                            <button @click="editProduct(product)" class="btn btn-sm btn-secondary">
                                ✏️ Edit
                            </button>
                            <button @click="deleteProduct(product)" class="btn btn-sm btn-danger">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
                <p v-else class="empty-state">No products yet. Create one to get started!</p>
            </section>

            <!-- Modal Demos Section -->
            <section class="demo-section">
                <h2>🎪 Modal Demos</h2>
                <div class="demo-buttons">
                    <button @click="showConfirmDemo" class="btn btn-outline">
                        💬 Confirmation Dialog
                    </button>
                    <button @click="showDangerousConfirmDemo" class="btn btn-outline btn-danger">
                        ⚠️ Dangerous Confirmation
                    </button>
                </div>
            </section>
        </main>

        <!-- Modal Host - renders all modals -->
        <ModalHost />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ModalHost from './components/Modal/ModalHost.vue'
import { UserController } from './controllers/UserController.ts'
import { ProductController } from './controllers/ProductController.ts'
import { UserModel } from './models/UserModel.ts'
import { ProductModel } from './models/ProductModel.ts'
import { useModal } from './composables/useModal.ts'

const { confirm, alert } = useModal()

// Sample data for demonstration
const users = ref([
    new UserModel({ name: 'John Doe', email: 'john@example.com', age: 30 }),
    new UserModel({ name: 'Jane Smith', email: 'jane@example.com', age: 25 }),
])

const products = ref([
    new ProductModel({
        name: 'Laptop',
        price: 999.99,
        category: 'electronics',
        description: 'High-performance laptop',
    }),
    new ProductModel({
        name: 'T-Shirt',
        price: 29.99,
        category: 'clothing',
        description: 'Comfortable cotton t-shirt',
    }),
])

// User operations
async function createUser() {
    const newUser = await UserController.openForm()
    if (newUser) {
        users.value.push(newUser)
        await alert(`User "${newUser.name}" created successfully!`)
    }
}

async function editUser(user: UserModel) {
    const updatedUser = await UserController.openForm(user)
    if (updatedUser) {
        const index = users.value.findIndex((u) => u === user)
        if (index !== -1) {
            users.value[index] = updatedUser
            await alert(`User "${updatedUser.name}" updated successfully!`)
        }
    }
}

async function deleteUser(user: UserModel) {
    const confirmed = await UserController.confirmDelete(user)
    if (confirmed) {
        const index = users.value.findIndex((u) => u === user)
        if (index !== -1) {
            users.value.splice(index, 1)
            await alert(`User "${user.name}" deleted successfully!`)
        }
    }
}

// Product operations
async function createProduct() {
    const newProduct = await ProductController.openForm()
    if (newProduct) {
        products.value.push(newProduct)
        await alert(`Product "${newProduct.name}" created successfully!`)
    }
}

async function editProduct(product: ProductModel) {
    const updatedProduct = await ProductController.openForm(product)
    if (updatedProduct) {
        const index = products.value.findIndex((p) => p === product)
        if (index !== -1) {
            products.value[index] = updatedProduct
            await alert(`Product "${updatedProduct.name}" updated successfully!`)
        }
    }
}

async function deleteProduct(product: ProductModel) {
    const confirmed = await ProductController.confirmDelete(product)
    if (confirmed) {
        const index = products.value.findIndex((p) => p === product)
        if (index !== -1) {
            products.value.splice(index, 1)
            await alert(`Product "${product.name}" deleted successfully!`)
        }
    }
}

// Demo functions
async function showConfirmDemo() {
    const confirmed = await confirm('This is a confirmation dialog. Do you want to proceed?')
    await alert(confirmed ? 'You clicked Confirm!' : 'You clicked Cancel!')
}

async function showDangerousConfirmDemo() {
    const confirmed = await confirm('This is a dangerous action that cannot be undone.', {
        title: 'Dangerous Action',
        details: 'Please think carefully before proceeding.',
        confirmText: 'I Understand',
        cancelText: 'Cancel',
        isDangerous: true,
    })
    await alert(
        confirmed ? 'You confirmed the dangerous action!' : 'You cancelled the dangerous action!',
    )
}
</script>

<style scoped>
#app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.app-header {
    text-align: center;
    margin-bottom: 3rem;
}

.app-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.app-header p {
    color: #6b7280;
    font-size: 1.1rem;
}

.app-main {
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

.demo-section {
    background: var(--section-bg, #f9fafb);
    border-radius: 12px;
    padding: 2rem;
    border: 1px solid var(--section-border, #e5e7eb);
}

.demo-section h2 {
    margin: 0 0 1.5rem 0;
    color: var(--heading-color, #111827);
}

.section-actions {
    margin-bottom: 1.5rem;
}

.data-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.data-card {
    background: var(--card-bg, white);
    border: 1px solid var(--card-border, #e5e7eb);
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.card-content h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary, #111827);
}

.card-content p {
    margin: 0.25rem 0;
    color: var(--text-secondary, #6b7280);
}

.price {
    font-weight: 600;
    color: var(--price-color, #059669) !important;
    font-size: 1.1rem;
}

.category {
    text-transform: capitalize;
    font-size: 0.875rem;
    background: var(--category-bg, #f3f4f6);
    color: var(--category-text, #374151);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    display: inline-block;
}

.description {
    font-style: italic;
    font-size: 0.875rem;
}

.card-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
}

.demo-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.empty-state {
    text-align: center;
    color: var(--text-muted, #9ca3af);
    font-style: italic;
    padding: 2rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

.btn-primary {
    background-color: #3b82f6;
    color: white;
}

.btn-primary:hover {
    background-color: #2563eb;
}

.btn-secondary {
    background-color: #f3f4f6;
    color: #374151;
}

.btn-secondary:hover {
    background-color: #e5e7eb;
}

.btn-danger {
    background-color: #ef4444;
    color: white;
}

.btn-danger:hover {
    background-color: #dc2626;
}

.btn-outline {
    background-color: transparent;
    border: 1px solid #d1d5db;
    color: #374151;
}

.btn-outline:hover {
    background-color: #f9fafb;
}

.btn-outline.btn-danger {
    border-color: #ef4444;
    color: #ef4444;
}

.btn-outline.btn-danger:hover {
    background-color: #fef2f2;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        --section-bg: #1f2937;
        --section-border: #374151;
        --heading-color: #f9fafb;
        --card-bg: #111827;
        --card-border: #374151;
        --text-primary: #f9fafb;
        --text-secondary: #d1d5db;
        --text-muted: #6b7280;
        --price-color: #10b981;
        --category-bg: #374151;
        --category-text: #d1d5db;
    }

    .btn-secondary {
        background-color: #374151;
        color: #e5e7eb;
    }

    .btn-secondary:hover {
        background-color: #4b5563;
    }

    .btn-outline {
        border-color: #4b5563;
        color: #e5e7eb;
    }

    .btn-outline:hover {
        background-color: #374151;
    }
}
</style>
