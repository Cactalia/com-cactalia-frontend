/*
 * Results
 * DESCRIPCIÓN: Clase que define las propiedades de un resultado
 * FECHA DE CREACIÓN: 20/06/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
export class Results {
    evaluationType: string;
    applicationPeriod: string;
    reviewPeriod: string;

    /**
     * constructor
     * Método para inicializar un objeto de tipo Results
     * @param evaluationType evaluaciones
     * @param applicationPeriod indicador
     * @param reviewPeriod evidencias
     */
    constructor(evaluationType: string, applicationPeriod: string, reviewPeriod: string) {
        this.evaluationType = evaluationType;
        this.applicationPeriod = applicationPeriod;
        this.reviewPeriod = reviewPeriod;
    }
}