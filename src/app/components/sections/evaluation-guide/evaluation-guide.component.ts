import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LearningUnit } from 'src/app/models/LearningUnit.model';
import { Professor } from 'src/app/models/Professor.model';
import { EvaluationGuide } from 'src/app/models/EvaluationGuide.model';
import { Token } from 'src/app/models/Token.model';
import { LearningUnitService } from 'src/app/services/learning-unit.service';
import { LoginService } from 'src/app/services/login.service';
import { ProfessorService } from 'src/app/services/professor.service';
import { ReportService } from 'src/app/services/report.service';
import { EvaluationGuideService } from 'src/app/services/evaluation-guide.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { StudyProgramService } from 'src/app/services/study-program.service';
import { StudyProgram } from 'src/app/models/StudyProgram.model';

@Component({
  selector: 'app-evaluation-guide',
  templateUrl: './evaluation-guide.component.html',
  styleUrls: ['./evaluation-guide.component.scss']
})
export class EvaluationGuideComponent implements OnInit {

  private tokenUser: Token;
  public learningUnits: LearningUnit[] = [];
  public studyPrograms: StudyProgram[] = [];
  private professors: Professor[] = [];
  private assignProfessors: Professor[] = [];
  private evaluationGuides: EvaluationGuide[] = [];
  private newEvaluationGuideForm: FormGroup;
  public newEvaluationGuideRequested: boolean = false;
  public loadingNewAssign: boolean = false;
  private actualPage:number;
  private maxPages:number;
  private totalEvaluationGuides:number;
  public idEvaluationGuideDetail:number;
  public idEvaluationGuideReview:number;

  constructor(
    private userFB: FormBuilder,
    private learningUnitService: LearningUnitService,
    private studyProgramService: StudyProgramService,
    private professorService: ProfessorService,
    private evaluationGuideService: EvaluationGuideService,
    private loginService: LoginService,
    private reportService: ReportService,
  ) {
    this.actualPage=0;
    this.maxPages=1;
   }

  ngOnInit(): void {
    this.newEvaluationGuideForm = this.userFB.group({
      learningUnit: ["", [Validators.required]],
      studyProgram: ["", [Validators.required]],
      professor: ["", []]
    });
    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getEvaluationGuides(this.tokenUser.id, this.actualPage);
    }

