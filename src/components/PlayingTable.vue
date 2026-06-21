/** Komponent odpowiedzialny za obsługę rozgrywki. Funkcjonalności: generowanie
pytań z tabliczki mnożenia, losowanie kolejności pytań, losowanie aktualnego
pytania, generowanie zestawu odpowiedzi (1 poprawna + 3 błędne), przechowywanie
stanu graczy oraz przebiegu gry. */ /** /** TODO remove plaers to data directory
*/

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Player } from "../types/player";
import type { Question } from "../types/question";
import type { RoundState } from "../types/round-state";
import { players as initialPlayers } from "../data/players";
import { roundState as initiaRoundState } from "../data/round-stete";
import { MIN_HP, MAX_HP, MIN_POWER, MAX_POWER } from "../assets/game-rules";

/*
Informacja czy gra została rozpoczęta.
*/
const gameStarted = ref(false);

/**
Tablica wszystkich pytań dostępnych w bieżącej rozgrywce.
*/
const questions = ref<Question[]>([]);

const playersData = ref<Player[]>(structuredClone(initialPlayers));

const players = ref<number[]>([0, 1]);

let gameWinnerId = ref<number | null>(null);

const gamePlayers = computed(() =>
  players.value
    .map((id) => getPlayerByID(id))
    .filter((player) => player !== undefined),
);

const gameWinner = computed(() => {
  if (gameWinnerId.value === null) return null;

  return getPlayerByID(gameWinnerId.value);
});

const roundState = ref<RoundState>(structuredClone(initiaRoundState));

const initRoundState = (initiaRoundState: RoundState) => {
  return structuredClone(initiaRoundState);
};

/**
 * ustawia stan rundy
 *
 *
 * @param players tablica zawierająca id aktualnych graczy
 * @param roundNo
 * @param currentPlayerId
 * @param opponentId
 * @param currentQuestion
 * @param answers
 */

const setRoundState = (
  roundNo: number | null,
  currentPlayerId: number,
  opponentId: number,
  currentQuestion: Question | null,
  answers: number[],
) => {
  roundState.value = {
    roundNo,
    currentPlayerId,
    opponentId,
    currentQuestion,
    answers,
  };
};

const randomIndex = (): number =>
  Math.floor(Math.random() * players.value.length);

const getPlayerByID = (id: number | null) => {
  if (id === null) return;
  return playersData.value.find((player) => player.id === id);
};

/**

Rozpoczyna nową grę.

Działanie:

generuje pytania,
tasuje ich kolejność,
losuje pierwsze pytanie,
generuje odpowiedzi,
ustawia stan rundy
ustawia stan gry jako rozpoczęty.

@returns void
*/
const startGame = () => {
  gameStarted.value = false;
  gameWinnerId.value = null;
  const initialPlayerId = playersData.value[randomIndex()].id;
  const opponentId = playersData.value.filter(
    (player) => player.id !== initialPlayerId,
  )[0].id;
  questions.value = shuffle(generateQuestions(2, 4));
  const currentQuestion = drawQuestion(questions.value);

  if (!currentQuestion) return;

  const possibleAnswers = generatePossibleAnswers(
    currentQuestion.answer,
    2,
    40,
    5,
  );

  const answers = generateAnswers(possibleAnswers, currentQuestion.answer);

  setRoundState(1, initialPlayerId, opponentId, currentQuestion, answers);

  gameStarted.value = true;
};

/**
Generuje wszystkie pytania dla wybranego zakresu tabliczki mnożenia.

@param min Minimalna wartość pierwszego czynnika.
@param max Maksymalna wartość pierwszego czynnika.

@returns Tablica obiektów Question.
*/

