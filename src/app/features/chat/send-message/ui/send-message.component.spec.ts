import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SendMessageComponent } from "./chat-actions.component";

describe("SendMessageComponent", () => {
  let component: SendMessageComponent;
  let fixture: ComponentFixture<SendMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendMessageComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
