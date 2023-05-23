import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { ApiService, NotificationService } from "@worklog-fe/core";

@Component({
  selector: "worklog-fe-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  componentView: any = "assesment"

  constructor(private notification: NotificationService,private menuCtrl: MenuController, private apiSvc: ApiService,@Inject("apiHeaders") public apiHeaders?: any) {}

  ngOnInit() {}

  closeMenu(param: any) {
    this.menuCtrl.close();
  }

  changeView(param: any) {
    this.componentView = param
  }

  dbBackUp(object: any) {
    this.apiSvc.get(object.url, object.param, this.apiHeaders).subscribe(
      (response) => {
        const blob = new Blob([response as any], { type: 'application/sql' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'worklog.sql';
        link.click();
        this.notification.showToast("Se ha descargado la copia de seguridad","success","medium")
      },
     (error) => {
      this.notification.showToast(error.error.detail,"error","medium")
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
      (resolve) => {
        this.notification.showToast("Se ha actualizado el periodo vacacional","success","medium")
      },
      (error) => {
        this.notification.showToast(error.error.detail,"error","medium")
      }
    )
  }


  assesmentUpdate(param: any) {
    const params = new HttpParams().set("id_check", param.id_check).set("aptitudes_ponderation", param.skill).set("subjects_ponderation",param.subject)
    this.apiSvc.put(param.url, params, null, this.apiHeaders).subscribe(
      (resolve) => {
        this.notification.showToast("Se ha actualizado la ponderacion","success","medium")
      },
      (error) => {
        this.notification.showToast(error.error.detail,"error","medium")
      }
    )
  }

  updateDuration(event: any) {
    const params = new HttpParams().set("id_check", event.id_check).set("start_date", event.begin).set("end_date",event.end)

    this.apiSvc.put(event.url, params, null, this.apiHeaders).subscribe(
      (resolve) => {
        this.notification.showToast("La duracion ha sido actualizada", "success", "medium")
      },
      (error) => {
        this.notification.showToast(error.error.detail, "error", "medium")
      }
    )
  }

  dbDelete(param: any) {
    const params = new HttpParams().set("id_check",param.id_check)
    this.apiSvc.delete(param.url,params,this.apiHeaders).subscribe(
      (response)=> {
        this.notification.showToast("Se ha borrado la base de datos","success","medium")
      },
      (error) => {
        this.notification.showToast(error.error.detail,"error","medium")
      } 
    );
  }


  onError(param: any) {
    this.notification.showToast(param,"error","medium");
  }
}
