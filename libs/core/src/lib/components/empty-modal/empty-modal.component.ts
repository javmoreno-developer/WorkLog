import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { IonSlides, ModalController } from "@ionic/angular";
import Swiper, { SwiperOptions, Zoom } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

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
  isFile: any = false;
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

  @Input("isFile") set _isFile(n: any) {
    this.isFile = n
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

  getFormGroupConfig(act: boolean): { [key: string]: any} {
    if(this.isFile == false) {
      let inputs = this.getInputs()
      let selects = this.getSelects()
  
      
      let formAssign = {...inputs,...selects}
  
     
  
      return formAssign
    } else {
      let selects = this.getSelects()
      return selects
    }
   
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
  onReset() {
    this.modalCtr.dismiss({data: this.myform.value},"reset")
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

  async openCsv(fileLoader: any) {
    var that = this;
    fileLoader.click();
    fileLoader.onchange = function () {
      var file = fileLoader.files[0];
      var reader = new FileReader();
      console.log("leer")
      reader.onload = async function () {
        
       /* var rows:any[] = (reader.result as any).split('\n');
        var header = rows[0];
        rows = rows.slice(1);
        var blocks = Math.floor(rows.length/30);*/

        console.log(reader.result)
        that.modalCtr.dismiss({data: reader.result, unit: that.myform.value}, "massive-upload");

        
        /*for(let index = 0; index<=blocks; index++){
          var csv = rows.slice(index*100, Math.min(rows.length, index*100+100)).join('\r\n');
          var BOM = new Uint8Array([0xEF,0xBB,0xBF]);
          var blob = new Blob([BOM, header, '\r\n', csv], {type: 'text/csv' });
          let formData:FormData = new FormData();
          //formData.append('csv_file', blob, file.name+'-index-'+index);
          formData.append('csv_file', blob, file.name);
          console.log("Index: "+index);
          console.log(blob)

          try {
            //await lastValueFrom(that.api.post("/api/staff/products/",formData,'application/json'));
            this.
          } catch (error) {
            console.log(error);
          }
        }*/

      }
      reader.readAsText(file);
    }
  }
  uploadStaff() {
    /*this.api.post("/api/staff/products", ).subscribe({
      (resolve) => x
    });*/
  }
}
