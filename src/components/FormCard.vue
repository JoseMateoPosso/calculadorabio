<template>
  <!-- El div principal que contiene la aplicación -->
  <div :class="backgroundClass" id="app">
    <!-- Muestra una imagen si no se ha abierto el primer diálogo -->
    <img
      v-if="!isFirstDialogOpen"
      :src="headerImage"
      alt="Imagen de descripción"
      height="250"
    />
    <!-- Recorre todos los diálogos y los muestra en la aplicación -->
    <v-dialog
      v-for="(dialog, index) in dialogs"
      :key="dialog.id"
      v-model="dialog.open"
      persistent
      max-width="900"
    >
      {{ dialog.id }}
      <!-- Cada diálogo se muestra en una tarjeta -->
      <v-card height="60vh" :class="{ 'first-card': isFirstDialogOpen }">
        <!-- Si no es el primer diálogo, se muestra un icono para retroceder -->
        <v-icon
          v-if="index > 0"
          class="icon-back"
          @click="changeDialog(index + 1, true)"
          >mdi-arrow-left</v-icon
        >
        <!-- Título de la tarjeta y barra de progreso -->
        <CardTitle :title="dialog.title" :progress="progressValue" />
        <!-- Contenido de la tarjeta -->
        <v-card-text>
          <!-- El contenido de la tarjeta se organiza en una cuadrícula -->
          <v-container>
            <v-row>
              <v-col>
                <!-- Contenido del diálogo y una imagen, si existe -->
                <p v-html="dialog.content"></p>
                <img
                  v-if="dialog.img"
                  :src="imageMap[dialog.img.url]"
                  :height="dialog.img.height"
                />
                <!-- Campo para ingresar una respuesta numérica, si es necesario -->
                <v-text-field
                  variant="solo"
                  v-model="dialog.response.numSelected"
                  type="number"
                  v-if="
                    dialog.requiresResponse &&
                    dialog.response.numSelected !== false
                  "
                ></v-text-field>
              </v-col>
              <v-col
                :cols="columnSize"
                class="text-center"
                sm="columnSmSize"
                :class="columnClass"
              >
                <!-- Contenido adicional y otra imagen, si existe -->
                <p v-html="dialog.content2"></p>
                <img
                  v-if="dialog.img2"
                  :src="imageMap[dialog.img2.url]"
                  :height="dialog.img2.height"
                />
                <!-- Grupo de botones de opción, si es necesario -->
                <v-radio-group
                  v-if="dialog.requiresResponse"
                  v-model="dialog.response.radioGroup"
                >
                  <v-row class="justify-center">
                    <!-- Cada botón de opción se muestra en una tarjeta -->
                    <v-col
                      cols="2"
                      v-for="(item, i) in dialog.response.items"
                      :key="i"
                    >
                      <v-card
                        @click="toggleSelected(dialog.response, item.id)"
                        :class="{
                          'selected-image': isSelected(
                            dialog.response,
                            item.id
                          ),
                        }"
                      >
                        <!-- Etiqueta y valor para el botón de opción -->
                        <v-radio
                          hide-details
                          :label="item.label"
                          :value="item.id"
                        ></v-radio>
                        <!-- Imagen para el botón de opción -->
                        <img
                          v-if="item.image"
                          :src="imageMap[item.image]"
                          height="50"
                        />
                      </v-card>
                    </v-col>
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <!-- Acciones para la tarjeta -->
        <v-card-actions>
          <!-- Botón para continuar al siguiente diálogo -->
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" dark @click="changeDialog(index + 1)"
            >Continuar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// Importa los componentes necesarios
import CardTitle from "./CardTitle.vue";
import data from "./dialog.json";

