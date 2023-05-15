import { Component } from "@angular/core";
import { MenuController } from "@ionic/angular";

@Component({
  selector: "worklog-fe-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})

export class HomePage {
  sidebar_rows: any

  //ROLES = ["admin","student","teacher","labor"]
  ROLES = ["admin","admin","teacher","labor"]

  constructor(private menuCtrl: MenuController) {
     // obtengo las filas necesarias para el sidebar
     let user = JSON.parse(localStorage.getItem("sessionData") as string)
     let role = this.ROLES[user.profile]

     if(role == "teacher") {
      this.sidebar_rows = [
        {name: "Alumnos", url:"", active: false, icon: "person"},
        {name: "Convenios", url:"", active: false, icon: "contact_page"},
        {name: "Empresas", url:"", active: false, icon: "apartment"},
        {name: "Laborales", url:"", active: false, icon: "location_home"},
      ]
     } else if(role == "admin") {
      this.sidebar_rows = [
        {name: "Dashboard", url:"", active: true, icon: "dashboard"},
        {name: "Alumnos", url:"", active: false, icon: "person"},
        {name: "Convenios", url:"", active: false, icon: "contact_page"},
        {name: "Empresas", url:"", active: false, icon: "apartment"},
        {name: "Laborales", url:"", active: false, icon: "location_home"},
        {name: "Docentes", url:"", active: false, icon: "school"},
        {name: "Ajustes", url:"", active: false, icon: "settings"},
      ]
     }
   }

  isMenuOpen = false;

  rows = [
    {name: "mercy", age: 10, town: "Nairobi", country: "kenya", cssClass: "status_complete"},
    {name: "Vincent", age: 40, town: "Kampala", country: "Uganda", cssClass: "status_uncomplete"},
    {name: "Wesley", age: 41, town: "Cairo", country: "Egypt", cssClass: "status_complete"},
    {name: "Juan", age: 25, town: "Madrid", country: "España", cssClass: "status_complete"},
    {name: "Ana", age: 32, town: "Barcelona", country: "España", cssClass: "status_uncomplete"},
    {name: "Peter", age: 42, town: "Londres", country: "Reino Unido", cssClass: "status_complete"},
    {name: "Emma", age: 19, town: "Nueva York", country: "Estados Unidos", cssClass: "status_uncomplete"},
    {name: "Hans", age: 36, town: "Munich", country: "Alemania", cssClass: "status_complete"},
    {name: "Alice Johnson", age: 28, town: "New York", country: "United States", cssClass: "status_uncomplete"},
    {name: "Bob Smith", age: 42, town: "London", country: "United Kingdom", cssClass: "status_complete"},
    {name: "Carla Rodriguez", age: 35, town: "Madrid", country: "Spain", cssClass: "status_uncomplete"},
    {name: "David Lee", age: 31, town: "Seoul", country: "South Korea", cssClass: "status_complete"},
    {name: "Emma Zhang", age: 26, town: "Shanghai", country: "China", cssClass: "status_uncomplete"},
    {name: "Frank Meyer", age: 49, town: "Berlin", country: "Germany", cssClass: "status_complete"},
    {name: "Grace Kim", age: 33, town: "Sydney", country: "Australia", cssClass: "status_uncomplete"},
    {name: "Henry Chen", age: 37, town: "Taipei", country: "Taiwan", cssClass: "status_complete"},
    {name: "Isabella Garcia", age: 29, town: "Bogotá", country: "Colombia", cssClass: "status_uncomplete"},
    {name: "James Wilson", age: 45, town: "Toronto", country: "Canada", cssClass: "status_complete"},
  ]
  columns = [
    //{prop: '', name: '',icon:true},
    //{prop: '', name: '',toggle:true, checked: true},
    { prop: 'name', name: 'name' },
    { prop: 'age', name: 'age' },
    { prop: 'town', name: 'town' },
    { prop: 'country', name: 'country' },
  ];

  tableStyle = "inform"

  tableButtons = [
    { icon: "information-circle", text: "", fun: "onClick", cssClass: "download_icon", popover: false },
    //{ icon: "create", text: "", fun: "onClick", cssClass: "edit_icon", popover: false },
   // { icon: "close", text: "", fun: "onClick", cssClass: "delete_icon", popover: false },
    {icon: "eye", text: "Entradas", fun: "onClick", cssClass: "see_entries_btn", popover: false}
    // {icon: "download", text: "", fun: "onClick", cssClass: "download_icon", popover: false}
    //{icon: "information-circle", text: "", fun: "onClick", cssClass: "download_icon", popover: false},
    //{icon: "ellipsis-vertical", text: "", fun: "onClick", cssClass: "popover_icon", popover: true}
  ]

  closeMenu(param: any) {
    this.menuCtrl.close();
  }
 

}
