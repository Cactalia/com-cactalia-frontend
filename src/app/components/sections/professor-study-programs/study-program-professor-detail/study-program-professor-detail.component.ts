import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudyProgramService } from 'src/app/services/study-program.service';
import { StudyProgram } from 'src/app/models/StudyProgram.model';
import { LoginService } from 'src/app/services/login.service';
import { environment } from 'src/environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import localeEsMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { Token } from 'src/app/models/Token.model';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

registerLocaleData(localeEsMX, 'es-MX');

@Component({
  selector: 'study-program-professor-detail',
  templateUrl: './study-program-professor-detail.component.html',
  styleUrls: ['./study-program-professor-detail.component.scss']
})
export class StudyProgramProfessorDetailComponent implements OnInit {

  thematicUnitsArrayForm = new FormArray([]);
  private datePipe = new DatePipe("es-MX");
  loadingCompleteAssign: boolean = false;
  studyProgram: StudyProgram;
  detailForm: FormGroup;
  tokenUser: Token;

  @Input()
  idStudyProgram: number;

  @Output() newItemEvent = new EventEmitter<number>();

  constructor(
    private userFB: FormBuilder,
    private loginService: LoginService,
    private studyProgramService: StudyProgramService
  ) { }

  ngOnInit(): void {
    this.detailForm = this.userFB.group({
      version: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      learningUnitName: ["", [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(99)]],
      status: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ.]*"), Validators.minLength(3), Validators.maxLength(20)]],
      creationDate: ["", [Validators.minLength(6), Validators.maxLength(14)]],
      approvalDate: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      presentation: ["", [Validators.required, Validators.pattern("[0-9a-zA-ZñÑ áéíóúÁÉÍÓÚ.;,-_()\n]*"), Validators.maxLength(2000)]],
      basicBibliographic: ["", [Validators.required, Validators.pattern("[0-9a-zA-ZñÑ áéíóúÁÉÍÓÚ.;,-_/()\n]*"), Validators.maxLength(2000)]],
      complementaryBibliographic: ["", [Validators.required, Validators.pattern("[0-9a-zA-ZñÑ áéíóúÁÉÍÓÚ.;,-_/()\n]*"), Validators.maxLength(2000)]],
    });

    this.detailForm.controls['version'].disable();
    this.detailForm.controls['learningUnitName'].disable();
    this.detailForm.controls['status'].disable();
    this.detailForm.controls['status'].disable();
    this.detailForm.controls['creationDate'].disable();
    this.detailForm.controls['approvalDate'].disable();

    if (this.idStudyProgram != null) {
      this.getStudyProgramDetails(this.idStudyProgram);
    }

    if (localStorage.getItem(environment.authTokenKey) != null) {
      this.tokenUser = this.loginService.getTokenModelByString(localStorage.getItem(environment.authTokenKey).split('.')[1]);
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
      controls.presentation.setValue(response.presentation);
      controls.basicBibliographic.setValue(response.basicBibliographicCollection);
      controls.complementaryBibliographic.setValue(response.complementaryBibliographicCollection);
      response.thematicUnits.forEach(tu => {
        const group = this.userFB.group({
          name: [tu.name, [Validators.required, Validators.maxLength(500)]],
          objective: [tu.objective, [Validators.required, Validators.maxLength(2000)]],
          topics: [tu.topics, [Validators.required, Validators.maxLength(2000)]],
        });
        this.thematicUnitsArrayForm.push(group);
      });
    });
  }

  /**
   * showDetailsCancel
   * Método que regresa a la lista de programas de estudio
   */
  showDetailsCancel() {
    this.newItemEvent.emit(null);
  }

  /**
   * completeAssign()
   * Método que completa la asignación de programa de estudio
   */
  completeAssign() {
    Swal.fire({
      title: '¿Completar asignación de programa de estudio?',
      text: "Confirma esta acción",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2c5234',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Completar asignación',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCompleteAssign = true;
        const controls = this.detailForm.controls;

        let assign: StudyProgram = new StudyProgram();
        assign.id = this.studyProgram.id;
        assign.presentation = controls.presentation.value,
          assign.basicBibliographicCollection = controls.basicBibliographic.value,
          assign.complementaryBibliographicCollection = controls.complementaryBibliographic.value,
          assign.thematicUnits = this.thematicUnitsArrayForm.value;

        this.studyProgramService.completeAssign(assign).subscribe(response => {
          this.showDetailsCancel();
          this.loadingCompleteAssign = false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            confirmButtonColor: '#2c5234',
            cancelButtonColor: '#9b9b9b',
            text: 'Asignación completada correctamente.',
          });
        }, error => {
          this.loadingCompleteAssign = false;
        });
      }
    })
  }

  /**
   * newThematicUnit
   * Método que registra una unidad temática en la asignación del programa de estudio
   */
  newThematicUnit() {
    const group = this.userFB.group({
      name: ["", [Validators.required, Validators.maxLength(500)]],
      objective: ["", [Validators.required, Validators.maxLength(2000)]],
      topics: ["", [Validators.required, Validators.maxLength(2000)]],
    });
    this.thematicUnitsArrayForm.push(group);
  }

  /**
   * deleteThematicUnit
   * Método que elimina una unidad temática en la asignación del programa de estudio
   * @param index posición de la unidad temática en el arreglo de unidades.
   */
  deleteThematicUnit(index: number) {
    this.thematicUnitsArrayForm.removeAt(index);
  }
}
