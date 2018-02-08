import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the GroupTabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-group-tabs',
  templateUrl: 'group-tabs.html'
})
export class GroupTabsPage {
  
  groupsTabRoot = 'GroupsTabPage'
  groupRequestsTabRoot = 'GroupRequestsTabPage'
  groupInvitationsTabRoot = 'GroupInvitationsTabPage'


  constructor(
    public navCtrl: NavController
  ) {
  }

}
