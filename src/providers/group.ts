import { AuthenticationProvider } from './authentication';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { DataProvider } from './data';

@Injectable()
export class GroupProvider {
    constructor(
        private DataProvider: DataProvider,
        private AuthenticationProvider: AuthenticationProvider
    ) {

    }

    public getGroupData(groupId: string): Observable<IPersistedGroup> {
      return Observable.create(observer => {
        this.DataProvider.object('groups/' + groupId).subscribe(groupData => {
          if (groupData) {
            observer.next(groupData);
            observer.complete();
          } else {
            observer.error();
          }
        });
      });
    }

    public getGroupUsers(groupId: string): Observable<IPersistedUser[]> {
      return Observable.create(observer => {
        this.DataProvider.list(`groups/${groupId}/users`).subscribe(groupUsersId => {
          let obsvArray: Observable<IPersistedUser>[] = [];
          if (groupUsersId) {
            groupUsersId.forEach(userId => {
              obsvArray.push(this.AuthenticationProvider.getUserData(userId));
            });
            Observable.forkJoin(obsvArray).subscribe(groupUsers => {
              observer.next(groupUsers);
            });
          } else {
            observer.error();
          }
        });
      });
    }

    public getGroupList(): Observable<IGroup[]> {
      return this.DataProvider.list('groups');
    }

    public getUserGroups(userId: string): Observable<IGroup[]> {
      return Observable.create(observer => {
        this.DataProvider.list(`users/${userId}/groups`).subscribe(userGroupsId => {
          if (userGroupsId) {
            let obsvArray: Observable<IPersistedGroup>[] = [];
            userGroupsId.forEach(groupId => {
              obsvArray.push(this.getGroupData(groupId));
            });
            Observable.forkJoin(obsvArray).subscribe(groupUsers => {
              observer.next(groupUsers);
            });
          } else {
            observer.error();
          }
        });
      });
    }

    public createGroup(group: IGroup, userId: string): void {
      if (group.name) {
        group.users[userId] = userId;
        group.superAdmin = userId;
        this.DataProvider.push('groups', group).subscribe(groupId => {
          let groupRef = {};
          let idRef = {};
          groupRef[groupId] = groupId;
          idRef['id'] = groupId;
          this.DataProvider.update(`users/${userId}/groups`, groupRef);
          this.DataProvider.update(`groups/${groupId}`, idRef);
        });
      }
    }

    public removeGroup(groupId: string): void {
      this.DataProvider.remove(`groups/${groupId}`);
    }

    public addUserToGroup(userId: string, groupId: string): Promise<void[]> {
      let groupRef = {};
      let userRef = {};

      groupRef[groupId] = groupId;
      userRef[userId] = userId;

      return Promise.all([
        this.DataProvider.update(`groups/${groupId}/users`, userRef),
        this.DataProvider.update(`users/${userId}/groups`, groupRef)
      ]);
    }

    public removeMemberFromGroup(userId: string, groupId: string): void {
      this.DataProvider.remove(`/users/${userId}/groups/${groupId}`);
      this.DataProvider.remove(`/groups/${groupId}/users/${userId}`);
    }

    public isMemberSuperAdminOfGroup(userId: string, groupId: string): Promise<boolean> {
      return this.getGroupData(groupId).toPromise().then(groupData => {
        return (userId === groupData.superAdmin);
      });
    }

    public updateGroupSuperAdmin(groupId: string, userId: string): Promise<void> {
      return this.DataProvider.update(`groups/${groupId}`, {superAdmin: userId});
    }

    public createNewGroupJoinRequest(groupId: string, userId: string): Promise<void> {
      let userRef = {};
      userRef[userId] = userId;
      return this.DataProvider.update(`groups/${groupId}/joinRequests`, userRef);
    }

    public removeGroupJoinRequest(groupId: string, userId: string): void {
      return this.DataProvider.remove(`/groups/${groupId}/joinRequests/${userId}`);
    }

    public getGroupJoinRequestsUsers(groupId: string): Observable<any> {
      return Observable.create(observer => {
        this.DataProvider.list(`groups/${groupId}/joinRequests`).subscribe(joinRequestsUserId => {
          if (joinRequestsUserId.length) {
            let obsvArray: Observable<any>[] = [];
            _.forEach(joinRequestsUserId, joinRequestUserId => {
              obsvArray.push(this.AuthenticationProvider.getUserData(joinRequestUserId));
            });
            Observable.forkJoin(obsvArray).subscribe(joinRequestUsers => {
              observer.next(joinRequestUsers);
            });
          } else {
            observer.next([]);
          }
        })
      });
    }
}
