/*
 * University
 * DESCRIPCIÓN: Clase que define las propiedades de universidad
 * FECHA DE CREACIÓN:15/04/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
export class University {
    id: number;
    name: string;

    /**
     * constructor
     * Método para inicializar un objeto de tipo University
     * @param id id
     * @param name nombre
     */
    constructor(id?: number, name?: string) {
        this.id = id;
        this.name = name;
    }
}