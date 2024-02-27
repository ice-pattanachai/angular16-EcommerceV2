import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environment/environment';
import { product } from 'src/app/modelsType/data-type';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-products-for-sale',
  templateUrl: './products-for-sale.component.html',
  styleUrls: ['./products-for-sale.component.css']
})
export class ProductsForSaleComponent {
  url = `${environment.apiUrl}products_all/image?product_id=`
  showLogin = true;
  products: product[] = [];
  popularProducts: undefined | product[];
  trendyProducts: undefined | product[];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  productsInCurrentPage: product[] = [];

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
        console.log('Sending request with token:', token);
        this.authService.authenticateToken(token).subscribe(
          (response: any) => {
            const status = response.status;
            console.log('API Response Status:', status);
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
            this.showLogin = true;
            this.navigateToHomePage();
          }
        );
      }
    } else {
      this.navigateToHomePage();
    }

    this.productService.productList().subscribe((data) => {
      this.products = data;
      console.log("🚀 ~ ProductsForSaleComponent ~ this.productService.productList ~ products:", this.products)
      this.updateProductsInCurrentPage();
    });

  }
  goToPage(page: number): void {
    this.currentPage = page;
    this.updateProductsInCurrentPage();
  }

  updateProductsInCurrentPage(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.productsInCurrentPage = this.products.slice(startIndex, endIndex);
  }

  navigateToHomePage() {
    if (this.showLogin) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/setting/product']);
    }
  }
  // productId.toString()
  editProduct(productId: number): void {
    const productID = { id: productId, };
    localStorage.setItem('EditProductId', JSON.stringify(productID));
    this.router.navigate(['/index']);
  }
}
