import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvaluationGuide } from 'src/app/models/EvaluationGuide.model';
import { EvaluationGuideService } from 'src/app/services/evaluation-guide.service';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { ProfessorService } from 'src/app/services/professor.service';
import { Professor } from 'src/app/models/Professor.model';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';
import { Token } from 'src/app/models/Token.model';

registerLocaleData(localeEsMX, 'es-MX');

@Component({
  selector: 'evaluation-guide-detail',
  templateUrl: './evaluation-guide-detail.component.html',
  styleUrls: ['./evaluation-guide-detail.component.scss']
})
export class EvaluationGuideDetailComponent implements OnInit {

  detailForm: FormGroup;
  private tokenUser: Token;
  professors: Professor[] = [];
  public evaluationGuide: EvaluationGuide;
  private datePipe = new DatePipe("es-MX");
  public loadingNewCoordinator:boolean=false;
  public loadingRemoveAssign:boolean=false;
  public loadingUpdateAssign:boolean=false;

  @Input()
  idEvaluationGuide: number;
  
  @Output() newItemEvent = new EventEmitter<number>();

  constructor(
    private userFB: FormBuilder,
    private professorService: ProfessorService,
    private loginService: LoginService,
    private evaluationGuideService: EvaluationGuideService
  ) { }

  ngOnInit(): void {
    this.detailForm = this.userFB.group({
      version: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      learningUnitName: ["", [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(99)]],
      status: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ.]*"), Validators.minLength(3), Validators.maxLength(20)]],
      creationDate: ["", [Validators.minLength(6), Validators.maxLength(14)]],
      approvalDate: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      professor: ["", []],
    });  
    this.detailForm.controls['version'].disable();
    this.detailForm.controls['learningUnitName'].disable();
    this.detailForm.controls['status'].disable();
    this.detailForm.controls['status'].disable();
    this.detailForm.controls['creationDate'].disable();
    this.detailForm.controls['approvalDate'].disable();
    if (this.idEvaluationGuide!= null) {
      this.getEvaluationGuideDetails(this.idEvaluationGuide);
    }
    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getProfessors();
    }
  }

  /**
   * getEvaluationGuideDetails
   * Método que obtiene una guía de evaluación por su id
   * @param idEvaluationGuide id de la guía de evaluación a obtener
   */
   getEvaluationGuideDetails(idEvaluationGuide: number) {
     
    this.evaluationGuideService.selectById(idEvaluationGuide).subscribe(response => {
      this.evaluationGuide = response;
      const controls = this.detailForm.controls;
      controls.version.setValue(response.version);
      controls.learningUnitName.setValue(response.learningUnit);
      controls.status.setValue(response.status);
      controls.creationDate.setValue(this.datePipe.transform(response.creationDate, "d 'de' MMMM 'de' y"));
      controls.approvalDate.setValue(this.datePipe.transform(response.approvalDate, "d 'de' MMMM 'de' y"));
    });
  }

  /**
   * showDetailsCancel
   * Método que regresa a la lista de guías de estudio
   */
  showDetailsCancel(){
    this.newItemEvent.emit(null);
  }

  /**
   * deleteEvaluationGuide
   * Método que elimina una guía de evaluación
   */
   deleteEvaluationGuide() {
    Swal.fire({
      title: '¿Eliminar guía de evaluación?',
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
        this.loadingRemoveAssign=true;
        this.evaluationGuideService.delete(this.evaluationGuide.id).subscribe(response => {
          this.showDetailsCancel();
          this.loadingRemoveAssign=false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Guía de evaluación eliminada correctamente.',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
          })
        }, error => {
          this.loadingRemoveAssign = false;
        });
      }
    })
  }

  /**
  * getProfessors
  * Método que obtiene los profesores asociados a la carrera del coordinador.
  * Obtiene los profesores paginados
  */
   getProfessors() {
    this.professorService.selectAllList(this.tokenUser.id).subscribe(response => {
      this.professors = response;
    });
  }

  /**
  * addProfessor
  * Método que añade un profesor a la lista de asignación de la guía de evaluación.
  */
   addProfessor(){
    const controls = this.detailForm.controls;
    let found:Professor = this.professors.find(element => element.id == controls.professor.value);
    
    const index = this.professors.indexOf(found);
    if (index > -1) {
      let alredyAssign:Professor = this.evaluationGuide.authors.find(element => element.id == controls.professor.value);
      if (alredyAssign==null) {
        this.professors.splice(index, 1);
        this.evaluationGuide.authors.push(found);
      }
    }
  }

  /**
  * removeProfessor
  * Método que elimina un profesor de la lista de asignación de la guía de evaluación.
  * @param idProfessor id del profesor a eliminar de la asignación
  */
   removeProfessor(idProfessor:number){
    const controls = this.detailForm.controls;
    let found:Professor = this.evaluationGuide.authors.find(element => element.id == idProfessor);
    
    const index = this.evaluationGuide.authors.indexOf(found);
    if (index > -1) {
      this.evaluationGuide.authors.splice(index, 1);
      controls.professor.setValue("");
      let alredyAssign:Professor = this.professors.find(element => element.id == found.id);
      if (alredyAssign==null) {
        this.professors.push(found);
      }
    }
  }

  /**
   * updateAssign()
   * Método que actualiza una asignación de guía de evaluación
   */
   updateAssign(){
    Swal.fire({
      title: '¿Modificar asignación de guía de evaluación?',
      text: "Confirma esta acción",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2c5234',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Modificar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingUpdateAssign = true;
        let updateAssign:EvaluationGuide = new EvaluationGuide();
        updateAssign.id = this.evaluationGuide.id;
        updateAssign.authors = this.evaluationGuide.authors;
        this.evaluationGuideService.update(updateAssign).subscribe(response => {
          this.showDetailsCancel();
          this.loadingUpdateAssign = false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
            text: 'Asignación modificada correctamente.',
          });
        }, error => {
          this.loadingUpdateAssign = false;
        });
      }
    })
  }

}
