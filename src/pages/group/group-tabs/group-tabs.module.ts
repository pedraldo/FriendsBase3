import { GroupRequestsTabPageModule } from './../group-requests-tab/group-requests-tab.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupTabsPage } from './group-tabs';
import { GroupsTabPageModule } from '../groups-tab/groups-tab.module';
import { GroupSearchTabPageModule } from '../group-search-tab/group-search-tab.module';

@NgModule({
  declarations: [
    GroupTabsPage,
  ],
  imports: [
    GroupsTabPageModule,
    GroupRequestsTabPageModule,
    GroupSearchTabPageModule,
    IonicPageModule.forChild(GroupTabsPage),
  ]
})
export class GroupTabsPageModule {}
