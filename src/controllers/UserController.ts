import { modalService } from '../components/Modal/ModalService.ts'
import UserForm from '../components/Forms/UserForm.vue'
import { UserModel } from '../models/UserModel.ts'
import type { ValidationResult } from '../types/index.ts'

export const UserController = {
    /**
     * Open user form modal for creating or editing
     * @param user - Existing user to edit, or null for new user
     * @returns Promise - Created/updated user or null if cancelled
     */
    async openForm(user: UserModel | null = null): Promise<UserModel | null> {
        const initialUser = user
            ? new UserModel(user.toJSON())
            : new UserModel()

        try {
            const result = await modalService.open<UserModel>(UserForm, {
                user: initialUser,
            })
            console.log('User form submitted:', result)
            return result
        } catch (error) {
            console.log('User form cancelled:', (error as Error).message)
            return null
        }
    },

    /**
     * Show confirmation dialog for user deletion
     * @param user - User to delete
     * @returns Promise<boolean> - True if confirmed, false if cancelled
     */
    async confirmDelete(user: UserModel): Promise<boolean> {
        return await modalService.confirm(
            `Are you sure you want to delete user "${user.name}"?`,
            {
                title: 'Delete User',
                details: 'This action cannot be undone.',
                confirmText: 'Delete',
                cancelText: 'Keep',
                isDangerous: true,
            }
        )
    },

    /**
     * Simulate saving user (in real app, this would call an API)
     * @param user - User to save
     * @returns Promise - Saved user
     */
    async save(user: UserModel): Promise<UserModel> {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('User saved:', user)
                resolve(user)
            }, 500)
        })
    },

    /**
     * Simulate deleting user (in real app, this would call an API)
     * @param user - User to delete
     * @returns Promise<boolean> - Success status
     */
    async delete(user: UserModel): Promise<boolean> {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('User deleted:', user)
                resolve(true)
            }, 500)
        })
    },

    /**
     * Validate user data
     * @param user - User to validate
     * @returns Validation result with isValid and errors
     */
    validate(user: UserModel): ValidationResult {
        const errors = user.getValidationErrors()
        return {
            isValid: errors.length === 0,
            errors,
        }
    },
}
