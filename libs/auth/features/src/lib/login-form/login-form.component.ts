import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Authenticate } from "../../../../../core/src";


@Component({
  selector: "worklog-fe-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent {
  myform: FormGroup

  constructor(private fb: FormBuilder) {
    this.myform = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  @Output() onSubmit:EventEmitter<Authenticate> = new EventEmitter();
  @Output() onReset:EventEmitter<boolean> = new EventEmitter();

  submit(auth:Authenticate){
    this.onSubmit.emit(auth);
  }
  toReset() {
    this.onReset.emit()
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
