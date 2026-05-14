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
      emulateStructuredOutput: true,
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
    system: 'You are a helpful assistant that can answer questions and help with tasks.',
  });
}
```

### 6. Send messages:

```ts
import { chatResource } from '@hashbrownai/angular';

@Component({
  template: `
    <div>
      <textarea
        class="textarea textarea-bordered w-full"
        rows="3"
        placeholder="Type a message… (Shift+Enter for new line)"
        [value]="userMessage()"
        (input)="userMessage.set($any($event.target).value)"
      ></textarea>
      <button
        class="mt-2 btn btn-primary btn-block"
        type="button" (click)="sendMessage()">Send</button>
    </div>
    <div>
      @for (message of chat.value(); track $index) {
        <p>{{ message.content }}</p>
      }
    </div>
  `,
})
export class App {
  userMessage = signal<string>('');

  sendMessage() {
    if (this.userMessage().trim()) {
      this.chat.sendMessage({ role: 'user', content: this.userMessage() });
      this.userMessage.set('');
    }
  }
}
```

### 7. Identify the role of the message:

```html
@for (message of chat.value(); track $index) {
@switch (message.role) {
  @case ('user') {
    <div class="chat chat-end">
      <div class="chat-header">
        User
      </div>
      <div class="chat-bubble chat-bubble-primary whitespace-pre-line">
        <p>{{ message.content }}</p>
      </div>
    </div>
  }
  @case ('assistant') {
    <div class="chat chat-start">
      <div class="chat-header">
        Assistant
      </div>
      <div class="chat-bubble chat-bubble-neutral whitespace-pre-line">
        <p>{{ message.content }}</p>
      </div>
    </div>
  }
}
}
```

### 7. Generative UI:

```ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { uiChatResource } from '@hashbrownai/angular';
import { AiMarkdownComponent } from './components/markdowm.component';

@Component({
  selector: 'app-chat',
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {

  userMessage = signal<string>('');
  chat = uiChatResource({
    model: 'gemini-2.5-flash',
    system: 'You are a helpful assistant that can answer questions and help with tasks.',
    components: [AiMarkdownComponent],
  });

  sendMessage() {
    if (this.userMessage().trim()) {
      this.chat.sendMessage({ role: 'user', content: this.userMessage() });
      this.userMessage.set('');
    }
  }
}
```

```html
<hb-render-message [message]="message" />
```

### 8 Tools:

```ts
import { inject } from '@angular/core';
import { createTool } from '@hashbrownai/angular';
import { ProductService, Product } from '../../services/product.service';
import { lastValueFrom } from 'rxjs';

export const getProductsTool = createTool({
  name: 'getProducts',
  description: 'Get all products from the store catalog',
  handler: async (): Promise<Product[]> => {
    const productService = inject(ProductService);
    return await lastValueFrom(productService.getAll());
  },
});
```

```ts
chat = uiChatResource({
  model: 'gemini-2.5-flash',
  system: 'You are a helpful assistant that can answer questions and help with tasks.',
  tools: [getProductsTool], // Add your tools here
  components: [AiMarkdownComponent], // Add your components here
});
```


### 9 UI:

```ts
chat = uiChatResource({
  model: 'gemini-2.5-flash',
  system: 'You are a helpful assistant that can answer questions and help with tasks.',
  tools: [getProductsTool], // Add your tools here
  components: [AiMarkdownComponent, AiChatProductListComponent], // Add your components here
});
```
