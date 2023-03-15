import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NicknameFieldComponent } from "./nickname-field.component";

describe("NicknameFieldComponent", () => {
  let component: NicknameFieldComponent;
  let fixture: ComponentFixture<NicknameFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NicknameFieldComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NicknameFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
