import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor() {}

  getCartItems() {
    const storedItems = localStorage.getItem('cart_items');
    return storedItems ? JSON.parse(storedItems) : [];
  }
}
