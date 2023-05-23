import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DurationAdminComponent } from "./duration-admin.component";

describe("DurationAdminComponent", () => {
  let component: DurationAdminComponent;
  let fixture: ComponentFixture<DurationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DurationAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DurationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
