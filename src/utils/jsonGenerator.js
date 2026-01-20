/**
 * Generación de JSON de bundle a partir de los campos del formulario
 */

import { getFieldValue } from './fieldConfig'

// Campos que se ignoran si tienen valor "0" o vacío
const NULLABLE_ITEM_FIELDS = ['selected', 'special_price', 'icon_ngr', 'item_max_qty']
const NULLABLE_OPTION_FIELDS = ['is_additional']

/**
 * Genera el JSON completo del bundle
 * @returns {{ success: boolean, data?: object, error?: string }}
 */
export function generateBundleJSON(fields) {
  const result = { steps: [] }
  let stepNumber = 1

  for (const stepFields of fields) {
    const stepName = getFieldValue(stepFields, 'step')
    const subOptionsField = stepFields.find(f => f.index === 'sub_options')
    const subOptions = subOptionsField?.value ?? 0
    const options = subOptionsField?.options ?? []

    if (!options || options.length === 0) {
      return {
        success: false,
        error: `Faltan cargar preguntas al paso ${stepNumber}`
      }
    }

    const optionsResult = generateOptionsArray(options, stepNumber)
    if (!optionsResult.success) {
      return optionsResult
    }

    result.steps.push({
      step: stepName,
      step_number: stepNumber,
      sub_options: subOptions,
      options: optionsResult.data
    })

    stepNumber++
  }

  return { success: true, data: result }
}

/**
 * Genera el array de opciones para un paso
 */
function generateOptionsArray(options, stepNumber) {
  const optionsArray = []
  let optionNumber = 1

  for (const optionFields of options) {
    const optionObject = {
      code: `${stepNumber}-${optionNumber}`
    }

    for (const field of optionFields) {
      const { index, value } = field

      // Ignorar el campo items aquí, se procesa aparte
      if (index === 'items') continue

      // Procesar campo disable (convertir string a array)
      if (index === 'disable' && value) {
        optionObject[index] = value.trim().split(',').map(s => s.trim())
        continue
      }

      // Ignorar campos nulos
      if (NULLABLE_OPTION_FIELDS.includes(index) && (value === '0' || value === 0 || value === false)) {
        continue
      }

      // Procesar required_for
      if (index === 'required_for') {
        if (value && value !== '' && value !== 0 && value !== '0') {
          optionObject[index] = `${stepNumber}-${value}`
        }
        continue
      }

      // Agregar valor si existe
      if (value !== '' && value !== null && value !== undefined) {
        optionObject[index] = value
      }
    }

    // Procesar items
    const itemsField = optionFields.find(f => f.index === 'items')
    const items = itemsField?.value ?? []

    if (!items || items.length === 0) {
      return {
        success: false,
        error: `Faltan cargar items a la pregunta ${optionNumber} del paso ${stepNumber}`
      }
    }

    const itemsResult = generateItemsArray(items)
    if (!itemsResult.success) {
      return itemsResult
    }

    optionObject.items = itemsResult.data
    optionsArray.push(optionObject)
    optionNumber++
  }

  return { success: true, data: optionsArray }
}

/**
 * Genera el array de items para una opción
 */
function generateItemsArray(items) {
  const itemsArray = []

  for (const itemFields of items) {
    const itemObject = {}

    for (const field of itemFields) {
      const { index, value } = field

      // Ignorar campos nulos
      if (NULLABLE_ITEM_FIELDS.includes(index) && (value === '0' || value === 0 || value === false)) {
        continue
      }

      // Procesar campo disable (convertir string a array)
      if (index === 'disable' && value) {
        itemObject[index] = value.trim().split(',').map(s => s.trim())
        continue
      }

      // Agregar valor si existe
      if (value !== '' && value !== null && value !== undefined) {
        itemObject[index] = value
      }
    }

    itemsArray.push(itemObject)
  }

  return { success: true, data: itemsArray }
}

/**
 * Procesa un JSON importado y lo convierte a la estructura de campos
 */
export function processImportedJSON(jsonData, { createStepFields, createOptionFields, createItemFields }) {
  const fields = []

  if (!jsonData?.steps) {
    throw new Error('El JSON no tiene la estructura esperada')
  }

  for (const step of jsonData.steps) {
    const stepFields = createStepFields(step.step, step.sub_options, [])
    const subOptionsField = stepFields.find(f => f.index === 'sub_options')

    for (const option of step.options) {
      // Procesar disable array a string
      const disable = option.disable ? option.disable.join(',') : ''

      // Procesar required_for
      let requiredFor = ''
      if (option.required_for) {
        const parts = option.required_for.split('-')
        requiredFor = parts[1] ?? ''
      }

      const optionFields = createOptionFields({
        title: option.title || '',
        subtitle: option.subtitle || '',
        type: option.type || '',
        minQty: option.min_qty?.toString() || '0',
        maxQty: option.max_qty?.toString() || '1',
        disable,
        basePrice: option.base_price || false,
        isAdditional: option.is_additional || false,
        requiredFor,
        items: []
      })

      const itemsField = optionFields.find(f => f.index === 'items')

      for (const item of option.items || []) {
        const itemDisable = item.disable ? item.disable.join(',') : ''

        const itemFields = createItemFields({
          sku: item.sku || '',
          name: item.name || '',
          disable: itemDisable,
          selected: item.selected || false,
          price: item.price?.toString() || '0',
          specialPrice: item.special_price?.toString() || '0',
          title: item.title || '',
          iconNgr: item.icon_ngr || false,
          itemMaxQty: item.item_max_qty?.toString() || '0'
        })

        itemsField.value.push(itemFields)
      }

      subOptionsField.options.push(optionFields)
    }

    fields.push(stepFields)
  }

  return fields
}
