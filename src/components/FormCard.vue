<template>
  <div :class="backgroundClass" id="app">
    <img v-if="!isFirstDialogOpen" :src="headerImage" alt="Imagen de descripción" height="250">
    <v-dialog v-for="(dialog, index) in dialogs" :key="index" v-model="dialog.open" persistent max-width="900">
      <v-card height="70vh" :class="{ 'fisrt-card': isFirstDialogOpen }">
        <v-icon v-if="index > 0" class="icon-back" @click="changeDialog(index, true)">mdi-arrow-left</v-icon>
        <CardTitle :title="dialog.title" :progress="progressValue" />
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <p v-html="dialog.content"></p>
                <img v-if="dialog.img" :src="dialog.img.url" :height="dialog.img.height" />
                <v-text-field variant="solo" v-model="dialog.response.numSelected" type="number"
                  v-if="dialog.requiresResponse && dialog.response.numSelected !== false"></v-text-field>
                <!--<v-btn v-if="dialog.skipAllowed" @click="changeDialog(index)">No aplica</v-btn>-->
              </v-col>
              <v-col :cols="columnSize" class="text-center" sm="columnSmSize" :class="columnClass">
                <p v-html="dialog.content2"></p>
                <img v-if="dialog.img2" :src="dialog.img2.url" :height="dialog.img2.height" />
                <!--<RadioGroupCard v-if="dialog.requiresResponse" :response="dialog.response.radioGroup" />-->
                <v-radio-group v-if="dialog.requiresResponse" v-model="dialog.response.radioGroup">
                  <v-row class="justify-center">
                    <v-col cols="2" v-for="(item, i) in dialog.response.items" :key="i">
                      <v-card @click="dialog.response.radioGroup = item.id"
                        :class="{ 'selected-image': dialog.response.radioGroup === item.id }">
                        <v-radio hide-details :label="item.label" :value="item.id"></v-radio>
                        <v-img v-if="item.image" height="50" :src="item.image"
                          :class="{ 'image-filter': dialog.response.radioGroup === item.id }"></v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" dark @click="changeDialog(index)">Continuar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import CardTitle from './CardTitle.vue'
//import RadioGroupCard from './RadioGroupComponent.vue';

