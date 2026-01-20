<script setup>
import FormField from './FormField.vue'
import ItemForm from './ItemForm.vue'

const props = defineProps({
  option: {
    type: Array,
    required: true
  },
  optionIndex: {
    type: Number,
    required: true
  },
  showInfo: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete', 'add-item', 'delete-item'])
</script>

<template>
  <div class="option-card">
    <div class="header-with-actions">
      <h3>Pregunta {{ optionIndex + 1 }}</h3>
      <button
        type="button"
        class="btn btn-danger btn-sm"
        @click="emit('delete')"
      >
        -
      </button>
    </div>

    <template v-for="(field, index) in option" :key="index">
      <!-- Campos normales -->
      <FormField
        v-if="field.type !== 'item_array'"
        :field="field"
        :show-info="showInfo"
        @update:value="value => field.value = value"
      />

      <!-- Items array -->
      <div v-else>
        <button
          type="button"
          class="btn btn-secondary mb-3"
          @click="emit('add-item')"
        >
          Agregar producto
        </button>

        <ItemForm
          v-for="(item, itemIdx) in field.value"
          :key="itemIdx"
          :item="item"
          :item-index="itemIdx"
          :show-info="showInfo"
          @delete="emit('delete-item', itemIdx)"
        />
      </div>
    </template>
  </div>
</template>
