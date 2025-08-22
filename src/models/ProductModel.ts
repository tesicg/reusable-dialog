import { BaseModel } from './BaseModel.ts'
import type { ProductData } from '../types/index.ts'

export class ProductModel extends BaseModel {
    name: string
    price: number
    description: string
    category: string

    constructor(data: ProductData = {}) {
        super(data)
        this.name = data.name ?? ''
        this.price = data.price ?? 0
        this.description = data.description ?? ''
        this.category = data.category ?? ''
    }

    isValid(): boolean {
        return (
            this.name.trim() !== '' &&
            this.price > 0 &&
            this.category.trim() !== ''
        )
    }

    getValidationErrors(): string[] {
        const errors: string[] = []
        if (!this.name.trim()) errors.push('Product name is required')
        if (this.price <= 0) errors.push('Price must be greater than 0')
        if (!this.category.trim()) errors.push('Category is required')
        return errors
    }

    getFormattedPrice(): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(this.price)
    }
}
