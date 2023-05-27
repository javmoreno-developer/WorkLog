import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "worklog-fe-empty-modal",
  templateUrl: "./empty-modal.component.html",
  styleUrls: ["./empty-modal.component.scss"],
})
export class EmptyModalComponent implements OnInit{
  
  textSection: any;
  buttonSection: any;
  inputSection: any;
  selectSection: any;
  cellUpd: any;
  myform: FormGroup;
  formObject: any = {};

  constructor(private modalCtr: ModalController,private fb:FormBuilder) {
    this.myform = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  @Input("textSection") set _textSection(n: any) {
    this.textSection = n
  }

  @Input("buttonSection") set _buttonSection(n: any) {
    this.buttonSection = n
  }

  @Input("inputSection") set _inputSection(n: any) {
    this.inputSection = n
  }

  @Input("selectSection") set _selectSection(n: any) {
    this.selectSection = n
  }

  @Input("cellUpd") set _cellUpd(n: any) {
    this.cellUpd = n
  }

  requiredValidator(control: AbstractControl): { [key: string]: any } | null {
    return control.value[0] !== '' ? null : { required: true };
  }

  onSubmit() {
    this.modalCtr.dismiss({type: "submit"})
  }
  ngOnInit(): void {
    let act = false;
    if(this.cellUpd != null) {
      act = true;
    }

    this.myform = this.fb.group(this.getFormGroupConfig(act));
    if(act) {
      this.getActForm()
    }
  }

  getFormGroupConfig(act: boolean): { [key: string]: any } {
    let inputs = this.getInputs()
    let selects = this.getSelects()

    
    let formAssign = {...inputs,...selects}

   

    return formAssign
  }

  getActForm() {
    const { idModule, ...copy } = this.cellUpd;

    for (let [key, value] of Object.entries(copy)) {
      this.myform.get(key)?.setValue(value)
    }
  }

  getSelects() {

    const formGroupConfig: { [key: string]: any } = {};
    for (const item of this.selectSection) {
      const {formName} = item
      const validators: ValidatorFn[] = [];
      validators.push(Validators.required);
      formGroupConfig[formName] = ['', validators];
    }

    return formGroupConfig

  }

  getInputs(): { [key: string]: any } {
    const formGroupConfig: { [key: string]: any } = {};
  
    for (const item of this.inputSection) {
      const { formName, type, mandatory } = item;
      const validators: ValidatorFn[] = [];

      if (mandatory) {
        validators.push(Validators.required);
      }

      formGroupConfig[formName] = ['', validators];
    }

    return formGroupConfig;
  }


  closeModal() {
    this.modalCtr.dismiss({type: "cancel"})
  }
  onEmpty() {
    console.log("empty")
  }
  onAdd() {
    this.modalCtr.dismiss(this.myform.value,"submit")
  }
  onEdit() {
    this.modalCtr.dismiss({data: this.myform.value, idAct: this.cellUpd.idModule},"edit")
  }
  buttonClicked(fun: any) {
    eval(`this.${fun}()`);
  }
  
  submit(param: any) {
    console.log(param)
  }
  onInputFocus(event: any) {
    const ionItem = event.target.closest('ion-item');
    ionItem.classList.add('input-focus');
  }

  onInputBlur(event: any,field: string) {
    if(this.myform.controls[field].valid) {
      const ionItem = event.target.closest('ion-item');
      ionItem.classList.remove('input-focus');
    }
  }
}
