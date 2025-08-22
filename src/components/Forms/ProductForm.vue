<template>
    <div class="form-container">
        <div class="form-header">
            <h2>{{ isEdit ? 'Edit Product' : 'Create New Product' }}</h2>
            <button
                type="button"
                class="close-btn"
                @click="$emit('cancel')"
                aria-label="Close"
            >
                ×
            </button>
        </div>

        <form @submit.prevent="onSubmit" class="product-form">
            <div class="form-group">
                <label for="product-name">Product Name *</label>
                <input
                    id="product-name"
                    v-model="localProduct.name"
                    type="text"
                    required
                    :class="{ error: errors.name }"
                    @blur="validateField('name')"
                />
                <span v-if="errors.name" class="error-message">{{
                    errors.name
                }}</span>
            </div>

            <div class="form-group">
                <label for="price">Price *</label>
                <input
                    id="price"
                    v-model.number="localProduct.price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    :class="{ error: errors.price }"
                    @blur="validateField('price')"
                />
                <span v-if="errors.price" class="error-message">{{
                    errors.price
                }}</span>
                <span v-if="localProduct.price > 0" class="price-preview">
                    Preview: {{ localProduct.getFormattedPrice() }}
                </span>
            </div>

            <div class="form-group">
                <label for="category">Category *</label>
                <select
                    id="category"
                    v-model="localProduct.category"
                    required
                    :class="{ error: errors.category }"
                    @blur="validateField('category')"
                >
                    <option value="">Select a category</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="home">Home & Garden</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                </select>
                <span v-if="errors.category" class="error-message">{{
                    errors.category
                }}</span>
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea
                    id="description"
                    v-model="localProduct.description"
                    rows="4"
                    placeholder="Optional product description..."
                ></textarea>
            </div>

            <div class="form-actions">
                <button
                    type="button"
                    @click="$emit('cancel')"
                    class="btn btn-secondary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    :disabled="!isFormValid"
                    class="btn btn-primary"
                >
                    {{ isEdit ? 'Update Product' : 'Create Product' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { ProductModel } from '../../models/ProductModel.ts'

interface Props {
    product: ProductModel
}

interface Emits {
    submit: [product: ProductModel]
    cancel: []
    close: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Create a local copy to avoid mutating the prop
const localProduct = reactive(new ProductModel(props.product.toJSON()))

interface FormErrors {
    name: string
    price: string
    category: string
}

const errors = reactive<FormErrors>({
    name: '',
    price: '',
    category: '',
})

const isEdit = computed(() => {
    return props.product.name !== '' || props.product.price > 0
})

const isFormValid = computed(() => {
    return (
        localProduct.isValid() &&
        !Object.values(errors).some((error) => error !== '')
    )
})

function validateField(fieldName: keyof FormErrors): void {
    errors[fieldName] = ''

    switch (fieldName) {
        case 'name':
            if (!localProduct.name.trim()) {
                errors.name = 'Product name is required'
            }
            break
        case 'price':
            if (localProduct.price <= 0) {
                errors.price = 'Price must be greater than 0'
            }
            break
        case 'category':
            if (!localProduct.category.trim()) {
                errors.category = 'Category is required'
            }
            break
    }
}

function validateForm(): void {
    validateField('name')
    validateField('price')
    validateField('category')
}

function onSubmit(): void {
    validateForm()

    if (!isFormValid.value) {
        return
    }

    emit('submit', localProduct)
}

// Watch for changes and clear errors
watch(
    () => localProduct.name,
    () => {
        if (errors.name) errors.name = ''
    }
)

watch(
    () => localProduct.price,
    () => {
        if (errors.price) errors.price = ''
    }
)

watch(
    () => localProduct.category,
    () => {
        if (errors.category) errors.category = ''
    }
)
</script>

<style scoped>
.form-container {
    padding: 10px;
    min-width: 450px;
    max-width: 550px;
}

.form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.form-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    color: #6b7280;
    border-radius: 4px;
}

.close-btn:hover {
    background-color: #f3f4f6;
    color: #374151;
}

.product-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error,
.form-group select.error {
    border-color: #ef4444;
}

.error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.price-preview {
    color: #059669;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    font-weight: 500;
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn-secondary {
    background-color: #f3f4f6;
    color: #374151;
}

.btn-secondary:hover {
    background-color: #e5e7eb;
}

.btn-primary {
    background-color: #3b82f6;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
}

.btn-primary:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    .form-header {
        border-bottom-color: #374151;
    }

    .form-group label {
        color: #e5e7eb;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
        background-color: #374151;
        border-color: #4b5563;
        color: #e5e7eb;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
    }

    .close-btn:hover {
        background-color: #374151;
        color: #e5e7eb;
    }

    .form-actions {
        border-top-color: #374151;
    }

    .btn-secondary {
        background-color: #374151;
        color: #e5e7eb;
    }

    .btn-secondary:hover {
        background-color: #4b5563;
    }
}
</style>
