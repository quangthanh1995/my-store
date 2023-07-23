import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from '../../models/Order';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent implements OnInit, OnDestroy {
  orderInfo: Order | undefined;

  constructor() {}

  ngOnInit(): void {
    let order = localStorage.getItem('order_info');
    this.orderInfo = order ? JSON.parse(order) : {};
  }

  ngOnDestroy(): void {
    localStorage.removeItem('order_info');
  }
}
