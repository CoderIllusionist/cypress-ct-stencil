import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';
import { format } from '../../utils/utils';

export interface IComplexProp {
  value: string | string[] | Record<any, number>;
  isValid: boolean;
  error: boolean;
  message: string;
}

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})
export class MyComponent {
  /**
   * The first name
   */
  @Prop() first: string;

  /**
   * The middle name
   */
  @Prop() middle: string;

  /**
   * The last name
   */
  @Prop() last: string;

  /**
   * Complex prop
   */
  @Prop() complexProp: IComplexProp;

  /**
   * Event
   */
  @Event() customEvent: EventEmitter<string>;

  private getText(): string {
    return format(this.first, this.middle, this.last);
  }

  private counter = 0;

  private setCounter(): void {
    this.counter++;
    this.customEvent.emit('Hi' + this.counter);
  }

  render() {
    return [<div onClick={this.setCounter.bind(this)}>Hello, World! I'm {this.getText()}</div>, this.complexProp && <pre>{JSON.stringify(this.complexProp)}</pre>];
  }
}
