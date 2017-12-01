import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthHomePage } from './../pages/authentication/auth-home/auth-home';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { DataProvider } from './../providers/data';
import { AuthenticationProvider } from './../providers/authentication';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public isAppInitialized: boolean = false;
  public user: IPersistedUser;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    protected DataProvider: DataProvider,
    protected AuthenticationProvider: AuthenticationProvider
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.AuthenticationProvider.getCurrentUserData().subscribe(user => {
        if (!this.isAppInitialized) {
          this.nav.setRoot(HomePage);
          this.isAppInitialized = true;
        }
        this.user = user;
      }, error => {
        this.nav.setRoot(AuthHomePage);
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  // public openGroupsPage(): void {
  //   this.nav.setRoot(GroupListPage);
  // }

  // public openListsPage(): void {
  //   this.Storage.get('currentUserId').then(currentUserId => this.nav.setRoot(ListListPage, [currentUserId, true]));
  // }

  // public openProfilePage(): void {
  //   this.Storage.get('currentUserId').then(currentUserId => this.nav.setRoot(ProfilePage, [currentUserId, true]));
  // }

  // public openRelationshipsPage(): void {
  //   this.Storage.get('currentUserId').then(currentUserId => this.nav.setRoot(RelationshipPage, [currentUserId, true]));
  // }

  public logout(): void {
  	this.AuthenticationProvider.logout();
    this.nav.setRoot(AuthHomePage);
  }
}
