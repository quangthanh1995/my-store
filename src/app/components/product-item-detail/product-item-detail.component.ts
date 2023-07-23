import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { AddedItem } from '../../models/AddedItem';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-item-detail',
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.css'],
})
export class ProductItemDetailComponent implements OnInit, OnDestroy {
  item: Product | undefined;
  amount: number = 1;
  addedItem: AddedItem[] = [];
  private productSubscription: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productSubscription = this.productService
      .getProducts()
      .subscribe((data) => {
        this.activatedRoute.params.subscribe((params) => {
          this.item = data.find(
            (product: Product) => product.id == params['id']
          );
        });
      });
  }

  addToCart(id: number | undefined): void {
    let storedItems = localStorage.getItem('cart_items');
    this.addedItem = storedItems ? JSON.parse(storedItems) : [];
    if (id && this.amount !== 0) {
      this.addedItem.push({
        id: id,
        amount: this.amount,
      });
    }
    localStorage.setItem('cart_items', JSON.stringify(this.addedItem));
    alert(`Added ${this.item?.name} to cart successfully!`);
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
