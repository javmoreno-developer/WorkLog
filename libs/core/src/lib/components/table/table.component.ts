import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { EmptyPopoverComponent } from "../empty-popover/empty-popover.component";
import { BehaviorSubject } from "rxjs";
import { ColumnMode } from "@swimlane/ngx-datatable";

@Component({
  selector: "worklog-fe-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent {
  constructor(private popoverCtrl: PopoverController) { }
  rows: any
  columns: any
  buttons: any
  style: any
  ColumnMode = ColumnMode;

  @Output() deleteEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter();

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
        this.columns = r.filter((clave) => clave != "description")
                        .map((clave) => ({ prop: clave, name: clave }));
        
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

  public buttonClicked(button: any,data: any): void {
    let fun = button.fun;
    eval(`this.${fun}(data)`);
  }

  async openPopover(ev: any) {
    const options = [
      { name: 'Opción 1', value: 'opcion1' },
      { name: 'Opción 2', value: 'opcion2' },
      { name: 'Opción 3', value: 'opcion3' }
    ];

    const popover = await this.popoverCtrl.create({
      component: EmptyPopoverComponent,
      componentProps: {
        options: options
      },
      event: ev,
      translucent: true
    });
    return await popover.present();

  }

  onDelete(data: any) {
    this.deleteEvent.emit({data: data})
  }
  onEdit(data: any) {
    this.editEvent.emit({data: data})
  }

}
