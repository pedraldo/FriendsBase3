import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { DataProvider } from './data';
import { AuthenticationProvider } from './authentication';

import * as _ from 'lodash';

@Injectable()
export class RelationshipProvider {

    constructor(
        private DataProvider: DataProvider,
        private AuthenticationProvider: AuthenticationProvider
    ) {

    }

    public getUserRelationships(userId: string): Observable<void> {
        return Observable.create(observer => {
            this.AuthenticationProvider.getUserData(userId).subscribe(userData => {
                if (!!userData) {
                    observer.next(userData.relationships);
                } else {
                    observer.error();
                }
            });
        });
    }

    public isUser1InUser2Relationships(user1Id: string, user2Id: string): Observable<boolean> {
        return Observable.create(observer => {
            let isInRelationships = false;
            this.getUserRelationships(user2Id).subscribe(user2Relationships => {
                _.forEach(user2Relationships, (value, key) => {
                    if (key === user1Id) isInRelationships = true;
                });
            });
            observer.next(isInRelationships);
        });
    }

    public addUser1InUser2Relationships(user1Id: string, user2Id: string): Promise<void> {
        let relationshipRef = {};
        relationshipRef[user1Id] = true;

        return this.DataProvider.update(`users/${user2Id}/relationships`, relationshipRef);
    }

    public removeUser1FromUser2Realtionships(user1Id: string, user2Id: string): void {
        return this.DataProvider.remove(`users/${user2Id}/relationships/${user1Id}`);
    }
}