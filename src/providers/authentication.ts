import { Storage } from '@ionic/storage';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';

import { DataProvider } from './data';

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
                this.DataProvider.object('users/' + authenticationData.uid).subscribe(userData => {
                    observer.next(userData);
                    observer.complete();
                });
            } else {
                observer.error();
            }
        })
      });
    }

    public getUserData(userId: string): Observable<IPersistedUser> {
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

    public getUserByEmail(email: string): Observable<IUser> {
        return Observable.create(observer => {
            this.DataProvider.list('users').subscribe(users => {
                observer.next(users.find(user => user.email === email));
            })
        })
    } 

    public registerUser(email: string, password: string): Observable<IBasicCredentials> {
        return Observable.create(observer => {
            this.AngularFireAuth.auth.createUserWithEmailAndPassword(email, password).then(authenticationData => {
                this.AngularFireDatabase.list('users').update(authenticationData.uid, {
                    id: authenticationData.uid,
                    name: authenticationData.auth.email,
                    email: authenticationData.auth.email,
                    emailVerified: false,
                    provider: 'email',
                    image: null
                });
                observer.next({email, password, created: true});
            }).catch((error: any) => {
              if (error) {
                switch (error.code) {
                  case 'INVALID_EMAIL':
                    observer.error('E-mail invalide.');
                  break;
                  case 'EMAIL_TAKEN':
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
                            id: firebaseData.user.uid,
                            facebookId: firebaseData.user.providerData[0].uid,
                            name: firebaseData.user.displayName,
                            email: firebaseData.user.email,
                            provider: 'facebook',
                            image: firebaseData.additionalUserInfo.profile.picture.data.url,
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
                    console.log(facebookData);
                    this.AngularFireDatabase.list('users').update(facebookData.user.uid, {
                        id: facebookData.user.uid,
                        facebookId: facebookData.user.providerData[0].uid,
                        name: facebookData.user.displayName,
                        email: facebookData.user.email,
                        provider: 'facebook',
                        image: facebookData.additionalUserInfo.profile.picture.data.url,
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
        this.Storage.clear();
        return this.AngularFireAuth.auth.signOut();
    }
}
