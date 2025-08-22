<template>
    <Teleport to="body">
        <div v-for="modal in modals" :key="modal.id">
            <BaseModal @cancel="onCancel(modal.id)">
                <component
                    :is="modal.component"
                    v-bind="modal.props"
                    @close="onCancel(modal.id)"
                    @submit="(payload: any) => onSubmit(modal.id, payload)"
                    @cancel="onCancel(modal.id)"
                />
            </BaseModal>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { modalService } from './ModalService.ts'
import BaseModal from './BaseModal.vue'

const modals = computed(() => modalService.getModals())

function onSubmit(id: number, payload: any = null): void {
    modalService.close(id, payload)
}

function onCancel(id: number): void {
    modalService.cancel(id, 'cancelled')
}
</script>
