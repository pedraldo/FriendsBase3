import { GroupCreationModalPage } from './../group-creation-modal/group-creation-modal';
import { GroupProvider } from './../../../providers/group';
import { Component } from '@angular/core';
import { Loading, LoadingController, ModalController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GroupDetailPage } from '../group-detail/group-detail';

@Component({
  selector: 'page-group-list',
  templateUrl: 'group-list.html',
})
export class GroupListPage {
  public groups: IGroupMainInfo[] = [];
  public currentUserId: string;
  public loader: Loading;

  constructor(
    private NavController: NavController,
    private GroupProvider: GroupProvider,
    private ModalController: ModalController,
    private LoadingController: LoadingController,
    private Storage: Storage
  ) {
    this.loader = this.LoadingController.create({
      spinner: 'crescent'
    });
    this.loader.present();
    this.Storage.get('currentUserData').then(currentUserData => {
      this.currentUserId = JSON.parse(currentUserData).id;
      this.GroupProvider.getUserGroups(this.currentUserId).subscribe(currentUserGroups => {
        this.groups = currentUserGroups;
        this.loader.dismiss();
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupListPage');
  }

  public openNewGroupModal(): void {
    let modal = this.ModalController.create(GroupCreationModalPage);
    modal.present();
  }

  public openGroupDetailPage(group: IGroup): void {
    this.NavController.push(GroupDetailPage, group);
  }

  public openGroupSearchPage(): void {
    this.NavController.push('GroupSearchTabPage', this.currentUserId);
  }

}
