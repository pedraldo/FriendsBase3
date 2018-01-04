import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { DataProvider } from './data';
import { AuthenticationProvider } from './authentication';

@Injectable()
export class RelationshipProvider {

    constructor(
        private DataProvider: DataProvider,
        private AuthenticationProvider: AuthenticationProvider
    ) {

    }

    public getUserRelationships(userId: string): Observable<IRelationship> {
        return Observable.create(observer => {
            this.DataProvider.object(`users/${userId}/relationships`).subscribe(userRelationships => {
                if (!!userRelationships || userRelationships === null) {
                    observer.next(userRelationships);
                } else {
                    observer.error();
                }
            });
        });
    }

    public getUserRelationshipsFollowers(userId: string): Observable<IRelationObject[]> {
        return Observable.create(observer => {
            this.DataProvider.list(`users/${userId}/relationships/followers`).subscribe(userFollowers => {
                if (!!userFollowers || userFollowers === null) {
                    observer.next(userFollowers)
                } else {
                    observer.error();
                }
            });
        });    
    }

    public getUserRelationshipsFollowed(userId: string): Observable<IRelationObject[]> {
        return Observable.create(observer => {
            this.DataProvider.list(`users/${userId}/relationships/followed`).subscribe(usersFollowed => {
                if (!!usersFollowed || usersFollowed === null) {
                    observer.next(usersFollowed);
                } else {
                    observer.error();
                }
            });
        });    
    }

    public isUser1FollowerOfUser2(user1Id: string, user2Id: string): Observable<boolean> {
        return Observable.create(observer => {
            this.DataProvider.object(`users/${user1Id}/relationships/followed/${user2Id}`).subscribe(result => {
                if (!!result || result === null) {
                    observer.next(!!result);
                } else {
                    observer.error();
                }
            });
        });
    }

    public addUser1InUser2Relationships(user1Id: string, user2Id: string): Promise<void[]> {
        let user1RelationshipRef = {};
        let user2RelationshipRef = {};

        let obsvArray: Observable<IUserMainInfo>[] = [
            this.AuthenticationProvider.getUserMainInformations(user1Id),
            this.AuthenticationProvider.getUserMainInformations(user2Id)
        ];

        return new Promise((resolve, reject) => {
            Observable.forkJoin(obsvArray).subscribe(([user1MainInfos, user2MainInfos]) => {
                user1RelationshipRef[user2Id] = user2MainInfos;
                user2RelationshipRef[user1Id] = user1MainInfos;
                Promise.all([
                    this.DataProvider.update(`users/${user1Id}/relationships/followers/`, user1RelationshipRef),
                    this.DataProvider.update(`users/${user2Id}/relationships/followed/`, user2RelationshipRef)
                ]);
            });
        });
    }

    public removeUser1FromUser2Realtionships(user1Id: string, user2Id: string): Promise<void[]> {
        return Promise.all([
            this.DataProvider.remove(`users/${user2Id}/relationships/followed/${user1Id}`),
            this.DataProvider.remove(`users/${user1Id}/relationships/followers/${user2Id}`)
        ]);
    }
}