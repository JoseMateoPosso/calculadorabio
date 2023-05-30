<template>
  <div :class="backgroundClass" id="app">
    <img v-if="!isFirstDialogOpen" :src="headerImage" alt="Imagen de descripción" height="250">
    <v-dialog v-for="(dialog, index) in dialogs" :key="index" v-model="dialog.open" persistent max-width="900">
      <v-card height="60vh" :class="{ 'fisrt-card': isFirstDialogOpen }">
        <v-card-text>
          <v-progress-linear color="green" :model-value="progressValue"></v-progress-linear>
          <v-container>
            <v-row>
              <v-col>
                <p v-if="dialog.content" v-html="dialog.content"></p>
                <img v-if="dialog.img" :src="dialog.img.url" :height="dialog.img.height" />
                <v-text-field variant="solo" v-model="dialog.response.numSelected" type="number" v-if="dialog.requiresResponse"></v-text-field>
                <v-btn v-if="dialog.skipAllowed" @click="changeDialog(index)">No aplica</v-btn>
              </v-col>
              <v-col :cols="columnSize" sm="columnSmSize" :class="columnClass">
                <p v-if="dialog.content2" v-html="dialog.content2"></p>
                <img v-if="dialog.img2" :src="dialog.img2.url" :height="dialog.img2.height" />
                <v-radio-group v-if="dialog.requiresResponse" v-model="dialog.response.radioGroup">
                  <v-row class="justify-center">
                    <v-col cols="3" v-for="(item, i) in dialog.response.items" :key="i">
                      <v-card @click="dialog.response.radioGroup = item.id" :class="{ 'selected-image': dialog.response.radioGroup === item.id }">
                        <v-img height="50" :src="item.image" :class="{ 'image-filter': dialog.response.radioGroup === item.id }"></v-img>
                        <v-radio hide-details :label="item.label" :value="item.id"></v-radio>
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
export default {
  data() {
    return {
      activeDialog: 0,
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
          content: "<h3 class='text-center mb-5'>¿Cuántas personas viven contigo?</h3>",
          content2: "<h3 class='text-center mb-5'>Zona de Vivienda</h3>",
          open: false,
          requiresResponse: true,
          response: {
            numSelected: 0,
            radioGroup: null,
            items: [
              { image: require('@/assets/imgs/urbana.png'), label: 'URBANA', id: 1 },
              { image: require('@/assets/imgs/rural.png'), label: 'RURAL', id: 2 }
            ],
            completionFunction: 'calculateFootprint' // This function will be called when the dialog is completed
          },
        },
        {
          content: "<h3 class='text-center mb-5'>¿Cuánto consumes de electricidad al mes? en kWh</h3>",
          open: false,
          requiresResponse: true,
          skipAllowed: true,
          response: {
            numSelected: 0,
            electricityConsumption: 0,
            completionFunction: 'calculateFootprintDo' // This function will be called when the dialog is completed
          },
        },
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
      return this.activeDialog >= 3 ? 12 : 5;
    },
    columnSmSize() {
      return this.activeDialog >= 3 ? 12 : undefined;
    },
    backgroundClass() {
      return { 'dialog-background': this.isFirstDialogOpen }
    },
    columnClass() {
      return { 'popgray': this.isFirstDialogOpen }
    },
    headerImage() {
      return require('@/assets/imgs/Header.png');
    }
  },
  methods: {
    validateResponse(dialog) {
      if (!dialog.requiresResponse) return true;
      return dialog.response.numSelected !== 0 && dialog.response.radioGroup !== null;
    },
    changeDialog(index) {
      // Check if a response is required
      if (this.dialogs[index].requiresResponse) {
        // If a response is required and none has been given, return early
        if (this.dialogs[index].response.numSelected === 0 || this.dialogs[index].response.radioGroup === null) {
          alert('A response is required to continue.');
          return;
        } else if (this.dialogs[index].response.completionFunction) {
          this[this.dialogs[index].response.completionFunction](
            this.dialogs[index].response.numSelected,
            this.dialogs[index].response.radioGroup
          );
        }
      }

      this.dialogs[index].open = false;
      if (index + 1 < this.dialogs.length) {
        this.dialogs[index + 1].open = true;
        this.activeDialog++;
      } else {
        this.activeDialog = null;
      }
    },
    calculateFootprint(numSelected, radioGroup) {
      // Your logic for calculating the carbon footprint goes here
      // You can now use numSelected and radioGroup in this function
      console.log(numSelected, radioGroup);
    },
    calculateFootprintDo(numSelected) {
      // Your logic for calculating the carbon footprint goes here
      // You can now use numSelected in this function
      console.log("numselected", numSelected);
    },
  }
};
</script>

<style scoped>
@import url(../assets/formcard.css);
</style>
