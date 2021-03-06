/**
 * All the events that fired by `ListViewComponent`.
 */
enum ListViewEvents {
  /**
   * Dispatched when the pointer is double-pressed while over a list entry in the list view. The
   * `isDoublePressEnabled` property of the `ListViewComponent` object must be set to `true`
   * in order for this event to be dispatched. The callback params are:
   * 
   * @param `callbackData`: [[`IListViewCallbackData`]]. The data associated with the event.
   * 
   * {@link IListViewCallbackData}
   */
  LIST_ITEM_DOUBLE_PRESSED = 'listItemDoublePressed',

  /**
   * Dispatched when the pointer is pressed down while over a list entry in the list view. The
   * callback params are:
   * 
   * @param `callbackData`: [[`IListViewCallbackData`]]. The data associated with the event.
   * 
   * {@link IListViewCallbackData}
   */
  LIST_ITEM_POINTER_DOWN = 'listItemPointerDown',

  /**
   * Dispatched when the pointer is moved out of a list entry in the list view. The callback
   * params are:
   * 
   * @param `callbackData`: [[`IListViewCallbackData`]]. The data associated with the event.
   * 
   * {@link IListViewCallbackData}
   */
  LIST_ITEM_POINTER_OUT = 'listItemPointerOut',
  
  /**
   * Dispatched when the pointer is initially moved over a list entry in the list view. The
   * callback params are:
   * 
   * @param `callbackData`: [[`IListViewCallbackData`]]. The data associated with the event.
   * 
   * {@link IListViewCallbackData}
   */
  LIST_ITEM_POINTER_OVER = 'listItemPointerOver',
  
  /**
   * Dispatched when the pointer is released over a list entry in the list view. The callback
   * params are:
   * 
   * @param `callbackData`: [[`IListViewCallbackData`]]. The data associated with the event.
   * 
   * {@link IListViewCallbackData}
   */
  LIST_ITEM_POINTER_UP = 'listItemPointerUp',
  
  /**
   * Dispatched when a list entry in the list view is pressed. The callback params are:
   * 
   * @param `callbackData`: [[`IListViewCallbackData`]]. The data associated with the event.
   * 
   * {@link IListViewCallbackData}
   */
  LIST_ITEM_PRESSED = 'listItemPressed',

  /**
   * Dispatched each time a slider component in the list view changes. The callback signature is:
   *
   * @param `isHzSlider`: `boolean`. `true` of the slider that changed was the horizontal, or
   * `false` if it was the vertical slider.
   *
   * @param `value`: `number`. The new value of the slider.
   *
   * @param `listView`: [[`ListViewComponent`]]. The list view component that owns the slider.
   */
  SLIDER_CHANGE = 'sliderChange',
}

export default ListViewEvents;
