import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupRequestsTabPage } from './group-requests-tab';

@NgModule({
  declarations: [
    GroupRequestsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupRequestsTabPage),
  ],
})
export class GroupRequestsTabPageModule {}
