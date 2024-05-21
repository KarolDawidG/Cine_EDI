const generateEDIDocument = (orderDetails) => {
    const segments = [];

    const orderDetailsJson = JSON.parse(orderDetails);

    const account = orderDetailsJson[0].account;
    const rentalLength = orderDetailsJson[0].rentals.length;
    const rentalDate = formatDateForEDI(orderDetailsJson[0].rentals[0].rentalDate);

    // Segment UNB - Nagłówek interfejsu
    segments.push(`UNB+UNOA:3+${account.email}:ZZZ+RECEIVER_ID:ZZZ+${rentalDate}+0000000001'`);
    
    // Segment UNH - Nagłówek wiadomości
    segments.push(`UNH+1+ORDERS:D:96A:UN'`);

    // Segment BGM - Początek wiadomości
    segments.push(`BGM+220+ORDER12345+9'`);

    // Segment DTM - Data/Czas/Okres dla daty wynajmu
    segments.push(`DTM+137:${rentalDate}:102'`);

    // Segment NAD - Nazwa i adres dostawcy
    segments.push(`NAD+SU+CineEDI'`);

    // Segment NAD - Nazwa i adres klienta
    segments.push(`NAD+BY++${account.firstName} ${account.secondName}::160++${account.email}'`);

    // Segment NAD - Miejsce dostawy
    segments.push(`NAD+DP+++${account.street} ${account.houseNumber}::${account.city}:${account.postalCode}'`);

    // Iteracja przez wszystkie wynajmy
    orderDetailsJson[0].rentals.forEach((rental, index) => {
        // Segment LIN - Pozycja zamówienia
        segments.push(`LIN+${index + 1}++${rental.vhs.title}'`);

        // Segment QTY - Ilość
        segments.push(`QTY+21:1'`);

        // Segment PRI - Szczegóły ceny
        segments.push(`PRI+AAA:${rental.vhs.pricePerDay}'`);

        // Segment DTM - Data zwrotu (termin zwrotu)
        segments.push(`DTM+206:${formatDateForEDI(rental.dueDate)}:102'`);
    });

    // Segment UNS - Kontrola sekcji
    segments.push(`UNS+S'`);

    // Segment CNT - Całkowita liczba pozycji zamówienia
    segments.push(`CNT+2:${rentalLength}'`);

    // Segment CNT - Całkowita ilość
    segments.push(`CNT+7:${rentalLength}'`); // Zakładając, że każdy wynajem ma ilość 1

    // Segment UNT - Zakończenie wiadomości
    segments.push(`UNT+${segments.length + 2}+1'`); // liczba segmentów w finalnym UNT

    // Segment UNZ - Zakończenie interfejsu
    segments.push(`UNZ+1+0000000001'`);

    return segments.join("\n");
}

// Funkcja formatowania daty dla EDI
const formatDateForEDI = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}

module.exports = {
    generateEDIDocument,
};


// Wyjaśnienie segmentów na przykladzie zamowienia 3 filmow przez danego uzytkownika:
// UNB: Nagłówek interfejsu, zawiera informacje o nadawcy (kowalska@o2.pl), odbiorcy (RECEIVER_ID), oraz datę i czas przygotowania (240521).
// UNH: Nagłówek wiadomości, identyfikuje typ wiadomości (ORDERS) i wersję standardu (D96A).
// BGM: Początek wiadomości, identyfikuje dokument jako zamówienie oraz numer referencyjny (ORDER12345).
// DTM: Data/Czas/Okres, zawiera datę wynajmu (240521).
// NAD+SU: Nazwa i adres dostawcy, identyfikuje dostawcę (CineEDI).
// NAD+BY: Nazwa i adres klienta, identyfikuje klienta (Anna Kowalska, kowalska@o2.pl).
// NAD+DP: Miejsce dostawy, adres dostawy (Cwiartki 22, Olsztyn, 17-777).
// LIN+1: Pierwsza pozycja zamówienia, identyfikuje film (RoboCop).
// QTY+21: Ilość pierwszej pozycji zamówienia (1).
// PRI+AAA: Cena za dzień wypożyczenia pierwszej pozycji (5).
// DTM+206: Data zwrotu pierwszej pozycji (240528).
// LIN+2: Druga pozycja zamówienia, identyfikuje film (Gravity).
// QTY+21: Ilość drugiej pozycji zamówienia (1).
// PRI+AAA: Cena za dzień wypożyczenia drugiej pozycji (5).
// DTM+206: Data zwrotu drugiej pozycji (240528).
// LIN+3: Trzecia pozycja zamówienia, identyfikuje film (Superman).
// QTY+21: Ilość trzeciej pozycji zamówienia (1).
// PRI+AAA: Cena za dzień wypożyczenia trzeciej pozycji (5).
// DTM+206: Data zwrotu trzeciej pozycji (240528).
// UNS: Separator sekcji.
// CNT+2: Całkowita liczba pozycji zamówienia (3).
// CNT+7: Całkowita ilość (3).
// UNT: Zakończenie wiadomości, zawiera liczbę segmentów w wiadomości (24).
// UNZ: Zakończenie interfejsu, zawiera liczbę wiadomości w interfejsie (1).