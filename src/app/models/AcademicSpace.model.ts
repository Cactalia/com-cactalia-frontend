/*
 * AcademicSpace
 * DESCRIPCIÓN: Clase que define las propiedades de espacio académico
 * FECHA DE CREACIÓN:15/04/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
import { University } from '../models/University.model';

export class AcademicSpace {
    id: number;
    name: string;
    university: University;

    /**
     * constructor
     * Método para inicializar un objeto de tipo AcademicSpace
     * @param id id 
     * @param name nombre
     */
    constructor(id?: number, name?: string) {
        this.id = id;
        this.name = name;
    }
}