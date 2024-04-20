
const { Node } = require('./graph');
const { Graph } = require('./graph');
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
    let conditions = this.rules.map(rule => rule.conditions).flat();
    let conclusions = this.rules.map(rule => rule.conclusion);

    for (let node of nodes) {
      if (node.getNeighbors().length == 0 && !this.facts.includes(node)) {
        this.facts.push(node);
      }
    }
  }

  backwardChain(conclusion) {
    for (let rule of this.rules) {
      if (rule.conclusion.value === conclusion) {
        let conditionsMet = true;
        for (let condition of rule.conditions) {
          if (!this.facts.includes(condition)) {
            conditionsMet = false;
            this.backwardChain(condition.value);
          }
        }
        if (conditionsMet) {
          console.log(`Se cumple la regla: ${rule.conclusion.attribute}=${rule.conclusion.value} -> ${rule.conditions.map(c => `${c.attribute}=${c.value}`).join(' Y ')}`);
        }
        
      }
    }
  }

}

// Ejemplo de uso
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

