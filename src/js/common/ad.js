   function playMusic(){
    var d = $;
    var f = function (a) {
        this._$globalAudio = a, this._$tip = d("<span></span>"), this.audio = this._$globalAudio.find("audio")[0], this.isAllowManually = !1, this.playState = "ready";
        var b = this;
        this._$globalAudio.append(this._$tip), this._$globalAudio.coffee({steams: ['<img src="/template/22/source/styles/img/musicalNotes.png"/>', '<img src="/template/22/source/styles/img/musicalNotes.png"/>', '<img src="/template/22/source/styles/img/musicalNotes.png"/>', '<img src="/template/22/source/styles/img/musicalNotes.png"/>', '<img src="/template/22/source/styles/img/musicalNotes.png"/>', '<img src="/template/22/source/styles/img/musicalNotes.png"/>'], steamHeight: 100, steamWidth: 50}), this.audio.autoplay && (this.audio.pause(), d(window).on("load", function () {
            b.play()
        })), d(window).on("load", function () {
            b.isAllowManually = !0
        }), this._$globalAudio.on(d.isPC ? "click" : "tap", function (a) {
            a.preventDefault(), b.isAllowManually && (b._$globalAudio.is(".z-play") ? b.pause() : b.play())
        }), d(document).one("touchstart", function () {
            b.audio.play()
        })
    };
    f.prototype.play = function () {
        this._$globalAudio.is(".z-play") || (this.audio.play(), this._$globalAudio.removeClass("z-pause").addClass("z-play"), this._showTip("开启"), this.playState = "playing", d.fn.coffee.start())
    }, f.prototype.pause = function () {
        this._$globalAudio.is(".z-pause") || (this.audio.pause(), this._$globalAudio.removeClass("z-play").addClass("z-pause"), this._showTip("关闭"), this.playState = "pause", d.fn.coffee.stop())
    }, f.prototype._showTip = function (a) {
        var b = this;
        this._$tip.text(a), this._$tip.addClass("z-show"), setTimeout(function () {
            b._$tip.removeClass("z-show")
        }, 1e3)
    };
    var g, h = d(".u-globalAudio");
//    g = h.length ? new f(d(".u-globalAudio")) : e.createEmptyObject(f), c.exports = g
    g = new f(d(".u-globalAudio"));
    return g;
   }

