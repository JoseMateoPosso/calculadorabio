<template>
    <v-dialog :value="value" persistent max-width="900">
        <v-card height="60vh">
            <v-icon icon="mdi-vuetify" class="icon-back" @click="collectData('dialog3')"></v-icon>
            <v-card-text>
                <v-container>
                    <v-form @submit.prevent="collectData('dialog4')">
                        <v-row>
                            <v-col>
                                <b>
                                    <h3 class="tex-center">¿Cuántas personas viven contigo?</h3>
                                    <v-text-field variant="solo" type="number"></v-text-field>
                                </b>
                                <v-container>
                                    <b>
                                        <h3 class="text-center">Zona de Vivienda {{ radioGroup }}</h3>
                                    </b>
                                    <v-radio-group v-model="radioGroup">
                                        <v-row>
                                            <v-col cols="4" v-for="(item, i) in items" :key="i">
                                                <v-card @click="radioGroup = item.id"
                                                    :class="{ 'selected-image': radioGroup === item.id }">
                                                    <v-img height="50" :src="item.image"
                                                        :class="{ 'image-filter': radioGroup === item.id }"></v-img>
                                                    <v-radio hide-details :label="item.label" :value="item.id"></v-radio>
                                                </v-card>
                                            </v-col>
                                        </v-row>
                                    </v-radio-group>
                                </v-container>
                                <p v-if="!isOptionSelected" class="error-message">Debes seleccionar una opción.</p>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
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
                { image: require('@/assets/imgs/urbana.png'), label: 'Imagen 1', id: 1 },
                { image: 'https://www.colorazul.top/wp-content/uploads/2020/04/Azul-Cer%C3%BAleo-300x300.jpg', label: 'Imagen 2', id: 2 }
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
  