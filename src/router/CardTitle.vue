<template>
    <v-card-title>
        <h4 v-if="title" v-html="title"></h4>
        <v-progress-linear color="green" :model-value="progress"></v-progress-linear>
    </v-card-title>
</template>
  
<script>
export default {
    props: {
        title: {
            type: String,
            default: null
        },
        progress: {
            type: Number,
            required: true
        }
    }
}
</script>
  