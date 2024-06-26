
class InferenceEngine {
  constructor(graph) {
    this.graph = graph;
    this.rules = [];
    this.facts = [];
  }

  createRule(conclusion, conditions) {
    this.graph.addNode(conclusion);
    this.graph.addNeighborsToNode(conclusion, conditions);
    for (let condition of conditions) {
      this.graph.addNode(condition);
    }
    this.rules.push({ conclusion: conclusion, conditions: conditions });
  }

  findFacts() {
    let nodes = this.graph.getNodes();
    for (let node of nodes) {
      if (node.getNeighbors().length == 0 && !this.facts.includes(node)) {
        this.facts.push(node);
      }
    }

  } 
  backwardChain(conclusionTofind, rulesFound = []) {
    let searchAttribute = conclusionTofind.attribute;
    let searchValue = conclusionTofind.value;

    // Verificar si el hecho ya está en los hechos conocidos
    if (this.facts.some(fact => fact.attribute === searchAttribute && fact.value === searchValue)) {
        return conclusionTofind.attribute + '=' + conclusionTofind.value;
    }

    for (let rule of this.rules) {
        if (rule.conclusion.value === searchValue && rule.conclusion.attribute === searchAttribute) {
            let conditionsMet = true;
            for (let condition of rule.conditions) {
                // Verificar si la condición ya es un hecho conocido
                if (!this.facts.some(fact => fact.attribute === condition.attribute && fact.value === condition.value)) {
                    // Si no es un hecho conocido, recursivamente realizar la inferencia hacia atrás
                    let conditionNode = this.graph.getNodeByValueAndAttribute(condition.value, condition.attribute);
                    let inferredConclusion = this.backwardChain(conditionNode, rulesFound);
                    
                    // Verificar si se encontró la conclusión
                    if (!inferredConclusion) {
                        conditionsMet = false;
                        break;
                    }
                }
            }
            // Si todas las condiciones se cumplieron, agregar la regla encontrada al array de reglas
            if (conditionsMet) {
                rulesFound.push(rule);
            }
        }
    }
    // Devolver el array de reglas encontradas
    return rulesFound;
}


}

export default InferenceEngine;

// Ejemplo de uso
/*
const graph = new Graph();
const inference = new InferenceEngine(graph);
const nodeA = new Node('sonido', 'croak');
const nodeB = new Node('sonido', 'chirps');
const nodeC = new Node('canta', 'true');
const nodeD = new Node('animal', 'rana');
const nodeE = new Node('animal', 'canario');
const nodeF = new Node('color', 'verde');
const nodeG = new Node('color', 'amarillo');
const nodeH = new Node('come', 'moscas');
const nodeI = new Node('animal', 'perro');
const nodeJ = new Node('come', 'carne');
const nodeK = new Node('pelaje', 'sedozo');
const nodeL = new Node('animal', 'gato');
const nodeM = new Node('pelaje', 'sedozo');


// Crear reglas
inference.createRule(nodeD, [nodeA, nodeH]);
inference.createRule(nodeE, [nodeB, nodeC]);
inference.createRule(nodeF, [nodeD]);
inference.createRule(nodeG, [nodeE]);
inference.createRule(nodeI, [nodeJ, nodeK]);
inference.createRule(nodeL, [nodeM, nodeK]);
inference.findFacts();

console.log(inference.facts.map(f => `${f.attribute}=${f.value}`).join(', '));
console.log(inference.rules);
console.log(graph);

console.log(inference.backwardChain('verde'));
*/