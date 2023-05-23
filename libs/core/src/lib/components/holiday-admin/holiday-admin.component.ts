import { Component, EventEmitter, Inject, Output } from "@angular/core";
import { IonDatetime, ModalController } from "@ionic/angular";
import { EmptyModalComponent } from "../empty-modal/empty-modal.component";

@Component({
  selector: "worklog-fe-holiday-admin",
  templateUrl: "./holiday-admin.component.html",
  styleUrls: ["./holiday-admin.component.scss"],
})
export class HolidayAdminComponent {

  dateValues: any[] | undefined = [];
  
  @Output() onUpdate = new EventEmitter();

  constructor(private modalCtrl: ModalController,@Inject("apiUrlBase") public apiUrlBase?: any) {}

  newDate(event: any,element: IonDatetime) {
    this.dateValues = event.detail.value;
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
    this.openModal();
    
  }

  async openModal() {
    let msg = "¿Son estos los dias?"
    this.dateValues?.unshift(msg)
    const modal = await this.modalCtrl.create({
      component: EmptyModalComponent,
      componentProps: {
        textSection: this.dateValues,
        buttonSection: [{text: "Aceptar", type: "success", fun: "onSubmit"}],
      },
      cssClass: 'general-modal'
    });
  
    modal.present();
  
    modal.onDidDismiss().then(result => {
      switch(result.data.type) {
        case "cancell":
          this.dateValues?.shift()
          break;
        case "submit":
          let url = this.apiUrlBase+"setting/holidays"
          let user = JSON.parse(localStorage.getItem("sessionData") as string)

          this.dateValues?.shift()
          const delimiter: string = ';';
          const dateString: string | undefined = this.dateValues?.join(delimiter);
          const dateObject = {
            "holidays": dateString
          }

          this.onUpdate.emit({url: url, body: dateObject,id_check: user.profile })
          break;
      }
    });
  
  }

}
