import { Injectable } from '@angular/core';

export interface Alerta {
  id: number;
  mensaje: string;
  fecha: Date;
}

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private alertas: Alerta[] = [];
  private nextId = 1;

  getAlertas(): Alerta[] {
    return this.alertas;
  }

  agregarAlerta(mensaje: string) {
    this.alertas.push({
      id: this.nextId++,
      mensaje,
      fecha: new Date()
    });
  }
}
