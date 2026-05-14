import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  name: string;
  image: string;
  slug?: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
  slug?: string;
  creationAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAll(params?: Params) {
    return this.http.get<Product[]>(`${this.apiUrl}/api/v1/products`, {
      params,
    });
  }

  getOne(id: string | number) {
    return this.http.get<Product>(`${this.apiUrl}/api/v1/products/${id}`);
  }

  getOneBySlug(slug: string) {
    return this.http.get<Product>(
      `${this.apiUrl}/api/v1/products/slug/${slug}`,
    );
  }

  getRelatedProducts(slug: string) {
    return this.http.get<Product[]>(
      `${this.apiUrl}/api/v1/products/slug/${slug}/related`,
    );
  }

  updateOne(id: string | number, changes: Partial<Product>) {
    return this.http.put<Product>(
      `${this.apiUrl}/api/v1/products/${id}`,
      changes,
    );
  }
}
