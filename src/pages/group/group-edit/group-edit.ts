import { GroupProvider } from './../../../providers/group';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { Events } from 'ionic-angular/util/events';

@IonicPage()
@Component({
  selector: 'page-group-edit',
  templateUrl: 'group-edit.html',
})
export class GroupEditPage {
  public group: IEditableGroupInfo;
  public groupId: string;
  private groupInDatabase: IEditableGroupInfo;

  constructor(
    private NavController: NavController,
    private NavParams: NavParams,
    private GroupProvider: GroupProvider,
    private Events: Events
  ) {
    this.groupId = this.NavParams.data.id;
    this.group = {
      name: this.NavParams.data.name,
      description: this.NavParams.data.description
    };
    this.groupInDatabase = Object.assign({}, this.group);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupEditPage');
  }

  public updateGroupInfo(): void {
    _.forEach(this.group, (value, key) => {
      if (this.groupInDatabase[key] === value) delete this.group[key];
    });

    this.GroupProvider.updateGroup(this.groupId, this.group).then(() => {
      this.Events.publish(`group-${this.groupId}:updated`, this.group);
      this.NavController.pop();
    });
  }

}
