import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupCreationModalPage } from './group-creation-modal';

@NgModule({
  declarations: [
    GroupCreationModalPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupCreationModalPage),
  ],
})
export class GroupCreationModalPageModule {}
