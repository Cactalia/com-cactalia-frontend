/*
 * EvidenceRecord
 * DESCRIPCIÓN: Clase que define las propiedades de un registro de evidencias
 * FECHA DE CREACIÓN: 20/06/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
export class EvidenceRecord {
    evaluations: string;
    indicator: string;
    evidences: string;
    instrument: string;
    score: string;

    /**
     * constructor
     * Método para inicializar un objeto de tipo EvidenceRecord
     * @param evaluations evaluaciones
     * @param indicator indicador
     * @param evidences evidencias
     * @param instrument instrumento
     * @param score puntaje
     */
    constructor(evaluations: string, indicator: string, evidences: string, instrument: string, score: string) {
        this.evaluations = evaluations;
        this.indicator = indicator;
        this.evidences = evidences;
        this.instrument = instrument;
        this.score = score;
    }
}