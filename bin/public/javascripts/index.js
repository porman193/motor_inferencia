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
        if(neighbors){
            for (let neighbor of neighbors) {
                let newNeighbor = new Node(neighbor.attribute, neighbor.value);
                newNode.addNeighbor(newNeighbor);
            }
        }
        graph.addNode(newNode);
    }
    inference_engine.rules = storedEngine.rules;
    inference_engine.findFacts();
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
        window.location.href = './main.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const inferButton = document.getElementById('inferButton');
    const resultTextArea = document.getElementById('resultsText');
    const resultDiv = document.getElementById('results');
    const inferInput = document.getElementById('infer');

    inferButton.addEventListener('click', function() {
        // Obtenemos el valor ingresado en el campo de inferencia
        const inferValue = inferInput.value.trim();

        // Verificamos si el valor cumple con el formato esperado "atributo=valor"
        const inferRegex = /^[a-zA-Z0-9\s]+=[a-zA-Z0-9\s]+$/;
        if (!inferRegex.test(inferValue)) {
            alert('Por favor, ingrese la conclusión en el formato correcto: "atributo=valor"');
            return; // Detener la ejecución si el formato es incorrecto
        }

        console.log("Realizando inferencia...");
        const conclusionParts = inferValue.split('=');
        const searchNode = new Node(conclusionParts[0].trim(), conclusionParts[1].trim());
        const results = inference_engine.backwardChain(searchNode);

        if (results.length > 0) {
            const resultsText = results.map(rule => {
                const conclusion = `${rule.conclusion.attribute}=${rule.conclusion.value}`;
                const conditions = rule.conditions.map(condition => `${condition.attribute}=${condition.value}`).join(' Y ');
                return `Si ${conditions} -> ${conclusion} `;
            }).join('\n');
            resultDiv.style.display = 'block'; // Muestra el div de resultados
            resultTextArea.value = "Para llegar a la conclusión "+inferValue+" se deben cumplir las siguientes reglas: \n"+resultsText;
        } else {
            resultDiv.style.display = 'none'; // Oculta el div de resultados si no se encontraron resultados
            resultTextArea.value = ""; // Limpia el área de texto
            alert('No se encontraron resultados');
        }
    });
});