    this.popData();
  }

  popData() {
    this.newEvaluationGuideForm.controls['learningUnit'].valueChanges.subscribe(
      value => {
        this.newEvaluationGuideForm.controls['studyProgram'].setValue(value.studyProgram);
        console.log(value);
        this.getStudyPrograms(value);
      }
    );
  }

  /**
  * getEvaluationGuides
  * Método que obtiene las guías de evaluación registradas.
  */
   getEvaluationGuides(idCoordinator: number, page:number) {
    this.evaluationGuideService.selectAll(idCoordinator, page).subscribe(response => {
      this.evaluationGuides = response.content;
      this.maxPages= response.totalPages;
      this.actualPage= page;
      this.totalEvaluationGuides= response.totalElements;
    });
  }

  /**
   * getLearningUnits
   * Método que obtiene las unidades de aprendizaje de la carrera asociada al coordinador
   */
   getLearningUnits(idCoordinator: number) {
    this.learningUnitService.selectListByDegree(idCoordinator).subscribe(response => {
      this.learningUnits = response;
    });
  }

  /**
   * getStudyPrograms
   * Método que obtiene los programas de estudio asociados a una unidad de aprendizaje
   */
  getStudyPrograms(idLEarningUnit: number) {
    this.studyProgramService.selectByLearningUnit(idLEarningUnit).subscribe(response => {
      this.studyPrograms = response;
    })
  }

  /**
  * getProfessors
  * Método que obtiene los profesores registrados en la bdd.
  * Obtiene los profesores paginados
  */
   getProfessors() {
    this.professorService.selectAllList(this.tokenUser.id).subscribe(response => {
      this.professors = response;
    });
  }

  /**
  * addProfessor
  * Método que añade un profesor a la lista de asignación.
  */
   addProfessor(){
    const controls = this.newEvaluationGuideForm.controls;
    let found:Professor = this.professors.find(element => element.id == controls.professor.value);
    
    const index = this.professors.indexOf(found);
    if (index > -1) {
      this.professors.splice(index, 1);
      this.assignProfessors.push(found);
    }
  }

  /**
  * removeProfessor
  * Método que elimina un profesor de la lista de asignación.
  * @param idProfessor id del profesor a eliminar de la asignación
  */
   removeProfessor(idProfessor:number){
    const controls = this.newEvaluationGuideForm.controls;
    let found:Professor = this.assignProfessors.find(element => element.id == idProfessor);
    
    const index = this.assignProfessors.indexOf(found);
    if (index > -1) {
      this.assignProfessors.splice(index, 1);
      this.professors.push(found);
      controls.professor.setValue("");
    }
  }

  /**
   * clear
   * Método que reinicia el formulario de registro
   */
   clear() {
    this.newEvaluationGuideForm.reset();
    this.learningUnits = [];
    this.studyPrograms = [];
    this.professors= [];
    this.assignProfessors= [];
  }

  /**
   * newStudyProgramRequestCancel
   * Método que desaparece y reinicia el formulario de asignación de guías de evaluación
   */
   newEvaluationGuideRequestCancel() {
    const controls = this.newEvaluationGuideForm.controls;
    this.newEvaluationGuideRequested = false;
    this.clear();
    controls.learningUnit.setValue("");
    controls.studyProgram.setValue("");
    controls.professor.setValue("");
  }

  /**
   * newEvalautionGuideRequest
   * Método que permite la visualización del formulario de asignación de guías de evaluación
   */
   newEvalautionGuideRequest() {
    this.newEvaluationGuideRequested = true;
    this.getLearningUnits(this.tokenUser.id);
    //this.getStudyPrograms();
    this.getProfessors();
  }

  /**
   * assign()
   * Método que registra una nueva asignación de guía de evaluación
   */
   assign(){
    Swal.fire({
      title: '¿Registrar nueva asignación de guía de evaluación?',
      text: "Confirma esta acción",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#55919e',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingNewAssign = true;
        const controls = this.newEvaluationGuideForm.controls;
        let learningUnit = new LearningUnit();
        learningUnit.id=controls.learningUnit.value;
        let studyProgram = new StudyProgram();
        studyProgram.id=controls.studyProgram.value;
        let newAssign: EvaluationGuide = new EvaluationGuide(
         null,
         learningUnit,
         studyProgram,
         this.assignProfessors
          );
          
        this.evaluationGuideService.assign(newAssign).subscribe(response => {
          this.clear();
          this.newEvaluationGuideRequestCancel();
          this.loadingNewAssign = false;
          this.getEvaluationGuides(this.tokenUser.id, this.actualPage);

          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Asignación registrada correctamente.',
            confirmButtonColor: '#55919e',
            cancelButtonColor: '#9b9b9b',
          });
        }, error => {
          this.loadingNewAssign = false;
        });
      }
    })
  }

  /**
   * deleteEvaluationGuide
   * Método que elimina una guía de evaluación por su id
   * @param id id de la guía de evaluación a eliminar
   */
   deleteEvaluationGuide(id: number) {
    Swal.fire({
      title: '¿Eliminar guía de evaluación?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#55919e',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.evaluationGuideService.delete(id).subscribe(response => {
          this.getEvaluationGuides(this.tokenUser.id, this.actualPage);
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Guía de evaluación eliminada correctamente.',
            confirmButtonColor: '#55919e',
            cancelButtonColor: '#9b9b9b',
          })
        });
      }
    })
  }

  /**
   * showDetail
   * Método que permite la visualización de los detalles de la guía de evaluación
   * @param idEvaluationGuide id de la guía de evaluación a visualizar
   */
  showDetail(idEvaluationGuide:number){
    this.idEvaluationGuideDetail = idEvaluationGuide;
    
    if (idEvaluationGuide==null) {
      this.getEvaluationGuides(this.tokenUser.id, this.actualPage);
    }
  }

  /**
   * showReview
   * Método que carga la revisión de los cambios de la guía de evaluación
   * @param idEvaluationGuide id de la guía de evaluación a revisar
   */
  showReview(idEvaluationGuide:number){
    this.idEvaluationGuideReview = idEvaluationGuide;
    
    if (idEvaluationGuide==null) {
      this.getEvaluationGuides(this.tokenUser.id, this.actualPage);
    }
  }

  /**
   * downloadReport()
   * Método que descarga el reporte de una guía de evaluación
   * @param idEvaluationGuide id de la guía de evaluación a descargar
   * @param name nombre de la unidad de aprendizaje, utilizado para el nombre del archivo
   * @param version versión de la guía de evaluación, utilizado para el nombre del archivo
   * @param status estado de la guía de evaluación, utilizado para el nombre del archivo
   */
   downloadReport(idEvaluationGuide:number, name:string, version:number, status:string){
    this.reportService.evaluationGuide(idEvaluationGuide).subscribe(response => {
       this.reportService.viewEvaluationGuideReport(response, name, version,status);
    });    
  }

}
