import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RelationshipTabsPage } from './relationship-tabs';

@NgModule({
  declarations: [
    RelationshipTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(RelationshipTabsPage),
  ]
})
export class RelationshipTabsPageModule {}
