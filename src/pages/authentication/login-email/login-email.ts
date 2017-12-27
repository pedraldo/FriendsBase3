import { ForgotPasswordPage } from './../forgot-password/forgot-password';
import { SignUpPage } from './../sign-up/sign-up';
import { AuthenticationProvider } from './../../../providers/authentication';
import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../../home/home';

/**
 * Generated class for the LoginEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login-email',
  templateUrl: 'login-email.html',
})
export class LoginEmailPage {
  public error: any;
  public form: any;

  constructor(
    private NavController: NavController,
    private AuthenticationProvider: AuthenticationProvider,
    private LoadingController: LoadingController,
    private ToastController: ToastController,
    private Storage: Storage
  ) {
    this.form = {
      email: '',
      password: ''
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginEmailPage');
  }

  public openForgotPasswordPage(): void {
    this.NavController.push(ForgotPasswordPage);
  }

  public openSignUpPage(): void {
    this.NavController.push(SignUpPage);
  }

  public login(): void {
    let loading = this.LoadingController.create({
      content: 'Chargement ...'
    });
    loading.present();

    this.AuthenticationProvider.loginWithEmail(this.form.email, this.form.password).subscribe(data => {
      loading.dismiss();
      this.NavController.setRoot(HomePage);
    }, error => {
      loading.dismiss();
      this.error = error;
      this.ToastController.create({
        message: this.error,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "OK"
      }).present();
    });
  }

}
