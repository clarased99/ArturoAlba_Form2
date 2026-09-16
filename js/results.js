(function () {
    "use strict";

    /* Mensajes de marca según nº de aciertos */
    var MESSAGES = [
        { title: "El primer paso de la fórmula", text: "Todo ritual de conocimiento empieza por descubrir. Aún no conoces los secretos de Arturo Alba, pero cada fórmula tiene su ciencia — y cada ciencia, su momento de aprenderse." },
        { title: "Una gota de precisión", text: "Has rozado la superficie de la fórmula. La piel guarda más secretos de los que imaginas — y Arturo Alba, la ciencia para descifrarlos." },
        { title: "El umbral del conocimiento", text: "Empiezas a intuir la lógica detrás de cada activo. Un poco más de atención y la fórmula se revelará por completo." },
        { title: "Afinando el instinto", text: "Tu mirada ya distingue lo esencial. Estás a medio camino entre la intuición y la maestría que exige esta ciencia del rejuvenecimiento." },
        { title: "Casi maestría", text: "Conoces la fórmula casi tan bien como quien la creó. Solo un detalle te separa de dominar por completo el lenguaje de Arturo Alba." },
        { title: "Maestría absoluta", text: "Dominas la ciencia y el arte que hay detrás de cada fórmula. Tu conocimiento está a la altura de la propia filosofía Arturo Alba." }
    ];

    /* Umbrales para 12 preguntas */
    var THRESHOLDS = [
        { min: 12, index: 5 },
        { min: 10, index: 4 },
        { min: 7,  index: 3 },
        { min: 5,  index: 2 },
        { min: 2,  index: 1 },
        { min: 0,  index: 0 }
    ];

    /* Nombres legibles de cada producto (para combinaciones libres no listadas) */
    var PRODUCT_NAMES = {
        "agua-micelar":        "Agua Micelar",
        "limpiadora-espumosa": "Limpiadora Espumosa Recuperadora",
        "manteca":             "Manteca de Primera Limpieza",
        "infusion":            "Infusión Absoluta Exo-Peptídica",
        "rapsodia":            "Rapsodia Alta Recuperación",
        "retinoide":           "Retinoide Extremo",
        "solucion-exfoliante": "Solución Química Exfoliante",
        "dmae":                "Firmeza y Luminosidad DMAE-Ursólico",
        "sod":                 "Antioxidante y Luminosidad SOD-Ferúlico",
        "hidrolipidica":       "Hidratante Regenerante Hidrolipídica",
        "normocorrectora":     "Mascarilla Normo-Correctora",
        "bruma":               "Bruma Fitoactiva Calmante"
    };

    function readAnswer(question) {
        try { return sessionStorage.getItem("respuesta-" + question); }
        catch (e) { return null; }
    }

    /* Devuelve el HTML de una fila de resultado con flecha */
    function makeRow(cssClass, text) {
        return '<li><button type="button" class="results__option ' + cssClass + '">' +
            '<span class="results__option-icon" aria-hidden="true">→</span>' +
            '<span class="results__option-text">' + text + '</span>' +
            '</button></li>';
    }

    /* Convierte "slug-a+slug-b" en texto legible */
    function slugsToText(combined) {
        return combined.split("+").map(function (slug) {
            return PRODUCT_NAMES[slug] || slug.replace(/-/g, " ");
        }).join(" + ");
    }

    var blocks = document.querySelectorAll(".results__question-block");
    var total  = blocks.length;
    var score  = 0;

    blocks.forEach(function (block) {
        var question = block.dataset.question;
        var given    = readAnswer(question);
        var isDrag   = block.dataset.type === "drag";

        /* ----------------------------------------------------------------
           PREGUNTAS DE ARRASTRE (Q1, Q9, Q12)
           Muestra solo la combinación correcta (verde) y, si el usuario
           se equivocó, su combinación (rojo). Sin las 4 opciones extra.
        ---------------------------------------------------------------- */
        if (isDrag) {
            var optionsList = block.querySelector(".results__options");
            var correctOpt  = block.querySelector(".results__option[data-correct='true']");
            var correctValue = correctOpt ? correctOpt.dataset.dragValue : null;
            var correctText  = correctOpt
                ? correctOpt.querySelector(".results__option-text").textContent
                : slugsToText(correctValue || "");

            var isCorrect = (given !== null && given === correctValue);
            if (isCorrect) score++;

            /* Fila verde: combinación correcta (siempre visible) */
            var html = makeRow("is-correct", correctText);

            /* Fila roja: combinación del usuario (solo si falló) */
            if (!isCorrect && given !== null) {
                /* Buscar texto descriptivo entre las opciones del HTML */
                var userText = null;
                block.querySelectorAll(".results__option").forEach(function (opt) {
                    if (opt.dataset.dragValue === given) {
                        userText = opt.querySelector(".results__option-text").textContent;
                    }
                });
                /* Si no estaba entre las opciones, construirlo desde slugs */
                if (!userText) { userText = slugsToText(given); }
                html += makeRow("is-wrong", "Tu combinación: " + userText);
            }

            optionsList.innerHTML = html;
            return;
        }

        /* ----------------------------------------------------------------
           PREGUNTAS NORMALES (A / B / C / D)
        ---------------------------------------------------------------- */
        var options = block.querySelectorAll(".results__option");
        var isCorrectAnswer = false;

        options.forEach(function (opt) {
            var isCorrect   = opt.dataset.correct === "true";
            var wasSelected = opt.dataset.value === given;

            if (isCorrect)              { opt.classList.add("is-correct"); }
            if (wasSelected && !isCorrect) { opt.classList.add("is-wrong"); }
            if (wasSelected && isCorrect)  { isCorrectAnswer = true; }
        });

        if (isCorrectAnswer) score++;
    });

    /* Determinar mensaje según umbrales */
    var messageIndex = 0;
    for (var i = 0; i < THRESHOLDS.length; i++) {
        if (score >= THRESHOLDS[i].min) { messageIndex = THRESHOLDS[i].index; break; }
    }
    var msg = MESSAGES[messageIndex] || MESSAGES[0];

    var scoreEl   = document.getElementById("scoreValue");
    var totalEl   = document.getElementById("totalQuestions");
    var titleEl   = document.getElementById("resultTitle");
    var messageEl = document.getElementById("resultMessage");

    if (scoreEl)   scoreEl.textContent   = score;
    if (totalEl)   totalEl.textContent   = total;
    if (titleEl)   titleEl.textContent   = msg.title;
    if (messageEl) messageEl.textContent = msg.text;
})();
