/*
 * Degree
 * DESCRIPCIÓN: Clase que define las propiedades de licenciatura
 * FECHA DE CREACIÓN:15/04/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
import { AcademicSpace } from '../models/AcademicSpace.model';
import { ObjectiveDegree } from '../models/ObjectiveDegree.model';
import { Coordinator } from '../models/Coordinator.model';
import { LearningUnit } from '../models/LearningUnit.model';

export class Degree {
    id: number;
    name: string;
    academicSpace: AcademicSpace;
    objectiveDegree: ObjectiveDegree;
    coordinator: Coordinator;
    learningUnits: LearningUnit[];

    /**
     * constructor
     * Método para inicializar un objeto de tipo Degree
     * @param id id
     * @param name nombre
     */
    constructor(id?: number, name?: string) {
        this.id = id;
        this.name = name;
    }
}