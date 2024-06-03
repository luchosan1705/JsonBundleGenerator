<template>
    <div>
    <form @submit.prevent="generateJSON">
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
import FileSaver from 'file-saver';
export default {
  data() {
          return {
            init: false,
            fields: []
          };
  },
  methods: {
    newBundle() {
      this.newStep();
      this.init = true;
    },
    generateJSON() {
      let step_number = 1;
      let objectJSON = {"steps" : []};
      this.fields.forEach(element => {
        let optionsArray = this.generateOptionsArray(element[0].options);
        objectJSON.steps.push({step: element[0].value, step_number: step_number, options: optionsArray});      
        step_number++;
      });

      const blob = new Blob([JSON.stringify(objectJSON)], { type: 'application/json' });
      const filename = 'bundle.json';
      FileSaver.saveAs(blob, filename);
    },
    generateOptionsArray(array){
      let optionsArray = [];
      array.forEach( options => {
        let optionObject = {};
        options.forEach ( option => {
          optionObject[option.index] = option.value;
          if (option.index == 'items'){
            optionObject[option.index] = this.generateItemsArray(option.value);
          }
        })
        optionsArray.push(optionObject);
      });
      return optionsArray;
    },
    generateItemsArray(array){
      let itemsArray = [];
      array.forEach( items => {
        let itemObject = {};
        items.forEach ( item => {
          itemObject[item.index] = item.value;
        })
        itemsArray.push(itemObject);
      });
      return itemsArray;      
    },
    newStep() {
      this.fields.push([              
        { label: 'Nombre', value: '', type: 'text', options: [], index: 'step' }
      ]);
    },
    addOption(stepfield) {
      stepfield.options.push([{ label: 'Titulo', value: '', type: 'text', index: 'title' },
                              { label: 'Subtitulo', value: '', type: 'text', index: 'subtitle' },              
                              { label: 'Tipo', value: '', type: 'text', index: 'type' },              
                              { label: 'Cantidad minima', value: '', type: 'number', index: 'min_qty' },             
                              { label: 'Cantidad maxima', value: '', type: 'number', index: 'max_qty' },              
                              { label: '', value: [] , type: 'item_array', index: 'items' }]);              
    },
    addItem(option) {
      option.value.push([
        { label: 'Sku', value: '', type: 'text', index: 'sku' },              
        { label: 'Nombre', value: '', type: 'text', index: 'name' },              
        { label: 'Precio', value: '', type: 'text', index: 'price' },             
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
