// Definir una clase para representar un nodo del grafo
class Node {
    constructor(attribute, value) {
        this.attribute = attribute; // Atributo del nodo
        this.value = value; // Valor del nodo
        this.neighbors = []; // Lista de nodos vecinos
    }

    addNeighbor(node) {
        this.neighbors.push(node);
    }

    getNeighbors() {
        return this.neighbors;
    }

    getAttribute() {
        return this.attribute;
    }

    getValue() {
        return this.value;
    }
}

// Definir una clase para representar el grafo
class Graph {
    constructor() {
        this.nodes = []; // Lista para almacenar nodos
    }

    addNode(node) {
        for (let n of this.nodes) {
            if (n.getValue() == node.getValue()) {
                return null;
            }
        }
        this.nodes.push(node); // Añadir un nodo al grafo
      
    }

    addNeighborsToNode(node, neighbors) {
       for(let n of this.nodes) {
            if(n.getValue() == node.getValue() && n.getAttribute() == n.getAttribute()){
                for(let neighbor of neighbors) {
                    n.addNeighbor(neighbor); // Añadir vecinos a un nodo
                }
            }
       }
       return null;
    }

    getNode(node) {
        return this.nodes.find(n => n.getValue() == node.getValue() && n.getAttribute() == node.getAttribute()); // Obtener un nodo del grafo
    }

    getNodes() {
        return this.nodes; // Obtener todos los nodos del grafo
    }

    getNodeNeighbors(node) {
        for(let n of this.nodes) {
            if(n.getValue() == node.getValue() && n.getAttribute() == node.getAttribute()){
                return n.getNeighbors(); // Obtener los vecinos de un nodo
            }
        }

        return null;
    }

}

export default Graph;
export { Node };



