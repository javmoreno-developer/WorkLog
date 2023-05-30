import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { AlertController, MenuController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService } from "@worklog-fe/core";
import { EmptyModalComponent } from "libs/core/src/lib/components/empty-modal/empty-modal.component";
import { BehaviorSubject, lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-modules",
  templateUrl: "./modules.page.html",
  styleUrls: ["./modules.page.scss"],
})
export class ModulesPage implements OnInit {
  rows = new BehaviorSubject<Object>([]);
  columns = new BehaviorSubject<Object>([]);
  unitOptions = new BehaviorSubject<Object>([]);
  units = {}
  mappedList = []
  
  tableStyle = "general"

  tableButtons = [
    { icon: "create", text: "", fun: "onEdit", cssClass: "edit_icon", popover: false },
    { icon: "close", text: "", fun: "onDelete", cssClass: "delete_icon", popover: false },
  ]

  constructor(private alert: AlertController, private notification: NotificationService, private translate: TranslateService, private modalCtrl: ModalController, private menuCtrl: MenuController, private apiSvc: ApiService, @Inject("apiUrlBase") public apiUrlBase?: any, @Inject("apiHeaders") public apiHeaders?: any) {
    this.chargeData();
  }

  ngOnInit() {

  }

  chargeData() {
    let url = this.apiUrlBase + "module/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile)
    this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve: any) => {
        // obtenemos las filas
        console.log(resolve)
        //this.rows.next(resolve)
        this.prepareRows(resolve);
        // obtenemos las columnas
        this.columns.next([
          { prop: 'name', name: 'name', toggle: false, checked: false },
          { prop: 'initials', name: 'initials', toggle: false, checked: false },
          { prop: 'hours', name: 'hours', toggle: false, checked: false },
          { prop: 'unit', name: 'unit', toggle: false, checked: false },
        ])

      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('general.chargeErr')), "error", "medium")
      }
    )
  }

  prepareRows(param: any) {
    //console.log(param)
    //obtengo la filas de ids
    const arrayIdModule = param.map((objeto: { idUnit: any; }) => objeto.idUnit);
    //console.log(arrayIdModule)

    let url = this.apiUrlBase + "module/get/initials"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.post(url,params,arrayIdModule,this.apiHeaders).subscribe(
      (resolve: any) => {
        //console.log(resolve)
        param.forEach((objeto: { unit: any; }, index: string | number) => {
          objeto.unit = resolve[index];
        });
        console.log(param)
        this.rows.next(param)
      },
      (error) => {
        console.log(error)
      }
    )

  }
  closeMenu(param: any) {
    this.menuCtrl.close();
  }

 

  async addModal() {
    //obtain and map all units and present the modal
    let mappedList = this.getAllUnits(null);
  }

  async getAllUnits(cellUpd: Object | null) {
    let url = this.apiUrlBase + "unit/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile)

    return await this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve) => {
        this.units = resolve
        // map units
        return this.mapAllUnits(this.units, cellUpd);

      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('general.chargeErr')), "error", "medium")
      }
    )
  }
  mapAllUnits(param: any, cellUpd: Object | null) {
    this.mappedList = param.map((obj: any) => ({
      name: obj.initials,
      value: obj.idUnit,
    }));

    this.presentModal(cellUpd)

  }

  async presentModal(cellUpd: Object | null) {

    console.log(cellUpd)
    // cambio el boton de act o añadir
    let buttonSection = [{ text: await lastValueFrom(this.translate.get("general.update")), type: "info", fun: "onEdit" }]

    if (cellUpd == null) {
      buttonSection = [{ text: await lastValueFrom(this.translate.get("general.added")), type: "info", fun: "onAdd" }]
    }
    // create modal
    const modal = await this.modalCtrl.create({
      component: EmptyModalComponent,
      componentProps: {
        textSection: [await lastValueFrom(this.translate.get("modules.modalTitle"))],
        buttonSection: buttonSection,
        inputSection: [{ formName: "name", type: "text", mandatory: true }, { formName: "initials", type: "text", mandatory: true }, { formName: "hours", type: "number", mandatory: true }, { formName: "description", type: "text", mandatory: false }],
        selectSection: [{ formName: "idUnit", options: this.mappedList }],
        cellUpd: cellUpd
      },
      cssClass: 'general-modal'
    });

    modal.present();

    modal.onDidDismiss().then(result => {
      if (result.data) {
        switch (result.role) {
          case "cancel":
            break;
          case "submit":
            this.addModule(result.data);
            break;
          case "edit":
            this.updModule(result.data);
            break;
        }
      }
    });
  }

  addModule(data: any) {
    let url = this.apiUrlBase + "module/add/"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.post(url, params, data, this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('modules.addModuleMsg')), "success", "medium")
        this.chargeData();
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('modules.addModuleErr')), "error", "medium")
      }
    )
  }

  updModule(data: any) {
    let url = this.apiUrlBase + "module/update"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile).set("id_module", data.idAct)

    this.apiSvc.put(url, params, data.data, this.apiHeaders).subscribe(
      async (resolve) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('modules.updMsg')), "success", "medium")
        this.chargeData();
      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('modules.updErr')), "error", "medium")
      }
    )
  }

  async promptDeleteModule(param: any) {
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get("general.warning")),
      message: await lastValueFrom(this.translate.get("modules.deleteTitle", { name: param.data.initials })),
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
            // Se borra el modulo
            let url = this.apiUrlBase + "module/delete"
            let user = JSON.parse(localStorage.getItem("sessionData") as string)
            const params = new HttpParams().set("id_check", user.profile).set("id_module", param.data.idModule)
            this.apiSvc.delete(url, params, this.apiHeaders).subscribe(
              async (resolve) => {
                this.notification.showToast(await lastValueFrom(this.translate.get('modules.addModuleMsg')), "success", "medium")
                this.chargeData();
              },
              async (error) => {
                this.notification.showToast(await lastValueFrom(this.translate.get('modules.addModuleErr')), "error", "medium")
              }
            )

          }
        }

      ]
    });

    await alert.present();

  }

  promptEditModule(param: any) {
    let mappedList = this.getAllUnits(param.data);
  }
}
