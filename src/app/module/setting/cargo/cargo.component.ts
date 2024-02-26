import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environment/environment';
import { User } from 'src/app/modelsType/data-type';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { StorageService } from 'src/app/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cargo',
  templateUrl: './cargo.component.html',
  styleUrls: ['./cargo.component.css']
})
export class CargoComponent implements OnInit {
  userall: User[] | undefined;
  isLoggedIn = false;
  cartData: any[] = [];
  totalPerItem: number[] = [];
  grandTotal: number = 0;
  url = `${environment.apiUrl}products_all/image?product_id=`

  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.userall = this.route.snapshot.data['userall'] as User[];
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/user-login']);
    } else {
      this.isLoggedIn = true;
      this.loadCartData();
    }

    if (userData) {
      const userObject = JSON.parse(userData);
      const userId = userObject.userId;
      if (userId) {
        this.authService.userList(userId).subscribe((userData) => {
          if (Array.isArray(userData)) {
            this.userall = userData;
          } else {
            this.userall = [userData];
          }
        });
      }
    }
    this.generateOrderReceiptNumber();
  }

  loadCartData(): void {
    const cartDataString = localStorage.getItem('AddToCart');
    this.cartData = cartDataString ? JSON.parse(cartDataString) : [];
    this.cartData = this.cartData.map((item, index) => ({ ...item, position: index + 1 }));
    this.calculateTotals();
  }

  removeFromCart(productId: number): void {
    const cartDataString = localStorage.getItem('AddToCart');
    if (cartDataString) {
      let cartData = JSON.parse(cartDataString);
      const index = cartData.findIndex((item: any) => item.id === productId);

      if (index !== -1) {
        cartData.splice(index, 1);
        if (cartData.length === 0) {
          localStorage.removeItem('AddToCart');
          window.location.reload();
        } else {
          localStorage.setItem('AddToCart', JSON.stringify(cartData));
          this.loadCartData();
        }
      } if (index >= 1) {
      }
    }
  }

  calculateTotals(): void {
    this.totalPerItem = this.cartData.map(item => item.price_per_piece * item.quantity);
    this.grandTotal = this.totalPerItem.reduce((acc, total) => acc + total, 0);
  }

  storeProduct(
    id: number,
    product_name: string,
    product_status: boolean,
    price_per_piece: number,
    stock_quantity: number,
    image: string,
  ): void {
    const productData = {
      id: id,
      name: product_name,
      status: product_status,
      price: price_per_piece,
      quantity: stock_quantity,
      image: image,
    };
    localStorage.setItem('Product', JSON.stringify(productData));
  }

  selectedAddress: any;
  selectedAddressId: number | undefined;
  selectChang(event: any) {
    console.log(event.target.value);
    this.selectedAddress = this.getSelectedAddress(event.target.value);
  }

  getSelectedAddress(addressId: any): any {
    if (this.userall) {
      return this.userall[0].addresses.find((e: any) => e.id == addressId);
    }
  }

  addresses_name: string = '';
  address: string = '';
  postalcode: number = 0;
  phone: string = '';
  total_price: number = 0;
  status: boolean = false;
  // payment_format: string = '';
  confirm_payment: boolean = false;
  user_id: number = 0;
  product_id: number = 0;


  order_receipt_number: string = ''
  receipt_make_payment: boolean = false;
  receipt_visibility: boolean = true;
  receipt_status: boolean = true;
  receipt_confirm_payment: boolean = false;
  receipt_id: number = 0;

  // parcel_number: string = 'หากทำการจัดส่งจะมีเลขคำสั่งซื้อ';

  paymentFormat: string = '';

  // สุ่มเลข 64
  generateRandomBase64(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return btoa(result);
  }
  getCurrentTime(): string {
    const now = new Date();
    return now.toISOString();
  }

  generateOrderReceiptNumber(): void {
    const randomBase64 = this.generateRandomBase64(10);
    const currentTime = this.getCurrentTime();
    this.order_receipt_number = randomBase64 + '_' + currentTime;
  }
  onPaymentChange(event: any) {
    console.log('Payment Format from HTML:', event.target.value);
    this.paymentFormat = event.target.value;
    console.log('Payment Format in Component:', this.paymentFormat);
  }


  onClickConfirm() {
    const address = this.selectedAddress.address;
    const addresses_name = this.selectedAddress.fullname;
    const phone = this.selectedAddress.phone;
    const postalcode = this.selectedAddress.postalcode;
    const status = this.status;
    console.log(
      '⚡⚡⚡',
      addresses_name,
      address,
      postalcode,
      phone,
      status,
      // this.parcel_number,
      this.order_receipt_number,
      this.receipt_make_payment,
      this.receipt_visibility,
      this.receipt_status,
      this.receipt_confirm_payment,
      this.paymentFormat
    );

    this.productService.add_Receipt_purchase_orders(
      addresses_name,
      address,
      postalcode,
      phone,
      status,
      // this.parcel_number,
      this.order_receipt_number,
      this.receipt_make_payment,
      this.receipt_visibility,
      this.receipt_status,
      this.receipt_confirm_payment,
      this.paymentFormat
    ).subscribe({
      next: data => {
        const x_id = data.Receipt
        console.log('⚡⚡⚡', data);
        console.log('💻⚡⚡⚡', x_id.id);

        for (const product of this.cartData) {
          // const address = this.selectedAddress.address;
          // const addresses_name = this.selectedAddress.fullname;
          // const phone = this.selectedAddress.phone;
          // const postalcode = this.selectedAddress.postalcode;
          // const status = this.status;

          const user_id = this.userall![0].id;
          const productId = product.id;
          const receipt_id = x_id.id

          this.processOrder(
            // addresses_name,
            // address,
            // postalcode,
            // phone,
            product.quantity,
            product.price_per_piece * product.quantity,
            // status,
            user_id,
            productId,
            receipt_id,
          );
          console.log('⚡⚡⚡', this.processOrder);
        }
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.message,
          showConfirmButton: false,
          timer: 1000,
        });
        console.log(err.error.message);
      }
    });

  }

  processOrder(
    // addresses_name: string,
    // address: string,
    // postalcode: string,
    // phone: string,
    quantity: number,
    total_price: number,
    // status: boolean,
    user_id: number,
    product_id: number,
    receipt_id: number,
  ): void {
    this.productService.add_purchase_orders(
      // addresses_name,
      // address,
      // postalcode,
      // phone,
      quantity,
      total_price,
      // status,
      user_id,
      product_id,
      receipt_id,
    ).subscribe({
      next: data => {
        console.log('⚡⚡⚡', data);
        this.removeFromCart(product_id);
        console.log('Order placed successfully for product id:', product_id);
      },
      error: err => {
        console.error('Error placing order for product id:', product_id, err);
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  updateQuantity(product: any, change: number): void {
    const updatedCart = this.cartData.map(item => {
      if (item.id === product.id) {
        item.quantity += change;
        if (item.quantity < 1) {
          item.quantity = 1;
        }
      }
      return item;
    });

    localStorage.setItem('AddToCart', JSON.stringify(updatedCart));
    this.loadCartData();
  }
}
