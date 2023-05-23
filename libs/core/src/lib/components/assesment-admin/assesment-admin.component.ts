import { Component, EventEmitter, Inject, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "worklog-fe-assesment-admin",
  templateUrl: "./assesment-admin.component.html",
  styleUrls: ["./assesment-admin.component.scss"],
})
export class AssesmentAdminComponent {
  myform: FormGroup;
  errorMsg: string = "";

  constructor(private fb: FormBuilder, @Inject("apiUrlBase") public apiUrlBase?: any ) {
    this.myform = this.fb.group({
      subject: ['', [Validators.required, Validators.max(100), Validators.min(0)]],
      skill: ['', [Validators.required, Validators.max(100), Validators.min(0)]]
    });
  }

  @Output() onSubmit = new EventEmitter();
  @Output() onErrorSubmit = new EventEmitter();

  submit(param: any) {
    // Comprobamos si los porcentajes son correctos
    if(this.checkPercent(param)) {
      // Se realiza la llamada al padre
      let url = this.apiUrlBase+"setting/ponderation"
      let user = JSON.parse(localStorage.getItem("sessionData") as string)

      let uploadParam = {
        "url": url,
        "id_check": user.profile,
        "skill": param.skill,
        "subject": param.subject
      }

      this.onSubmit.emit(uploadParam)
    } else {
      // Se manda notificacion
      this.onErrorSubmit.emit(this.errorMsg)
    }

    
  }

  onInputFocus(event: any) {
    const ionItem = event.target.closest('ion-item');
    ionItem.classList.add('input-focus');
  }

  checkPercent(param: any): boolean {
    let status: boolean = true;
    if(((param.skill + param.subject) > 100) || ((param.skill + param.subject) < 100)) {
      status = false
      this.errorMsg = "Aptitudes and Subjects must sum a total of 100"
    } 
    return status
  }

  onInputBlur(event: any,field: string) {
    if(this.myform.controls[field].valid) {
      const ionItem = event.target.closest('ion-item');
      ionItem.classList.remove('input-focus');
    }
  }
}
