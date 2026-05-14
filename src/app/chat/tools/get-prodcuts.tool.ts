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
