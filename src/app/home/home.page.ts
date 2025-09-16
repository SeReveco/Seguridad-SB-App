import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor() {}

  ngAfterViewInit() {
    // Enfoque inicial en San Bernardo, sin límites
    const map = L.map('map').setView([-33.592, -70.700], 13); // Centro San Bernardo
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  }

}
