import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { PurchaseOrders, Receipts, User, product } from 'src/app/modelsType/data-type';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent {
  orders: PurchaseOrders[] = [];
  products: product[] | undefined;
  users: User[] | undefined;
  receipts: Receipts[] | undefined;
  showLogin = true;
  url = `${environment.apiUrl}/products_all/image?product_id=`
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
        // console.log('Sending request with token:', token);
        this.authService.authenticateToken(token).subscribe(
          (response: any) => {
            const status = response.status;
            // console.log('API Response Status:', status);
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

    this.productService.ordersList().subscribe((data) => {
      this.orders = data;
      // console.log('⚡⚡⚡', data);
      const productIds = this.orders.map(order => order.product_id);
      const userids = this.orders.map(order => order.user_id);
      const receiptids = this.orders.map(order => order.receipt_id);

      // console.log('⚡⚡⚡', 'productIds = ', productIds);
      // console.log('⚡⚡⚡', 'userids = ', userids);
      // console.log('⚡⚡⚡', 'receiptids = ', receiptids);

      if (productIds) {
        forkJoin(productIds.map((productId: any) => this.productService.SearchProductId(productId))).subscribe((products) => {
          this.products = products as unknown as product[] | undefined;
          console.log('⚡⚡⚡', this.products);
        });
      }
      if (userids) {
        const id = userids
        forkJoin(id.map((id: any) => this.authService.userList(id))).subscribe((users) => {
          this.users = users as unknown as User[] | undefined;
          console.log('⚡⚡⚡', this.users);
        });
      }
      if (receiptids) {
        const receiptId = receiptids
        forkJoin(receiptId.map((receiptId: any) => this.productService.SearchReceiptId(receiptId))).subscribe((receiptids) => {
          this.receipts = receiptids.map((receipt: any) => receipt.data[0]) as Receipts[] | undefined;
          console.log('⚡⚡⚡', this.receipts);
        });
      }
    });
  }

  navigateToHomePage() {
    if (this.showLogin) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/manage_porders']);
    }
  }

  editOrders(productId: number): void {
    const productID = { id: productId, };
    localStorage.setItem('EditOrdersId', JSON.stringify(productID));
    this.router.navigate(['/edit-order']);
  }
}
