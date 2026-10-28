[English](../features.md) · **Polski** · [Français](../fr/features.md)

# Przewodnik po funkcjach

Jak działają wspólny dashboard, tryb tabletu ściennego, kopia układu i asystent głosowy. Wróć do [README](../../README.pl.md).

## Wspólny dashboard

Domyślnie wszyscy widzą ten sam dashboard Nuvio: układ, wygląd, widoki, pokoje i ustawienia tabletu ściennego, które ustawia administrator.

- **Kto edytuje**: administratorzy edytują wspólny dashboard (tryb edycji). Pozostałe osoby widzą go bez przycisku edycji.
- **Własny układ**: w **Ustawienia → Użytkownicy** (tryb edycji, tylko administrator) każdy użytkownik Home Assistant ma przełącznik. Po odznaczeniu osoba dostaje własny układ: zaczyna od kopii wspólnego, widzi przycisk edycji, a jej zmiany dotyczą tylko jej. Ponowne zaznaczenie przywraca wspólny dashboard. Twoje konto zostaje na wspólnym dashboardzie.
- **Kto widzi widok**: w **Ustawienia → Widoki** każdy widok (poza Panelem) ma przycisk z osobami. Domyślnie każdy widok widzą wszyscy; odznacz osobę, żeby ukryć przed nią widok, także w jej własnym układzie. Jej ekran sam się przeładuje i widok zniknie.
- **Na żywo**: zmiany wspólnego dashboardu i listy osób trafiają na otwarte ekrany bez przeładowania.
- **Zapis**: wspólny układ jest w ukrytym pulpicie `nuvio-shared` (*Nuvio (wspólny układ)*, nazwa w języku administratora, który go utworzył, tylko dla administratorów, bez pozycji w pasku bocznym). Zapisywać go mogą tylko administratorzy; nie edytuj go ręcznie. Własne układy zostają w danych użytkownika Home Assistant (`frontend/set_user_data`, klucz `nuvio_layout`), z kopią lokalną dla każdego użytkownika. Ustawienia Assist są zawsze osobiste.
- **Aktualizacja z 1.3.x**: gdy administrator pierwszy raz otworzy Nuvio 1.4.0, jego obecny układ staje się wspólnym dashboardem. Do tego czasu każdy ma własny układ jak wcześniej.

## Tryb tabletu ściennego

Wygaszacz dla tabletu na ścianie. Jest **domyślnie wyłączony**; administrator włącza go w **Wygląd → Tryb tabletu ściennego** (tryb edycji) i zapisuje przyciskiem **Gotowe**.

