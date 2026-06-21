import type { Question } from "../types/question";

export interface RoundState {
  roundNo: number | null;
  currentPlayerId: number | null;
  opponentId: number | null;
  currentQuestion: Question | null;
  answers: number[] | null;
}
