import { ProfilePage } from './../pages/profile/profile';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

// AngularFire2 Modules
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Pages
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AuthHomePage } from './../pages/authentication/auth-home/auth-home';
import { SignUpPage } from './../pages/authentication/sign-up/sign-up';
import { LoginEmailPage } from './../pages/authentication/login-email/login-email';
import { ForgotPasswordPage } from '../pages/authentication/forgot-password/forgot-password';
import { GroupListPage } from './../pages/group/group-list/group-list';
import { GroupCreationModalPage } from './../pages/group/group-creation-modal/group-creation-modal';
import { GroupDetailPage } from './../pages/group/group-detail/group-detail';
import { GroupSearchPage } from './../pages/group/group-search/group-search';
import { GroupChangeAdminModalPage } from './../pages/group/group-change-admin-modal/group-change-admin-modal';
import { GroupInvitationPage } from '../pages/group/group-invitation/group-invitation';

// Providers
import { AuthenticationProvider } from '../providers/authentication';
import { DataProvider } from '../providers/data';
import { GroupProvider } from '../providers/group';
import { RelationshipProvider } from './../providers/relationship';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook } from '@ionic-native/facebook';

// AngularFire2 Settings
export const firebaseConfig = {
  apiKey: 'AIzaSyDUNhm1qZ_dSXlA0-TO7rkWQCX6m86XRzM',
  authDomain: 'friendsbase-e0427.firebaseapp.com',
  databaseURL: 'https://friendsbase-e0427.firebaseio.com',
  storageBucket: 'friendsbase-e0427.appspot.com',
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    AuthHomePage,
    SignUpPage,
    LoginEmailPage,
    ForgotPasswordPage,
    GroupListPage,
    GroupCreationModalPage,
    GroupDetailPage,
    GroupSearchPage,
    GroupChangeAdminModalPage,
    GroupInvitationPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    AuthHomePage,
    SignUpPage,
    LoginEmailPage,
    ForgotPasswordPage,
    GroupListPage,
    GroupCreationModalPage,
    GroupDetailPage,
    GroupSearchPage,
    GroupChangeAdminModalPage,
    GroupInvitationPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    DataProvider,
    AuthenticationProvider,
    GroupProvider,
    RelationshipProvider
  ]
})
export class AppModule {}
