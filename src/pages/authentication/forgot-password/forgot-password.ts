import { AuthenticationProvider } from './../../../providers/authentication';
import { Component } from '@angular/core';
import { ToastController, LoadingController } from 'ionic-angular';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  public error: any;
  public form: any;

  constructor(
    private LoadingController: LoadingController,
    private AuthenticationProvider: AuthenticationProvider,
    private ToastController: ToastController
  ) {
    this.form = {
      email: ''
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  public reset(): void {
    let loading = this.LoadingController.create({
      content: 'Chargement ...'
    });
    loading.present();

    this.AuthenticationProvider.sendPasswordResetEmail(this.form.email).subscribe(data => {
      this.error = 'Vous allez bientôt recevoir un email pour changer de mot de passe';
      loading.dismiss();
    }, error => {
      this.error = error;
      loading.dismiss();

      this.ToastController.create({
        message: this.error,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "OK"
      }).present();
    });
  }

}
