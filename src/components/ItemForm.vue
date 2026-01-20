<script setup>
import FormField from './FormField.vue'

defineProps({
  item: {
    type: Array,
    required: true
  },
  itemIndex: {
    type: Number,
    required: true
  },
  showInfo: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete'])
</script>

<template>
  <div class="item-card">
    <div class="header-with-actions">
      <h4>Producto {{ itemIndex + 1 }}</h4>
      <button
        type="button"
        class="btn btn-danger btn-sm"
        @click="emit('delete')"
      >
        -
      </button>
    </div>

    <FormField
      v-for="(field, index) in item"
      :key="index"
      :field="field"
      :show-info="showInfo"
      @update:value="value => field.value = value"
    />
  </div>
</template>
