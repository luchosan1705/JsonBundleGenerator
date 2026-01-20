import { ref, computed } from 'vue'
import { createStepFields, createOptionFields, createItemFields, getOptionsField, getItemsField } from '@/utils/fieldConfig'
import { saveToStorage, loadFromStorage, readFileAsJSON, downloadAsJSON, hasStoredData } from '@/utils/storage'
import { generateBundleJSON, processImportedJSON } from '@/utils/jsonGenerator'

export function useBundleForm() {
  // Estado
  const fields = ref([])
  const init = ref(false)
  const errorMsg = ref('')
  const successMsg = ref('')
  const showInfo = ref(false)
  const selectedFile = ref(null)

  // Función para verificar si hay datos guardados (se llama en tiempo real)
  function checkHasSavedData() {
    return hasStoredData()
  }

  // Computed
  const stepsCount = computed(() => fields.value.length)
  const infoButtonText = computed(() => showInfo.value ? 'Ocultar informacion' : 'Mostrar informacion')

  // Mensajes temporales
  function showSuccess(msg, duration = 3000) {
    successMsg.value = msg
    setTimeout(() => {
      successMsg.value = ''
    }, duration)
  }

  function showError(msg, duration = 3000) {
    errorMsg.value = msg
    if (duration > 0) {
      setTimeout(() => {
        errorMsg.value = ''
      }, duration)
    }
  }

  function clearMessages() {
    errorMsg.value = ''
    successMsg.value = ''
  }

  // Acciones principales
  function newBundle() {
    newStep()
    init.value = true
    clearMessages()
  }

  function newStep(name = '', subOptions = 0, options = []) {
    const stepFields = createStepFields(name, subOptions, options)
    fields.value.push(stepFields)
    return getOptionsField(stepFields)
  }

  function addOption(stepOptionsField, params = {}) {
    clearMessages()
    const optionFields = createOptionFields(params)
    stepOptionsField.options.push(optionFields)
    return getItemsField(optionFields)
  }

  function addItem(optionItemsField, params = {}) {
    clearMessages()
    const itemFields = createItemFields(params)
    optionItemsField.value.push(itemFields)
  }

  function deleteField(array, index, isStep = false) {
    if (isStep && fields.value.length === 1) {
      return // No permitir eliminar el último paso
    }
    array.splice(index, 1)
  }

  function deleteStep(index) {
    deleteField(fields.value, index, true)
  }

  function deleteOption(stepIndex, optionIndex) {
    const stepFields = fields.value[stepIndex]
    const optionsField = getOptionsField(stepFields)
    deleteField(optionsField.options, optionIndex)
  }

  function deleteItem(stepIndex, optionIndex, itemIndex) {
    const stepFields = fields.value[stepIndex]
    const optionsField = getOptionsField(stepFields)
    const optionFields = optionsField.options[optionIndex]
    const itemsField = getItemsField(optionFields)
    deleteField(itemsField.value, itemIndex)
  }

  // Generar JSON
  function generateJSON() {
    clearMessages()
    const result = generateBundleJSON(fields.value)

    if (!result.success) {
      errorMsg.value = result.error
      return
    }

    downloadAsJSON(result.data, 'bundle.json')
  }

  // Persistencia
  function save() {
    const result = saveToStorage(fields.value)
    if (result.success) {
      showSuccess('Se guardo el json en el navegador.')
    } else {
      showError(result.error)
    }
  }

  function load() {
    clearMessages()
    const result = loadFromStorage()

    if (!result.success) {
      errorMsg.value = result.error
      return
    }

    fields.value = result.data
    init.value = true
  }

  // Importar archivo
  function handleFileSelect(file) {
    selectedFile.value = file
  }

  async function importFromFile() {
    if (!selectedFile.value) {
      showError('Por favor elija un archivo JSON.')
      return
    }

    try {
      const jsonData = await readFileAsJSON(selectedFile.value)
      const importedFields = processImportedJSON(jsonData, {
        createStepFields,
        createOptionFields,
        createItemFields
      })

      fields.value = importedFields
      init.value = true
      clearMessages()
    } catch (error) {
      showError(error.message || 'Error al importar el archivo')
    }
  }

  // Navegación
  function scrollToStep(stepNumber) {
    const element = document.getElementById(`step-${stepNumber}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Reset
  function reset() {
    init.value = false
    fields.value = []
    showInfo.value = false
    clearMessages()
    selectedFile.value = null
  }

  // Toggle info
  function toggleInfo() {
    showInfo.value = !showInfo.value
  }

  return {
    // Estado
    fields,
    init,
    errorMsg,
    successMsg,
    showInfo,
    selectedFile,
    checkHasSavedData,

    // Computed
    stepsCount,
    infoButtonText,

    // Acciones
    newBundle,
    newStep,
    addOption,
    addItem,
    deleteStep,
    deleteOption,
    deleteItem,
    generateJSON,
    save,
    load,
    handleFileSelect,
    importFromFile,
    scrollToStep,
    reset,
    toggleInfo,
    clearMessages
  }
}
