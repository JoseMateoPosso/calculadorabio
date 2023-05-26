<template>
    <v-dialog :value="value" persistent max-width="900">
        <v-card height="60vh">
            <v-icon icon="mdi-vuetify" class="icon-back" @click="openDialog('dialog1')"></v-icon>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col>
                            <p>
                                <b>
                                    <h3>11¿Qué es la huella de carbono?</h3>
                                </b><br>
                                La huella de carbono representa el volumen total de <b>Gases de Efecto Invernadero (GEI)</b>
                                que producen las actividades económicas y cotidianas del ser humano.
                                <br><br>
                                <b>
                                    <h3>¿Para qué se calcula?</h3>
                                </b><br>
                                Es importante entender la huella de carbono como un primer paso en el camino a la mejora y
                                el compromiso de reducción de emisiones de Gases de Efecto Invernadero (GEI) para contribuir
                                a la lucha contra el cambio climático.
                            </p>
                        </v-col>
                        <v-col sm="4">
                            <img v-bind:src="require('@/assets/imgs/ardilla.png')" height="250" />
                            <v-btn color="green darken-1" class="mb-5" text @click="openDialog('dialog3')">Siguiente</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
  
<script>
export default {
    props: ['value'],
    methods: {
        close() {
            this.$emit('input', false);
        },
        openDialog(tdialog) {
            this.$emit('collected-data', null, tdialog);
            this.close();
        }
    }
};
</script>