<script setup>
defineProps({
  field: {
    type: Object,
    required: true
  },
  showInfo: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value'])

function onInput(event) {
  emit('update:value', event.target.value)
}

function onCheckboxChange(event) {
  emit('update:value', event.target.checked)
}
</script>

<template>
  <div v-if="field.type !== 'item_array'" class="form-group">
    <label v-if="field.label" class="form-label">
      {{ field.label }}
    </label>

    <!-- Input text/number -->
    <input
      v-if="field.type === 'text' || field.type === 'number'"
      class="form-control"
      :type="field.type"
      :value="field.value"
      :required="field.required"
      @input="onInput"
    />

    <!-- Select -->
    <select
      v-else-if="field.type === 'select'"
      class="form-select"
      :value="field.value"
      :required="field.required"
      @change="onInput"
    >
      <option value="">Seleccionar...</option>
      <option
        v-for="option in field.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Checkbox/Switch -->
    <div v-else-if="field.type === 'checkbox'" class="form-switch">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        :checked="field.value"
        @change="onCheckboxChange"
      />
    </div>

    <!-- Info text -->
    <p v-if="showInfo && field.info" class="info-text">
      {{ field.info }}
    </p>
  </div>
</template>
