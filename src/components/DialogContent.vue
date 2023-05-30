<template>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col>
            <p v-if="content" v-html="content"></p>
            <img v-if="img" :src="img.url" :height="img.height" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </template>
  
  <script>
  export default {
    props: {
      content: {
        type: String,
        default: '',
      },
      img: {
        type: Object,
        default: null,
      },
    },
  }
  </script>
  