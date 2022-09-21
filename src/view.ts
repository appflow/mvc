/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: nope.
 */
import { Element } from './element';
import { PossibleParent } from "./element-base";

import $flow from '@appsflow/core'

export class View extends $flow.ObjectBase {
    element: Element;

    isRenderOnce = false;

    static getName() {
        return 'Flow/MVC/View';
    }

    constructor( parent: PossibleParent, options = {} ) {
        super();

        this.element = new Element(
            parent,
            // @ts-ignore
            options.template || this.template(),
            options,
        );

        this.initialize( options );
    }

    initialize( options: any ) {
    }

    template() {
        throw new ( $flow.errors().ForceMethod )( this, 'template' );
    }

    render() {
        this.isRenderOnce = true;
        this.element.render();
    }

    destroy() {
        // @ts-ignore
        const element = this.element.element;

        if ( element.isConnected ) {
            element.remove();
        }
    }
}

export default View;
