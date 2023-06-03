import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmptySwiperComponent } from "./empty-swiper.component";

describe("EmptySwiperComponent", () => {
  let component: EmptySwiperComponent;
  let fixture: ComponentFixture<EmptySwiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmptySwiperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptySwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
