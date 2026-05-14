## Generative UI using Hashbrown + Angular

### 1. Install Hashbrown packages

```bash  
npm install @hashbrownai/{core,angular,google} --save
npm install @hashbrownai/{core,angular,openai} --save
```

### 2. Server config:

```ts
// server.ts
import { HashbrownGoogle } from '@hashbrownai/google';

app.use(express.json());
app.post('/api/chat', async (req, res) => {
  const stream = HashbrownGoogle.stream.text({
    apiKey: process.env['GOOGLE_API_KEY'] ?? '',
    request: req.body, // must be Chat.Api.CompletionCreateParams
  });

  res.header('Content-Type', 'application/octet-stream');

  for await (const chunk of stream) {
    res.write(chunk); // Pipe each encoded frame as it arrives
  }

  res.end();
});
```

### 3. Config your environment variables:

// .env

```
GOOGLE_API_KEY=your-google-api-key
```

### 4. Client config:

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

### 5. Use chatResource:

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
  chat = chatResource({
    model: 'gemini-2.5-flash',
    system: 'hashbrowns should be covered and smothered',
    messages: [],
  });
}
```

### 6. Send messages:

```ts
import { chatResource } from '@hashbrownai/angular';

@Component({
  template: `
    <textarea
      class="textarea textarea-bordered w-full"
      rows="3"
      placeholder="Type a message… (Shift+Enter for new line)"
      [value]="userMessage()"
      (input)="userMessage.set($any($event.target).value)"
    ></textarea>
    <button class="mt-2 btn btn-primary btn-block" type="button" (click)="sendMessage()">Send</button>
  `,
})
export class App {
  userMessage = model<string>('');

  sendMessage() {
    if (this.userMessage().trim()) {
      this.chat.sendMessage({ role: 'user', content: this.userMessage() });
      this.userMessage.set('');
    }
  }
}
```


