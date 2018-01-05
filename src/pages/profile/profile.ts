import { RelationshipProvider } from './../../providers/relationship';
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
  public userRelationships: IRelationObject;
  public userRelationshipsData: IUserMainInfo[];
  public isCurrentUserProfile: boolean;
  public isCurrentUserRelationship: boolean;

  constructor(
    private NavController: NavController,
    private NavParams: NavParams,
    private AuthenticationProvider: AuthenticationProvider,
    private RelationshipProvider: RelationshipProvider,
    private GroupProvider: GroupProvider,
    private Storage: Storage
  ) {
    this.userId = this.NavParams.data[0];
    this.isCurrentUserProfile = this.NavParams.data[1];
    if (this.isCurrentUserProfile) {
      this.currentUserId = this.userId;
    }
    this.isCurrentUserRelationship = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  ngOnInit(): void {
    this.AuthenticationProvider.getUserData(this.userId).subscribe(userData => {
      let obsvArray: Observable<IGroup>[] = [];
      this.user = userData;

      _.forEach(this.user.groups, (value, key) => {
        obsvArray.push(this.GroupProvider.getGroupData(value.id));
      });
      if (obsvArray.length) {
        Observable.forkJoin(obsvArray).subscribe(userGroups => {
          this.userGroups = userGroups;
        });
      }

      if (this.user.provider === "facebook") {
        this.Storage.get('deviceSize').then(deviceSize => {
          this.photoUrl = this.AuthenticationProvider.getFacebookUserPhotoURL(this.user.facebookId, deviceSize.width, null);
        });
      } else {
        this.photoUrl = `${this.user.profile.image}&size=256`;
      }

      this.RelationshipProvider.getUserRelationships(this.userId).subscribe(userRelationships => {
        if (this.isCurrentUserProfile && !!userRelationships) {
          let obsvArray: Observable<IUserMainInfo>[] = [];
          _.forEach(userRelationships.followed, (value, key) => {
            obsvArray.push(this.AuthenticationProvider.getUserMainInformations(value.id));
          });
          if (obsvArray.length) {
            Observable.forkJoin(obsvArray).subscribe(userRelationshipsData => {
              this.userRelationshipsData = userRelationshipsData;
            });
          }
        } else {
          this.Storage.get('currentUserId').then(currentUserId => {
            this.currentUserId = currentUserId;
            this.RelationshipProvider.isUser1FollowerOfUser2(this.currentUserId, this.user.id).subscribe(isCurrentUserRelationship => {
              this.isCurrentUserRelationship = isCurrentUserRelationship;
            })
          });
        }
      });
    });
  }

  public openGroupPage(group: IGroup): void {
    this.NavController.push(GroupDetailPage, group);
  }

  public addUserToRelationships(userId: string): Promise<void> {
    return this.RelationshipProvider.addUser1InUser2Relationships(userId, this.currentUserId).then(() => {
      this.isCurrentUserRelationship = true
    });
  }

  public removeUserFromRelationships(userId: string): Promise<void[]> {
    this.isCurrentUserRelationship = false;
    return this.RelationshipProvider.removeUser1FromUser2Realtionships(userId, this.currentUserId);  
  }

}
