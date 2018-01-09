import { GroupDetailPage } from './../group-detail/group-detail';
import { GroupProvider } from './../../../providers/group';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-group-search',
  templateUrl: 'group-search.html',
})
export class GroupSearchPage {
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
    console.log('ionViewDidLoad GroupSearchPage');
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

  public openGroupPage(group: IGroup): void {
    this.NavController.push(GroupDetailPage, group);
  }
}
