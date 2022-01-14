/*
 * ObjectiveDegree
 * DESCRIPCIÓN: Clase que define las propiedades de objetivos de licenciatura
 * FECHA DE CREACIÓN:15/04/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
export class ObjectiveDegree {
    id: number;
    introduction: string;
    generalObjectives: string;
    particularObjectives: string;

    /**
     * constructor
     * Método para inicializar un objeto de tipo ObjectiveDegree
     * @param id id
     * @param introduction introducción
     * @param generalObjectives objetivos generales
     * @param particularObjectives objetivos particulares
     */
    constructor(id?: number, introduction?: string, generalObjectives?: string, particularObjectives?: string) {
        this.id = id;
        this.introduction = introduction;
        this.generalObjectives = generalObjectives;
    }
}