// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.modularity.impl {

    import { IContext} from "../../../framework/api/IContext";
    import { ILogger} from "../../../framework/api/ILogger";
    import { ModularContextEvent } from "./ModularContextEvent";

    /**
     * @private
     */
    export class ContextViewBasedExistenceWatcher {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _logger: ILogger;

        private _contextView: HTMLElement

        private _context: IContext;

        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * @private
         */
        constructor(context: IContext, contextView: HTMLElement) {
            this._logger = context.getLogger(this);
            this._contextView = contextView;
            this._context = context;
            this._context.whenDestroying(this.destroy);
            this.init();
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private init(): void {
            this._logger.debug("Listening for context existence events on contextView {0}", [this._contextView]);
            this._contextView.addEventListener(ModularContextEvent.CONTEXT_ADD, this.onContextAdd);
        }

        private destroy(): void {
            this._logger.debug("Removing modular context existence event listener from contextView {0}", [this._contextView]);
            this._contextView.removeEventListener(ModularContextEvent.CONTEXT_ADD, this.onContextAdd);
        }

        private onContextAdd(event: ModularContextEvent): void {
            // We might catch out own existence event, so ignore that
            if (event.context != this._context) {
                event.stopImmediatePropagation();
                this._logger.debug("Context existence event caught. Configuring child context {0}", [event.context]);
                this._context.addChild(event.context);
            }
        }
    }
}
