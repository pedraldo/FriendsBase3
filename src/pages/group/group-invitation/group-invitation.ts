import { AuthenticationProvider } from './../../../providers/authentication';
import { GroupProvider } from './../../../providers/group';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

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
    debugger;
    this.AuthenticationProvider.getUserByEmail(this.emailSearched).subscribe(userFound => {
      debugger;
      this.memberFound = userFound;
      this.isMemberFound = !!this.memberFound;

      if (this.isMemberFound) {
        this.isMemberAdded = !!this.group.users[this.memberFound.id];
      }
      this.isSearchInProgress = false;
    });
  }

  public addUserToCurrentGroup(user: IUser) {
    this.isAddingInProgress = true;
    this.GroupProvider.addUserToGroup(user.id, this.group.id).then(() => {
      this.isMemberAdded = true;
      this.isAddingInProgress = false;
    });
  }

}
