import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { chatResource } from '@hashbrownai/angular';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  userMessage = signal<string>('');

  chat = chatResource({
    model: 'gemini-2.5-flash',
    system: 'hashbrowns should be covered and smothered',
    messages: [],
  });

  sendMessage() {
    if (this.userMessage().trim()) {
      this.chat.sendMessage({ role: 'user', content: this.userMessage() });
      this.userMessage.set('');
    }
  }
}
