import Graph from './graph.js';
import { Node } from './graph.js';
import InferenceEngine from './inference_engine.js';

const graph = new Graph();
const inference_engine = new InferenceEngine(graph);

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rules_form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener los valores de los campos de texto
        const conclusion = document.getElementById('conclusion_input').value.trim();
        const conditionsText = document.getElementById('conditions').value.trim();

        // Verificar si los datos tienen el formato correcto
        const conclusionRegex = /^[a-zA-Z]+=[a-zA-Z]+$/;
        const conditionsRegex = /^([a-zA-Z]+=[a-zA-Z]+)(,[a-zA-Z]+=[a-zA-Z]+)*$/;

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
        inference_engine.findFacts();
        // Si los datos tienen el formato correcto, hacer algo con ellos
        console.log('Conclusión:', conclusionNode);
        console.log('Condiciones:', conditionsNodeArray);
        console.log('Reglas:', inference_engine.rules);
        console.log('Hechos:', inference_engine.facts);

        // Guardar las reglas en el almacenamiento local
        localStorage.setItem('inference_engine', JSON.stringify(inference_engine));

        // Limpiar los campos de entrada después de guardar la regla
        document.getElementById('conclusion_input').value = '';
        document.getElementById('conditions').value = '';

        // Mostrar una alerta indicando que la regla ha sido guardada
        alert('Regla guardada');

    });
});