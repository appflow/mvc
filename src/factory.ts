/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: nope.
 */
import { Element } from "./element";

export class Factory {
    static sharedReferences = {};

    static getName() {
        return 'Flow/MVC/Factory';
    }

    /**
     * @returns {$flow.Element|false}
     */
    static createElement( selector: any ) {
        selector = document.querySelector( selector );

        if ( ! selector?.parentElement ) {
            return false;
        }

        return new Element( selector.parentElement, selector );
    }

    static createElementRef( selector: any, reference: any ) {
        const element = this.createElement( selector );

        // @ts-ignore
        this.sharedReferences[ reference ] = element;

        return element;
    }

    static getElementRef( reference: any ) {
        // @ts-ignore
        return this.sharedReferences[ reference ];
    }
}

export default Factory;
