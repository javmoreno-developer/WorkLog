import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { AlertController, IonToggle, PopoverController } from "@ionic/angular";
import { EmptyPopoverComponent } from "../empty-popover/empty-popover.component";
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NavigationExtras, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "worklog-fe-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent {
  constructor(private alert: AlertController, private translate: TranslateService,private alertCtrl: AlertController,private popoverCtrl: PopoverController) { }
  rows: any
  columns: any
  buttons: any
  style: any
  ColumnMode = ColumnMode;

  @Output() deleteEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter();
  @Output() activeEvent = new EventEmitter();
  @Output() resetEvent = new EventEmitter();
  @Output() routeEvent = new EventEmitter();
  @Output() infoEvent = new EventEmitter();
  @Output() profileEvent = new EventEmitter();

  @Input("rows") set rows_data(n: BehaviorSubject<Object>) {

    n.subscribe({
      next: (v) => {
        this.rows = v;
      }
    });
  }

  @Input("columns") set columns_data(n: BehaviorSubject<Object>) {
    
    n.subscribe({
      next: (v) => {
        let r = v as Array<string>
        //console.log(r)
        this.columns = r;
      }
    })
  }

  @Input("tableStyle") set tableStyle(n: any) {
    this.style = n
  }

  @Input("tableButtons") set tableButtons(n: any) {
    this.buttons = n
  }
 
  
  onClick() {
    console.log("you cliked!!!")

  }

  onInfo(data: any) {
    //console.log(data)
    this.infoEvent.emit(data)
  }



  onRoute(data: any) {
    let r = this.buttons.filter((button: { fun: string; }) => button.fun == "onRoute")

    this.routeEvent.emit({id: data.id,name: data.name,url: r[0].route})
  }

  onSubRoute(data: any) {
    console.log(data)
    let r = this.buttons.filter((button: { fun: string; }) => button.fun == "onSubRoute")
    this.routeEvent.emit({comments: data.comments,id: data.id,date: data.date,name: data.index,url: r[0].route})
  }

  public buttonClicked(button: any,data: any): void {
    let fun = button.fun;
    eval(`this.${fun}(data)`);
  }

  async openPopover(ev: any,row: any) {
    let options = [{}];

    // extraigo las opciones
    const b = this.buttons.filter((elemento: any) => elemento.popover === true);
    options = b[0].popOptions
    
    const popover = await this.popoverCtrl.create({
      component: EmptyPopoverComponent,
      componentProps: {
        options: options
      },
      event: ev,
      translucent: true
    });
    await popover.present();

    popover.onDidDismiss().then(result => {
      if (result.data) {
        switch (result.role) {
          case "cancel":
            break;
          case "delete":
            console.log(row.id)
            // apertura de alert para confirmar
            this.deleteEvent.emit({data: row})
            
            break;
          case "reset":
            this.resetEvent.emit({data: row})
            break;
          
        }
      }
    });

  }

  onDelete(data: any) {
    this.deleteEvent.emit({data: data})
  }
  onEdit(data: any) {
    this.editEvent.emit({data: data})
  }
  onProfile(data: any) {
    this.profileEvent.emit({data: data})
  }

  async toggleActive(checked: any, row: any,toggle: IonToggle) {
   
    let message = await lastValueFrom(this.translate.get("students.activeTitle"))

    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get("general.warning")),
      message: message,
      buttons: [
        {
          text: await lastValueFrom(this.translate.get("general.cancel")),
          cssClass: "danger-option",
          handler: () => {
            // devuelta al estado original del toggle
            toggle.checked = checked
          }

        },
        {
          text: await lastValueFrom(this.translate.get("general.accept")),
          handler: async () => {
            this.activeEvent.emit({row: row, checked: checked})
          }
        }

      ]
    });

    await alert.present();
  }
  
}
