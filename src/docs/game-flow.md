# Zasady gry

- HP nigdy nie spada poniżej 0.
- Moc nigdy nie przekracza MAX_POWER.
- Każda runda zawiera dokładnie jedno pytanie.
- Każde pytanie posiada dokładnie 4 odpowiedzi.
- Dokładnie jedna odpowiedź jest poprawna.
- Aktualny gracz zawsze istnieje.
- Zwycięzca istnieje dopiero po zakończeniu gry.

# Start gry

- zresetuj stan graczy
- zresetuj stan rundy
- wybierz pierwszego gracza
- wyznacz pozostałych graczy
- przygotuj pulę pytań
- wylosuj pierwsze pytanie
- wygeneruj odpowiedzi
- ustaw stan pierwszej rundy
- rozpocznij grę

# Odpowiedź gracza

- sprawdź odpowiedź checkAnswer()

- zaktualizuj HP updateHp()

- zaktualizuj moc updatePower()

- sprawdź, czy gra została zakończona checkWinner()

  TAK
  - ustaw zwycięzcę
  - zaktualizuj statystyki
  - zakończ grę
  - wyświetl GameInfo

  NIE prepareNextRound()
  - przygotuj kolejne pytanie
  - wygeneruj odpowiedzi
  - ustaw stan następnej rundy
