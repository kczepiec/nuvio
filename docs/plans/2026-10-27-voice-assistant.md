# Plan: głosowy asystent zamiast okienka czatu

## Cel

Okno Assist (`HGAssistUI` w `src/parts/hg-assist.part.js`, treść w `src/parts/cards/assist-card.part.js`) przestaje być czatem z dymkami. Zamiast dużego okna pojawia się kompaktowy szklany pasek u góry ekranu, jak powiadomienie: otwierasz (przycisk w nagłówku, klawisz A, karta), od razu słucha, pokazuje fale i to, co usłyszał, odczytuje odpowiedź na głos, w razie potrzeby słucha dalej, a potem sam znika. Dawny czat zostaje jako tryb do wyboru w ustawieniach.

## Stan obecny

- Tekst idzie do `assist_pipeline/run` od etapu `intent` (opcjonalnie do `tts`), w zapasie `conversation/process`.
- Mikrofon to Web Speech API przeglądarki (`_mic()`): działa tylko w Chrome/Edge/Safari, wysyła dźwięk do Google/Apple, ignoruje silnik STT ustawiony w Home Assistant.
- TTS jest domyślnie wyłączone (`tts: false`).
- Okno to jedna instancja na stronę; `conversation_id` trwa przez sesję. To zostaje.

## Decyzje projektowe

1. **Rozpoznawanie mowy przez potok Home Assistant**, nie przez przeglądarkę. Dźwięk z mikrofonu idzie strumieniem do `assist_pipeline/run` od etapu `stt` do `tts`. Dzięki temu działa skonfigurowany STT (Whisper, Home Assistant Cloud itd.), wykrywanie końca mowy (VAD) robi serwer, a zachowanie jest takie samo jak w aplikacji HA.
2. **Web Speech API zostaje jako zapas**, gdy strumień nie jest możliwy: brak bezpiecznego kontekstu (HA po `http://` w sieci lokalnej, `getUserMedia` wtedy nie działa) albo potok bez silnika STT. Jeśli i tego nie ma, okno otwiera się od razu w trybie pisania.
3. **Pasek bez przycisków.** Zamyka się sam po odpowiedzi, Escape albo kliknięciem obok. Pole tekstowe pojawia się w pasku tylko wtedy, gdy mikrofonu nie da się użyć (odmowa uprawnień, HTTP bez rozpoznawania w przeglądarce). Kto woli pisać, wybiera w ustawieniach „Okno czatu”.
4. **Bez słowa wybudzającego w tej wersji.** Ciągłe słuchanie w przeglądarce kosztuje baterię i prywatność; ewentualnie osobny etap dla trybu tabletu ściennego.

## Przepływ dźwięku (protokół)

1. `navigator.mediaDevices.getUserMedia({ audio: { echoCancellation, noiseSuppression, autoGainControl } })`.
2. `AudioContext` + `AudioWorklet` (kod workletu wstawiony przez `Blob` URL, bo paczka to jeden plik) zamienia Float32 na 16 kHz, mono, Int16 PCM.
3. `hass.connection.subscribeMessage(cb, { type: 'assist_pipeline/run', start_stage: 'stt', end_stage: 'tts', input: { sample_rate: 16000 }, pipeline, conversation_id })`.
4. Zdarzenie `run-start` daje `runner_data.stt_binary_handler_id`. Każda ramka audio: `connection.socket.send(Uint8Array[handlerId, ...pcm])`. Koniec audio: jedna ramka `[handlerId]`.
5. Zdarzenia: `stt-vad-start` / `stt-vad-end` (koniec mowy, zatrzymujemy mikrofon), `stt-end` (`stt_output.text`, pokazujemy co usłyszał), `intent-end` (odpowiedź, `conversation_id`, `continue_conversation`), `tts-end` (URL audio), `run-end`, `error`.
6. Po odtworzeniu TTS: jeśli `continue_conversation` jest prawdą (albo włączone „słuchaj dalej”), nowy przebieg od `stt` z tym samym `conversation_id`.
7. Dotknięcie kuli w trakcie mówienia przerywa odtwarzanie i od razu słucha (barge-in).

## Interfejs

Pasek u góry ekranu (84 px od góry na komputerze, szerokość do 1040 px; na telefonie 12 px od góry, pełna szerokość), w stylu szkła dashboardu, bez przyciemnienia tła:

- **Fale**: pięć pasków w kolorze akcentu po lewej, zarazem przycisk (start, stop, przerwanie odpowiedzi). Słuchanie: wysokość z głośności mikrofonu (`--lv`); myślenie: fala po kolei; mówienie: pulsowanie; spoczynek: kropki; błąd: kolor ostrzeżenia.
- **Tekst**: to, co usłyszał, w cudzysłowie z katalogu (`cards.assist.voice_quote`: „…”, “…”, « … »), pod spodem odpowiedź, „Myślę…” albo błąd. Przed pierwszym słowem stan („Słucham…”).
- **Ruch**: wjazd z góry ze sprężystym dojściem, szybki wyjazd w górę (tylko transform, szkło od pierwszej klatki); słowa wchodzą po kolei z rozmycia (klucz = numer słowa, więc przy dyktowaniu animuje się tylko nowe); odpowiedź rozsuwa pasek. Przy „ogranicz ruch” bez animacji.
- **Znikanie**: 2 s po odczytaniu odpowiedzi; bez głosu 2,5–8 s zależnie od długości; po błędzie tak samo. Nie znika, gdy słucha dalej albo jest otwarte pole tekstowe.
- Zamknięcie zatrzymuje mikrofon, strumień i odtwarzanie, zamyka `AudioContext`.
## Ustawienia (`HGL.data.assist`)

