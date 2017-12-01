import { LoginEmailPage } from './../login-email/login-email';
import { HomePage } from './../../home/home';
import { SignUpPage } from './../sign-up/sign-up';
import { AuthenticationProvider } from './../../../providers/authentication';
import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-auth-home',
  templateUrl: 'auth-home.html',
})
export class AuthHomePage {
  private error: any;

  constructor(
    private NavController: NavController,
    private AuthenticationProvider: AuthenticationProvider,
    private ToastController: ToastController,
    private Storage: Storage
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthHomePage');
  }

  public openSignUpPage(): void {
    this.NavController.push(SignUpPage);
  }

  public openLoginPage(): void {
    this.NavController.push(LoginEmailPage);
  }

  public loginUserWithFacebook(): void {
    this.AuthenticationProvider.loginWithFacebook().subscribe(data => {
      this.Storage.set('currentUserId', data.uid);
      this.NavController.setRoot(HomePage);
    }, error => {
      this.error = error;

      this.ToastController.create({
        message: this.error,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "OK"
      }).present();
    })
  }
}
