<template>
    <v-dialog :value="value" persistent max-width="900">
        <v-card height="60vh">
            <v-icon icon="mdi-vuetify" class="icon-back" @click="openDialog('dialog2')"></v-icon>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col>
                            <b>
                                <h3>¿Qué necesitas para calcular tu huella?</h3>
                            </b><br>
                            <ul>
                                <li>Necesitas tus facturas de <b>gas y energía eléctrica.</b></li>
                                <li>En tu factura de consumo de <b>gas</b>, te aparece tu consumo en <b>m3</b></li>
                                <li>En tu factura de consumo de <b>energía eléctrica</b>, te aparece tu consumo en
                                    <b>kw/h</b>
                                </li>
                            </ul>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <img v-bind:src="require('@/assets/imgs/FUEGO.png')" alt="">
                                    </v-col>
                                    <v-col>
                                        <img v-bind:src="require('@/assets/imgs/Corriente.png')" alt="">
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-col>
                        <v-col sm="4">
                            <img v-bind:src="require('@/assets/imgs/ardilla.png')" height="250" />
                            <v-btn color="green darken-1" class="mb-5" text @click="openDialog('dialog4')">Siguiente</v-btn>
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