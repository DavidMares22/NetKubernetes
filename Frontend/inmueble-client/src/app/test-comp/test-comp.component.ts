import { Component } from '@angular/core';

@Component({
  selector: 'app-test-comp',
  standalone: true,
  imports: [],
  templateUrl: './test-comp.component.html',
  styleUrl: './test-comp.component.css'
})
export class TestCompComponent {
  message: string = 'Hello, Debugging!';

  constructor() {
    console.log('DebugTestComponent initialized'); // Set a breakpoint here
    this.debugMethod();
  }

  debugMethod() {
    console.log('Debug method triggered'); // Set a breakpoint here
    this.message = 'Debugging in action!';
  }
}
