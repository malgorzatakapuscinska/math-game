<script setup lang="ts">
import { ref } from "vue";
import type { Player } from "../types/player";
import type { Question } from "../types/question";

const gameStarted = ref(false);
const questions = ref<Question[]>([]);
const currentQuestion = ref<Question | null>(null);
const answers = ref<number[]>([]);
const players = ref<Player[]>([
  {
    id: 0,
    name: "Komputer",
    hp: 100,
    power: 0,
    wins: 0,
  },
  {
    id: 1,
    name: "Marek",
    hp: 100,
    power: 0,
    wins: 0,
  },
]);

const startGame = () => {
  drawQuestion();
  gameStarted.value = true;
};

const generateQuestions = (min: number, max: number) => {
  const questionsTable: Question[] = [];
  for (let num1 = min; num1 <= max; num1++) {
    for (let num2 = 1; num2 <= 10; num2++) {
      questionsTable.push({
        num1,
        num2,
        answer: num1 * num2,
      });
    }
  }

  return questionsTable;
};

const shuffleQuestions = (questions: Question[]): Question[] => {
  return [...questions].sort(() => Math.random() - 0.5);
};

questions.value = shuffleQuestions(generateQuestions(2, 4));

const drawQuestion = () => {
  currentQuestion.value = questions.value.shift() ?? null;
};
</script>

<template>
  <section
    id="plaing-table"
    class="flex flex-col gap-10 justify-center items-center h-screen"
  >
    <div id="player1-table" class="w-[300px]">
      <p>Gracz1: {{ players[0].name }}</p>
      <p>Health: {{ players[0].hp }}</p>
      <p>Pasek Mocy: {{ players[0].power }}</p>
    </div>
    <div id="question" class="w-[300px]" v-if="currentQuestion && gameStarted">
      Pytanie: {{ currentQuestion.num1 }} * {{ currentQuestion.num2 }} = ???
    </div>
    <div id="start-button" v-if="!gameStarted" @click="startGame">Start</div>
    <div id="answers" v-if="gameStarted">
      <button type="button"></button>
      <button type="button"></button>
      <button type="button"></button>
      <button type="button"></button>
    </div>
    <div id="player2-table" class="w-[300px]">
      <p>Gracz2: {{ players[1].name }}</p>
      <p>Health: {{ players[1].hp }}</p>
      <p>Pasek Mocy: {{ players[1].power }}</p>
    </div>
  </section>
</template>
