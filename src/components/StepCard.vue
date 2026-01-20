<script setup>
import FormField from './FormField.vue'
import OptionForm from './OptionForm.vue'

const props = defineProps({
  step: {
    type: Array,
    required: true
  },
  stepIndex: {
    type: Number,
    required: true
  },
  showInfo: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete', 'add-option', 'delete-option', 'add-item', 'delete-item'])

function getOptionsField() {
  return props.step.find(f => f.index === 'sub_options')
}
</script>

<template>
  <div :id="`step-${stepIndex + 1}`" class="card card-light">
    <div class="card-body">
      <div class="header-with-actions">
        <h1>Paso {{ stepIndex + 1 }}</h1>
        <button
          type="button"
          class="btn btn-danger btn-sm"
          @click="emit('delete')"
        >
          -
        </button>
      </div>

      <!-- Campos del paso (nombre y sub_options) -->
      <template v-for="(field, index) in step" :key="index">
        <FormField
          v-if="field.index !== 'sub_options'"
          :field="field"
          :show-info="showInfo"
          @update:value="value => field.value = value"
        />

        <!-- Campo sub_options con número -->
        <FormField
          v-else
          :field="{ ...field, type: 'number', options: undefined }"
          :show-info="showInfo"
          @update:value="value => field.value = value"
        />
      </template>

      <!-- Botón agregar pregunta -->
      <div class="mb-3">
        <button
          type="button"
          class="btn btn-secondary"
          @click="emit('add-option')"
        >
          Agregar pregunta
        </button>
      </div>

      <!-- Lista de opciones/preguntas -->
      <OptionForm
        v-for="(option, optIdx) in getOptionsField()?.options || []"
        :key="optIdx"
        :option="option"
        :option-index="optIdx"
        :show-info="showInfo"
        @delete="emit('delete-option', optIdx)"
        @add-item="emit('add-item', optIdx)"
        @delete-item="itemIdx => emit('delete-item', optIdx, itemIdx)"
      />
    </div>
  </div>
</template>
