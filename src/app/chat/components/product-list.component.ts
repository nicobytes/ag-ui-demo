import { Component } from '@angular/core';
import { exposeComponent } from '@hashbrownai/angular';

import { AiChatProductCardComponent } from './product-card.component';

@Component({
  selector: 'app-chat-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {}

export const AiChatProductListComponent = exposeComponent(
  ProductListComponent,
  {
    description:
      'Two-column grid for catalog products after getProducts (vertical scroll when many items). Wrap one or more app-chat-product-card elements as children.',
    input: {},
    children: [AiChatProductCardComponent],
  },
);
