/*:
 *
 * @author Synrec/Kylestclr
 * @plugindesc [Free] Allows for Enemy HP Gauge
 * @target MZ
 * @url https://synrec.itch.io/rpg-maker-mz-enemy-hp-gauge
 * 
 * @help
 * Setup the gauge parameter prior to use
 * 
 * @param Gauge Setting
 * @desc Setup the default gauge
 * @type struct<gaugeSettings>
 * 
 */
/*~struct~gaugeSettings:
 * 
 * @param Name
 * @desc No function
 * @type text
 * @default Gauge
 * 
 * @param Identifier
 * @desc For assignment to enemy
 * @type text
 * @default gauge
 * 
 * @param Offset X
 * @desc Offsets the gauge position on the enemy
 * @type text
 * @default 0
 * 
 * @param Offset Y
 * @desc Offsets the gauge position on the enemy
 * @type text
 * @default 0
 * 
 * @param Width
 * @desc The size of the gauge
 * @type text
 * @default 300
 * 
 * @param Height
 * @desc The size of the gauge
 * @type text
 * @default 30
 * 
 * @param Border Size
 * @desc The gauge outline size
 * @type text
 * @default 2
 * 
 * @param Color
 * @desc Color when full
 * @type text
 * @default #00ff00
 * 
 * @param Border Color
 * @desc Color of the border
 * Use hex color with '#'
 * @type text
 * @default #000000
 * 
 * @param Label Text
 * @desc Draw enemy HP text
 * %1 = Current, %2 = Max
 * @type text
 * @default HP: %1/%2
 * 
 */

function GAUGE_SETTINGS_ENEMYHP(obj){
    try{
        obj = JSON.parse(obj);
        return obj;
    }catch(e){
        return;
    }
}

const Syn_EnemHp = {};
Syn_EnemHp.Plugin = PluginManager.parameters(`Synrec_EnemyHp_Free`);

Syn_EnemHp.GAUGE_CONFIGURATION = GAUGE_SETTINGS_ENEMYHP(Syn_EnemHp.Plugin['Gauge Setting'])

function Sprite_EnemyGaugeHp(){
    this.initialize(...arguments);
}

Sprite_EnemyGaugeHp.prototype = Object.create(Sprite.prototype);
Sprite_EnemyGaugeHp.prototype.constructor = Sprite_EnemyGaugeHp;

Sprite_EnemyGaugeHp.prototype.initialize = function(enemy_battler){
    Sprite.prototype.initialize.call(this);
    this._battler = enemy_battler;
    this.createLabelSprite();
    this.setup();
}

Sprite_EnemyGaugeHp.prototype.createLabelSprite = function(){
    const sprite = new Sprite();
    sprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
    this.addChild(sprite);
    this._label_sprite = sprite;
}

Sprite_EnemyGaugeHp.prototype.setup = function(){
    const battler = this._battler;
    const enem_data = battler.enemy();
    if(enem_data.meta['No HP Gauge'])return this._disabled = true;
    const config = Syn_EnemHp.GAUGE_CONFIGURATION;
    if(!config){
        this._disabled = true;
        return;
    }
    this.bitmap = new Bitmap(eval(config['Width']), eval(config['Height']));
    this.x = eval(config['Offset X']);
    this.y = eval(config['Offset Y']);
    this._configuration = JsonEx.makeDeepCopy(config);
}

Sprite_EnemyGaugeHp.prototype.update = function(){
    Sprite.prototype.update.call(this);
    if(this._disabled){
        this.visible = false;
        return;
    }
    this.updateBitmap();
    this.updateLabel();
    this.updateVisibility();
}

Sprite_EnemyGaugeHp.prototype.updateBitmap = function(){
    const a = this._battler;
    const hp_rate = a.hpRate();
    if(hp_rate != this._saved_rate){
        const config = this._configuration;
        const color = config['Color'];
        const color_border = config['Border Color'];
        const bs = eval(config['Border Size']);
        const w = eval(config['Width']);
        const fw = (w - (bs * 2)) * hp_rate;
        const h = eval(config['Height']);
        const bitmap = this.bitmap;
        bitmap.clear();
        bitmap.fillRect(0, 0, w, h, color_border);
        bitmap.fillRect(bs, bs, fw, h - (bs * 2), color);
        this._saved_rate = hp_rate;
    }
}

Sprite_EnemyGaugeHp.prototype.updateLabel = function(){
    const label_sprite = this._label_sprite;
    const label = label_sprite.bitmap;
    const battler = this._battler;
    const hp = battler.hp;
    const mhp = battler.mhp;
    const configuration = this._configuration;
    const text = (configuration['Label Text'] || "").format(hp, mhp);
    label.clear();
    label.drawText(text, 0, 0, Graphics.width, 36);
}

Sprite_EnemyGaugeHp.prototype.updateVisibility = function(){
    const battler = this._battler;
    this.visible = battler.isAlive();
}

Syn_EnemHp_SprtEnem_SetBatt = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function(battler) {
    Syn_EnemHp_SprtEnem_SetBatt.call(this, ...arguments);
    if(battler){
        this.createHpGauge(battler);
    }
}

Sprite_Enemy.prototype.createHpGauge = function(battler){
    const sprite = new Sprite_EnemyGaugeHp(battler);
    this.addChild(sprite);
}