<template>
  <div :class="backgroundClass" id="app">
    <!-- Muestra una imagen si no se ha abierto el primer diálogo -->
    <img v-if="!isFirstDialogOpen" :src="headerImage" alt="Imagen de descripción" height="200" style="width:100%" />
    <!-- Recorre todos los diálogos y los muestra en la aplicación -->
    <v-dialog v-for="(dialog, index) in dialogs" :key="dialog.id" v-model="dialog.open" persistent width="900"
      class="dialog">
      <!-- Cada diálogo se muestra en una tarjeta -->
      <v-card height="70vh" :class="{ 'first-card': isFirstDialogOpen }">
        <!-- Si no es el primer diálogo, se muestra un icono para retroceder -->
        <v-icon v-if="index > 0" class="icon-back" @click="changeDialog(index + 1, true)">mdi-arrow-left</v-icon>
        <!-- Título de la tarjeta y barra de progreso -->
        <CardTitle class="mt-5" v-if="!isFirstDialogOpen" :title="dialog.title" :progress="progressValue" />
        <!-- Contenido de la tarjeta -->
        <v-card-text :class="'active-dialog-' + activeDialog">
          <!-- El contenido de la tarjeta se organiza en una cuadrícula -->
          <v-container id="content">
            <!--Logo de avgust para el diploma-->
            <div class="text-right" v-if="activeDialog === 21">
              <img :src="imageMap['logoavgust']" alt="" height="50">
            </div>
            <v-row align="center">
              <v-col class="text-center columa1" offset="1">
                <!-- Contenido del diálogo y una imagen, si existe -->
                <v-row justify="center">
                  <p class="text-justify" v-html="dialog.content"></p>
                  <!-- Botón de información -->
                  <button v-if="dialog.infoText" class="info-button" @mouseover="showInfoTooltip = true"
                    @mouseout="showInfoTooltip = false">ℹ️</button>
                </v-row>
                <!-- Tooltip de información adicional -->
                <div v-if="showInfoTooltip === 'infoText2'" class="info-tooltip">
                  <!-- Contenido del tooltip -->
                  <p><i v-html="dialog.infoText2"></i></p>
                </div>
                <div v-else-if="showInfoTooltip" class="info-tooltip">
                  <!-- Contenido del tooltip2 -->
                  <p><i v-html="dialog.infoText"></i></p>
                  <img v-if="dialog.infoImg" :src="imageMap[dialog.infoImg]" height="600" width="600" alt="">
                </div>
                <img v-if="dialog.img" :src="imageMap[dialog.img.url]" :height="dialog.img.height" />
                <!-- Campo para ingresar una respuesta numérica, si es necesario -->
                <v-text-field class="inputlabel input-green mt-3" variant="solo" v-model="dialog.response.numSelected" type="number"
                  v-if="dialog.requiresResponse && dialog.response.numSelected !== false"></v-text-field>
                <!-- Campo para ingresar una respuesta de texto, si es necesario -->
                <v-text-field variant="solo" class="inputlabel mt-3" placeholder="Nombre" v-model="dialog.response.text" type="text"
                  v-if="dialog.requiresResponse && dialog.response.responseType === 'text'"></v-text-field>
                <p v-if="activeDialog === 20" class="text-justify" v-html="dialog.content2"></p>
              </v-col>
              <v-col :cols="columnSize" class="text-center" sm="columnSmSize" :class="columnClass" offset="1">
                <!-- Contenido adicional y otra imagen, si existe -->
                <v-row justify="center">
                  <p v-if="activeDialog != 20" class="text-justify" v-html="dialog.content2"></p>
                  <!-- Botón de información -->
                  <button v-if="dialog.infoText2" class="info-button" @mouseover="showInfoTooltip = 'infoText2'"
                    @mouseout="showInfoTooltip = false">ℹ️</button>
                </v-row>
                <img v-if="dialog.img2" :src="imageMap[dialog.img2.url]" :height="dialog.img2.height" />
                <v-btn v-if="isFirstDialogOpen" color="green darken-1" dark
                  @click="changeDialog(index + 1)">Empezar</v-btn>
                <!-- Grupo de botones de opción, si es necesario -->
                <v-radio-group v-if="dialog.requiresResponse" v-model="dialog.response.radioGroup">
                  <v-row justify="center">
                    <!-- Cada botón de opción se muestra en una tarjeta -->
                    <v-col cols="2" class="option-btn" @click="toggleSelected(dialog.response, item.id)"
                      v-for="(item, i) in dialog.response.items" :key="i">
                      <v-card :class="{ 'selected-image': isSelected(dialog.response, item.id) }">
                        <!-- Etiqueta y valor para el botón de opción -->
                        <v-radio hide-details :label="item.label" :value="item.id"
                          @click="toggleSelected(dialog.response, item.id)"></v-radio>
                        <!-- Imagen para el botón de opción -->
                        <img v-if="item.image" :src="imageMap[item.image]" height="50" />
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
          <v-btn v-if="!isFirstDialogOpen" color="green darken-1" dark @click="changeDialog(index + 1)">Siguiente</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
