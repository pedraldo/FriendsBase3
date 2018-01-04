import { RelationshipProvider } from './../../../providers/relationship';
import { ProfilePage } from './../../profile/profile';
import { Component } from '@angular/core';
import { AuthenticationProvider } from './../../../providers/authentication';
import { NavParams, NavController } from 'ionic-angular';

/**
 * Generated class for the SearchPeopleTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-people-tab',
  templateUrl: 'search-people-tab.html',
})
export class SearchPeopleTabPage {
  public group: IGroup;
  public personFound: IUser;
  public emailSearched: string;
  public currentUserId: string;
  public isPersonSearched = false;
  public isPersonFound = false;
  public isSearchInProgress = false;
  public isAddingInProgress = false;
  public isPersonFollowed = false;

  constructor(
    private NavParams: NavParams,
    private NavController: NavController,
    private AuthenticationProvider: AuthenticationProvider,
    private RelationshipProvider: RelationshipProvider
  ) {
    this.currentUserId = this.NavParams.data[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPeopleTabPage');
  }

  public getUserByEmail(): void {
    this.isPersonFound = false;
    this.isPersonFollowed = false;
    this.isPersonSearched = true;
    this.isSearchInProgress = true;
    this.AuthenticationProvider.getUserByEmail(this.emailSearched).subscribe(userFound => {
      this.personFound = userFound;
      this.isPersonFound = !!this.personFound;

      if (this.isPersonFound) {
        if (this.personFound.relationships && this.personFound.relationships.followers) {
          for (let id in this.personFound.relationships.followers) {
            this.isPersonFollowed = id === this.currentUserId;
            if (this.isPersonFollowed) break;
          }
        } else {
          this.isPersonFollowed = false;
        }
      }
      this.isSearchInProgress = false;
    });
  }

  public followUser(userId: string): void {
    this.RelationshipProvider.addUser1InUser2Relationships(userId, this.currentUserId).then(() => {
      this.isPersonFollowed = true;
    });
  }
  
  public unfollowUser(userId: string): void {
    this.RelationshipProvider.removeUser1FromUser2Realtionships(userId, this.currentUserId).then(() => {
      this.isPersonFollowed = false;
    });
  }

  public openProfilePage(userId: string): void {
    this.NavController.push(ProfilePage, [userId, false]);
  }
}
