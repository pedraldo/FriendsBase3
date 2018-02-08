import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupTabsPage } from './group-tabs';

@NgModule({
  declarations: [
    GroupTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupTabsPage),
  ]
})
export class GroupTabsPageModule {}
