/*
 * Professor
 * DESCRIPCIÓN: Clase que define las propiedades de un profesor
 * FECHA DE CREACIÓN: 15/04/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
import { User } from "./User.model";
import { Degree } from "./Degree.model";

export class Professor extends User {
    degrees: Degree[];

    /**
     * constructor
     * Método para inicializar un objeto de tipo Professor
     * @param id id
     * @param name nombre
     * @param lastname apellido materno
     * @param secondLastname apellido paterno
     * @param email correo electrónico
     * @param grade grado del profesor
     * @param password contraseña
     */
    constructor(id: number, name: string, lastname: string, secondLastname: string, email: string, grade: string, password: string) {
        super(id, name, lastname, secondLastname, email, grade, password);
    }
}