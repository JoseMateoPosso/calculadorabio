<template>
  <div :class="backgroundClass" id="app">
    <img v-if="!isFirstDialogOpen" :src="headerImage" alt="Imagen de descripción" height="250">
    <v-dialog v-for="(dialog, index) in dialogs" :key="index" v-model="dialog.open" persistent max-width="900">
      <v-card height="60vh" :class="{ 'fisrt-card': isFirstDialogOpen }">
        <v-icon v-if="index > 0" class="icon-back" @click="changeDialog(index, true)">mdi-arrow-left</v-icon>
        <CardTitle :title="dialog.title" :progress="progressValue" />
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <p v-html="dialog.content"></p>
                <img v-if="dialog.img" :src="imageMap[dialog.img.url]" :height="dialog.img.height" />
                <v-text-field variant="solo" v-model="dialog.response.numSelected" type="number"
                  v-if="dialog.requiresResponse && dialog.response.numSelected !== false"></v-text-field>
                <!--<v-btn v-if="dialog.skipAllowed" @click="changeDialog(index)">No aplica</v-btn>-->
              </v-col>
              <v-col :cols="columnSize" class="text-center" sm="columnSmSize" :class="columnClass">
                <p v-html="dialog.content2"></p>
                <img v-if="dialog.img2" :src="imageMap[dialog.img2.url]" :height="dialog.img2.height" />
                <!--<RadioGroupCard v-if="dialog.requiresResponse" :response="dialog.response.radioGroup" />-->
                <v-radio-group v-if="dialog.requiresResponse" v-model="dialog.response.radioGroup">
                  <v-row class="justify-center">
                    <v-col cols="2" v-for="(item, i) in dialog.response.items" :key="i">
                      <v-card @click="dialog.response.radioGroup = item.id"
                        :class="{ 'selected-image': dialog.response.radioGroup === item.id }">
                        <v-radio hide-details :label="item.label" :value="item.id"></v-radio>
                        <img :src="imageMap[item.image]">
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
import data from './dialog.json';
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
      dialogs: data,
      imageMap: {
        'texto': require('@/assets/imgs/texto.png'),
        'ardilla': require('@/assets/imgs/ardilla.png'),
        'seccion2': require('@/assets/imgs/seccion2.png'),
        'urbana': require('@/assets/imgs/urbana.png'),
        'rural': require('@/assets/imgs/rural.png'),
        'gaspropano': require('@/assets/imgs/gaspropano.png'),
        'gasnatural': require('@/assets/imgs/gasnatural.png'),
        'bagazo': require('@/assets/imgs/bagazo.png'),
        'carbon': require('@/assets/imgs/carbon.png'),
        'leña': require('@/assets/imgs/leña.png'),
        'madera': require('@/assets/imgs/madera.png'),
        'fibrapalma': require('@/assets/imgs/fibrapalma.png'),
        'transportemasivo': require('@/assets/imgs/transportemasivo.png'),
        'vehiculo': require('@/assets/imgs/vehiculo.png'),
        'moto': require('@/assets/imgs/moto.png'),
        'bicicleta': require('@/assets/imgs/bicicleta.png'),
        'apie': require('@/assets/imgs/apie.png')
      }
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
      const imgSrc = radioGroup;
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
    },
    calculateFootprint(numSelected, radioGroup) {
      console.log(numSelected, radioGroup);
      console.log('------finalhastaahora----', this.CarbonFootPrint);
    },
    calculateFootprintDo(numSelected) {
      console.log("rayosientra", numSelected);
    },
  }
};
</script>

<style scoped>
@import url(../assets/formcard.css);
</style>
