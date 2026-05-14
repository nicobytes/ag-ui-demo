import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chat } from './chat/chat';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Chat],
  templateUrl: './app.html'
})
export class App {
}
