import { Component, EventEmitter, Inject, Output } from "@angular/core";
import { IonDatetime, ModalController } from "@ionic/angular";
import { EmptyModalComponent } from "../empty-modal/empty-modal.component";
import { lastValueFrom } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "worklog-fe-holiday-admin",
  templateUrl: "./holiday-admin.component.html",
  styleUrls: ["./holiday-admin.component.scss"],
})
export class HolidayAdminComponent {

  dateValues: any[] | undefined = [];
  
  @Output() onUpdate = new EventEmitter();

  constructor(private translate: TranslateService,private modalCtrl: ModalController,@Inject("apiUrlBase") public apiUrlBase?: any) {}

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
    let msg = await lastValueFrom(this.translate.get("settings.holidayModalTitle"))
    this.dateValues?.unshift(msg)
    const modal = await this.modalCtrl.create({
      component: EmptyModalComponent,
      componentProps: {
        textSection: this.dateValues,
        buttonSection: [{text: await lastValueFrom(this.translate.get("general.accept")), type: "success", fun: "onSubmit"}],
        inputSection: [],
        selectSection: [],
        cellUpd: null
      },
      cssClass: 'general-modal'
    });
  
    modal.present();
  
    modal.onDidDismiss().then(result => {
      if(result.data) {
        switch(result.data.type) {
          case "cancel":
            if(this.dateValues && this.dateValues?.length >0) {
              this.dateValues?.shift()  
            }
            
            break;
          case "submit":
            let url = this.apiUrlBase+"scholar-year/holidays"
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
      }
      
    });
  
  }

}
