import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  items: Product[] = [];
  private productSubscription: Subscription | undefined;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productSubscription = this.productService
      .getProducts()
      .subscribe((data) => {
        this.items = data;
      });
  }

  alertAddToCart(name: string): void {
    alert('Added ' + name + ' to cart successfully!');
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
