<script setup>
import { useBundleForm } from '@/composables/useBundleForm'
import { getOptionsField, getItemsField } from '@/utils/fieldConfig'
import FormControls from './FormControls.vue'
import StepCard from './StepCard.vue'

const {
  fields,
  init,
  errorMsg,
  successMsg,
  showInfo,
  stepsCount,
  infoButtonText,
  checkHasSavedData,
  newBundle,
  newStep,
  addOption,
  addItem,
  deleteStep,
  generateJSON,
  save,
  load,
  handleFileSelect,
  importFromFile,
  scrollToStep,
  reset,
  toggleInfo
} = useBundleForm()

function handleAddOption(stepIndex) {
  const step = fields.value[stepIndex]
  const optionsField = getOptionsField(step)
  addOption(optionsField)
}

function handleAddItem(stepIndex, optionIndex) {
  const step = fields.value[stepIndex]
  const optionsField = getOptionsField(step)
  const option = optionsField.options[optionIndex]
  const itemsField = getItemsField(option)
  addItem(itemsField)
}

function handleDeleteOption(stepIndex, optionIndex) {
  const step = fields.value[stepIndex]
  const optionsField = getOptionsField(step)
  optionsField.options.splice(optionIndex, 1)
}

function handleDeleteItem(stepIndex, optionIndex, itemIndex) {
  const step = fields.value[stepIndex]
  const optionsField = getOptionsField(step)
  const option = optionsField.options[optionIndex]
  const itemsField = getItemsField(option)
  itemsField.value.splice(itemIndex, 1)
}

function onSubmit() {
  generateJSON()
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <FormControls
      :init="init"
      :steps-count="stepsCount"
      :error-msg="errorMsg"
      :success-msg="successMsg"
      :info-button-text="infoButtonText"
      :has-saved-data="checkHasSavedData()"
      @new-bundle="newBundle"
      @load="load"
      @file-select="handleFileSelect"
      @import-file="importFromFile"
      @generate="generateJSON"
      @add-step="newStep"
      @toggle-info="toggleInfo"
      @save="save"
      @reset="reset"
      @scroll-to-step="scrollToStep"
    />

    <div v-if="init" class="steps-container">
      <StepCard
        v-for="(step, stepIdx) in fields"
        :key="stepIdx"
        :step="step"
        :step-index="stepIdx"
        :show-info="showInfo"
        @delete="deleteStep(stepIdx)"
        @add-option="handleAddOption(stepIdx)"
        @delete-option="optIdx => handleDeleteOption(stepIdx, optIdx)"
        @add-item="optIdx => handleAddItem(stepIdx, optIdx)"
        @delete-item="(optIdx, itemIdx) => handleDeleteItem(stepIdx, optIdx, itemIdx)"
      />
    </div>
  </form>
</template>
