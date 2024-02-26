import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { PurchaseOrders, Receipts, product } from 'src/app/modelsType/data-type';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  url = `${environment.apiUrl}products_all/image?product_id=`
  showLogin = true;
  receipts: Receipts[] | undefined; //ใบคำสั่งซื้อ
  orders: PurchaseOrders[] = [];  // item ที่สั่งซื้อ ทั้งหมด
  Ordernumber: Receipts[] | undefined;
  ReceiptObject: Receipts[] | undefined;
  products: product[] | undefined;
  item: Receipts[] | undefined
  barcode = "https://barcode.tec-it.com/barcode.ashx?data="
  barcodeend = "&code=Code128&translate-esc=on"

  grandTotal: number = 0;
  totalPerItem: number[] = [];

  popupModalView: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const userObject = JSON.parse(userData);
      const token = userObject.token;
      if (token) {
        this.authService.authenticateToken(token).subscribe(
          (response: any) => {
            const status = response.status;
            if (status === 200) {
              const decoded = response.decoded;
              if (decoded && decoded.roles !== undefined) {
                const roles = decoded.roles;
                if (typeof roles === 'string') {
                  const roleParts = roles.split('|');
                  const firstRole = roleParts[0];

                  if (firstRole === 'seller') {
                    this.showLogin = false;
                  } else {
                    this.showLogin = true;
                  }
                }
              }
            }
            this.navigateToHomePage();
          },
          (error) => {
            console.error('HTTP Error:', error);
            this.showLogin = true; // Set to true in case of error
            this.navigateToHomePage();
          }
        );
      }
    } else {
      this.navigateToHomePage();
    }

    this.productService.SearchReceiptAll().subscribe((data) => {
      this.receipts = data;
    });
  }

  navigateToHomePage() {
    if (this.showLogin) {
      this.router.navigate(['/index']);
    } else {
      this.router.navigate(['/setting/receip']);
    }
  }

  receiptsview: any
  viewreceipts(receipts: any) {
    this.receiptsview = receipts
    const purchaseOrderIds = this.receiptsview.purchase_orders.flatMap((order: any) => order.product_id);
    console.log('purchase_order_ids:', purchaseOrderIds);

    if (purchaseOrderIds) {
      const productId = purchaseOrderIds
      forkJoin(productId.map((productId: any) => this.productService.SearchProductId(productId))).subscribe((products) => {
        this.products = products as unknown as product[] | undefined;
      });
    }
    this.calculateTotals()
  }

  totalall: number | undefined
  calculateTotals(): void {
    if (this.receiptsview && this.receiptsview.purchase_orders) {
      let totalPriceSum = 0;
      this.receiptsview.purchase_orders.forEach((order: any) => {
        totalPriceSum += order.total_price;
      });
      this.totalall = totalPriceSum
    } else {
      console.log('No purchase orders found in the receiptsview');
    }
  }

  isMenuOpen = true;
  isMenuDetail = false
  toggleUserisMenuOpen() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isMenuDetail = !this.isMenuDetail;
  }
  isMenuhistor = true;
  toggleUserOrderhistory() {
    this.isMenuhistor = !this.isMenuhistor;
  }


  getreceipt(id: number) {
    this.productService.SearchReceiptId(id).subscribe((receipt: any) => {
      if (receipt.statusCode == 200) {
        const data = receipt.data[0];
        console.log("🚀 ~ ReceiptComponent ~ this.productService.SearchReceiptId ~ receipt:", receipt)
        this.item = [data]
        this.id = data.id
        this.status = data.status
        this.transport_company_name = data.transport_company_name
        this.parcel_number = data.parcel_number
        this.receipt_make_payment = data.receipt_make_payment
        this.payment_format = data.payment_format
        this.receipt_status = data.receipt_status
      }
    });
  }

  editReceipt() {
    this.productService.edit_Receipt(
      this.id,
      this.status,
      this.transport_company_name,
      this.parcel_number,
      this.receipt_make_payment,
      this.payment_format,
      this.receipt_status,
    ).subscribe({
      next: data => {
        if (data) {
          Swal.fire({
            icon: 'success',
            title: 'Edit Success',
            text: 'Edit Success',
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            this.reloadPage();
          });
        } else {
          window.alert('No data received.'); // หรือทำการจัดการตามที่คุณต้องการ
        }
      },
      error: err => {
        window.alert(err.error.message);
      }
    });
  }
  reloadPage(): void {
    window.location.reload();
  }


  receipt: Receipts | undefined;
  id: number = 0;
  transport_company_name: string = '';
  address: string = '';
  status: boolean = false;
  parcel_number: string = '';
  receipt_make_payment: boolean = false;
  payment_format: string = '';
  receipt_status: boolean = false;
}
