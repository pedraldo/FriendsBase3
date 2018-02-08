import { Storage } from '@ionic/storage';
import { GroupProvider } from './../../../providers/group';
import { Component } from '@angular/core';
import { NavParams, AlertController, ViewController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-group-change-admin-modal',
  templateUrl: 'group-change-admin-modal.html',
})
export class GroupChangeAdminModalPage {
  public group: IGroup;
  public groupUsers: IGroup[];
  public idMemberChosen: string;

  constructor(
    private NavParams: NavParams,
    private GroupProvider: GroupProvider,
    private Storage: Storage,
    private AlertController: AlertController,
    private ViewController: ViewController,
    public Platform: Platform
  ) {
    this.group = this.NavParams.data.group;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupChangeAdminModalPage');
  }

  ngOnInit(): void {
    this.Storage.get('currentUserData').then(currentUserData => {
      this.groupUsers = this.NavParams.data.groupUsers.filter(user => user.id !== JSON.parse(currentUserData).id);
    });
  }

  public changeGroupSuperAdmin(): void {
    const newAdminChosen = this.groupUsers.find(user => user.id === this.idMemberChosen)
    this.AlertController.create({
      title: 'Confirmez le choix du nouvel admin ?',
      message: `Etes vous sûr de vouloir désigner ${newAdminChosen.name} comme administrateur du groupe ${this.group.name} ?`,
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.GroupProvider.updateGroupSuperAdmin(this.group.id, newAdminChosen.id);
            this.dismiss(newAdminChosen.id);
          }
        },
        {
          text: 'Non',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public dismiss(data?: null | string): Promise<any> {
    return this.ViewController.dismiss(data);
  }

}
