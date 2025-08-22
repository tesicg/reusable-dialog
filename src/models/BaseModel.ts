import type { BaseModelInterface } from '../types/index.ts'

export class BaseModel implements BaseModelInterface {
    constructor(data: Record<string, any> = {}) {
        Object.assign(this, data)
    }

    toJSON(): Record<string, any> {
        return { ...this }
    }

    // Override in subclasses for validation
    isValid(): boolean {
        return true
    }

    // Override in subclasses for custom validation messages
    getValidationErrors(): string[] {
        return []
    }
}
