import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

const ASSISTANT_AVATAR =
  'https://img.daisyui.com/images/profile/demo/kenobee@192.webp';
const USER_AVATAR =
  'https://img.daisyui.com/images/profile/demo/anakeen@192.webp';

type ChatSide = 'start' | 'end';

type ChatBubbleVariant = 'primary' | 'neutral';

interface ChatMessage {
  id: string;
  side: ChatSide;
  text: string;
  header?: { label: string; time: string };
  footer?: string;
  bubbleVariant?: ChatBubbleVariant;
  avatarUrl?: string;
  avatarAlt?: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ag-ui-demo');
  protected readonly messages = signal<ChatMessage[]>([]);
  protected readonly draft = signal('');

  constructor() {
    this.messages.set(this.buildInitialMessages());
  }

  private buildInitialMessages(): ChatMessage[] {
    const t = this.title();
    return [
      {
        id: crypto.randomUUID(),
        side: 'start',
        text: `Hello, ${t}. Your app is up and running.`,
        header: { label: 'App', time: '12:45' },
        footer: 'Delivered',
        bubbleVariant: 'primary',
        avatarUrl: ASSISTANT_AVATAR,
        avatarAlt: 'Assistant avatar'
      },
      {
        id: crypto.randomUUID(),
        side: 'end',
        text: 'You underestimate my power!',
        header: { label: 'You', time: '12:46' },
        footer: 'Seen 12:46',
        avatarUrl: USER_AVATAR,
        avatarAlt: 'User avatar'
      },
      {
        id: crypto.randomUUID(),
        side: 'start',
        text: "It's over Anakin,\nI have the high ground.",
        bubbleVariant: 'neutral',
        avatarUrl: ASSISTANT_AVATAR,
        avatarAlt: 'Assistant avatar'
      }
    ];
  }

  protected onDraftInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.draft.set(el.value);
  }

  protected onComposerEnter(event: Event): void {
    const ev = event as KeyboardEvent;
    if (!ev.shiftKey) {
      ev.preventDefault();
      this.sendMessage();
    }
  }

  protected sendMessage(): void {
    const text = this.draft().trim();
    if (!text) return;

    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    this.messages.update((msgs) => [
      ...msgs,
      {
        id: crypto.randomUUID(),
        side: 'end',
        text,
        header: { label: 'You', time },
        footer: 'Sent',
        avatarUrl: USER_AVATAR,
        avatarAlt: 'User avatar'
      }
    ]);
    this.draft.set('');
  }
}
