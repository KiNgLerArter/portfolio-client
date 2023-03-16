import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";

import { ChatService, ChatServiceStub } from "@entities/chat";
import { MatDialogStub } from "@shared/lib/dialog";

import { ChatHeaderComponent } from "./chat-header.component";

describe("ChatHeaderComponent", () => {
  let component: ChatHeaderComponent;
  let fixture: ComponentFixture<ChatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatHeaderComponent],
      providers: [
        { provide: ChatService, useValue: ChatServiceStub },
        { provide: MatDialog, useValue: MatDialogStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
