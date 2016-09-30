var help = [res.howto1_pmg, res.howto2.png, res.howto3_png];
var num = 0;

var helpLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();
        // 画像の追加
        var sprite = cc.Sprite.create(res.title_png);
        sprite.setPosition(size.width / 2, size.height / 2);
        sprite.setScale(0.8);
        this.addChild(sprite, 0);

        var sprite = cc.Sprite.create(res.start_png);
        sprite.setPosition(size.width / 3, size.height / 6);
        sprite.setScale(0.8);
        this.addChild(sprite, 1);

        var sprite = cc.Sprite.create(res.help_png);
        sprite.setPosition(size.width / 1.2, size.height / 3);
        sprite.setScale(0.8);
        this.addChild(sprite, 1);

        var sprite = cc.Sprite.create(res.ranking_png);
        sprite.setPosition(size.width / 1.5, size.height / 6);
        sprite.setScale(0.8);
        this.addChild(sprite, 1);

        var sprite = cc.Sprite.create(res.dog_png);
        sprite.setPosition(size.width / 20, size.height / 6);
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
        num++;
        if(num < 3){
          num = 0;
          cc.director.runScene(new TitleLayer());
        }
        help_png.setTexture(help[num]);
    },
});
