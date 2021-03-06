import { AuthenticationProvider } from './../../../providers/authentication';
import { GroupProvider } from './../../../providers/group';
import { Component } from '@angular/core';
import { NavParams, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-invitation',
  templateUrl: 'group-invitation.html',
})
export class GroupInvitationPage {
  public group: IGroup;
  public memberFound: IUser;
  public emailSearched: string;
  public isMemberSearched = false;
  public isMemberFound = false;
  public isMemberAdded = false;
  public isSearchInProgress = false;
  public isAddingInProgress = false;

  constructor(
    private NavParams: NavParams,
    private GroupProvider: GroupProvider,
    private AuthenticationProvider: AuthenticationProvider
  ) {
    this.group = this.NavParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupInvitationPage');
  }

  public getUserByEmail(): void {
    this.isMemberSearched = true;
    this.isSearchInProgress = true;
    this.AuthenticationProvider.getUserByEmail(this.emailSearched).subscribe(userFound => {
      this.memberFound = userFound;
      this.isMemberFound = !!this.memberFound;

      if (this.isMemberFound) {
        this.isMemberAdded = userFound.groups !== undefined && !!userFound.groups[this.group.id];
      }
      this.isSearchInProgress = false;
    });
  }

  public addUserToCurrentGroup() {
    const groupMainInfo: IGroupMainInfo = {
      id: this.group.id,
      name: this.group.name,
      superAdmin: {
        id: this.group.superAdminId,
        name: this.memberFound.name
      }
    };
    this.isAddingInProgress = true;
    this.GroupProvider.addUserToGroup(this.memberFound.id, groupMainInfo).then(() => {
      this.isMemberAdded = true;
      this.isAddingInProgress = false;
    });
  }

}
