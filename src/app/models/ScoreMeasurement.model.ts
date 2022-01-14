/*
 * ScoreMeasurement
 * DESCRIPCIÓN: Clase que define las propiedades de una medición que deriva puntajes.
 * FECHA DE CREACIÓN: 20/06/2020
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
export class ScoreMeasurement {
    indicator: string;
    evaluation: string;
    instrument: string;

    /**
     * constructor
     * Método para inicializar un objeto de tipo ScoreMeasurement
     * @param indicator indicador
     * @param evaluation evaluación
     * @param instrument instrumento
     */
    constructor(indicator: string, evaluation: string, instrument: string) {
        this.indicator = indicator;
        this.evaluation = evaluation;
        this.instrument = instrument;
    }
}