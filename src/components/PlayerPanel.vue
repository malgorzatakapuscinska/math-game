<script setup lang="ts">
import type { Player } from "../types/player";
const { player, currentPlayerId } = defineProps<{
  player: Player;
  currentPlayerId: number | null;
}>();
</script>

<template>
  <div class="relative">
    <p>{{ player.name }}</p>
    <div
      class="bg-blue-500 absolute right-1 top-0"
      v-if="currentPlayerId === player.id"
    >
      <span class="text-white">Gracz aktywny</span>
    </div>
  </div>
  <p>Pasek zdrowia: {{ player.hp }}</p>
  <p>Pasek Mocy: {{ player.power }}</p>
</template>
