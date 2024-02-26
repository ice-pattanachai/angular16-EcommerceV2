import { Component, OnInit } from '@angular/core';
import { environment } from 'src/app/environment/environment';
import { product } from 'src/app/modelsType/data-type';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  products: product[] = [];
  productImages: { [key: number]: string } = {};
  url = `${environment.apiUrl}products_all/image?product_id=`

  popularProducts: undefined | product[];
  trendyProducts: undefined | product[];
  http: any;
  product: any;

  constructor(
    private productService: ProductService
  ) { }

  isNumber(value: any): boolean {
    return !isNaN(value);
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
  ngOnInit() {
    this.productService.productList().subscribe((data) => {
      this.products = data.filter((product) => product.product_status === true && product.price_per_piece !== 0 && product.stock_quantity !== 0);
    });
  }
}
