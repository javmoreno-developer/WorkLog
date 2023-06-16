import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { MenuController } from "@ionic/angular";

@Component({
  selector: "worklog-fe-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {

  //ROLES = ["admin","student","teacher","labor"]
  ROLES = ["admin","admin","teacher","labor"]
  sidebar_rows: any

  constructor(private menu:MenuController,private router: Router) {
     // obtengo las filas necesarias para el sidebar
     let user = JSON.parse(localStorage.getItem("sessionData") as string)
     let role = this.ROLES[user.profile-1]

     // obtengo la url actual
     const currentUrl = this.router.url.split("/")[1];

     // asigno datos
     if(role == "teacher") {
      this.sidebar_rows = [
        {name: "Alumnos", url:"students", active: false, icon: "person"},
        {name: "Convenios", url:"agreements", active: false, icon: "contact_page"},
        {name: "Empresas", url:"companies", active: false, icon: "apartment"},
        {name: "Laborales", url:"labors", active: false, icon: "location_home"},
        {name: "Docentes", url:"teachers", active: false, icon: "school"},
      ]
     } else if(role == "admin") {
      this.sidebar_rows = [
        {name: "Dashboard", url:"home", active: false, icon: "dashboard"},
        {name: "Alumnos", url:"students", active: false, icon: "person"},
        {name: "Convenios", url:"agreements", active: false, icon: "contact_page"},
        {name: "Empresas", url:"companies", active: false, icon: "apartment"},
        {name: "Laborales", url:"labors", active: false, icon: "location_home"},
        {name: "Docentes", url:"teachers", active: false, icon: "school"},
        {name: "Unidades", url:"units", active: false, icon: "calendar_view_month"},
        {name: "Modulos", url:"modules", active: false, icon: "book"},
        {name: "Ajustes", url:"settings", active: false, icon: "settings"},
      ]
     }

     // asigno active dependiendo de la url
     this.sidebar_rows.forEach((element : any) => {
      if(element.url == currentUrl || element.url.includes(currentUrl)) {
        element.active = true;
      }
     });
     
  }
 
  @Output() onCloseMenu = new EventEmitter();

  closeMenu() {
    this.onCloseMenu.emit(true);
  }

  openMenu() {
    console.log("Hey")
    //this.menu.open()
  }
}
