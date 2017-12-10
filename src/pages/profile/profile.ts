import { GroupDetailPage } from './../group/group-detail/group-detail';
import { Observable } from 'rxjs/Observable';
import { GroupProvider } from '../../providers/group';
import { AuthenticationProvider } from './../../providers/authentication';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public user: IUser;
  public userId: string;
  public currentUserId: string;
  public photoUrl: string;
  public userGroups: IGroup[] = [];
  // public userRelationships: IRelationObject;
  // public userRelationshipsData: any[];
  public isCurrentUserProfile: boolean;
  // public isCurrentUserRelationship: boolean;

  constructor(
    private NavController: NavController, 
    private NavParams: NavParams,
    private AuthenticationProvider: AuthenticationProvider,
    private GroupProvider: GroupProvider,
    private Storage: Storage
  ) {
    this.userId = this.NavParams.data[0];
    this.isCurrentUserProfile = this.NavParams.data[1];
    if (this.isCurrentUserProfile) {
        this.currentUserId = this.userId;
    }
    // this.isCurrentUserRelationship = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ngOnInit(): void {
    this.AuthenticationProvider.getUserData(this.userId).subscribe(userData => {
      let obsvArray: Observable<IGroup>[] = [];
      this.user = userData;

      _.forEach(this.user.groups, (value, key) => {
          obsvArray.push(this.GroupProvider.getGroupData(value));
      });
      Observable.forkJoin(obsvArray).subscribe(userGroups => {
          this.userGroups = userGroups;
      });

      if (this.user.provider === "facebook") {
        this.Storage.get('deviceSize').then(deviceSize => {
          this.photoUrl = this.AuthenticationProvider.getFacebookUserPhotoURL(this.user.facebookId, deviceSize.width, null);
        }) 
      } else {
        this.photoUrl = this.user.image;
      }

    });
  }

  public openGroupPage(group: IGroup): void {
    this.NavController.push(GroupDetailPage, group);
  }

}
