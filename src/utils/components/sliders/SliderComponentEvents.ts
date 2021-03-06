enum SliderComponentEvents {
  /**
   * The slider value has changed from a user action. Setting the value directly via the `value`
   * property will not fire this event.
   * 
   * Callback params:
   * 
   * @param slider `SliderComponent` - The slider whose value has changed.
   */
  CHANGED = 'changed',
  
  /**
   * The mouse wheel has just been moved while over the slider. This will also be followed by
   * a `SliderComponentEvents.CHANGED` event firing.
   * 
   * Callback params:
   * 
   * @param yDelta `number` - The vertical scroll amount that occurred due to the user moving a
   * mouse wheel or similar input device. This value will typically be less than 0 if the user
   * scrolls up and greater than zero if scrolling down. Between this value and `xDelta`, this one
   * seems to be the more prominent value, hence it is first.
   * @param slider `SliderComponent` - The affected slider.
   * @param pointer `Phaser.Input.Pointer` - The pointer responsible for triggering this event.
   * @param xDelta `number` - The horizontal scroll amount that occurred due to the user moving a
   * mouse wheel or similar input device.
   */
  WHEEL = 'wheel',
}

export default SliderComponentEvents;
