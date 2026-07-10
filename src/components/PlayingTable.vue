/** Komponent odpowiedzialny za obsługę rozgrywki. Funkcjonalności: generowanie
pytań z tabliczki mnożenia, losowanie kolejności pytań, losowanie aktualnego
pytania, generowanie zestawu odpowiedzi (1 poprawna + 3 błędne), przechowywanie
stanu graczy oraz przebiegu gry. */ /**

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Player } from "../types/player";
import type { Question } from "../types/question";
import type { RoundState } from "../types/round-state";
import { players as initialPlayers } from "../data/players";
import { roundState as initiaRoundState } from "../data/round-stete";
import { MIN_HP, MAX_HP, MIN_POWER, MAX_POWER } from "../assets/game-rules";
import { shuffle } from "../utils/shuffle.ts";
import { generateQuestions } from "../utils/generateQuestions.ts";
import type { GameConfig } from "../types/gameConfig";
import PlayerPanel from "./PlayerPanel.vue";
import GameInfo from "./GameInfo.vue";
import AnswersPanel from "./AnswersPanel.vue";
import QuestionPanel from "./QuestionPanel.vue";

/*
Informacja czy gra została rozpoczęta.
*/
const gameStarted = ref(false);

const gameConfig = ref<GameConfig>({
  levelId: 0,
  operation: "*",
});

const questionsTemplate = generateQuestions(3, 6);

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

const resetRoundState = () => {
  roundState.value = structuredClone(initiaRoundState);
};

const resetPlayerStats = () => {
  playersData.value.forEach((player) => {
    player.hp = MAX_HP;
    player.power = MIN_POWER;
  });
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

const setRoundState = (state: RoundState) => {
  roundState.value = state;
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
  resetRoundState();
  resetPlayerStats();
  gameStarted.value = false;
  gameWinnerId.value = null;
  const currentPlayerId = playersData.value[randomIndex()].id;
  const opponentId = playersData.value.filter(
    (player) => player.id !== currentPlayerId,
  )[0].id;
  const roundNo = 0;
  questions.value = shuffle([...questionsTemplate]);
  const currentQuestion = drawQuestion(questions.value);

  if (!currentQuestion) return;

  const possibleAnswers = generatePossibleAnswers(
    currentQuestion.answer,
    3,
    60,
    5,
  );

  const answers = generateAnswers(possibleAnswers, currentQuestion.answer);

  setRoundState({
    roundNo,
    currentPlayerId,
    opponentId,
    currentQuestion,
    answers,
  });

  gameStarted.value = true;
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

const handleAnswerClick = (answer: number) => {
  let { currentPlayerId, currentQuestion, opponentId, roundNo } =
    roundState.value;
  if (!currentQuestion) return;

  const owner = getPlayerByID(currentPlayerId);
  const opponent = getPlayerByID(opponentId);
  const nextQuestion: Question | null = drawQuestion(questions.value);
  const nextAnswers: number[] | null = generateAnswers(
    generatePossibleAnswers(nextQuestion!.answer, 3, 60, 5),
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

  setRoundState({
    roundNo,
    opponentId: currentPlayerId,
    currentPlayerId: opponentId,
    currentQuestion: nextQuestion,
    answers: nextAnswers,
  });

  if (gameWinnerId.value !== null) {
    gameStarted.value = false;
  }

  console.log("state after", roundState.value);
};
</script>

<template>
  <section class="flex flex-col gap-10 justify-center items-center h-screen">
    <PlayerPanel
      :player="playersData[0]"
      :current-player-id="roundState.currentPlayerId"
      v-if="gamePlayers.length >= 2"
    />
    <QuestionPanel
      v-if="roundState.currentQuestion && gameStarted"
      :question="roundState.currentQuestion"
    />
    <GameInfo v-if="gameWinner" :player-name="gameWinner?.name" />
    <div id="start-button" v-if="!gameStarted" @click="startGame">Start</div>
    <AnswersPanel
      v-if="gameStarted"
      @answer-click="handleAnswerClick"
      :answers="roundState.answers"
    />

    <PlayerPanel
      :player="playersData[1]"
      :current-player-id="roundState.currentPlayerId"
      v-if="gamePlayers.length >= 2"
    />
  </section>
</template>
