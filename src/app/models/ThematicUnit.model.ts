/*
 * ThematicUnit
 * DESCRIPCIÓN: Clase que define las propiedades de una unidad temática.
 * FECHA DE CREACIÓN: 20/11/2020
 * CREADO POR: Oscar Emmanuel Lechuga Velázquez
 */
export class ThematicUnit {
    name: string;
    objective: string;
    topics: string;
    indicators: string;

    /**
     * constructor
     * Método para inicializar un objeto de tipo ThematicUnit
     * @param name nombre
     * @param objective objetivos
     * @param topics temas
     * @param indicators indicadores
     */
    constructor(name?: string, objective?: string, topics?: string, indicators?: string) {
        this.name = name;
        this.objective = objective;
        this.topics = topics;
        this.indicators = indicators;
    }
}
