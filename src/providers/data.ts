import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataProvider {
	constructor(
        private AngularFireDatabase: AngularFireDatabase
	) {

	}

	public push(path: string, data: any): Observable<any> {
		return Observable.create(observer => {
			this.AngularFireDatabase.list(path).push(data).then((firebaseNewData) => {
				observer.next(firebaseNewData.path.pieces_[firebaseNewData.path.pieces_.length - 1]);
			}, error => {
				observer.next(error);
			});
		});
	}

	public update(path: string, data: any): Promise<void> {
        return this.AngularFireDatabase.object(path).update(data);
	}

	public list(path: string): Observable<any> {
		return this.AngularFireDatabase.list(path).valueChanges();
	}

	public object(path: string): Observable<any> {
		return this.AngularFireDatabase.object(path).valueChanges();
	}

	public remove(path: string): void {
		this.AngularFireDatabase.object(path).remove();
	}
}
