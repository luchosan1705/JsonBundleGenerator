<template>
    <div>
    <form @submit.prevent="generateJSON">
      <button @click.prevent="newBundle" :hidden="init" class="btn btn-primary create">Crear JSON Bundle</button>
      <div class="fixed_button">
        <button type="submit" :hidden="!init" class="btn btn-success">Generar JSON</button>
        <button @click.prevent="newStep" :hidden="!init" class="btn btn-secondary">Agregar Paso</button>
        <br>
        <br>
        <p v-if="fields.length>0" style="font-weight: bold;">Pasos</p>
        <div class="btn-group" role="group" aria-label="Basic example">
          <button v-for="(number) in fields.length" type="button" @click.prevent="scroll(number)" class="btn btn-primary">{{ number }}</button>
        </div>
        <br>
        <br>
        <span class="alert alert-danger col-2" role="alert" :hidden="!errorMsg">
        {{ errorMsg }}
        </span>
      </div>
      <div v-for="(field, steps) in fields" :key="steps" class="offset-md-3 col-md-4 card text-bg-primarycard text-bg-light mb-3 card-body" :id="steps+1">
        <h1>Paso {{ steps+1 }} <button @click.prevent="deleteField(fields,steps,true)" class="btn btn-danger">-</button></h1>
        <div v-for="(stepfield, step) in field" :key="step">
          <div class="mb-3">
            <label :hidden="stepfield.hidden" class="form-label">{{ stepfield.label }}</label>
            <input class="form-control" :type=stepfield.type v-model="stepfield.value" :hidden="stepfield.hidden" :required="stepfield.required">
          </div>
          <h3><button @click.prevent="addOption(stepfield)" :hidden="!init" class="btn btn-secondary">Agregar pregunta</button></h3>
          <div v-for="(optionsFields, options) in stepfield.options" :key="options" class="">
            <h3>Pregunta {{ options+1 }}<button @click.prevent="deleteField(stepfield.options,options)" class="btn btn-danger">-</button></h3>
            <div v-for="(optionfield, option) in optionsFields" :key="option">
              <div class="mb-3">
                <label :hidden="optionfield.hidden" class="form-label">{{ optionfield.label }}</label>
                <input  class="form-control" v-if="optionfield.type != 'item_array' && optionfield.type != 'select'" :type=optionfield.type v-model="optionfield.value" :hidden="optionfield.hidden" :required="optionfield.required"/>
                <select class="form-select" v-if="optionfield.type == 'select'" v-model="optionfield.value" :hidden="optionfield.hidden" :required="optionfield.required">
                  <option v-for="(selectOptions) in optionfield.options" :value="selectOptions.index">{{selectOptions.label}}</option>
                </select>
              </div>
              <div v-if="optionfield.type == 'item_array'" id="option">
                <h3><button v-if="optionfield.type == 'item_array'" @click.prevent="addItem(optionfield)" class="btn btn-secondary">Agregar producto</button></h3>
                <div v-for="(itemsField, items) in optionfield.value" :key="items">
                  <h4>Producto {{ items +1 }}<button @click.prevent="deleteField(optionfield.value,items)" class="btn btn-danger">-</button></h4>
                  <div v-for="(itemField, item) in itemsField" :key="item">
                    <div class="mb-3">
                      <label :hidden="itemField.hidden" class="form-label">{{ itemField.label }}</label>
                      <input class="form-control" v-if="itemField.type == 'text'" :type=itemField.type v-model="itemField.value" :hidden="itemField.hidden" :required="itemField.required"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import FileSaver from 'file-saver';
export default {
  data() {
          return {
            init: false,
            errorMsg: '',
            fields: []
          };
  },
  methods: {
    newBundle() {
      this.newStep();
      this.init = true;
    },
    generateJSON() {
      this.errorMsg = '';
      let step_number = 1;
      let objectJSON = {"steps" : []};
      this.fields.forEach(element => {
        let optionsArray = this.generateOptionsArray(element[0].options,step_number);
        if (optionsArray.length == 0){
          return;
        }
        objectJSON.steps.push({step: element[0].value, step_number: step_number, options: optionsArray});      
        step_number++;
      });
      if (this.errorMsg) return;
      const blob = new Blob([JSON.stringify(objectJSON,null,'\t')], { type: 'application/json' });
      const filename = 'bundle.json';
      FileSaver.saveAs(blob, filename);
    },
    generateOptionsArray(array,step_number){
      let optionsArray = [];
      let optionNumber = 1;
      if (array.length == 0){
        this.errorMsg = `Faltan cargar preguntas al paso ${step_number}`;
        return;
      }
      array.forEach( options => {
        let optionObject = {};
        optionObject["code"] = step_number.toString().concat("-"+optionNumber.toString());
        options.forEach ( option => {
          if (option.value){
            optionObject[option.index] = option.value;
          }
          if (option.index == 'items'){
            let itemsArray = this.generateItemsArray(option.value,step_number,optionNumber);
            if (itemsArray.length == 0){
              return;
            }
            optionObject[option.index] = itemsArray;
          }
        })
        optionsArray.push(optionObject);
        optionNumber++;
      });
      return optionsArray;
    },
    generateItemsArray(array,step_number,optionNumber){
      let itemsArray = [];
      if (array.length == 0){
        this.errorMsg = `Faltan cargar items a la pregunta ${optionNumber} del paso ${step_number}`;
        return;
      }
      array.forEach( items => {
        let itemObject = {};
        items.forEach ( item => {
          if (item.value){
            itemObject[item.index] = item.value;
          }
        })
        itemsArray.push(itemObject);
      });
      return itemsArray;      
    },
    newStep() {
      this.fields.push([              
        { label: 'Nombre', value: '', type: 'text', options: [], index: 'step', required: true }
      ]);
    },
    addOption(stepfield) {
      this.errorMsg = '';
      stepfield.options.push([{ label: 'Titulo', value: '', type: 'text', index: 'title', required:true },
                              { label: 'Subtitulo', value: '', type: 'text', index: 'subtitle' },              
                              { label: 'Tipo', value: '', type: 'select', index: 'type', options: [{label: 'Drop down', index: 'drop_down'},{label:'Checkbox', index:'checkbox'},{label:'Multiple', index:'multiple'}], required:true },              
                              { label: 'Cantidad minima', value: '0', type: 'number', index: 'min_qty', required:true },             
                              { label: 'Cantidad maxima', value: '1', type: 'number', index: 'max_qty', required:true },              
                              { label: '', value: [] , type: 'item_array', index: 'items' }]);              
    },
    addItem(option) {
      this.errorMsg = '';
      option.value.push([
        { label: 'Sku', value: '', type: 'text', index: 'sku', required:true },              
        { label: 'Nombre', value: '', type: 'text', index: 'name' },              
        { label: 'Precio extra', value: '0', type: 'text', index: 'price', required:true },             
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
    deleteField(field,index,isStep = false) {
      if (isStep && this.fields.length == 1 ) {
        return;
      }
      field.splice(index,1);
    },
    scroll(number) {
      document.getElementById(number).scrollIntoView();
    }
  }
};
</script>

<style scoped>

</style>
