import InferenceEngine from './inference_engine.js';
import Graph from './graph.js';
import { Node } from './graph.js';
// Obtener el motor de inferencia desde el almacenamiento local
const graph = new Graph();
const inference_engine = new InferenceEngine(graph);
if (JSON.parse(localStorage.getItem('inference_engine'))) {
    const storedEngine = JSON.parse(localStorage.getItem('inference_engine'));
    let nodes = storedEngine.graph.nodes;
    for (let node of nodes) {
        let neighbors = node.neighbors;
        let newNode = new Node(node.attribute, node.value);
        for (let neighbor of neighbors) {
            let newNeighbor = new Node(neighbor.attribute, neighbor.value);
            newNode.addNeighbor(newNeighbor);
        }
        graph.addNode(newNode);
    }
    inference_engine.rules = storedEngine.rules;
    inference_engine.facts = storedEngine.facts;
}   
document.addEventListener('DOMContentLoaded', function() {
    const rulesTextArea = document.getElementById('rules');
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

document.addEventListener('DOMContentLoaded', function() {
    const addRulesLink = document.getElementById('addRulesLink');
    addRulesLink.addEventListener('click', function(event) {
        event.preventDefault(); // Evita que el enlace se comporte como un enlace normal
        // Guardar el motor en el almacenamiento local
        localStorage.setItem('inference_engine', JSON.stringify(inference_engine));
        // Redirigir a la página para añadir nuevas reglas
        window.location.href = 'views/addRules';
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const resetEngineBtn = document.getElementById('resetEngineBtn');
    const factsTextArea = document.getElementById('facts');
    const rulesTextArea = document.getElementById('rules');
    resetEngineBtn.addEventListener('click', function() {
        // Limpiar el motor de inferencia
        localStorage.clear();
        // Limpiar los campos de texto
        factsTextArea.value = '';   
        rulesTextArea.value = '';
        alert('Motor de inferencia reiniciado');
        console.log('Motor reiniciado');
    });
});