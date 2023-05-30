<template>
    <v-dialog :value="value" persistent max-width="900">
        <v-card height="70vh">
            <v-icon icon="mdi-vuetify" class="icon-back" @click="collectData('dialog3')"></v-icon>
            <v-card-text>
                <v-container>
                    <v-form @submit.prevent="collectData('dialog4')">
                        <v-row>
                            <v-col>
                                <v-container>
                                    <v-row class="justify-center">
                                        <v-col sm="8">
                                            <b>
                                                <h3 class="text-center mb-5">¿Cuántas personas viven contigo?</h3>
                                                <v-text-field variant="solo" type="number"></v-text-field>
                                                <v-text-field>
                                                    <template v-slot:append>
                                                        <v-icon color="red">
                                                            mdi-plus
                                                        </v-icon>
                                                    </template>
                                                    <template v-slot:prepend>
                                                        <v-icon color="green">
                                                            mdi-minus
                                                        </v-icon>
                                                    </template>
                                                </v-text-field>
                                            </b>
                                        </v-col>
                                    </v-row>
                                    <b>
                                        <h3 class="text-center mb-5">Zona de Vivienda {{ radioGroup }}</h3>
                                    </b>
                                    <v-radio-group v-model="radioGroup">
                                        <v-row class="justify-center">
                                            <v-col sm="3" v-for="(item, i) in items" :key="i">
                                                <v-card class="card-option" @click="radioGroup = item.id"
                                                    :class="{ 'selected-image': radioGroup === item.id }">
                                                    <v-radio hide-details :label="item.label" :value="item.id"></v-radio>
                                                    <v-img height="80" :src="item.image"
                                                        :class="{ 'image-filter': radioGroup === item.id }"></v-img>

                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-radio-group>
                                </v-container>
                                <p v-if="!isOptionSelected" class="error-message">Debes seleccionar una opción.</p>
                            </v-col>                            
                            <v-col sm="12">
                                <v-btn type="submit" color="green darken-1" class="mb-5" text>Recoger datos</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
  
<script>
export default {
    props: ['value'],
    data() {
        return {
            radioGroup: null,
            items: [
                { image: require('@/assets/imgs/urbana.png'), label: 'URBANA 1', id: 1 },
                { image: require('@/assets/imgs/rural.png'), label: 'RURAL', id: 2 }
            ],
        };
    },
    computed: {
        isOptionSelected() {
            return this.radioGroup !== null;
        }
    },
    methods: {
        close() {
            this.$emit('input', false);
        },
        collectData(tdialog) {
            if (this.isOptionSelected || tdialog == 'dialog3') {
                this.$emit('collected-data', this.radioGroup, tdialog);
                this.close();
            }
        }
    }
};
</script>
  
<style scoped>
.error-message {
    color: red;
    margin-top: 0px;
}
</style>
  