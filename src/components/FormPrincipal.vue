<template>
    <p>hola mundo</p>
    <v-dialog :value="value" persistent max-width="900">
        <v-card height="60vh" class="fisrt-card">
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col>
                            <img v-bind:src="require('@/assets/imgs/texto.png')" alt="" width="300">
                        </v-col>
                        <v-col class="popgray" sm="5">
                            <v-btn color="green darken-1" class="mb-5" text @click="collectData('dialog2')">Empezar</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
//import dialogsinfo from "./Form.json"

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