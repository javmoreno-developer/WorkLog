import { Component, EventEmitter, Inject, Output } from "@angular/core";
import { AlertController, IonDatetime, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-duration-admin",
  templateUrl: "./duration-admin.component.html",
  styleUrls: ["./duration-admin.component.scss"],
})
export class DurationAdminComponent {

  // Variables
  maxYear: any = (new Date()).getFullYear() + 3;
  @Output() onUpdate = new EventEmitter();
  @Output() onError = new EventEmitter();

  begin: number = 0;
  end: number = 0;
  public alertButtons = [
    {
      text: lastValueFrom(this.translate.get("general.no")),
      cssClass: 'alert-button-cancel',
    },
    {
      text: lastValueFrom(this.translate.get("general.yes")),
      cssClass: 'alert-button-confirm',
    },
  ];

  constructor(private translate: TranslateService,private alertCtrl: AlertController,@Inject("apiUrlBase") public apiUrlBase?: any) {}

  // Add a date to the list (only 2 or less are allowed)
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
  
  // Reset the list and the calendar (change readonly)
  resetDate(element: IonDatetime) {
    element.reset()
    element.readonly = false
  }
  
  // Cancel date
  cancelDate(element: IonDatetime) {
    element.cancel()
    this.resetDate(element)
  }

  // Open a modal when the user click a button
  confirmDate(element: IonDatetime) {
    this.openAlert(element)
  }

  // Confirm modal
  async openAlert(element: IonDatetime) {
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const alert = await this.alertCtrl.create({
      header: await lastValueFrom(this.translate.get("general.warning")),
      message: await lastValueFrom(this.translate.get("settings.durationModalTitle")),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get("general.cancel")),
          cssClass: "danger-option",
          handler: () => {
          }
          
        },
        {
          text: await lastValueFrom(this.translate.get("general.accept")),
          handler: async () => {
            if(this.checkOrder()) {
              // Update duration and reset list
              let scholar_url = this.apiUrlBase+"scholar-year/get/current"
              let url = this.apiUrlBase + "scholar-year/grade-duration"
              this.onUpdate.emit({scholar_url:scholar_url,begin: this.begin, end: this.end, url: url, id_check: user.profile})
              this.resetDate(element)
            } else {
              // Emit a error and reset list
              this.onError.emit(await lastValueFrom(this.translate.get("settings.durationLocalError")))
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
