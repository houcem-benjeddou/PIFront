import { Component } from '@angular/core';
import { BotService } from '../../../Services/bot.service';

@Component({
  selector: 'app-bot-chat',
  templateUrl: './bot-chat.component.html',
  styleUrls: ['./bot-chat.component.css']
})
export class BotChatComponent {
  prompt: string = '';
  response: string = '';

  constructor(private botService: BotService) {}

  sendPrompt(): void {
    if (!this.prompt.trim()) return;

    this.botService.chatWithBot(this.prompt).subscribe({
      next: (res) => this.response = res,
      error: (err) => console.error('Error chatting with bot:', err)
    });
  }
}
