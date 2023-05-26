<template>
    <v-radio-group v-model="radioGroup">
        <v-row>
            <v-col cols="3" v-for="(item, i) in items" :key="i">
                <v-card @click="radioGroup = item.id" :class="{ 'selected-image': radioGroup === item.id }">
                    <v-img height="50" :src="item.image" :class="{ 'image-filter': radioGroup === item.id }"></v-img>
                    <v-radio hide-details :label="item.label" :value="item.id"></v-radio>
                </v-card>
            </v-col>
        </v-row>
    </v-radio-group>
</template>
  
<script>
export default {
    data() {
        return {
            radioGroup: null,
            items: [
                { image: require('@/assets/imgs/urbana.png'), label: 'Imagen 1', id: 1 },
                { image: 'https://www.colorazul.top/wp-content/uploads/2020/04/Azul-Cer%C3%BAleo-300x300.jpg', label: 'Imagen 2', id: 2 },
                { image: 'https://www.colorazul.top/wp-content/uploads/2020/04/Azul-Cer%C3%BAleo-300x300.jpg', label: 'Imagen 3', id: 3 },
                //... más items si es necesario
            ],
        }
    },
}
</script>
  
<style scoped>
.selected-image {
    border: 3px solid green;
    background: linear-gradient(45deg, #00b5e4, #60b343);
}
.image-filter {
    filter: brightness(3);
}
</style>
  