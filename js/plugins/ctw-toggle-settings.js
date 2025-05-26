//=============================================================================
// CloudTheWolf - Toggle Options
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Toggle visibility of settings in the Options Menu
 * @author CloudTheWolf
 * @url https://cloudthewolf.com
 * 
 * @param removeAlwaysDash
 * @text Remove Always Dash
 * @type boolean
 * @on Remove
 * @off Keep
 * @default false
 *
 * @param removeCommandRemember
 * @text Remove Command Remember
 * @type boolean
 * @on Remove
 * @off Keep
 * @default false
 *
 * @param removeTouchUI
 * @text Remove Touch UI
 * @type boolean
 * @on Remove
 * @off Keep
 * @default false
 *
 * @help This plugin allows you to remove the specified options from the options menu.
 */

(() => {
    const pluginName = 'ctw-toggle-settings';
    const parameters = PluginManager.parameters(pluginName);

    const removeAlwaysDash = parameters.removeAlwaysDash === 'true';
    const removeCommandRemember = parameters.removeCommandRemember === 'true';
    const removeTouchUI = parameters.removeTouchUI === 'true';

    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this._list = this._list.filter(item => {
            if (removeAlwaysDash && item.symbol === 'alwaysDash') return false;
            if (removeCommandRemember && item.symbol === 'commandRemember') return false;
            if (removeTouchUI && item.symbol === 'touchUI') return false;
            return true;
        });
    };
})();