import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupsTabPage } from './groups-tab';

@NgModule({
  declarations: [
    GroupsTabPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupsTabPage),
  ],
})
export class GroupsTabPageModule {}
