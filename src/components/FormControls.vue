<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  init: {
    type: Boolean,
    required: true
  },
  stepsCount: {
    type: Number,
    required: true
  },
  errorMsg: {
    type: String,
    default: ''
  },
  successMsg: {
    type: String,
    default: ''
  },
  infoButtonText: {
    type: String,
    default: 'Mostrar informacion'
  },
  hasSavedData: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'new-bundle',
  'load',
  'file-select',
  'import-file',
  'generate',
  'add-step',
  'toggle-info',
  'save',
  'reset',
  'scroll-to-step'
])

const selectedFileName = ref('')
const fileInputRef = ref(null)

const hasFile = computed(() => selectedFileName.value !== '')

function onFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    selectedFileName.value = file.name
    emit('file-select', file)
  }
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function clearFile() {
  selectedFileName.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  emit('file-select', null)
}
</script>

<template>
  <!-- Pantalla de inicio -->
  <div v-if="!init" class="start-screen">
    <div class="start-header">
      <h1 class="start-title">JSON Bundle Generator</h1>
      <p class="start-subtitle">Crea y edita bundles de productos en formato JSON</p>
    </div>

    <div class="start-options">
      <div class="start-card">
        <h3>Nuevo Bundle</h3>
        <p>Comienza desde cero creando un nuevo bundle</p>
        <button type="button" class="btn btn-primary btn-lg" @click="emit('new-bundle')">
          Crear Bundle
        </button>
      </div>

      <div class="start-card" :class="{ 'card-disabled': !hasSavedData }">
        <h3>Cargar Guardado</h3>
        <p>{{ hasSavedData ? 'Recupera el bundle guardado en el navegador' : 'No hay ningun bundle guardado' }}</p>
        <button
          type="button"
          class="btn btn-success btn-lg"
          :disabled="!hasSavedData"
          @click="emit('load')"
        >
          Cargar del Navegador
        </button>
      </div>

      <div class="start-card">
        <h3>Importar Archivo</h3>
        <p>Carga un archivo JSON existente</p>

        <input
          ref="fileInputRef"
          type="file"
          accept=".json"
          class="file-input-hidden"
          @change="onFileChange"
        />

        <div class="file-selector">
          <button type="button" class="btn btn-secondary" @click="triggerFileInput">
            Seleccionar archivo
          </button>

          <div v-if="hasFile" class="file-selected">
            <span class="file-name">{{ selectedFileName }}</span>
            <button type="button" class="btn-clear" @click="clearFile" title="Quitar archivo">
              &times;
            </button>
          </div>
          <p v-else class="file-hint">Ningun archivo seleccionado</p>
        </div>

        <button
          type="button"
          class="btn btn-primary btn-lg"
          :disabled="!hasFile"
          @click="emit('import-file')"
        >
          Importar JSON
        </button>
      </div>
    </div>
  </div>

  <!-- Controles fijos (cuando hay bundle activo) -->
  <div v-else class="fixed-controls">
    <div class="controls-section controls-main">
      <button type="button" class="btn btn-success" @click="emit('generate')">
        Generar JSON
      </button>

      <button type="button" class="btn btn-secondary" @click="emit('add-step')">
        + Agregar Paso
      </button>
    </div>

    <!-- Navegación por pasos -->
    <div v-if="stepsCount > 0" class="controls-section">
      <p class="step-nav-label">Ir a paso:</p>
      <div class="step-nav">
        <button
          v-for="n in stepsCount"
          :key="n"
          type="button"
          class="btn btn-primary btn-sm"
          @click="emit('scroll-to-step', n)"
        >
          {{ n }}
        </button>
      </div>
    </div>

    <div class="controls-section">
      <button type="button" class="btn btn-info btn-sm" @click="emit('toggle-info')">
        {{ infoButtonText }}
      </button>
    </div>

    <div class="controls-section controls-actions">
      <button type="button" class="btn btn-warning btn-sm" @click="emit('save')">
        Guardar
      </button>
      <button type="button" class="btn btn-outline btn-sm" @click="emit('reset')">
        Resetear
      </button>
    </div>

    <!-- Mensajes -->
    <div v-if="errorMsg" class="alert alert-danger">
      {{ errorMsg }}
    </div>

    <div v-if="successMsg" class="alert alert-success">
      {{ successMsg }}
    </div>
  </div>
</template>

<style scoped>
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 80vh;
}

.start-header {
  text-align: center;
  margin-bottom: 3rem;
}

.start-title {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.start-subtitle {
  color: var(--color-text-muted);
  font-size: 1.1rem;
}

.start-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 900px;
}

.start-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: box-shadow 0.2s, transform 0.2s;
}

.start-card:hover:not(.card-disabled) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.start-card.card-disabled {
  opacity: 0.6;
  background: var(--color-light);
}

.start-card h3 {
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.start-card p {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  width: 100%;
}

.file-input-hidden {
  display: none;
}

.file-selector {
  margin-bottom: 1rem;
}

.file-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: #e8f5e9;
  border-radius: 6px;
  border: 1px solid #a5d6a7;
}

.file-name {
  font-size: 0.875rem;
  color: #2e7d32;
  font-weight: 500;
  word-break: break-all;
}

.btn-clear {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #666;
  cursor: pointer;
  padding: 0 0.25rem;
  line-height: 1;
}

.btn-clear:hover {
  color: var(--color-danger);
}

.file-hint {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
  margin-bottom: 0;
}

/* Fixed controls improvements */
.controls-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.controls-section:last-of-type {
  border-bottom: none;
}

.controls-main {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.controls-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-outline:hover {
  background: var(--color-light);
}

@media (max-width: 768px) {
  .start-screen {
    padding: 1rem;
  }

  .start-title {
    font-size: 1.75rem;
  }

  .start-options {
    grid-template-columns: 1fr;
  }
}
</style>
