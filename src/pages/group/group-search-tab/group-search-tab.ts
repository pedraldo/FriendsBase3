import { GroupDetailPage } from './../group-detail/group-detail';
import { GroupProvider } from './../../../providers/group';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-searc-tab',
  templateUrl: 'group-search-tab.html',
})
export class GroupSearchTabPage {
  public currentUserId: string;
  public groupSearched: IGroup;
  public groupNameSearched: string;
  public foundGroups: IGroup[] = [];
  public isGroupSearched: boolean = false;
  public isGroupFound: boolean = false;
  public isSearchInProgress: boolean = false;

  constructor(
    private NavController: NavController, 
    private NavParams: NavParams,
    private GroupProvider: GroupProvider
  ) {
    this.currentUserId = this.NavParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupSearchTabPage');
  }

  public getGroupByName(groupName: string): void {
    this.isGroupSearched = true;
    this.isSearchInProgress = true;

    this.GroupProvider.getGroupsByName(this.groupNameSearched).subscribe(foundGroups => {
      this.foundGroups = foundGroups;
      this.isGroupFound = !!this.foundGroups.length;
      this.isSearchInProgress = false;
    });
  }

  public openGroupPage(groupId: string): void {
    this.NavController.push(GroupDetailPage, groupId);
  }
}
