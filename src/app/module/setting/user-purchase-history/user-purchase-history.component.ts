import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { PurchaseOrders, Receipts, User, product } from 'src/app/modelsType/data-type';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-user-purchase-history',
  templateUrl: './user-purchase-history.component.html',
  styleUrls: ['./user-purchase-history.component.css']
})
export class UserPurchaseHistoryComponent {
  userall: User[] | undefined;
  ordersall: PurchaseOrders[] | undefined;
  orderDetail!: PurchaseOrders[];

  // orders: PurchaseOrders[] | undefined;
  showLogin = true;
  products: product[] | undefined;
  productIds: any;
  orders: any;
  isLoggedIn = false;
  url = `${environment.apiUrl}products_all/image?product_id=`
  urlpromptpay = "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl="
  barcode = "https://barcode.tec-it.com/barcode.ashx?data="
  barcodeend = "&code=Code128&translate-esc=on"
  images: any;
  modalService: any;
  popupModal: any;
  receipts: Receipts[] | undefined;
  receiptObjec: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.userall = this.route.snapshot.data['userall'] as User[];
    const userData = localStorage.getItem('user');
    if (!userData) {
      this.router.navigate(['/login/user']);
    } else {
      this.isLoggedIn = true;

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

      if (userId) {
        this.productService.purchase_orders_userid(userId).subscribe((Data) => {
          if (Array.isArray(Data)) {
            this.ordersall = Data;
          } else {
            this.ordersall = [Data];
          }
          const order = this.ordersall[0];
          const orderall = order.orders;

          const productIds = orderall.map((item: { product_id: any; }) => item.product_id);
          const productId = productIds[0];
          if (productId) {
            forkJoin(productIds.map((productId: any) => this.productService.SearchProductId(productId))).subscribe((products) => {
              this.products = products as product[] | undefined;
            });
          }

          const receiptIds = orderall.map((item: { receipt_id: any; }) => item.receipt_id);
          const receiptId = receiptIds[0];
          if (receiptId) {
            forkJoin(receiptIds.map((receiptId: any) => this.productService.SearchReceiptId(receiptId))).subscribe((receipts: any) => {
              this.receipts = receipts.map((receipt: any) => receipt.data[0]) as Receipts[] | undefined;
              console.log('⚡', this.receipts);
            });
          }
          this.orderDetail = orderall;
        });
      }
    }
  }

  isMenuhistor = true;
  toggleUserOrderhistory() {
    this.isMenuhistor = !this.isMenuhistor;
  }

  isMenuOpen = true;
  isMenuDetail = false
  toggleUserisMenuOpen() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isMenuDetail = !this.isMenuDetail;
  }

  selectedOrderDetail: any; // ตัวแปรเพื่อเก็บข้อมูลที่ถูกเลือก
  selectedOrderProduct: any;
  selectedReceipt: any;
  // ฟังก์ชันเพื่อเซ็ตข้อมูลที่ถูกเลือก
  setSelectedOrderDetail(orderDetail: any, product: any, receipt: any) {
    this.selectedOrderDetail = orderDetail;
    this.selectedOrderProduct = product;
    this.selectedReceipt = receipt;
    console.log('⚡⚡⚡', this.selectedReceipt);
  }
}
