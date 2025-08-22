import type { Component } from 'vue'

export interface ModalOptions {
    title?: string
    details?: string
    confirmText?: string
    cancelText?: string
    isDangerous?: boolean
}

export interface Modal {
    id: number
    component: Component
    props: Record<string, any>
    resolve: (value?: any) => void
    reject: (reason?: any) => void
}

export interface ModalServiceInterface {
    open<T = any>(component: Component, props?: Record<string, any>): Promise<T>
    close(id: number, payload?: any): void
    cancel(id: number, reason?: string): void
    closeAll(): void
    confirm(message: string, options?: ModalOptions): Promise<boolean>
    getModals(): Modal[]
}
