import { Component, EventEmitter, Inject, Output } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-database-manage-admin",
  templateUrl: "./database-manage-admin.component.html",
  styleUrls: ["./database-manage-admin.component.scss"],
})
export class DatabaseManageAdminComponent {
  selectedFile: File | null = null;

  @Output() onDownload = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  constructor(private translate: TranslateService,private alertCtrl: AlertController,@Inject("apiUrlBase") public apiUrlBase?: any) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async deleteDatabase() {
    const alert = await this.alertCtrl.create({
      header: await lastValueFrom(this.translate.get("general.warning")),
      message: await lastValueFrom(this.translate.get("settings.databaseModalSubtitle")),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get("general.cancel")),
          cssClass: "danger-option",
          handler: () => {
          }
          
        },
        {
          text: await lastValueFrom(this.translate.get("general.accept")),
          handler: () => {
            let url = this.apiUrlBase+"db/drop"
            let user = JSON.parse(localStorage.getItem("sessionData") as string)
            this.onDelete.emit({url: url,id_check: user.profile});
          }
        }
        
      ]
    });

    await alert.present();
    
  }
  downloadDatabase() {
    let url = this.apiUrlBase+"db/backup"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    let param = {id_check: user.profile}
    this.onDownload.emit({url: url,param: param});
  }


}
