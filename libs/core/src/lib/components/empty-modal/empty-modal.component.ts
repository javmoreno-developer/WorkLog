import { Component, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "worklog-fe-empty-modal",
  templateUrl: "./empty-modal.component.html",
  styleUrls: ["./empty-modal.component.scss"],
})
export class EmptyModalComponent {
  
  textSection: any;
  buttonSection: any;

  constructor(private modalCtr: ModalController) {}

  @Input("textSection") set _textSection(n: any) {
    this.textSection = n
  }

  @Input("buttonSection") set _buttonSection(n: any) {
    this.buttonSection = n
  }

  closeModal() {
    this.modalCtr.dismiss()
  }
  onEmpty() {
    console.log("empty")
  }
  buttonClicked(fun: any) {
    eval(`this.${fun}()`);
  }
}
