import { HttpHeaders, HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { AlertController, MenuController, ModalController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { ApiService, NotificationService } from "@worklog-fe/core";
import { EmptyModalComponent } from "libs/core/src/lib/components/empty-modal/empty-modal.component";
import { LocaleService } from "libs/core/src/lib/services/locale.service";
import { BehaviorSubject, lastValueFrom } from "rxjs";

@Component({
  selector: "worklog-fe-modules",
  templateUrl: "./modules.page.html",
  styleUrls: ["./modules.page.scss"],
})
export class ModulesPage implements OnInit {

  // Variables
  rows = new BehaviorSubject<Object>([]);
  columns = new BehaviorSubject<Object>([]);
  unitOptions = new BehaviorSubject<Object>([]);
  units = {}
  mappedList = []

  tableStyle = "general"

  defaultLang: any = "";
  languages: any;
  toolbarOptions: any;

  tableButtons = [
    { icon: "create", text: "", fun: "onEdit", cssClass: "edit_icon", popover: false },
    { icon: "close", text: "", fun: "onDelete", cssClass: "delete_icon", popover: false },
  ]



  constructor(private locale: LocaleService, private alert: AlertController, private notification: NotificationService, private translate: TranslateService, private modalCtrl: ModalController, private menuCtrl: MenuController, private apiSvc: ApiService, @Inject("apiUrlBase") public apiUrlBase?: any, @Inject("apiHeaders") public apiHeaders?: any) {
    this.chargeData();
  }


  async ngOnInit() {
    this.defaultLang = this.locale.locale

    // Set all toolbar options
    this.toolbarOptions = [
      { name: await lastValueFrom(this.translate.get("toolbar.profile")), value: 'profile' },
      { name: await lastValueFrom(this.translate.get("toolbar.signOut")), value: 'out' }
    ]
    // Set all idioms
    this.languages = [
      { name: await lastValueFrom(this.translate.get("languages.english")), value: "en-en" },
      { name: await lastValueFrom(this.translate.get("languages.spanish")), value: "es-es" }
    ]
  }

  // Charge module data 
  chargeData() {
    let url = this.apiUrlBase + "module/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)

    const params = new HttpParams().set("id_check", user.profile)
    this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve: any) => {
        // Get rows
        this.prepareRows(resolve);
        // Get columns
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

  // Prepare rows in order to represent the data
  prepareRows(param: any) {
    // Get id row
    const arrayIdModule = param.map((objeto: { idUnit: any; }) => objeto.idUnit);

    let url = this.apiUrlBase + "module/get/initials"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile)

    this.apiSvc.post(url, params, arrayIdModule, this.apiHeaders).subscribe(
      (resolve: any) => {
        param.forEach((objeto: { unit: any; }, index: string | number) => {
          objeto.unit = resolve[index];
        });

        this.rows.next(param)
      },
      (error) => {

      }
    )

  }

  // Close sidebar menu
  closeMenu(param: any) {
    this.menuCtrl.close();
  }


  // Prompt add a moduel
  async addModal() {
    // Obtain and map all units and present the modal
    let mappedList = this.getAllUnits(null);
  }

  // Get all units from db
  async getAllUnits(cellUpd: Object | null) {
    let url = this.apiUrlBase + "unit/get/all"
    let user = JSON.parse(localStorage.getItem("sessionData") as string)
    const params = new HttpParams().set("id_check", user.profile)

    return await this.apiSvc.get(url, params, this.apiHeaders).subscribe(
      (resolve) => {
        this.units = resolve
        // Map units
        return this.mapAllUnits(this.units, cellUpd);

      },
      async (error) => {
        this.notification.showToast(await lastValueFrom(this.translate.get('general.chargeErr')), "error", "medium")
      }
    )
  }

  // Map units
  mapAllUnits(param: any, cellUpd: Object | null) {
    this.mappedList = param.map((obj: any) => ({
      name: obj.initials,
      value: obj.idUnit,
    }));

    this.presentModal(cellUpd)

  }

  // Create general modal
  async presentModal(cellUpd: Object | null) {

    let textSection = await lastValueFrom(this.translate.get("modules.modalTitle"))

    // Change button 
    let buttonSection = [{ text: await lastValueFrom(this.translate.get("general.update")), type: "info", fun: "onEdit" }]

    if (cellUpd == null) {
      buttonSection = [{ text: await lastValueFrom(this.translate.get("general.added")), type: "info", fun: "onAdd" }]
    }

    let unitPlaceholder = await lastValueFrom(this.translate.get("modules.unitForm"))

    if(cellUpd) {
      textSection = await lastValueFrom(this.translate.get("modules.updTitle"))
    }
    // Create modal
    const modal = await this.modalCtrl.create({
      component: EmptyModalComponent,
      componentProps: {
        textSection: [textSection],
        buttonSection: buttonSection,
        inputSection: [{ formName: "name", type: "text", mandatory: true }, { formName: "initials", type: "text", mandatory: true }, { formName: "hours", type: "number", mandatory: true }, { formName: "description", type: "text", mandatory: false }],
        selectSection: [{ formName: "idUnit", options: this.mappedList, placeholder: unitPlaceholder }],
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

  // Add module operation
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

  // Update module operation
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

  // Prompt delete
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

  // Change the idiom of the entire app (event from child component)
  changeIdiom(param: any) {
    this.translate.setDefaultLang(param)
    this.locale.registerCulture(param)
  }
}
