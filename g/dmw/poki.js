(() => {
  "use strict";
  const e = (e) => {
      const t = RegExp(`[?&]${e}=([^&]*)`).exec(window.location.search);
      return t && decodeURIComponent(t[1].replace(/\+/g, " "));
    },
    t = "kids" === e("tag"),
    o = !!window.adBridge,
    i = "yes" === e("hoist") || "yes" === e("gdhoist"),
    a = (parseInt(e("site_id") || "", 10) || 0) > 0,
    n = "car" === e("site_mode"),
    r = t || n;
  const s = new (class {
    #e = [];
    enqueue(e, t, o, i) {
      const a = { fn: e, args: t || [], resolveFn: o, rejectFn: i };
      r ? o && o(!0) : this.#e.push(a);
    }
    dequeue() {
      for (; this.#e.length > 0; ) {
        const e = this.#e.shift(),
          { fn: t, args: o } = e;
        if ("function" == typeof window.PokiSDK[t])
          if (e?.resolveFn || e?.rejectFn) {
            const i = "init" === t;
            if (
              (window.PokiSDK[t](...o)
                .catch((...t) => {
                  ("function" == typeof e.rejectFn && e.rejectFn(...t),
                    i &&
                      setTimeout(() => {
                        this.dequeue();
                      }, 0));
                })
                .then((...t) => {
                  ("function" == typeof e.resolveFn && e.resolveFn(...t),
                    i &&
                      setTimeout(() => {
                        this.dequeue();
                      }, 0));
                }),
              i)
            )
              break;
          } else window.PokiSDK[t](...o);
        else
          console.error(
            `%cPOKI:%c cannot execute ${t}`,
            "font-weight: bold",
            "",
          );
      }
    }
    init = (e = {}) =>
      new Promise((t, o) => {
        this.enqueue("init", [e], t, o);
      });
    rewardedBreak = () =>
      new Promise((e) => {
        e(!1);
      });
    commercialBreak = (e) =>
      new Promise((t, o) => {
        this.enqueue("commercialBreak", [e], t, o);
      });
    displayAd = (e, t, o, i) => {
      (i && i(!0), o && o());
    };
    withArguments =
      (e) =>
      (...t) => {
        this.enqueue(e, t);
      };
    withPromise = (e) => () =>
      new Promise((t, o) => {
        this.enqueue(e, [], t, o);
      });
    handleAutoResolvePromise = () =>
      new Promise((e) => {
        e();
      });
    throwNotLoaded = () => {
      console.debug(
        "PokiSDK is not loaded yet. Not all methods are available.",
      );
    };
    doNothing = () => {};
  })();
  if (
    ((window.PokiSDK = {
      init: s.init,
      initWithVideoHB: s.init,
      commercialBreak: s.commercialBreak,
      rewardedBreak: s.rewardedBreak,
      displayAd: s.displayAd,
      destroyAd: s.doNothing,
      getLeaderboard: s.handleAutoResolvePromise,
      shareableURL: () =>
        new Promise((e, t) => {
          t();
        }),
      getURLParam: (t) => e(`gd${t}`) || e(t) || "",
      getLanguage: () => navigator.language.toLowerCase().split("-")[0],
      getIsoLanguage: () => e("iso_lang") || void 0,
      isAdBlocked: () => {},
      getUser: s.withPromise("getUser"),
      getToken: s.withPromise("getToken"),
      login: s.withPromise("login"),
      generateScreenshot: s.withPromise("generateScreenshot"),
    }),
    [
      "captureError",
      "customEvent",
      "gameInteractive",
      "gameLoadingFinished",
      "gameLoadingProgress",
      "gameLoadingStart",
      "gameplayStart",
      "gameplayStop",
      "happyTime",
      "logError",
      "muteAd",
      "roundEnd",
      "roundStart",
      "sendHighscore",
      "setDebug",
      "setDebugTouchOverlayController",
      "setLogging",
      "setPlayerAge",
      "setPlaytestCanvas",
      "enableEventTracking",
      "openExternalLink",
      "playtestSetCanvas",
      "playtestCaptureHtmlOnce",
      "playtestCaptureHtmlForce",
      "playtestCaptureHtmlOn",
      "playtestCaptureHtmlOff",
      "movePill",
      "showLeaderboard",
    ].forEach((e) => {
      window.PokiSDK[e] = s.withArguments(e);
    }),
    !o && !t)
  )
    try {
      let t = localStorage.getItem("poki_events_user_id");
      t ||
        ((t = crypto.randomUUID()),
        "GB" !== e("country") &&
          localStorage.setItem("poki_events_user_id", t));
      const o = crypto.randomUUID(),
        i = e("game_id"),
        n = e("game_version_id"),
        r = "1" === localStorage.getItem("poki_pbf");
      ((window.PokiSDK.measure = (e, s, d) => {
        if (
          ((e = `${e}`),
          (s = void 0 === s ? "" : `${s}`),
          (d = void 0 === d ? "" : `${d}`),
          (window.pokiMeasureBuildin = !0),
          window.parent.postMessage(
            {
              type: "pokiMessageEvent",
              content: {
                event: "pokiTrackingMeasure",
                data: { category: e, action: s, label: d },
              },
            },
            "*",
          ),
          i && n)
        ) {
          const c = {
            category: e,
            action: s,
            label: d,
            p4d_game_id: i,
            p4d_version_id: n,
            time_on_page: Math.floor(performance.now()),
            user_id: t,
            user_new: !r,
            gameplay_id: o,
          };
          a
            ? window.parent.postMessage(
                { type: "pokiMessageSendGameEvent", content: { payload: c } },
                "*",
              )
            : fetch("https://t.poki.io/game-event", {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(c),
                mode: "no-cors",
                keepalive: !0,
                credentials: "omit",
              }).catch((e) => {
                console.warn(
                  "%cPOKI:%c failed to measure",
                  "font-weight: bold",
                  "",
                  e,
                );
              });
        }
      }),
        window.PokiSDK.measure("game", "loading", "start"),
        (window.pokiMeasureBuildin = !1));
    } catch (e) {
      (console.error(e), (window.PokiSDK.measure = () => {}));
    }
  if (!r) {
    const t = (() => {
        const t =
          window.pokiSDKVersion ||
          e("ab") ||
          "a4fb9553cab23a8d09065b1645a22cc070b6b33a";
        let a = `poki-sdk-core-${t}.js`;
        return (
          o && (a = `poki-sdk-playground-${t}.js`),
          i && (a = `poki-sdk-hoist-${t}.js`),
          console.log('o enabled', o, 'i enabled', i, 'loading', a),
          `poki-core.js`
        );
      })(),
      a = document.createElement("script");
    (a.setAttribute("src", t),
      a.setAttribute("type", "text/javascript"),
      a.setAttribute("crossOrigin", "anonymous"),
      (a.onload = () => s.dequeue()),
      document.head.appendChild(a));
  }
})();
