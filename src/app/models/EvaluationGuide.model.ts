/*
 * EvaluationGuide
 * DESCRIPCIÓN: Clase que define las propiedades de una guía de evaluación
 * FECHA DE CREACIÓN: 21/05/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
import { LearningUnit } from "./LearningUnit.model";
import { User } from "./User.model";
import { StudyProgram } from "./StudyProgram.model";
import { ScoreMeasurement } from "./ScoreMeasurement.model";
import { NonQuantifiable } from "./NonQuantifiable.model";
import { EvidenceRecord } from "./EvidenceRecord.model";
import { Results } from "./Results.model";

export class EvaluationGuide {
    id: number;
    learningUnit: LearningUnit;
    studyProgramId: number;
    studyProgram: StudyProgram;
    authors: User[];
    version: number;
    status: string;
    creationDate: Date;
    lastUpdateDate: Date;
    approvalDate: Date;
    presentation: string;
    scoreMeasurements: ScoreMeasurement[];
    nonQuantifiables: NonQuantifiable[];
    evidenceRecords: EvidenceRecord[];
    results: Results[];
    interpretationOfAppraisals: string;
    judgmentsAndConclusions: string;

    /**
     * constructor
     * Método para inicializar un objeto de tipo EvaluationGuide
     * @param id id
     * @param learningUnit unidad de aprendizaje
     * @param studyProgram programa de estudio
     * @param authors  autor
     */
    constructor(id?: number, learningUnit?: LearningUnit, studyProgram?: StudyProgram, authors?: User[]) {
        this.id = id;
        this.learningUnit = learningUnit;
        this.studyProgram = studyProgram;
        this.authors = authors;
    }
}