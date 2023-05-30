<template>
    <v-dialog :value="value" persistent max-width="900">
        <v-card height="70vh" class="fisrt-card">
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col>
                            <img v-bind:src="require('@/assets/imgs/texto.png')" alt="" width="300">
                        </v-col>
                        <v-col class="popgray" sm="5">
                            <p>En <b>Avgust </b> queremos ayudar al
                                planeta, por eso, te invitamos
                                reducir tu <b>impacto ambiental</b>.
                                <br><br>Descubre cómo puedes ayudar
                                al planeta, <b>¡Calculando tu
                                    huella de carbono ahora!</b>
                            </p>
                            <v-btn color="green darken-1" class="mb-5" text @click="collectData('dialog2')">Empezar</v-btn>
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
        collectData(tdialog) {
            this.close();
            this.$emit('collected-data', null, tdialog);
        }
    }
};
</script>
  