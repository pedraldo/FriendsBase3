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
  public followedUsers: IUser[];

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
      let obsvArray: Observable<IUser>[] = [];
      _.forEach(followedUsers, (value, key) => {
        obsvArray.push(this.AuthenticationProvider.getUserData(key));
      });
      Observable.forkJoin(obsvArray).subscribe(followedUsersData => {
        this.followedUsers = followedUsersData;
      });
    });
  }

  public openProfilePage(userId: string): void {
    this.NavController.push(ProfilePage, [userId, userId === this.currentUserId]);
  }

}
