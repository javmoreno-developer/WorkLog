import { Component, Input } from "@angular/core";
import { PopoverController } from "@ionic/angular";

@Component({
  selector: "worklog-fe-empty-popover",
  templateUrl: "./empty-popover.component.html",
  styleUrls: ["./empty-popover.component.scss"],
})
export class EmptyPopoverComponent {
  _options: any

  @Input("options") set options(n: any) {
    this._options = n
  }

  constructor(private popoverController: PopoverController) {}

  selectOption(option: any) {
    //console.log(option);
    if(option.value == "out") {
      localStorage.removeItem("sessionData")
      window.location.reload()
    } else if(option.value == "profile") {
      console.log("enlace de profile")
    }
    this.popoverController.dismiss({},option.value)
    
  }
}
