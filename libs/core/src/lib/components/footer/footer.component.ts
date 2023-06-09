import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IonSelect } from "@ionic/angular";

@Component({
  selector: "worklog-fe-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  myform: FormGroup;

  @Output() onChangeIdiom = new EventEmitter();

  changeIdiom(param: IonSelect) {
    this.onChangeIdiom.emit(param.value.split("-")[0])
  }

  @Input("defaultLang") defaultLang: any

  @Input("languages") languages: any

  ngOnInit() {  
    console.log(this.defaultLang)
    console.log(this.languages )
    this.myform.get("idiom")?.setValue(this.defaultLang)
  }

  constructor(private fb: FormBuilder) {
    this.myform = this.fb.group({
      idiom: ['', [Validators.required]],
    });
  }
}
