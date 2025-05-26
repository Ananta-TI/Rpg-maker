//=============================================================================
// CloudTheWolf - Bound Music Volume
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Bind BGM and ME Volumes 
 * @author CloudTheWolf
 * @url https://cloudthewolf.com
 *
 * @param bgmLabel
 * @text BGM Label Override
 * @type string
 * @default BGM Volume
 * 
 * @help This plugin allows you to Link the BGM and ME.
 */

(() => {
    const pluginName = 'ctw-bound-music-volume';
    const parameters = PluginManager.parameters(pluginName);    
    const bgmLabel = parameters['bgmLabel'] || "BGM Volume";

    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);        
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].symbol === 'meVolume') {
                this._list.splice(i, 1);
                i--;
            } else if (this._list[i].symbol === 'bgmVolume') {
                // Update BGM Volume label
                this._list[i].name = bgmLabel;
            }
        }
    }

    const _AudioManager_bgmVolume = Object.getOwnPropertyDescriptor(AudioManager, 'bgmVolume');
    const _AudioManager_meVolume = Object.getOwnPropertyDescriptor(AudioManager, 'meVolume');

    Object.defineProperty(AudioManager, 'bgmVolume', {
        get: function() {
            return _AudioManager_bgmVolume.get.call(this);
        },
        set: function(value) {
            _AudioManager_bgmVolume.set.call(this, value);
            _AudioManager_meVolume.set.call(this, value);
        },
        configurable: true
    });
})();
