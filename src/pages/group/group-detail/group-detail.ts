import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Storage } from '@ionic/storage';
import { ProfilePage } from './../../profile/profile';
import { GroupInvitationPage } from './../group-invitation/group-invitation';
import { GroupChangeAdminModalPage } from './../group-change-admin-modal/group-change-admin-modal';
import { GroupProvider } from './../../../providers/group';
import { Component } from '@angular/core';
import { AlertController, ModalController, NavController, NavParams, ToastController, Loading } from 'ionic-angular';

@Component({
  selector: 'page-group-detail',
  templateUrl: 'group-detail.html',
})
export class GroupDetailPage {
  public group: IGroup;
  public groupUsers: IUserMainInfo[];
  public joinRequestUsers: IUserMainInfo[] = [];
  public currentUserMainInfo: IUserMainInfo;
  public superAdminUser: IUserMainInfo;
  public currentUserId = '';
  public isCurrentUserSuperAdmin = false;
  public isCurrentUserMemberOfGroup = false;
  public areGroupUsersLoaded = false;
  public hasCurrentUserAlreadyMadeJoinRequest = false;
  public allGroupDataHasBeenCharged = false;
  public loader: Loading;
  
  private isRemovingCurrentUserFromGroup = false;
  private groupId: string;

  constructor(
    private NavController: NavController, 
    private NavParams: NavParams,
    private GroupProvider: GroupProvider,
    private AlertController: AlertController,
    private ModalController: ModalController,
    private ToastController: ToastController,
    private LoadingController: LoadingController,
    private Storage: Storage
  ) {
    this.loader = this.LoadingController.create({
      spinner: 'crescent'
    });
    this.loader.present();
    this.groupId = this.NavParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupDetailPage');
  }

  ngOnInit(): void {
    this.GroupProvider.getGroupData(this.groupId).subscribe(groupData => {
      this.group = groupData;
      this.groupUsers = Object.values(this.group.users); // tslint:disable-line
      
      this.Storage.get('currentUserData').then(currentUserData => {
        this.currentUserMainInfo = JSON.parse(currentUserData);
        this.currentUserId = this.currentUserMainInfo.id;
        this.isCurrentUserMemberOfGroup = !!this.groupUsers.find(groupUser => groupUser.id === this.currentUserId);
        this.isCurrentUserSuperAdmin = this.isCurrentUserMemberOfGroup ? this.currentUserId === this.group.superAdminId : false;
        this.superAdminUser = this.groupUsers.find(groupUser => groupUser.id === this.group.superAdminId);
        this.areGroupUsersLoaded = true;
  
        this.GroupProvider.getGroupJoinRequestsUsers(this.group.id).subscribe(joinRequestsUsers => {
          this.joinRequestUsers = joinRequestsUsers;
          this.hasCurrentUserAlreadyMadeJoinRequest = !!this.isCurrentUserMemberOfGroup ? false : !!this.joinRequestUsers.find(joinRequestsUser => joinRequestsUser.id === this.currentUserId);
          this.allGroupDataHasBeenCharged = true;
          this.loader.dismiss();
        });
      });
    });
  }

  public openGroupInvitationPage(group: IGroup): void {
    this.NavController.push(GroupInvitationPage, group);
  }

  public openProfilePage(userId: string): void {
    this.NavController.push(ProfilePage, [userId, userId === this.currentUserId]);
  }

  public removeMemberFromCurrentGroup(user: IUserMainInfo, group: IGroup) {
    this.AlertController.create({
      title: 'Supprimer un membre du groupe ?',
      message: `Etes vous sûr de vouloir retirer ${user.firstname} ${user.lastname} du groupe ${group.name} ?`,
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.GroupProvider.removeMemberFromGroup(user.id, group.id);
          }
        },
        {
          text: 'Non',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public leaveGroup(): void {
    let messageComplement = '';
    if (this.isCurrentUserSuperAdmin && this.groupUsers.length > 1) {
      messageComplement = "Vous êtes l'administrateur de ce groupe, si vous décidez de le quitter, vous devrez désigner un nouvel administrateur parmis les membres du groupe.";
    }
    this.AlertController.create({
      title: 'Quitter le groupe  ?',
      message: `Etes vous sûr de vouloir quitter le groupe ${this.group.name} ? ${messageComplement}`,
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            if (messageComplement.length > 0) {
              this.isRemovingCurrentUserFromGroup = true;
              this.changeGroupSuperAdmin();
            } else {
              this.GroupProvider.removeMemberFromGroup(this.currentUserId, this.group.id);
            }
          }
        },
        {
          text: 'Non',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public changeGroupSuperAdmin(): void {
    let modal = this.ModalController.create(GroupChangeAdminModalPage, { group: this.group, groupUsers: this.groupUsers });
    modal.present();
    modal.onDidDismiss(newAdminId => {
      if (!!newAdminId) {
        this.group.superAdminId = newAdminId;
        this.isCurrentUserSuperAdmin = this.currentUserId === this.group.superAdminId;
        if (this.isRemovingCurrentUserFromGroup) {
          this.GroupProvider.removeMemberFromGroup(this.currentUserId, this.group.id);
        }
      }
    });
  }

  public sendGroupJoinRequest(): void {
    this.hasCurrentUserAlreadyMadeJoinRequest = true;
    if (!this.isCurrentUserMemberOfGroup) {
      this.GroupProvider.createNewGroupJoinRequest(this.group.profile, this.currentUserMainInfo);
    }
  }

  public acceptJoinRequest(userId: string, userFirstname: string, userLastname: string): void {
    const groupMainInfo: IGroupMainInfo = {
      id: this.group.id,
      name: this.group.name,
      superAdmin: {
        id: this.group.superAdminId,
        name: `${userFirstname} ${userLastname}`
      }
    };
    this.joinRequestUsers = this.joinRequestUsers.filter(joinRequestUser => joinRequestUser.id !== userId);
    this.GroupProvider.removeGroupJoinRequest(this.group.id, userId);
    this.GroupProvider.addUserToGroup(userId, groupMainInfo).then(() => {
      let toast = this.ToastController.create({
        message: `${userFirstname} ${userLastname} vient d'être ajouté au groupe ${this.group.name}.`,
        duration: 4000
      });
      toast.present();
    });
  }

  public refuseJoinRequest(userId: string, userFirstname: string, userLastname: string): void {
    this.joinRequestUsers = this.joinRequestUsers.filter(joinRequestUser => joinRequestUser.id !== userId);
    this.GroupProvider.removeGroupJoinRequest(this.group.id, userId);
    let toast = this.ToastController.create({
      message: `La demande d'intégration de ${userFirstname} ${userLastname} au groupe ${this.group.name} vient d'être refusée.`,
      duration: 4000
    });
    toast.present();
  }

  public removeGroup(): void {
    this.AlertController.create({
      title: 'Supprimer le groupe  ?',
      message: `Etes vous sûr de vouloir supprimer le groupe ${this.group.name} ?`,
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.GroupProvider.removeGroup(this.group.id).then(() => {
              this.NavController.pop();
            });
          }
        },
        {
          text: 'Non',
          role: 'cancel'
        }
      ]
    }).present();
  }
}
