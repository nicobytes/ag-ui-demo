### Generative UI using Hashbrown + Angular

1. Install Hashbrown packages

```bash  
npm install @hashbrownai/{core,angular,google} --save
npm install @hashbrownai/{core,angular,openai} --save
```

2. Server config:

```ts
// server.ts
import { HashbrownGoogle } from '@hashbrownai/google';
import express from 'express';

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
  const stream = HashbrownGoogle.stream.text({
    apiKey: process.env.GOOGLE_API_KEY!,
    request: req.body, // must be Chat.Api.CompletionCreateParams
  });

  res.header('Content-Type', 'application/octet-stream');

  for await (const chunk of stream) {
    res.write(chunk); // Pipe each encoded frame as it arrives
  }

  res.end();
});

app.listen(3000);
```

3. Client config:

```ts
import { provideHashbrown } from '@hashbrownai/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHashbrown({
      baseUrl: '/api/chat',
    }),
  ],
};
```

4. Use chatResource:

```ts
import { chatResource } from '@hashbrownai/angular';

@Component({
  template: `
    // 1. Render the content of each message
    @for (message of chat.value(); track $index) {
      <p>{{ message.content }}</p>
    }
  `,
})
export class App {
  // 2. Generate the messages from a prompt
  chat = chatResource({
    model: 'gemini-3-flash-preview',
    system: 'hashbrowns should be covered and smothered',
    messages: [
      { role: 'user', content: 'Write a short story about breakfast.' },
    ],
  });
}
```

5. Send messages:


```ts
import { chatResource } from '@hashbrownai/angular';

@Component({
  template: `
    <div>
      <input
        type="text"
        [value]="userMessage()"
        (input)="userMessage.set($any($event.target).value)"
        (keydown.enter)="send()"
        placeholder="Prompt..."
      />
      <button (click)="send()">Send</button>
    </div>
  `,
})
export class App {
  userMessage = input<string>('');

  send() {
    if (this.userMessage().trim()) {
      this.chat.sendMessage({ role: 'user', content: this.userMessage() });
      this.userMessage.set('');
    }
  }
}
```
