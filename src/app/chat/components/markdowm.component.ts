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
