/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: nope.
 */
import Context from './context';
import $flow from '@appsflow/core'

export type PossibleParent = Node | HTMLElement | ElementBase | Function;
export type PossibleContext = String | HTMLElement | Context

export abstract class ElementBase extends $flow.ObjectBase {
    context: String | HTMLElement | Context;
    protected element: HTMLElement;
    private readonly parent: PossibleParent;
    private options: {};

    static getName() {
        return 'Flow/MVC/Base/Element';
    }

    /**
     * Function constructor() : Create Custom Element.
     */
    constructor( parent: PossibleParent, context: PossibleContext, options = {} ) {
        super();

        if ( ! parent ) {
            throw Error( 'parent is required.' );
        }

        this.context = context;
        this.parent = parent;
        this.options = options;

        if ( context instanceof HTMLElement ) {
            this.element = context;
        } else if ( ! ( context instanceof Context ) ) {
            context = new Context( this.context );
        } else {
            throw Error( 'context is invalid' );
        }

        this.context = context;

        this.beforeInit();

        this.initialize( options );

        this.afterInit();
    }

    initialize( options = {} ) {
    }

    render( preventDefault: boolean | undefined = false ) {
        if ( ! preventDefault ) this.beforeRender();

        let parent = this.parent;

        if ( parent instanceof ElementBase ) {
            // @ts-ignore
            parent = this.parent.element;
        }

        // If its instance of HTMLElement then we assume it was rendered before.
        if ( this.context instanceof HTMLElement && this.context.isConnected ) {
            // Re-render.
            // @ts-ignore
            parent.removeChild( this.context );

            // Render
            // @ts-ignore
            parent.appendChild( this.context );
        } else if ( this.context instanceof Context ) {
            // Do not remove if its not attached to DOM.
            if ( this.element && this.element.isConnected ) {
                // @ts-ignore
                parent.removeChild( this.element );
            }

            // Support JSX callbacks.
            if ( 'function' === typeof parent ) {
                // @ts-ignore
                const _parent = parent();

                // Temporary work around for non existing elements.
                if ( ! _parent ) {
                    this.context.create();
                    // @ts-ignore
                    this.element = this.context.node;
                } else {
                    this.element = _parent.element.appendChild( this.context.create() );
                }
            } else {
                // Render.
                // @ts-ignore
                this.element = parent.appendChild( this.context.create() );
            }
        }

        if ( ! preventDefault ) this.afterRender();

        return this.element;
    }

    beforeInit() {
    }

    afterInit() {
    }

    beforeRender() {
    }

    afterRender() {
    }

    getElement() {
        return this.element;
    }
}

export default ElementBase;
