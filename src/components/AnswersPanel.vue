<script setup lang="ts">
const { answers } = defineProps<{
  answers: number[];
}>();

const emitAnswer = defineEmits<{
  answerClick: [answer: number];
}>();
</script>

<template>
  <div class="grid grid-cols-2 gap-4 w-[300px]">
    <button
      type="button"
      @click="emitAnswer('answerClick', answer)"
      class="p-2 border-2 border-solid"
      v-for="answer in answers"
      :key="answer"
    >
      {{ answer }}
    </button>
  </div>
</template>
