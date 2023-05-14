import { Component, Input } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { EmptyPopoverComponent } from "../empty-popover/empty-popover.component";

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
  @Input("rows") set rows_data(n: any) {
    this.rows = n
  }

  @Input("columns") set columns_data(n: any) {
    this.columns = n
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

  public buttonClicked(param: any): void {
    let fun = param.fun
    eval(`this.${fun}()`);
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

}
