import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EvaluationGuide } from 'src/app/models/EvaluationGuide.model';
import { EvaluationGuideService } from 'src/app/services/evaluation-guide.service';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { Professor } from 'src/app/models/Professor.model';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';
import { Token } from 'src/app/models/Token.model';
import { ThematicUnit } from 'src/app/models/ThematicUnit.model';
import { StudyProgramService } from 'src/app/services/study-program.service';
import { ScoreMeasurement } from 'src/app/models/ScoreMeasurement.model';
import { NonQuantifiable } from 'src/app/models/NonQuantifiable.model';
import { EvidenceRecord } from 'src/app/models/EvidenceRecord.model';
import { Results } from 'src/app/models/Results.model';
import { StudyProgram } from 'src/app/models/StudyProgram.model';

registerLocaleData(localeEsMX, 'es-MX');

@Component({
  selector: 'evaluation-guide-professor-detail',
  templateUrl: './evaluation-guide-professor-detail.component.html',
  styleUrls: ['./evaluation-guide-professor-detail.component.scss']
})
export class EvaluationGuideProfessorDetailComponent implements OnInit {

  detailForm: FormGroup;
  thematicUnitForm: FormGroup;
  scoreMeasurementForm: FormGroup;
  nonQuantifiableForm: FormGroup;
  evidenceRecordForm: FormGroup;
  resultsForm: FormGroup;

  private tokenUser: Token;
  professors: Professor[] = [];
  evaluationGuide: EvaluationGuide;
  private datePipe = new DatePipe("es-MX");
  loadingNewCoordinator:boolean=false;
  loadingRemoveAssign:boolean=false;
  loadingCompleteAssign:boolean=false;
  thematicUnitRequest:boolean=false;
  scoreMeasurementRequest:boolean=false;
  nonQuantifiableRequest:boolean=false;
  evidenceRecordRequest:boolean=false;
  resultRequest:boolean=false;

  thematicUnits:ThematicUnit[] = [];
  scoreMeasurements:ScoreMeasurement[] = [];
  nonQuantifiables:NonQuantifiable[] = [];
  evidenceRecords:EvidenceRecord[] = [];
  results:Results[] = [];

  studyProgram:StudyProgram;

  @Input()
  idEvaluationGuide: number;
  
  @Output() newItemEvent = new EventEmitter<number>();

  constructor(
    private userFB: FormBuilder,
    private loginService: LoginService,
    private evaluationGuideService: EvaluationGuideService,
    private studyProgramService: StudyProgramService
  ) { }

  ngOnInit(): void {
    this.detailForm = this.userFB.group({
      version: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      learningUnitName: ["", [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(99)]],
      status: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ.]*"), Validators.minLength(3), Validators.maxLength(20)]],
      creationDate: ["", [Validators.minLength(6), Validators.maxLength(14)]],
      approvalDate: ["", [Validators.required, Validators.pattern("[a-zA-ZñÑ áéíóúÁÉÍÓÚ]*"), Validators.minLength(3), Validators.maxLength(29)]],
      presentation: ["", [Validators.required, Validators.pattern("[0-9a-zA-ZñÑ áéíóúÁÉÍÓÚ.;,-_/()\n]*"), Validators.maxLength(2000)]],
      interpretationOfAppraisals: ["", [Validators.required, Validators.pattern("[0-9a-zA-ZñÑ áéíóúÁÉÍÓÚ.;,-_/()\n]*"), Validators.maxLength(2000)]],
      judgmentsAndConclusions: ["", [Validators.required, Validators.pattern("[0-9a-zA-ZñÑ áéíóúÁÉÍÓÚ.;,%-_/()\n]*"), Validators.maxLength(2000)]],
    });

    this.thematicUnitForm = this.userFB.group({
      thematicUnitIndicators: ["", [Validators.required, Validators.maxLength(100)]]
    });
    
    this.scoreMeasurementForm = this.userFB.group({
      scoreMtIndicator: ["", [Validators.required, Validators.maxLength(50)]],
      scoreMtEvaluation: ["", [Validators.required, Validators.maxLength(50)]],
      scoreMtInstrument: ["", [Validators.required, Validators.maxLength(50)]]
    });

