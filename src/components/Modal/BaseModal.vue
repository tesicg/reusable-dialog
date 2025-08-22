<template>
    <div class="modal-wrapper" @click="onBackdropClick">
        <div class="modal-backdrop"></div>
        <div class="base-modal" @click.stop>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Props {
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean
}

interface Emits {
    close: []
    cancel: []
}

const props = withDefaults(defineProps<Props>(), {
    closeOnBackdrop: true,
    closeOnEscape: true,
})

const emit = defineEmits<Emits>()

function onBackdropClick(): void {
    if (props.closeOnBackdrop) {
        emit('cancel')
    }
}

function onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && props.closeOnEscape) {
        emit('cancel')
    }
}

onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
}

.base-modal {
    position: relative;
    background: var(--modal-bg, #fff);
    color: var(--modal-text, #333);
    border-radius: 12px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    z-index: 1001;
    animation: slideIn 0.2s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .base-modal {
        --modal-bg: #2c2c2c;
        --modal-text: #eee;
    }
}
</style>
