import Element from './element';

export function JsxElement( tag: any, attributes: any, ... children: any ) {
    const appendChild = ( parent: any, child: any ) => {
        if ( Array.isArray( child ) ) {
            child.forEach( nestedChild => appendChild( parent, nestedChild ) )

        } else {

            parent.appendChild(
                child?.nodeType ? child : document.createTextNode( child )
            )
        }
    }

    const createElement = ( tag: any, props: any, children: any ) => {
        const element = document.createElement( tag )

        Object.entries( props || {} ).forEach( ( [ name, value ] ) => {
            // @ts-ignore
            element.setAttribute( name, value.toString() )
        } );

        children = children.filter( ( item: any ) => null !== item );

        // @ts-ignore
        children.forEach( function ( current ) {
            if ( current ) {
                appendChild( element, current );
            }
        } )

        return element;
    }

    if ( 'string' === typeof tag ) {
        return createElement( tag, attributes, children )
    }

    return Element;
}

export default JsxElement;