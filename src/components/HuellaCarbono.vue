<template>
  <div>
      <h1>Calculadora de huella de carbono</h1>
      <form @submit.prevent="calculateFootprint">
          <label for="numPeople">Número de personas que viven contigo:</label>
          <input type="number" id="numPeople" v-model.number="numPeople" min="0" required><br><br>

          <label for="electricityConsumption">Consumo mensual de electricidad (kWh):</label>
          <input type="number" id="electricityConsumption" v-model.number="electricityConsumption" min="0"
              required><br><br>

          <label for="gasConsumption">Consumo mensual de gas (m³):</label>
          <input type="number" id="gasConsumption" v-model.number="gasConsumption" min="0" required><br><br>

          <label for="cookingFuel">Tipo de combustible para cocinar:</label>
          <select id="cookingFuel" v-model="cookingFuel" required>
              <option value="gasNatural">Gas natural</option>
              <option value="gasPropano">Gas propano</option>
          </select><br><br>

          <label for="transportationMode">Modo de transporte:</label>
          <select id="transportationMode" v-model="transportationMode" required>
              <option value="public">Transporte masivo</option>
              <option value="private">Vehículo particular</option>
              <option value="motorcycle">Moto</option>
              <option value="bicycle">Bicicleta</option>
              <option value="onFoot">A pie</option>
          </select><br><br>

          <label for="distancePerDay">Distancia recorrida diariamente (km):</label>
          <input type="number" id="distancePerDay" v-model.number="distancePerDay" min="0" required><br><br>

          <label for="fuelType">Tipo de combustible:</label>
          <select id="fuelType" v-model="fuelType" required>
              <option value="ACPM">ACPM</option>
              <option value="Combustoleo">Combustóleo</option>
              <option value="CrudoCastilla">Crudo de Castilla</option>
              <option value="DieselGenerico">Diesel Genérico</option>
              <option value="GasolinaGenerico">Gasolina Genérico</option>
              <option value="KeroseneCol">Kerosene Col.</option>
              <option value="KeroseneGenerico">Kerosene Genérico</option>
              <option value="OilCrude">Oil Crude</option>
              <option value="BiodieselGenerico">Biodiesel Genérico</option>
              <option value="BiogasolinaGenerica">Biogasolina Genérica</option>
          </select><br><br>

          <label for="recycle">¿Recicla?:</label>
          <select id="recycle" v-model="recycle" required>
              <option value="yes">Sí</option>
              <option value="no">No</option>
          </select><br><br>

          <button type="submit">Calcular huella de carbono</button>
      </form>
  </div>
</template>
<script>
export default {
  data() {
      return {
          numPeople: 0,
          electricityConsumption: 0,
          gasConsumption: 0,
          cookingFuel: "",
          transportationMode: "",
          distancePerDay: 0,
          fuelType: "",
          recycle: "",
      };
  },
  methods: {
      calculateFootprint() {
          const housingFootprint = this.calculateHousingFootprint(
              this.electricityConsumption,
              this.gasConsumption,
              this.cookingFuel
          );

          const transportationFootprint = this.calculateTransportationFootprint(
              this.transportationMode,
              this.distancePerDay,
              this.fuelType
          );

          const totalFootprint = housingFootprint + transportationFootprint;
          const recyclingFactor = this.recycle === "yes" ? 0.1 * 1.7 : 0;
          const totalFootprintWithRecycling = totalFootprint - recyclingFactor;

          console.log("Huella de carbono total:", totalFootprintWithRecycling);
      },

      calculateHousingFootprint(electricityConsumption, gasConsumption, cookingFuel) {
          const electricityFootprint =
              (electricityConsumption * 12 * 0.203 * (1 / 1000)) / this.numPeople;
          const gasEmissionFactor = (1.9801 * 0.009) + (0.0357 * 0.914);
          const gasFootprint =
              (gasConsumption * 12 * gasEmissionFactor * (1 / 1000)) / this.numPeople;

          let co2Emissions = 0;
          co2Emissions += electricityFootprint;

          if (cookingFuel === "gasNatural" || cookingFuel === "gasPropano") {
              co2Emissions += gasFootprint;
          }

          return co2Emissions;
      },

      calculateTransportationFootprint(transportationMode, distancePerDay, fuelType) {
          const emissionFactors = {
              ACPM: 10.15,
              Combustoleo: 11.0,
              CrudoCastilla: 12.0,
              DieselGenerico: 12.15,
              GasolinaGenerico: 8.15,
              KeroseneCol: 9.5,
              KeroseneGenerico: 10.0,
              OilCrude: 11.0,
              BiodieselGenerico: 3.0,
              BiogasolinaGenerica: 3.5,
          };

          const distancePerYear = distancePerDay * 365;
          const fuelEmissionFactor = emissionFactors[fuelType] || 0;

          const co2Emissions = (distancePerYear * fuelEmissionFactor * (1 / 1000)) / this.numPeople;

          return co2Emissions;
      },
  },
};
</script>