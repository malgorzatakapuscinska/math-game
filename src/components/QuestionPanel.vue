<script setup lang="ts">
import type { Question } from "../types/question";
const { question } = defineProps<{
  question: Question;
}>();
</script>
<template>
  <div class="w-[300px]">
    Pytanie: {{ question.num1 }} * {{ question.num2 }} = ???
  </div>
</template>
