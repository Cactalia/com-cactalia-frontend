import { Component, OnInit } from '@angular/core';
import { LearningUnit } from 'src/app/models/LearningUnit.model';
import { Token } from 'src/app/models/Token.model';
import { LoginService } from 'src/app/services/login.service';
import { environment } from 'src/environments/environment';
import { FormBuilder } from '@angular/forms';
import { LearningUnitService } from 'src/app/services/learning-unit.service';

@Component({
  selector: 'app-learning-unit',
  templateUrl: './learning-unit.component.html',
  styleUrls: ['./learning-unit.component.scss']
})
export class LearningUnitComponent implements OnInit {
  private tokenUser: Token;

  public learningUnits: LearningUnit[] = [];
  private date: Date;
  private maxDate: Date;
  actualPage:number;
  private idDegree:number;
  maxPages:number;
  public totalLearningUnits:number;
  public idLearningUnit:number;
  public idLearningUnitEG:number;

  constructor(
    private userFB: FormBuilder,
    private loginService: LoginService,

    private learningUnitService: LearningUnitService,
  ) {
    this.date = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.actualPage=0;
    this.idDegree=1;
    this.maxPages=1;
  }

  ngOnInit(): void {
    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getLearningUnits(this.actualPage);
    }
  }

  /**
  * getLearningUnits
  * Método que obtiene las unidades de aprendizaje de la carrera asociada al coordinador.
  * Obtiene las unidades de aprendizaje paginadas
  * @param page número de pagina a obtener
  */
  getLearningUnits(page:number) {
    this.learningUnitService.selectByDegree(this.tokenUser.id, page).subscribe(response => {
      this.learningUnits = response.content;
      this.maxPages= response.totalPages;
      this.actualPage= page;
      this.totalLearningUnits= response.totalElements;
    });
  }

  /**
   * showStudyProgramList
   * Método que carga la lista de programas de estudio de la unidad de aprendizaje seleccionada
   * @param idLearninUnit id de la unidad de aprendizaje
   */
  showStudyProgramList(idLearninUnit:number){
    this.idLearningUnit = idLearninUnit;

    if (idLearninUnit==null) {
      this.getLearningUnits(this.actualPage);
    }
  }

  /**
   * showEvaluationGuideList
   * Método que carga la lista de guías de evaluación de la unidad de aprendizaje seleccionada
   * @param idLearninUnit id de la unidad de aprendizaje
   */
   showEvaluationGuideList(idLearningUnit:number){
    this.idLearningUnitEG = idLearningUnit;

    if (idLearningUnit==null) {
      this.getLearningUnits(this.actualPage);
    }
  }

}
