/*
 * AcademicWorkload
 * DESCRIPCIÓN: Clase que define las propiedades de carga de trabajo
 * FECHA DE CREACIÓN:12/05/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
export class AcademicWorkload {
    id: number;
    theoreticalHours: number;
    practicalHours: number;
    totalHours: number;

    /**
     * constructor
     * Método para inicializar un objeto de tipo AcademicWorkload
     * @param id id
     * @param theoreticalHours horas teóricas
     * @param practicalHours horas prácticas
     * @param totalHours total de horas
     */
    constructor(id: number, theoreticalHours: number, practicalHours: number, totalHours: number) {
        this.id = id;
        this.theoreticalHours = theoreticalHours;
        this.practicalHours = practicalHours;
        this.totalHours = totalHours;
    }
}