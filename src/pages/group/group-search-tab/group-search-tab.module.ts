import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupSearchTabPage } from './group-search-tab';

@NgModule({
  declarations: [
    GroupSearchTabPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupSearchTabPage),
  ],
})
export class GroupSearchTabPageModule {}
