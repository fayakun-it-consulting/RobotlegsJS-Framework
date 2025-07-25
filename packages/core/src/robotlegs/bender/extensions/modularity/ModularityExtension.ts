// ------------------------------------------------------------------------------
//  Copyright (c) 2017 RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

namespace robotlegs.bender.extensions.modularity {

    import { ContextView } from "../../extensions/contextView/impl/ContextView";
    import { instanceOfType } from "../matcher/instanceOfType";
    import { ContextViewBasedExistenceWatcher } from "./impl/ContextViewBasedExistenceWatcher";
    import { ViewManagerBasedExistenceWatcher } from "./impl/ViewManagerBasedExistenceWatcher";
    import { IViewManager } from "../viewManager/api/IViewManager";
    import { IModuleConnector } from "../api/IModuleConnector";
    import { ModuleConnector } from "./impl/ModuleConnector";
    import { ModularContextEvent } from "./impl/ModularContextEvent";
    import { IContext, IInjector, IExtension, ILogger } from "@robotlegsjs/core";


    /**
     * This extension allows a context to inherit dependencies from a parent context,
     * and/or expose its dependencies to child contexts.
     *
     * <p>It must be installed before context initialization.</p>
     */
    export class ModularityExtension implements IExtension {

        /*============================================================================*/
        /* Private Properties                                                         */
        /*============================================================================*/

        private _context: IContext;

        private _injector: IInjector;

        private _logger: ILogger;

        private _inherit: boolean;

        private _expose: boolean;

        private _contextView: HTMLElement

        private _observer: MutationObserver;
        /*============================================================================*/
        /* Constructor                                                                */
        /*============================================================================*/

        /**
         * Modularity
         *
         * @param inherit Should this context inherit dependencies from a parent context?
         * @param expose Should this context expose its dependencies to child contexts?
         */
        constructor(inherit: boolean = true, expose: boolean = true) {
            this._inherit = inherit;
            this._expose = expose;
        }

        /*============================================================================*/
        /* Public Functions                                                           */
        /*============================================================================*/

        /**
         * @inheritDoc
         */
        public extend(context: IContext): void {
            context.beforeInitializing(this.beforeInitializing);
            this._context = context;
            this._injector = context.injector;
            this._logger = context.getLogger(this);
            this._context.addConfigHandler(instanceOfType(ContextView), this.handleContextView);
            this._injector.map(IModuleConnector).toSingleton(ModuleConnector);
        }

        /*============================================================================*/
        /* Private Functions                                                          */
        /*============================================================================*/

        private beforeInitializing(): void {
            this._contextView || this._logger.error("Context has no ContextView, and ModularityExtension doesn't allow this.");
        }

        private handleContextView(contextView: ContextView): void {
            this._contextView = contextView.view;
            this._expose && this.configureExistenceWatcher();
            this._inherit && this.configureExistenceBroadcaster();
        }

        private configureExistenceWatcher(): void {
            if (this._injector.hasDirectMapping(IViewManager)) {
                this._logger.debug("Context has a ViewManager. Configuring view manager based context existence watcher...");
                var viewManager: IViewManager = this._injector.getInstance(IViewManager);
                new ViewManagerBasedExistenceWatcher(this._context, viewManager);
            }
            else {
                this._logger.debug("Context has a ContextView. Configuring context view based context existence watcher...");
                new ContextViewBasedExistenceWatcher(this._context, this._contextView);
            }
        }

        private configureExistenceBroadcaster(): void {
            if (this._contextView) {
                this.broadcastContextExistence();
            }
            else {
                this._logger.debug("Context view is not yet on stage. Waiting...");
                this._observer = new MutationObserver(this.observeChanges);

                const observerOptions = {
                    childList: true,
                    subtree: true,
                };

                this._observer.observe(this._contextView, observerOptions) 
                //this._contextView.addEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage);
            }
        }

        private observeChanges(records, observer): void{
            for (const addedNode of record.addedNodes) {
                this.onAddedToStage(null);
                break;
            }/*
            for (const removedNode of record.removedNodes) {
                log.textContent = `Removed: ${removedNode.textContent}\n${log.textContent}`;
            }*/
        }

        private onAddedToStage(event: Event): void {
            this._logger.debug("Context view is now on stage. Continuing...");
            //this._contextView.removeEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage);
            this._observer.disconnect();
            this.broadcastContextExistence();
        }

        /*
        private onRemovedFromStage(event: Event): void {
            this._logger.debug("Context view is now on stage. Continuing...");
            this._contextView.removeEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage);
            this.broadcastContextExistence();
        }*/

        private broadcastContextExistence(): void {
            this._logger.debug("Context configured to inherit. Broadcasting existence event...");
            this._contextView.dispatchEvent(new ModularContextEvent(ModularContextEvent.CONTEXT_ADD, this._context));
        }
    }
}
