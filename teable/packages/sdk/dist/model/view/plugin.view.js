import { PluginViewCore } from '@teable/core';
import { Mixin } from 'ts-mixer';
import { View } from './view';
export class PluginView extends Mixin(PluginViewCore, View) {
    async updateOption(_options) {
        throw new Error('Plugin view does not support update option');
    }
}
