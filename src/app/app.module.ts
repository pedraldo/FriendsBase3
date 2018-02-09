import { RelationshipTabsPage } from './../pages/relationship/relationship-tabs/relationship-tabs';
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
// import { GroupListPage } from './../pages/group/group-list/group-list';
import { GroupCreationModalPage } from './../pages/group/group-creation-modal/group-creation-modal';
import { GroupDetailPage } from './../pages/group/group-detail/group-detail';
import { GroupChangeAdminModalPage } from './../pages/group/group-change-admin-modal/group-change-admin-modal';
import { GroupInvitationPage } from '../pages/group/group-invitation/group-invitation';
import { ProfilePage } from './../pages/profile/profile';
import { FollowersTabPage } from './../pages/relationship/followers-tab/followers-tab';
import { FollowedTabPage } from './../pages/relationship/followed-tab/followed-tab';
import { SearchPeopleTabPage } from './../pages/relationship/search-people-tab/search-people-tab';


import { GroupTabsPageModule } from '../pages/group/group-tabs/group-tabs.module';

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
    GroupCreationModalPage,
    GroupDetailPage,
    GroupChangeAdminModalPage,
    GroupInvitationPage,
    ProfilePage,
    FollowedTabPage,
    FollowersTabPage,
    SearchPeopleTabPage,
    RelationshipTabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    GroupTabsPageModule
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
    GroupCreationModalPage,
    GroupDetailPage,
    GroupChangeAdminModalPage,
    GroupInvitationPage,
    ProfilePage,
    RelationshipTabsPage,
    FollowedTabPage,
    FollowersTabPage,
    SearchPeopleTabPage
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
