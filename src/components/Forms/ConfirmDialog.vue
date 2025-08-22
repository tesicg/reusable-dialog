<template>
    <div class="confirm-dialog">
        <div class="dialog-header">
            <div class="icon-wrapper">
                <svg
                    class="warning-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                </svg>
            </div>
            <h3>{{ title }}</h3>
        </div>

        <div class="dialog-content">
            <p>{{ message }}</p>
            <div v-if="details" class="details">
                {{ details }}
            </div>
        </div>

        <div class="dialog-actions">
            <button
                v-if="cancelText !== ''"
                type="button"
                @click="onCancel"
                class="btn btn-secondary"
                :class="{ 'btn-danger': isDangerous }"
            >
                {{ cancelText }}
            </button>
            <button
                ref="confirmButtonRef"
                type="button"
                @click="onConfirm"
                class="btn btn-primary"
                :class="{ 'btn-danger': isDangerous }"
            >
                {{ confirmText }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
    message?: string
    title?: string
    details?: string
    confirmText?: string
    cancelText?: string
    isDangerous?: boolean
}

interface Emits {
    submit: [result: boolean]
    cancel: []
    close: []
}

withDefaults(defineProps<Props>(), {
    message: 'Are you sure?',
    title: 'Confirm Action',
    details: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDangerous: false,
})

const emit = defineEmits<Emits>()

const confirmButtonRef = ref<HTMLButtonElement | null>(null)

function onConfirm(): void {
    emit('submit', true)
}

function onCancel(): void {
    emit('cancel')
}

// Auto-focus the confirm button when mounted
onMounted(() => {
    // Small delay to ensure the modal animation has started
    setTimeout(() => {
        confirmButtonRef.value?.focus()
    }, 100)
})
</script>

<style scoped>
.confirm-dialog {
    min-width: 350px;
    max-width: 450px;
    padding: 1.5rem;
}

.dialog-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.icon-wrapper {
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: #fef3c7;
    display: flex;
    align-items: center;
    justify-content: center;
}

.warning-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #f59e0b;
}

.dialog-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
}

.dialog-content {
    margin-bottom: 2rem;
}

.dialog-content p {
    margin: 0 0 0.5rem 0;
    color: #6b7280;
    line-height: 1.5;
}

.details {
    font-size: 0.875rem;
    color: #9ca3af;
    font-style: italic;
}

.dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-size: 0.875rem;
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

.btn-primary:hover {
    background-color: #2563eb;
}

.btn-danger {
    background-color: #ef4444;
    color: white;
}

.btn-danger:hover {
    background-color: #dc2626;
}

.btn-secondary.btn-danger {
    background-color: #fef2f2;
    color: #dc2626;
}

.btn-secondary.btn-danger:hover {
    background-color: #fee2e2;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    .dialog-header h3 {
        color: #f9fafb;
    }

    .dialog-content p {
        color: #d1d5db;
    }

    .details {
        color: #9ca3af;
    }

    .icon-wrapper {
        background-color: #451a03;
    }

    .warning-icon {
        color: #f59e0b;
    }

    .btn-secondary {
        background-color: #374151;
        color: #e5e7eb;
    }

    .btn-secondary:hover {
        background-color: #4b5563;
    }

    .btn-secondary.btn-danger {
        background-color: #450a0a;
        color: #fca5a5;
    }

    .btn-secondary.btn-danger:hover {
        background-color: #7f1d1d;
    }
}
</style>
