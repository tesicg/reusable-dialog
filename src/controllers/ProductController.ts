import { modalService } from '../components/Modal/ModalService.ts'
import ProductForm from '../components/Forms/ProductForm.vue'
import { ProductModel } from '../models/ProductModel.ts'
import type { ValidationResult } from '../types/index.ts'

export const ProductController = {
    /**
     * Open product form modal for creating or editing
     * @param product - Existing product to edit, or null for new product
     * @returns Promise - Created/updated product or null if cancelled
     */
    async openForm(
        product: ProductModel | null = null
    ): Promise<ProductModel | null> {
        const initialProduct = product
            ? new ProductModel(product.toJSON())
            : new ProductModel()

        try {
            const result = await modalService.open<ProductModel>(ProductForm, {
                product: initialProduct,
            })
            console.log('Product form submitted:', result)
            return result
        } catch (error) {
            console.log('Product form cancelled:', (error as Error).message)
            return null
        }
    },

    /**
     * Show confirmation dialog for product deletion
     * @param product - Product to delete
     * @returns Promise<boolean> - True if confirmed, false if cancelled
     */
    async confirmDelete(product: ProductModel): Promise<boolean> {
        return await modalService.confirm(
            `Are you sure you want to delete product "${product.name}"?`,
            {
                title: 'Delete Product',
                details: `This will permanently remove the product (${product.getFormattedPrice()}) from your catalog.`,
                confirmText: 'Delete',
                cancelText: 'Keep',
                isDangerous: true,
            }
        )
    },

    /**
     * Show confirmation dialog for price change
     * @param product - Product with new price
     * @param oldPrice - Previous price
     * @returns Promise<boolean> - True if confirmed, false if cancelled
     */
    async confirmPriceChange(
        product: ProductModel,
        oldPrice: number
    ): Promise<boolean> {
        const oldFormatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(oldPrice)

        return await modalService.confirm(
            `Change price from ${oldFormatted} to ${product.getFormattedPrice()}?`,
            {
                title: 'Confirm Price Change',
                details:
                    'This may affect existing orders and customer expectations.',
                confirmText: 'Update Price',
                cancelText: 'Keep Current Price',
            }
        )
    },

    /**
     * Simulate saving product (in real app, this would call an API)
     * @param product - Product to save
     * @returns Promise - Saved product
     */
    async save(product: ProductModel): Promise<ProductModel> {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Product saved:', product)
                resolve(product)
            }, 500)
        })
    },

    /**
     * Simulate deleting product (in real app, this would call an API)
     * @param product - Product to delete
     * @returns Promise<boolean> - Success status
     */
    async delete(product: ProductModel): Promise<boolean> {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Product deleted:', product)
                resolve(true)
            }, 500)
        })
    },

    /**
     * Validate product data
     * @param product - Product to validate
     * @returns Validation result with isValid and errors
     */
    validate(product: ProductModel): ValidationResult {
        const errors = product.getValidationErrors()
        return {
            isValid: errors.length === 0,
            errors,
        }
    },

    /**
     * Get products by category (simulated)
     * @param category - Category to filter by
     * @returns Promise - Array of products
     */
    async getByCategory(category: string): Promise<ProductModel[]> {
        // Simulate API call
        const mockProducts: ProductModel[] = [
            new ProductModel({
                name: 'Sample Product',
                price: 99.99,
                category: 'electronics',
            }),
        ]

        return new Promise((resolve) => {
            setTimeout(() => {
                const filtered = mockProducts.filter(
                    (p) => p.category === category
                )
                resolve(filtered)
            }, 300)
        })
    },
}
