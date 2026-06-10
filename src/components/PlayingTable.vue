/** Komponent odpowiedzialny za obsługę rozgrywki. Funkcjonalności: generowanie
pytań z tabliczki mnożenia, losowanie kolejności pytań, losowanie aktualnego
pytania, generowanie zestawu odpowiedzi (1 poprawna + 3 błędne), przechowywanie
stanu graczy oraz przebiegu gry. */ /**

<script setup lang="ts">
import { ref } from "vue";
import type { Player } from "../types/player";
import type { Question } from "../types/question";

/*
Informacja czy gra została rozpoczęta.
*/
const gameStarted = ref(false);

/**
Tablica wszystkich pytań dostępnych w bieżącej rozgrywce.
*/
const questions = ref<Question[]>([]);

/*
Aktualnie wyświetlane pytanie.
Wartość null oznacza brak aktywnego pytania.
*/
const currentQuestion = ref<Question | null>(null);

/*
Aktualnie wyświetlane odpowiedzi.
Zawiera jedną poprawną i trzy błędne odpowiedzi.
*/
const answers = ref<number[]>([]);

/*
Dane graczy biorących udział w rozgrywce.
*/
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

/**

Rozpoczyna nową grę.

Działanie:

generuje pytania,
tasuje ich kolejność,
losuje pierwsze pytanie,
generuje odpowiedzi,
ustawia stan gry jako rozpoczęty.

@returns void
*/

const startGame = () => {
  questions.value = shuffle(generateQuestions(2, 4));
  drawQuestion();
  drawAnswers();
  gameStarted.value = true;
};

/**
Generuje wszystkie pytania dla wybranego zakresu tabliczki mnożenia.

@param min Minimalna wartość pierwszego czynnika.
@param max Maksymalna wartość pierwszego czynnika.

@returns Tablica obiektów Question.
*/

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

/**

Generuje pulę potencjalnych błędnych odpowiedzi.

Zwracana tablica nie zawiera poprawnej odpowiedzi.

Przykład:
answer = 18
offset = 5
wynik:
[13,14,15,16,17,19,20,21,22,23]

@param answer Poprawna odpowiedź.
@param min Minimalna dopuszczalna wartość odpowiedzi.
@param max Maksymalna dopuszczalna wartość odpowiedzi.
@param offset Maksymalne odchylenie od poprawnej odpowiedzi.

@returns Tablica potencjalnych błędnych odpowiedzi.
*/

const generatePossibleAnswers = (
  answer: number,
  min: number,
  max: number,
  offset: number,
) => {
  const table: number[] = [];
  const localMin = Math.max(answer - offset, min);
  const localMax = Math.min(answer + offset, max);

  for (let i = localMin; i <= localMax; i++) {
    table.push(i);
  }

  return table.filter((tableItem) => tableItem !== answer);
};

/**

Tworzy finalny zestaw odpowiedzi wyświetlany graczowi.

Działanie:

tasuje pulę błędnych odpowiedzi,
wybiera 3 odpowiedzi,
dodaje poprawną odpowiedź,
ponownie tasuje wynik.

@param array Tablica błędnych odpowiedzi.
@param answer Poprawna odpowiedź.

@returns Tablica 4 odpowiedzi gotowych do wyświetlenia.
*/
const generateAnswers = (array: number[], answer: number): number[] => {
  const localArray = shuffle(array);
  const fourItemsArray = [];
  for (let i = 0; i < 3; i++) {
    fourItemsArray.push(localArray[i]);
  }

  fourItemsArray.push(answer);
  return shuffle(fourItemsArray);
};

/**
Tasuje elementy tablicy.
Funkcja generyczna - działa z dowolnym typem danych.

@param array Tablica do przetasowania.

@returns Nowa przetasowana tablica.
*/

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

/**
Losuje kolejne pytanie z puli pytań.
Pobiera pierwszy element tablicy questions
i ustawia go jako aktualne pytanie.

@returns void
*/

const drawQuestion = () => {
  currentQuestion.value = questions.value.shift() ?? null;
};

/**
Generuje odpowiedzi dla aktualnego pytania
i zapisuje je do zmiennej answers.

@returns void
*/

const drawAnswers = () => {
  // for possibility currenQuestion equels null
  if (!currentQuestion.value) {
    return;
  }

  const localArray = generateAnswers(
    generatePossibleAnswers(currentQuestion.value.answer, 2, 40, 5),
    currentQuestion.value.answer,
  );

  answers.value = localArray;
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
      <button type="button" class="" v-for="answer in answers" :key="answer">
        {{ answer }}
      </button>
    </div>
    <div id="player2-table" class="w-[300px]">
      <p>Gracz2: {{ players[1].name }}</p>
      <p>Health: {{ players[1].hp }}</p>
      <p>Pasek Mocy: {{ players[1].power }}</p>
    </div>
  </section>
</template>