    this.nonQuantifiableForm = this.userFB.group({
      nonQeEvaluation: ["", [Validators.required, Validators.maxLength(50)]],
      nonQeInstrument: ["", [Validators.required, Validators.maxLength(50)]],
      nonQeEvaluate: ["", [Validators.required, Validators.maxLength(50)]]
    });

    this.evidenceRecordForm = this.userFB.group({
      evidenceRdEvaluations: ["", [Validators.required, Validators.maxLength(50)]],
      evidenceRdIndicator: ["", [Validators.required, Validators.maxLength(50)]],
      evidenceRdEvidences: ["", [Validators.required, Validators.maxLength(50)]],
      evidenceRdInstrument: ["", [Validators.required, Validators.maxLength(50)]],
      evidenceRdScore: ["", [Validators.required, Validators.maxLength(50)]]
    });

    this.resultsForm = this.userFB.group({
      resultEvaluationType: ["", [Validators.required, Validators.maxLength(50)]],
      resultApplicationPeriodn: ["", [Validators.required, Validators.maxLength(50)]],
      resultReviewPeriod: ["", [Validators.required, Validators.maxLength(50)]],
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
    }
  }

  /**
   * getEvaluationGuideDetails
   * Método que obtiene una guía de evaluación por su id
   */
   getEvaluationGuideDetails(idevaluationGuide: number) {
    this.evaluationGuideService.selectById(idevaluationGuide).subscribe(response => {
      this.evaluationGuide = response;
      const controls = this.detailForm.controls;
      controls.version.setValue(response.version);
      controls.learningUnitName.setValue(response.learningUnit);
      controls.status.setValue(response.status);
      controls.creationDate.setValue(this.datePipe.transform(response.creationDate, "d 'de' MMMM 'de' y"));
      controls.approvalDate.setValue(this.datePipe.transform(response.approvalDate, "d 'de' MMMM 'de' y"));
      controls.presentation.setValue(response.presentation);
      controls.interpretationOfAppraisals.setValue(response.interpretationOfAppraisals);
      controls.judgmentsAndConclusions.setValue(response.judgmentsAndConclusions);

      this.studyProgramService.selectById(response.studyProgramId).subscribe(responseSP => {
        this.studyProgram = responseSP;
        this.thematicUnits = responseSP.thematicUnits;
      })

      this.scoreMeasurements = response.scoreMeasurements;
      this.nonQuantifiables = response.nonQuantifiables;
      this.evidenceRecords = response.evidenceRecords;
      this.results = response.results;
    });
  }

  showDetailsCancel(){
    this.newItemEvent.emit(null);
  }

