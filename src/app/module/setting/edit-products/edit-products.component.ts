import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/environment/environment';
import { product } from 'src/app/modelsType/data-type';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.css']
})
export class EditProductsComponent implements OnInit{
url = `${environment.apiUrl}products_all/image?product_id=`
    showLogin = true;
    productId: number | undefined;
    product: product | undefined;

    id: number = 0;
    product_name: string = '';
    description: string = '';
    product_status: boolean = false;
    price_per_piece: number = 0;
    stock_quantity: number = 0;
    selectedProductStatus: boolean = false;
    errorMessage = '';

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
                        this.showLogin = true; // Set to true in case of error
                        this.navigateToHomePage();
                    }
                );
            }
        } else {
            this.navigateToHomePage();
        }

        const productID = localStorage.getItem('EditProductId');
        if (productID) {
            const productObject = JSON.parse(productID);
            const productId = productObject.id;
            if (productId) {
                this.productService.productList().subscribe((products) => {
                    this.product = products.find(product => product.id === productId);
                    if (this.product) {
                        this.id = this.product.id;
                        this.product_name = this.product.product_name;
                        this.description = this.product.description;
                        this.selectedProductStatus = this.product.product_status;
                        this.price_per_piece = this.product.price_per_piece;
                        this.stock_quantity = this.product.stock_quantity;
                    }
                });
            }
        }
    }

    navigateToHomePage() {
        if (this.showLogin) {
            this.router.navigate(['/']);
        } else {
            this.router.navigate(['/editproducts']);
        }
    }

    onClickEditProduct() {
        this.productService.edit_Product(
            this.id,
            this.product_name,
            this.description,
            this.product_status,
            this.price_per_piece,
            this.stock_quantity,
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
                        this.router.navigate(['/setting/all']);
                    });
                } else {
                    window.alert('No data received.'); // หรือทำการจัดการตามที่คุณต้องการ
                }
            },
            error: err => {
                window.alert(err.error.message);
                this.errorMessage = err.error.message;
            }
        });
    }

    reloadPage(): void {
        // window.location.reload();
        this.router.navigate(['/all']);
    }
}

