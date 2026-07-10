/**
Generuje wszystkie pytania dla wybranego zakresu tabliczki mnożenia.

@param min Minimalna wartość pierwszego czynnika.
@param max Maksymalna wartość pierwszego czynnika.

@returns Tablica obiektów Question.
*/

import type { Question } from "../types/question";

export const generateQuestions = (min: number, max: number): Question[] => {
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
