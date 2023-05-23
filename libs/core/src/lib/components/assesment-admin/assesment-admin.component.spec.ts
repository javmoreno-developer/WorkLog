import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AssesmentAdminComponent } from "./assesment-admin.component";

describe("AssesmentAdminComponent", () => {
  let component: AssesmentAdminComponent;
  let fixture: ComponentFixture<AssesmentAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssesmentAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssesmentAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
