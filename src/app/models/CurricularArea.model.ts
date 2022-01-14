/*
 * CurricularArea
 * DESCRIPCIÓN: Clase que define las propiedades de tipo de area curricular
 * FECHA DE CREACIÓN:12/05/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
export class CurricularArea {
    id: number;
    name: string;
    objective: string;

    /**
     * constructor
     * Método para inicializar un objeto de tipo CurricularArea
     * @param id id
     * @param name nombre
     * @param objective objetivo
     */
    constructor(id: number, name: string, objective: string) {
        this.id = id;
        this.name = name;
        this.objective = objective;
    }
}