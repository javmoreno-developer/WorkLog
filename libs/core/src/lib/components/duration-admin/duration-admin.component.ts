import { Component, EventEmitter, Inject, Output } from "@angular/core";
import { AlertController, IonDatetime, ModalController } from "@ionic/angular";
import { EmptyModalComponent } from "../empty-modal/empty-modal.component";

@Component({
  selector: "worklog-fe-duration-admin",
  templateUrl: "./duration-admin.component.html",
  styleUrls: ["./duration-admin.component.scss"],
})
export class DurationAdminComponent {
  constructor(private alertCtrl: AlertController,@Inject("apiUrlBase") public apiUrlBase?: any) {}

  @Output() onUpdate = new EventEmitter();
  @Output() onError = new EventEmitter();

  begin: number = 0;
  end: number = 0;

  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
    },
  ];
  
  newDate(event: any,element: IonDatetime) {
   
    let dateValues = event.detail.value;
    if(dateValues) {
      if(dateValues.length == 2) {
        element.readonly = true
        this.end = dateValues[1]
      } else if(dateValues.length == 1) {
        this.begin = dateValues[0]
      }
    }
  }
  

  resetDate(element: IonDatetime) {
    element.reset()
    element.readonly = false
  }
  
  cancelDate(element: IonDatetime) {
    element.cancel()
    this.resetDate(element)
  }

  confirmDate(element: IonDatetime) {
    this.openAlert(element)
  }

  async openAlert(element: IonDatetime) {
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const alert = await this.alertCtrl.create({
      header: 'Atencion',
      message: '¿Deseas actualizar la duracion del curso?',
      buttons: [
        {
          text: 'Cancelar',
          cssClass: "danger-option",
          handler: () => {
          }
          
        },
        {
          text: 'Aceptar',
          handler: () => {
            if(this.checkOrder()) {
              let url = this.apiUrlBase + "setting/grade_duration"
              this.onUpdate.emit({begin: this.begin, end: this.end, url: url, id_check: user.profile})
              this.resetDate(element)
            } else {
              this.onError.emit("La fecha de inicio no puede ser mayor o menor que la de fin")
              this.resetDate(element)
            }
            
          }
        }
        
      ]
    });

    await alert.present();
    
  }

  checkOrder() {
    let fecha1 = new Date(this.begin)
    let fecha2 = new Date(this.end)
    return fecha1 < fecha2
  }
  
}
