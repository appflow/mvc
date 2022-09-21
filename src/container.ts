/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: nope.
 */
import ElementBase from './element-base';

export class Container extends ElementBase {
    static RENDER_WITHOUT_CHILD = 'RENDER_WITHOUT_CHILD';
    protected child: any;
    private events: { onAfterRender: ( Container: Container ) => void; onBeforeRender: ( container: Container ) => void };

    static getName() {
        return 'Flow/MVC/Container';
    }

    initialize() {
        this.events = {
            onBeforeRender: ( container: Container ) => {
            },
            onAfterRender: ( Container: Container ) => {
            },
        };

    }

    beforeRender() {
        const { onBeforeRender } = this.events;

        if ( onBeforeRender ) {
            onBeforeRender( this.child || Container.RENDER_WITHOUT_CHILD );
        }

        super.beforeRender();
    }

    render( preventDefault: boolean | undefined = false ): any {
        if ( ! preventDefault ) this.beforeRender();

        // Self Re-render.
        super.render( true );

        // Re-render of child.
        if ( this.child ) {
            // TODO THIS IS FINE?
            this.child.render( false );
        }

        if ( ! preventDefault ) this.afterRender();
    }

    afterRender() {
        super.afterRender();

        const { onAfterRender } = this.events;

        if ( onAfterRender ) {
            onAfterRender( this.child || Container.RENDER_WITHOUT_CHILD );
        }
    }


    set( child: Container ) {
        if ( ! ( child instanceof Container ) ) {
            throw new Error( 'Child required to be container' );
        }

        this.child = child;
    }

    /**
     * Function on() : Declare event callback
     *
     * @param {'render:before'|'render:after'} event
     * @param {{function()}} callback
     *
     * @returns {Boolean}
     */
    on( event: any, callback: { ( container: Container ): void; ( Container: Container ): void; } ) {
        switch ( event ) {
            case 'render:before':
                return !! ( this.events.onBeforeRender = callback );

            case 'render:after':
                return !! ( this.events.onAfterRender = callback );

            default:
                throw new Error( `${ this.constructor.name }::on() -> invalid event type: '${ event }'` );
        }
    }
}

export default Container;
