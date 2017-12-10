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

    public getUserRelationships(userId: string): Observable<IRelationship> {
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

    public getUserRelationshipsFollowers(userId: string): Observable<IRelationObject[]> {
        return Observable.create(observer => {
            this.AuthenticationProvider.getUserData(userId).subscribe(userData => {
                if (!!userData) {
                    observer.next(userData.relationships.followers);
                } else {
                    observer.error();
                }
            });
        });    
    }

    public getUserRelationshipsFollowed(userId: string): Observable<IRelationObject[]> {
        return Observable.create(observer => {
            this.AuthenticationProvider.getUserData(userId).subscribe(userData => {
                if (!!userData) {
                    observer.next(userData.relationships.followed);
                } else {
                    observer.error();
                }
            });
        });    
    }

    public isUser1FollowerOfUser2(user1Id: string, user2Id: string): Observable<boolean> {
        return Observable.create(observer => {
            let isInRelationships = false;
            this.getUserRelationshipsFollowers(user2Id).subscribe(user2Relationships => {
                _.forEach(user2Relationships, (value, key) => {
                    if (key === user1Id) isInRelationships = true;
                });
                observer.next(isInRelationships);
            });
        });
    }

    public addUser1InUser2Relationships(user1Id: string, user2Id: string): Promise<void[]> {
        let user1RelationshipRef = {};
        let user2RelationshipRef = {};
        user1RelationshipRef[user2Id] = user2Id;
        user2RelationshipRef[user1Id] = user1Id;

        return Promise.all([
            this.DataProvider.update(`users/${user1Id}/relationships/followers/`, user1RelationshipRef),
            this.DataProvider.update(`users/${user2Id}/relationships/followed/`, user2RelationshipRef)
        ]);
    }

    public removeUser1FromUser2Realtionships(user1Id: string, user2Id: string): void {
        return this.DataProvider.remove(`users/${user2Id}/relationships/${user1Id}`);
    }
}