import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { EmptyPopoverComponent } from "../empty-popover/empty-popover.component";
import { Router } from "@angular/router";

@Component({
  selector: "worklog-fe-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
})
export class ToolbarComponent {

  constructor(private router:Router,private popoverCtrl: PopoverController) {}
  options: any
  urlBack: any = null

  @Input("options") set _options(n: any) {
    this.options = n
  }

  @Input("urlBack") set _urlBack(n: any) {
    this.urlBack = n
  }

  async openPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: EmptyPopoverComponent,
      componentProps: {
        options: this.options
      },
      event: ev,
      translucent: true
    });
    return await popover.present();

  }

  goBack() {
    this.router.navigate([this.urlBack]);
  }
}
