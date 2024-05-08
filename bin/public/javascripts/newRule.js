import Graph from './graph.js';
import { Node } from './graph.js';
import InferenceEngine from './inference_engine.js';

const graph = new Graph();
const inference_engine = new InferenceEngine(graph);
if (JSON.parse(localStorage.getItem('inference_engine'))) {
    const storedEngine = JSON.parse(localStorage.getItem('inference_engine'));
    let nodes = storedEngine.graph.nodes;
    console.log(nodes)
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
    inference_engine.facts = storedEngine.facts;
}  
console.log(inference_engine)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rules_form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener los valores de los campos de texto
        const conclusion = document.getElementById('conclusion_input').value.trim();
        const conditionsText = document.getElementById('conditions').value.trim();

        // Verificar si los datos tienen el formato correcto
        const conclusionRegex = /^[a-zA-Z0-9\s]+=[a-zA-Z0-9\s]+$/;
        const conditionsRegex = /^([a-zA-Z0-9\s]+=[a-zA-Z0-9\s]+)(,[a-zA-Z0-9\s]+=[a-zA-Z0-9\s]+)*$/;

        if (!conclusionRegex.test(conclusion)) {
            alert('El formato de la conclusión no es válido. Debe ser "atributo=valor".');
            return;
        }

        if (!conditionsRegex.test(conditionsText)) {
            alert('El formato de las condiciones no es válido. Debe ser "atributo=valor,atributo=valor,...".');
            return;
        }

        let conditions = conditionsText.split(',');

        // Crear un nodo para la conclusión
        const conclusionParts = conclusion.split('=');
        const conclusionNode = new Node(conclusionParts[0], conclusionParts[1]);
        let conditionsNodeArray = [];

        for (let condition of conditions) {
            const conditionParts = condition.split('=');
            const conditionNode = new Node(conditionParts[0], conditionParts[1]);
            conditionsNodeArray.push(conditionNode);
        }

        // Crear una regla con la conclusión y las condiciones
        inference_engine.createRule(conclusionNode, conditionsNodeArray);

        // Guardar las reglas en el almacenamiento local
        console.log(inference_engine.graph)
        localStorage.setItem('inference_engine', JSON.stringify(inference_engine));

        // Limpiar los campos de entrada después de guardar la regla
        document.getElementById('conclusion_input').value = '';
        document.getElementById('conditions').value = '';

        // Mostrar una alerta indicando que la regla ha sido guardada
        alert('Regla guardada');
    });
});
