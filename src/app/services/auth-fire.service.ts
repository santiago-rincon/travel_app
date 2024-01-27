import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  User,
  signOut,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertsService } from '@services/alerts.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthFireService {
  private fireAuth = inject(Auth);
  private router = inject(Router);
  private alertsService = inject(AlertsService);
  private platform = inject(Platform);
  private role = signal<'user' | 'driver' | null>(null);

  registerWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.fireAuth, email, password);
  }

  sendEmailToVerification(user: User) {
    return sendEmailVerification(user);
  }

  signInwithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.fireAuth, email, password);
  }

  async signInWithGoogle() {
    if (this.platform.is('android')) {
      GoogleAuth.initialize({
        clientId: environment.serverClientIdGoogleAuth,
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
      const { authentication } = await GoogleAuth.signIn();
      return signInWithCredential(this.fireAuth, GoogleAuthProvider.credential(authentication.idToken));
    } else {
      return signInWithPopup(this.fireAuth, new GoogleAuthProvider());
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.fireAuth);
      this.role.set(null);
      this.router.navigate(['/login']);
      localStorage.removeItem('profile');
    } catch (error) {
      this.alertsService.presentAlert({ header: 'Ha ocurrido un error', message: 'Intentalo de nuevo' });
    }
  }

  getUser() {
    return this.fireAuth.currentUser;
  }

  get getRole() {
    return this.role.asReadonly();
  }

  set setRole(role: 'user' | 'driver' | null) {
    this.role.set(role);
  }

  verifyErrorCodes(code: string): string {
    switch (code) {
      //---REGISTER CASE--- //
      //Correo Registrado
      case 'auth/email-already-in-use':
        return 'El usuario ya se encuentra registrado';
      //Contraseña Debil
      case 'auth/weak-password':
        return 'Contraseña debil, recuerda que debe contener al menos 8 carácteres';
      //Correo Invalido
      case 'auth/invalid-email':
        return 'La dirección de correo electrónico no es valida';
      case 'auth/internal-error':
        //Campos vacios
        return 'Completa todos los campos del formulario';
      //---REGISTER CASE--- //
      //Contraseña Incorrecta
      case 'auth/invalid-credential':
        return 'Contraseña o correo electónico incorrectos';
      // Correo no registrado
      case 'auth/user-not-found':
        return 'El correo no se encunetra registrado';
      //Muchos intentos
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos de iniciar sesión';
      //Se cerro la ventana emergente de google
      case 'auth/popup-closed-by-user':
        return 'La ventana emergente para la autenticación fue cerrada, intenta de nuevo';
      // Dominio no autorizado
      case 'auth/unauthorized-domain':
        return 'Este dominio no se encuentra autorizado, inicia sesión con correo y contraseña';
      // Error de conexión
      case 'auth/network-request-failed':
        return 'Error de conexión, revisa tu conexión a internet';
      //Otros Errores
      default:
        return 'Error desconocido, inténtalo más tarde';
    }
  }
}
