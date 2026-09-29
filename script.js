function doPost(e) {
    const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getActiveSheet();

    const now = new Date();

    const meal = e.parameter.meal;
    const score = e.parameter.score;
    const comment = e.parameter.comment || "";
    const userId = e.parameter.userId;

    if (!userId) {
    return ContentService
        .createTextOutput("ERROR: falta identificador");
    }

  // Buscar votos anteriores de este usuario
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
    const previousDate = data[i][0];
    const previousTime = data[i][1];
    const previousUserId = data[i][5];

    if (previousUserId === userId) {

      // Reconstruir fecha y hora del voto anterior
        const previousDateTime = new Date(
        Utilities.formatDate(
            new Date(previousDate),
        "Europe/Madrid",
        "yyyy-MM-dd"
        ) +
        "T" +
        previousTime
        );

        const hoursPassed =
        (now - previousDateTime) / (1000 * 60 * 60);

      // Menos de 4 horas
        if (hoursPassed < 4) {
        return ContentService
            .createTextOutput("BLOCKED");
        }
    }
    }

  // Registrar el voto
    sheet.appendRow([
    Utilities.formatDate(now, "Europe/Madrid", "dd/MM/yyyy"),
    Utilities.formatDate(now, "Europe/Madrid", "HH:mm:ss"),
    meal,
    score,
    comment,
    userId
    ]);

    return ContentService
    .createTextOutput("OK");
}