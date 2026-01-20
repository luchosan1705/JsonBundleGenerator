/**
 * Configuración de campos para el formulario de bundles
 */

export const TYPE_OPTIONS = [
  { label: 'Drop down', value: 'drop_down' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Multiple', value: 'multiple' }
]

/**
 * Crea los campos para un nuevo paso
 */
export function createStepFields(name = '', subOptions = 0, options = []) {
  return [
    {
      label: 'Nombre',
      value: name,
      type: 'text',
      index: 'step',
      required: true,
      info: 'Nombre del paso, tal cual se carga aquí se va a mostrar en el front.'
    },
    {
      label: 'Cantidad de sub-opciones',
      value: subOptions,
      options: options,
      type: 'number',
      index: 'sub_options',
      info: 'Cantidad de sub-opciones que tiene el paso, por ej cuando tiene multiples pizzas. (0 que no tiene)'
    }
  ]
}

/**
 * Crea los campos para una nueva pregunta/opción
 */
export function createOptionFields({
  title = '',
  subtitle = '',
  type = '',
  minQty = '0',
  maxQty = '1',
  disable = '',
  basePrice = false,
  isAdditional = false,
  requiredFor = '',
  items = []
} = {}) {
  return [
    {
      label: 'Titulo',
      value: title,
      type: 'text',
      index: 'title',
      required: true,
      info: 'Pregunta que se va a mostrar en el front'
    },
    {
      label: 'Subtitulo',
      value: subtitle,
      type: 'text',
      index: 'subtitle',
      info: 'Titulo que se muestra dentro del contenedor de items'
    },
    {
      label: 'Tipo',
      value: type,
      type: 'select',
      index: 'type',
      options: TYPE_OPTIONS,
      required: true,
      info: 'Tipo de pregunta. Multiple: Es con selector de cantidades por item de la pregunta. Drop down: Permite elegir un item, seria como un radio button. Checkbox: Permite elegir multiples items (cantidad 1).'
    },
    {
      label: 'Cantidad minima',
      value: minQty,
      type: 'number',
      index: 'min_qty',
      required: true,
      info: 'El minimo de qty que se debe seleccionar, 0 seria no requerido.'
    },
    {
      label: 'Cantidad maxima',
      value: maxQty,
      type: 'number',
      index: 'max_qty',
      required: true,
      info: 'El máximo de qty que hay para seleccionar.'
    },
    {
      label: 'Skus deshabilitantes',
      value: disable,
      type: 'text',
      index: 'disable',
      info: 'Ingresar sku separados por , que indicaran que si alguno esta seleccionado oculta esta pregunta'
    },
    {
      label: 'Precio base',
      value: basePrice,
      type: 'checkbox',
      index: 'base_price',
      info: 'Seleccionar si el precio que se seleccione en la opcion pertenece al precio base.'
    },
    {
      label: 'Es adicional?',
      value: isAdditional,
      type: 'checkbox',
      index: 'is_additional',
      info: 'Seleccionar si lo que se seleccione en la opcion es un adicional.'
    },
    {
      label: 'Requerido por la pregunta nro:',
      value: requiredFor,
      type: 'number',
      index: 'required_for',
      info: 'Se debe colocar el numero de pregunta que hacer requerida la opcion si esta seleccionada. Si se coloca 0 se ignora.'
    },
    {
      label: '',
      value: items,
      type: 'item_array',
      index: 'items'
    }
  ]
}

/**
 * Crea los campos para un nuevo item/producto
 */
export function createItemFields({
  sku = '',
  name = '',
  disable = '',
  selected = false,
  price = '0',
  specialPrice = '0',
  title = '',
  iconNgr = false,
  itemMaxQty = '0'
} = {}) {
  return [
    {
      label: 'Sku',
      value: sku,
      type: 'text',
      index: 'sku',
      required: true,
      info: 'Sku del producto simple'
    },
    {
      label: 'Nombre',
      value: name,
      type: 'text',
      index: 'name',
      info: 'Nombre que se va a mostrar en el bundle para el item. Si no se carga muestra el del producto simple.'
    },
    {
      label: 'Skus deshabilitantes',
      value: disable,
      type: 'text',
      index: 'disable',
      info: 'Ingresar sku separados por , que indicaran que si alguno esta seleccionado oculta este item'
    },
    {
      label: 'Preseleccionado',
      value: selected,
      type: 'checkbox',
      index: 'selected',
      info: 'Seleccionar si el sku de la opción viene preseleccionado.'
    },
    {
      label: 'Precio extra',
      value: price,
      type: 'text',
      index: 'price',
      info: 'Si tiene un precio extra se carga, sino se pone en 0. Si no se coloca nada tomara el precio del producto simple como el extra.'
    },
    {
      label: 'Precio especial',
      value: specialPrice,
      type: 'text',
      index: 'special_price',
      info: 'Si tiene un precio especial se carga, sino se pone en 0. Si no se coloca nada tomara el precio extra o del item.'
    },
    {
      label: 'Titulo sub-item',
      value: title,
      type: 'text',
      index: 'title',
      info: 'Titulo de sub-item en caso de tener varios box para la pregunta, se agruparan por titulo por eso es importante que sea igual para el grupo'
    },
    {
      label: 'Usar icono',
      value: iconNgr,
      type: 'checkbox',
      index: 'icon_ngr',
      info: 'Seleccionar si la imagen que se va a mostrar va a ser el icono y no el thumbnail.'
    },
    {
      label: 'Maxima cantidad',
      value: itemMaxQty,
      type: 'text',
      index: 'item_max_qty',
      info: 'Maxima cantidad que se puede seleccionar de este producto.'
    }
  ]
}

/**
 * Obtiene el valor de un campo por su índice
 */
export function getFieldValue(fields, index) {
  const field = fields.find(f => f.index === index)
  return field ? field.value : null
}

/**
 * Obtiene el campo de options de un paso
 */
export function getOptionsField(stepFields) {
  return stepFields.find(f => f.index === 'sub_options')
}

/**
 * Obtiene el campo de items de una opción
 */
export function getItemsField(optionFields) {
  return optionFields.find(f => f.index === 'items')
}
