import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { AddedItem } from '../../models/AddedItem';
import { CartItem } from '../../models/CartItem';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy, AfterViewChecked {
  title: string = '';
  addedItem: AddedItem[] = [];
  cartItem: CartItem[] = [];
  mapper = new Map();
  amount: number = 1;
  name: string = '';
  price: number = 0;
  totalPrice: number = 0;
  fullname: string = '';
  address: string = '';
  creditCard: number = 0;
  creditCardError: boolean = false;
  messageError: string[] = [];
  private productSubscription: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addedItem = this.cartService.getCartItems();
    this.mapper = this.addedItem.reduce((map, item) => {
      map.set(item.id, (map.get(item.id) || 0) + item.amount);
      return map;
    }, new Map<number, number>());

    this.productSubscription = this.productService
      .getProducts()
      .subscribe((data) => {
        this.cartItem = data
          .filter((item) => this.mapper.has(item.id))
          .map((item) => ({ ...item, amount: this.mapper.get(item.id) }));
      });
  }

  ngAfterViewChecked(): void {
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItem.reduce((acc, item) => {
      this.totalPrice = parseFloat(
        (acc + item.price * Number(item.amount)).toFixed(2)
      );
      return this.totalPrice;
    }, 0);
  }

  isValidCreditCardNumber(str: string): boolean {
    const regexPattern = /^\d{16}$/;
    return regexPattern.test(str);
  }

  checkValidation(form: NgForm): void {
    this.messageError = [];
    let fullnameError = form.controls['fullname'].errors;
    let addressError = form.controls['address'].errors;
    this.creditCardError = !this.isValidCreditCardNumber(form.value.creditCard);

    if (fullnameError) {
      switch (true) {
        case fullnameError['required']:
          this.messageError.push('Fullname is required.');
          break;
        case fullnameError['minlength']:
          this.messageError.push('Fullname is at least 3 characters.');
          break;
      }
    }

    if (addressError) {
      switch (true) {
        case addressError['required']:
          this.messageError.push('Address is required.');
          break;
        case addressError['minlength']:
          this.messageError.push('Address is at least 6 characters.');
          break;
      }
    }

    if (this.creditCardError) {
      this.messageError.push(
        'The credit card number must be a 16-digit number.'
      );
    }
  }

  updateCartItemAmount(item: CartItem, newAmount: number): void {
    if (newAmount < 1) {
      newAmount = 1;
    }
    item.amount = newAmount;
    localStorage.setItem('cart_items', JSON.stringify(this.cartItem));
  }

  removeItemFromCart(id: number): void {
    this.cartItem = this.cartItem.filter((item) => item.id !== id);
    this.calculateTotalPrice();
    localStorage.setItem('cart_items', JSON.stringify(this.cartItem));
    alert(`Removed item from cart successfully!`);
  }

  onSubmit(form: NgForm): void {
    const orderInfo = {
      name: form.value.fullname,
      totalPrice: this.totalPrice,
    };
    localStorage.setItem('order_info', JSON.stringify(orderInfo));
    localStorage.removeItem('cart_items');
    this.router.navigate(['/confirmation']);
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
