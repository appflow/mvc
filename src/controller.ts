/**
 * @author: Leonid Vinikov <czf.leo123@gmail.com>
 * @description: Builder of MVC pattern.
 */
import $flow from '@appsflow/core'
import Model from "./model";

export class Controller extends $flow.Controller {
    private model: Model;

    static getName() {
        return 'Flow/MVC/Controller';
    }

    static getModelClass(): typeof Model | null {
        return null;
    }

    getModel() {
        return this.model;
    }

    setModel( model: Model ) {
        this.model = model;
    }
}
