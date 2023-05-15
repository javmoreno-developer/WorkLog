import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "worklog-fe-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {

  _rows: any
  @Input("rows") set rows(n: any) {
    this._rows = n
  }
  @Output() onCloseMenu = new EventEmitter();

  closeMenu() {
    this.onCloseMenu.emit(true);
  }
}
