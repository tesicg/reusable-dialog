export interface UserData {
    name?: string
    email?: string
    age?: number | null
}

export interface ProductData {
    name?: string
    price?: number
    category?: string
    description?: string
}

export interface ValidationResult {
    isValid: boolean
    errors: string[]
}

export interface BaseModelInterface {
    toJSON(): Record<string, any>
    isValid(): boolean
    getValidationErrors(): string[]
}
