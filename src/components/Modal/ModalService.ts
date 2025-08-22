import { reactive } from 'vue'
import type { Component } from 'vue'
import type {
    Modal,
    ModalOptions,
    ModalServiceInterface,
} from '../../types/modal.ts'

interface ModalState {
    modals: Modal[]
}

const state = reactive<ModalState>({
    modals: [],
})

let uid = 0

export const modalService: ModalServiceInterface = {
    /**
     * Open a modal with any component and props
     * @param component - Vue component to render
     * @param props - Props to pass to the component
     * @returns Promise - Resolves with result data or rejects if cancelled
     */
    open<T = any>(
        component: Component,
        props: Record<string, any> = {}
    ): Promise<T> {
        if (!component) {
            return Promise.reject(
                new Error('modalService.open: no component provided')
            )
        }

        const id = ++uid
        return new Promise<T>((resolve, reject) => {
            state.modals.push({
                id,
                component,
                props,
                resolve,
                reject,
            })
        })
    },

    /**
     * Close modal with result data
     * @param id - Modal ID
     * @param payload - Data to resolve with
     */
    close(id: number, payload: any = null): void {
        const index = state.modals.findIndex((m) => m.id === id)
        if (index !== -1) {
            const modal = state.modals[index]
            modal.resolve(payload)
            state.modals.splice(index, 1)
        }
    },

    /**
     * Cancel modal (reject promise)
     * @param id - Modal ID
     * @param reason - Reason for cancellation
     */
    cancel(id: number, reason: string = 'cancelled'): void {
        const index = state.modals.findIndex((m) => m.id === id)
        if (index !== -1) {
            const modal = state.modals[index]
            modal.reject(new Error(reason))
            state.modals.splice(index, 1)
        }
    },

    /**
     * Close all modals
     */
    closeAll(): void {
        state.modals.forEach((modal) => {
            modal.reject(new Error('closed_all'))
        })
        state.modals.length = 0
    },

    /**
     * Get reactive array of modals
     * @returns Array of modal objects
     */
    getModals(): Modal[] {
        return state.modals
    },

    /**
     * Quick confirmation dialog
     * @param message - Confirmation message
     * @param options - Additional options
     * @returns Promise<boolean> - True if confirmed, false if cancelled
     */
    async confirm(
        message: string,
        options: ModalOptions = {}
    ): Promise<boolean> {
        try {
            const ConfirmDialog = (await import('../Forms/ConfirmDialog.vue'))
                .default
            const result = await this.open<boolean>(ConfirmDialog, {
                message,
                ...options,
            })
            return result === true
        } catch (error) {
            return false
        }
    },
}
