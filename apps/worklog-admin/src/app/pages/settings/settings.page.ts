import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService } from "@worklog-fe/core";
import { lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  componentView: any = "assesment"

  constructor(private translate: TranslateService,private notification: NotificationService,private menuCtrl: MenuController, private apiSvc: ApiService,@Inject("apiHeaders") public apiHeaders?: any) {}

  ngOnInit() {}

  closeMenu(param: any) {
    this.menuCtrl.close();
  }

  changeView(param: any) {
    this.componentView = param
  }

  async dbBackUp(object: any) {
    this.apiSvc.get(object.url, object.param, this.apiHeaders).subscribe(
      async (response) => {
        const blob = new Blob([response as any], { type: 'application/sql' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'worklog.sql';
        link.click();
        let message = await lastValueFrom(this.translate.get("settings.backUpDownload"))
        this.notification.showToast(message,"success","medium")
      },
     async (error) => {
      this.notification.showToast(await lastValueFrom(this.translate.get("settings.backUpError")),"error","medium")
     }
    );
  }

  updateHolidays(object: any) {
    const params = new HttpParams().set("query", "true").set("id_check", String(object.id_check));

    const headers= new HttpHeaders({
      "api-key": "4f54e235-a92e-4d93-a1a4-ffe842b8e949",
      'Content-Type': 'application/json',
      "server": "uvicorn",
    });

    this.apiSvc.put(object.url, params, object.body, headers).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("settings.holidaysUpdated")),"success","medium")
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("settings.holidaysError")),"error","medium")
      }
    )
  }


  assesmentUpdate(param: any) {
    const params = new HttpParams().set("id_check", param.id_check).set("aptitudes_percent", param.skill).set("subjects_percent",param.subject)
    this.apiSvc.put(param.url, params, null, this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("settings.deliberationUpdated")),"success","medium")
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("settings.deliberationError")),"error","medium")
      }
    )
  }

  updateDuration(event: any) {
    // obtengo el scholar year
    const scholar_params = new HttpParams().set("id_check", event.id_check)
    this.apiSvc.get(event.scholar_url,scholar_params,this.apiHeaders).subscribe(
      async (resolve: any) => {
        // realizo la llamada para actualizar
        const params = new HttpParams().set("id_check", event.id_check).set("start_date", event.begin).set("end_date",event.end).set("id_scholar_year",resolve["idScholarYear"])

        this.apiSvc.put(event.url, params, null, this.apiHeaders).subscribe(
          async (resolve) => {
            this.notification.showToast(await lastValueFrom(this.translate.get("settings.durationUpdated")), "success", "medium")
          },
          async (error) => {
            this.notification.showToast(await lastValueFrom(this.translate.get("settings.durationError")),"error","medium")
          }
        )
      },
      async (error) => {
        console.log(error)
      }
    )
    
  }

  dbDelete(param: any) {
    const params = new HttpParams().set("id_check",param.id_check)
    this.apiSvc.delete(param.url,params,this.apiHeaders).subscribe(
      async (response)=> {
        this.notification.showToast(await lastValueFrom(this.translate.get("settings.databaseDeleted")),"success","medium")
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get("settings.databaseError")),"error","medium")
      } 
    );
  }


  onError(param: any) {
    this.notification.showToast(param,"error","medium");
  }
}
