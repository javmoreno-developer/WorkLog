import { Component, Input } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-entry",
  templateUrl: "./entry.component.html",
  styleUrls: ["./entry.component.scss"],
})
export class EntryComponent {
  orderValue: any
  title: any
  time: any = "Seleccionar"
  text: any;
  end: any
  dataAct: any
  readonly: boolean = false
  fct: boolean = false

  @Input("orderValue") set _orderValue(n: any) {
    this.orderValue = n
  }

  @Input("title") set _title(n: any) {
    this.title = n
  }

  @Input("end") set _end(n: any) {
    this.end = n;
  }

  @Input("dataAct") set _dataAct(n: any) {
    this.dataAct = n;
    this.time = this.getTime(n.hours)
    this.text = n.text
  }

  @Input("fct") set _fct(n: any) {
    this.fct = n
  }

  constructor(private translate: TranslateService) {}

  
  changeTime(event:any) {
    let date = new Date(event.target.value)
    this.time = date.getHours() + "h " + date.getMinutes() + "min"
  }

  getTime(param: any) {
    let horas = Math.floor(param / 3600);

    return horas
  }

  ngOnInit() {
    if(Object.keys(this.dataAct).length > 0) {
      this.readonly = true
    }
  }
}
