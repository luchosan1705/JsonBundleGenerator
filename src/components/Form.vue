<template>
    <div>
    <form @submit.prevent="generateJSON">
      <button @click.prevent="newBundle" :hidden="init" class="btn btn-primary create">Crear JSON Bundle</button>
      <br>
      <br>
      <button @click.prevent="load" :hidden="init" class="btn btn-success create">Cargar JSON Bundle</button>
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
        <button @click.prevent="toogleInfo" :hidden="!init" class="btn btn-info">{{ btnInfoMsg }}</button>
        <br>
        <br>
        <button @click.prevent="save" :hidden="!init" class="btn btn-warning">Guardar</button>
        <button @click.prevent="reset" :hidden="!init" class="btn btn-warning">Resetear</button>
        <br>
        <br>
        <span class="alert alert-danger col-2" role="alert" :hidden="!errorMsg">
        {{ errorMsg }}
        </span>
        <span class="alert alert-success col-2" role="alert" :hidden="!successMsg">
        {{ successMsg }}
        </span>
      </div>
      <div class="row">

      </div>
      <div v-for="(field, steps) in fields" :key="steps" class="offset-md-3 col-md-4 card text-bg-primarycard text-bg-light mb-3 card-body" :id="steps+1">
        <h1>Paso {{ steps+1 }} <button @click.prevent="deleteField(fields,steps,true)" class="btn btn-danger">-</button></h1>
        <div v-for="(stepfield, step) in field" :key="step">
          <div class="mb-3">
            <label :hidden="stepfield.hidden" class="form-label">{{ stepfield.label }}</label>
            <input class="form-control" :type=stepfield.type v-model="stepfield.value" :hidden="stepfield.hidden" :required="stepfield.required">
            <p class="text-secondary" :hidden="!showInfo">{{ stepfield.info }}</p>
          </div>
          <h3 v-if="stepfield.index == 'sub_options'"><button @click.prevent="addOption(stepfield)" :hidden="!init" class="btn btn-secondary">Agregar pregunta</button></h3>
          <div v-for="(optionsFields, options) in stepfield.options" :key="options" class="">
            <h3>Pregunta {{ options+1 }}<button @click.prevent="deleteField(stepfield.options,options)" class="btn btn-danger">-</button></h3>
            <div v-for="(optionfield, option) in optionsFields" :key="option">
              <div class="mb-3">
                <label :hidden="optionfield.hidden" class="form-label">{{ optionfield.label }}</label>
                <input  class="form-control" v-if="optionfield.type != 'item_array' && optionfield.type != 'select'" :type=optionfield.type v-model="optionfield.value" :hidden="optionfield.hidden" :required="optionfield.required"/>
                <select class="form-select" v-if="optionfield.type == 'select'" v-model="optionfield.value" :hidden="optionfield.hidden" :required="optionfield.required">
                  <option v-for="(selectOptions) in optionfield.options" :value="selectOptions.index">{{selectOptions.label}}</option>
                </select>
                <p class="text-secondary" :hidden="!showInfo">{{ optionfield.info }}</p>
              </div>
              <div v-if="optionfield.type == 'item_array'" id="option">
                <h3><button v-if="optionfield.type == 'item_array'" @click.prevent="addItem(optionfield)" class="btn btn-secondary">Agregar producto</button></h3>
                <div v-for="(itemsField, items) in optionfield.value" :key="items">
                  <h4>Producto {{ items +1 }}<button @click.prevent="deleteField(optionfield.value,items)" class="btn btn-danger">-</button></h4>
                  <div v-for="(itemField, item) in itemsField" :key="item">
                    <div class="mb-3">
                      <label :hidden="itemField.hidden" class="form-label">{{ itemField.label }}</label>
                      <input class="form-control" v-if="itemField.type == 'text'" :type=itemField.type v-model="itemField.value" :hidden="itemField.hidden" :required="itemField.required"/>
                      <div class="form-switch">
                        <input class="form-check-input"  role="switch" type="checkbox" v-model="itemField.value" v-if="itemField.type == 'checkbox'" :hidden="itemField.hidden" :required="itemField.required">
                      </div>
                      <p class="text-secondary" :hidden="!showInfo">{{ itemField.info }}</p>
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
            fields: [],
            btnInfoMsg: 'Mostrar informacion',
            showInfo: false,
            successMsg: ''
          };
  },
  methods: {
    newBundle() {
      this.newStep();
      this.init = true;
      this.errorMsg = '';
      this.successMsg = '';
    },
    generateJSON() {
      this.errorMsg = '';
      let step_number = 1;
      let objectJSON = {"steps" : []};
      let fieldsCopy = [].concat(this.fields);
      fieldsCopy.forEach(element => {
        let optionsArray = this.generateOptionsArray(element[1].options,step_number);
        if (optionsArray && optionsArray.length == 0){
          return;
        }
        objectJSON.steps.push({step: element[0].value, step_number: step_number, sub_options: element[1].value,  options: optionsArray});      
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
          if (option.index == 'disable' && option.value){
            optionObject[option.index] = option.value.trim().split(",");
          } else if (option.value && option.index != 'items'){
            optionObject[option.index] = option.value;
          }
          if (option.index == 'items'){
            let itemsArray = this.generateItemsArray(option.value,step_number,optionNumber);
            if (!itemsArray || itemsArray.length == 0){
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
          if (item.index == 'selected' && item.value === "0"){
            item.value = null;
          }
          if (item.index == 'icon_ngr' && item.value === "0"){
            item.value = null;
          }
          if (item.index == 'disable' && item.value){
            itemObject[item.index] = item.value.trim().split(",");
          } else if (item.value){
            itemObject[item.index] = item.value;
          }
        })
        itemsArray.push(itemObject);
      });
      return itemsArray;      
    },
    newStep() {
      this.fields.push([              
        { label: 'Nombre', value: '', type: 'text', index: 'step', required: true, info: 'Nombre del paso, tal cual se carga aquí se va a mostrar en el front.' },
        { label: 'Cantidad de sub-opciones', value: '0', options: [], type: 'number', index: 'sub_options', info: 'Cantidad de sub-opciones que tiene el paso, por ej cuando tiene multiples pizzas. (0 que no tiene)' }                         
      ]);
    },
    addOption(stepfield) {
      this.errorMsg = '';
      stepfield.options.push([{ label: 'Titulo', value: '', type: 'text', index: 'title', required:true, info: 'Pregunta que se va a mostrar en el front' },
                              { label: 'Subtitulo', value: '', type: 'text', index: 'subtitle', info: 'Titulo que se muestra dentro del contenedor de items' },              
                              { label: 'Tipo', value: '', type: 'select', index: 'type', options: [{label: 'Drop down', index: 'drop_down'},{label:'Checkbox', index:'checkbox'},{label:'Multiple', index:'multiple'}], required:true,  info: 'Tipo de pregunta. Multiple: Es con selector de cantidades por item de la pregunta. Drop down: Permite elegir un item, seria como un radio button. Checkbox: Permite elegir multiples items (cantidad 1).'},              
                              { label: 'Cantidad minima', value: '0', type: 'number', index: 'min_qty', required:true, info: 'El minimo de qty que se debe seleccionar, 0 seria no requerido.' },             
                              { label: 'Cantidad maxima', value: '1', type: 'number', index: 'max_qty', required:true, info: 'El máximo de qty que hay para seleccionar.' },   
                              { label: 'Skus deshabilitantes', value: '', type: 'text', index: 'disable', info: 'Ingresar sku separados por , que indicaran que si alguno esta seleccionado oculta esta pregunta' },                         
                              { label: '', value: [] , type: 'item_array', index: 'items' }]);              
    },
    addItem(option) {
      this.errorMsg = '';
      option.value.push([
        { label: 'Sku', value: '', type: 'text', index: 'sku', required:true, info: 'Sku del producto simple' },              
        { label: 'Nombre', value: '', type: 'text', index: 'name', info: 'Nombre que se va a mostrar en el bundle para el item. Si no se carga muestra el del producto simple.' },              
        { label: 'Skus deshabilitantes', value: '', type: 'text', index: 'disable', info: 'Ingresar sku separados por , que indicaran que si alguno esta seleccionado oculta este item' },                         
        { label: 'Preseleccionado', value: '0', type: 'checkbox', index: 'selected', info: 'Seleccionar si el sku de la opción viene preseleccionado.' },             
        { label: 'Precio extra', value: '0', type: 'text', index: 'price', info:'Si tiene un precio extra se carga, sino se pone en 0. Si no se coloca nada tomara el precio del producto simple como el extra.' },             
        { label: 'Titulo sub-item', value: '', type: 'text', index: 'title', info: 'Titulo de sub-item en caso de tener varios box para la pregunta, se agruparan por titulo por eso es importante que sea igual para el grupo' },             
        { label: 'Usar icono', value: '0', type: 'checkbox', index: 'icon_ngr', info: 'Seleccionar si la imagen que se va a mostrar va a ser el icono y no el thumbnail.' },                     
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
    },
    reset() {
      this.init = false;
      this.fields = [];
      this.showInfo = false;
      this.btnInfoMsg = 'Mostrar informacion';
      this.errorMsg = '';
    },
    toogleInfo() {
      this.showInfo = !this.showInfo;
      if (!this.showInfo) {
        this.btnInfoMsg = 'Mostrar informacion';
      } else {
        this.btnInfoMsg = 'Ocultar informacion';
      }
    },
    save() {
      console.log(this.fields);
      localStorage.fieldsState = JSON.stringify(this.fields);
      console.log(localStorage.fieldsState);
      this.successMsg = 'Se guardo el json en el navegador.';
      setTimeout(() => {
        this.successMsg = '';
      }, 3000);
    },
    load() {
      this.errorMsg = '';
      if (localStorage.fieldsState) {
        this.fields = JSON.parse(localStorage.fieldsState);
        this.init = true;
      } else {
        this.errorMsg = 'No hay ningun json guardado en el navegador';
      }
    }
  }
};
</script>

<style scoped>

</style>
