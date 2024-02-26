import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environment/environment';
import { product } from 'src/app/modelsType/data-type';
import { ProductService } from 'src/app/service/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.css']
})
export class DetailedComponent implements OnInit {
  url = `${environment.apiUrl}products_all/image?product_id=`
  product: product | undefined;
  products: product[] | undefined;
  quantity: number = 1;
  productData: undefined | product;

  constructor(
    private productService: ProductService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      const productId = params['id'];
      // ทำสิ่งที่คุณต้องการด้วย productId
      if (productId) {
        this.productService.productList().subscribe((products) => {
          // ค้นหา product ที่มี id ตรงกันใน productList
          this.product = products.find(product => product.id == productId);
          const randomProducts = this.getRandomProducts(products, 4);
          this.products = randomProducts;
        });
      }
    });
  }
  getRandomProducts(products: any[], count: number): any[] {
    const shuffled = products.slice(0);
    let i = products.length;
    const min = i - count;
    let temp;
    let index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }

  addToCart(product: product): void {
    const userData = localStorage.getItem('user');
    if (!userData) {
      Swal.fire({
        icon: 'warning',
        title: 'Login',
        text: 'Log in before using',
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        this.router.navigate(['/login/user']);
      });
      return;
    }

    const existingCartData = localStorage.getItem('AddToCart');
    let cartData = existingCartData ? JSON.parse(existingCartData) : [];

    const existingProduct = cartData.find((item: any) => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += this.quantity;
    } else {
      const productData = {
        id: product.id,
        product_name: product.product_name,
        description: product.description,
        product_status: product.product_status,
        price_per_piece: product.price_per_piece,
        stock_quantity: product.stock_quantity,
        images: product.images,
        quantity: this.quantity
      };
      cartData.push(productData);
      Swal.fire({
        icon: 'success',
        title: 'Add To Cart',
        text: 'Successfully',
        showConfirmButton: false,
        timer: 1000,
      }).then((result) => {
        window.location.reload();
      });
    }

    localStorage.setItem('AddToCart', JSON.stringify(cartData));
  }

  handleQuantity(val: string) {
    if (this.quantity < 20 && val === 'plus') {
      this.quantity += 1;
    } else if (this.quantity > 1 && val === 'min') {
      this.quantity -= 1;
    }
  }

  removeFromCart(productId: number): void {
    const existingCartData = localStorage.getItem('AddToCart');
    if (existingCartData) {
      let cartData = JSON.parse(existingCartData);
      const productIndex = cartData.findIndex((item: any) => item.id === productId);
      if (productIndex !== -1) {
        cartData.splice(productIndex, 1);
        if (cartData.length === 0) {
          localStorage.removeItem('AddToCart');
          window.location.reload();
        } else {
          localStorage.setItem('AddToCart', JSON.stringify(cartData));
        }
      } else {

      }
    }
  }
}

