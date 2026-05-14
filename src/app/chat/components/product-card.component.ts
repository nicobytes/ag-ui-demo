import {
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { exposeComponent } from '@hashbrownai/angular';
import { s } from '@hashbrownai/core';

@Component({
  selector: 'app-chat-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  host: {
    class: 'block w-full',
  },
})
export class ProductCardComponent {

  readonly title = input.required<string>();
  readonly price = input.required<number>();
  readonly description = input<string>('');
  readonly imageUrl = input<string>('');
  readonly categoryName = input<string>('');
  readonly slug = input<string>('');

  readonly descriptionSnippet = computed(() => this.description().trim());
}

export const AiChatProductCardComponent = exposeComponent(
  ProductCardComponent,
  {
    description:
      'Compact DaisyUI card for one catalog product — image, title, price, optional category/description, View link when slug exists.',
    input: {
      title: s.string('Product title from catalog'),
      price: s.number('Unit price number from catalog'),
      description: s.string(
        'Optional product description excerpt for the card',
      ),
      imageUrl: s.string(
        'Primary image URL: first entry of images[] or empty string',
      ),
      categoryName: s.string(
        'Category display name from product.category.name or empty',
      ),
      slug: s.string('URL slug for /product/{slug}; empty string if unknown'),
    },
  },
);
