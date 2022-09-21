import Component from "../component";

import Model, { modelRefresh } from '../model'

let privateCounter = 0;

export class ArrayClass extends Array {
    private _virtualId: number;

    private _isCollectionModel: boolean;

    private readonly _parent: Model;

    constructor( parent: any, value: any = null ) {
        super();

        if ( value ) {
            Array.prototype.push.apply( this, value );
        }

        this._virtualId = privateCounter;
        this._isCollectionModel = true;

        if ( parent instanceof Model ) {
            this._parent = parent;
        }

        privateCounter++
    }

    filter( callback: any ) {
        const result = super.filter( callback ),
            newInstance = new ArrayClass( this._parent, result );

        modelRefresh( this._parent );

        return newInstance;
    }

    push( ... items: any[] ) {
        // TODO: Add silence.
        const result = super.push( ... items );

        modelRefresh( this._parent );

        return result;
    }

    pushSilent( item: any ) {
        return super.push( item );
    }

    clear() {
        // TODO: Check if it works, how it works, maybe test for it.
        if ( this.length ) {
            Object.values( this ).forEach( ( prop ) => {
                // TODO: It may not work since maybe, the prop is external declared.
                if ( prop instanceof Component ) {
                    prop.remove();
                }
            } );

            modelRefresh( this._parent );
        }

        this.length = 0;
    }
}

export default ArrayClass;
