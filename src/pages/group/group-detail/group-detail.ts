import { Storage } from '@ionic/storage';
import { ProfilePage } from './../../profile/profile';
import { GroupInvitationPage } from './../group-invitation/group-invitation';
import { GroupChangeAdminModalPage } from './../group-change-admin-modal/group-change-admin-modal';
import { GroupProvider } from './../../../providers/group';
import { Component } from '@angular/core';
import { AlertController, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-group-detail',
  templateUrl: 'group-detail.html',
})
export class GroupDetailPage {
  public group: IGroup;
  public groupUsers: IUserMainInfo[];
  public joinRequestUsers: IUserMainInfo[] = [];
  public currentUser: IUser;
  public superAdminUser: IUserMainInfo;
  public currentUserId = '';
  public isCurrentUserSuperAdmin = false;
  public isCurrentUserMemberOfGroup = false;
  public areGroupUsersLoaded = false;
  public hasCurrentUserAlreadyMadeJoinRequest = false;

  private isRemovingCurrentUserFromGroup = false;

  constructor(
    private NavController: NavController, 
    private NavParams: NavParams,
    private GroupProvider: GroupProvider,
    private AlertController: AlertController,
    private ModalController: ModalController,
    private ToastController: ToastController,
    private Storage: Storage
  ) {
    this.group = this.NavParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupDetailPage');
  }

  ngOnInit(): void {
    this.GroupProvider.getGroupUsers(this.group.id).subscribe(groupUsers => {
      this.groupUsers = groupUsers;
      
      this.Storage.get('currentUserId').then(currentUserId => {
        this.currentUserId = currentUserId;
        this.isCurrentUserMemberOfGroup = !!this.groupUsers.find(groupUser => groupUser.id === this.currentUserId);
        this.isCurrentUserSuperAdmin = this.isCurrentUserMemberOfGroup ? this.currentUserId === this.group.superAdmin : false;
        this.superAdminUser = this.groupUsers.find(groupUser => groupUser.id === this.group.superAdmin);
        
        this.areGroupUsersLoaded = true;
  
        this.GroupProvider.getGroupJoinRequestsUsers(this.group.id).subscribe(joinRequestsUsers => {
          this.joinRequestUsers = joinRequestsUsers;
          this.hasCurrentUserAlreadyMadeJoinRequest = !!this.isCurrentUserMemberOfGroup ? false : !!this.joinRequestUsers.find(joinRequestsUser => joinRequestsUser.id === this.currentUserId);
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
        this.group.superAdmin = newAdminId;
        this.isCurrentUserSuperAdmin = this.currentUserId=== this.group.superAdmin;
        if (this.isRemovingCurrentUserFromGroup) {
          this.GroupProvider.removeMemberFromGroup(this.currentUserId, this.group.id);
        }
      }
    });
  }

  public sendGroupJoinRequest(): void {
    this.hasCurrentUserAlreadyMadeJoinRequest = true;
    if (!this.isCurrentUserMemberOfGroup) {
      this.GroupProvider.createNewGroupJoinRequest(this.group.id, this.currentUserId)
    }
  }

  public acceptJoinRequest(userId: string, userFirstname: string, userLastname: string): void {
    this.joinRequestUsers = this.joinRequestUsers.filter(joinRequestUser => joinRequestUser.id !== userId);
    this.GroupProvider.removeGroupJoinRequest(this.group.id, userId);
    this.GroupProvider.addUserToGroup(userId, this.group.id).then(() => {
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

}
