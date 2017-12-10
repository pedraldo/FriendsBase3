import { FollowersTabPage } from './../followers-tab/followers-tab';
import { FollowedTabPage } from './../followed-tab/followed-tab';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-relationship-tabs',
  templateUrl: 'relationship-tabs.html'
})
export class RelationshipTabsPage {
  public followedTabRoot = FollowedTabPage;
  public followersTabRoot = FollowersTabPage
  public tabParams: [string, boolean];

  constructor(
    private NavParams: NavParams
  ) {
    this.tabParams = this.NavParams.data;
  }

}
