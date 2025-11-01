import { Component, Input } from '@angular/core';
import { JsonLine } from '../core/models/json-line.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-json-renderer-line',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './json-renderer-line.component.html',
  styleUrls: ['./json-renderer-line.component.scss']
})
export class JsonRendererLineComponent {
  @Input() lines: JsonLine[] = []; // Usado para renderizar linhas genéricas
}
