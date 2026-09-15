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

    /* Umbrales para 12 preguntas:
       ≥12 → Maestría absoluta  (equivale a 5/5)
       ≥10 → Casi maestría       (equivale a 4/5)
       ≥7  → Afinando el instinto (equivale a 3/5)
       ≥5  → El umbral del conocimiento (equivale a 2/5)
       ≥2  → Una gota de precisión (equivale a 1/5)
        0  → El primer paso de la fórmula */
    var THRESHOLDS = [
        { min: 12, index: 5 },
        { min: 10, index: 4 },
        { min: 7,  index: 3 },
        { min: 5,  index: 2 },
        { min: 2,  index: 1 },
        { min: 0,  index: 0 }
    ];

    function readAnswer(question) {
        try {
            return sessionStorage.getItem("respuesta-" + question);
        } catch (e) {
            return null;
        }
    }

    var blocks = document.querySelectorAll(".results__question-block");
    var total = blocks.length;
    var score = 0;

    blocks.forEach(function (block) {
        var question = block.dataset.question;
        var given = readAnswer(question);
        var options = block.querySelectorAll(".results__option");
        var isCorrectAnswer = false;
        var isDrag = block.dataset.type === "drag";

        options.forEach(function (opt) {
            var isCorrect = opt.dataset.correct === "true";
            /* Drag questions store a composite "producto+producto" value;
               regular questions store a letter "A"/"B"/"C"/"D"          */
            var wasSelected = isDrag
                ? (opt.dataset.dragValue === given)
                : (opt.dataset.value === given);

            if (isCorrect) {
                opt.classList.add("is-correct");
            }
            if (wasSelected && !isCorrect) {
                opt.classList.add("is-wrong");
            }
            if (wasSelected && isCorrect) {
                isCorrectAnswer = true;
            }
        });

        if (isCorrectAnswer) score++;

        /* Para preguntas de arrastre donde la combinación elegida
           no coincide con ninguna opción listada, mostrar nota */
        if (isDrag && given !== null && !isCorrectAnswer) {
            var noMatchedOption = true;
            options.forEach(function (opt) {
                if (opt.classList.contains("is-wrong")) noMatchedOption = false;
            });
            if (noMatchedOption) {
                var note = document.createElement("p");
                note.style.cssText = "margin-top:0.6rem;font-size:0.82rem;opacity:0.55;font-family:inherit;letter-spacing:0.04em;text-transform:uppercase;";
                var parts = given.split("+").map(function (p) {
                    return p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " ");
                });
                note.textContent = "Tu combinación: " + parts.join(" + ");
                block.appendChild(note);
            }
        }
    });

    /* Determinar mensaje según umbrales explícitos */
    var messageIndex = 0;
    for (var i = 0; i < THRESHOLDS.length; i++) {
        if (score >= THRESHOLDS[i].min) {
            messageIndex = THRESHOLDS[i].index;
            break;
        }
    }
    var msg = MESSAGES[messageIndex] || MESSAGES[0];

    var scoreEl = document.getElementById("scoreValue");
    var totalEl = document.getElementById("totalQuestions");
    var titleEl = document.getElementById("resultTitle");
    var messageEl = document.getElementById("resultMessage");

    if (scoreEl) scoreEl.textContent = score;
    if (totalEl) totalEl.textContent = total;
    if (titleEl) titleEl.textContent = msg.title;
    if (messageEl) messageEl.textContent = msg.text;
})();
