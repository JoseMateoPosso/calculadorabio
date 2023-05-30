<template>
    <v-col sm="5">
        <v-radio-group :value="response.radioGroup" @input="updateRadioGroup">
            <v-row>
                <h3 class="text-center">Zona de Vivienda {{ response.radioGroup }}</h3>
                <v-col cols="3" v-for="(item, i) in response.items" :key="i">
                    <v-card @click="updateRadioGroup(item.id)"
                        :class="{ 'selected-image': response.radioGroup === item.id }">
                        <v-img height="50" :src="item.image"
                            :class="{ 'image-filter': response.radioGroup === item.id }"></v-img>
                        <v-radio hide-details :label="item.label" :value="item.id"></v-radio>
                    </v-card>
                </v-col>
            </v-row>
        </v-radio-group>
    </v-col>
</template>
  
<script>
export default {
    props: {
        response: {
            type: Object,
            required: true,
        },
    },
    methods: {
        updateRadioGroup(value) {
            this.$emit('update:radioGroup', value);
        },
    },
}
</script>
  