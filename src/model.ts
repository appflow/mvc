/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Model, which contains all data for each controller, it should automatically detect changes within the model.
 */
import $flow from '@appsflow/core'
import hash from 'hash-it';
import ArrayClass from "./model/array-class";
import Component from "./component";

export const objectHash = ( obj: any ) => {
    return hash( obj );
}


/**
 * Function modelRefresh().
 *
 * Get current model state, and compare it with the previous state.
 * If changes detected, then tell the model about it own changes.
 *
 * @param {Model} model
 */
export const modelRefresh = ( model: any ) => {
    if ( ! model.getModelData ) {
        debugger;
    }
    const data = model.getModelData();

    if ( ! data ) {
        return;
    }

    const dataHash = objectHash( data );

    if ( dataHash === model._prevModelHash ) {
        return;
    }

    // @ts-ignore
    model._events?.onChange.forEach( ( event ) => event( {
        modelOnChange: data.virtualId,
        prevModel: model._prevModel,
        currentModel: data,
    } ) );

    model._prevModel = Object.assign( data );
    model._prevModelHash = dataHash;
}

export class Model extends $flow.ObjectBase {
    _cache = {};
    _cacheHash = {};
    _prevModel = {};
    _prevModelHash = {};
    _events = {
        onChange: [],
    };

    private _logger: any;

    get logger() {
        return this._logger;
    }

    set logger( value ) {
        this._logger = value;
    }

    static getName() {
        return 'Flow/MVC/Model';
    }

    constructor( options = {} ) {
        super();

        this._logger = new ( $flow.modules().Logger )( this.getName(), true, { sameColor: true } );

        // @ts-ignore
        if ( options.owner ) {
            // @ts-ignore
            this._logger.startWith( { owner: options.owner.getName() } );

            // @ts-ignore
        } else if ( Object.keys( this._options ).length ) {
            this._logger.startWith( { options } );
        } else {
            this._logger.startEmpty();
        }

        this.initialize();

        const self = this;

        // @ts-ignore
        let timeout;

        // TODO: Somehow model losing changes when logger is enabled ( JS Toke more time to handle ).
        // @ts-ignore
        return new Proxy( this, {
            set: function ( target, key, value ) {
                // @ts-ignore
                target[ key ] = value;

                // @ts-ignore
                if ( ! key.startsWith( '_' ) ) {
                    // @ts-ignore
                    if ( timeout ) {
                        // @ts-ignore
                        clearTimeout( timeout );
                    }

                    // @ts-ignore
                    const cacheExist = self._cache[ key ];

                    // @ts-ignore
                    self._cache[ key ] = value;

                    if ( value instanceof Object ) {
                        let dataHash;

                        try {
                            // @ts-ignore
                            self._cacheHash[ key ] = objectHash( value );
                        } catch ( e ) {
                        }

                        setTimeout( () => modelRefresh( self ) );
                        return true;
                    } else if ( value !== -1 && value !== '-1' && cacheExist !== undefined && cacheExist !== value ) {
                        timeout = setTimeout( () => modelRefresh( self ) );

                        return true;
                    }
                }

                return true;
            }
        } );
    }

    initialize() {
        modelRefresh( this );
    }

    getModelData() {
        const result = {},
            propertyNames = Object.getOwnPropertyNames( this );

        propertyNames.forEach( ( property ) => {
            if ( 'string' === typeof property && property.startsWith( '_' ) ) {
                return;
            }

            // @ts-ignore
            const prop = this[ property ];

            if ( prop instanceof ArrayClass ) {
                // If its array of components.
                // @ts-ignore
                if ( prop.some( ( instance ) => instance instanceof Component ) ) {
                    // @ts-ignore
                    result[ property ] = prop.map( ( prop ) => prop.getController().getModel().getModelData() );
                    return;
                }

                if ( ! prop.length ) {
                    return;
                }
            }

            // @ts-ignore
            result[ property ] = prop;
        } );

        return result;
    }

    destroy() {
        Object.getOwnPropertyNames( this ).forEach( ( key ) => {
            // @ts-ignore
            if ( this[ key ]?._isCollectionModel ) {

                // @ts-ignore
                this[ key ].forEach( ( item ) => {
                    item.getController()().getModel().destroy();
                } );
            }
        } )
    }

    /**
     * @returns {[]}
     */
    array() {
        return new ArrayClass( this );
    }

    /**
     * @returns String
     */
    string() {
        return String( -1 );
    }

    /**
     * @returns Number
     */
    number() {
        return Number( -1 )
    }

    /**
     * @returns boolean
     */
    boolean() {
        return Boolean( false )
    }

    /**
     * Function on() : Declare event callback
     *
     * @param {'change'} event
     * @param {{function()}} callback
     */

    // @ts-ignore
    on( event, callback ) {
        this.logger.startWith( { event, callback } );

        switch ( event ) {
            case 'change':

                // @ts-ignore
                return this._events.onChange.push( callback );
        }

        throw new Error( `event: '${ event }' not found.' ` );
    }
}

export default Model;
