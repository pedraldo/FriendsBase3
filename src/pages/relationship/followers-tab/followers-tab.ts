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
  public filteredFollowerUsers: IUserMainInfo[];

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
      if (!!followerUsers) {
        let obsvArray: Observable<IUserMainInfo>[] = [];
        _.forEach(followerUsers, (value, key) => {
          obsvArray.push(this.AuthenticationProvider.getUserMainInformations(value.id));
        });
        Observable.forkJoin(obsvArray).subscribe(followerUsersData => {
          this.followerUsers = followerUsersData;
          this.filteredFollowerUsers = this.followerUsers;
        });
      } else {
        this.followerUsers = [];
        this.filteredFollowerUsers = [];
      }
    });
  }

  public getItems(event: any) {
    let val = event.target.value;

    if (val && val.trim() != '' && val.length > 0) {
      this.filteredFollowerUsers = this.followerUsers.filter((followerUser: IUserMainInfo) => {
        let name = `${followerUser.firstname.toLowerCase()} ${followerUser.lastname.toLowerCase()}`;
        return (name.indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.filteredFollowerUsers = this.followerUsers;
    }
  }

  public openProfilePage(userId: string): void {
    this.NavController.push(ProfilePage, [userId, userId === this.currentUserId]);
  }
}
