import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LearningUnit } from 'src/app/models/LearningUnit.model';
import { Professor } from 'src/app/models/Professor.model';
import { StudyProgram } from 'src/app/models/StudyProgram.model';
import { Token } from 'src/app/models/Token.model';
import { LearningUnitService } from 'src/app/services/learning-unit.service';
import { LoginService } from 'src/app/services/login.service';
import { ProfessorService } from 'src/app/services/professor.service';
import { ReportService } from 'src/app/services/report.service';
import { StudyProgramService } from 'src/app/services/study-program.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-study-program',
  templateUrl: './study-program.component.html',
  styleUrls: ['./study-program.component.scss']
})
export class StudyProgramComponent implements OnInit {
  private tokenUser: Token;
  public learningUnits: LearningUnit[] = [];
  private professors: Professor[] = [];
  private assignProfessors: Professor[] = [];
  private studyPrograms: StudyProgram[] = [];
  private newStudyProgramForm: FormGroup;
  public newStudyProgramRequested: boolean = false;
  public loadingNewAssign: boolean = false;
  private actualPage:number;
  private maxPages:number;
  private totalStudyPrograms:number;
  public idStudyProgramDetail:number;
  public idStudyProgramReview:number;

  constructor(
    private userFB: FormBuilder,
    private learningUnitService: LearningUnitService,
    private professorService: ProfessorService,
    private studyProgramService: StudyProgramService,
    private loginService: LoginService,
    private reportService: ReportService,
  ) {
    this.actualPage=0;
    this.maxPages=1;
   }

  ngOnInit(): void {
    this.newStudyProgramForm = this.userFB.group({
      learningUnit: ["", [Validators.required]],
      professor: ["", []]
    });
    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getStudyPrograms(this.actualPage);
    }
  }

  /**
  * getStudyPrograms
  * Método que obtiene los programas de estudio registrados a la carrera asociada al coordinador.
  * @param page número de pagina a obtener
  */
   getStudyPrograms(page:number) {
      this.studyProgramService.selectAll(this.tokenUser.id, page).subscribe(response => {
        this.studyPrograms = response.content;
        this.maxPages= response.totalPages;
        this.actualPage= page;
        this.totalStudyPrograms= response.totalElements;
      });
    }

  /**
   * getLearningUnits
   * Método que obtiene las unidades de aprendizaje de la carrera asociada al coordinador
   */
   getLearningUnits() {
    this.learningUnitService.selectListByDegree(this.tokenUser.id).subscribe(response => {
      this.learningUnits = response;
    });
  }

  /**
  * getProfessors
  * Método que obtiene los profesores asociados a la carrera del coordinador
  * Obtiene los profesores en lista
  */
   getProfessors() {
    this.professorService.selectAllList(this.tokenUser.id).subscribe(response => {
      this.professors = response;
    });
  }

  /**
  * addProfessor
  * Método que añade un profesor a la lista de asignación del programa de estudio.
  */
  addProfessor(){
    const controls = this.newStudyProgramForm.controls;
    let found:Professor = this.professors.find(element => element.id == controls.professor.value);
    
    const index = this.professors.indexOf(found);
    if (index > -1) {
      this.professors.splice(index, 1);
      this.assignProfessors.push(found);
    }
  }

  /**
  * removeProfessor
  * Método que elimina un profesor de la lista de asignación del programa de estudio.
  * @param idProfessor id del profesor a eliminar de la asignación
  */
  removeProfessor(idProfessor:number){
    const controls = this.newStudyProgramForm.controls;
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
    this.newStudyProgramForm.reset();
    this.learningUnits = [];
    this.professors= [];
    this.assignProfessors= [];
  }

  /**
   * newStudyprogramRequestCancel
   * Método que desaparece y reinicia el formulario de asignación de programas de estudio
   */
   newStudyProgramRequestCancel() {
    const controls = this.newStudyProgramForm.controls;
    this.newStudyProgramRequested = false;
    this.clear();
    controls.learningUnit.setValue("");
    controls.professor.setValue("");
  }

  /**
   * newStudyProgramRequest
   * Método que permite la visualización del formulario de asignación de programas de estudio
   */
   newStudyProgramRequest() {
    this.newStudyProgramRequested = true;
    this.getLearningUnits();
    this.getProfessors();
  }

  /**
   * assign()
   * Método que registra una nueva asignación de programa de estudio
   */
  assign(){
    Swal.fire({
      title: '¿Registrar nueva asignación de programa de estudio?',
      text: "Confirma esta acción",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2c5234',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingNewAssign = true;
        const controls = this.newStudyProgramForm.controls;
        let learningUnit = new LearningUnit();
        learningUnit.id=controls.learningUnit.value;
        let newAssign: StudyProgram = new StudyProgram(
          null,
         learningUnit,
         this.assignProfessors
          );
          
        this.studyProgramService.assign(newAssign).subscribe(response => {
          this.clear();
          this.newStudyProgramRequestCancel();
          this.loadingNewAssign = false;
          this.getStudyPrograms(this.actualPage);

          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Asignación registrada correctamente.',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
          });
        }, error => {
          this.loadingNewAssign = false;
        });
      }
    })
  }

  /**
   * deleteStudyProgram
   * Método que elimina un programa de estudio por su id
   * @param id id del programa de estudio a eliminar
   */
   deleteStudyProgram(id: number) {
    Swal.fire({
      title: '¿Eliminar programa de estudio?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2c5234',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studyProgramService.delete(id).subscribe(response => {
          this.getStudyPrograms(this.actualPage);
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Programa de estudio eliminado correctamente.',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
          })
        });
      }
    })
  }

  /**
   * showDetail
   * Método que permite la visualización de los detalles del programa de estudio
   * @param idStudyProgram id del programa de estudio a visualizar
   */
  showDetail(idStudyProgram:number){
    this.idStudyProgramDetail = idStudyProgram;
    
    if (idStudyProgram==null) {
      this.getStudyPrograms(this.actualPage);
    }
  }

  /**
   * showReview
   * Método que carga la revisión de los cambios del programa de estudio
   * @param idStudyProgram id del programa de estudio a revisar
   */
  showReview(idStudyProgram:number){
    this.idStudyProgramReview = idStudyProgram;
    
    if (idStudyProgram==null) {
      this.getStudyPrograms(this.actualPage);
    }
  }

  /**
   * downloadReport
   * Método que descarga el reporte de un programa de estudio
   * @param idStudyProgram id del programa de estudio a descargar
   * @param name nombre de la unidad de aprendizaje, utilizado para el nombre del archivo
   * @param version versión del programa de estudio, utilizado para el nombre del archivo
   * @param status estado del programa de estudio, utilizado para el nombre del archivo
   */
   downloadReport(idStudyProgram:number, name:string, version:number, status:string){
    this.reportService.studyProgram(idStudyProgram).subscribe(response => {
       this.reportService.viewStudyProgramReport(response, name, version,status);
    });    
  }
  
}
