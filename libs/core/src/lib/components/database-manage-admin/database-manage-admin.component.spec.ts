import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatabaseManageAdminComponent } from "./database-manage-admin.component";

describe("DatabaseManageAdminComponent", () => {
  let component: DatabaseManageAdminComponent;
  let fixture: ComponentFixture<DatabaseManageAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatabaseManageAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatabaseManageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
