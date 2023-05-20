import { Component, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "worklog-fe-entry",
  templateUrl: "./entry.component.html",
  styleUrls: ["./entry.component.scss"],
})
export class EntryComponent {
  orderValue: any
  title: any
  time: any = "Seleccionar"

  @Input("orderValue") set _orderValue(n: any) {
    this.orderValue = n
  }
  @Input("title") set _title(n: any) {
    this.title = n
  }
  constructor(private modalCtr: ModalController) {}

  changeTime(event:any) {
    let date = new Date(event.target.value)
    this.time = date.getHours() + "h " + date.getMinutes() + "min"
  }
}