export default {
  components: {
    CardTitle,
    //RadioGroupCard
  },
  data() {
    return {
      activeDialog: 0,
      CarbonFootPrint: [
        {
          idZone: '',
          numPeople: 0,
          energyConsumption: 0,
          fuelType: '',
          fuelImage: '',
          cubicMeters: 0,
          propaneGas: 0
        }
      ],
      dialogs: [
        {
          content2: "En <b>Avgust </b> queremos ayudar al planeta, por eso, te invitamos a reducir tu <b>impacto ambiental</b>. <br><br>Descubre cómo puedes ayudar al planeta, <b>¡Calculando tu huella de carbono ahora!</b>",
          img: {
            url: require("@/assets/imgs/texto.png"),
            height: 180
          },
          open: true,
          requiresResponse: false,
        },
        {
          content: "<b> <h3>¿Qué es la huella de carbono?</h3> </b><br> La huella de carbono representa el volumen total de <b>Gases de Efecto Invernadero (GEI)</b> que producen las actividades económicas y cotidianas del ser humano. <br><br> <b> <h3>¿Para qué se calcula?</h3> </b><br> Es importante entender la huella de carbono como un primer paso en el camino a la mejora y el compromiso de reducción de emisiones de Gases de Efecto Invernadero (GEI) para contribuir a la lucha contra el cambio climático.",
          open: false,
          requiresResponse: false,
          img2: {
            url: require("@/assets/imgs/ardilla.png"),
            height: 250
          },
        },
        {
          content: "<b> <h3>¿Qué necesitas para calcular tu huella?</h3> </b><br> <ul> <li>Necesitas tus facturas de <b>gas y energía eléctrica.</b></li> <li>En tu factura de consumo de <b>gas</b>, te aparece tu consumo en <b>m3</b></li> <li>En tu factura de consumo de <b>energía eléctrica</b>, te aparece tu consumo en <b>kw/h</b> </li> </ul>",
          open: false,
          requiresResponse: false,
          img: {
            url: require("@/assets/imgs/seccion2.png"),
            height: 150
          },
          img2: {
            url: require("@/assets/imgs/ardilla.png"),
            height: 250
          }
        },
        {
          content: "<h3 class='text-center mb-3'>¿Cuántas personas viven contigo?</h3>",
          content2: "<h3 class='text-center mb-3'>Zona de Vivienda</h3>",
          open: false,
          requiresResponse: true,
          response: {
            numSelected: 0,
            radioGroup: null,
            items: [
              { image: require('@/assets/imgs/urbana.png'), label: 'URBANA', id: 'Urbano' },
              { image: require('@/assets/imgs/rural.png'), label: 'RURAL', id: 'Rural' }
            ],
            completionFunction: 'GetPeopleZone' // This function will be called when the dialog is completed
          },
        },
        {
          content: "<h3 class='text-center mb-3'>¿Cuánto consumes de electricidad al mes? en kWh</h3>",
          open: false,
          requiresResponse: true,
          skipAllowed: true,
          title: "<h5>Cálculo de vivienda - Zona Rural<h5>",
          response: {
            numSelected: 0,
            electricityConsumption: 0,
            completionFunction: 'GetEnergyConsumption' // This function will be called when the dialog is completed
          },
        },
        {
          content: "<h3 class='text-center mb-3'>¿Qué tipo de combustible utilizas para cocinar?</h3>",
          open: false,
          requiresResponse: true,
          title: "<h5>Cálculo de vivienda - Zona Rural<h5>",
          response: {
            numSelected: false,
            items: [
              { image: require('@/assets/imgs/gaspropano.png'), label: 'GAS PROPANO', id: 'gaspropano' },
              { image: require('@/assets/imgs/gasnatural.png'), label: 'GAS NATURAL', id: 'gasnatural' },
            ],
            completionFunction: 'GetFuelType' // This function will be called when the dialog is completed
          }
        },
        {
          open: false,
          requiresResponse: true,
          title: "<h5>Cálculo de vivienda - Zona Rural<h5>",
          img2: {
            url: require("@/assets/imgs/gasnatural.png"),
            height: 150
          },
          content: "¿Cuántos metros cúbicos (m3) aparece en tu recibo de consumo de gas natural al mes? <br><br>",
          content2: "<h3 class='text-center mb-3'>¿Qué tipo de combustible utilizas para cocinar?</h3> <br> <p>GAS NATURAL</p>",
          response: {
            numSelected: 0,
            completionFunction: 'GetCubicMmeters' // This function will be called when the dialog is completed
          }
        },
        {
          content: "<h3 class='text-center mb-3'>Consumo de gas propano mensual</h3> <br> <p class='text-center'>• ¿Cuántos cilindros consumes al mes?</p><br>",
          open: false,
          requiresResponse: true,
          title: "<h5>Cálculo de vivienda - Zona Rural<h5>",
          response: {
            numSelected: 0,
            electricityConsumption: 0,
            completionFunction: 'GetPropaneGas' // This function will be called when the dialog is completed
          },
        },
        {
          content: "<h3 class='text-center mb-3'>Consumo de gas propano mensual</h3><br>• ¿De que tamaño es tu cilindro de gas?",
          open: false,
          requiresResponse: true,
          title: "<h5>Cálculo de vivienda - Zona Rural<h5>",
          response: {
            numSelected: false,
            items: [
              { label: '45kg (100lb)', id: '45kg (100lb)' },
              { label: '15kg (33lb)', id: '15kg (33lb)' },
              { label: '30kg (77lb)', id: '30kg (77lb' },
              { label: '18kg (40lb)', id: '18kg (40lb)' },
              { label: '6 - 4,5kg (10lb)', id: '6 - 4,5kg (10lb)' }
            ],
            completionFunction: 'calculateFootprint' // This function will be called when the dialog is completed
          }
        },
        {
          content: "<h3 class='text-center mb-3'>¿Qué tipo de combustible solido utilizas para cocinar?</h3>",
          open: false,
          requiresResponse: true,
          title: "<h5>Cálculo de vivienda - Zona Rural<h5>",
          response: {
            numSelected: false,
            items: [
              { image: require('@/assets/imgs/bagazo.png'), label: 'BAGAZO', id: 1 },
              { image: require('@/assets/imgs/carbon.png'), label: 'CARBÓN', id: 2 },
              { image: require('@/assets/imgs/leña.png'), label: 'LEÑA', id: 3 },
              { image: require('@/assets/imgs/madera.png'), label: 'MADERA', id: 4 },
              { image: require('@/assets/imgs/fibrapalma.png'), label: 'FIBRA PALMA', id: 5 }
            ],
            completionFunction: 'calculateFootprint' // This function will be called when the dialog is completed
          }
        },
        {
          content: "<h3 class='text-center mb-3'>¿Qué tipo de combustible utilizas?</h3>",
          open: false,
          requiresResponse: true,
          title: "<h5>Cálculo de Transporte<h5>",
          response: {
            numSelected: false,
            items: [
              { image: require('@/assets/imgs/transportemasivo.png'), label: 'SISTEMA DE TRANSPORTE MASIVO', id: 1 },
              { image: require('@/assets/imgs/vehiculo.png'), label: 'VEHÍCULO PARTICULAR Y/O DE SERVICIO PÚBLICO', id: 2 },
              { image: require('@/assets/imgs/moto.png'), label: 'MOTO', id: 3 },
              { image: require('@/assets/imgs/bicicleta.png'), label: 'BICICLETA', id: 4 },
              { image: require('@/assets/imgs/apie.png'), label: 'A PIE', id: 5 }
            ],
            completionFunction: 'calculateFootprint' // This function will be called when the dialog is completed
          }
        },
        {
          content: "<h3 class='text-center mb-3'>¿Cuántos kilometros recorres al día aproximadamente? en km</h3>",
          open: false,
          requiresResponse: true,
          title: "<h5>Cálculo de Transporte<h5>",
          response: {
            numSelected: 0,
            items: [
              { image: require('@/assets/imgs/transportemasivo.png'), label: 'SISTEMA DE TRANSPORTE MASIVO', id: 1 },
              { image: require('@/assets/imgs/vehiculo.png'), label: 'VEHÍCULO PARTICULAR Y/O DE SERVICIO PÚBLICO', id: 2 },
              { image: require('@/assets/imgs/moto.png'), label: 'MOTO', id: 3 },
              { image: require('@/assets/imgs/bicicleta.png'), label: 'BICICLETA', id: 4 },
              { image: require('@/assets/imgs/apie.png'), label: 'A PIE', id: 5 }
            ],
            completionFunction: 'calculateFootprint' // This function will be called when the dialog is completed
          }
        },
        {
          content: "<h3 class='text-center mb-3'>¿Reciclas, Reduces, o Reutilizas?</h3>",
          open: false,
          requiresResponse: true,
          title: "<h5>Manejo de Residuos<h5>",
          response: {
            numSelected: false,
            items: [
              { label: 'SI', id: 1 },
              { label: 'NO', id: 2 },
            ],
            completionFunction: 'calculateFootprint' // This function will be called when the dialog is completed
          }
        }
      ]
    };
  },
  computed: {
    isFirstDialogOpen() {
      return this.activeDialog === 0;
    },
    progressValue() {
      return (this.activeDialog / this.dialogs.length) * 100;
    },
    columnSize() {
      return this.activeDialog === 6 ? 5 : (this.activeDialog >= 3 ? 12 : 5);
    },
    columnSmSize() {
      return this.activeDialog >= 3 ? 12 : undefined;
    },
    backgroundClass() {
      return { 'dialog-background': this.isFirstDialogOpen };
    },
    columnClass() {
      return { 'popgray': this.isFirstDialogOpen };
    },
    headerImage() {
      return require('@/assets/imgs/Header.png');
    },
  },
  methods: {
    validateResponse(dialog) {
      if (!dialog.requiresResponse) return true;
      return dialog.response.numSelected !== 0 && dialog.response.radioGroup !== null;
    },
    changeDialog(index, isGoingBack = false) {
      const dialog = this.dialogs[index];

      if (!isGoingBack && this.dialogRequiresResponse(dialog)) {
        if (!this.isValidResponse(dialog.response)) {
          this.showError('Debe completar alguno de los campos.');
          return;
        }

        if (dialog.response.completionFunction) {
          this.CarbonFootPrint = {
            ...this.CarbonFootPrint,
            ...this[dialog.response.completionFunction](
              dialog.response.numSelected,
              dialog.response.radioGroup
            ),
          };
        }
      }

      this.updateDialogStatus(index, isGoingBack);
    },
    dialogRequiresResponse(dialog) {
      return dialog.requiresResponse;
    },
    isValidResponse(response) {
      return response.numSelected !== 0 && response.radioGroup !== null;
    },
    showError(message) {
      // Implementa aquí tu lógica para mostrar el error.
      alert(message);
    },
    updateDialogStatus(index, isGoingBack) {
      this.dialogs[index].open = false;

      if (!isGoingBack && index + 1 < this.dialogs.length) {
        this.dialogs[index + 1].open = true;
        this.activeDialog++;
      } else if (isGoingBack && index - 1 >= 0) {
        this.dialogs[index - 1].open = true;
        this.activeDialog--;
      }
    },
    GetPeopleZone(numSelected, radioGroup) {
      return {
        idZone: radioGroup,
        numPeople: numSelected,
      };
    },
    GetEnergyConsumption(numSelected) {
      return { energyConsumption: numSelected };
    },
    GetFuelType(numSelected, radioGroup) {
      // Generar la ruta de la imagen en base al valor de radioGroup
      if (numSelected) {
        console.log(numSelected);
      }
      const imgSrc = require(`@/assets/imgs/${radioGroup}.png`);
      // Guardar la imagen en CarbonFootPrint
      this.CarbonFootPrint.fuelImage = imgSrc;
      // Si el siguiente diálogo existe, actualiza su imagen.
      if (this.activeDialog + 1 < this.dialogs.length) {
        this.dialogs[this.activeDialog + 1].img2.url = this.CarbonFootPrint.fuelImage;
      }
      return { fuelType: radioGroup };
    },
    GetCubicMmeters(numSelected) {
      return { cubicMeters: numSelected };
    },
    GetPropaneGas(numSelected) {
      return { propaneGas: numSelected };
      //console.log("------finalhastaahora----", this.CarbonFootPrint);
    },
    calculateFootprint(numSelected, radioGroup) {
      console.log(numSelected, radioGroup);
    },
    calculateFootprintDo(numSelected) {
      console.log("calculateFootprintDo", numSelected);
    },
  }
};
</script>

<style scoped>
@import url(../assets/formcard.css);
</style>