- **Włącz po bezczynności**: 30 s, 1, 2, 5, 10 lub 30 min bez dotyku, myszy i klawiatury (domyślnie 2 min).
- **Przyciemnienie**: od 0 do 90 %, jak ciemny jest ekran pod zegarem (domyślnie 50 %).
- **Widok po wybudzeniu**: *Ostatnio używany widok* (domyślnie), *Panel* albo dowolny włączony widok. Gdy włącza się wygaszacz, dashboard przechodzi pod nim na ten widok, więc to on jest widoczny po wybudzeniu ekranu. Nie w trybie edycji ani w podglądzie; widok zablokowany PIN-em pyta o PIN po wybudzeniu.
- **Zdjęcie**: tło Twojego dashboardu, pokaz slajdów wbudowanych teł (płynne przejście co 45 s) albo własny adres obrazu (`https://…` lub `/local/…`).
- **Czujnik ruchu**: dowolny `binary_sensor`; czujniki ruchu, obecności i zajętości są na początku listy. Gdy przejdzie w stan `on` w czasie wygaszacza, ekran się wybudza. Bez czujnika budzi tylko dotyk.
- **Wybudzanie**: dotyk, klawisz lub przewinięcie. Pierwszy dotyk tylko budzi ekran i nie naciska kafla pod spodem.
- **Wygląd wygaszacza**: *Zegar na zdjęciu* (opis niżej) albo *Tablica*: jasna lub ciemna tablica z dużym dniem tygodnia albo godziną i datą, wschodem i zachodem słońca, odliczaniem do najbliższego wydarzenia całodniowego, pogodą z prognozą, najbliższymi wydarzeniami, tym, co teraz gra, zdjęciem i temperaturami w pokojach. W trybie Tablica wybierasz motyw (auto według słońca, jasny, ciemny), nagłówek, widoczne elementy, kolejność kart, encję pogody oraz kalendarze i pokoje.
- Kolejne style (2.16.0), każdy z podglądem w galerii: *Zegar analogowy* (tarcza z matowego szkła na zdjęciu, wskazówka sekund w kolorze akcentu, data, pogoda), *Zegar klapkowy* (dwie przewracane karty z godzinami i minutami), *Zorza* (cienki zegar na powoli płynącym świetle w kolorze akcentu) i *Nocny* (przygaszony ciepły zegar na czerni do sypialni i ekranów OLED, co minutę przesuwa się mocniej). Pogoda pochodzi z encji wybranej dla Tablicy albo z pierwszej dostępnej.
- **Wygląd zegara**: czcionka (systemowa, szeryfowa, monospace, zaokrąglona albo własna z `/local/…` lub `https://…`), rozmiar, grubość, kolor (biały, akcent albo własny), cień i przezroczystość, z podglądem na żywo. Działa na zegarze na zdjęciu, Nocnym, Zorzy, Klapkowym i Minimal; **Przywróć domyślne** przywraca wygląd każdego stylu.
- **Podgląd wygaszacza** pokazuje go od razu; dotknij, aby zamknąć.
- Układ: duży zegar pośrodku (bez panelu pod spodem), data na stałe w lewym dolnym rogu i, jeśli Home Assistant ma encję `weather`, aktualna pogoda (ikona, temperatura, stan) w prawym górnym. Zegar zgadza się z formatem czasu (12 / 24 h) i językiem HA, co minutę lekko zmienia położenie (ochrona paneli OLED), prosi przeglądarkę o niewygaszanie ekranu (Screen Wake Lock) i szanuje ograniczenie ruchu.
- Startuje tylko na dashboardzie Nuvio (nie w trybie edycji i nie w karcie w tle) i jest rysowany nad oknami dialogowymi Home Assistanta.
- **Blokada PIN-em (BETA)**: włącz *Blokadę PIN-em*, ustaw PIN z 4 do 8 cyfr i wybierz, kiedy wygaszacz się blokuje (od razu, po 1, 5, 15 lub 30 min). Zablokowany wygaszacz nie budzi się dotykiem ani czujnikiem ruchu: dotknięcie rozmywa zdjęcie i pokazuje okrągły szklany pinpad z kropkami PIN-u nad nim i przyciskiem **Zablokuj** pod spodem, który wraca do wygaszacza. Po 5 błędnych PIN-ach pinpad czeka 30 s (dłużej po kolejnych próbach), a po 20 s bez dotyku sam się zamyka. **Zablokuj ekran** w menu użytkownika blokuje od razu, a przeładowanie strony nie zdejmuje blokady. Zapisywany jest tylko skrót PIN-u. Blokada chroni tablet przed przypadkowym użyciem i nie zastępuje hasła do Home Assistant.
- Ustawienia są częścią układu: na wspólnym dashboardzie dotyczą wszystkich, a osoba z własnym układem ma własne. Zobacz [Wspólny dashboard](#wspólny-dashboard).
- **Wygaszacz na tym urządzeniu** (2.21.0): ustawienia są wspólne, ale to, czy wygaszacz działa, wybiera się osobno na każdym urządzeniu i zapisuje tylko w tej przeglądarce. Włączenie wygaszacza włącza go na urządzeniu, którego używasz; na telefonie albo komputerze wyłącz **Wygaszacz na tym urządzeniu**, a tablet na ścianie go zachowa. Urządzenie, na którym nic nie wybrano, ma wygaszacz wyłączony, poza tabletem zablokowanym PIN-em przed aktualizacją.
- **Blokada widoków PIN-em (BETA, 2.21.0)**: wybierz widoki (np. Kamery), które pytają o PIN, zanim cokolwiek pokażą. Używa PIN-u z *Blokady PIN-em*, więc najpierw go ustaw. Po poprawnym PIN-ie widok jest otwarty przez 5 minut w tej karcie przeglądarki albo do włączenia wygaszacza lub użycia **Zablokuj ekran**: wtedy wszystkie odblokowane widoki się zamykają, a widok na ekranie po wybudzeniu znowu pyta o PIN; **Wróć** prowadzi do poprzedniego widoku. To blokada dla wygody, chroni przed przypadkowym użyciem, a nie zabezpieczenie: kto ma konto w Home Assistant, zobaczy te same dane w innym dashboardzie.

- **Polecenia z Home Assistant (BETA, 2.23.0)**: tablet może słuchać automatyzacji bez browser_mod. W **Wygląd → Tryb tabletu ściennego** nadaj tabletowi nazwę, zapisywaną tylko w jego przeglądarce (np. `salon`), i opcjonalnie wybierz pomocnika. Potem wysyłaj zdarzenie `nuvio_command` z polami `device`, `action` i `view` albo wpisuj te same wartości do atrybutów `device`, `action` i `view` encji pomocnika `input_text`. Zdarzenie wymaga konta administratora; pomocnik działa na każdym koncie, więc jest drogą dla użytkownika z ograniczonymi uprawnieniami. `wake` zdejmuje wygaszacz, `screensaver` go włącza, `lock` włącza go i pyta o PIN, gdy blokada PIN-em jest włączona, a `navigate` otwiera widok podany ścieżką albo tytułem (`kamery`, `Kamery`, `/nuvio-…/kamery`). Zablokowany wygaszacz nigdzie nie przechodzi. Pomocnik pamięta tylko ostatnie polecenie: Nuvio wykonuje je raz przy zmianie i raz po przeładowaniu strony, więc stare polecenie się nie powtarza. Przykład: dzwonek albo czujnik ruchu przy furtce wybudza tablet i otwiera widok kamer.
- **Szybkie przyciski (BETA, 2.24.0)**: do 3 szklanych przycisków na każdym stylu wygaszacza (zdjęcie, tablica, szkło). W **Wygląd → Tryb tabletu ściennego → Szybkie przyciski** dodaj encję z listy, wybierz akcję i opcjonalnie nazwę, ikonę `mdi:` oraz *Przytrzymaj, aby potwierdzić*. Skrypty, sceny, przyciski i `input_button` są uruchamiane; przełączniki, światła, wentylatory i `input_boolean` przełączają, włączają albo wyłączają; rolety i bramy otwierają, zamykają albo przełączają; centrale alarmowe uzbrajają (poza domem, w domu, noc) albo rozbrajają. Dotknięcie wykonuje akcję **bez wybudzania** wygaszacza. *Przytrzymaj, aby potwierdzić* (domyślnie włączone dla rolet i central alarmowych) wymaga przytrzymania przez ok. 0,6 s z pierścieniem, który się wypełnia. Przyciski są ukryte, gdy wygaszacz jest zablokowany PIN-em. Podgląd wygaszacza wykonuje prawdziwe akcje: dotknięcie szybkiego przycisku w podglądzie naprawdę steruje urządzeniem. Centrala alarmowa z kodem pyta o niego za każdym razem na klawiaturze ekranowej (pole hasła dla kodu tekstowego): uzbrojenie pyta tylko wtedy, gdy alarm wymaga kodu, rozbrojenie zawsze, gdy centrala ma kod. Kod jest wysyłany do Home Assistant jako `code` i nigdy nie jest zapisywany. Przyciski są częścią ustawień wygaszacza, zapisanych w układzie (`wall.qa`) i współdzielonych jak pozostałe ustawienia wygaszacza; zmieniać je mogą tylko administratorzy.

## Styl pulpitu

**Ustawienia > Wygląd > Styl pulpitu** (2.16.0) ma osiem gotowych zestawów, każdy z miniaturą pulpitu: Nuvio (domyślny), Szron, Północ, Zachód, Las, Ocean, Pastel i Grafit. Styl ustawia akcent, tło, przyciemnienie i szkło (odcień kart, kafli i panelu, siłę rozmycia, a w Pastelu i Graficie zaokrąglenie rogów). Akcent i tło można potem zmienić. Przy wyłączonym *Rozmyciu szkła* zostaje gęste, czytelne wypełnienie. Wybór jest zapisany w układzie (`app.look`), więc trafia też do kopii zapasowej.

**Ustawienia > Wygląd > Tło panelu** (2.21.0) wyłącza wspólny szklany panel za kartami. Po wyłączeniu karty leżą bezpośrednio na tapecie, każda z własnym szkłem, bez wspólnej ramki (to samo co `panel_backdrop: false` w konfiguracji strony). **Ten widok** zmienia wybór dla bieżącego widoku: *Jak wszędzie*, włączone albo wyłączone.

## Wydajność

Starsze tablety szybko rozładowują baterię, gdy każda szklana powierzchnia jest rozmyta, a ozdobne animacje działają bez przerwy. **Ustawienia > Wygląd > Wydajność** ma dwie opcje zapisywane tylko na tym urządzeniu, więc tablet ścienny i komputer mogą mieć inne:

- **Rozmycie szkła**: *Pełne* (domyślnie na komputerze), *Lekkie* (domyślnie na dotyku: słabsze rozmycie, bez ciężkich cieni), *Wyłączone* (bez rozmycia; szkło ma gęstsze wypełnienie, a okna są nieprzezroczyste). *Auto* wybiera jedno z nich i pokazuje które.
- **Oszczędzanie baterii**: zatrzymuje animacje w pętli (przybliżanie zdjęcia na wygaszaczu, obracające się wentylatory, pulsujące pierścienie, bęben pralki i podobne) i odświeża migawki kamer najwyżej co 30 s. *Auto* włącza się na iPadach i iPhone'ach z iOS lub iPadOS starszym niż 18 oraz na bardzo słabym sprzęcie; rozmycie na *Auto* jest wtedy też wyłączone.

Niezależnie od tych opcji animacje w kartach przewiniętych poza ekran stoją, a *Ogranicz przezroczystość* w ustawieniach systemu wyłącza rozmycie na *Auto*.

## Kopia układu

Administrator może wyeksportować i zaimportować cały układ Nuvio w **Wygląd → Kopia układu** (tryb edycji).

- **Eksportuj** pobiera plik `nuvio-uklad-RRRR-MM-DD.json`, a **Kopiuj do schowka** kopiuje ten sam JSON. Do wyboru, co zawiera kopia: widoki i własne widoki; układ, widżety z encjami, tytuły, szerokości sekcji i ukryte elementy; wygląd (akcent, tło, przyciemnienie); szerokość paneli widoków.
- **Importuj** przyjmuje plik (wybór lub przeciągnięcie) albo wklejony JSON. Plik jest sprawdzany, a podsumowanie pokazuje liczbę widoków, widżetów, sekcji i encji oraz wyróżnia encje, których brak na tej instancji. Wybierz części do importu oraz **Zastąp** albo **Połącz**.
- Przed importem bieżący układ jest zapisywany jako kopia; **Przywróć poprzedni** w powiadomieniu (albo w sekcji Kopia układu) cofa import jednym kliknięciem.
- Plik ma wersję (`format`, `schema`, `nuvio`, `exported`). Starsze surowe dane układu są konwertowane automatycznie, a pliki z nowszego schematu lub uszkodzone są odrzucane z jasnym komunikatem.

## Asystent głosowy

Rozmowa z asystentem Home Assistant (Assist) bez wychodzenia z pulpitu. Otwiera go przycisk mikrofonu w nagłówku albo klawisz **A**, gdy nie piszesz w polu.

<p align="center">
  <img src="../screenshots/demo_assist_bar_dark_1440.png" alt="Pasek głosowy na komputerze: w cudzysłowie to, co usłyszał, pod spodem odpowiedź" width="74%">
  <img src="../screenshots/demo_assist_bar_dark_390.png" alt="Pasek głosowy na telefonie" width="18%">
</p>

- **Pasek głosowy** (domyślnie): szklany pasek wjeżdża u góry ekranu i od razu słucha. Zielone fale idą za głosem, potem pasek pokazuje w cudzysłowie, co usłyszał, a pod spodem odpowiedź. Z **Czytaj odpowiedzi na głos** odpowiedź jest odczytana.
- **Znika sam**: 2 sekundy po odczytanej odpowiedzi, a bez odczytu po czasie potrzebnym na przeczytanie (2,5 do 8 sekund), także po błędzie. Escape albo kliknięcie obok zamyka go wcześniej. Dotknięcie fal kończy słuchanie, przerywa odczyt albo zaczyna słuchać od nowa.
- **Rozpoznawanie mowy**: dźwięk trafia do silnika zamiany mowy na tekst w asystencie (np. Whisper albo Home Assistant Cloud), tak jak w aplikacji Home Assistant. Wymaga Home Assistant otwartego przez HTTPS (albo `localhost`) i asystenta z silnikiem mowy. W przeciwnym razie Nuvio używa rozpoznawania mowy w przeglądarce (Chrome, Edge, Safari), a gdy go nie ma, otwiera pole tekstowe.
- **Dopytanie**: gdy asystent pyta z powrotem (np. „W którym pokoju?”), pasek słucha dalej w tej samej rozmowie.
- **Gdy coś nie działa**: brak dostępu do mikrofonu, brak mikrofonu, mikrofon zajęty przez inną aplikację albo cisza dają krótki komunikat, a tam, gdzie to pomaga, otwiera się pole tekstowe. Gdy strona przechodzi w tło (inna karta, zablokowany telefon), pasek się zamyka i wyłącza mikrofon.
- **Ustawienia**: **Ustawienia > System > Assist**, zapisywane dla użytkownika Home Assistant: przycisk w nagłówku, skrót klawiszowy A, domyślny asystent, **Wygląd** (*Pasek głosowy* albo *Okno czatu*, dawne okno z dymkami), **Słuchaj po otwarciu**, **Ciągła rozmowa**, **Czytaj odpowiedzi na głos** (w pasku domyślnie włączone), mikrofon i podpowiedzi (okno czatu).
- Ustawienia z wcześniejszych wersji działają dalej: bez zapisanego wyglądu jest pasek głosowy, a zapisane **Czytaj odpowiedzi na głos** zostaje bez zmian.

## Nuvio TV

**Ustawienia > System > Telewizor** paruje aplikację Nuvio TV bez wpisywania tokenu. Strona jest oznaczona jako Beta. Strona jest częścią panelu ustawień, więc widzą ją administratorzy i osoby z własnym układem.

- Wpisz adres telewizora (`10.0.8.117:8798`) i 6-cyfrowy kod z jego ekranu albo wklej link z kodu QR do pola adresu. Adres Home Assistant jest wypełniony bieżącym i można go zmienić.
- **Sparuj** tworzy token długoterminowy o nazwie *Nuvio TV data godzina* i wysyła go z adresem do telewizora przez sieć domową. Gdy Home Assistant jest otwarty przez `http://` (typowo w sieci domowej), Nuvio wysyła dane prosto do telewizora żądaniem w tle, bez nowej karty: telewizor odpowiada *przyjęto*, *zły kod* (sprawdź kod na telewizorze), *zbyt wiele prób* (poczekaj i użyj nowego kodu z telewizora) albo *odrzucono*, a w trzech ostatnich przypadkach świeżo utworzony token jest usuwany. Jeśli aplikacja telewizora jest starsza i nie dopuszcza tego żądania albo telewizor nie odpowie w 8 sekund, wynik jest nieznany, więc Nuvio czeka na telewizor jak dotąd. Gdy Home Assistant jest otwarty przez `https://`, dane idą formularzem w karcie otwieranej przez Nuvio w chwili kliknięcia (dzięki temu przeglądarki jej nie blokują, a karta zamyka się sama, gdy telewizor się połączy; po przekroczeniu czasu zostaje otwarta, żeby można było przeczytać komunikat telewizora). Jeśli przeglądarka zablokuje kartę mimo to, token jest tworzony i pojawia się drugi przycisk **Otwórz stronę TV i wyślij**: naciśnij go w ciągu 2 minut, po tym czasie niewysłany token jest usuwany. Przyjmowane są tylko adresy z sieci domowej: 10.x, 172.16 do 31.x, 192.168.x, 169.254.x i `.local`. Dane przechodzą przez sieć bez szyfrowania.
- Telewizor potwierdza, zapisując znacznik (`nuvio_tv_seen`) w danych użytkownika Home Assistant. Nuvio sprawdza go co sekundę do 60 sekund (120 sekund tylko wtedy, gdy wysyłany adres Home Assistant zaczyna się od `http://`, a jego host nie jest w sieci domowej, bo wtedy telewizor najpierw prosi pilotem o potwierdzenie połączenia bez szyfrowania), po czym pokazuje *Telewizor połączony* albo usuwa niewykorzystany token. Aplikacja telewizora pomija to pytanie dla adresu Home Assistant `http://` w sieci domowej i zapisuje znacznik zaraz po zalogowaniu.
- Lista pokazuje tokeny Nuvio TV z datą dodania i czasem ostatniego połączenia telewizora. **Usuń** kasuje token, a telewizor wraca do ekranu parowania.