**Ustawienia > System > Assist** (`HGAssistUI.html()`):

| klucz | domyślnie | znaczenie |
|---|---|---|
| `mode` | `'voice'` | „Wygląd”: pasek głosowy albo okno czatu (`'text'`, dawny widok) |
| `listen` | `true` | słucha od razu po otwarciu (tylko pasek) |
| `continue` | `true` | słucha dalej, gdy asystent dopytuje (tylko pasek) |
| `tts` | `true` w pasku, `false` w czacie | zapisane `true`/`false` zawsze wygrywa |
| `mic` | `true` | w pasku: rozpoznawanie w potoku HA, bez HTTPS w przeglądarce; w czacie: dyktowanie |

Migracja: brak `mode` = pasek. `set()` zapisuje surowe pola plus zmianę, więc wartości wyliczone w `get()` (domyślny odczyt) nie trafiają do zapisu i nie przechodzą do trybu czatu. Kopia układu przenosi nowe klucze bez zmian.
## Podział kodu

- **`src/parts/hg-voice.part.js`**: czysta logika bez DOM. Wybór ścieżki, resampling i PCM, ramki binarne, kod AudioWorklet, wiadomości potoku, reduktor zdarzeń (`hg-start`, zdarzenia HA, `hg-spoken`, `hg-timeout`), `again()`. W `tools/build.py` przed `hg-assist.part.js`.
- **`assist-card.part.js`**: `mode: 'text'` to czat; inaczej pasek (`_rv`). Silnik dźwięku w karcie: `_listen`, `_stream`, `_chunk`, `_vev`, `_vstop`, `_auto`, `_dry` (podgląd `__hgDryRun`). Karta samodzielna bez zmian.
- **`hg-assist.part.js`**: klasa `vm` na warstwie zmienia okno w pasek; `open()` startuje słuchanie synchronicznie w geście; `close()` woła `_vstop(true)`; ustawienia w `html()`/`wire()`/`act()`.
- **Lokalizacje**: `cards.assist.voice_*` (stany, błędy, cudzysłów) i `assist.*` (ustawienia) w en, pl, fr, nl.
## Przypadki brzegowe

- Odmowa dostępu do mikrofonu: komunikat i przejście do pisania.
- HTTP bez bezpiecznego kontekstu: Web Speech, a gdy go nie ma, tekst plus podpowiedź o HTTPS.
- Potok bez STT (`assist_pipeline/pipeline/get` → `stt_engine` puste): to samo co wyżej.
- iOS Safari i aplikacja Companion: `AudioContext` tworzony w geście (otwarcie paska), trzymany do zamknięcia; dalsze słuchanie bez gestu może wymagać dotknięcia fal.
- Limit czasu: 30 s bez `run-end` kończy przebieg z błędem (jak teraz w `_send`).
- Tryb tabletu ściennego i blokada PIN: okno się nie otwiera, gdy `HGWall.active` (już tak jest).
- `window.__hgDryRun`: symulowana sekwencja stanów bez mikrofonu, do demo i zrzutów ekranu.

## Etapy

1. ✅ **Rdzeń głosu** (`hg-voice.part.js`), testy `tests/js/voice-core.test.mjs`.
2. ✅ **Pasek głosowy** zamiast okna: fale, tekst, animacje, znikanie, sprzątanie przy zamknięciu.
3. ✅ **Ustawienia i migracja**: wygląd, słuchanie po otwarciu, dalsza rozmowa; testy `tests/js/voice-settings.test.mjs`.
4. ✅ **Zapasy i przypadki brzegowe** w kodzie: błędy mikrofonu po rodzaju (`HGVoice.micKind`: odmowa, brak, zajęty; awaria dźwięku przechodzi na rozpoznawanie przeglądarki), błędy potoku po rodzaju (`errKind`), błąd tts po gotowej odpowiedzi to sukces bez dźwięku, błędy Web Speech (`speechKind`: no-speech, sieć), bez `connection.socket` nie ma strumienia, karta w tle zamyka pasek, pole tekstowe i komunikat tylko na jedno otwarcie, w pasku tylko bieżąca wymiana. Sprawdzone na atrapach w przeglądarce.
   - **Do zrobienia ręcznie**: prawdziwy HA po HTTPS i HTTP, iPhone (Safari, Companion), Whisper i HA Cloud.
5. ✅ **Dokumentacja i wydanie**: sekcja „Asystent głosowy” w `docs/{,pl/,fr/}features.md`, wpis w `CHANGELOG*.md` (Unreleased), zrzuty paska `docs/screenshots/demo_assist_bar_dark_{1440,390}.png` (Playwright poza repo, strona `tests/cards-demo.html`, zdarzenia potoku podane wprost do karty).
## Weryfikacja

- `npm test` zielone, w tym nowe testy rdzenia.
- Ręcznie na prawdziwym HA po HTTPS: potok z Whisper i z HA Cloud, Chrome, Safari na iPhonie, aplikacja Companion; pytanie z dopytaniem (`continue_conversation`); przerwanie w trakcie mówienia.
- Ręcznie po HTTP: zapas Web Speech w Chrome, tekst w Firefoksie.
- Klawiatura: A otwiera i słucha, Escape zamyka i zatrzymuje mikrofon, spacja/Enter na falach zatrzymuje albo wznawia.

## Poza zakresem

Słowo wybudzające, stałe słuchanie na tablecie ściennym, wybór głosu TTS w Nuvio (zostaje ustawienie potoku w HA).
