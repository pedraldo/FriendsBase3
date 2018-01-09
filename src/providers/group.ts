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
      this.DataProvider.object(`groups/${groupId}`).subscribe(groupData => {
        if (!!groupData) {
          observer.next(groupData);
          observer.complete();
        } else {
          observer.error();
        }
      });
    });
  }

  public getGroupUsers(groupId: string): Observable<IUserMainInfo[]> {
    return Observable.create(observer => {
      this.DataProvider.list(`groups/${groupId}/users`).subscribe(groupUsers => {
        if (!!groupUsers && groupUsers.length) {
          observer.next(groupUsers);
          observer.complete();
        } else if (groupUsers === null) {
          observer.next([]);
          observer.complete();
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
      this.DataProvider.list(`users/${userId}/groups`).subscribe(userGroups => {
        if (!!userGroups && userGroups.length) {
          observer.next(userGroups);
        } else if (userGroups === null) {
          observer.next([]);
        } else {
          observer.error();
        }
      });
    });
  }

  public getGroupsByName(groupName: string): Observable<IGroup[]> {
    return Observable.create(observer => {
      this.DataProvider.ref('groups').orderByChild('name').equalTo(groupName).once('value').then(snapshot => {
        if (snapshot.exists()) {
          const groups = snapshot.val();
          let groupArray: IGroup[] = [];
          _.forEach(groups, group => {
            groupArray.push(group);
          });
          observer.next(groupArray);
        } else {
          observer.next([])
        }
        observer.complete();
      });
    });
  }

  public createGroup(group: IGroup, userId: string): Promise<IGroup> {
    return new Promise((resolve, reject) => {
      if (!!group && !!group.name && !!userId) {
        this.AuthenticationProvider.getUserMainInformations(userId).subscribe(userMainInfo => {
          if (!!userMainInfo) {
            group.users[userId] = userMainInfo;
            group.superAdmin = userMainInfo.id;

            this.DataProvider.push('groups', group).subscribe(groupId => {
              let groupRef = {};
              groupRef[groupId] = {
                id: groupId,
                name: group.name,
                superAdmin: group.superAdmin
              };

              Promise.all([
                this.DataProvider.update(`users/${userId}/groups`, groupRef),
                this.DataProvider.update(`groups/${groupId}`, { id: groupId })
              ]).then(() => {
                resolve(group);
              });
            });
          }
        });
      } else {
        reject();
      }
    });
  }

  private removeAllGroupMembers(groupId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getGroupUsers(groupId).toPromise().then(groupUsers => {
        if (groupUsers && groupUsers.length) {
          let promArray: Promise<void>[] = [];

          groupUsers.forEach(groupUser => {
            promArray.push(this.DataProvider.remove(`users/${groupUser.id}/groups/${groupId}`));
          });

          Promise.all(promArray).then(() => {
            resolve();
          }).catch(error => {
            reject(error);
          });
        }
      });
    });
  }

  public removeGroup(groupId: string): Promise<void> {
    return this.removeAllGroupMembers(groupId).then(() => {
      return this.DataProvider.remove(`groups/${groupId}`).then(() => {
      });
    });
  }

  public addUserToGroup(userId: string, groupMainInfo: IGroupMainInfo): Promise<void> {
    return new Promise((resolve, reject) => {
      this.AuthenticationProvider.getUserMainInformations(userId).subscribe(userMainInfo => {
        Promise.all([
          this.DataProvider.update(`groups/${groupMainInfo.id}/users/${userId}`, userMainInfo),
          this.DataProvider.update(`users/${userId}/groups`, groupMainInfo)
        ]).then(() => {
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    });
  }

  public removeMemberFromGroup(userId: string, groupId: string): Promise<void[]> {
    return Promise.all([
      this.DataProvider.remove(`/users/${userId}/groups/${groupId}`),
      this.DataProvider.remove(`/groups/${groupId}/users/${userId}`)
    ]);
  }

  public isMemberSuperAdminOfGroup(userId: string, groupId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.DataProvider.object(`groups/${groupId}/superAdmin`).subscribe(groupSuperAdminId => {
        if (!!groupSuperAdminId) {
          resolve(groupSuperAdminId === userId);
        } else {
          reject();
        }
      });
    });
  }

  public updateGroupSuperAdmin(groupId: string, userId: string): Promise<void> {
    return this.DataProvider.update(`groups/${groupId}`, { superAdmin: userId });
  }

  public createNewGroupJoinRequest(groupId: string, userId: string): Promise<void> {
    let userRef = {};
    userRef[userId] = userId;
    return this.DataProvider.update(`groups/${groupId}/joinRequests`, userRef);
  }

  public removeGroupJoinRequest(groupId: string, userId: string): Promise<void> {
    return this.DataProvider.remove(`/groups/${groupId}/joinRequests/${userId}`);
  }

  public getGroupJoinRequestsUsers(groupId: string): Observable<IUserMainInfo[]> {
    return Observable.create(observer => {
      this.DataProvider.list(`groups/${groupId}/joinRequests`).subscribe(joinRequestsUserId => {
        if (joinRequestsUserId) {
          if (joinRequestsUserId.length) {
            let obsvArray: Observable<IUserMainInfo>[] = [];
            _.forEach(joinRequestsUserId, joinRequestUserId => {
              obsvArray.push(this.AuthenticationProvider.getUserMainInformations(joinRequestUserId));
            });
            Observable.forkJoin(obsvArray).subscribe(joinRequestUsers => {
              observer.next(joinRequestUsers);
            });
          } else {
            observer.next([]);
          }
        } else {
          observer.error();
        }
      })
    });
  }
}
