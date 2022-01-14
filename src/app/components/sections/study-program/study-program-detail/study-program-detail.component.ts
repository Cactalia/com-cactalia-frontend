import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudyProgram } from 'src/app/models/StudyProgram.model';
import { StudyProgramService } from 'src/app/services/study-program.service';
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
  selector: 'study-program-detail',
  templateUrl: './study-program-detail.component.html',
  styleUrls: ['./study-program-detail.component.scss']
})
export class StudyProgramDetailComponent implements OnInit {

  detailForm: FormGroup;
  private tokenUser: Token;
  professors: Professor[] = [];
  public studyProgram: StudyProgram;
  private datePipe = new DatePipe("es-MX");
  public loadingNewCoordinator:boolean=false;
  public loadingRemoveAssign:boolean=false;
  public loadingUpdateAssign:boolean=false;

  @Input()
  idStudyProgram: number;
  
  @Output() newItemEvent = new EventEmitter<number>();

  constructor(
    private userFB: FormBuilder,
    private professorService: ProfessorService,
    private loginService: LoginService,
    private studyProgramService: StudyProgramService
  ) {}
  
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
    if (this.idStudyProgram!= null) {
      this.getStudyProgramDetails(this.idStudyProgram);
    }
    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
      this.getProfessors();
    }
  }

  /**
   * getStudyProgramDetails
   * Método que obtiene un programa de estudio por su id
   * @param idStudyProgram id del programa de estudio a obtener
   */
   getStudyProgramDetails(idStudyProgram: number) {
     
    this.studyProgramService.selectById(idStudyProgram).subscribe(response => {
      this.studyProgram = response;
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
   * Método que regresa a la lista de programas de estudio
   */
  showDetailsCancel(){
    this.newItemEvent.emit(null);
  }

  /**
   * deleteStudyProgram
   * Método que elimina un programa de estudio
   */
   deleteStudyProgram() {
    Swal.fire({
      title: '¿Eliminar programa de estudio?',
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
        this.loadingRemoveAssign=true;
        this.studyProgramService.delete(this.studyProgram.id).subscribe(response => {
          this.showDetailsCancel();
          this.loadingRemoveAssign=false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Programa de estudio eliminado correctamente.',
            confirmButtonColor: '#55919e',
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
    const controls = this.detailForm.controls;
    let found:Professor = this.professors.find(element => element.id == controls.professor.value);
    
    const index = this.professors.indexOf(found);
    if (index > -1) {
      let alredyAssign:Professor = this.studyProgram.authors.find(element => element.id == controls.professor.value);
      if (alredyAssign==null) {
        this.professors.splice(index, 1);
        this.studyProgram.authors.push(found);
      }
    }
  }

  /**
  * removeProfessor
  * Método que elimina un profesor de la lista de asignación del programa de estudio.
  * @param idProfessor id del profesor a eliminar de la asignación
  */
   removeProfessor(idProfessor:number){
    const controls = this.detailForm.controls;
    let found:Professor = this.studyProgram.authors.find(element => element.id == idProfessor);
    
    const index = this.studyProgram.authors.indexOf(found);
    if (index > -1) {
      this.studyProgram.authors.splice(index, 1);
      controls.professor.setValue("");
      let alredyAssign:Professor = this.professors.find(element => element.id == found.id);
      if (alredyAssign==null) {
        this.professors.push(found);
      }
    }
  }

  /**
   * updateAssign
   * Método que actualiza una asignación de programa de estudio
   */
   updateAssign(){
    Swal.fire({
      title: '¿Modificar asignación de programa de estudio?',
      text: "Confirma esta acción",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#55919e',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Modificar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingUpdateAssign = true;
        let updateAssign:StudyProgram = new StudyProgram();
        updateAssign.id = this.studyProgram.id;
        updateAssign.authors = this.studyProgram.authors;
        this.studyProgramService.update(updateAssign).subscribe(response => {
          this.showDetailsCancel();
          this.loadingUpdateAssign = false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            confirmButtonColor: '#55919e',
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
