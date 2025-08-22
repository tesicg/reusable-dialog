<template>
    <div class="form-container">
        <div class="form-header">
            <h2>{{ isEdit ? 'Edit User' : 'Create New User' }}</h2>
            <button
                type="button"
                class="close-btn"
                @click="$emit('cancel')"
                aria-label="Close"
            >
                ×
            </button>
        </div>

        <form @submit.prevent="onSubmit" class="user-form">
            <div class="form-group">
                <label for="name">Name *</label>
                <input
                    id="name"
                    v-model="localUser.name"
                    type="text"
                    required
                    :class="{ error: errors.name }"
                    @blur="validateField('name')"
                />
                <span v-if="errors.name" class="error-message">{{
                    errors.name
                }}</span>
            </div>

            <div class="form-group">
                <label for="email">Email *</label>
                <input
                    id="email"
                    v-model="localUser.email"
                    type="email"
                    required
                    :class="{ error: errors.email }"
                    @blur="validateField('email')"
                />
                <span v-if="errors.email" class="error-message">{{
                    errors.email
                }}</span>
            </div>

            <div class="form-group">
                <label for="age">Age</label>
                <input
                    id="age"
                    v-model.number="localUser.age"
                    type="number"
                    min="0"
                    max="150"
                    :class="{ error: errors.age }"
                    @blur="validateField('age')"
                />
                <span v-if="errors.age" class="error-message">{{
                    errors.age
                }}</span>
            </div>

            <div class="form-actions">
                <button
                    type="button"
                    @click="$emit('cancel')"
                    class="btn btn-secondary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    :disabled="!isFormValid"
                    class="btn btn-primary"
                >
                    {{ isEdit ? 'Update' : 'Create' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { UserModel } from '../../models/UserModel.ts'

interface Props {
    user: UserModel
}

interface Emits {
    submit: [user: UserModel]
    cancel: []
    close: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Create a local copy to avoid mutating the prop
const localUser = reactive(new UserModel(props.user.toJSON()))

interface FormErrors {
    name: string
    email: string
    age: string
}

const errors = reactive<FormErrors>({
    name: '',
    email: '',
    age: '',
})

const isEdit = computed(() => {
    return props.user.name !== '' || props.user.email !== ''
})

const isFormValid = computed(() => {
    return (
        localUser.isValid() &&
        !Object.values(errors).some((error) => error !== '')
    )
})

function validateField(fieldName: keyof FormErrors): void {
    errors[fieldName] = ''

    switch (fieldName) {
        case 'name':
            if (!localUser.name.trim()) {
                errors.name = 'Name is required'
            }
            break
        case 'email':
            if (!localUser.email.trim()) {
                errors.email = 'Email is required'
            } else if (!localUser.isValidEmail(localUser.email)) {
                errors.email = 'Please enter a valid email address'
            }
            break
        case 'age':
            if (
                localUser.age !== null &&
                (localUser.age < 0 || localUser.age > 150)
            ) {
                errors.age = 'Age must be between 0 and 150'
            }
            break
    }
}

function validateForm(): void {
    validateField('name')
    validateField('email')
    validateField('age')
}

function onSubmit(): void {
    validateForm()

    if (!isFormValid.value) {
        return
    }

    emit('submit', localUser)
}

// Watch for changes and clear errors
watch(
    () => localUser.name,
    () => {
        if (errors.name) errors.name = ''
    }
)

watch(
    () => localUser.email,
    () => {
        if (errors.email) errors.email = ''
    }
)

watch(
    () => localUser.age,
    () => {
        if (errors.age) errors.age = ''
    }
)
</script>

<style scoped>
.form-container {
    padding: 10px;
    min-width: 400px;
    max-width: 500px;
}

.form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.form-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    color: #6b7280;
    border-radius: 4px;
}

.close-btn:hover {
    background-color: #f3f4f6;
    color: #374151;
}

.user-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
}

.form-group input {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error {
    border-color: #ef4444;
}

.error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
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

.btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
}

.btn-primary:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    .form-header {
        border-bottom-color: #374151;
    }

    .form-group label {
        color: #e5e7eb;
    }

    .form-group input {
        background-color: #374151;
        border-color: #4b5563;
        color: #e5e7eb;
    }

    .form-group input:focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
    }

    .close-btn:hover {
        background-color: #374151;
        color: #e5e7eb;
    }

    .form-actions {
        border-top-color: #374151;
    }

    .btn-secondary {
        background-color: #374151;
        color: #e5e7eb;
    }

    .btn-secondary:hover {
        background-color: #4b5563;
    }
}
</style>
