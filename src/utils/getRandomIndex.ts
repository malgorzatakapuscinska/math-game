/**
 * Zwraca losowo wybrany indeks tablicy.
 *
 * @param tableLength - długość tablicy.
 * @returns Losowy indeks z zakresu od 0 do tableLength - 1.
 */

export const getRandomIndex = (tableLength: number) =>
  Math.floor(Math.random() * tableLength);
