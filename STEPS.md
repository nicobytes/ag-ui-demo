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
import { exposeComponent } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';
import { marked } from 'marked';

import {
    Component,
    ViewEncapsulation,
    computed,
    inject,
    input,
    SecurityContext
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-markdown',
    encapsulation: ViewEncapsulation.None,
    template: ` <div class="ai-markdown" [innerHTML]="html()"></div>`,
    styleUrls: ['./markdown.component.css'],
})
export class MarkdownComponent {
    private readonly sanitizer = inject(DomSanitizer);

    readonly data = input.required<string>();

    readonly html = computed(() => {
        const parsed = marked.parse(this.data(), { async: false }) as string;
        return this.sanitizer.sanitize(SecurityContext.HTML, parsed) ?? '';
    });
}

export const AiMarkdownComponent = exposeComponent(MarkdownComponent, {
    description: 'Show markdown to the user',
    input: {
        data: s.streaming.string('The markdown content')
    }
});

```
