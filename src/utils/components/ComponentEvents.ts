/**
 * Events that are fired by a component that extends `BaseComponent`.
 */
enum ComponentEvents {
  /**
   * Fired when a component is being destroyed. The callback params are:
   * 
   * @param `component`: `BaseComponent`. The component being destroyed.
   */
  DESTROY = 'destroy',

  /**
   * Fired when a "complex" component is done initializing.
   * 
   * Some components may require additional setup on the following execution frame after they have
   * been instantiated. If you try to use some methods on some components before they are done
   * initializing, the call may fail, or you may get an exception.
   * 
   * If you need to perform some action right away, listen for this callback as soon as you
   * instantiate the component. Add it as a "once" event, because it'll only fire once.
   * 
   * The callback parama are:
   * 
   * @param `component`: `BaseComponent`. The component that just finished initializing.
   */
  INIT = 'init',
}

export default ComponentEvents;