// Importa los componentes necesarios
import CardTitle from "./CardTitle.vue";
import data from "./dialog.json";
import html2pdf from "html2pdf.js";

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
      showInfoTooltip: false,
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
          solidFuelWeight: 0,
          cylinderType: 0,
          transportType: "",
          transportFuelType: "",
          numKilometers: 0,
          recycle: 0,
          finalCarbonFootPrint: 0,
          nivelCarbono: "",
          name: "",
        },
      ],
      // Datos de los diálogos
      dialogs: data,
      imageMap: {
        texto: require("@/assets/imgs/texto.png"),
        ardilla: require("@/assets/imgs/ardilla.png"),
        ardilla2: require("@/assets/imgs/ardilla2.png"),
        recibo: require("@/assets/imgs/recibo.png"),
        cilindros: require("@/assets/imgs/cilindros.png"),
        seccion2: require("@/assets/imgs/seccion2.png"),
        urbana: require("@/assets/imgs/urbana.png"),
        rural: require("@/assets/imgs/rural.png"),
        gaspropano: require("@/assets/imgs/gaspropano.png"),
        gasnatural: require("@/assets/imgs/gasnatural.png"),
        combustible: require("@/assets/imgs/combustible.png"),
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
        huellaalta: require("@/assets/imgs/huellaalta.png"),
        huellamedia: require("@/assets/imgs/huellamedia.png"),
        huellabaja: require("@/assets/imgs/huellabaja.png"),
        diesel: require("@/assets/imgs/diesel.png"),
        gasolina: require("@/assets/imgs/gasolina.png"),
        gas_natural: require("@/assets/imgs/gas_natural.png"),
        electrico: require("@/assets/imgs/electrico.png"),
        hibrido: require("@/assets/imgs/hibrido.png"),
        logoavgust: require("@/assets/imgs/logoavgust.png"),
        arbol: require("@/assets/imgs/arbol.png")
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
      switch (this.activeDialog) {
        case 21:
          return 8; // Cambiar a 5 columnas si el diálogo está en la posición 21
        case 20:
          return 4; // Cambiar a 5 columnas si el diálogo está en la posición 20
        case 8:
        case 19:
          return 4; // Mantener 5 columnas si el diálogo está en la posición 8 o 19
        default:
          if (this.activeDialog >= 3) {
            return 12; // Cambiar a 12 columnas si el diálogo está en la posición 3 o posterior
          } else {
            return 4; // Mantener 5 columnas por defecto
          }
      }

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
        console.log("condicion", dialogResponse)
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
              dialogResponse.radioGroup !== null)) ||
          (dialogResponse.responseType === "text" &&
            dialogResponse.text !== "") ||
          dialogResponse.responseType === "none"
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
              dialog.response.radioGroup,
              dialog.response.text
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
      return (
        response.numSelected !== 0 &&
        response.radioGroup !== null &&
        response.text !== ""
      );
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

    /* Actualiza la cantidad de metros cúbicos
    GetCylinders(numSelected) {
      console.log("numCylinders: " + numSelected);
      return { numCylinders: numSelected };
    },*/

    //Actualiza el tipo de combustible solido
    GetSolidFuelType(numSelected, radioGroup) {
      console.log(
        "solidFuel: " + radioGroup + " solidFuelWeight: " + numSelected
      );
      return { solidFuel: radioGroup, solidFuelWeight: numSelected };
    },

    // Actualiza la cantidad de metros cúbicos
    GetCubicMeters(numSelected, radioGroup) {
      if (this.CarbonFootPrint.fuelType === "gaspropano") {
        let cylinders = numSelected;
        let density = 2.0;
        let type = radioGroup;
        let mass = type * cylinders;
        let result = mass / density;
        console.log("propaneCubicMeters: " + result);
        console.log("num: " + numSelected + " radio" + radioGroup);
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
    },

    CalculateFootprint(numSelected) {
      if (numSelected) {
        console.log(numSelected);
      }

      // Variables huella de carbono
      const {
        numPeople,
        energyConsumption,
        fuelType,
        solidFuelWeight,
        solidFuel,
        cubicMeters,
        transportType,
        transportFuelType,
        numKilometers,
        recycle
      } = this.CarbonFootPrint;

      // Variables generales
      const yearM = 12;
      const yearD = 365;

      // Variables para el cálculo de la huella de carbono
      let electricFootPrint = 0;
      let transportFootPrint = 0;
      let kitchenFootPrint = 0;
      let recycleFootPrint = 0;
      let finalCarbonFootPrint = 0;

      // Calcular huella eléctrica
      electricFootPrint = this.calculateElectricFootPrint(
        energyConsumption,
        numPeople,
        yearM
      );

      // Calcular huella de transporte
      transportFootPrint = this.calculateTransportFootPrint(
        transportType,
        transportFuelType,
        numKilometers,
        yearD
      );

      // Calcular huella de cocina
      kitchenFootPrint = this.calculateKitchenFootPrint(
        fuelType,
        cubicMeters,
        numPeople,
        yearM,
        yearD,
        solidFuel,
        solidFuelWeight
      );

      // Calcular huella de reciclaje
      recycleFootPrint = this.calculateRecycleFootPrint(recycle);

      // Calcular huella de carbono final
      finalCarbonFootPrint =
        electricFootPrint + transportFootPrint + kitchenFootPrint + recycleFootPrint;

      // Generar resultados
      const results = this.generateResults(finalCarbonFootPrint);

      // Actualizar propiedades del diálogo
      this.dialogs[this.activeDialog + 1].content = results.content;
      this.dialogs[this.activeDialog + 1].img.url = results.imgUrl;
      this.dialogs[this.activeDialog + 1].content2 = results.content2;

      console.log(`final: ${finalCarbonFootPrint} electric: ${electricFootPrint} transport: ${transportFootPrint} kitchen: ${kitchenFootPrint} recycle: ${recycleFootPrint}`);

      return {
        finalCarbonFootPrint: finalCarbonFootPrint,
        nivelCarbono: results.resnivelCarbono
      };
    },

    calculateElectricFootPrint(energyConsumption, numPeople, yearM) {
      const electricFactor = 0.126;
      const totalElectricFootPrint = energyConsumption * yearM * electricFactor * 0.001;
      return totalElectricFootPrint / numPeople;
    },

    calculateTransportFootPrint(transportType, transportFuelType, numKilometers, yearD) {
      const factors = {
        1: { factor: 0.0304, name: "Masive" }, // Factor para transporte masivo
        2: {
          1: { performance: 70, factor: 10.15, name: "ACPM Car" }, // Factor para automóviles de ACPM
          2: { performance: 54, factor: 8.15, name: "Gaso Car" }, // Factor para automóviles a gasolina
          3: { performance: 22, factor: 1.9801, name: "Gas Car" }, // Factor para automóviles a gas
          4: { performance: 0.18, factor: 0.1260, name: "Electric Car" }, // Factor para automóviles eléctricos
          5: { performance: 26.84, factor: 4.14, name: "Hybrid Car" } // Factor para automóviles híbridos
        },
        3: {
          2: { performance: 121, factor: 8.15, name: "Gaso Bike" }, // Factor para motocicletas a gasolina
          4: { performance: 0.05, factor: 0.1260, name: "Electric Bike" } // Factor para motocicletas eléctricas
        },
        4: {
          0: { performance: 0, factor: 0, name: "Conventional Bicycle" }, // Factor para bicicletas a gasolina
          4: { performance: 0, factor: 0.1260, name: "Electric Bicycle" } // Factor para bicicletas eléctricas
        },
        5: { factor: 0.0205, name: "Walk" }
      };

      let transportFootPrint = 0;

      if (transportType === 1) {
        // Cálculo de huella de carbono para transporte masivo
        transportFootPrint = (numKilometers * yearD * factors[transportType].factor) * 0.001;
      } else if (transportType === 2) {
        const fuelType = factors[transportType][transportFuelType];
        console.log(fuelType)
        if (fuelType.name === "Electric Car") {
          //Cálculo de huella de carbono para automóviles eléctricos
          transportFootPrint = (numKilometers * yearD * fuelType.performance * fuelType.factor) * 0.001;
        } else {
          // Cálculo de huella de carbono para automóviles no electricos
          transportFootPrint = (numKilometers * yearD * (1 / fuelType.performance) * fuelType.factor) * 0.001;
        }
      } else if (transportType === 3) {
        const fuelType = factors[transportType][transportFuelType] || factors[transportType].default;
        // Cálculo de huella de carbono para motocicletas
        transportFootPrint = (numKilometers * yearD * (1 / fuelType.performance) * fuelType.factor) * 0.001;
      } else if (transportType === 4) {
        const fuelType = factors[transportType][transportFuelType];
        if (fuelType === 4) {
          // Cálculo de huella de carbono para bicicletas
          transportFootPrint = (numKilometers * yearD * fuelType.factor) * 0.001;
        } else {
          transportFootPrint = 0
        }
      }
      else {
        // Cálculo de huella de carbono para otros tipos de transporte
        transportFootPrint = factors[transportType].factor;
      }

      return transportFootPrint;
    },

    calculateKitchenFootPrint(fuelType, cubicMeters, numPeople, yearM, yearD, solidFuel, solidFuelWeight) {
      const factors = {
        gasnatural: { factor: 1.9801, name: "Gas Natural" }, // Factor para cocina de gas natural
        gaspropano: { factor: 8.21, name: "Gas Propano" }, // Factor para cocina de gas propano
        combustiblesolido: {
          1: { factor: 1.68, name: "Bagazo" }, // Factor para combustible sólido de tipo Bagazo
          2: { factor: 2.45, name: "Carbón" }, // Factor para combustible sólido de tipo Carbón
          3: { factor: 1.84, name: "Leña" }, // Factor para combustible sólido de tipo Leña
          4: { factor: 1.15, name: "Madera" }, // Factor para combustible sólido de tipo Madera
          default: { factor: 1.93, name: "Palm" } // Factor predeterminado para combustible sólido
        }
      };

      let kitchenFootPrint = 0;

      if (fuelType === "gasnatural") {
        // Cálculo de huella de carbono para cocina de gas natural
        kitchenFootPrint = cubicMeters * yearM * factors[fuelType].factor * 0.001;
      } else if (fuelType === "gaspropano") {
        // Cálculo de huella de carbono para cocina de gas propano
        kitchenFootPrint = cubicMeters * yearM * factors[fuelType].factor * 0.001;
      } else if (fuelType === "combustiblesolido") {
        const solidFuelType = factors[fuelType][solidFuel] || factors[fuelType].default;
        // Cálculo de huella de carbono para combustible sólido
        kitchenFootPrint = solidFuelWeight * yearD * solidFuelType.factor * 0.001;
      }

      return kitchenFootPrint / numPeople;
    },

    calculateRecycleFootPrint(recycle) {
      let recycleFootPrint = 0;

      if (recycle === 1) {
        recycleFootPrint = -0.23;
      }

      return recycleFootPrint;
    },

    // Obtiene la huella de carbono
    generateResults(finalCarbonFootPrint) {
      const treePerTon = 6;
      let compensationTrees = Math.round(finalCarbonFootPrint * treePerTon / 1)

      // Determinar el nivel de carbono y la imagen correspondiente
      const resnivelCarbono = finalCarbonFootPrint > 1.8 ? "alta" : (finalCarbonFootPrint > 1.5 && finalCarbonFootPrint < 1.8) ? "media" : finalCarbonFootPrint <= 1.5 ? "baja": "undefined";
      const imgUrl = resnivelCarbono === "alta" ? "huellaalta" : resnivelCarbono === "media" ? "huellamedia" : resnivelCarbono === "baja" ? "huellabaja" : "";

      // Generar el contenido correspondiente al nivel de carbono
      const content2 = resnivelCarbono === "alta" ? `<p class='text-center'>Lamentablemente el resultado de tu huella es alto, te recomendamos que lo reduzcas con los siguientes consejos que tenemos preparados para ti. <br><br> *Para compensar tu huella necesitas sembrar ${compensationTrees} (de acuerdo a la formula) árboles.<br>Si te gustó, por favor ayúdanos a compartir esta calculadora para que más personas sean parte de esta iniciativa.</p>` :
        resnivelCarbono === "media" ? `<p class='text-center'>El resultado de tu huella es medio, sabemos que puedes mejorar. Te ofrecemos consejos para reducir tu huella: <br> *Para compensar tu huella necesitas sembrar ${compensationTrees} (de acuerdo a la formula) árboles.<br>Si te gustó, por favor ayúdanos a compartir esta calculadora para que más personas sean parte de esta iniciativa.</p>` :
          resnivelCarbono === "baja" ? `<p class='text-center'>¡Felicidades! El resultado de tu huella es baja, por lo tanto, te concedemos un diploma de embajador ambiental.<br> *Para compensar tu huella necesitas sembrar ${compensationTrees} árboles. <br>Si te gusta, por favor ayúdanos a compartir esta calculadora para que más personas se sumen a esta iniciativa</p>` : "";

      // Generar el contenido general
      const content = `<b><h2>Tu huella de carbono es</h2></b><h3 class='text-center'>${resnivelCarbono.charAt(0).toUpperCase() + resnivelCarbono.slice(1)}</h3> <p class='txt-border text-center'>${finalCarbonFootPrint.toFixed(2)} toneladas de CO2/año </p><br>`;

      // Devolver los valores
      return {
        content,
        imgUrl,
        content2,
        resnivelCarbono
      };
    },

    TipsFootprint() {
      // Objeto con consejos según el nivel de carbono
      const tip = {
        alta: "<p><b>-Utiliza bombillos de bajo consumo:</b> ahorran hasta un 75% de energía. <br><br>-<b>Apaga la luz de los ambientes que no estés utilizando.</b><br><br><b>-Usa la luz natural el tiempo que más puedas.</b><br><br>-<b>Emplea la lavadora con carga completa:</b> ahorrarás agua y electricidad. <br><br>-<b>Apaga el computador cuando no lo estés utilizando.</b><br><br>-<b>Desconecta todos los aparatos eléctricos que no estés utilizando.</b> <br><br>-<b>Sustituye la estufa eléctrica por estufa de gas.</b><br><br>-<b>Mantén tu auto en buen estado. Los autos con el mantenimiento adecuado, como las llantas infladas correctamente, generan menos emisiones de gases de efecto invernadero. </b><br><br>-<b>Haz una inspección periódica del depósito de gas</b>; revisa todos los accesorios (válvulas, llave de paso, conectores, reguladores, empaques) y válida que estos estén completos y en óptimo estado. <br><br>-<b>La siembra de árboles refuerza esta labor, así que considéralo, ya que es una de las mejores alternativas para disminuir y compensar el impacto medioambiental</b>.</p>",
        media: "<p>-Desconecta todos los aparatos eléctricos que no estés utilizando. <br><br>-Mantén limpios todos los gasodomésticos de tu hogar. Los gasodomésticos son los aparatos de tu casa que funcionan con gas (calentador, estufa, horno, calefactores, entre otros). <br><br>-Utiliza bolsas de tela cuando hagas tus compras. <br><br>-Comprar botellas plásticas con líquido cada que tienes sed es poco amigable con el planeta, mejor compra un termo y lleva en éste tus bebidas. <br><br>-Puedes reducir los residuos alimentarios si cultivas tus verduras, haces compostaje o compras productos a granel para evitar o reducir embalajes innecesarios. <br><br>-Si es posible, opta por los ventiladores de techo antes que los aires acondicionados. <br><br>-Ve de vacaciones cerca de casa. Cuanto más lejos viajes, más alta será tu huella de carbono. <br><br>-Recicla las hojas de papel. Reciclando papel ayudas a proteger las selvas tropicales, ya que por 1 tonelada de papel evitamos que talen 17 árboles, preservando así el hábitat de muchos animales.</p>",
        baja: "<p><b><h3>-Consume responsable:</h3><br></b> Elige productos y alimentos que sean producidos de manera sostenible, como productos orgánicos y de comercio justo. También puedes reducir tu consumo de carne y optar por una dieta más basada en plantas. <br><br><b><h3>-Recolecta agua de lluvia para utilizarla en el riego de plantas. </b></h3><br><br><b><h3>-Adopta plantas endémicas:</b></h3><br> Las plantas propias de la localidad donde vives no requieren demasiado uso de agua, y sus beneficios son mayores al absorber el CO2 del aire.</p>",
        undefined: "<h3>No entra en la condición</h3>",
      };

      // Verifica si existe un siguiente diálogo
      if (this.activeDialog + 1 < this.dialogs.length) {
        // Asigna los consejos correspondientes al contenido del siguiente diálogo
        this.dialogs[this.activeDialog + 1].content = tip[this.CarbonFootPrint.nivelCarbono];
        this.dialogs[this.activeDialog + 1].nextDialog = this.CarbonFootPrint.nivelCarbono === "baja" ? 21 : 23 
      }
    },

    GetName(numSelected, radioGroup, text) {
      console.log(`numSelected: ${numSelected}, radioGroup: ${radioGroup}, text: ${text}`);
      if (this.activeDialog + 1 < this.dialogs.length) {
        // Asigna los consejos correspondientes al contenido del siguiente diálogo
        this.dialogs[this.activeDialog + 1].content2 = `<h2 class='txt-gratula txt-green'>¡Felicidades!</h2><h2>${text}</h2><br>Avgust quiere concederte el diploma de<h2 class='txt-gratula txt-green'>Embajador Ambiental</h2> por tu labor de contribuir satisfactoriamente <br>a la reducción de la huella de carbono.`;
      }
     
      // Retorna un objeto con el nombre del archivo
      return { name: text };
    },

    exportToPDF() {
      // Obtiene el contenido del elemento con el id "content"
      let content = document.getElementById("content");

      // Configuración para la generación del PDF
      let options = {
        margin: 10,
        filename: "certificado.pdf",
        image: {
          type: 'png'
        },
        jsPDF: {
          unit: "mm",
          format: "letter",
          orientation: "landscape"
        }
      };

      // Genera el PDF usando html2pdf
      html2pdf(content, options);
    },

    SendMailFootprint() {
      console.log("Entra al último", this.CarbonFootPrint);
      // Implementa aquí la lógica para enviar el correo con los datos de la huella de carbono
    },

  },

};
</script>

<!-- Estilos del componente -->
<style scoped>
@import url(../assets/formcard.css);
</style>
