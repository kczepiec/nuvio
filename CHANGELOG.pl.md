<p align="center"><a href="CHANGELOG.md">English</a> · <b>Polski</b> · <a href="CHANGELOG.fr.md">Français</a> · <a href="CHANGELOG.nl.md">Nederlands</a></p>

# Lista zmian

Tutaj zapisane są wszystkie istotne zmiany w Nuvio, od najnowszych. Wersje zgodne z [semantycznym wersjonowaniem](https://semver.org). Angielska lista zmian jest w [CHANGELOG.md](CHANGELOG.md).

### Unreleased
- Naprawiono: siatka **Pokoje** w Studio jest bliżej makiety (trzy kolumny na typowej szerokości pulpitu, niebieska obwódka kafli, Offline bez danych pokoju, bez wiersza „Pozostałe” w siatce). Tytuł widoku Pokoje w Studio nadal jest ukryty.
- Dodano: opcjonalny **widok Studio** (beta), domyślnie wyłączony, włączany w **Ustawienia > Widoki**. Ma ramkę w stylu makiety (rail na całą wysokość z przełącznikiem jasny/ciemny, zakładki-pigułki, opcjonalne ikony Wi-Fi, Bluetooth i baterii z tabletu ściennego, data i godzina) oraz swobodną siatkę widżetów 2D o 12 kolumnach (8 na tabletach, 4 na telefonach). W trybie edycji widżety można przeciągać, zmieniać ich rozmiar, ukrywać i dodawać kafelkiem „Dodaj widżet”; pozostałe widżety ustępują miejsca i układają się ciasno, a każdy widżet ma własny minimalny i maksymalny rozmiar. Pierwszy układ powstaje z Twoich encji, każda szerokość ekranu ma własny układ, a zapisany układ nigdy nie jest generowany od nowa. Studio wchodzi do kopii układu.
- Dodano: nowe widżety **klimat**, **energia** i **dom** (także w selektorze kart), które przełączają się między układem kompaktowym, średnim i rozszerzonym zależnie od własnego rozmiaru.
- Dodano: tryby Studio dla kart powitania, pogody, multimediów, kamer i scen (opcja `studio`; istniejące konfiguracje wyglądają bez zmian).
- Dodano: wersje beta, np. `2.32.0-beta.1`, ładują zasoby z CDN. `tools/cut-release.sh --pre` i `tools/tag-release.sh --pre` publikują wersję przedpremierową z bieżącej gałęzi.
- Naprawiono: widżety Studio są bliżej makiety. Karty na zdjęciu mają ciemniejszą taflę i biały tekst, łuk klimatyzacji mieści się w karcie, słupki energii widać już w średnim rozmiarze, multimedia mają większą okładkę, włączone światła są indygo, a sceny leżą w jednym rzędzie.
- Naprawiono: ramka Studio. Logo znów widać, szyna jest zaokrąglonym paskiem bez strzałki wstecz, a ikony w prawym górnym rogu mają odstęp. Wi-Fi i Bluetooth pokazują stan tabletu i otwierają encję; ikony baterii nie ma.
- Naprawiono: na telefonie widżety Studio układają się w jednej kolumnie na pełną szerokość.
- Naprawiono: kalendarz miesiąca i agenda mają większą, czytelną typografię (także w widoku Studio, bez ściskania skali kafelka).
- Zmieniono: nowe układy Studio dla Mapy, Kamer, Rodziny, Energii oraz widoków Roboty, Bezpieczeństwo i Sieć (tylko widżety i karty Nuvio). Przy aktualizacji do seedV 2 zapisany układ widoku jest podmieniany.
- Naprawiono: migracja seedV Studio działa także gdy układ widoku już był zapisany (wcześniej seed nigdy nie nadpisywał istniejącego `studios.*`).
- Naprawiono: w Studio znikają górne zakładki (zostaje szyna boczna); zduplikowane kafelki w siatce są scalane po `id`.
- Naprawiono: migracja seedV nie nadpisuje układów `custom:1`, nie zapisuje na serwer przy każdym wejściu w widok; stare `bps` z kolizjami są odrzucane (naprawa nachodzących kafelków).
- Naprawiono: siatka Studio dosuwa się do szyny, bez pustego pasa, a w edycji da się dodać te same komponenty co na innych widokach.
- Naprawiono: Studio nie zostawia pustej kolumny siatki po lewej, a widżety skalują się do wysokości swojego pola.
- Naprawiono: edycja Studio nie kiwa całej siatki i nie ściska widżetów, żeby zmieścić kafelek dodawania.
- Naprawiono: edycja Studio mierzyła rosnącą kartę, więc każdy wiersz puchł do tysięcy pikseli. Wysokość wiersza bierze się z panelu.
- Naprawiono: szkło Studio ma mocniejsze rozmycie i osobne tokeny jasnego i ciemnego motywu (widżety i chrom), więc jasny tryb nie trzyma już ciemnych kart.
- Naprawiono: Studio przenosi edycję, Assist, wiadomości i powiadomienia do menu użytkownika; aktywna ikona na szynie ma mniejszy radius.
- Zmieniono: na desktopie każdy widok ma układ jak Studio (panel na całą szerokość, szyna i zakładki wyrównane do szyny, zaokrąglona szyna). Wybór wąski/szeroki panel znika z edycji i widoków własnych; stare preferencje `pw` są ignorowane.
- Zmieniono: szkło widżetów Studio jest bardziej przezroczyste, z mocniejszym rozmyciem i bez wewnętrznych obrysów — bliżej karty pogody z makiety.
- Zmieniono: siatka widżetów Studio ma odstępy 24px między kartami, jak na mockupie.
- Zmieniono: na desktopie wszystkie widoki mają to samo szkło i przezroczysty panel co Studio, nie tylko widok Studio.
- Zmieniono: jeden układ na wszystkich urządzeniach — usunięty wąski panel, `wide-panel`, wspólne szkło panelu i **Tło panelu** w Wyglądzie; karty zawsze mają własne szkło i odstępy 24px.
- Naprawiono: edycja układu na desktopie znów pokazuje uchwyty, **Dodaj komponent** i siatkę Studio (panel przewija się w siatce strony zamiast być ucięty).

### 2.31.0
- Dodano: tytuł i podtytuł nagłówka mogą pokazywać stan encji na żywo wpisem `{state:sensor.twoja_encja}`, np. status pralki. Linia znika, gdy stan jest pusty, `off`, `unavailable` lub `unknown`, a nagłówek odświeża się przy zmianie encji.

### 2.30.2
- Naprawiono: **pasek przeładowania** nie pojawia się już po aktualizacji, gdy działająca wersja jest najnowsza.

### 2.30.1
- Naprawiono: okno ustawień **Wygląd** nie otwierało się po dodaniu harmonogramu nocnego. Znów działa.

### 2.30.0
- Dodano: **harmonogram nocny** wygaszacza w trybie tabletu ściennego. Po włączeniu w Tryb tabletu ściennego wygaszacz w nocy przyjmuje własny styl i przyciemnienie, od zachodu do wschodu słońca (encja sun) albo między dwiema ustawionymi godzinami, także przez północ. Domyślnie wyłączony, ustawienia dzienne zostają bez zmian.
- Dodano: wygaszacz może **wybudzać się z listy czujników** zamiast z jednego. Wybierz kilka czujników ruchu, zajętości lub obecności; włączenie dowolnego z nich wybudza wygaszacz. Dotychczasowe ustawienie z jednym czujnikiem przenosi się automatycznie.
- Dodano: **asystent głosowy** zamiast okna czatu Assist. Szklany pasek wjeżdża u góry ekranu, od razu słucha, pokazuje w cudzysłowie, co usłyszał, a pod spodem odpowiedź, czyta ją na głos i sam znika. Mowa trafia do silnika zamiany mowy na tekst w asystencie Home Assistant (wymaga HTTPS), w zapasie jest rozpoznawanie mowy w przeglądarce i pole tekstowe. Słucha dalej, gdy asystent dopytuje. Nowe ustawienia w **Ustawienia > System > Assist**: **Styl** (pasek głosowy albo dawne okno czatu), **Słuchaj po otwarciu** i **Ciągła rozmowa**. Zobacz [Asystent głosowy](docs/pl/features.md#asystent-głosowy).
- Naprawiono: **ustawienia pokoju** otwierane z nagłówka pokoju (menu czujnika, „Wszystkie ustawienia pokoju”) wchodzą najpierw w tryb edycji, więc przyciski Zapisz i edycja całego pokoju działają. Czujnik wybrany w nagłówku nie jest już nadpisywany przez późniejszy zapis.
- Naprawiono: nagłówek **„Wykrywanie pracy”** (wykrywanie pracy klimatyzacji) w ustawieniach pokoju nie pokazuje już za dużej ikony.

### 2.29.2
- Dodano: każda lista wyboru (select) ma **wyszukiwarkę**, a długie listy ładują się po 10 pozycji z przewijaniem bez końca. Szukanie nie rozróżnia wielkości liter ani polskich znaków, więc „lazienka” znajdzie „Łazienka”. Listy czujników z tysiącami pozycji otwierają się szybko.
- Dodano: **pigułka obecności** w nagłówku pokoju można dotknąć (administrator), żeby wybrać czujnik obecności lub ruchu dla tego pokoju, tak jak przy temperaturze i wilgotności. Można wybrać „Automatycznie”, „Nie pokazuj” albo dodać czujnik, gdy pokój go nie ma.
- Dodano: **rozmiar tytułu** nagłówka widoku osobno dla każdego urządzenia (telefon, tablet, szeroki ekran): Mały, Średni (domyślny, obecny wygląd), Duży i XL. XL ma rozmiar zegara, więc `{time}` da się odczytać z drugiego końca pokoju. Ustawiany w edytorze nagłówka, z podglądem na żywo.
- Dodano: przełącznik **Pokaż pogodę w nagłówku** na stronie Wygląd. Wyłącz go, gdy karta Pogoda już pokazuje prognozę (domyślnie włączony).
- Dodano: suwak **Przezroczystość szkła** w Wyglądzie, obok Rozmycia szkła. Sprawia, że duże szklane karty są bardziej przezroczyste, a rozmycie zostaje bez zmian. Domyślne 100 to obecny wygląd, a tekst pozostaje czytelny, gdy rozmycie jest wyłączone.
- Dodano: trzy wygaszacze tabletu ściennego: **Gwiazdy** (migoczące nocne niebo z zegarem), **Zegar słowny** (godzina zapalana litera po literze, na razie angielskie słowa) i **Wschód słońca** (niebo zgodne z prawdziwą porą dnia, z łukiem słońca lub księżyca).

### 2.27.0
- Dodano: **wygląd zegara** na wygaszaczu tabletu ściennego (zgłoszenie #41). Wygląd → Tryb tabletu ściennego ma podgląd na żywo i opcje: czcionkę (systemowa, szeryfowa, monospace, zaokrąglona albo własna z adresu `/local/…` lub `https://…`), rozmiar, grubość, kolor (biały, akcent albo własny), cień i przezroczystość. Ustawienia działają na zegarze na zdjęciu, Nocnym, Zorzy, Klapkowym i Minimal (szkło). Domyślne wartości zachowują obecny wygląd, a **Przywróć domyślne** je przywraca.

### 2.26.1
- Naprawiono: **pokój** — ruch/obecność oraz drzwi/okna są osobnymi sekcjami, które można usunąć lub ukryć w edytorze pokoju, tak jak pozostałe sekcje.
- Naprawiono: **treść telewizora** nie zostawia osobnego kafelka komponentu z edycji, gdy te same encje pokrywa profil urządzenia (jeden kafelek oczyszczacza/zamka zamiast duplikatów).

### 2.26.0-beta.6
- Naprawiono: **treść telewizora** nie zostawia osobnego kafelka komponentu z edycji, gdy te same encje pokrywa profil urządzenia (jeden kafelek oczyszczacza/zamka zamiast duplikatów).

### 2.26.0-beta.5
- Ulepszono: **treść telewizora** — wiersze pokoi zapisują uporządkowane `items` (encje, binary_sensor, profile urządzeń, komponenty z edycji), żeby Nuvio TV mógł oddać zawartość pokoju z dashboardu, nie tylko płaską whitelistę.

### 2.26.0-beta.4
- Naprawiono: **treść telewizora** — kafelki pokoi biorą whitelistę encji z dashboardu nawet gdy te encje nie są w odpowiadającym obszarze Home Assistant (pokoje wirtualne i przeniesione urządzenia). Wiersze pokoi w `nuvio_tv_layout` zapisują też nazwę z dashboardu.

### 2.26.0-beta.3
- Naprawiono: **treść telewizora** — lista i kolejność pokoi jak na siatce Nuvio (Wygląd → Pokoje + układ ukryte/kolejność/dodane), a nie wszystkie obszary Home Assistant. Synchronizacja z dashboardem i zapis układu przepisują cały zestaw pokoi; „Inne” na TV tylko gdy dashboard pokazuje *Bez pokoju*.

### 2.26.0-beta.2
- Ulepszono: **treść telewizora** startuje od pokoju z dashboardu Nuvio (te same encje co karta pokoju, z ukrytymi sekcjami i dodanymi kafelkami). **Synchronizuj z dashboardem** odświeża listy; zapis układu dashboardu też aktualizuje listy encji pokoi w `nuvio_tv_layout`, gdy układ TV już istnieje.

### 2.26.0-beta.1
- Dodano: **treść telewizora** w Ustawienia → System → Telewizor: wybór kamer (z kolejnością), pokoi (opcjonalnie podzbiór encji), scen/skryptów i paneli alarmu widocznych na sparowanych aplikacjach Nuvio TV. Wybór jest zapisany w danych użytkownika Home Assistant jako `nuvio_tv_layout`. Bez zapisu telewizor pokazuje wszystko z Home Assistant; pusta sekcja pozostaje ukryta. Po zapisie przeładuj lub połącz ponownie telewizor ([#83](https://github.com/kczepiec/nuvio/pull/83)).

### 2.25.1
- Naprawiono: **parowanie telewizora** tworzy krótszy token dostępu (365 dni zamiast 10 lat), pyta o zgodę przed wysłaniem tokenu do telewizora przez nieszyfrowany `http://` i buduje adres telewizora tylko ze sprawdzonego `host:port` (schemat i ścieżka są odrzucane) ([#81](https://github.com/kczepiec/nuvio/pull/81)).
- Naprawiono: komponent dodany na stronie **pokoju** (stos, siatka, karta HA, …) znów otwiera własny formularz w trybie edycji, a nie ustawienia sekcji ([#80](https://github.com/kczepiec/nuvio/pull/80)).

### 2.25.0
- Ulepszono: **parowanie telewizora** jest szybsze. Przy Home Assistant otwartym przez `http://` dane idą prosto do telewizora żądaniem w tle, więc nie otwiera się nowa karta, a strona mówi, gdy telewizor odrzuci kod albo wpisano zbyt wiele złych kodów. Przy `https://` karta zamyka się sama, gdy telewizor się połączy. Strona sprawdza co sekundę zamiast co 3 sekundy i czeka 120 sekund tylko przy adresie Home Assistant `http://` spoza sieci domowej (w pozostałych przypadkach 60 sekund). Natychmiastowa odpowiedź wymaga najnowszej aplikacji Nuvio TV; starsza aplikacja nadal się paruje, a połączenie potwierdza to samo sprawdzanie.
- Dodano: **parowanie telewizora** (Ustawienia, System, Telewizor, oznaczone jako Beta): paruje aplikację Nuvio TV bez wpisywania tokenu. Wpisz adres i 6-cyfrowy kod z ekranu telewizora albo wklej link z jego kodu QR. Nuvio tworzy token długoterminowy o nazwie *Nuvio TV data godzina* i wysyła go razem z adresem Home Assistant do telewizora przez sieć domową (przyjmowane są tylko adresy z sieci domowej). Połączenie potwierdza sam telewizor: strona pokazuje *Telewizor połączony*, a po 60 sekundach (120 sekundach przy adresie Home Assistant http, gdzie telewizor najpierw prosi o potwierdzenie połączenia bez szyfrowania) bez odpowiedzi usuwa niewykorzystany token. Jeśli przeglądarka zablokuje nową kartę, drugi przycisk wysyła dane, a token niewysłany w ciągu 2 minut jest usuwany. Ta sama strona pokazuje sparowane telewizory z czasem ostatniego połączenia i pozwala je usunąć. Token nigdy nie jest zapisywany ani logowany. Wymaga aplikacji Nuvio TV z parowaniem. Strona jest częścią panelu ustawień, więc widzą ją administratorzy i osoby z własnym układem.
- Dodano: **szybkie przyciski na wygaszaczu** ([#49](https://github.com/kczepiec/nuvio/issues/49)): do 3 szklanych przycisków na każdym stylu wygaszacza (zdjęcie, tablica i szkło), które uruchamiają akcję na skrypcie, scenie, przycisku, przełączniku, świetle, wentylatorze, input_boolean, rolecie albo centrali alarmowej bez wybudzania pulpitu. Ustawia się je w **Tryb tabletu ściennego → Szybkie przyciski** (administratorzy): encja, akcja, nazwa, ikona i *Przytrzymaj, aby potwierdzić*, domyślnie włączone dla rolet i central alarmowych. Przyciski są ukryte, gdy wygaszacz jest zablokowany PIN-em. Centrala alarmowa pyta o kod za każdym razem na klawiaturze ekranowej (uzbrojenie tylko wtedy, gdy alarm wymaga kodu, rozbrojenie zawsze, gdy centrala ma kod); kod jest wysyłany do Home Assistant i nigdy nie jest zapisywany.
- Naprawiono: rozmycie kart (szkło) nie działało albo pojawiało się z opóźnieniem po zmianie widoku, najwyraźniej przy zmianie widoku z wyłączonym **Tłem panelu**. Animacja wejścia kart zmieniała przezroczystość każdego opakowania karty, przez co karty były odcięte od zdjęcia za nimi, a ponieważ animacja zostawiała stan końcowy, blur pozostawał wyłączony także potem. Karty wjeżdżają teraz bez zmiany przezroczystości, więc rozmycie jest od pierwszej klatki.
- Ulepszono: wydajność. Sprawdzanie, czy jest nowszy bundle, nie pobiera już przy każdym wejściu całego pliku (~1,4 MB): wysyła warunkowe zapytanie, a serwer odpowiada 304, gdy nic się nie zmieniło. Karta Zegar odświeża tylko tekst czasu zamiast przerysowywać całą kartę, przerysowanie nagłówka porównuje proste wartości zamiast serializować obiekt użytkownika przy każdej zmianie stanu, a pamięć kolorów okładek w kartach multimediów ma limit.
- Ulepszono: odświeżanie migawki kamery, karta Timer i odliczanie w karcie Pokój wstrzymują się, gdy karta przeglądarki jest ukryta albo karta jest poza ekranem, i nadrabiają przy następnym tyknięciu.
- Ulepszono: siedem największych wbudowanych teł jest przekompresowanych (razem z ok. 3,1 MB do 2,4 MB, te same wymiary i nazwy plików). Na kilku zdjęciach drobne detale są trochę łagodniejsze.
- Usunięto: nieużywane pliki podziału edytora (`hg-editor.part.js`, `hg-editor-tail.part.js`), które nie wchodziły do buildu.
- Dodano: **Tryb tabletu ściennego → Widok po wybudzeniu**: Ostatnio używany widok (domyślnie), Panel albo dowolny włączony widok. Gdy włącza się wygaszacz, dashboard wraca pod nim do tego widoku, więc to on jest widoczny po wybudzeniu ekranu. Pomijane w trybie edycji, w podglądzie i gdy widok jest już otwarty. Widok zablokowany PIN-em nadal pyta o PIN po wybudzeniu.

### 2.23.1
- Przywrócono: kod z wydania 2.23.0 razem z pracami nad kartą przepływu energii z 2.22.5 / #57. Podział edytora i późniejsze poprawki z przeglądu wycofane: zbudowany z nich pulpit nie renderował się (`this._applyLayout is not a function`) i wszystkie widoki były puste.
- Nowość: karta **Przepływ energii** wypełnia się z ustawień **panelu Energia** Home Assistanta, gdy podają one czujniki mocy (nowsze HA: moc sieci, paneli i baterii, poziom i nazwa baterii). Odwrócone liczniki i osobne czujniki poboru / oddawania są obsługiwane jak w HA. Czego tam brakuje, jest wykrywane jak dotąd, a własne wybory w ustawieniach karty zawsze mają pierwszeństwo.
- Naprawiono: karta **Przepływ energii** wstawiana domyślnie w widoku **Energia** mogła pokazywać kilka baterii zamiast jednej (np. wszystkie czujniki mocy „bateria” jednego SolarFlow i gniazdko nazwane „bateria”), z poziomami dobieranymi wg kolejności. Baterie są teraz wykrywane wg urządzenia: po jednej na każdy poziom naładowania, który urządzenie podaje (falownik z Battery 1 i Battery 2 daje dwie), każda z czujnikiem mocy o nazwie pasującej do poziomu albo z głównym czujnikiem mocy baterii, gdy urządzenie ma jeden poziom; urządzenia bez poziomu (np. gniazdko) są pomijane, gdy inne urządzenie go podaje. Nowa karta z galerii korzysta z tego samego wykrywania.
- Ulepszono: **Ustawienia** karty Przepływ energii w widoku Energia otwierają teraz ten sam formularz co galeria (sieć, panele, baterie, poziomy, oddawanie, dom, opcje znaku), wypełniony tym, co karta pokazuje; wybory zapisują się na wygenerowanej karcie.
### 2.23.0
- Dodano: tablet na ścianie słucha poleceń z Home Assistant bez browser_mod ([#47](https://github.com/kczepiec/nuvio/issues/47)). **Wygląd → Tryb tabletu ściennego → Polecenia z Home Assistant** nadaje temu tabletowi nazwę, zapisaną w jego przeglądarce, i przyjmuje dwa źródła: zdarzenie `nuvio_command` z polami `device`, `action` i `view` (konto administratora) oraz encję pomocnika `input_text` z tymi samymi wartościami w atrybutach `device`, `action` i `view` (każde konto, także bez uprawnień administratora). Akcje to `wake`, `screensaver`, `lock` (włącza wygaszacz i pyta o PIN, gdy blokada PIN-em jest włączona) i `navigate` ze ścieżką albo tytułem widoku — dzięki temu dzwonek albo ruch przy furtce może wybudzić tablet i otworzyć **Kamery**. Pomocnik trzyma ostatnie polecenie, więc Nuvio wykonuje je raz na zmianę i raz po przeładowaniu strony, nigdy dwa razy to samo.
- Dodano: gdy tryb kiosku jest włączony, ekran zostaje włączony na pulpicie Nuvio, tak jak przy oglądaniu filmu. Obejmuje to ukryty nagłówek, ukryty panel, kiosk dla osób, które nie są administratorami, oraz parametry adresu `kiosk`, `hide_header` i `hide_sidebar`. Po wyłączeniu trybu kiosku ekran może zgasnąć. Gdy ekran zgaśnie albo opuścisz aplikację, Nuvio prosi o pozostawienie go włączonego po powrocie.
### 2.22.4
- Dodano: pogoda w nagłówku i karta Pogoda mają rozmiar tekstu: mały, średni albo duży. Pogoda w nagłówku podąża też za powiększeniem pulpitu, więc na tablecie w poziomie prognoza godzinowa może urosnąć ponad dawny limit.
- Naprawiono: ilość deszczu na pogodzie w nagłówku, na przykład 17 mm, jest biała na zdjęciu, więc da się ją odczytać.
- Dodano: widok może liczyć kilka rzeczy naraz (światła, przełączniki, wentylatory, media, klimatyzację, osoby, ruch i wybrane encje). Zakładka pokazuje sumę. Bieżący widok pokazuje też ikonę i liczbę pod tytułem i ukrywa chip przy 0. Włączone światła pomija grupę świateł, gdy jej lampy istnieją. Wybrane encje korzystają z wyszukiwarki encji.

### 2.22.3
- Naprawiono: wygaszacz Szkło Minimal nadal pokazywał kółko z inicjałem w prawym górnym rogu, gdy przełącznik **Górny pasek → Awatar** był wyłączony — na wygaszaczu i w podglądzie ([#52](https://github.com/kczepiec/nuvio/issues/52)).
- Naprawiono: wiersz **Discord** w menu użytkownika pokazuje znak Discord obok nazwy, tak jak Profil i Ustawienia pokazują ikonę. Home Assistant nie ma już tej ikony marki, więc menu rysuje ją samo.
- Naprawiono: **Ustawienia → Użytkownicy** pokazują zdjęcie osoby, gdy to konto Home Assistant jest powiązane z osobą, która ma zdjęcie. Bez zdjęcia zostaje litera.

### 2.22.2
- Naprawiono: kafel **Roleta / brama** (otwórz, stop, zamknij) na telefonie był ucięty z prawej, gdy leżał na panelu osobno. Na wąskim kaflu przyciski rozciągały się na cały rząd, ale ten rząd się nie zawijał, więc wychodziły poza kartę. Teraz schodzą pod nazwę i mieszczą się w kaflu. Kafel mediów korzysta z tego samego układu. Na szerszym ekranie przyciski zostają po prawej ([#53](https://github.com/kczepiec/nuvio/issues/53)).
- Dodano: Discord w menu użytkownika, po Profilu i Ustawieniach, oraz na stronie O Nuvio. Angielski, polski i francuski README mają sekcję społeczności i plakietkę Discord.

### 2.22.1
- Naprawiono: na telefonach i wąskich tabletach ustawienia **Widoki i nawigacja** były ucięte z lewej i ściśnięte do połowy szerokości, a strona przewijała się w bok. Szeroka lista wyboru (pasek na telefonie) i dwukolumnowe karty widoków były szersze niż ekran, a po ukryciu paska bocznego strona trafiała do złego wiersza siatki. Ustawienia mają teraz jedną kolumnę na pełną szerokość, tabela widoków to karty jedna pod drugą ze wszystkimi polami, nic nie przewija się w bok, a pasek **Przywróć domyślne** / **Gotowe** jest nad dolną nawigacją i paskiem iPhone’a. Nowy `tools/mobile_check.py` sprawdza każdą stronę ustawień na iPhonie (WebKit), Androidzie (360 px) i tablecie 768 px przed każdym wydaniem.

### 2.22.0
- Zmieniono: zmiany ustawień w trybie edycji są szkicem. Widoki, tryb kiosku, nagłówek, pokoje, wygaszacz, PIN i Assist nie zapisują się i nie przeładowują pulpitu przy każdej zmianie; tanie podglądy (akcent, tekst nagłówka) widać od razu. **Gotowe** zapisuje wszystko jeden raz i przeładowuje najwyżej raz, **Anuluj** odrzuca szkic, a opuszczenie strony z niezapisanymi zmianami wymaga potwierdzenia.
- Zmieniono: **Ustawienia** mają nowy układ. Pasek boczny grupuje 13 stron (Ogólne, Wygląd, Pulpit, Tablet ścienny, System), ma wyszukiwarkę ustawień ze wszystkich stron, obsługę klawiatury i listę z przechodzeniem do strony na telefonie. Ustawienia PIN-u mają własną stronę **PIN i blokady**, jest nowa strona **O Nuvio**, a wykrywanie pracy klimatu jest zwinięte w bloku zaawansowanym. Wszystkie opcje i zapisane ustawienia są bez zmian.

### 2.21.6
- Naprawiono: wygaszacz znów trzyma ekran włączony po wyłączeniu i włączeniu ekranu albo po przełączeniu aplikacji lub karty. Przeglądarka zwalnia blokadę wygaszania ekranu, gdy strona jest niewidoczna; Nuvio prosi o nią ponownie, gdy strona jest znowu widoczna, a wygaszacz włączony ([#38](https://github.com/kczepiec/nuvio/issues/38)).
- Naprawiono: karta **Roleta / brama** pokazywała 0 % lub 100 % i pasek pozycji dla rolet bez pozycji (brama albo garaż, które znają tylko otwórz, zamknij i stop). Teraz pokazuje stan słowny (Otwarte, Zamknięte, Otwieranie, Zamykanie) z delikatnym pulsowaniem w ruchu i bez paska. Ikona zależy od klasy urządzenia (brama, garaż, drzwi, okno, żaluzja, zasłona, roleta, markiza) zamiast zawsze rolety ([#36](https://github.com/kczepiec/nuvio/issues/36)).
- Naprawiono: widoki odblokowane PIN-em zostawały otwarte przez 5 minut także po włączeniu wygaszacza albo użyciu **Zablokuj ekran**, więc kolejna osoba przy tablecie ściennym mogła wejść w nie bez PIN-u. Wygaszacz i **Zablokuj ekran** zamykają teraz wszystkie odblokowane widoki, a widok na ekranie po wybudzeniu znowu pyta o PIN. Podgląd wygaszacza w ustawieniach niczego nie blokuje ([#35](https://github.com/kczepiec/nuvio/issues/35)).
- Zmieniono: klawiatura PIN zablokowanego widoku i ustawienia blokady widoków nie pokazują już uwagi, że blokada jest dla wygody, a nie zabezpieczeniem; to ograniczenie jest opisane w dokumentacji.
- Naprawiono: w wygaszaczu **Zegar na zdjęciu** godzina najbliższego wydarzenia (i najbliższych zajęć LiveKid) znów ma pełną jasność zamiast przygaszenia jak pozostałe wiersze. Zbędne `};` w stylach wygaszacza sprawiało, że przeglądarka odrzucała tę regułę ([#34](https://github.com/kczepiec/nuvio/issues/34)).

### 2.21.5
- Naprawiono: **Ukryj pasek boczny** (wcześniej **Ukryj pusty pasek boczny**) nic nie robił, dopóki choć jeden widok miał włączony **Pasek boczny**. Teraz ukrywa pasek boczny Nuvio razem z przyciskiem Ustawienia na komputerze i tablecie bez względu na przełączniki widoków, a widoki spoza zakładek u góry trafiają do menu profilu.

### 2.21.4
- Dodano: **{time}** i **{date}** w tytule lub podtytule widoku pokazują bieżącą godzinę i datę w języku interfejsu, w formacie 12 lub 24 h z profilu Home Assistant, odświeżane co minutę. **Dodaj zegar** w edytorze nagłówka dopisuje **{time}** do podtytułu.
- Dodano: kolumna **Licznik** w **Ustawienia > Widoki** liczy włączone światła, przełączniki, wentylatory, klimatyzację lub osoby w domu (albo odtwarzane media, albo wybrane encje) i pokazuje liczbę na zakładce widoku, gdy jest większa od 0.
- Dodano: **Ukryj pusty pasek boczny** w **Ustawienia > Widoki**. Gdy żaden widok nie jest w pasku bocznym, znika pasek razem z przyciskiem Ustawienia. Ustawienia zostają w menu profilu, pod ołówkiem i pod dowolnym adresem Nuvio z **?nuvio_settings** (dla osób z prawem edycji, nie na widoku zablokowanym PIN-em).
- Naprawiono: karta **Prognoza produkcji** po zmianie progów malowała wszystkie dni jednym kolorem. Progi powyżej 12 kWh na kW albo progi bez mocy odniesienia są teraz liczone jako kWh na dzień, progi wpisane odwrotnie są zamieniane, a pola liczbowe edytora kart przyjmują przecinek (3,5).
- Naprawiono: wbudowane tło wybrane na jednym urządzeniu było zwykłym kolorem na urządzeniach, które otwierają Home Assistant pod innym adresem (lokalny IP, domena, Nabu Casa). Zdjęcie zapisywało się z pełnym adresem pierwszego urządzenia; teraz wbudowane tła zapisują się jako ścieżka obok plików Nuvio (np. `/hacsfiles/nuvio/nuvio-bg-nad-mgla-wide.webp`), a tła zapisane wcześniej z adresem są poprawiane przy wczytaniu układu, na pulpicie i w wygaszaczu. Wgrane zdjęcia i własne adresy zostają bez zmian.

### 2.21.3
- Zmieniono: kropka klimatu na kaflu **Pokoje** ma kolor trybu (grzanie, chłodzenie, osuszanie, wentylacja, auto), te same kolory co w menu **Tryb pracy** pilota klimatyzacji, zamiast szarego: pełna, gdy urządzenie pracuje, przygaszona, gdy nie pracuje albo stan jest szacunkiem, z samą obwódką, gdy znany jest tylko tryb. Znak **~** przed szacowanym stanem zniknął z kafla Pokoje i karty termostatu; czytnik ekranu nadal mówi **szacunek**.

### 2.21.2
- Zmieniono: okno szczegółowej pogody jest zwarte i mieści się na ekranie telefonu bez przewijania: cztery szczegóły w jednym rzędzie, mniejsze odstępy i wiersze, mniejszy łuk słońca, a na wąskich ekranach krótkie nazwy dni (Pn, Wt) zamiast uciętych.
- Zmieniono: Nuvio nie zgaduje już, czy termostat albo klimatyzacja pracuje. Każde urządzenie klimatu w pokoju ma **Wykrywanie pracy** w **Wygląd > Pokoje**: **Automatycznie** (domyślnie), **Z encji**, **Z temperatury pokoju** albo **Pokazuj tylko tryb**. Automatycznie oznacza kolejno: encję **Stan rzeczywisty** (włącz/wyłącz albo wartość, np. moc powyżej **Progu pracy**, domyślnie 5 W), informację z samego urządzenia (`hvac_action`) i temperaturę pokoju względem nastawy, jeśli wybierzesz osobny czujnik pokoju (szacunek z histerezą domyślnie 0,5°, oznaczony **~** i przygaszoną kropką). W pozostałych przypadkach kafel pokazuje sam tryb, np. **Grzanie** z pustą kropką. W 2.21.1 nastawa była porównywana z temperaturą samego urządzenia, więc klimatyzacje sterowane pilotem IR pokazywały **Bezczynny**, choć grzały. Gdy w pokoju jest kilka urządzeń, kafel Pokoje pokazuje najpierw to, które na pewno pracuje, potem szacunek, a na końcu tryb. Dotychczasowe ustawienia **Stanu rzeczywistego** działają dalej.

### 2.21.1
- Podziękowania dla [@cbailly42](https://github.com/cbailly42) za poprawkę klimatu ([#22](https://github.com/kczepiec/nuvio/pull/22)).
- Po aktualizacji włącz raz **Wygaszacz na tym urządzeniu** na każdym urządzeniu, które ma pokazywać wygaszacz.
- Nowość: **Stan rzeczywisty** dla każdego termostatu w pokoju, w **Wygląd > Pokoje** (tryb edycji): wybierz encję, która mówi, czy to urządzenie naprawdę pracuje (encja włącz/wyłącz, np. czujnik spalania pieca, albo liczbowa, np. moc palnika). Gdy w pokoju jest kilka urządzeń (np. klimatyzacja i piec), kafel Pokoje sprawdza wszystkie i pokazuje **Grzeje**, **Chłodzi** albo **Bezczynny** według tego, które naprawdę pracuje; karta termostatu korzysta z tego samego ustawienia.
- Naprawiono: termostaty, które nie podają, co robią (brak `hvac_action`, np. niektóre grzejniki łazienkowe), są uznawane za bezczynne, gdy pokój osiągnął nastawę, na kaflu Pokoje i w karcie termostatu.
- Naprawiono: karta termostatu pokazuje **· bezczynny** po trybie (np. **Grzanie do 7° · bezczynny**), gdy urządzenie w rzeczywistości nie grzeje.
- Naprawiono: kafle **Pokoje** pokazywały **Grzeje**, gdy termostat był w trybie grzania, nawet jeśli nie grzał (np. ochrona przed zamarzaniem 7 °C w pokoju 21 °C). Kafel pokazuje teraz to, co urządzenie naprawdę robi, i w takim przypadku **Bezczynny** z szarą kropką.
- Naprawiono: przełączniki **Blokady widoków PIN-em** w Trybie tabletu ściennego nic nie robiły po kliknięciu. Ich akcja nie trafiała do ustawień tabletu, więc nic się nie przełączało ani nie zapisywało. Teraz przełączają się od razu i zapisują z układem; bez PIN-u pojawia się komunikat i pole do ustawienia PIN-u. Refs [#17](https://github.com/kczepiec/nuvio/issues/17)
- Naprawiono: zwykłe kafle były zawsze zebrane w jeden blok pod stosami, siatkami, kartami YAML i innymi komponentami. Bez obszarów siatki każdy dodany kafel jest teraz osobną kartą panelu, więc kafle i komponenty można dowolnie przeplatać przeciąganiem; dotychczasowa kolejność kafli zostaje. Refs [#17](https://github.com/kczepiec/nuvio/issues/17)
- Naprawiono: widok otwarty po numerze (np. `/dashboard-nuvio/0`) miał niewidoczne karty, bo strona uznawała, że nie jest pokazana, i wstrzymywała animację wejścia.
- Naprawiono: przełącznik w stosie albo siatce dodanych w edytorze nie zmieniał wyglądu po włączeniu lub wyłączeniu światła ([#16](https://github.com/kczepiec/nuvio/issues/16)). Panel przekazywał kontenerowi nowe dane z Home Assistant tylko wtedy, gdy zmieniła się jedna z jego własnych encji, a ta lista nie obejmowała kart w kontenerze. Kontenery i inne dodane komponenty dostają teraz każdą aktualizację.
- Nowość: **Wygaszacz na tym urządzeniu** w **Trybie tabletu ściennego** ([#16](https://github.com/kczepiec/nuvio/issues/16)). Ustawienia wygaszacza są nadal wspólne, ale każde urządzenie decyduje, czy wygaszacz działa, i zapisuje to w swojej przeglądarce. Włączenie wygaszacza włącza go na urządzeniu, którego używasz; inne urządzenia zostają wyłączone, dopóki go na nich nie włączysz (tablet zablokowany PIN-em przed aktualizacją go zachowuje). Po aktualizacji sprawdź przełącznik na tablecie na ścianie.
- Nowość: **Tło panelu** w **Wyglądzie** wyłącza wspólny szklany panel za kartami, dla wszystkich widoków albo tylko bieżącego ([#15](https://github.com/kczepiec/nuvio/issues/15)). Style dla `panel_backdrop: false` nie są już testowe.
- Nowość: komponent **Pogoda** ma przełącznik **Styl hero** (`variant: hero`), a samodzielna karta pogody z `variant: hero` dostaje teraz style hero ([#15](https://github.com/kczepiec/nuvio/issues/15)).
- Nowość: **Blokada widoków PIN-em** (BETA) w **Trybie tabletu ściennego**: wybrane widoki pytają o PIN, zanim cokolwiek pokażą, tym samym pinpadem co wygaszacz ([#17](https://github.com/kczepiec/nuvio/issues/17)). To blokada dla wygody, nie zabezpieczenie.
- Naprawiono: stosy, siatki i karty YAML dodane w edytorze trzymają ustawioną kolejność zamiast wskakiwać nad wcześniejsze karty ([#17](https://github.com/kczepiec/nuvio/issues/17)).

### 2.20.0
- Dziękuję [@cbailly42](https://github.com/cbailly42) za nową kartę i wspólny wykres słupkowy ([#14](https://github.com/kczepiec/nuvio/pull/14)).
- Nowość: karta **Prognoza produkcji** (`custom:nuvio-yield-card`). Wybierz jeden czujnik na dzień (pierwszy to dziś), a karta pokaże kolejne dni jako słupki z sumą i oceni każdy dzień jako dobry, średni albo słaby. Podaj moc instalacji w kW (liczbę albo encję), a ocena użyje energii na kW, z progami do zmiany; bez niej dzień jest porównywany z najlepszym dniem okresu. Czujniki w Wh lub MWh są przeliczane, moc wpisana jako `3,4` działa, a nazwy dni są liczone w strefie czasowej Home Assistant. Zobacz [docs/pl/components.md](docs/pl/components.md#prognoza-produkcji).
- Naprawiono: słupki karty **Energia statystyki** wyrastają teraz przy pojawieniu się karty, tak jak w **Energia · tydzień**.
- Dla współtwórców: wykres słupków dziennych i jego dymek, dotąd skopiowane w **Energia · tydzień**, **Energia statystyki** i nowej karcie prognozy, są teraz w jednym miejscu, `src/parts/shared/day-bars.part.js` (`HG_DAYBARS_CSS`, `HG_TIP_CSS`). Zobacz [DESIGN.md](DESIGN.md).

### 2.19.0
- Nowość: Nuvio mówi po francusku. Wybierz **Français** w przełączniku języka albo zostaw język automatyczny, a Nuvio dopasuje się do przeglądarki. Dziękuję [@cbailly42](https://github.com/cbailly42) za tłumaczenie i pracę opisaną niżej ([#10](https://github.com/kczepiec/nuvio/pull/10)).
- Zmieniono: wszystkie teksty interfejsu są teraz w katalogach językowych z kluczami (`src/locales/en.json`, `pl.json`, `fr.json`). Pobierany jest tylko używany język, obok głównego pliku, więc nowy język nie powiększa pulpitu dla wszystkich. Język automatyczny nie trzyma się już języka, który kreator tylko pokazał, a którego nie wybrałeś.
- Dla współtwórców: `tools/i18n_check.py` sprawdza klucze, formy liczby mnogiej i pokrycie każdego katalogu, `tools/i18n_compile.py` buduje pliki językowe, a `npm test` uruchamia nowe testy JavaScript i Python. Zobacz [docs/pl/development.md](docs/pl/development.md).

### 2.18.0
- Naprawiono: przełącznik na liście **Encje** (i w innych kartach) mógł zostać włączony po wyłączeniu urządzenia gdzie indziej, na przykład w oknie szczegółów Home Assistant, aż do przeładowania strony. Gdy jedna karta w widoku zgłosiła błąd podczas odświeżania, błąd zatrzymywał przekazywanie danych Home Assistant do wszystkich kolejnych kart w tym widoku, więc przestawały śledzić zmiany stanu. Teraz każda karta dostaje dane osobno, karta z błędem pokazuje krótki komunikat zamiast psuć pozostałe, a odświeżanie nie może już utknąć po przerwanej animacji panelu, zamknięciu trybu edycji, zgubionym puszczeniu palca ani wstrzymanej klatce przeglądarki.
- Nowość: **Moc teraz** może rysować prognozę zamiast historii. Włącz **Wykres z prognozy (atrybut) zamiast historii** (w YAML `source: forecast`) i wybierz encje z prognozą, liczbę **Dni do przodu** (albo **Godziny do przodu**), atrybut (domyślnie `detailedForecast`, także `detailedHourly`) i pole wartości (domyślnie `pv_estimate`, na przykład `pv_estimate90`). Działa od razu z integracją Solcast PV Forecast: dodaj czujniki dzienne na dziś, jutro i dni 3 do 7, a dostaniesz wykres na 7 dni z nazwami dni pod spodem. Encje pogody są czytane przez `weather.get_forecasts` (`forecast_type: hourly` albo `daily`, domyślnie wartość `temperature`). Zobacz [docs/pl/components.md](docs/pl/components.md#wykres-prognozy).

### 2.17.0
- Naprawiono: kafle pokoi w **Pokojach** (i kafle pokoi w innych miejscach pulpitu) nie zawsze pokazywały włączenie lub wyłączenie światła, dopóki nie otworzyło się innego widoku i nie wróciło. W widoku pokoju stan był dobry. Karta, którą przeglądarka błędnie uznała za ukrytą (zdarza się to w Safari i w aplikacji Home Assistant po ukryciu i ponownym pokazaniu widoku), odświeża się teraz od razu, gdy jest na ekranie, karty widoku, do którego się wraca, od razu nadrabiają zmiany, a lista śledzonych encji liczy się od nowa po zmianie rejestru Home Assistant.
- Naprawiono: karta **Moc teraz** (wartość, pasek i wykres) traktowała każdy czujnik jak moc. Czujnik energii albo prognozy, na przykład prognoza Solcast na jutro (20,2 kWh), pokazywał się jako 20 W, 0% Niskie. Karta pokazuje teraz wartość i jednostkę dokładnie tak, jak podaje czujnik, skaluje pasek do największej wartości z wykresu albo do Twojego **Końca skali paska** i pokazuje poziom Niskie, Średnie, Wysokie tylko dla mocy albo po włączeniu tej opcji. Czujniki bez statystyk długoterminowych (na przykład prognozy) rysują wykres z historii stanów.
- Nowość: podpis pod wykresem można zmienić dla każdej karty. **Moc teraz** ma pole **Podpis wykresu** (na przykład Prognoza zamiast -6 h) i przełącznik ukrywający podpisy pod wykresem. Kafel w trybie **Z wykresem** ma pole **Podpis wykresu** zamiast stałego Ostatnie 24 h i przełącznik, który go ukrywa.

### 2.16.0
- Nowość: cztery nowe wygaszacze w **Ustawienia > Wygaszacz**, każdy z podglądem na żywo w galerii. **Zegar analogowy** to tarcza z matowego szkła na Twoim zdjęciu, ze wskazówką sekund w kolorze akcentu, datą i pogodą. **Zegar klapkowy** pokazuje godziny i minuty na dwóch ciemnych kartach, które przewracają się co minutę. **Zorza** to cienki duży zegar na powoli płynącym świetle w kolorze akcentu, fiolecie i turkusie, z datą i pogodą. **Nocny** to przygaszony, ciepły zegar na czerni do sypialni i ekranów OLED; co minutę przesuwa się mocniej, żeby chronić ekran. Wszystkie działają z przyciemnieniem, czujnikiem ruchu, blokadą PIN-em i powiadomieniami; ruch w pętli zatrzymuje się przy oszczędzaniu baterii i ograniczonych animacjach.
- Nowość: **Styl pulpitu** na górze **Ustawienia > Wygląd**: osiem gotowych zestawów, każdy z miniaturą pulpitu (Nuvio, Szron, Północ, Zachód, Las, Ocean, Pastel i Grafit). Styl ustawia akcent, tło, przyciemnienie i szkło (odcień kart, kafli i panelu, siłę rozmycia; Pastel ma bardziej zaokrąglone, a Grafit ostrzejsze rogi). Akcent i tło można dalej zmienić niżej. Przy **Rozmyciu szkła** ustawionym na Wyłączone zostaje gęste wypełnienie dla czytelności. **Przywróć domyślne** wraca do stylu Nuvio.

### 2.15.1
- Ulepszono: temperatura i wilgotność w nagłówku pokoju mają mały ołówek, gdy możesz zmienić ich czujnik. Najechanie nie podkłada już prostokąta pod liczbę; zamiast tego ołówek podświetla się kolorem akcentu.
- Naprawiono: stosów i siatek z konfiguracji pulpitu (np. `vertical-stack`, `horizontal-stack` lub `grid` z HA) nie dało się edytować. W trybie edycji dotknięcie stosu lub siatki otwiera teraz jego ustawienia z listą kart, gdzie można dodawać, usuwać, przestawiać i kopiować karty oraz zmieniać opcje stosu (np. **Każda karta we własnym szkle**). Dotknięcie karty w środku stosu lub siatki od razu otwiera ustawienia tej karty, jak w HA; **Wstecz** wraca do kontenera, a **Zapisz** w kontenerze zachowuje zmiany.
- Naprawiono: **Podgląd na żywo** w ustawieniach sekcji pokoju był pusty, gdy sekcja pokazywała kartę, np. klimatyzację. Podgląd pokazuje teraz tę kartę.
- Usunięto: wybór **Tryb wyświetlania** (Normalny, Kompaktowy, Minimalny) dla pokoi, sekcji pokoju i kart z jednym stylem. Prawie nic nie zmieniał. Kafelki i karty, które mogą przejść w styl kafelka lub listy, zachowują wybór stylu.
- Ulepszono: komponent **Alarm** ma nowy, bardziej elegancki wygląd. Tarcza stanu świeci kolorem stanu, klawiatura PIN ma okrągłe klawisze i kropki zapalające się przy wpisywaniu, a przyciski trybów pokazują ikonę i nazwę obok siebie. Klawiatura pojawia się tylko wtedy, gdy w centrali ustawiono kod PIN (Home Assistant podaje format kodu). Wpisz kod, potem dotknij W domu, Poza domem, Noc lub Rozbrój; jeśli dotkniesz akcji wymagającej kodu przed jego wpisaniem, karta najpierw poprosi o kod. Centrale z kodem tekstowym mają zamiast tego pole hasła.

### 2.15.0
- Naprawiono: temperatura w nagłówku pokoju mogła łamać się na dwie linie („23,” i „2°”) i wchodzić pod boczną szynę na wąskich ekranach. Temperatura i wilgotność zawsze mieszczą się teraz w jednej linii, a szyna przesuwa się pod wyższy nagłówek.
- Nowość: czujnik temperatury i wilgotności pokoju wybierzesz prosto z nagłówka. Jako administrator dotknij temperatury albo wilgotności w widoku pokoju (albo **+** obok, gdy nic nie jest pokazane) i wybierz Automatycznie, dowolny czujnik (najpierw czujniki tego pokoju, z bieżącymi wartościami) albo Nie pokazuj. Wybór zapisuje się w układzie i jest tym samym ustawieniem co w **Ustawienia > Pokoje**, które menu też otwiera.
- Nowość: nowe komponenty w **+ Dodaj**: **Jakość powietrza** (`custom:nuvio-airq-card`) pokazuje CO₂, PM2.5, PM10, LZO, NO₂, AQI i wilgotność jako kafle z kolorowymi poziomami i ogólną oceną; bez wybranych czujników znajduje je sama, najlepiej z jednego pokoju. **Roślina** (`custom:nuvio-plant-card`) pokazuje wilgotność gleby, światło, temperaturę i nawożenie: dobry zakres jako pas, odczyt jako znacznik, podpowiada, czego roślina potrzebuje (podlej, za ciemno…), i sama dobiera pozostałe czujniki oraz baterię z tego samego urządzenia (np. Mi Flora); obsługuje też encję `plant.*`. **Cena prądu** (`custom:nuvio-eprice-card`) pokazuje bieżącą cenę z oceną tanio, średnio albo drogo, słupki godzinowe lub 15-minutowe na dziś i jutro oraz najtańsze okno od 1 do 24 godzin; czyta listy cen z Nord Pool, ENTSO-e, Energi Data Service i podobnych czujników.
- Ulepszono: karty lepiej mieszczą się w małych kaflach (S). Siatka pokoi przechodzi w jedną kolumnę, kafle rolet i odtwarzaczy mają przyciski pod nazwą, a pralka, ciepła woda, statystyki energii, odkurzacz, odtwarzacz, lista encji, licznik, aktualizacje, ceny paliw, fazy i kafle z wartością nie ściskają ani nie ucinają już nazw. Karta statystyk energii nie przestaje działać przy jednym czujniku.
- Naprawiono: podglądy w galerii **Dodaj komponent** zachodziły na napis Podgląd, a część była ucięta; wysokie podglądy zmniejszają się teraz, żeby się zmieścić. Inteligentny zamek i oczyszczacz powietrza mają własne podglądy.
- Dokumentacja: każdy komponent w [Komponentach](docs/pl/components.md) ma teraz zrzut w tym samym rozmiarze, pogrupowany według kategorii, a README pokazuje kilka z nich. Logo w README jest teraz widoczne w trybie ciemnym i w HACS.

### 2.14.1
- Naprawiono: kafelek albo karta przeciągnięta w trybie edycji wracała na stare miejsce. Siatka panelu dosuwała wąskie karty w luki przed szerokimi, więc nowa kolejność się zapisywała, ale nie była widoczna. Po zmianie kolejności w widoku karty i kafelki stoją teraz dokładnie w Twojej kolejności (obok szerokiej karty może zostać luka; wypełnisz ją, zmieniając rozmiar karty). W widokach z układem Masonry albo Kolumny karty przesuwają się już w trakcie przeciągania, a nie dopiero po zapisie.
- Naprawiono: przyciski rozmiaru S, M i L nic nie zmieniały na wbudowanych kartach panelu głównego aż do zapisu, S nie zwężało karty poniżej jej domyślnej szerokości, a karta z ustawioną **Szerokością** w ustawieniach je ignorowała. Rozmiar zmienia się teraz od razu, S oznacza jedną kolumnę, a wybór rozmiaru zastępuje ustawienie Szerokości. Na ekranach dotykowych przyciski rozmiaru i przeciągania są większe.
- Naprawiono: wybór encji w komponencie **Kalendarz** nie pokazywał żadnych kalendarzy, więc kalendarza, który nie został wybrany automatycznie (na przykład drugiego kalendarza Google), nie dało się dodać. Komponent i widok Kalendarz używają teraz wszystkich kalendarzy, a nie pierwszych czterech albo sześciu.

### 2.14.0
- Naprawiono: po aktualizacji panel mógł dalej działać w poprzedniej wersji. Wydanie, które zmieniało tylko numer wersji, zostawiało tę samą nazwę pliku paczki, więc przeglądarka i aplikacja Home Assistant podawały stary plik z pamięci podręcznej. Wersja jest teraz częścią skrótu w nazwie pliku. Wersja 2.13.0 wyszła bez poniższych zmian wydajności.
- Nowość: **Ustawienia > Wygląd > Wydajność**, zapisywane osobno na każdym urządzeniu. **Rozmycie szkła**: Auto, Pełne, Lekkie albo Wyłączone; przy Wyłączonym żadna powierzchnia nie używa `backdrop-filter`, a szkło ma gęstsze wypełnienie, więc tekst jest czytelny (okna i arkusze są nieprzezroczyste). **Oszczędzanie baterii** (Auto, Włączone, Wyłączone) zatrzymuje animacje w pętli (przybliżanie zdjęcia na wygaszaczu, obracające się wentylatory, pulsujące pierścienie, bęben pralki i podobne) i odświeża migawki kamer najwyżej co 30 s. Na Auto włącza się na iPadach i iPhone'ach z iOS lub iPadOS starszym niż 18 oraz na bardzo słabym sprzęcie, i wtedy rozmycie też jest wyłączone. Stare nadpisanie `home-glass:lite` nadal działa.
- Naprawiono: szybkie rozładowywanie baterii na starszych tabletach. Animacje w kartach przewiniętych poza ekran stoją, dopóki karta nie wróci, licznik postępu multimediów nie tyka, gdy strona albo karta jest ukryta, a sprawdzanie motywu, które każda karta robi przy każdej zmianie stanu w Home Assistant, nie czyta już za każdym razem pamięci przeglądarki.
- Dokumentacja: przeprojektowano README; listę zmian, konfigurację i opis rozwoju przeniesiono do osobnych plików.

### 2.12.0
- Nowość: w ustawieniach sekcji pokoju można teraz dodawać i usuwać encje. W trybie edycji otwórz sekcję w pokoju (na przykład **Światła**): lista **Encje** kończy się wierszem **Dodaj encję**, którego wybór pokazuje tylko pasujące encje (światła i przełączniki dla Świateł, termostaty dla Klimatyzacji, kamery dla Kamer itd.). Encja zostaje przypisana do pokoju i od razu trafia do tej sekcji.
- Nowość: każda encja w sekcji pokoju ma przycisk usuwania. Encja dodana ręcznie jest usuwana z pokoju (**Usuń z pokoju**). Encja z obszaru Home Assistant jest ukrywana tylko w tym pokoju (**Ukryj w tym pokoju**), bez zmiany obszaru w Home Assistant; ponowne dodanie znowu ją pokazuje. Ustawienia zapisują się w układzie razem z innymi przypisaniami pokoi.
- Zawiera kartę dziecka i panel wygaszacza LiveKid z wersji testowych 2.11.1 do 2.11.3.

### 2.11.3
- Nowość: nowy wygląd panelu dziecka (LiveKid) na wygaszaczu. Tablica: karta nad odtwarzaczem z dużymi godzinami przyjścia i wyjścia, najbliższymi zajęciami z odliczaniem i dwoma kolejnymi. Szkło: blok obok pogody w tym samym stylu co temperatura. Zdjęcia: czytelny stan i imię.
- Nowość: neutralny stan dziecka, **W placówce** i **Poza placówką**, we wszystkich stylach wygaszacza, na karcie Dziecko i w jej podglądzie w galerii.
- Nowość: panel na wygaszaczu pokazuje, czy dziecko jest w placówce, jeszcze nie przyszło albo dzień już się skończył.

### 2.11.2
- Nowość: karta Dziecko (LiveKid) jest teraz zwykłą kartą, w galerii kart Nuvio i w wyborze kart HA, z podglądem. Pokazuje obecność w żłobku lub przedszkolu, przyjście i wyjście, posiłki, nieprzeczytane aktualności i rachunek.
- Nowość: panel dziecka na wygaszaczu. W dni robocze pokazuje dzisiejszy plan zajęć oraz godziny przyjścia i wyjścia, we wszystkich stylach wygaszacza.
- Nowość: w **Ustawienia > Tryb tabletu ściennego** jest przełącznik LiveKid. Pokazuje, czy encje integracji zostały wykryte; gdy są, jest domyślnie włączony, gdy ich nie ma, jest nieaktywny z opisem **Nie wykryto**.

### 2.11.1
- Nowość: karta Dziecko dla integracji LiveKid (w tej wersji tylko w YAML). Encje dziecka są wykrywane same, po integracji, nigdy po identyfikatorach encji; przy kilku dzieciach wybierz jedno opcją `child` (imię) albo `entity`.
- Nowość: zwarty panel dziecka na wygaszaczu ze zdjęciami (w tej wersji tylko testowo, za flagą).

### 2.11.0
- Nowość: ceny paliw w nagłówku można wyłączyć bez usuwania. W **Ustawienia > Nagłówek i nawigacja** jest przełącznik całej sekcji paliw i osobny przy każdym paliwie. Ukryte paliwo zostaje na liście z przygaszonymi polami, a po wyłączeniu sekcji lista zwija się do krótkiej informacji. Nagłówek zmienia się od razu, a ustawienie zapisuje się w układzie i trafia do eksportu i importu.
- Nowość: szklany wybór koloru zastępuje przeglądarkowy we wszystkich polach koloru (gradient i kolory kuli wygaszacza, akcent, kolory tła i ustawienia kart). Ma pole nasycenia i jasności, suwak odcienia, pole HEX i szybkie kolory z limonką Nuvio.
- Naprawiono: galeria wygaszaczy i podgląd na żywo w Ustawieniach pokazują teraz prawdziwy obraz z Twoim tłem i danymi. Wcześniej były czarne albo puste, gdy kartę Wygaszacz otwierało się po innej karcie, a na telefonie podgląd na żywo nie miał szerokości.
- Naprawiono: wybór czujnika ruchu dla wygaszacza nie zawiesza już strony przy tysiącach encji. Lista otwiera się od razu, pokazuje czujniki ruchu, zajętości i obecności i filtruje podczas pisania. Okno Ustawień otwiera się też dużo szybciej, bo długie listy czujników wypełniają się dopiero po otwarciu.
- Naprawiono: Anuluj w trybie edycji nie cofa już zmian zapisanych wcześniej w Ustawieniach.

### 2.10.1
- Naprawiono: w **Ustawienia > Nagłówek i nawigacja** tytuł i podtytuł paska domowników (awatary osób) znowu się zapisują. Wcześniej zmiany przepadały po zamknięciu okna przyciskiem **Gotowe**; teraz Gotowe je zapisuje, pasek zmienia się od razu bez przeładowania strony, a sekcja pokazuje podgląd na żywo. Nowy wiersz prowadzi do edytora nagłówka bieżącego widoku.
- Naprawiono: wykres **Energia · tydzień** jest dużo wyższy i czytelniejszy. Jego wysokość rośnie z rozmiarem karty (S, M, L), słupki są szersze, produkcja ma własny bursztynowy kolor i małe wartości pozostają widoczne, a etykiety dni i wartości są większe.

### 2.10.0
- Nowość: nagłówek każdego widoku można edytować w trybie edycji. Limonkowy ołówek obok tytułu pozwala ustawić tytuł, podtytuł i opcjonalną ikonę, pokazać lub ukryć cały nagłówek albo sam podtytuł oraz dodać krótsze wersje dla telefonu i tabletu. Działa we wszystkich widokach, także w Pokojach i w widoku pojedynczego pokoju: tam `{room}` wstawia nazwę pokoju, pusty podtytuł zostawia temperaturę i stan pokoju na żywo, a domyślną ikoną jest ikona pokoju. Ukryty nagłówek podczas edycji zostaje widoczny, przygaszony i oznaczony „Nagłówek ukryty”. Nagłówki zapisują się w układzie i trafiają do eksportu i importu.
- Naprawiono: ostatnie nieprzetłumaczone teksty używają teraz wybranego języka (pulpit wspólnego układu, domyślny tytuł karty Multimedia i komunikat błędu karty). Nowe sprawdzenie w budowaniu zatrzymuje je, gdy jakiś tekst nie ma wersji polskiej albo angielskiej.

### 2.9.0
- Nowość: wybór języka w **Ustawienia → Wygląd → Język** (Automatycznie / Polski / English) i w menu użytkownika dla wszystkich. Zmiana działa od razu, bez przeładowania strony, a wybór zapisuje się dla każdej osoby (to urządzenie i konto HA). Domyślnym językiem jest teraz język przeglądarki (polski albo angielski, w innym razie angielski) zamiast języka profilu HA.

### 2.8.4
- Naprawiono: karta robotów pokazuje teraz każdy czujnik eksploatacji z jego własną jednostką. Wcześniej każda wartość była pokazywana jako procent, więc szczotka główna z 255 h do wymiany miała 255%. Czujniki w `%` zachowują pasek zużycia, a czujniki w godzinach, dniach i innych jednostkach pokazują wartość z jednostką bez paska. Wartości ostatniego sprzątania (czas, powierzchnia, łącznie) też biorą jednostkę z encji.

### 2.8.3
- Naprawiono: opcja strategii `language:` ma teraz zawsze pierwszeństwo. Wcześniej była pomijana, gdy kreator (albo zapis widoków lub pokoi) zapisał już język, więc pulpit mógł zostać po polsku mimo `language: en`.

### 2.8.2
- Naprawiono: gdy na wygaszaczu Szkło Minimal otwarty jest pinpad, ekran nie jest już przyciemniany. Tło, treść i kula asystenta są rozmyte, a pinpad pozostaje czytelny.

### 2.8.1
- Naprawiono: pinpad na wygaszaczu Szkło Minimal otwiera się teraz na osobnej warstwie nad rozmytym wygaszaczem, jak w Zegarze na zdjęciu, a nie na zegarze i kartach. Dotknięcie kuli przy blokadzie najpierw prosi o PIN, a potem otwiera Assist.

### 2.8.0
- Nowość: wygaszacz **Szkło Minimal** (Ustawienia > Wygaszacz): duży zegar z datą, pogoda z ikoną 3D, teraz gra z okładką albumu, sfera w tle, kula asystenta i pasek rodziny. Wszystkie wygaszacze wybierasz z galerii żywych podglądów, każdy pokazuje cały ekran w pomniejszeniu. Dotknięcie kuli otwiera Assist prosto z wygaszacza (można wyłączyć).
- Do ustawienia: kolory gradientu, kula (włączona lub nie, kolory, intensywność), sfera w tle, własne zdjęcie z galerii lub przesłane, ciemniej w nocy, format daty, awatar, format, wielkość i położenie zegara, data, pogoda i teraz gra osobno, rodzina (kto, szarzy poza domem), napis i ograniczone animacje. Ustawienia zapisują się dla każdego użytkownika HA i są w eksporcie oraz imporcie. Wcześniej wybrane Karuzela i Bento otwierają się jako Minimal.
- Wszystkie karty mają teraz jedno wspólne szkło; osobny ciepły odcień kart fotowoltaiki, energii, mocy i faz zniknął.
- Obrazy 3D są w dist jako `nuvio-3d-*.webp` (Fluent Emoji 3D od Microsoftu, licencja MIT).

### 2.7.0
- Nowość: karta inteligentnego zamka (`custom:nuvio-smartlock-card`, **+ Dodaj → Inteligentny zamek**). Animowana kłódka w okrągłym przycisku: przytrzymaj, a pierścień się wypełni i zamek się otworzy, dotknij, aby zamknąć. Kręcący się łuk pokazuje ruch zamka, impuls potwierdza nowy stan, a przy zacięciu kłódka się trzęsie. Bateria i czujnik drzwi dobierają się z tego samego urządzenia, a przycisk „Otwórz drzwi” pojawia się, gdy zamek to obsługuje. Zamki z kodem najpierw o niego pytają.

### 2.6.1
- Karta oczyszczacza: czujnik PM2.5 jest brany z tego samego urządzenia co oczyszczacz (także czujniki z pm2_5 w nazwie bez device_class i starszy atrybut aqi z xiaomi_miio), więc karta nie pokazuje już innego czujnika w domu. Odczyt łapie też czujnik, który pojawi się dopiero po starcie Home Assistant.

### 2.6.0
- Nowość: karta oczyszczacza powietrza (`custom:nuvio-purifier-card`, **+ Dodaj → Oczyszczacz powietrza**). Duży odczyt PM2.5 odliczany krok po kroku do nowej wartości, etykieta i kolor z jakości powietrza (czyste, dobre, umiarkowane, złe, bardzo złe), fale powietrza rozchodzące się od liczby w tempie zależnym od trybu, włącznik i tryby z przesuwanym podświetleniem. Czujnik PM2.5 dobiera się sam albo wybierasz go w formularzu.

### 2.5.1
- Karta „Teraz gra” na tablicy wygląda jak widżety: jasne rozmyte tło bez obramowania, biały tekst i ikony. Za długi tytuł przewija się (marquee).

### 2.5.0
- Widżety tablicy wyglądają jak widżety ekranu blokady iPhone'a: jasne rozmyte tło bez obramowania, biały tekst i białe ikony (pogoda jako białe symbole, białe wskaźniki pokoi).
- Ustawienia tabletu ściennego: widżety pod zegarem to jedna lista z przesuwaniem i usuwaniem, ukryte wracają przyciskiem „Dodaj widżet”. Pogoda, kalendarze, pokoje, czujnik ruchu i usługi notify to listy z przyciskiem „Dodaj”, który otwiera menu z wyszukiwarką.
- Pole ikony: kliknięcie w dowolne miejsce pola otwiera listę ikon, a pisanie ją filtruje.
- Pionowy stos nie zwija się już na iPhonie (Safari).
- „Czujnik z wykresem” w stosie znów pokazuje wykres, a nazwy kafelków nie łamią się w połowie słowa.

### 2.4.0
- **Tablica jak ekran blokady iPhone'a**: data i duży, cienki zegar na środku u góry, pod nim rząd małych szklanych widżetów na zdjęciu (pogoda z maks./min. i szansą opadów, najbliższy wschód lub zachód, odliczanie, bieżące i następne wydarzenie z „za 18 min” oraz temperatury w pokojach jako okrągłe wskaźniki z wilgotnością), a na dole stos powiadomień i zwarty odtwarzacz „Teraz gra”. Wszystko jest zwarte, więc nic się nie ucina na niskich ekranach; na telefonie widżety idą po dwa w rzędzie. Domyślny nagłówek to godzina; karta zdjęcia zniknęła, bo zdjęcie jest tłem (wybór zdjęcia działa teraz także dla tablicy).

### 2.3.0
- **Powiadomienia na wygaszaczu**: wiadomości wysłane przez notify na to urządzenie (stara usługa `notify.mobile_app_…` albo `notify.send_message` z encją `notify.*`) pokazują się na wygaszaczu jako stos jak na iPhonie: najnowsza karta na wierzchu, kolejne wystają spod niej, dotknięcie rozwija stos w listę (Pokaż mniej / wyczyść), a dotknięcie karty pokazuje całą treść. Dotykanie powiadomień nie wybudza ekranu; zwykłe wybudzenie oznacza je jako przeczytane. Usługi wybierasz w Trybie tabletu ściennego → Powiadomienia na tym urządzeniu (zapis osobno dla każdego urządzenia). Wymaga konta administratora, bo nasłuchuje zdarzeń `call_service`.

### 2.2.0
- **Tablica jako widżety**: duża, pogrubiona data na zdjęciu z dashboardu, wschód i zachód jako zwykłe linie z ikonami, a u dołu jeden rząd równych szklanych widżetów (pogoda, najbliższe, teraz gra, pokoje) w stylu StandBy. Koniec z ramkami w ramkach: wydarzenia mają cienki kolorowy pasek, pokoje to czysta lista z kolorową ikoną i dużą, lekką temperaturą, a tytuły widżetów to małe etykiety wersalikami. Pogoda trafiła do rzędu widżetów ze zwartą prognozą. Na telefonie widżety układają się pod nagłówkiem.

### 2.1.1
- **Dopracowana tablica**: karty nie rozciągają się już z pustym miejscem; widżety są przy dole, a zdjęcie zostaje widoczne na środku. Pogoda to zwarta karta w prawym górnym rogu. „Teraz gra” to zwarty widżet z miniaturą okładki. Jasne szkło jest czystsze i bielsze, a ciemne przydymione zamiast szarej mgły. Karta zdjęcia pokazuje się tylko przy więcej niż jednym zdjęciu (wcześniej powtarzała tło). Pokoje na telefonie to kafelki z pełną nazwą. Mocniejszy cień pod nagłówkiem dla kontrastu na jasnych zdjęciach.

### 2.1.0
- **Tablica w szkle premium**: tablica leży teraz na zdjęciu z dashboardu (ten sam pokaz slajdów, Ken Burns i przyciemnienie co w wygaszaczu ze zdjęciem), a karty są z matowego szkła z jasną krawędzią i miękkim cieniem jak reszta Nuvio; biały nagłówek z datą na zdjęciu, szklane chipy, akcentowa plakietka najbliższego wydarzenia. Motyw „Auto” idzie teraz za panelem.
- **Układ na telefon**: na telefonie w pionie tablica ma jedną kolumnę (karta zdjęcia znika, bo zdjęcie jest w tle), pokoje są w dwóch kolumnach z wilgotnością pod nazwą, a wiersze list, które się nie mieszczą, są chowane w całości zamiast ucinane w połowie. Karta, dla której brakuje miejsca, jest pomijana, więc nic nie jest przycięte.

### 2.0.0
- **Wygaszacz „Tablica” (nowość)**: drugi wygląd wygaszacza obok zegara na zdjęciu. Pokazuje duży dzień tygodnia albo godzinę z datą, wschód i zachód słońca, odliczanie do najbliższego wydarzenia całodniowego (np. „Halloween za 17 dni”), pogodę z prognozą godzinową (dzienną, gdy usługa nie ma godzinowej), najbliższe wydarzenia z kalendarzy na dwa tygodnie, to, co teraz gra, zdjęcie (tło dashboardu, pokaz slajdów albo własny adres) i listę temperatur w pokojach z wilgotnością. Wszystko ustawisz w Ustawienia → Wygaszacz: motyw tablicy (auto według słońca, jasny, ciemny), nagłówek (dzień tygodnia albo godzina), które elementy są widoczne, kolejność kart, encję pogody oraz które kalendarze i pokoje są brane pod uwagę. Działa w poziomie i w pionie, z blokadą PIN-em i wybudzaniem czujnikiem ruchu.
- **Stos pionowy (poprawka)**: karty w stosie pionowym mają naturalną wysokość; wcześniej karta mogła zostać ściśnięta do wąskiego paska.

### 1.9.1
- **Pilot klimatyzacji**: zmiana trybu (np. z chłodzenia na grzanie) płynnie przechodzi w nowy kolor tła, nawiewu, suwaka i kafli, a jednostka na chwilę delikatnie rozbłyskuje nowym kolorem.

### 1.9.0
- **Odtwarzacz (nowy wygląd)**: odtwarzacze w Multimediach i w pokojach mają duży układ „Teraz odtwarzane”: okładka w tle (jej kolor barwi kartę), linia ze źródłem i stanem, duży tytuł i wykonawca, pasek postępu z czasami, losowo / poprzedni / duży play / następny / powtarzanie oraz rząd głośności z − i + i przyciskami Pokoje (łączenie głośników w grupę), Źródło i Dźwięk, gdy odtwarzacz je obsługuje. Na wąskich kartach losowo i powtarzanie się chowają, a przyciski pokazują same ikony.
- **Pilot klimatyzacji**: na ekranach od 700 px kafle Tryb, Wentylator, Sen i Nawiew otwierają rozwijane menu przy kaflu (działają strzałki, drugie dotknięcie zamyka); na telefonie zostaje dolny panel.

### 1.8.1
- **Edycja pokoju (poprawka)**: pokój układa karty w tej samej siatce co pozostałe widoki, więc w edycji i po zapisie wygląda tak samo, w szerokim widoku i w panelu z boku. Wcześniej szeroki widok pokoju używał osobnego układu kolumn i karty przeskakiwały po zapisie.
- **Galeria w pokoju (poprawka)**: „Dodaj komponent” w pokoju pokazuje wszystkie komponenty, także kontenery, a w ustawieniach komponentu można wybrać rozmiar.

### 1.8.0
- **Pilot klimatyzacji (nowy komponent)**: osobna karta w „Dodaj komponent” w stylu aplikacji pilota. Jednostka z animowanym nawiewem (niebieski przy chłodzeniu, pomarańczowy przy grzaniu, szybszy przy wyższym biegu wentylatora, kołysze się przy ruchomych żaluzjach), duża nastawa, suwak od zimna do ciepła z − i +, przycisk zasilania i Eko. Kafle Tryb, Wentylator, Sen i Nawiew otwierają dolny panel z opcjami; karta pokazuje tylko to, co obsługuje dany klimatyzator. Działa w rozmiarach S, M i L oraz w jasnym i ciemnym motywie.

### 1.7.3
- **Galeria „Dodaj komponent” (poprawka)**: miniatury zawsze pokazują przykładowe podglądy; pomniejszone karty na żywo były ściśnięte, puste (klimatyzacja) albo pokazywały przypadkowe urządzenie (roboty, czujnik z wykresem, scena). Poprawione podglądy fotowoltaiki, pokoi, mocy, AGD, schodów, aktualizacji, pogody i mini odtwarzacza, żeby nic nie było ucięte.

### 1.7.2
- **Karty obok siebie (poprawka)**: komponenty dodane w trybie edycji są teraz osobnymi kartami w siatce widoku, więc da się je przeciągać między kartami domyślnymi i obok nich (zmiana rozmiaru i usuwanie działają na miejscu). Proste kafle encji zostają razem w swoim bloku.
- **Karta pogody (poprawka)**: w rozmiarze S ikona i temperatura są w górnym rzędzie, a opis pod nimi; wschód i zachód nie nachodzą na siebie; linia temperatur pokrywa się z godzinami; przy kilku godzinach kolumny wypełniają szerokość; pasek wygasa na krawędziach; kropka słońca w L jest okrągła.
- **Domownicy i Energia · tydzień w S (poprawka)**: licznik nad awatarami, strefy pod imionami; sumy obok siebie i wartość tylko nad dzisiejszym słupkiem.
- **Galeria „Dodaj komponent” (poprawka)**: podglądy dla światła, termostatu, dużej wartości, wykresu historii, drzwi i okien, baterii, odkurzacza, mini odtwarzacza, zegara, słońca, notatki, obrazu i aktualizacji oraz odświeżony podgląd pogody.

### 1.7.1
- **Szybsze strony (poprawka)**: przycisk podpowiedzi przewijania na szerokim ekranie nie podskakuje już bez końca (jego szklane rozmycie było przeliczane w każdej klatce); podskakuje tylko ikona, trzy razy. Bez karty przepływu energii strona trzyma 60 kl./s zamiast około 25 na 6x wolniejszym CPU.
- **Lżejsza karta przepływu energii (poprawka)**: bez rozmycia wewnątrz karty, bez poświaty kropek i wirującego słońca, animacje stają, gdy karta jest poza ekranem, a schemat jest dopasowywany tylko po zmianie układu.

### 1.7.0
- Dodano: karta **Przepływ energii** przyjmuje kilka czujników na źródło. Sieć, panele, oddawanie i dom się sumują (np. trzy fazy albo dwa falowniki), a każda bateria ma własne kółko z poziomem, nazwą i przepływem, połączone szyną pod schematem (do 4). Kliknięcie w kółko z kilkoma czujnikami pozwala wybrać, który otworzyć.

### 1.6.0
- Dodano: karta **Przepływ energii** (`custom:nuvio-flow-card`): sieć, panele, bateria i dom na jednym szklanym schemacie, po liniach płyną kropki, szybciej przy większej mocy. Sieć pokazuje pobór albo oddawanie, bateria poziom naładowania i czy się ładuje, a pierścień domu i legenda pokazują, ile prądu idzie z paneli, sieci i baterii. Jest w **+ Dodaj** z podglądem na żywo, a widok Energia stawia ją na górze, gdy znajdzie czujniki mocy sieci oraz paneli albo baterii.

### 1.5.1
- Naprawiono: zamknięcie okna Assist krzyżykiem zostawiało na ekranie wiadomości, podpowiedzi i pole tekstowe bez szkła pod spodem. Zamknięte okno znika teraz w całości, a rozmowa zostaje na następne otwarcie.

### 1.5.0
- Dodano: widoczność widoków dla poszczególnych osób w **Ustawienia → Widoki**. Domyślnie każdy widok widzą wszyscy; administrator może ukryć widok przed wybranymi osobami, a wiersz pokazuje, kto go nie widzi. Działa też dla osób z własnym układem, a ich otwarty ekran sam się przeładuje bez tego widoku.

### 1.4.0
- Dodano: wspólny dashboard. Domyślnie wszyscy widzą ten sam dashboard, który ustawia administrator; osoby bez uprawnień administratora nie dostają już pustego układu domyślnego. Pierwszy administrator, który otworzy 1.4.0, zamienia swój układ we wspólny.
- Dodano: **Ustawienia → Użytkownicy** dla administratora, z przełącznikiem dla każdego użytkownika Home Assistant. Odznaczona osoba dostaje własny układ, zaczyna od kopii wspólnego i może go sama edytować.
- Dodano: zmiany wspólnego dashboardu trafiają na otwarte ekrany na żywo.
- Naprawiono: ustawienia Assist zapisują się teraz w Home Assistant, zamiast znikać przy następnym zapisie układu.

### 1.3.1
- Dodano: animacja odblokowania dla blokady PIN-em. Kłódka się otwiera, kropki PIN-u świecą na zielono, cyfry rozchodzą się od środka, rozchodzi się miękka fala światła, a rozmyty wygaszacz odpływa i odsłania dashboard. Przy ograniczonym ruchu zostaje krótkie przenikanie.

### 1.3.0
- Dodano: blokada wygaszacza PIN-em (BETA) w **Wygląd → Tryb tabletu ściennego**: PIN, czas blokady i włącz/wyłącz. Zablokowany wygaszacz pokazuje okrągły szklany pinpad na rozmytym zdjęciu, z kropkami PIN-u nad nim i przyciskiem **Zablokuj** pod spodem.
- Dodano: *Zablokuj ekran* w menu użytkownika, gdy blokada PIN-em jest włączona. Zablokowany ekran zostaje zablokowany po przeładowaniu strony.

### 1.2.1
- Naprawiono: tablety w poziomie (od 900 px szerokości i proporcji 1,2, np. iPad trzymany bokiem) znowu używają układu desktopowego, zamiast łączyć pasek zakładek z telefonu z boczną szyną i rozciągać panele. Układ tabletu zostaje dla pionu i bardziej kwadratowych okien, a jego skala jest teraz ograniczona także wysokością okna.

### 1.2.0
- Dodano: siedem kart: warunkowa (`custom:nuvio-conditional-card`), rzut oka, statystyka, nawilżacz, minutnik, dziennik i strona WWW, każda w **+ Dodaj** z podglądem na żywo. Karty `conditional` z HA stają się kartą warunkową Nuvio.
- Dodano: *Wyłącz tryb kiosku* w menu użytkownika, gdy zainstalowany jest Kiosk Mode (tylko administratorzy). Przeładowuje stronę z `?disable_km` i zachowuje to przy przechodzeniu między widokami w tej karcie; ta sama pozycja włącza go z powrotem.
- Dodano: biblioteka formularzy (`hgForm`, przełącznik `nuvio-check`) w formularzach komponentów i edytorze kopii; przeglądarkowe listy podpowiedzi zastąpiła szklana lista.
- Zmieniono: karty, kafelki i wewnętrzne panele w trybie jasnym są mniej przezroczyste.
- Zmieniono: karta suwaka steruje też docelową wilgotnością nawilżacza.

### 1.1.0
- Dodano: kontenery układu jak w Home Assistant: siatka (`custom:nuvio-grid-card`), stos pionowy i stos poziomy, w nowej grupie *Układ* w **+ Dodaj**, z podglądem na żywo.
- Dodano: formularz kontenera pokazuje jego karty. Dodasz dowolny komponent, kafelek albo kartę HA, edytujesz każdą w jej formularzu, zmienisz kolejność przeciągając, zduplikujesz, usuniesz i ustawisz szerokość w kolumnach siatki. Kontenery zagnieżdżają się do trzech poziomów.
- Dodano: przeniesienie karty z panelu do kontenera z jej formularza i wyjęcie karty z kontenera z powrotem na panel.
- Dodano: *Karta z HA (YAML)* wkleja kartę z edytora kodu Home Assistant. `grid`, `vertical-stack` i `horizontal-stack` z HA stają się tam i w konfiguracji strony kontenerami Nuvio (`keep_ha: true` zostawia kartę HA).
- Zmieniono: karta stosu ma odstęp, proporcje szerokości kart obok siebie, szerokość, poniżej której przechodzi w pion, i linie między kartami, które można wyłączyć.

### 1.0.1
- Zmieniono: okno Assist ma to samo szkło, kolor akcentu i animacje co inne okna Nuvio, w jasnym i ciemnym schemacie. Twoje wiadomości, kropki pisania, mikrofon i aktywne pole idą za kolorem akcentu.
- Zmieniono: wybór asystenta (modelu) jest w polu wiadomości po prawej, a zbyt długa nazwa jest skracana. Wybrany asystent jest zapamiętywany i staje się też domyślnym w ustawieniach.
- Naprawiono: w jasnym schemacie okna ustawień i edytora były zbyt przezroczyste na wyrazistym tle.
- Zmieniono: szczegóły pogody otwierają się we wspólnym oknie Nuvio, z tym samym rozmyciem i animacją otwarcia i zamknięcia co inne okna.

### 1.0.0
Nowy wygląd jest gotowy: każda karta jest zbudowana ze wspólnych szklanych klocków, aktualizuje się na żywo i dopasowuje do małego, średniego i dużego rozmiaru. To wydanie kończy prace poprawkami szybkości.
- Zmieniono: paczka jest zminifikowana, z 1253 KB do 1033 KB (307 KB zamiast 366 KB, gdy serwer ją kompresuje). Zapisane układy i ustawienia się nie zmieniają.
- Zmieniono: karty poza widoczną częścią strony nie przerysowują się przy każdej zmianie stanu. Nadrabiają raz, tuż przed wjechaniem w widok. Na telefonie z przykładowym pulpitem pełna runda zmian czujników kosztuje teraz około 3,3 ms zamiast 4,2 ms.
- Zmieniono: wykresy w kartach historii, sieci i w edytorze korzystają ze wspólnej pamięci historii, więc ten sam czujnik jest pobierany z Home Assistant raz dla wszystkich.
- Zmieniono (rozwój): `tools/build.py` minifikuje przez esbuild, gdy jest zainstalowany (`npm install`); bez niego build dalej działa i zapisuje paczkę bez minifikacji.

### 0.16.0
- Dodano: dwanaście kart ogólnych ze wspólnych szklanych klocków: powitanie, kafelek przełącznika, pasek postępu, łuk, wykres, pokój kompakt, szybkie akcje, domownicy, roleta, zamek, wentylator i lista zadań. Każda działa z dowolną encją pasującej domeny i dopasowuje się do małej, średniej i dużej szerokości. Opis w sekcji *Karty ogólne i kontenery* wyżej.
- Dodano: dwa kontenery do układania pulpitów: stos (kilka kart w jednym szkle, pionowo albo poziomo) i zakładki (pigułki przełączające zestawy kart). Oba przyjmują karty Nuvio i zwykłe karty Home Assistant.
- Dodano: przykładowy pulpit złożony tylko z nowych kart, `docs/examples/inspiration-dashboard.yaml`, wzorowany na projekcie wzorcowym.
- Dodano: nowe karty w galerii *Dodaj komponent* w edytorze, z podglądami.
- Zmieniono: karty Nuvio w zwykłym widoku Home Assistant same rozmywają i przyciemniają tło, więc wyglądają jak szkło, a nie jak blada folia. Na stronie Nuvio nic się nie zmienia (panel dalej rozmywa raz dla wszystkich kart).
- Dodano: okna dialogowe mogą zwrócić to, co wpisano w ich pola (`hgOverlay.dialog({ collect: true })`), a Enter w polu naciska główny przycisk. Karta zamka korzysta z tego przy kodach.
- Dodano (rozwój): jedna wspólna pamięć historii (`src/parts/ui/history.part.js`), więc kilka kart z tym samym czujnikiem i okresem pyta Home Assistant raz.

### 0.15.0
- Zmieniono: każda karta aktualizuje się teraz na żywo, także światło, lampa, suwak, klimatyzacja, alarm, asystent, roboty i karta pokoju. Zmiana stanu nie przebudowuje już tych kart, więc otwarty odtwarzacz albo kamera w karcie pokoju dalej grają, a pole kodu w karcie alarmu zachowuje wpisane cyfry.
- Zmieniono: przyciski, przełączniki i kółka ikon we wszystkich kartach ogólnych mają to samo szkło, poświatę i ruch sprężyny co nowe klocki. Kółka ikon są okrągłe, aktywne przyciski delikatnie świecą kolorem akcentu, a przełączniki lekko się wydłużają przy wciśnięciu.
- Zmieniono: wewnętrzne zaokrąglenia idą za tokenami projektu: karty 24 px, kafle i tory w kartach 16 px, małe etykiety 12 px, tak samo w każdym rozmiarze karty.

### 0.14.0
- Zmieniono: jeden wygląd i jeden ruch dla wszystkich okien nad pulpitem. Potwierdzenia (np. „Wyłączyć wszystko?”) to teraz szklane okna, które miękko pojawiają się nad rozmytym tłem, trzymają fokus klawiatury w środku, oddają go przyciskowi, z którego przyszedłeś, i zamykają się klawiszem Escape. Pokazują się też nad kreatorem pierwszego uruchomienia, za którym wcześniej się chowały.
- Dodano: szklane podpowiedzi. Przyciski ikon i elementy z podpowiedzią pokazują małą białą etykietę po krótkim najechaniu albo fokusie z klawiatury, zamiast szarego dymka przeglądarki. Podpowiedzi, które tylko powtarzają widoczny tekst, są pomijane.
- Zmieniono: powiadomienia na dole ekranu korzystają ze wspólnych tokenów ruchu i są teraz nad otwartymi oknami.
- Dodano (rozwój): `hgOverlay` w `src/parts/ui/overlay.part.js` z `dialog`, `alert`, `sheet` (od dołu na telefonie, z boku na szerokim ekranie, przeciągnięcie w dół zamyka), `popover`, `menu` (strzałki, zaznaczone pozycje), `toast` i `tip`. `HGConfirm.ask` ma ten sam podpis i korzysta teraz z `hgOverlay.alert`. Stos powiadomień przeniesiono do `src/parts/ui/toast.part.js`. Strona galerii pokazuje wszystkie nakładki.

### 0.13.0
- Zmieniono: karty aktualizują się na żywo. Gdy urządzenie zmienia stan, zmienia się tylko ta część karty, która jest inna, zamiast przerysowania całej karty. Paski i przełączniki płynnie dojeżdżają do nowej wartości, fokus i przewinięcie zostają, a szybkie czujniki nie powodują już migania kart. Karty z własnym przeciąganiem (światło, klimatyzacja, suwak, lampa, pokój) na razie działają jak dotąd.
- Zmieniono: przełączniki poruszają się miękko jak na sprężynie i lekko się wydłużają przy wciśnięciu.
- Dodano (rozwój): wspólne klocki w `src/parts/ui/` (przycisk ikony, pigułka, zakładki, przełącznik, nagłówek, duża wartość, pasek, łuk, wykres powierzchniowy, awatary) i strona galerii `tests/ui-gallery.html`.

### 0.12.0
- Zmieniono: nowy wygląd szkła kart, paneli i pływających kontrolek, bliższy projektowi wzorcowemu. Szkło ma delikatny refleks światła od lewego górnego rogu, cienką jasną krawędź, mocniejszą u góry, i głębszy miękki cień. W schemacie ciemnym panel pod kartami jest ciemniejszy, więc karty mocniej się wyróżniają.
- Dodano (rozwój): tokeny projektu dla kształtu, szkła, ruchu i typografii w `src/theme_head.js`, opisane w DESIGN.md.

### 0.11.2
- Zmieniono (rozwój): każda karta ma teraz własny plik źródłowy w `src/parts/cards/` (57 plików zamiast 14), a funkcje wspólne dla kilku kart są w `src/parts/shared/`. Pulpit działa dokładnie tak samo: zbudowany bundle zawiera ten sam kod. To pierwszy krok nowej biblioteki komponentów i nowego wyglądu.

### 0.11.1
- Naprawiono: na tabletach (iPad i inne ekrany dotykowe od 768 do 1180 px, w obu ułożeniach) pulpit używa układu tabletu, w którym przewija się strona, a nie szklany panel. Widoki pokoi nie ucinają już kart u góry, kolumny nie nachodzą na siebie i nie ma przesuniętego rozmytego bloku; karty układają się w siatce z najwyżej dwiema kolumnami.
- Naprawiono: lista wyboru asystenta w oknie Assist otwiera się tuż pod przyciskiem, a nie w innym miejscu ekranu; okno jest wyśrodkowane i ma więcej miejsca na nazwę asystenta.

### 0.11.0
- Zmieniono: Assist to teraz szklane okno zamiast karty. Otwierasz je przyciskiem mikrofonu w nagłówku albo klawiszem A; na telefonie wysuwa się od dołu. Rozmowa, wybór asystenta, mikrofon, podpowiedzi i czytanie odpowiedzi zostają, a rozmowa trwa przez całą sesję. Zamykasz X, klawiszem Escape albo dotykiem obok okna.
- Dodano: ustawienia Assist w Ustawieniach, karta Nagłówek i nawigacja: przycisk w nagłówku, skrót A, domyślny asystent, czytanie odpowiedzi, mikrofon i własne podpowiedzi.
- Zmieniono: Assist nie jest już dostępny w + Dodaj. Istniejące karty Assist pokazują mały przycisk, który otwiera okno.
- Naprawiono: przesunięcie palcem po kartach ustawień, suwaku, liście wyboru albo przewijanym w poziomie rzędzie nie przełącza już widoku, a przy otwartym oknie gest zmiany widoku jest wyłączony.

### 0.10.2
- Naprawiono: karta Assist ma własną rozmytą, szklaną powierzchnię, więc treść pod nią już nie prześwituje. Dymki, podpowiedzi i pole wpisywania mają mocniejszy kontrast.

### 0.10.1
- Naprawiono: tytuł karty Assist jest widoczny obok wyboru asystenta.

### 0.10.0
- Dodano: karta Assist. Rozmowa z Home Assistant Assist w szklanej karcie: pole tekstowe, mikrofon (rozpoznawanie mowy w przeglądarce), wybór asystenta, odpowiedzi w dymkach, rozmowa ciągnie się między pytaniami, opcjonalne odpowiedzi na głos, podpowiedzi. Pełna konfiguracja w formularzu, pole JSON oraz eksport i import.
- Dodano: DESIGN.md z zasadami interfejsu, które musi spełniać każda nowa funkcja.

### 0.9.1
- Zmieniono: wygaszacz pokazuje zwykły biały tekst i ikony z miękkim cieniem, bez paneli pod spodem. Podpowiedź wybudzenia jest wyśrodkowana na dole i delikatnie pulsuje, z poszanowaniem ograniczenia ruchu.
- Zmieniono: wszystkie suwaki mają jeden własny wygląd: cienki tor, wypełnienie w kolorze akcentu, biały uchwyt powiększany przy najechaniu i przeciąganiu, wyraźny fokus z klawiatury.

### 0.9.0
- Dodano: 13 nowych komponentów w + Dodaj: światło z jasnością, termostat, duża wartość, wykres historii, drzwi i okna, baterie, odkurzacz, mini odtwarzacz, zegar, słońce, notatka, obraz lub strona, aktualizacje.
- Dodano: panel ustawień z kartami (Wygląd, Widoki, Pokoje, Nagłówek i nawigacja, Tła, Wygaszacz, Kopia zapasowa) i podpisana tabela ustawień widoków.
- Zmieniono: rozmiary kafelków S, M i L to prawdziwe zakresy siatki z gęstym układaniem, więc mniejsze kafelki stają obok siebie.
- Zmieniono: treść kart skaluje się z rozmiarem kafelka (container queries).
- Zmieniono: wiersze cen paliw w ustawieniach nagłówka to karty jedna pod drugą, z krótszymi nazwami czujników pogrupowanymi wg integracji.
- Naprawiono: przycisk edycji tytułu zostaje obok tytułu w widokach na całą szerokość.

### 0.8.1
- Naprawiono: widżety dodane w trybie edycji stosują liczbę kolumn widoku, więc Energia i Sieć zajmują pełną szerokość w 3 kolumnach.

### 0.8.0
- Dodano: liczba kolumn każdego widoku na komputerze i tablecie, także w widokach wbudowanych, np. Energia.
- Dodano: ikona, krótka etykieta na pasek telefonu oraz obecność i kolejność w pasku bocznym dla każdego widoku. Długie etykiety na pasku telefonu są zmniejszane zamiast obcinane.
- Dodano: wybór encji pogody w nagłówku, wybór automatyczny preferuje encję z prognozą, oraz opcjonalny czujnik prognozy (dowolna encja z atrybutem `forecast`, np. z MQTT) dla paska godzinowego.
- Dodano: położenie paska domowników, po lewej albo przy panelu.
- Dodano: punkt ostrości tła zapisany w układzie.
- Naprawiono: panel na całą szerokość (i inne ustawienia widoków lub wyglądu) mógł zniknąć, gdy pulpit był otwarty w innej karcie przeglądarki, bo sekcje układu zapisywały się w całości. Teraz są scalane klucz po kluczu.
- Naprawiono: w Pokojach encja w Pozostałych, która należy do pokoju własnego, pokazuje nazwę tego pokoju.

### 0.7.1
- Naprawiono: widoki pokoi używają ciepłej wody, schodów, nazw encji i ustawień kamer z Wygląd, Pokoje (wcześniej działały tylko nazwy, ikony, kolejność i czujniki).
- Naprawiono: nagłówek widoku pokoju pokazuje nazwę pokoju, temperaturę, wilgotność i przycisk powrotu zamiast ogólnego tytułu.
- Naprawiono: zapis Wygląd, Nagłówek i nawigacja nie usuwa już listy domowników.

### 0.7.0
- Dodano: komponenty dla wszystkiego, co pokazuje Home Glass, każdy w + Dodaj z podglądem i pełnym formularzem: Pokoje, Pokój, Urządzenie AGD (pralka, suszarka, zmywarka ze stanem, programem, czasem do końca i postępem), Ciepła woda, Schody, Ceny paliw, karta Klimatyzacji, Energia tydzień, Fazy, Fotowoltaika, Sieć, Czujniki domu, Skrót i Osoba.
- Dodano: każdy komponent kartowy ma pole Zaawansowana konfiguracja (JSON), więc każdą opcję karty (etykiety, kolory, progi, akcje) można edytować w formularzu.
- Dodano: Wygląd, Pokoje: nazwy, ikony, kolejność i widoczność pokoi, czujnik temperatury i wilgotności na kaflu pokoju (automatycznie, wybrany albo brak), pokoje własne z dowolnymi encjami niezależne od obszarów Home Assistant oraz ręczne przypisywanie encji.
- Dodano: Wygląd, Nagłówek i nawigacja: tytuł domowników albo brak paska domowników, ceny paliw w nagłówku pulpitu i cztery widoki na pasku telefonu.
- Dodano: Wygląd, Galeria teł: własne zdjęcia zapisane w układzie, używane też w pokazie slajdów tabletu ściennego.
- Zmieniono: eksport i import Kopii układu przenoszą wszystko powyżej, a sprawdzanie brakujących encji obejmuje czujniki pokoi i paliw.

### 0.6.5
- Naprawiono: ustawienia trybu tabletu ściennego (wygaszacza) nie zapisywały się, gdy w tym samym Home Assistant był zainstalowany jako zasób Lovelace inny pulpit oparty na Home Glass. Obie paczki dzieliły jeden magazyn układu w pamięci, więc Nuvio zapisywało do klucza drugiego pulpitu, który nie ma sekcji wygaszacza. Nuvio ma teraz własne zmienne globalne, a każda kompilacja dostaje nową nazwę pliku z hashem treści.

### 0.6.4
- Zmieniono: karta **Klimatyzacja** wraca do wyglądu z 0.5.0 (duża temperatura ze strzałkami, suwak z kreskami i przyciski trybów); okrągłe pokrętło z 0.6.0 zostało usunięte. Obsługa dotyku zostaje: przesuń suwak w bok, aby ustawić temperaturę (ruch w górę lub w dół przewija stronę, dotknięcie skacze do miejsca), przytrzymaj temperaturę, aby otworzyć szczegóły encji, dotknij jej, aby włączyć wyłączone urządzenie, przytrzymaj strzałki, aby zmieniać dalej, lekka wibracja przy każdym kroku (aplikacja Home Assistant albo telefon, który to obsługuje), a na klawiaturze Page Up/Down, Home/End.

### 0.6.1
- Tryb tabletu ściennego: zegar nie leży już na szklanym panelu. Data jest na stałe w lewym dolnym rogu, a gdy Home Assistant ma encję pogody, w prawym górnym rogu widać aktualną pogodę (ikona, temperatura, stan).

### 0.6.0
- Nowość: nowy wygląd karty **Klimatyzacja**: szklane pokrętło (łuk 270°) z gradientem temperatury od zimnej do ciepłej, gałka do przeciągania, kropka z temperaturą wnętrza i miękka poświata w kolorze trybu (pomarańcz grzanie, błękit chłodzenie, morski osuszanie), która „oddycha”, gdy urządzenie faktycznie pracuje. Przyciski trybów mają te same kolory.
- Nowość: dotyk na karcie Klimatyzacja: przeciągnij po łuku, aby ustawić temperaturę (przesunięcie palcem przez środek pokrętła dalej przewija stronę), przytrzymaj środek, aby otworzyć szczegóły encji, dotknij środka, aby włączyć wyłączone urządzenie, przytrzymaj −/+, aby zmieniać dalej. Każdy krok daje lekką wibrację (aplikacja Home Assistant albo telefon, który to obsługuje). Klawiatura: strzałki, Page Up/Down, Home/End.
- Nowość: klimatyzacja kompaktowa (strony pokoi): pasek z kreskami zastąpił szklany suwak z gradientem temperatury. Przesuń w bok, aby ustawić, dotknij, aby przeskoczyć, przesuń w górę lub w dół, aby przewinąć stronę.
- Przegląd spójności komponentów: kafle wewnątrz kart Multimedia, Roboty, Czujniki, Alarm i Kamery mają jedną wspólną powierzchnię szkła (to samo wypełnienie i jasna górna krawędź) w trybie jasnym i ciemnym zamiast czterech różnych białych wypełnień z ramkami.
- Naprawiono: w widoku Pokoje nazwa pokoju była ucinana przez temperaturę przy niektórych szerokościach (np. 1440 px); kafle pokoi rosną teraz do treści. Kropki stanu klimatyzacji w pokojach mają kolory trybów.

### 0.5.0
- Nowość: **Tryb tabletu ściennego** (domyślnie wyłączony). Po bezczynności pojawia się szklany wygaszacz z dużym zegarem, datą i zdjęciem, który przyciemnia ekran; wybudza go dotyk, klawisz albo czujnik ruchu (dowolny `binary_sensor` wybrany w ustawieniach). W **Wygląd → Tryb tabletu ściennego** ustawisz czas bezczynności, poziom przyciemnienia, źródło zdjęcia (tło dashboardu, pokaz slajdów albo własny adres) i czujnik, a także obejrzysz podgląd. Zegar lekko zmienia położenie (ochrona paneli OLED), ekran nie gaśnie w czasie wygaszacza, ograniczenie ruchu jest szanowane, a nakładka pojawia się nad oknami Home Assistanta. Ustawienia wchodzą w skład Kopii układu.

### 0.4.1
- Nowość: nowy wygląd kreatora pierwszego uruchomienia: nowoczesny szklany panel na Twoim tle, pasek kroków po lewej z dotychczasowymi wyborami (kliknięcie ukończonego kroku wraca do niego), podgląd pulpitu na żywo na ekranie powitalnym, płynne przejścia między krokami i kafelki pojawiające się kolejno (z poszanowaniem ograniczenia ruchu). W pokojach jest Zaznacz wszystkie / Odznacz wszystkie, wiersze podsumowania otwierają swój krok, Enter przechodzi dalej, a nazwy kolorów są w wybranym języku. Na telefonie kroki zwijają się do paska postępu.
- Naprawiono: na ekranie powitalnym przy dużej szerokości (np. 1440 px) tekst pod „Witaj w Nuvio” był przykryty gradientem zdjęcia. Tekst leży teraz na szkle, obok podglądu.

### 0.4.0
- Nowość: kopia układu w ustawieniach Wygląd. Eksport całego układu do pliku JSON z wersją albo do schowka, z wyborem, co zawiera, oraz import z pliku, przez przeciągnięcie lub z wklejonego tekstu. Import sprawdza plik, pokazuje podsumowanie z widokami, widżetami i encjami, których brak na tej instancji, pozwala wybrać Zastąp albo Połącz, zachowuje bieżący układ jako kopię z przyciskiem Przywróć poprzedni, konwertuje starsze dane i odrzuca błędne pliki z jasnym komunikatem. Tylko dla administratora.

### 0.3.24
- Naprawiono: zmieniona ikona jest widoczna od razu w podglądzie na żywo podczas edycji, a nie dopiero po zapisie. Układy grupowe (Lista, Siatka, Karuzela, Kompaktowa lista) nie miały ikony w nagłówku podglądu, a w podglądzie sekcji mogła się zmieniać niewłaściwa ikona zamiast ikony nagłówka.

### 0.3.23
- Naprawiono: wybór ikony (pole Ikona) dopasowuje się do jasnego i ciemnego motywu. W ciemnym motywie lista była jasna z białymi, prawie niewidocznymi ikonami; teraz to matowe szkło w kolorach motywu z czytelnymi ikonami i etykietami w obu trybach. Otwiera się i zamyka z krótką animacją, strzałka obraca się przy otwarciu, nagłówek listy pokazuje liczbę ikon pasujących do wyszukiwania, podczas wczytywania widać szkielet siatki, a lista zanika przy dolnej krawędzi. Szanuje ograniczenie ruchu.

### 0.3.22
- Naprawiono: podglądy na żywo w arkuszach komponentu i ustawień karty nie są już za duże ani rozjechane. Nowy komponent ma podgląd w naturalnej wysokości i szerokości panelu, istniejąca karta w dokładnie takim rozmiarze jak na stronie; oba są zmniejszane do ramki i wyśrodkowane, bez pustego miejsca. Kafle i grupy mają szerokość panelu zamiast całego arkusza.

### 0.3.21
- Zmieniono: usunięto CI/CD (workflow GitHub Actions z wydaniem i walidacją HACS). Wydania i tagi powstają tylko lokalnie przez `tools/release.sh`.

### 0.3.20
- Dodano: hover i fokus klawiatury na kafelkach w okienku „Więcej” (jaśniejsze szkło, miękki cień, lekkie uniesienie; reakcja na wciśnięcie; bez uniesienia na ekranach dotykowych i przy ograniczonym ruchu).

### 0.3.19
- Naprawiono: okienko „Więcej” z widokami przy szynie jest wyraźnie nad paskiem powiększania i panelem domowników: gęstsze szkło z mocniejszym rozmyciem, lekkie przyciemnienie tła, a przycięcie z animacji otwierania znika po jej zakończeniu (w części przeglądarek wyłączało rozmycie szkła i treść przebijała). Kliknięcie obok lub Escape zamyka okienko.

### 0.3.18
- Naprawiono: pogoda w nagłówku znów ma animowaną ikonę (0.3.17 omyłkowo zmieniła ją na statyczną; nie ona powodowała poświatę).
- Zawiera zmiany z 0.3.17, która nie dostała tagu: brak poświaty na widokach z panelem o połowie szerokości, a wskaźniki zakładek i szyny nie trzymają stałej warstwy GPU.

### 0.3.17
- Zmieniono: wskaźniki zakładek i szyny nie trzymają stałej warstwy GPU (dostają ją tylko na czas animacji).

### 0.3.16
- Naprawiono: Gotowe, Zapisz i inne główne przyciski zatwierdzają i zamykają bez pytania. Pytanie o odrzucenie zmian pojawia się tylko przy zamykaniu formularza z niezapisanymi zmianami (ustawienia karty, formularz komponentu) przez X, Escape, tło lub przeciągnięcie; arkusze stosujące zmiany na żywo (Wygląd, tytuł, Przywróć ukryte, galeria) nigdy nie pytają.
- Naprawiono: anulowanie trybu edycji znów poprawnie przywraca układ (sprawdzanie niezapisanych zmian z 0.3.13 nadpisywało migawkę trybu edycji).
- Naprawiono: przycisk Odrzuć używa koloru błędu z Home Assistant zamiast stałej czerwieni, a kafelek Dodaj w trybie edycji ma rozmiar małego kafelka.

### 0.3.15
- Naprawiono: przycisk ukrywania panelu zmienia ikonę (oko) i etykietę oraz podaje stan przez aria-pressed.
- Naprawiono: długie nazwy encji na kafelkach nie są już ucięte u góry i u dołu; zawijają się do 2 linii z wielokropkiem, a nieznane wartości pokazują Brak danych zamiast kreski.
- Ulepszono: wybór rozmiaru to szklany przełącznik segmentowy z symbolami rozmiaru, równymi szerokościami i etykietami Mały, Średni i Cała szerokość, wybrany w kolorze akcentu.
- Naprawiono: w trybie edycji kafelek Dodaj jest kolejną komórką siatki, wielkości małego kafelka, bez pustych rzędów; uchwyty przeciągania, usuwania i rozmiaru leżą równo na krawędziach kafelka.
- Naprawiono: wszystkie przyciski w stopce okien mają tę samą wysokość i odstępy, są wyrównane do prawej, a na telefonie układają się jeden pod drugim na całą szerokość.
- Nowość: pole Ikona ma wybór ikon z wyszukiwaniem pełnej listy MDI z Home Assistant, ostatnimi ikonami, obsługą klawiatury i podglądem; ręczne wpisanie mdi:nazwa nadal działa.

### 0.3.14
- Naprawiono: widok lub panel bez widocznych elementów pokazuje pusty stan „Pusty widok” z przyciskiem Dodaj widżet, na żywo po usunięciu, ukryciu, cofnięciu lub ponowieniu, w trybie edycji i zwykłym, we wszystkich rodzajach widoków. Cofnięcie przywraca elementy i ukrywa pusty stan.
- Naprawiono: przycisk Cofnij w powiadomieniach używa koloru tekstu dopasowanego do akcentu motywu.

### 0.3.13
- Naprawiono: formularz komponentu otwarty z ustawień karty wraca tam, skąd go otwarto (Wstecz go zamyka), a nie do galerii. Wszystkie arkusze edycji używają jednego stosu nawigacji.
- Ulepszono: wpisany tekst, wyszukiwanie i wybory zostają przy przechodzeniu w przód i wstecz, pozycja przewinięcia jest pamiętana dla każdego kroku, fokus trafia na tytuł kroku i wraca do przycisku, który go otworzył. Escape cofa o krok. Zamknięcie z niezapisanymi zmianami pyta o potwierdzenie (Odrzuć albo Zostań), tylko gdy coś się zmieniło. Na telefonie przeciągnięcie w dół zamyka tylko najwyższy poziom, a przeciągnięcie od lewej krawędzi cofa o krok. Animacje respektują ograniczenie ruchu.
- Nowość: menu użytkownika pokazuje wersję Nuvio i informację o aktualizacji (z encji aktualizacji HACS albo z wydań GitHub, najwyżej raz na 6 godzin) z kropką przy awatarze oraz podpowiedź odświeżenia, gdy na serwerze jest już nowszy plik.

### 0.3.12
- Naprawiono: nawigacja w arkuszach edycji działa jak stos. W zagnieżdżonym kroku (wybór encji, formularz komponentu, styl widżetu, zmiana encji z ustawień karty) X, Escape i nowa strzałka wstecz wracają do poprzedniego kroku z zachowanym stanem; arkusz zamyka tylko X na najwyższym poziomie (galeria + Dodaj albo ustawienia). Kroki wsuwają się płynnie, bez zamykania i ponownego otwierania arkusza.

### 0.3.11
- Zmieniono: zaprojektowane podglądy w galerii + Dodaj. Każdy komponent pokazuje małą makietę z przykładowymi danymi, oznaczoną jako podgląd (suwak z wypełnieniem, przycisk, wiersze encji z przełącznikami, wybór, licznik, łuk wskaźnika, światło, odczyt czujnika, wykres, klimatyzacja, roleta, sceny, odtwarzacz, kamery, moc, energia, pogoda, domownicy, alarm, roboty, kalendarz, mapa) w tym samym stylu szkła i akcentu. Podgląd na żywo z prawdziwą encją pojawia się tylko wtedy, gdy wszystkie potrzebne encje mają znany stan.
- Zmieniono: komponenty bez pasującej encji można nadal wybrać, są tylko lekko przygaszone i mają jedną krótką linię (Brak pasującej encji), a wymagane domeny mniejszym tekstem i w podpowiedzi. Karty mają równą wysokość, podglądy jedną wysokość, a długie teksty są przycinane na telefonie, tablecie i komputerze.

### 0.3.10
- Nowość: szerokość panelu dla każdego widoku. Każdy widok (wbudowany i własny) ma do wyboru **Panel wąski** (kolumna po prawej jak w głównym Panelu, lewa strona wolna na tytuł i tło) albo **Panel na całą szerokość** (jak w Pokojach), z małymi podglądami. Wybór jest w arkuszu tytułu widoku (tryb edycji, tytuł) i w formularzu własnego widoku, działa od razu bez ponownego otwierania okna i zapisuje się dla każdego widoku. Wąski panel mieści najwyżej dwie kolumny; na telefonie panel zawsze zajmuje całą szerokość.
- Zmieniono: podpowiedź pustego widoku zostaje, dopóki własny widok nie ma trzech elementów, i wyświetla się pod kafelkami, więc widok z jednym wierszem nie wygląda już na pusty.

### 0.3.9
- Naprawiono: układy własnych widoków naprawdę się różnią. **Siatka** to równe rzędy z kartami rozciągniętymi do wysokości rzędu, **Kolumny** układają karty od góry w każdej kolumnie po kolei bez wyrównania rzędów, **Masonry** wstawia każdą kartę do najkrótszej kolumny, a **Panel** pokazuje pogodę u góry i dwie kolumny. Zapisywane dla każdego widoku i stosowane po odświeżeniu.
- Naprawiono: okno ustawień widoku aktualizuje się na miejscu. Wybór układu, ikony czy innej opcji nie zamyka już i nie otwiera okna od nowa; zostają pozycja przewinięcia, wpisany tekst i fokus.

### 0.3.8
- Nowość: jeden szklany select w całym Nuvio. Każda lista wyboru (kolumny widoku na urządzeniach, maks. szerokość, źródło odtwarzacza) ma teraz szklany przycisk pasujący do pól i animowaną szklaną listę z rozmyciem widocznym od pierwszej klatki, znacznik w kolorze akcentu przy wybranej opcji, pełną obsługę klawiatury (strzałki, Home, End, Enter, Esc, wyszukiwanie przez pisanie), semantykę ARIA listbox, zamykanie po kliknięciu obok, otwieranie w górę przy dolnej krawędzi i większe pola dotyku na telefonach. Lista wyświetla się nad arkuszami i innym szkłem, więc nigdy nie jest ucięta. Natywny select zostaje pod spodem jako źródło wartości.

### 0.3.7
- Nowość: zapasowe źródło zdjęć i czcionek. Nuvio wczytuje tła, miniatury w galerii i czcionki najpierw z lokalnej instalacji, a gdy plik się nie wczyta, z jsDelivr przypiętego do działającej wersji (`cdn.jsdelivr.net/gh/kczepiec/nuvio@v<wersja>/dist/`). Bez internetu nadal działają pliki lokalne.
- Naprawiono: szwy na szkle przy tle ze zdjęciem. Przyciemnienie tła to teraz jedna nakładka zamiast filtra CSS na pełnoekranowym zdjęciu, a warstwy tła są znów zwykłymi warstwami fixed, więc rozmyte elementy próbkują jednolite tło.
- Naprawiono: okienko "Więcej" na pasku bocznym jest matowe od pierwszej klatki (animacja odsłaniania zamiast przejścia opacity, które wyłączało rozmycie), a kafelki mają równą wysokość i wyrównanie.
- Naprawiono: widoki o tej samej nazwie lub podobnych ścieżkach. Aktywny element paska dopasowuje całe segmenty ścieżki (`/nuvio/test` nie zapala się dla `/nuvio/test2`), a `rail_overflow` przyjmuje ścieżkę widoku i nigdy nie przypisuje dwóch wpisów do jednego elementu.

### 0.3.6
- Nowość: szerokość sekcji. Ustawienia sekcji pulpitu mają **Automatyczna**, **Pełna szerokość** lub **Połowa** z małym podglądem; na telefonie każda sekcja ma pełną szerokość. Zapisywane osobno dla każdej sekcji.
- Nowość: w trybie edycji Nuvio sprawdza na serwerze, czy jest nowszy `nuvio.js`, i prosi o odświeżenie bez pamięci podręcznej (Ctrl+Shift+R), gdy przeglądarka uruchamia starą wersję. Nagłówek galerii + Dodaj pokazuje załadowaną wersję.
- Zmieniono: karty podpowiedzi pustego stanu mają promień 16 px i mniejszą ikonę.
- Naprawiono: miniatury teł, które się nie wczytały, pokazują „Nie wczytano zdjęcia” zamiast samego gradientu i zapisują adres w konsoli.
- Naprawiono: wybrana miniatura tła miała podwójną ramkę fokusu; fokus z klawiatury to teraz jeden zaokrąglony pierścień w kolorze akcentu, bez ramki po kliknięciu myszą.
- Naprawiono: tło i przyciemnienie są pojedynczymi pełnoekranowymi warstwami GPU, więc szklane elementy próbkują jedno tło (dotyczy pionowego szwu widocznego w Chrome na macOS).

### 0.3.5
- Naprawiono: tło wybrane w starszej wersji (zapisane ze starą ścieżką `assets/backgrounds/` lub `assets/bg/`) jest przenoszone na nowy płaski plik `nuvio-bg-*`, więc po aktualizacji znów się wyświetla.

### 0.3.4
- Naprawiono: po instalacji z HACS brakowało czcionek, teł i ikon pogody. HACS pobiera tylko pliki leżące bezpośrednio w `dist/`, więc wszystkie zasoby są tam teraz z unikalnymi nazwami (`nuvio-font-*`, `nuvio-bg-*`, `nuvio-meteo-*`); autorzy teł w `dist/CREDITS.md`.
- Naprawiono: baza zasobów brana jest z adresu modułu, więc instalacja ręczna w `/local/nuvio/` ładuje własne czcionki i tła zamiast z `/hacsfiles/nuvio/`.

### 0.3.3
- Naprawiono: w trybie edycji uchwyt i X pierwszego bloku w kolumnie pokoju były rysowane na bloku z poprzedniej kolumny; każdy blok ma teraz dokładnie jeden uchwyt (lewy górny róg), jeden X (prawy górny) i S/M/L w środku.
- Zmieniono: wydania nie mają już załączników `nuvio.zip` ani `nuvio.js`. HACS instaluje wtedy cały folder `dist/` razem z `assets/` (czcionki, tła); przy załącznikach pomijał `dist/` i zostawiał starą wersję. Instalacja ręczna: `dist/` z archiwum źródeł wydania.

### 0.3.2
- Nagłówek galerii + Dodaj pokazuje wersję załadowanej paczki Nuvio, więc stara lub zbuforowana paczka (bez grupy Podstawowe) jest od razu widoczna. Po aktualizacji w HACS odśwież przeglądarkę (Ctrl+Shift+R) albo wyczyść pamięć aplikacji.

### 0.3.1
- Naprawiono: uniwersalne komponenty (Suwak, Przycisk, Lista encji, Wybór, Licznik, Wskaźnik) nie pojawiały się w galerii + Dodaj w pokojach (galeria pokoju pokazywała tylko kafelki); teraz są w grupie **Podstawowe** z miniaturami na żywo, a pokoje wyświetlają dodane komponenty.
- Zmieniono: formularz komponentu nie pokazuje już wyboru trybu wyświetlania; prawdziwe warianty są opisane jako **Opcje komponentu**.
- Naprawiono: niezaznaczone pola wyboru w oknie importu pokoju były niewidoczne na ciemnym tle.

### 0.3.0
- Nowość: widok pustego pokoju z dwiema akcjami. **Importuj z obszaru** pokazuje encje z obszaru (oraz encje z nazwą pasującą do pokoju) z polami wyboru, wyszukiwarkę **Wybierz encje** do ręcznego wyboru i opcję przypisania ich też do obszaru w Home Assistant; zaznaczone encje stają się kafelkami ułożonymi według rodzaju (klimatyzacja i kamery duże, multimedia średnie). **Utwórz własny układ** otwiera tryb edycji z pustym pokojem i galerią + Dodaj.

### 0.2.1
- Naprawiono: HACS rejestrował jako zasób `nuvio.zip` zamiast `nuvio.js`, przez co strategia dashboardu się nie ładowała („Timeout waiting for strategy element”).

### 0.2.0
- Naprawiono: przyciski scen wywołują `scene.turn_on` (wcześniej nic nie robiły).
- Naprawiono: czujniki mocy w kW / MW są przeliczane na waty w kartach mocy, energii, faz i fotowoltaiki.
- Naprawiono: kamery w widoku pokoju nie psują się po ok. 10 minutach (rotujący token obrazu).
- Naprawiono: zapis układu scala się z najnowszą wersją z serwera (bez nadpisywania między urządzeniami); kopia lokalna jest osobna dla każdego użytkownika HA.
- Naprawiono: strzałki klimatyzacji nie powtarzają się po puszczeniu poza kartą; termostaty z zakresem `heat_cool` są tylko do odczytu; domyślny krok 0,5 °C.
- Naprawiono: telewizor w trybie czuwania się włącza; przyciski odtwarzania, rolet i zaworów uwzględniają możliwości urządzenia.
- Naprawiono: kalendarz miesięczny się odświeża; pole kodu alarmu nie traci fokusu; pogoda używa jednostki opadów i tekstowego kierunku wiatru.
- Naprawiono: strona nie wywraca się przy pustym `rail`; wyjście z trybu edycji przez nawigację zapisuje zmiany zamiast je odrzucać.
- Dodano: angielski interfejs wszystkich kart, strony i trybu edycji.
- Dodano: zmiana kolejności z klawiatury w trybie edycji; „Cofnij” po usunięciu kafla przywraca tylko ten kafel.
- HACS: fonty, tła i ikony pogody instalują się razem z wtyczką (cały folder `dist/`).
- Wieloetapowy kreator; własne widoki (Wygląd → Widoki); komponenty i widoki Mapa i Kalendarz.
- Komponenty ogólne: suwak, przycisk, lista encji, wybór, licznik, wskaźnik.
- Podpowiedzi dla pustych stanów, tryby wyświetlania kart grupowych, edytowalny tytuł i podtytuł widoku, stos powiadomień.

### 0.1.1
- Galeria „+ Dodaj” z podglądem na żywo; poprawka szuflady w trybie kiosku; katalog komponentów w README.
