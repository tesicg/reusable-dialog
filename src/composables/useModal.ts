import { computed } from 'vue'
import type { Component, ComputedRef } from 'vue'
import { modalService } from '../components/Modal/ModalService.ts'
import type { Modal, ModalOptions } from '../types/modal.ts'

interface UseModalReturn {
    // State
    modals: ComputedRef<Modal[]>
    hasModals: ComputedRef<boolean>
    modalCount: ComputedRef<number>
    topModal: ComputedRef<Modal | null>

    // Methods
    open: <T = any>(
        component: Component,
        props?: Record<string, any>
    ) => Promise<T>
    close: (id: number, payload?: any) => void
    cancel: (id: number, reason?: string) => void
    closeAll: () => void
    confirm: (message: string, options?: ModalOptions) => Promise<boolean>
    alert: (message: string, options?: ModalOptions) => Promise<void>
}

/**
 * Composable for modal management
 * Provides reactive access to modal state and convenient methods
 */
export function useModal(): UseModalReturn {
    const modals = computed(() => modalService.getModals())
    const hasModals = computed(() => modals.value.length > 0)
    const modalCount = computed(() => modals.value.length)
    const topModal = computed(
        () => modals.value[modals.value.length - 1] || null
    )

    /**
     * Open a modal with any component
     * @param component - Vue component to render
     * @param props - Props to pass to the component
     * @returns Promise - Resolves with result or rejects if cancelled
     */
    const open = <T = any>(
        component: Component,
        props: Record<string, any> = {}
    ): Promise<T> => {
        return modalService.open<T>(component, props)
    }

    /**
     * Close a specific modal
     * @param id - Modal ID
     * @param payload - Data to resolve with
     */
    const close = (id: number, payload: any = null): void => {
        modalService.close(id, payload)
    }

    /**
     * Cancel a specific modal
     * @param id - Modal ID
     * @param reason - Reason for cancellation
     */
    const cancel = (id: number, reason: string = 'cancelled'): void => {
        modalService.cancel(id, reason)
    }

    /**
     * Close all modals
     */
    const closeAll = (): void => {
        modalService.closeAll()
    }

    /**
     * Quick confirmation dialog
     * @param message - Confirmation message
     * @param options - Additional options
     * @returns Promise<boolean> - True if confirmed
     */
    const confirm = (
        message: string,
        options: ModalOptions = {}
    ): Promise<boolean> => {
        return modalService.confirm(message, options)
    }

    /**
     * Quick alert dialog (using confirm with only OK button)
     * @param message - Alert message
     * @param options - Additional options
     * @returns Promise - Resolves when dismissed
     */
    const alert = async (
        message: string,
        options: ModalOptions = {}
    ): Promise<void> => {
        const alertOptions: ModalOptions = {
            title: 'Alert',
            confirmText: 'OK',
            cancelText: '', // Hide cancel button
            ...options,
        }

        try {
            await confirm(message, alertOptions)
        } catch (error) {
            // Alert was dismissed, which is fine
        }
    }

    return {
        // State
        modals,
        hasModals,
        modalCount,
        topModal,

        // Methods
        open,
        close,
        cancel,
        closeAll,
        confirm,
        alert,
    }
}
