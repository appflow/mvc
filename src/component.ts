/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Builder of MVC pattern.
 */
import { Model } from './model';
import { View } from './view';
import { Element } from './element';
import { PossibleParent } from "./element-base";
import { Controller } from "./controller"

import $flow from '@appsflow/core'

export class Component extends $flow.ObjectBase {
    private readonly parent: PossibleParent;
    private readonly options: any;

    private readonly controller: Controller;
    private readonly model: Model;

    private view: any;
    private context: any;

    static getName() {
        return 'Flow/MVC/Component';
    }

    static getControllerClass(): typeof Controller | null {
        return null;
    }

    constructor( parent: PossibleParent, options = {} ) {
        super();

        this.parent = parent;
        this.options = options;

        this.controller = this.getController();

        if ( this.controller === null ) {
            this.controller = new class NullController extends Controller {
            };
        }

        // @ts-ignore
        let { model } = options;

        if ( ! model ) {
            const ModelClass = ( this.controller.constructor as typeof Controller ).getModelClass(),
                modelOptions = { owner: this };

            if ( ModelClass ) {
                model = new ModelClass( modelOptions );
            } else {
                model = new Model( modelOptions );
            }

            this.model = model;

            this.controller.setModel( this.model )
        }

        this.initialize( this.options );
    }

    initialize( options: any ) {
        let { view } = options;

        if ( ! view ) {
            const template = this.template() || this.options.template || '<div>_EMPTY_TEMPLATE_</div>';

            this.options.template = template;

            view = new View( this.parent, { template } );
        }

        /**
         * @type {$flow.View}
         */
        this.view = view;

        // Link context.
        this.context = view.element.context;

        this.hookAttachListeners();
    }

    hookAttachListeners() {
        if ( this.context.isConnected ) {
            Element.prototype.attachListenersFromContext.call( this.view.element, this.context, this );
        }

        this.view.element.afterRender = () => {
            Element.prototype.afterRender.call( this.view.element, false );
            Element.prototype.attachListenersFromContext.call( this.view.element, this.context, this );
        };
    }

    beforeRender() {
    }

    template(): any {
    }

    render() {
        this.beforeRender();

        this.view.render();

        this.afterRender();
    }

    afterRender() {
    }

    show() {
        this.view.element.show();
    }

    hide() {
        this.view.element.hide();
    }

    remove() {
        if ( this.view ) {
            this.view.destroy();
        }

        if ( this.model ) {
            this.model.destroy();
        }
    }

    getController(): any {
        let ControllerClass = ( this.constructor as typeof Component ).getControllerClass();

        // Bypass by null.
        if ( null === ControllerClass ) {
            return null;
        }

        if ( ControllerClass ) {
            // @ts-ignore
            return $flow.managers().controllers.get( ControllerClass.getName() ) ||
                // @ts-ignore
                $flow.managers().controllers.register( new ControllerClass( this ), this.model );
        }

        throw new Error( 'Controller not valid.' ); // TODO: Use custom error.
    }

    getView(): View {
        return this.view;
    }
}

export default Component;
