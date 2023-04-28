import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";

import { ChatService, ChatServiceStub } from "@entities/chat";
import { MatDialogStub } from "@shared/lib/dialog";

import { DropdownChatHeaderComponent } from "./dropdown-chat-header.component";

describe("DropdownChatHeaderComponent", () => {
  let component: DropdownChatHeaderComponent;
  let fixture: ComponentFixture<DropdownChatHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownChatHeaderComponent],
      providers: [
        { provide: ChatService, useValue: ChatServiceStub },
        { provide: MatDialog, useValue: MatDialogStub }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownChatHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
