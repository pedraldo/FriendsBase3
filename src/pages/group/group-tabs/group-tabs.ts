import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-tabs',
  templateUrl: 'group-tabs.html'
})
export class GroupTabsPage {
  
  public groupsTabRoot = 'GroupsTabPage';
  public groupRequestsTabRoot = 'GroupRequestsTabPage';
  public groupSearchTabRoot = 'GroupSearchTabPage'


  constructor(
    public navCtrl: NavController
  ) {
  }

}
