import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IonSelect } from "@ionic/angular";

@Component({
  selector: "worklog-fe-filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.scss"],
})
export class FilterComponent {
  units: any;
  levels: any;
  types: any;

  selectedUnit: boolean = false;
  selectedType: boolean = false;

  @Input("units") set _units(n: any) {
    this.units = n;
  }

  @Input("types") set _types(n: any) {
    this.types = n;
  }

  @Output() onFilterUnit = new EventEmitter()
  @Output() onFilterType = new EventEmitter()
  @Output() onFilterChecked = new EventEmitter()

  ngOnInit() {}

  changeUnit(param: any) {
    this.selectedUnit = true
    this.onFilterUnit.emit(param.value)
  }
  
  changeType(param: any) {
    this.selectedType = true
    this.onFilterType.emit(param.value)
  }

  changeCheck(param: any) {
    this.onFilterChecked.emit(param.checked)
  }

  emptyUnit(element: IonSelect) {
    element.value = null
    this.selectedUnit = false
    this.onFilterType.emit("")
  }

  emptyType(element: IonSelect) {
    element.value = null
    this.selectedType = false
    this.onFilterUnit.emit("")

    
  }
}
