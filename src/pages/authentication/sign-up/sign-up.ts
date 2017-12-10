import { LoginEmailPage } from './../login-email/login-email';
import { HomePage } from './../../home/home';
import { AuthenticationProvider } from './../../../providers/authentication';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  public error: any;
  public form: any;

  constructor(
    private NavController: NavController, 
    private AuthenticationProvider: AuthenticationProvider,
    private LoadingController: LoadingController,
    private ToastController: ToastController
  ) {
    this.form = {
      email: '',
      password: ''
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  public openLoginPage(): void {
    this.NavController.push(LoginEmailPage);
  }

  public register(): void {
    let loading = this.LoadingController.create({
      content: 'Chargement ...'
    });
    this.AuthenticationProvider.registerUser(this.form.email, this.form.password).subscribe(registerData => {
      this.AuthenticationProvider.loginWithEmail(registerData.email, registerData.password).subscribe(loginData => {
        loading.dismiss();
        this.NavController.setRoot(HomePage);
      }, loginError => {
        loading.dismiss();
        this.error = loginError;
      });
    }, registerError => {
      loading.dismiss();
      this.error = registerError;
      this.ToastController.create({
        message: this.error,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "OK"
      }).present();
    })
  }

}
