import { ViewController, IonicPage } from 'ionic-angular';
import { GroupProvider } from './../../../providers/group';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-group-creation-modal',
  templateUrl: 'group-creation-modal.html',
})
export class GroupCreationModalPage {
  public groupName: string;
  public groupDescription: string;
  public currentUserId: string;

  constructor(
    private GroupProvider: GroupProvider,
    private Storage: Storage,
    private ViewController: ViewController
  ) {
    this.groupName = '';
    this.groupDescription = '';

    this.Storage.get('currentUserData').then(currentUserData => {
      this.currentUserId = currentUserData.id;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupCreationModalPage');
  }

  public createGroup(): void {
    this.GroupProvider.createGroup(this.groupName, this.groupDescription, this.currentUserId);
    this.dismiss();
  }

  public dismiss(): void {
    this.ViewController.dismiss();
  }

}
