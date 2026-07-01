<script setup lang="ts">
const { playerName } = defineProps<{
  playerName: string;
}>();
</script>

<template>
  <div>
    <p>Wygrana !!. Gratulacje {{ playerName }}.</p>
    <p>Czy chcesz zagrać jeszcze raz?</p>
  </div>
</template>
