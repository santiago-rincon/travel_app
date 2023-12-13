import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { DriverRegisterSchemaType } from '@schemas/form-checker';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private firestore = inject(Firestore);

  addDriver({ driverInfo, uid }: { driverInfo: DriverRegisterSchemaType; uid: string }) {
    const ref = doc(this.firestore, 'drivers', uid);
    return setDoc(ref, { ...driverInfo, uid });
  }

  getDataById(id: string, collection: string) {
    const ref = doc(this.firestore, collection, id);
    return getDoc(ref);
  }
}