const generateQuestions = (min: number, max: number): Question[] => {
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
): number[] => {
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
  const fourItemsArray: number[] = [];
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

// const shuffle = <T,>(array: T[]): T[] => {
//   return [...array].sort(() => Math.random() - 0.5);
// };

const shuffle = <T,>(array: T[]): T[] => {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

/**
Losuje kolejne pytanie z puli pytań.
Pobiera pierwszy element tablicy questions
i ustawia go jako aktualne pytanie.

@returns void
*/

const drawQuestion = (questions: Question[]) => {
  return questions.shift() ?? null;
};

/**
Generuje odpowiedzi dla aktualnego pytania
i zapisuje je do zmiennej answers.

@returns void
*/

// const drawAnswers = (currentQuestion: Question, possibleAnswers: number[]) => {
// for possibility currenQuestion equels null
// if (!currentQuestion.value) {
//   return;
// }

//   const localArray = generateAnswers(possibleAnswers, currentQuestion.answer);

//   return localArray;
// };

const handleAnswerClick = (answer: number | null) => {
  let { currentPlayerId, currentQuestion, opponentId, roundNo } =
    roundState.value;
  if (!currentQuestion) return;

  const owner = getPlayerByID(currentPlayerId);
  const opponent = getPlayerByID(opponentId);
  const nextQuestion: Question | null = drawQuestion(questions.value);
  const nextAnswers: number[] | null = generateAnswers(
    generatePossibleAnswers(nextQuestion!.answer, 2, 40, 5),
    nextQuestion!.answer,
  );

  if (!owner) return;
  if (!opponent) return;

  if (answer === currentQuestion.answer) {
    owner.power = Math.min(MAX_POWER, owner.power + 1); //min=0 nmax = 6
    owner.wins++;
    opponent.hp = Math.max(MIN_HP, opponent.hp - 1);
  } else {
    owner.hp = Math.max(MIN_HP, owner.hp - 1); // (max= 10 min=0)
  }

  if (owner.hp === 0) {
    gameWinnerId.value = opponent.id;
    opponent.wins++;
  }

  if (opponent.hp === 0) {
    gameWinnerId.value = owner.id;
    owner.wins++;
  }

  if (opponent.hp === 0 || owner.hp === 0) {
    roundNo = null;
  } else roundNo = (roundNo ?? 0) + 1;

  setRoundState(
    roundNo,
    opponentId!,
    currentPlayerId!,
    nextQuestion,
    nextAnswers,
  );

  if (gameWinnerId.value !== null) {
    gameStarted.value = false;
  }

  console.log("state after", roundState.value);
};
</script>

<template>
  <section
    id="plaing-table"
    class="flex flex-col gap-10 justify-center items-center h-screen"
  >
    <div class="w-[300px]" v-if="gamePlayers.length >= 2">
      <div class="relative">
        <p>Gracz1: {{ gamePlayers[0]?.name }}</p>
        <div
          class="bg-blue-500 absolute right-1 top-0"
          v-if="roundState.currentPlayerId === 0"
        >
          <span class="text-white">Gracz aktywny</span>
        </div>
      </div>
      <p>Health: {{ gamePlayers[0]?.hp }}</p>
      <p>Pasek Mocy: {{ gamePlayers[0]?.power }}</p>
    </div>
    <div
      id="question"
      class="w-[300px]"
      v-if="roundState.currentQuestion && gameStarted"
    >
      Pytanie: {{ roundState.currentQuestion.num1 }} *
      {{ roundState.currentQuestion.num2 }} = ???
    </div>
    <div v-if="gameWinnerId !== null">
      <p>Wygrana !!. Gratulacje {{ gameWinner?.name }}.</p>
      <p>Czy chcesz zagrać jeszcze raz?</p>
    </div>
    <div id="start-button" v-if="!gameStarted" @click="startGame">Start</div>
    <div
      id="answers"
      v-if="gameStarted"
      class="grid grid-cols-2 gap-4 w-[300px]"
    >
      <button
        type="button"
        @click="handleAnswerClick(answer)"
        class="p-2 border-2 border-solid"
        v-for="answer in roundState.answers"
        :key="answer"
      >
        {{ answer }}
      </button>
    </div>
    <div id="player2-table" class="w-[300px]" v-if="gamePlayers.length >= 2">
      <div class="relative">
        <p>Gracz2: {{ gamePlayers[1]?.name }}</p>
        <div
          class="bg-blue-500 absolute right-1 top-0"
          v-if="roundState.currentPlayerId === 1"
        >
          <span class="text-white">Gracz aktywny</span>
        </div>
      </div>
      <p>Health: {{ gamePlayers[1]?.hp }}</p>
      <p>Pasek Mocy: {{ gamePlayers[1]?.power }}</p>
    </div>
  </section>
</template>
