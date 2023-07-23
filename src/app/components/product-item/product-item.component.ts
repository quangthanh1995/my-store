import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/Product';
import { AddedItem } from '../../models/AddedItem';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  @Input() item: Product | undefined;
  @Output() product = new EventEmitter();
  id: number = 1;
  name: string = '';
  price: number = 0;
  url: string = '';
  description: string = '';
  amount: number = 1;
  addedItem: AddedItem[] = [];

  constructor() {}

  ngOnInit(): void {}

  addToCart(id: number | undefined): void {
    let storedItems = localStorage.getItem('cart_items');
    this.addedItem = storedItems ? JSON.parse(storedItems) : [];
    if (id && this.amount != 0) {
      this.addedItem.push({
        id: id,
        amount: this.amount,
      });
    }
    localStorage.setItem('cart_items', JSON.stringify(this.addedItem));
  }
}
