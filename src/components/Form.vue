<template>
    <div>
    <form @submit.prevent="generateJSON">
      <div v-for="(field, steps) in fields" :key="steps">
        <h1>Paso {{ steps+1 }} <button @click.prevent="deleteField(fields,steps)" class="btn btn-danger">-</button></h1>
        <div v-for="(stepfield, step) in field" :key="step">
          <div class="mb-3">
            <label :hidden="stepfield.hidden" class="form-label">{{ stepfield.label }}</label>
            <input class="form-control" :type=stepfield.type v-model="stepfield.value" :hidden="stepfield.hidden">
          </div>
          <h3>Preguntas <button @click.prevent="addOption(stepfield)" :hidden="!init" class="btn btn-secondary">+</button></h3>
          <div v-for="(optionsFields, options) in stepfield.options" :key="options">
            <h3>Pregunta {{ options+1 }}<button @click.prevent="deleteField(stepfield.options,options)" class="btn btn-danger">-</button></h3>
            <div v-for="(optionfield, option) in optionsFields" :key="option">
              <div class="mb-3">
                <label :hidden="optionfield.hidden" class="form-label">{{ optionfield.label }}</label>
                <input  class="form-control" v-if="optionfield.type != 'item_array' && optionfield.type != 'select'" :type=optionfield.type v-model="optionfield.value" :hidden="optionfield.hidden"/>
                <select class="form-select" v-if="optionfield.type == 'select'" v-model="optionfield.value" :hidden="optionfield.hidden">
                  <option v-for="(selectOptions) in optionfield.options" :value="selectOptions.index">{{selectOptions.label}}</option>
                </select>
              </div>
              <div v-if="optionfield.type == 'item_array'">
                <h3>Productos <button v-if="optionfield.type == 'item_array'" @click.prevent="addItem(optionfield)" class="btn btn-secondary">+</button></h3>
                <div v-for="(itemsField, items) in optionfield.value" :key="items">
                  <h4>Producto {{ items +1 }}<button @click.prevent="deleteField(optionfield.value,items)" class="btn btn-danger">-</button></h4>
                  <div v-for="(itemField, item) in itemsField" :key="item">
                    <div class="mb-3">
                      <label :hidden="itemField.hidden" class="form-label">{{ itemField.label }}</label>
                      <input class="form-control" v-if="itemField.type == 'text'" :type=itemField.type v-model="itemField.value" :hidden="itemField.hidden"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click.prevent="newBundle" :hidden="init" class="btn btn-primary create">Crear JSON Bundle</button>
      <button @click.prevent="newStep" :hidden="!init" class="btn btn-secondary">Agregar Paso</button>
      <button type="submit" :hidden="!init" class="btn btn-success">Generar JSON</button>
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
                              { label: 'Tipo', value: '', type: 'select', index: 'type', options: [{label: 'Drop down', index: 'drop_down'},{label:'Checkbox', index:'checkbox'},{label:'Multiple', index:'multiple'}] },              
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
    },
    deleteField(field,index) {
      console.log(field);
      field.splice(index,1);
    }
  }
};
</script>

<style scoped>

</style>
