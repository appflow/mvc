/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: nope.
 */
import HTML from './utils/html';
import { Element } from './element'

export class Context {
    private readonly context: any;
    private node: String | HTMLElement | Context | ChildNode | null;

    static getName() {
        return 'Flow/MVC/Context';
    }

    constructor( context: any ) {
        this.context = context;
    }

    /**
     *
     * @returns {Node}
     */
    create() {
        this.beforeCreate();

        // Support JSX.
        if ( 'function' === typeof this.context ) {
            this.node = this.context();
        } else if ( this.context instanceof Element ) {
            this.node = this.context.context;
        } else {
            this.node = HTML.toNode( this.context );
        }

        this.afterCreate();

        return this.node;
    }

    beforeCreate() {
    }

    afterCreate() {
    }
}

export default Context;
