import { Injectable } from '@angular/core';

export type UserRole = 'EDITOR' | 'APROVADOR';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private role: UserRole = 'APROVADOR'; // Altere aqui para testar o outro perfil

  getUserRole(): UserRole {
    return this.role;
  }

  setUserRole(role: UserRole) {
    this.role = role;
  }
}
