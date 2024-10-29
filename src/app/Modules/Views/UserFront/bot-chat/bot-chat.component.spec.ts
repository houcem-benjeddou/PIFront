import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotChatComponent } from './bot-chat.component';

describe('BotChatComponent', () => {
  let component: BotChatComponent;
  let fixture: ComponentFixture<BotChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BotChatComponent]
    });
    fixture = TestBed.createComponent(BotChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