  /**
   * completeAssign()
   * Método que completa la asignación de una guía de evaluación
   */
   completeAssign(){
    Swal.fire({
      title: '¿Completar asignación de guía de evaluación?',
      text: "Confirma esta acción",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#55919e',
      cancelButtonColor: '#9b9b9b',
      reverseButtons: true,
      confirmButtonText: 'Completar asignación',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingCompleteAssign = true;
        const controls = this.detailForm.controls;

        let studyProgram = new StudyProgram();
        studyProgram.id=this.studyProgram.id,
        studyProgram.thematicUnits=this.studyProgram.thematicUnits;

        let assign:EvaluationGuide = new EvaluationGuide();
        assign.id = this.evaluationGuide.id,
        assign.studyProgram = studyProgram,
        assign.presentation= controls.presentation.value,
        assign.scoreMeasurements = this.scoreMeasurements,
        assign.nonQuantifiables = this.nonQuantifiables,
        assign.evidenceRecords = this.evidenceRecords,
        assign.results = this.results,
        assign.interpretationOfAppraisals = controls.interpretationOfAppraisals.value,
        assign.judgmentsAndConclusions = controls.judgmentsAndConclusions.value,
        //assign.note = controls.note.value

        this.evaluationGuideService.completeAssign(assign).subscribe(response => {
          this.showDetailsCancel();
          this.loadingCompleteAssign = false;
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            confirmButtonColor: '#55919e',
            cancelButtonColor: '#9b9b9b',
            text: 'Asignación completada correctamente.',
          });
        }, error => {
          this.loadingCompleteAssign = false;
        });
      }
    })
  }

  newScoreMeasurement() {
    const controls = this.scoreMeasurementForm.controls;
    let newScoreMeasurement:ScoreMeasurement = new ScoreMeasurement(
      controls.scoreMtIndicator.value,
      controls.scoreMtEvaluation.value,
      controls.scoreMtInstrument.value
    )
    this.scoreMeasurements.push(newScoreMeasurement);
    this.clearScoreMeasurementForm();
    this.scoreMeasurementRequest=false;
  }

  newNonQuantifiable() {
    const controls = this.nonQuantifiableForm.controls;
    let newNonQuantifiable:NonQuantifiable = new NonQuantifiable(
      controls.nonQeEvaluation.value,
      controls.nonQeInstrument.value,
      controls.nonQeEvaluate.value
    )
    this.nonQuantifiables.push(newNonQuantifiable);
    this.clearNonQuantifiableForm();
    this.nonQuantifiableRequest=false;
  }

  newEvidenceRecord() {
    const controls = this.evidenceRecordForm.controls;
    let newEvidenceRecord:EvidenceRecord = new EvidenceRecord(
      controls.evidenceRdEvaluations.value,
      controls.evidenceRdIndicator.value,
      controls.evidenceRdEvidences.value,
      controls.evidenceRdInstrument.value,
      controls.evidenceRdScore.value
    )
    this.evidenceRecords.push(newEvidenceRecord);
    this.clearEvidenceRecordForm();
    this.evidenceRecordRequest=false;
  }

  newResult() {
    const controls = this.resultsForm.controls;
    let newResults:Results = new Results(
      controls.resultEvaluationType.value,
      controls.resultApplicationPeriodn.value,
      controls.resultReviewPeriod.value
    )
    this.results.push(newResults);
    this.clearResultForm();
    this.resultRequest=false
  }

  updateThematicUnit(index:number){
    const controls = this.thematicUnitForm.controls;
      this.studyProgram.thematicUnits[index].indicators = controls.thematicUnitIndicators.value 
  }

  /**
   * clear
   * Método que reinicia el formulario ScoreMeasurement
   */
  clearScoreMeasurementForm() {
    this.scoreMeasurementForm.reset();
  }

  newScoreMeasurementRequest(){
    this.scoreMeasurementRequest=true;
  }

  newScoreMeasurementCancel(){
    this.scoreMeasurementRequest=false;
  }

  deleteScoreMeasurement(index:number) {
    this.scoreMeasurements.splice(index, 1);
  }

  /**
   * clear
   * Método que reinicia el formulario NonQuantifiable
   */
  clearNonQuantifiableForm() {
    this.nonQuantifiableForm.reset();
  }

  newNonQuantifiableRequest(){
    this.nonQuantifiableRequest=true;
  }

  newNonQuantifiableCancel(){
    this.nonQuantifiableRequest=false;
  }

  deleteNonQuantifiable(index:number) {
    this.nonQuantifiables.splice(index, 1);
  }

  /**
   * clear
   * Método que reinicia el formulario EvidenceRecord
   */
   clearEvidenceRecordForm() {
    this.evidenceRecordForm.reset();
  }

  newEvidenceRecordRequest(){
    this.evidenceRecordRequest=true;
  }

  newEvidenceRecordCancel(){
    this.evidenceRecordRequest=false;
  }

  deleteEvidenceRecord(index:number) {
    this.evidenceRecords.splice(index, 1);
  }

  /**
   * clear
   * Método que reinicia el formulario Result
   */
   clearResultForm() {
    this.resultsForm.reset();
  }

  newResultRequest(){
    this.resultRequest=true;
  }

  newResultCancel(){
    this.resultRequest=false;
  }

  deleteResultRecord(index:number) {
    this.results.splice(index, 1);
  }
}
