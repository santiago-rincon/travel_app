import { Injectable, computed, inject, signal } from '@angular/core';
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
  FacebookAuthProvider,
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
  private isLoginSignal = signal(true);
  isLogin = computed(() => this.isLoginSignal());

  registerWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.fireAuth, email, password);
  }

  sendEmailToVerification(user: User) {
    return sendEmailVerification(user);
  }

  signInwithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.fireAuth, email, password);
  }

  async signInWithProvider(provider: 'google' | 'facebook') {
    // console.log(this.platform.platforms());
    if (this.platform.is('android')) {
      GoogleAuth.initialize({
        clientId: environment.serverClientIdGoogleAuth,
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
      switch (provider) {
        case 'google':
          console.log('case android');
          const { authentication } = await GoogleAuth.signIn();
          return signInWithCredential(this.fireAuth, GoogleAuthProvider.credential(authentication.idToken));
        case 'facebook':
          return signInWithPopup(this.fireAuth, new FacebookAuthProvider());
        default:
          return null;
      }
    } else {
      console.log('web');
      switch (provider) {
        case 'google':
          return signInWithPopup(this.fireAuth, new GoogleAuthProvider());
        case 'facebook':
          return signInWithPopup(this.fireAuth, new FacebookAuthProvider());
        default:
          return null;
      }
    }
    //TODO: ver documentación https://firebase.google.com/docs/auth/web/apple?hl=es
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.fireAuth);
      this.router.navigate(['/login']);
      this.isLoginSignal.set(false);
    } catch (error) {
      this.alertsService.presentAlert({ header: 'Ha ocurrido un error', message: 'Intentalo mas tarde' });
    }
  }

  getUser() {
    return this.fireAuth.currentUser;
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
