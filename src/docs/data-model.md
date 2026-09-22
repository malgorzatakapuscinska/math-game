    # Model danych

## GameConfig

Opisuje konfigurację nowej gry.

Przechowuje:

- levelId
- operation

Odpowiada za:

- wybór poziomu
- wybór rodzaju działań matematycznych

Nie przechowuje:

- pytań
- graczy
- stanu rozgrywki

## Player

Opisuje pojedynczego gracza.

Przechowuje:

- id
- name
- hp
- power
- wins

Odpowiada za:

- aktualny stan gracza
- statystyki zwycięstw

Nie przechowuje:

- pytania
- odpowiedzi
- informacje o rundzie

## Question

Opisuje jedno pytanie matematyczne.

Przechowuje:

- num1
- num2
- answer

Odpowiada za:

- dane potrzebne do wyświetlenia pytania
- poprawną odpowiedź

Nie przechowuje:

- możliwych odpowiedzi
- informacji o graczu

## RoundState

Opisuje aktualną rundę.

Przechowuje:

- roundNo
- currentPlayerId
- opponentId
- currentQuestion
- answers

Odpowiada za:

- informacje potrzebne do rozegrania jednej rundy

Nie przechowuje:

- HP graczy
- moc graczy
- konfigurację gry


## Stan gry

Stan gry składa się z:

- gameStarted
- gameWinnerId
- playersData
- questions
- roundState
- gameConfig