// ------------------------------------------------------------------------------
//  Copyright (c) 2025 Fayakun IT Consulting. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

/**
 * Installs custom extensions into a given context
 *
 * @private
 */
export class ExtensionInstance{

    private _instance: Object;
    private _instanciated: boolean;

    /**
     * @private
     */
    public constructor(instance: Object, instanciated: boolean) {
        this._instance = instance;
        this._instanciated = instanciated;
    }
}
