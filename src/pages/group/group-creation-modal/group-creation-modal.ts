import { ViewController } from 'ionic-angular';
import { GroupProvider } from './../../../providers/group';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-group-creation-modal',
  templateUrl: 'group-creation-modal.html',
})
export class GroupCreationModalPage {
  public group: IGroup;
  public currentUserId: string;

  constructor(
    private GroupProvider: GroupProvider,
    private Storage: Storage,
    private ViewController: ViewController
  ) {
    this.group = {
      id: '',
      name: '',
      description: '',
      users: [],
      superAdmin: '',
      admins: [],
      joinRequests: [],
      joinInvitations: []
    };

    this.Storage.get('currentUserId').then(currentUserId => {
      this.currentUserId = currentUserId;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupCreationModalPage');
  }

  public createGroup(): void {
    this.GroupProvider.createGroup(this.group, this.currentUserId);
    this.dismiss();
  }

  public dismiss(): void {
    this.ViewController.dismiss();
  }

}
