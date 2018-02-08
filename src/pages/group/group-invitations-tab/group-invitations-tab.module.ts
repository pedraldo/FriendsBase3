import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupInvitationsTabPage } from './group-invitations-tab';

@NgModule({
  declarations: [
    GroupInvitationsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupInvitationsTabPage),
  ],
})
export class GroupInvitationsTabPageModule {}
