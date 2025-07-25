// ------------------------------------------------------------------------------
//  Copyright (c) 2017-present, RobotlegsJS. All Rights Reserved.
//
//  NOTICE: You are permitted to use, modify, and distribute this file
//  in accordance with the terms of the license agreement accompanying it.
// ------------------------------------------------------------------------------

import { IClass } from "@robotlegsjs/core";

import { ContainerBinding } from "./ContainerBinding";




/**
 * @private
 */
export class StageCrawler {
    /*============================================================================*/
    /* Private Properties                                                         */
    /*============================================================================*/

    private _binding: ContainerBinding;

    /*============================================================================*/
    /* Constructor                                                                */
    /*============================================================================*/

    /**
     * @private
     */
    constructor(containerBinding: ContainerBinding) {
        this._binding = containerBinding;
    }

    /*============================================================================*/
    /* Public Functions                                                           */
    /*============================================================================*/

    /**
     * @private
     */
    public scan(container: HTMLElement): void {
        this.scanContainer(container);
    }

    /*============================================================================*/
    /* Private Functions                                                          */
    /*============================================================================*/

    private scanContainer(container: HTMLElement): void {
        this.processView(container);

        for (let i: number = 0; i < container.numChildren; i++) {
            let child: Element = container.getChildAt(i);

            if (child instanceof HTMLElement) {
                this.scanContainer(child);
            } else {
                this.processView(child);
            }
        }
    }

    private processView(view: Element): void {
        this._binding.handleView(view, <IClass<any>>view.constructor);
    }
}
