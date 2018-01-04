import { ProfilePage } from './../../profile/profile';
import { AuthenticationProvider } from '../../../providers/authentication';
import { Observable } from 'rxjs/Rx';
import { RelationshipProvider } from '../../../providers/relationship';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';

@Component({
  selector: 'page-followers-tab',
  templateUrl: 'followers-tab.html',
})
export class FollowersTabPage {
  private userId: string;
  private currentUserId: string;
  public isCurrentUserProfile: boolean;
  public followerUsers: IUserMainInfo[];

  constructor(
    private NavController: NavController, 
    private NavParams: NavParams,
    private RelationshipProvider: RelationshipProvider,
    private AuthenticationProvider: AuthenticationProvider
  ) {
    this.userId = this.NavParams.data[0];
    this.isCurrentUserProfile = this.NavParams.data[1];
    this.currentUserId = this.isCurrentUserProfile ? this.userId : '';
    this.followerUsers = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FollowersTabPage');
  }

  ngOnInit(): void {
    this.RelationshipProvider.getUserRelationshipsFollowers(this.userId).subscribe(followerUsers => {
      let obsvArray: Observable<IUserMainInfo>[] = [];
      _.forEach(followerUsers, (value, key) => {
        obsvArray.push(this.AuthenticationProvider.getUserMainInformations(value.id));
      });
      Observable.forkJoin(obsvArray).subscribe(followerUsersData => {
        this.followerUsers = followerUsersData;
      });
    });
  }

  public openProfilePage(userId: string): void {
    this.NavController.push(ProfilePage, [userId, userId === this.currentUserId]);
  }
}
