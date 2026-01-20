/**
 * Utilidades de persistencia y lectura de archivos
 */

const STORAGE_KEY = 'fieldsState'

/**
 * Verifica si hay datos guardados en localStorage
 */
export function hasStoredData() {
  return localStorage.getItem(STORAGE_KEY) !== null
}

/**
 * Guarda los campos en localStorage
 */
export function saveToStorage(fields) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fields))
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Error al guardar en el navegador' }
  }
}

/**
 * Carga los campos desde localStorage
 */
export function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      return { success: false, error: 'No hay ningun json guardado en el navegador' }
    }
    return { success: true, data: JSON.parse(data) }
  } catch (error) {
    return { success: false, error: 'Error al cargar los datos guardados' }
  }
}

/**
 * Lee un archivo como JSON
 */
export function readFileAsJSON(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No se proporcionó un archivo'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result)
        resolve(jsonData)
      } catch (error) {
        reject(new Error('El archivo no es un JSON válido'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }

    reader.readAsText(file)
  })
}

/**
 * Descarga un objeto como archivo JSON
 */
export function downloadAsJSON(data, filename = 'bundle.json') {
  const blob = new Blob([JSON.stringify(data, null, '\t')], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
