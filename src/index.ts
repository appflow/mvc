import { Component } from './component';
import { Container } from './container';
import { Controller } from './controller';
import { Context } from './context';
import { Element } from "./element";
import { Factory } from './factory';
import { JsxElement } from './jsx-element';
import { Model } from './model';
import { View } from './view'

import pkg from "../package.json";

// @ts-ignore
if ( ! globalThis.$flow ) {
    throw new Error( 'Flow/Core: $flow is not defined, please make sure you have `@appflux/core` installed.' );
}

// @ts-ignore
if ( globalThis.$flow.$mvc ) {
    throw new Error( '`$flow.mvc` is already defined' );
}

// @ts-ignore
export const API = {
    Component,
    Controller,
    Container,
    Context,
    Element,
    Factory,
    JsxElement,
    Model,
    View,
}

// @ts-ignore
globalThis.$flow.config.mvc = {
    version: pkg.version,
}

// @ts-ignore
globalThis.$mvc = API;

