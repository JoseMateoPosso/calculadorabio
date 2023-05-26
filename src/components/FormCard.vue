<template>
  <div :class="{ 'dialog-background': isFirstDialogOpen }" id="app" data-v-app>
    <img v-if="!isFirstDialogOpen" v-bind:src="require('@/assets/imgs/Header.png')" alt="Imagen de descripción"
      height="250">
    <!-- Otros componentes ... -->
    <Dialog1 v-model="dialogs.dialog1" @click="changeDialog('dialog2')" />
    <Dialog2 v-model="dialogs.dialog2" @collected-data="handleCollectedData"/>
    <Dialog3 v-model="dialogs.dialog3" @collected-data="handleCollectedData" />
    <Dialog4 v-model="dialogs.dialog4" @collected-data="handleCollectedData" />
  </div>
</template>

<script>
import Dialog1 from './dialogs/FormDialog1.vue';
import Dialog2 from './dialogs/FormDialog2.vue';
import Dialog3 from './dialogs/FormDialog3.vue';
import Dialog4 from './dialogs/FormDialog4.vue';

export default {
  components: {
    Dialog1,
    Dialog2,
    Dialog3,
    Dialog4
  },
  data() {
    return {
      dialogs: {
        dialog1: true,
        dialog2: false,
        dialog3: false,
        dialog4: false,
      },
      // tu data...
    };
  },
  computed: {
    isFirstDialogOpen() {
      return this.dialogs.dialog1;
    }
  },
  methods: {
    changeDialog(targetDialog) {
      // Primero, cierra todos los diálogos
      for (let dialog in this.dialogs) {
        this.dialogs[dialog] = false;
      }

      // Luego, abre el diálogo objetivo
      this.dialogs[targetDialog] = true;
    },
    handleCollectedData(data, dialog) {
      //console.log("data", data, "dialog", dialog)
      this.changeDialog(dialog)
    }
  }
};
</script>
<style scoped>
@import url(../assets/formcard.css);
</style>