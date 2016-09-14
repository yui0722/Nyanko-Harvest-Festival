//title
var TitleLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();
        // 画像の追加
        var sprite = cc.Sprite.create(res.title_png);
        sprite.setPosition(size.width / 2, size.height / 2);
        sprite.setScale(0.8);
        this.addChild(sprite, 0);

        var sprite = cc.Sprite.create(res.start_png);
        sprite.setPosition(size.width / 2, size.height / 6);
        sprite.setScale(0.8);
        this.addChild(sprite, 1);

        // タップイベントリスナーを登録する
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
        return true;
    },
    onTouchBegan: function(touch, event) {
        return true;
    },
    onTouchMoved: function(touch, event) {},
    onTouchEnded: function(touch, event) {
        cc.director.runScene(new gameScene());
    },
});
var TitleScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        // 背景レイヤーをその場で作る
/*
        var backgroundLayer = cc.Sprite.create(res.title_bg_png);
        backgroundLayer.setPosition(size.width / 2, size.height / 6);
        backgroundLayer.setScale(0.8);
        this.addChild(backgroundLayer);
*/
        //ラベルとタップイベント取得
        var layer3 = new TitleLayer();
        this.addChild(layer3);

    }
});
