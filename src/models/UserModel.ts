import { BaseModel } from './BaseModel.ts'
import type { UserData } from '../types/index.ts'

export class UserModel extends BaseModel {
    name: string
    email: string
    age: number | null

    constructor(data: UserData = {}) {
        super(data)
        this.name = data.name || ''
        this.email = data.email || ''
        this.age = data.age ?? null
    }

    isValid(): boolean {
        return (
            this.name.trim() !== '' &&
            this.email.trim() !== '' &&
            this.isValidEmail(this.email) &&
            (this.age === null || (this.age >= 0 && this.age <= 150))
        )
    }

    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    getValidationErrors(): string[] {
        const errors: string[] = []
        if (!this.name.trim()) errors.push('Name is required')
        if (!this.email.trim()) errors.push('Email is required')
        else if (!this.isValidEmail(this.email))
            errors.push('Email format is invalid')
        if (this.age !== null && (this.age < 0 || this.age > 150))
            errors.push('Age must be between 0 and 150')
        return errors
    }
}
