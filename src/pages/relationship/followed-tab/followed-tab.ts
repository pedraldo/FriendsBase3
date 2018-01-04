import { Observable } from 'rxjs/Rx';
import { ProfilePage } from '../../profile/profile';
import { AuthenticationProvider } from './../../../providers/authentication';
import { RelationshipProvider } from './../../../providers/relationship';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

/**
 * Generated class for the FollowedTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-followed-tab',
  templateUrl: 'followed-tab.html',
})
export class FollowedTabPage {
  private userId: string;
  private currentUserId: string;
  public isCurrentUserProfile: boolean;
  public followedUsers: IUserMainInfo[];
  public filteredFollowedUsers: IUserMainInfo[];

  constructor(
    private NavController: NavController, 
    private NavParams: NavParams,
    private RelationshipProvider: RelationshipProvider,
    private AuthenticationProvider: AuthenticationProvider
  ) {
    this.userId = this.NavParams.data[0];
    this.isCurrentUserProfile = this.NavParams.data[1];
    this.currentUserId = this.isCurrentUserProfile ? this.userId : '';
    this.followedUsers = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowedTabPage');
  }

  ngOnInit(): void {
    this.RelationshipProvider.getUserRelationshipsFollowed(this.userId).subscribe(followedUsers => {
      if (!!followedUsers) {
        let obsvArray: Observable<IUserMainInfo>[] = [];
        _.forEach(followedUsers, (value, key) => {
          obsvArray.push(this.AuthenticationProvider.getUserMainInformations(value.id));
        });
        Observable.forkJoin(obsvArray).subscribe(followedUsersData => {
          this.followedUsers = followedUsersData;
          this.filteredFollowedUsers = this.followedUsers;
        });
      } else {
        this.followedUsers = [];
        this.filteredFollowedUsers = [];
      }
    });
  }

  public getItems(event: any) {
    let val = event.target.value;

    if (val && val.trim() != '' && val.length > 0) {
      this.filteredFollowedUsers = this.followedUsers.filter((followedUser: IUserMainInfo) => {
        let name = `${followedUser.firstname.toLowerCase()} ${followedUser.lastname.toLowerCase()}`;
        return (name.indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.filteredFollowedUsers = this.followedUsers;
    }
  }

  public unfollowUser(userId: string): void {
    if (!!this.currentUserId) {
      this.RelationshipProvider.removeUser1FromUser2Realtionships(userId, this.currentUserId);
    }
  }

  public openProfilePage(userId: string): void {
    this.NavController.push(ProfilePage, [userId, userId === this.currentUserId]);
  }

}
