import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import * as _ from 'lodash';

import { DataProvider } from './data';

const profileColorsCode = [
    // http://htmlcolorcodes.com/fr/ line 6 of color table
    'C0392B',
    'E74C3C',
    '9B59B6',
    '8E44AD',
    '2980B9',
    '3498DB',
    '1ABC9C',
    '16A085',
    '27AE60',
    '2ECC71',
    'F1C40F',
    'F39C12',
    'E67E22',
    'D35400',
    'BDC3C7',
    '95A5A6',
    '7F8C8D',
    '34495E',
    '2C3E50'
];

@Injectable()
export class AuthenticationProvider {

    constructor(
        private AngularFireDatabase: AngularFireDatabase,
        private AngularFireAuth: AngularFireAuth,
        private DataProvider: DataProvider,
        private Platform: Platform,
        private Facebook: Facebook,
        private Storage: Storage
    ) {

    }

    public getCurrentUserData(): Observable<IPersistedUser> {
      return Observable.create(observer => {
        this.AngularFireAuth.authState.subscribe(authenticationData => {
            if (authenticationData) {
                this.DataProvider.object(`users/${authenticationData.uid}`).subscribe(userData => {
                    observer.next(userData);
                    observer.complete();
                });
            } else {
                observer.error();
            }
        })
      });
    }

    public getUserData(userId: string): Observable<IUser> {
      return Observable.create(observer => {
        this.DataProvider.object(`users/${userId}`).subscribe(userData => {
          if (userData) {
            observer.next(userData);
            observer.complete();
          } else {
            observer.error();
          }
        })
      });
    }

    public getUserMainInformations(userId: string): Observable<IUserMainInfo> {
        return Observable.create(observer => {
            this.DataProvider.object(`users/${userId}/profile`).subscribe(userMainInfo => {
                if (!!userMainInfo) {
                    observer.next(userMainInfo);
                    observer.complete();
                } else {
                    observer.error();
                }
            });
        });
    }

    public getUserByEmail(email: string): Observable<IUser> {
        return Observable.create(observer => {
            this.DataProvider.ref('users').orderByChild('email').equalTo(email).once('value').then(snapshot => {
                if (snapshot.exists()) {
                    const users = snapshot.val();
                    _.forEach(users, user => {
                        observer.next(user);
                    });
                } else {
                    observer.next(null)
                }
                observer.complete();
            });
        });
    } 

    public registerUser(email: string, password: string, firstname: string, lastname: string): Observable<IBasicCredentials> {
        return Observable.create(observer => {
            this.AngularFireAuth.auth.createUserWithEmailAndPassword(email, password).then(authenticationData => {
                const randomIndex = Math.round(Math.random() * profileColorsCode.length);
                const randomColor = profileColorsCode[randomIndex];
                this.AngularFireDatabase.list('users').update(authenticationData.uid, {
                    profile: {
                        id: authenticationData.uid,
                        firstname,
                        lastname,
                        email: authenticationData.email,
                        image: `https://ui-avatars.com/api/?name=${firstname}+${lastname}&color=FFF&background=${randomColor}`
                    },
                    name: `${firstname} ${lastname}`,
                    emailVerified: false,
                    provider: 'email',
                });
                observer.next({email, password, created: true});
            }).catch((error: any) => {
              if (error) {
                switch (error.code) {
                  case 'INVALID_EMAIL':
                    observer.error('E-mail invalide.');
                  break;
                  case "auth/email-already-in-use":
                    observer.error('Cet e-mail est déjà utilisé');
                  break;
                  case 'NETWORK_ERROR':
                    observer.error('Une erreur est survenue lors de la connexion au service. Veuillez réessayer plus tard.');
                  break;
                  default:
                    observer.error(error);
                }
              }
            });
        });
    }

    public loginWithEmail(email: string, password: string): Observable<any> {
        return Observable.create(observer => {
            this.AngularFireAuth.auth.signInWithEmailAndPassword(email, password)
            .then((authenticationData) => {
                this.Storage.set('currentUserId', authenticationData.uid);
                observer.next(authenticationData);
            }).catch((error) => {
                observer.error(error);
            });
        })
    }

    public loginWithFacebook(): Observable<any> {
        return Observable.create(observer => {
            if (this.Platform.is('cordova')) {
                this.Facebook.login(['public_profile', 'email']).then(facebookData => {
                    let provider: firebase.auth.AuthCredential = firebase.auth.FacebookAuthProvider.credential(facebookData.authResponse.accessToken);
                    firebase.auth().signInWithCredential(provider).then((firebaseData) => {
                        this.AngularFireDatabase.list('users').update(firebaseData.user.uid, {
                            profile: {
                                id: firebaseData.user.uid,
                                firstname: firebaseData.additionalUserInfo.profile.first_name,
                                lastname: firebaseData.additionalUserInfo.profile.last_name,
                                email: firebaseData.user.email,
                                image: firebaseData.additionalUserInfo.profile.picture.data.url,
                            },
                            facebookId: firebaseData.user.providerData[0].uid,
                            name: firebaseData.user.displayName,
                            provider: 'facebook',
                            emailVerified: true
                        });
                        this.Storage.set('currentUserFacebookId', firebaseData.user.providerData[0].uid);
                        observer.next(firebaseData.user);
                    });
                }).catch(error => {
                    observer.error(error);
                });
            } else {
                this.AngularFireAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
                .then(facebookData => {
                    this.AngularFireDatabase.list('users').update(facebookData.user.uid, {
                        profile: {
                            id: facebookData.user.uid,
                            firstname: facebookData.additionalUserInfo.profile.first_name,
                            lastname: facebookData.additionalUserInfo.profile.last_name,
                            email: facebookData.user.email,
                            image: facebookData.additionalUserInfo.profile.picture.data.url,
                        },
                        facebookId: facebookData.user.providerData[0].uid,
                        name: facebookData.user.displayName,
                        provider: 'facebook',
                        emailVerified: true
                    });
                    observer.next(facebookData.user);
                }).catch(error => {
                    observer.error(error);
                });
            }
        });
    }

    public getFacebookUserPhotoURL(facebookId: string, width: number | null, height: number | null): string {
        const widthURLParam = width === null ? '' : `?width=${width}`;
        const heightURLParam = height === null ? '' : `?height=${height}`;

        return `https://graph.facebook.com/${facebookId}/picture${widthURLParam}${heightURLParam}`;
    }

    public sendPasswordResetEmail(email: string): Observable<string> {
        return Observable.create(observer => {
            firebase.auth().sendPasswordResetEmail(email).then(() => {
                observer.next(email);
            }).catch(error => {
                observer.error(error);
            });
        })
    }

    public logout(): Promise<void> {
        this.Storage.remove('currentUserId');
        this.Storage.remove('currentUserFacebookId');
        return this.AngularFireAuth.auth.signOut();
    }
}
