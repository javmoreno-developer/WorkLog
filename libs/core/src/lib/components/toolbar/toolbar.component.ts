import { Component } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { EmptyPopoverComponent } from "../empty-popover/empty-popover.component";

@Component({
  selector: "worklog-fe-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
})
export class ToolbarComponent {
  constructor(private popoverCtrl: PopoverController) {}
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
