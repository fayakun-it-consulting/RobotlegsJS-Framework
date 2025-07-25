// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IContext } from "../api/IContext";
import { ILogger } from "../api/ILogger";
import { ExtensionInstance } from "./ExtensionInstance";
/**
 * Installs custom extensions into a given context
 *
 * @private
 */
export class ExtensionInstaller {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _classes: Map<any, any> = new Map<any, any>();

    private _context: IContext;

    private _logger: ILogger;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    public constructor(context: IContext) {
        this._context = context;
        this._logger = this._context.getLogger(this);
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * Installs the supplied extension
     *
     * @param extension An object or class implementing IExtension
     */
    public install(extension: any): void {
        if (typeof extension === "function" && extension.prototype.extend !== undefined) {
            if (!this._classes.get(extension)) {
                this.install(new extension());
            }
        } else {
            let extensionClass: any = <any>extension.constructor;
            if (!this._classes.get(extensionClass)) {
                this._logger.debug("Installing extension {0}", [extension]);

                let extensionInstance = new ExtensionInstance(extension, true);
                
                this._classes.set(extensionClass, extensionInstance);
                extension.extend(this._context);
            }
        }
    }

    public uninstall(extension: any): void{
        if (!extension){
            throw new Error("Invalid extension parameter.");
        }
        let existingExtension: ExtensionInstance = this._classes.get(extension);
        if (!existingExtension){
            throw new Error("This extension is non-existent.");
        }
        existingExtension.instance.unextend(this._context);
        this._classes.delete(extension);
    }
    /**
     * Destroy
     */
    public destroy(): void {
        this._classes.clear();
    }
}