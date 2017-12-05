import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupChangeAdminModalPage } from './group-change-admin-modal';

@NgModule({
  declarations: [
    GroupChangeAdminModalPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupChangeAdminModalPage),
  ],
})
export class GroupChangeAdminModalPageModule {}
