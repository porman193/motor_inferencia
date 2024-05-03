import InferenceEngine from './inference_engine.js';

document.addEventListener('DOMContentLoaded', function() {
    const rulesTextArea = document.getElementById('rules');

    // Obtener el motor de inferencia desde el almacenamiento local
    const inference_engine = JSON.parse(localStorage.getItem('inference_engine'));
    console.log(inference_engine);

    if (inference_engine && inference_engine.rules) {
        // Si hay reglas en el motor de inferencia, mostrarlas en el campo de texto
        const rulesText = inference_engine.rules.map(rule => {
            const conclusion = `${rule.conclusion.attribute}=${rule.conclusion.value}`;
            const conditions = rule.conditions.map(condition => `${condition.attribute}=${condition.value}`).join(' Y ');
            return `Si ${conditions} -> ${conclusion} `;
        }).join('\n');

        rulesTextArea.value = rulesText;
    }

    if (inference_engine && inference_engine.facts) {
        // Si hay hechos en el motor de inferencia, mostrarlas en el cmapo de texto
        const factsTextArea = document.getElementById('facts');
        const factsText = inference_engine.facts.map(fact => `${fact.attribute}=${fact.value}`).join('\n');
        factsTextArea.value = factsText;
    }
});