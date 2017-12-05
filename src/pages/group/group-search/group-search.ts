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
  public groups: IGroup[] = [];
  public filteredGroups: IGroup[] = [];

  constructor(
    private NavController: NavController, 
    private NavParams: NavParams,
    private GroupProvider: GroupProvider
  ) {
    this.getAllGroups();
    this.currentUserId = this.NavParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupSearchPage');
  }

  private getAllGroups(): void {
    this.GroupProvider.getGroupList().subscribe((groups: IGroup[]) => {
      this.groups = groups;
    })
  }

  public getItems(event: any) {
    let val = event.target.value;

    if (val && val.trim() != '' && val.length > 2) {
      this.filteredGroups = this.groups.filter((group: IGroup) => {
        return (group.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.filteredGroups = this.groups;
    }
  }

  public openGroupPage(group: IGroup): void {
    this.NavController.push(GroupDetailPage, group);
  }
}
