import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { PurchaseOrders, Receipts, product } from '../modelsType/data-type';

const AUTH_API = `${environment.apiUrl}`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = AUTH_API;
  cartData = new EventEmitter<product[] | []>();
  constructor(private http: HttpClient) { }

  addProduct(productData: FormData): Observable<any> {
    return this.http.post(AUTH_API + 'add_product', productData);
  }

  edit_Product(
    id: number, product_name: string, description: string,
    product_status: boolean, price_per_piece: number,
    stock_quantity: number
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'products_edit',
      {
        id,
        product_name,
        description,
        product_status,
        price_per_piece,
        stock_quantity,
      },
      httpOptions
    );
  }

  edit_Oders(
    id: number,
    addresses_name: string,
    status: boolean,
    parcel_number: string,
    confirm_payment: boolean
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'purchase_orders/edit',
      {
        id,
        addresses_name,
        status,
        parcel_number,
        confirm_payment,
      },
      httpOptions
    );
  }

  add_Receipt_purchase_orders(
    addresses_name: string,
    address: string,
    postalcode: string,
    phone: string,
    status: boolean,
    // parcel_number: string,
    // ^new
    order_receipt_number: string,
    receipt_make_payment: boolean,
    receipt_visibility: boolean,
    receipt_status: boolean,
    receipt_confirm_payment: boolean,
    payment_format: string,
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'receipt/add',//
      {
        addresses_name,
        address,
        postalcode,
        phone,
        status,
        // parcel_number,
        // ^new
        order_receipt_number,
        receipt_make_payment,
        receipt_visibility,
        receipt_status,
        receipt_confirm_payment,
        payment_format,
      },
      httpOptions
    );
  }

  edit_Receipt(
    id: number,
    status: boolean,
    transport_company_name: string,
    parcel_number: string,
    receipt_make_payment: Boolean,
    payment_format: string,
    receipt_status: boolean,
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'receipt/edit',
      {
        id,
        status,
        transport_company_name,
        parcel_number,
        receipt_make_payment,
        payment_format,
        receipt_status,
      },
      httpOptions
    );
  }

  // edit_Receipt(): Observable<Receipts[]> {
  //   return this.http.post<Receipts[]>(`${this.apiUrl}receipt/edit`, {});
  // }

  // add_purchase_orders(
  //   // addresses_name: string,
  //   // address: string,
  //   // postalcode: string,
  //   // phone: string,
  //   quantity: number,
  //   total_price: number,
  //   // status: boolean,
  //   user_id: number,
  //   product_id: number,
  //   receipt_id: number,

  // ): Observable<any> {
  //   return this.http.post(
  //     AUTH_API + 'purchase_orders/add',
  //     {
  //       // addresses_name,
  //       // address,
  //       // postalcode,
  //       // phone,
  //       quantity,
  //       total_price,
  //       // status,
  //       user_id,
  //       product_id,
  //       receipt_id,
  //     },
  //     httpOptions
  //   );
  // }
  add_purchase_orders(
    quantity: number,
    total_price: number,
    user_id: number,
    product_id: number,
    receipt_id: number,

  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'purchase_orders/add',
      {
        quantity,
        total_price,
        user_id,
        product_id,
        receipt_id,
      },
      httpOptions
    );
  }

  edit_purchase_orders(
    id: number,
    addresses_name: string,
    address: string,
    postalcode: number,
    phone: string,
    quantity: number,
    total_price: number,
    status: boolean,
    parcel_number: string,
    payment_format: string,
    confirm_payment: boolean,
    user_id: number,
    product_id: number

  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'purchase_orders/edit',
      {
        id,
        addresses_name,
        address,
        postalcode,
        phone,
        quantity,
        total_price,
        status,
        parcel_number,
        payment_format,
        confirm_payment,
        user_id,
        product_id,
      },
      httpOptions
    );
  }

  getProductImage(productId: number): Observable<string> {
    const url = `${this.apiUrl}products_allimage?product_id=${productId}`;
    return this.http.get<string>(url);
  }

  ordersList(): Observable<PurchaseOrders[]> {
    return this.http.post<PurchaseOrders[]>(`${this.apiUrl}purchase_orders/search/all`, {});
  }

  productList(): Observable<product[]> {
    return this.http.post<product[]>(`${this.apiUrl}products_all`, {});
  }

  getProduct(id: string) {
    return this.http.get<product>(`${this.apiUrl}products_id/get/${id}`);
  }

  SearchProductId(productId: any): Observable<product[]> {
    const body = { productId: productId };
    const data = this.http.post<product[]>(`${this.apiUrl}products_id`, body)
    return data;
  }

  SearchReceiptId(receiptId: any): Observable<Receipts[]> {
    const body = { receiptId: receiptId };
    const data = this.http.post<Receipts[]>(`${this.apiUrl}receipt/search/id`, body)
    return data;
  }

  SearchReceiptAll(): Observable<Receipts[]> {
    return this.http.post<Receipts[]>(`${this.apiUrl}receipt/search/all`, {});
  }

  purchase_orders_userid(user_id: any): Observable<PurchaseOrders[]> {
    const body = { user_id: user_id };
    const data = this.http.post<PurchaseOrders[]>(`${this.apiUrl}purchase_orders/search/userId`, body)
    return data;
  }

  purchase_orders_id(id: any): Observable<PurchaseOrders[]> {
    const body = { id: id };
    const data = this.http.post<PurchaseOrders[]>(`${this.apiUrl}purchase_orders/search/Id`, body)
    return data;
  }

  updateProduct(productData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}products_edit`, productData);
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => productId !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }
}
