var itemsLayer;
var cat;
var xSpeed = 0; //カートの移動速度

var detectedX;　 //現在タッチしているX座標 end
var savedX;　 //前回タッチしていたX座標 orizin
var touching = false;　 //タッチ状況管理用flag

var i = 1;

var f = -1; //当たり判定で使う flag

var score1 = 0;
var score2 = 0;
var score3 = 0;

var time = 60;
var timelabel;

var audioEngine;

var gameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        gameLayer = new game();
        gameLayer.init();
        this.addChild(gameLayer);

        //音楽再生エンジン
        audioEngine = cc.audioEngine;
        //bgm再生
        if (!audioEngine.isMusicPlaying()) {
            audioEngine.playMusic(res.bgm_main, true);
        }
    }
});

var game = cc.Layer.extend({
    init: function() {
        this._super();
        //グラデーション背景
        //  var backgroundLayer = cc.LayerGradient.create(cc.color(0,0,0,255), cc.color(0x46,0x82,0xB4,255));

        //森の背景
        var background = new cc.Sprite(res.background_png);
        var size = cc.director.getWinSize();
        background.setPosition(cc.p(size.width / 2.0, size.height / 2.0));
        var backgroundLayer = cc.Layer.create();
        backgroundLayer.addChild(background);
        this.addChild(backgroundLayer);

        //アイテムがおちてくるレイヤー
        itemsLayer = cc.Layer.create();
        this.addChild(itemsLayer);

        //ショッピングカートを操作するレイヤー
        topLayer = cc.Layer.create();
        this.addChild(topLayer);
        cat = cc.Sprite.create(res.cat_png);
        basket = cc.Sprite.create(res.basket1_png);
        topLayer.addChild(cat, 5);
        topLayer.addChild(basket, 0);
        cat.addChild(basket, 0);
        basket.setPosition(280, 64);
        cat.setPosition(240, 64);
        this.schedule(this.addItem, 1);
        //タッチイベントのリスナー追加
        cc.eventManager.addListener(touchListener, this);
        //カートの移動のため　Update関数を1/60秒ごと実行させる　
        this.scheduleUpdate();

        var scorecounter = new cc.Sprite(res.game_counter_png);
        scorecounter.setPosition(cc.p(size.width * 0.865, size.height * 0.076));
        var score = cc.Layer.create();
        score.addChild(scorecounter, 0);
        this.addChild(score);

        scorelabel_1 = new cc.LabelTTF("0", "あんずもじ奏", 25);
        scorelabel_1.setPosition(cc.p(size.width * 0.96, size.height * 0.055));
        scorelabel_1.fillStyle = "black";
        this.addChild(scorelabel_1);

        scorelabel_2 = new cc.LabelTTF("0", "あんずもじ奏", 25);
        scorelabel_2.setPosition(cc.p(size.width * 0.9, size.height * 0.055));
        scorelabel_2.fillStyle = "black";
        this.addChild(scorelabel_2);

        scorelabel_3 = new cc.LabelTTF("0", "あんずもじ奏", 25);
        scorelabel_3.setPosition(cc.p(size.width * 0.83, size.height * 0.05));
        scorelabel_3.fillStyle = "black";
        this.addChild(scorelabel_3);

        var Timer_img = new cc.Sprite(res.Timer_png);
        Timer_img.setPosition(cc.p(size.width * 0.1, size.height * 0.9));

        var timer = cc.Layer.create();
        timer.addChild(Timer_img, 0);
        this.addChild(timer);


        timelabel = new cc.LabelTTF(time, "あんずもじ奏", 25);
        timelabel.setPosition(cc.p(size.width * 0.11, size.height * 0.9));
        timelabel.fillStyle = "black";
        this.addChild(timelabel);

    },
    addItem: function() {
        var item = new Item();
        itemsLayer.addChild(item, 1);
    },
    removeItem: function(item) {
        itemsLayer.removeChild(item);
    },
    timercount: function() {
        time--;
        if (time < 0) {
            time = 0;
            cc.director.runScene(new gameoverScene());
        }
        timelabel.setString(time);
    },
    //カートの移動のため　Update関数を1/60秒ごと実行させる関数
    update: function(dt) {
      this.schedule(this.timercount , 1);
        if (touching) {
            //現在タッチしているX座標と前回の座標の差分をとる
            var deltaX = savedX - detectedX;
            //保管場所　－　現在置
            //差分でカートが右にいくか左にいくかを判断する
            if (deltaX > 0) {
                xSpeed = -2;
                f = 1;
            }
            if (deltaX < 0) {
                xSpeed = 2;
                f = -1
            }
            //saveXに今回のX座標を代入し、onTouchMovedイベントで
            //detectedX変数が更新されても対応できるようにする
            savedX = detectedX; //移動中にタップの更新をしている
            if (xSpeed > 0) {
                cat.setFlippedX(true);
                basket.setPosition(basket.getPosition().x / 2, basket.getPosition().y);

                i += 1;

                if (i == 1) {
                    cat.initWithFile(res.cat1_png);
                    cat.setFlippedX(true);
                }

                if (i == 2) {
                    cat.initWithFile(res.cat2_png);
                    cat.setFlippedX(true);
                }

                if (i == 3) {
                    i = 0
                }


            }
            if (xSpeed < 0) {
                cat.setFlippedX(false);
                basket.setPosition(80, 64);
                i += 1;
                if (i == 1) {
                    cat.initWithFile(res.cat1_png);
                }

                if (i == 2) {
                    cat.initWithFile(res.cat2_png);
                }

                if (i == 3) {
                    i = 0
                }


            }
            cat.setPosition(cat.getPosition().x + xSpeed, cat.getPosition().y);
        }
    }

});
var Item = cc.Sprite.extend({
    ctor: function() {
        this._super();
        //ランダムに爆弾と果物を生成する
        if (Math.random() < 0.3) {
            this.initWithFile(res.bug_png);
            this.isbug = true;
        } else {
            this.initWithFile(res.apple_png);
            this.isbug = false;
        }
    },
    //アイテムが生成された後、描画されるときに実行
    onEnter: function() {
        this._super();
        //ランダムな位置に
        this.setPosition(Math.random() * 400 + 40, 350);
        //ランダムな座標に移動させる
        var moveAction = cc.MoveTo.create(8, new cc.Point(Math.random() * 400 + 40, -50));
        this.runAction(moveAction);
        this.scheduleUpdate();
    },
    update: function(dt) {
        //当たっているかの判定
        var bascetBoundingBox = cc.pAdd(cat.getPosition(), cc.p(50 * f, 30));
        var ringoBoundingBox = this.getBoundingBox();
        //交わっているかの確認
        var atari = cc.rectContainsPoint(ringoBoundingBox, bascetBoundingBox);
        //果物の処理　座標をチェックしてカートの接近したら
        if (atari) {
            gameLayer.removeItem(this);
            console.log("FRUIT");
            score1++;
            if (score1 > 9) {
                score2++;

                if (score2 > 9) {
                    score3++;
                    score2 = 0;
                    scorelabel_3.setString(score3);
                }
                score1 = 0;
                scorelabel_2.setString(score2);
            }
            scorelabel_1.setString(score1);
        }


        //爆弾の処理　座標をチェックしてカートの接近したら　フルーツより爆弾に当たりやすくしている
        if (this.getPosition().y < 35 && Math.abs(this.getPosition().x - cat.getPosition().x) < 25 &&
            this.isbug) {
            gameLayer.removeItem(this);
            console.log("bug");

        }
        //地面に落ちたアイテムは消去
        if (this.getPosition().y < 15) {
            gameLayer.removeItem(this)
        }
    }
});

//バーチャルアナログパッド用のタッチリスナーの実装
var touchListener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function(touch, event) {

        touching = true;
        //現在タッチ中のX座標を保持する変数へ代入
        detectedX = touch.getLocation().x;
        //前回タッチしていたX座標として代入
        savedX = detectedX;
        return true;
    },
    onTouchMoved: function(touch, event) {
        //現在タッチ中のX座標を保持する変数へ代入
        detectedX = touch.getLocation().x;
    },
    onTouchEnded: function(touch, event) {
        //タッチflagをOFF
        touching = false;
    }
})