// Componente Vue principal
export default {
  components: {
    CardTitle,
  },
  // Datos iniciales del componente
  data() {
    return {
      // Índice del diálogo activo
      activeDialog: 0,
      // Historial de diálogos visitados
      dialogHistory: [],
      // Array para almacenar la huella de carbono
      CarbonFootPrint: [
        {
          idZone: "",
          numPeople: 0,
          energyConsumption: 0,
          fuelType: "",
          numCylinders: 0,
          cubicMeters: 0,
          solidFuel: "",
          cylinderType: 0,
          transportType: "",
          transportFuelType: "",
          numKilometers: 0,
          recycle: 0,
        },
      ],
      // Datos de los diálogos
      dialogs: data,
      imageMap: {
        texto: require("@/assets/imgs/texto.png"),
        ardilla: require("@/assets/imgs/ardilla.png"),
        seccion2: require("@/assets/imgs/seccion2.png"),
        urbana: require("@/assets/imgs/urbana.png"),
        rural: require("@/assets/imgs/rural.png"),
        gaspropano: require("@/assets/imgs/gaspropano.png"),
        gasnatural: require("@/assets/imgs/gasnatural.png"),
        bagazo: require("@/assets/imgs/bagazo.png"),
        carbon: require("@/assets/imgs/carbon.png"),
        leña: require("@/assets/imgs/leña.png"),
        madera: require("@/assets/imgs/madera.png"),
        fibrapalma: require("@/assets/imgs/fibrapalma.png"),
        transportemasivo: require("@/assets/imgs/transportemasivo.png"),
        vehiculo: require("@/assets/imgs/vehiculo.png"),
        moto: require("@/assets/imgs/moto.png"),
        bicicleta: require("@/assets/imgs/bicicleta.png"),
        apie: require("@/assets/imgs/apie.png"),
        noaplica: require("@/assets/imgs/noaplica.png"),
      },
    };
  },
  // Propiedades computadas del componente
  computed: {
    // Determina si el primer diálogo está abierto
    isFirstDialogOpen() {
      return this.activeDialog === 0;
    },
    // Calcula el valor de progreso en función del diálogo activo
    progressValue() {
      return (this.activeDialog / this.dialogs.length) * 100;
    },
    // Determina el tamaño de las columnas en función del diálogo activo
    columnSize() {
      return this.activeDialog === 9 ? 5 : this.activeDialog >= 3 ? 12 : 5;
    },
    // Determina el tamaño de las columnas en pantallas pequeñas
    columnSmSize() {
      return this.activeDialog >= 3 ? 12 : undefined;
    },
    // Determina la clase de fondo en función de si el primer diálogo está abierto
    backgroundClass() {
      return { "dialog-background": this.isFirstDialogOpen };
    },
    // Determina la clase de columna en función de si el primer diálogo está abierto
    columnClass() {
      return { popgray: this.isFirstDialogOpen };
    },
    // Ruta a la imagen del encabezado
    headerImage() {
      return require("@/assets/imgs/Header.png");
    },
  },
  // Métodos del componente
  methods: {
    // Valida la respuesta del diálogo
    validateResponse(dialogResponse) {
      if (dialogResponse) {
        if (
          (dialogResponse.responseType === "both" &&
            dialogResponse.radioGroup !== null &&
            dialogResponse.numSelected >= 1) ||
          (dialogResponse.responseType === "num" &&
            dialogResponse.numSelected >= 1) ||
          (dialogResponse.responseType === "radio" &&
            dialogResponse.radioGroup !== null) ||
          (dialogResponse.responseType === "numOrRadio" &&
            (dialogResponse.numSelected >= 1 ||
              dialogResponse.radioGroup !== null))
        ) {
          return true;
        }
      }
      // Si no pasa ninguna de las validaciones, retorna false
      return false;
    },
    // Obtén el índice del próximo diálogo
    getNextDialogIndex(currentDialogIndex) {
      const currentDialog = this.dialogs[currentDialogIndex];
      if (currentDialog.nextDialog !== undefined) {
        return currentDialog.nextDialog - 1; // Resta 1 porque los índices del array comienzan desde 0
      } else if (
        currentDialog.response &&
        currentDialog.response.radioGroup === null
      ) {
        return currentDialog.nextDialog - 1; // Resta 1 porque los índices del array comienzan desde 0
      } else if (currentDialog.response && currentDialog.response.items) {
        const selectedItem = currentDialog.response.items.find(
          (item) => item.id === currentDialog.response.radioGroup
        );
        if (selectedItem && selectedItem.nextDialog !== undefined) {
          return selectedItem.nextDialog - 1; // Resta 1 porque los índices del array comienzan desde 0
        }
      }
      return currentDialogIndex + 1;
    },

    // Cambia al siguiente o al anterior diálogo
    changeDialog(dialogId, isGoingBack = false) {
      // Encuentra el índice del diálogo en el array dialogs
      const index = this.dialogs.findIndex((dialog) => dialog.id === dialogId);

      // Verifica si el índice es válido
      if (index === -1) {
        console.error(`No se encontró el diálogo con el id: ${dialogId}`);
        return;
      }

      // Obtiene el diálogo actual
      const dialog = this.dialogs[index];

      // Si no estamos volviendo atrás y el diálogo requiere una respuesta
      if (!isGoingBack && this.dialogRequiresResponse(dialog)) {
        // Valida la respuesta
        if (!this.validateResponse(dialog.response)) {
          this.showError("Debe completar alguno de los campos.");
          return;
        }

        // Si existe una función de completado para el diálogo
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

      // Actualiza el estado de los diálogos
      this.updateDialogStatus(index, isGoingBack);
    },

    // Actualiza el estado de los diálogos
    updateDialogStatus(index, isGoingBack) {
      // Cierra el diálogo actual
      this.dialogs[index].open = false;

      if (!isGoingBack) {
        const nextDialogIndex = this.getNextDialogIndex(index);

        if (nextDialogIndex < this.dialogs.length) {
          this.dialogs[nextDialogIndex].open = true;
          this.activeDialog = nextDialogIndex;
          this.dialogHistory.push(index); // Agrega el diálogo actual al historial
        }
      } else {
        const previousDialogIndex = this.dialogHistory.pop();
        if (previousDialogIndex !== undefined) {
          this.dialogs[previousDialogIndex].open = true;
          this.activeDialog = previousDialogIndex;
        }
      }
    },

    // Determina si un diálogo requiere una respuesta
    dialogRequiresResponse(dialog) {
      return dialog.requiresResponse;
    },

    // Determina si una respuesta es válida
    isValidResponse(response) {
      return response.numSelected !== 0 && response.radioGroup !== null;
    },

    // Muestra un error
    showError(message) {
      // Implementa aquí tu lógica para mostrar el error.
      alert(message);
    },
    // Cambia el estado de selección de un botón de opción
    toggleSelected(response, id) {
      if (response.radioGroup === id) {
        response.radioGroup = null; // Desmarca el botón si ya estaba seleccionado
      } else {
        response.radioGroup = id; // Marca el botón si no estaba seleccionado
      }
    },

    // Verifica si un botón de opción está seleccionado
    isSelected(response, id) {
      return response.radioGroup === id;
    },

    //Funciones para obtener datos de la huella de carbono

    // Actualiza la zona y la cantidad de personas
    GetPeopleZone(numSelected, radioGroup) {
      console.log("idZone: " + radioGroup + " numPeople: " + numSelected);
      return { idZone: radioGroup, numPeople: numSelected };
    },

    // Actualiza el consumo de energía
    GetEnergyConsumption(numSelected) {
      console.log("energyConsumption: " + numSelected);
      return { energyConsumption: numSelected };
    },

    // Actualiza el tipo de combustible
    GetFuelType(numSelected, radioGroup) {
      console.log("fuelType: " + radioGroup + " numSelected: " + numSelected);
      return { fuelType: radioGroup };
    },
    // Actualiza la cantidad de metros cúbicos
    GetCylinders(numSelected) {
      console.log("numCylinders: " + numSelected);
      return { numCylinders: numSelected };
    },
    //Actualiza el tipo de combustible solido
    GetSolidFuel(numSelected, radioGroup) {
      if (numSelected) {
        console.log(numSelected);
      }
      console.log("solidFuel: " + radioGroup);
      return { solidFuel: radioGroup };
    },
    // Actualiza la cantidad de metros cúbicos
    GetCubicMeters(numSelected, radioGroup) {
      if (this.CarbonFootPrint.fuelType === "gaspropano") {
        let cylinders = this.CarbonFootPrint.numCylinders;
        let density = 2.0;
        let type = radioGroup;
        let mass = type * cylinders;
        let result = mass / density;
        console.log("propaneCubicMeters: " + result);
        return { cubicMeters: result };
      } else if (this.CarbonFootPrint.fuelType === "gasnatural") {
        console.log("naturalGasCubicMeters: " + numSelected);
        return { cubicMeters: numSelected };
      }
    },
    // Actualiza el tipo de transporte
    GetTransportType(numSelected, radioGroup) {
      if (numSelected) {
        console.log(numSelected);
      }
      console.log("transportType: " + radioGroup);
      return { transportType: radioGroup };
    },
    // Actualiza el tipo de combustible del transporte
    GetTransportFuelType(numSelected, radioGroup) {
      if (numSelected) {
        console.log(numSelected);
      }
      console.log("transportFuelType: " + radioGroup);
      return { transportFuelType: radioGroup };
    },
    // Actualiza la cantidad de kilómetros recorridos
    GetNumKilometers(numSelected) {
      console.log("numKilometers: " + numSelected);
      return { numKilometers: numSelected };
    },
    // Actualiza si la persona recicla o no recicla
    GetRecycle(numSelected, radioGroup) {
      if (numSelected) {
        console.log(numSelected);
      }
          console.log("recycle: " + radioGroup);
          return { recycle: radioGroup };
      }
    },
};
</script>

<!-- Estilos del componente -->
<style scoped>
@import url(../assets/formcard.css);
</style>
