import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupInvitationPage } from './group-invitation';

@NgModule({
  declarations: [
    GroupInvitationPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupInvitationPage),
  ],
})
export class GroupInvitationPageModule {}
