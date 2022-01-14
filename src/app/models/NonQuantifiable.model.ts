/*
 * NonQuantifiable
 * DESCRIPCIÓN: Clase que define las propiedades de una estimación no cuantificable
 * FECHA DE CREACIÓN: 20/06/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
export class NonQuantifiable {
    evaluation: string;
    instrument: string;
    evaluate: string;

    /**
     * constructor
     * Método para inicializar un objeto de tipo NonQuantifiable
     * @param evaluation evaluación
     * @param instrument instrumento
     * @param evaluate que evaluá
     */
    constructor(evaluation: string, instrument: string, evaluate: string) {
        this.evaluation = evaluation;
        this.instrument = instrument;
        this.evaluate = evaluate;
    }
}