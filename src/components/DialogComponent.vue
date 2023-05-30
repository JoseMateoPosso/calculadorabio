<template>
  <v-dialog v-model="isOpen" persistent max-width="900">
    <v-card height="60vh" :class="{ 'fisrt-card': isFirstDialogOpen }">
      <slot></slot>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Object,
      required: true,
    },
    isFirstDialogOpen: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isOpen: {
      get() {
        return this.dialog.open;
      },
      set(val) {
        this.$emit('update:dialogOpen', val);
      },
    },
  },
}
</script>
