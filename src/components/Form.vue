<template>
    <div>
    <form @submit.prevent="onSubmit">
      <div v-for="(field, steps) in fields" :key="steps">
        <h1>Paso {{ steps+1 }} </h1>
        <div v-for="(stepfield, step) in field" :key="step">
          <label :hidden="stepfield.hidden">{{ stepfield.label }}</label>
          <input :type=stepfield.type v-model="stepfield.value" :hidden="stepfield.hidden"/>
          <button @click.prevent="addOption(stepfield)" :hidden="!init">Agregar pregunta</button>
          <div v-for="(optionsFields, options) in stepfield.options" :key="options">
            <h2>Pregunta {{ options+1 }}</h2>
            <div v-for="(optionfield, option) in optionsFields" :key="option">
              <label :hidden="optionfield.hidden">{{ optionfield.label }}</label>
              <input v-if="optionfield.type != 'item_array'" :type=optionfield.type v-model="optionfield.value" :hidden="optionfield.hidden"/>
              <button v-if="optionfield.type == 'item_array'" @click.prevent="addItem(optionfield)">Agregar item</button>
              <div v-if="optionfield.type == 'item_array'">
                <div v-for="(itemsField, items) in optionfield.value" :key="items">
                  <h3>Producto {{ items +1 }}</h3>
                  <div v-for="(itemField, item) in itemsField" :key="item">
                    <label :hidden="itemField.hidden">{{ itemField.label }}</label>
                    <input v-if="itemField.type == 'text'" :type=itemField.type v-model="itemField.value" :hidden="itemField.hidden"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click.prevent="newBundle" :hidden="init">Nuevo Bundle</button>
      <button @click.prevent="newStep" :hidden="!init">Agregar Paso</button>
      <button type="submit" :hidden="!init">Generar JSON</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
          return {
            init: false,
            fields: []
          };
  },
  methods: {
    newBundle() {
      this.fields = [[             
        { label: 'Nombre', value: '', type: 'text', options: [] }
      ]];
      this.init = true;
    },
    onSubmit() {
      console.log('Formulario enviado:', this.fields);
    },
    newStep() {
      this.fields.push([              
        { label: 'Nombre', value: '', type: 'text', options: [] }
      ]);
    },
    addOption(stepfield) {
      stepfield.options.push([{ label: 'Titulo', value: '', type: 'text' },
                              { label: 'Subtitulo', value: '', type: 'text' },              
                              { label: 'Tipo', value: '', type: 'text' },              
                              { label: 'Cantidad minima', value: '', type: 'number' },             
                              { label: 'Cantidad maxima', value: '', type: 'number' },              
                              { label: '', value: [] , type: 'item_array' }]);              
    },
    addItem(option) {
      option.value.push([
        { label: 'Sku', value: '', type: 'text' },              
        { label: 'Nombre', value: '', type: 'text' },              
        { label: 'Precio', value: '', type: 'text' },             
      ]);
    },
    addProduct() {
      for (var element in this.productFields){
        var field = Object.assign({}, this.productFields[element]);
        if (field.value) {
          field.value = '';
        }
        this.fields.push(field);
      };
    }
  }
};
</script>

<style scoped>

</style>
