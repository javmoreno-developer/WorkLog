import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "worklog-fe-reset-pass",
  templateUrl: "./reset-pass.component.html",
  styleUrls: ["./reset-pass.component.scss"],
})
export class ResetPassComponent {
  myform: FormGroup
  constructor(private fb: FormBuilder) {
    this.myform = fb.group({
      email: ["", [Validators.required,Validators.email]]
    }); 
  }

  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onBack: EventEmitter<any> = new EventEmitter();

  submit(param: any) {
    this.onSubmit.emit(param.email)
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

  goBack() {
    this.onBack.emit()
  }
}
