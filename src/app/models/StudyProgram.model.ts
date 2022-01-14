/*
 * StudyProgram
 * DESCRIPCIÓN: Clase que define las propiedades de un programa de estudio
 * FECHA DE CREACIÓN: 21/05/2021
 * CREADO POR: Oscar Emmanuel Lechuga Velázquez
 */
import { LearningUnit } from "./LearningUnit.model";
import { ThematicUnit } from "./ThematicUnit.model";
import { User } from "./User.model";

export class StudyProgram {
    id: number;
    learningUnit: LearningUnit;
    authors: User[];
    version: number;
    status: string;
    creationDate: Date;
    lastUpdateDate: Date;
    approvalDate: Date;
    presentation: string;
    basicBibliographicCollection: string;
    complementaryBibliographicCollection: string;
    thematicUnits: ThematicUnit[];

    /**
     * constructor
     * Método para inicializar un objeto de tipo StudyProgram
     * @param id id
     * @param learningUnit unidad de aprendizaje
     * @param authors autores
     */
    constructor(id?: number, learningUnit?: LearningUnit, authors?: User[]) {
        this.id = id;
        this.learningUnit = learningUnit;
        this.authors = authors;
    }
}