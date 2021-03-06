enum ContentScrollerEvents {
  /**
   * Dispatched while the visible area of the content is changing, due to either scroll bar
   * changing its visibility state. A visible scroll bar will reduce the amount of content that
   * is also visible. Controls using a content scroller will need to adjust their content according
   * to the changing size.
   * 
   * Callback params:
   * 
   * @param width `number` - The new width of the visible area.
   * @param height `number` - The new height of the visible area.
   * @param scroller `ContentScroller` - The affected content scroller.
   */
  AREA_CHANGING = 'areaChanging',
  
  /**
   * A slider value has changed from a user action, either by using a slider directly, or
   * by using the mouse wheel on a slider or scrollable content. Setting the value directly either
   * via the `ContentScroller.horizontalSliderValue` or `ContentScroller.verticalSliderValue`
   * properties will not fire this event.
   * 
   * Callback params:
   * 
   * @param isHorizontal `boolean` - `true` if the horizontal slider was chaged, or `false` if the
   * vertical slider was changed.
   * @param value `number` - The new value of the affected slider.
   * @param scroller `ContentScroller` - The affected content scroller.
   */
  CHANGED = 'changed',
}

export default ContentScrollerEvents;
