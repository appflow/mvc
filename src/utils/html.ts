export default class HTML {
    static getName() {
        return 'Flow/MVC/Library/HTML';
    }

    static toNode( html: string ) {
        const template = document.createElement( 'template' );

        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;

        return template.content.firstChild;
    }

    static toNodes( html: string ) {
        const template = document.createElement( 'template' );

        template.innerHTML = html;

        return template.content.childNodes;
    }
}
