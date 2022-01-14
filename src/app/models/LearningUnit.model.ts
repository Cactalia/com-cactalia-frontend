/*
 * LearningUnit
 * DESCRIPCIÓN: Clase que define las propiedades de unidades de aprendizaje
 * FECHA DE CREACIÓN: 15/04/2021
 * CREADO POR: Abraham Gutiérrez Escamilla
 */
import { Degree } from "./Degree.model";
import { AcademicWorkload } from "./AcademicWorkload.model";
import { LearningUnitType } from "./LearningUnitType.model";
import { AcademicMood } from "./AcademicMood.model";
import { TrainningCore } from "./TrainingCore.model";
import { CurricularArea } from "./CurricularArea.model";
import { CharacterUnit } from "./CharacterUnit.model";

export class LearningUnit {
    id: number;
    code: string;
    degree: Degree;
    name: string;
    period: string;
    credits: string;
    objective: string;
    previousLearningUnit: LearningUnit;
    nextLearningUnit: LearningUnit;
    academicWorkload: AcademicWorkload;
    learningUnitType: LearningUnitType;
    academicMood: AcademicMood;
    trainningCore: TrainningCore;
    curricularArea: CurricularArea;
    characterUnit: CharacterUnit;

    /**
     * constructor
     * Método para inicializar un objeto de tipo LearningUnit
     * @param id id
     * @param code código
     * @param name nombre
     * @param period periodo
     * @param credits créditos
     * @param objective objetivo
     */
     constructor(id?:number,code?:string,name?:string,period?:string,credits?:string,objective?:string){
        this.id=id;
        this.code=code;
        this.name=name;
        this.period=period;
        this.credits=credits;
        this.objective=objective;
    }
}