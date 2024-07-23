import { defineComponent as bn, reactive as Cn, watch as Mr, onMounted as Rn, onBeforeUnmount as Sn, openBlock as Tn, createElementBlock as Pn, pushScopeId as On, popScopeId as En, createElementVNode as zr } from "vue";
function Mn(d, y) {
  for (var t = 0; t < y.length; t++) {
    const o = y[t];
    if (typeof o != "string" && !Array.isArray(o)) {
      for (const e in o)
        if (e !== "default" && !(e in d)) {
          const r = Object.getOwnPropertyDescriptor(o, e);
          r && Object.defineProperty(d, e, r.get ? r : {
            enumerable: !0,
            get: () => o[e]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(d, Symbol.toStringTag, { value: "Module" }));
}
let Ur = !0, Fr = !0;
function Ft(d, y, t) {
  const o = d.match(y);
  return o && o.length >= t && parseInt(o[t], 10);
}
function Ge(d, y, t) {
  if (!d.RTCPeerConnection)
    return;
  const o = d.RTCPeerConnection.prototype, e = o.addEventListener;
  o.addEventListener = function(i, a) {
    if (i !== y)
      return e.apply(this, arguments);
    const c = (p) => {
      const g = t(p);
      g && (a.handleEvent ? a.handleEvent(g) : a(g));
    };
    return this._eventMap = this._eventMap || {}, this._eventMap[y] || (this._eventMap[y] = /* @__PURE__ */ new Map()), this._eventMap[y].set(a, c), e.apply(this, [
      i,
      c
    ]);
  };
  const r = o.removeEventListener;
  o.removeEventListener = function(i, a) {
    if (i !== y || !this._eventMap || !this._eventMap[y])
      return r.apply(this, arguments);
    if (!this._eventMap[y].has(a))
      return r.apply(this, arguments);
    const c = this._eventMap[y].get(a);
    return this._eventMap[y].delete(a), this._eventMap[y].size === 0 && delete this._eventMap[y], Object.keys(this._eventMap).length === 0 && delete this._eventMap, r.apply(this, [
      i,
      c
    ]);
  }, Object.defineProperty(o, "on" + y, {
    get() {
      return this["_on" + y];
    },
    set(i) {
      this["_on" + y] && (this.removeEventListener(
        y,
        this["_on" + y]
      ), delete this["_on" + y]), i && this.addEventListener(
        y,
        this["_on" + y] = i
      );
    },
    enumerable: !0,
    configurable: !0
  });
}
function kn(d) {
  return typeof d != "boolean" ? new Error("Argument type: " + typeof d + ". Please use a boolean.") : (Ur = d, d ? "adapter.js logging disabled" : "adapter.js logging enabled");
}
function An(d) {
  return typeof d != "boolean" ? new Error("Argument type: " + typeof d + ". Please use a boolean.") : (Fr = !d, "adapter.js deprecation warnings " + (d ? "disabled" : "enabled"));
}
function wr() {
  if (typeof window == "object") {
    if (Ur)
      return;
    typeof console < "u" && typeof console.log == "function" && console.log.apply(console, arguments);
  }
}
function Er(d, y) {
  Fr && console.warn(d + " is deprecated, please use " + y + " instead.");
}
function Dn(d) {
  const y = { browser: null, version: null };
  if (typeof d > "u" || !d.navigator || !d.navigator.userAgent)
    return y.browser = "Not a browser.", y;
  const { navigator: t } = d;
  if (t.userAgentData && t.userAgentData.brands) {
    const o = t.userAgentData.brands.find((e) => e.brand === "Chromium");
    if (o)
      return { browser: "chrome", version: parseInt(o.version, 10) };
  }
  if (t.mozGetUserMedia)
    y.browser = "firefox", y.version = Ft(
      t.userAgent,
      /Firefox\/(\d+)\./,
      1
    );
  else if (t.webkitGetUserMedia || d.isSecureContext === !1 && d.webkitRTCPeerConnection)
    y.browser = "chrome", y.version = Ft(
      t.userAgent,
      /Chrom(e|ium)\/(\d+)\./,
      2
    );
  else if (d.RTCPeerConnection && t.userAgent.match(/AppleWebKit\/(\d+)\./))
    y.browser = "safari", y.version = Ft(
      t.userAgent,
      /AppleWebKit\/(\d+)\./,
      1
    ), y.supportsUnifiedPlan = d.RTCRtpTransceiver && "currentDirection" in d.RTCRtpTransceiver.prototype;
  else
    return y.browser = "Not a supported browser.", y;
  return y;
}
function kr(d) {
  return Object.prototype.toString.call(d) === "[object Object]";
}
function Nr(d) {
  return kr(d) ? Object.keys(d).reduce(function(y, t) {
    const o = kr(d[t]), e = o ? Nr(d[t]) : d[t], r = o && !Object.keys(e).length;
    return e === void 0 || r ? y : Object.assign(y, { [t]: e });
  }, {}) : d;
}
function Cr(d, y, t) {
  !y || t.has(y.id) || (t.set(y.id, y), Object.keys(y).forEach((o) => {
    o.endsWith("Id") ? Cr(d, d.get(y[o]), t) : o.endsWith("Ids") && y[o].forEach((e) => {
      Cr(d, d.get(e), t);
    });
  }));
}
function Ar(d, y, t) {
  const o = t ? "outbound-rtp" : "inbound-rtp", e = /* @__PURE__ */ new Map();
  if (y === null)
    return e;
  const r = [];
  return d.forEach((i) => {
    i.type === "track" && i.trackIdentifier === y.id && r.push(i);
  }), r.forEach((i) => {
    d.forEach((a) => {
      a.type === o && a.trackId === i.id && Cr(d, a, e);
    });
  }), e;
}
const Dr = wr;
function Br(d, y) {
  const t = d && d.navigator;
  if (!t.mediaDevices)
    return;
  const o = function(a) {
    if (typeof a != "object" || a.mandatory || a.optional)
      return a;
    const c = {};
    return Object.keys(a).forEach((p) => {
      if (p === "require" || p === "advanced" || p === "mediaSource")
        return;
      const g = typeof a[p] == "object" ? a[p] : { ideal: a[p] };
      g.exact !== void 0 && typeof g.exact == "number" && (g.min = g.max = g.exact);
      const T = function(P, z) {
        return P ? P + z.charAt(0).toUpperCase() + z.slice(1) : z === "deviceId" ? "sourceId" : z;
      };
      if (g.ideal !== void 0) {
        c.optional = c.optional || [];
        let P = {};
        typeof g.ideal == "number" ? (P[T("min", p)] = g.ideal, c.optional.push(P), P = {}, P[T("max", p)] = g.ideal, c.optional.push(P)) : (P[T("", p)] = g.ideal, c.optional.push(P));
      }
      g.exact !== void 0 && typeof g.exact != "number" ? (c.mandatory = c.mandatory || {}, c.mandatory[T("", p)] = g.exact) : ["min", "max"].forEach((P) => {
        g[P] !== void 0 && (c.mandatory = c.mandatory || {}, c.mandatory[T(P, p)] = g[P]);
      });
    }), a.advanced && (c.optional = (c.optional || []).concat(a.advanced)), c;
  }, e = function(a, c) {
    if (y.version >= 61)
      return c(a);
    if (a = JSON.parse(JSON.stringify(a)), a && typeof a.audio == "object") {
      const p = function(g, T, P) {
        T in g && !(P in g) && (g[P] = g[T], delete g[T]);
      };
      a = JSON.parse(JSON.stringify(a)), p(a.audio, "autoGainControl", "googAutoGainControl"), p(a.audio, "noiseSuppression", "googNoiseSuppression"), a.audio = o(a.audio);
    }
    if (a && typeof a.video == "object") {
      let p = a.video.facingMode;
      p = p && (typeof p == "object" ? p : { ideal: p });
      const g = y.version < 66;
      if (p && (p.exact === "user" || p.exact === "environment" || p.ideal === "user" || p.ideal === "environment") && !(t.mediaDevices.getSupportedConstraints && t.mediaDevices.getSupportedConstraints().facingMode && !g)) {
        delete a.video.facingMode;
        let T;
        if (p.exact === "environment" || p.ideal === "environment" ? T = ["back", "rear"] : (p.exact === "user" || p.ideal === "user") && (T = ["front"]), T)
          return t.mediaDevices.enumerateDevices().then((P) => {
            P = P.filter((I) => I.kind === "videoinput");
            let z = P.find((I) => T.some((q) => I.label.toLowerCase().includes(q)));
            return !z && P.length && T.includes("back") && (z = P[P.length - 1]), z && (a.video.deviceId = p.exact ? { exact: z.deviceId } : { ideal: z.deviceId }), a.video = o(a.video), Dr("chrome: " + JSON.stringify(a)), c(a);
          });
      }
      a.video = o(a.video);
    }
    return Dr("chrome: " + JSON.stringify(a)), c(a);
  }, r = function(a) {
    return y.version >= 64 ? a : {
      name: {
        PermissionDeniedError: "NotAllowedError",
        PermissionDismissedError: "NotAllowedError",
        InvalidStateError: "NotAllowedError",
        DevicesNotFoundError: "NotFoundError",
        ConstraintNotSatisfiedError: "OverconstrainedError",
        TrackStartError: "NotReadableError",
        MediaDeviceFailedDueToShutdown: "NotAllowedError",
        MediaDeviceKillSwitchOn: "NotAllowedError",
        TabCaptureError: "AbortError",
        ScreenCaptureError: "AbortError",
        DeviceCaptureError: "AbortError"
      }[a.name] || a.name,
      message: a.message,
      constraint: a.constraint || a.constraintName,
      toString() {
        return this.name + (this.message && ": ") + this.message;
      }
    };
  }, i = function(a, c, p) {
    e(a, (g) => {
      t.webkitGetUserMedia(g, c, (T) => {
        p && p(r(T));
      });
    });
  };
  if (t.getUserMedia = i.bind(t), t.mediaDevices.getUserMedia) {
    const a = t.mediaDevices.getUserMedia.bind(t.mediaDevices);
    t.mediaDevices.getUserMedia = function(c) {
      return e(c, (p) => a(p).then((g) => {
        if (p.audio && !g.getAudioTracks().length || p.video && !g.getVideoTracks().length)
          throw g.getTracks().forEach((T) => {
            T.stop();
          }), new DOMException("", "NotFoundError");
        return g;
      }, (g) => Promise.reject(r(g))));
    };
  }
}
function Wr(d) {
  d.MediaStream = d.MediaStream || d.webkitMediaStream;
}
function Gr(d) {
  if (typeof d == "object" && d.RTCPeerConnection && !("ontrack" in d.RTCPeerConnection.prototype)) {
    Object.defineProperty(d.RTCPeerConnection.prototype, "ontrack", {
      get() {
        return this._ontrack;
      },
      set(t) {
        this._ontrack && this.removeEventListener("track", this._ontrack), this.addEventListener("track", this._ontrack = t);
      },
      enumerable: !0,
      configurable: !0
    });
    const y = d.RTCPeerConnection.prototype.setRemoteDescription;
    d.RTCPeerConnection.prototype.setRemoteDescription = function() {
      return this._ontrackpoly || (this._ontrackpoly = (o) => {
        o.stream.addEventListener("addtrack", (e) => {
          let r;
          d.RTCPeerConnection.prototype.getReceivers ? r = this.getReceivers().find((a) => a.track && a.track.id === e.track.id) : r = { track: e.track };
          const i = new Event("track");
          i.track = e.track, i.receiver = r, i.transceiver = { receiver: r }, i.streams = [o.stream], this.dispatchEvent(i);
        }), o.stream.getTracks().forEach((e) => {
          let r;
          d.RTCPeerConnection.prototype.getReceivers ? r = this.getReceivers().find((a) => a.track && a.track.id === e.id) : r = { track: e };
          const i = new Event("track");
          i.track = e, i.receiver = r, i.transceiver = { receiver: r }, i.streams = [o.stream], this.dispatchEvent(i);
        });
      }, this.addEventListener("addstream", this._ontrackpoly)), y.apply(this, arguments);
    };
  } else
    Ge(d, "track", (y) => (y.transceiver || Object.defineProperty(
      y,
      "transceiver",
      { value: { receiver: y.receiver } }
    ), y));
}
function qr(d) {
  if (typeof d == "object" && d.RTCPeerConnection && !("getSenders" in d.RTCPeerConnection.prototype) && "createDTMFSender" in d.RTCPeerConnection.prototype) {
    const y = function(e, r) {
      return {
        track: r,
        get dtmf() {
          return this._dtmf === void 0 && (r.kind === "audio" ? this._dtmf = e.createDTMFSender(r) : this._dtmf = null), this._dtmf;
        },
        _pc: e
      };
    };
    if (!d.RTCPeerConnection.prototype.getSenders) {
      d.RTCPeerConnection.prototype.getSenders = function() {
        return this._senders = this._senders || [], this._senders.slice();
      };
      const e = d.RTCPeerConnection.prototype.addTrack;
      d.RTCPeerConnection.prototype.addTrack = function(a, c) {
        let p = e.apply(this, arguments);
        return p || (p = y(this, a), this._senders.push(p)), p;
      };
      const r = d.RTCPeerConnection.prototype.removeTrack;
      d.RTCPeerConnection.prototype.removeTrack = function(a) {
        r.apply(this, arguments);
        const c = this._senders.indexOf(a);
        c !== -1 && this._senders.splice(c, 1);
      };
    }
    const t = d.RTCPeerConnection.prototype.addStream;
    d.RTCPeerConnection.prototype.addStream = function(r) {
      this._senders = this._senders || [], t.apply(this, [r]), r.getTracks().forEach((i) => {
        this._senders.push(y(this, i));
      });
    };
    const o = d.RTCPeerConnection.prototype.removeStream;
    d.RTCPeerConnection.prototype.removeStream = function(r) {
      this._senders = this._senders || [], o.apply(this, [r]), r.getTracks().forEach((i) => {
        const a = this._senders.find((c) => c.track === i);
        a && this._senders.splice(this._senders.indexOf(a), 1);
      });
    };
  } else if (typeof d == "object" && d.RTCPeerConnection && "getSenders" in d.RTCPeerConnection.prototype && "createDTMFSender" in d.RTCPeerConnection.prototype && d.RTCRtpSender && !("dtmf" in d.RTCRtpSender.prototype)) {
    const y = d.RTCPeerConnection.prototype.getSenders;
    d.RTCPeerConnection.prototype.getSenders = function() {
      const o = y.apply(this, []);
      return o.forEach((e) => e._pc = this), o;
    }, Object.defineProperty(d.RTCRtpSender.prototype, "dtmf", {
      get() {
        return this._dtmf === void 0 && (this.track.kind === "audio" ? this._dtmf = this._pc.createDTMFSender(this.track) : this._dtmf = null), this._dtmf;
      }
    });
  }
}
function Vr(d) {
  if (!(typeof d == "object" && d.RTCPeerConnection && d.RTCRtpSender && d.RTCRtpReceiver))
    return;
  if (!("getStats" in d.RTCRtpSender.prototype)) {
    const t = d.RTCPeerConnection.prototype.getSenders;
    t && (d.RTCPeerConnection.prototype.getSenders = function() {
      const r = t.apply(this, []);
      return r.forEach((i) => i._pc = this), r;
    });
    const o = d.RTCPeerConnection.prototype.addTrack;
    o && (d.RTCPeerConnection.prototype.addTrack = function() {
      const r = o.apply(this, arguments);
      return r._pc = this, r;
    }), d.RTCRtpSender.prototype.getStats = function() {
      const r = this;
      return this._pc.getStats().then((i) => (
        /* Note: this will include stats of all senders that
         *   send a track with the same id as sender.track as
         *   it is not possible to identify the RTCRtpSender.
         */
        Ar(i, r.track, !0)
      ));
    };
  }
  if (!("getStats" in d.RTCRtpReceiver.prototype)) {
    const t = d.RTCPeerConnection.prototype.getReceivers;
    t && (d.RTCPeerConnection.prototype.getReceivers = function() {
      const e = t.apply(this, []);
      return e.forEach((r) => r._pc = this), e;
    }), Ge(d, "track", (o) => (o.receiver._pc = o.srcElement, o)), d.RTCRtpReceiver.prototype.getStats = function() {
      const e = this;
      return this._pc.getStats().then((r) => Ar(r, e.track, !1));
    };
  }
  if (!("getStats" in d.RTCRtpSender.prototype && "getStats" in d.RTCRtpReceiver.prototype))
    return;
  const y = d.RTCPeerConnection.prototype.getStats;
  d.RTCPeerConnection.prototype.getStats = function() {
    if (arguments.length > 0 && arguments[0] instanceof d.MediaStreamTrack) {
      const o = arguments[0];
      let e, r, i;
      return this.getSenders().forEach((a) => {
        a.track === o && (e ? i = !0 : e = a);
      }), this.getReceivers().forEach((a) => (a.track === o && (r ? i = !0 : r = a), a.track === o)), i || e && r ? Promise.reject(new DOMException(
        "There are more than one sender or receiver for the track.",
        "InvalidAccessError"
      )) : e ? e.getStats() : r ? r.getStats() : Promise.reject(new DOMException(
        "There is no sender or receiver for the track.",
        "InvalidAccessError"
      ));
    }
    return y.apply(this, arguments);
  };
}
function Hr(d) {
  d.RTCPeerConnection.prototype.getLocalStreams = function() {
    return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, Object.keys(this._shimmedLocalStreams).map((i) => this._shimmedLocalStreams[i][0]);
  };
  const y = d.RTCPeerConnection.prototype.addTrack;
  d.RTCPeerConnection.prototype.addTrack = function(i, a) {
    if (!a)
      return y.apply(this, arguments);
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    const c = y.apply(this, arguments);
    return this._shimmedLocalStreams[a.id] ? this._shimmedLocalStreams[a.id].indexOf(c) === -1 && this._shimmedLocalStreams[a.id].push(c) : this._shimmedLocalStreams[a.id] = [a, c], c;
  };
  const t = d.RTCPeerConnection.prototype.addStream;
  d.RTCPeerConnection.prototype.addStream = function(i) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {}, i.getTracks().forEach((p) => {
      if (this.getSenders().find((T) => T.track === p))
        throw new DOMException(
          "Track already exists.",
          "InvalidAccessError"
        );
    });
    const a = this.getSenders();
    t.apply(this, arguments);
    const c = this.getSenders().filter((p) => a.indexOf(p) === -1);
    this._shimmedLocalStreams[i.id] = [i].concat(c);
  };
  const o = d.RTCPeerConnection.prototype.removeStream;
  d.RTCPeerConnection.prototype.removeStream = function(i) {
    return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, delete this._shimmedLocalStreams[i.id], o.apply(this, arguments);
  };
  const e = d.RTCPeerConnection.prototype.removeTrack;
  d.RTCPeerConnection.prototype.removeTrack = function(i) {
    return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, i && Object.keys(this._shimmedLocalStreams).forEach((a) => {
      const c = this._shimmedLocalStreams[a].indexOf(i);
      c !== -1 && this._shimmedLocalStreams[a].splice(c, 1), this._shimmedLocalStreams[a].length === 1 && delete this._shimmedLocalStreams[a];
    }), e.apply(this, arguments);
  };
}
function Xr(d, y) {
  if (!d.RTCPeerConnection)
    return;
  if (d.RTCPeerConnection.prototype.addTrack && y.version >= 65)
    return Hr(d);
  const t = d.RTCPeerConnection.prototype.getLocalStreams;
  d.RTCPeerConnection.prototype.getLocalStreams = function() {
    const g = t.apply(this);
    return this._reverseStreams = this._reverseStreams || {}, g.map((T) => this._reverseStreams[T.id]);
  };
  const o = d.RTCPeerConnection.prototype.addStream;
  d.RTCPeerConnection.prototype.addStream = function(g) {
    if (this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, g.getTracks().forEach((T) => {
      if (this.getSenders().find((z) => z.track === T))
        throw new DOMException(
          "Track already exists.",
          "InvalidAccessError"
        );
    }), !this._reverseStreams[g.id]) {
      const T = new d.MediaStream(g.getTracks());
      this._streams[g.id] = T, this._reverseStreams[T.id] = g, g = T;
    }
    o.apply(this, [g]);
  };
  const e = d.RTCPeerConnection.prototype.removeStream;
  d.RTCPeerConnection.prototype.removeStream = function(g) {
    this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, e.apply(this, [this._streams[g.id] || g]), delete this._reverseStreams[this._streams[g.id] ? this._streams[g.id].id : g.id], delete this._streams[g.id];
  }, d.RTCPeerConnection.prototype.addTrack = function(g, T) {
    if (this.signalingState === "closed")
      throw new DOMException(
        "The RTCPeerConnection's signalingState is 'closed'.",
        "InvalidStateError"
      );
    const P = [].slice.call(arguments, 1);
    if (P.length !== 1 || !P[0].getTracks().find((q) => q === g))
      throw new DOMException(
        "The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.",
        "NotSupportedError"
      );
    if (this.getSenders().find((q) => q.track === g))
      throw new DOMException(
        "Track already exists.",
        "InvalidAccessError"
      );
    this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {};
    const I = this._streams[T.id];
    if (I)
      I.addTrack(g), Promise.resolve().then(() => {
        this.dispatchEvent(new Event("negotiationneeded"));
      });
    else {
      const q = new d.MediaStream([g]);
      this._streams[T.id] = q, this._reverseStreams[q.id] = T, this.addStream(q);
    }
    return this.getSenders().find((q) => q.track === g);
  };
  function r(p, g) {
    let T = g.sdp;
    return Object.keys(p._reverseStreams || []).forEach((P) => {
      const z = p._reverseStreams[P], I = p._streams[z.id];
      T = T.replace(
        new RegExp(I.id, "g"),
        z.id
      );
    }), new RTCSessionDescription({
      type: g.type,
      sdp: T
    });
  }
  function i(p, g) {
    let T = g.sdp;
    return Object.keys(p._reverseStreams || []).forEach((P) => {
      const z = p._reverseStreams[P], I = p._streams[z.id];
      T = T.replace(
        new RegExp(z.id, "g"),
        I.id
      );
    }), new RTCSessionDescription({
      type: g.type,
      sdp: T
    });
  }
  ["createOffer", "createAnswer"].forEach(function(p) {
    const g = d.RTCPeerConnection.prototype[p], T = { [p]() {
      const P = arguments;
      return arguments.length && typeof arguments[0] == "function" ? g.apply(this, [
        (I) => {
          const q = r(this, I);
          P[0].apply(null, [q]);
        },
        (I) => {
          P[1] && P[1].apply(null, I);
        },
        arguments[2]
      ]) : g.apply(this, arguments).then((I) => r(this, I));
    } };
    d.RTCPeerConnection.prototype[p] = T[p];
  });
  const a = d.RTCPeerConnection.prototype.setLocalDescription;
  d.RTCPeerConnection.prototype.setLocalDescription = function() {
    return !arguments.length || !arguments[0].type ? a.apply(this, arguments) : (arguments[0] = i(this, arguments[0]), a.apply(this, arguments));
  };
  const c = Object.getOwnPropertyDescriptor(
    d.RTCPeerConnection.prototype,
    "localDescription"
  );
  Object.defineProperty(
    d.RTCPeerConnection.prototype,
    "localDescription",
    {
      get() {
        const p = c.get.apply(this);
        return p.type === "" ? p : r(this, p);
      }
    }
  ), d.RTCPeerConnection.prototype.removeTrack = function(g) {
    if (this.signalingState === "closed")
      throw new DOMException(
        "The RTCPeerConnection's signalingState is 'closed'.",
        "InvalidStateError"
      );
    if (!g._pc)
      throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
    if (!(g._pc === this))
      throw new DOMException(
        "Sender was not created by this connection.",
        "InvalidAccessError"
      );
    this._streams = this._streams || {};
    let P;
    Object.keys(this._streams).forEach((z) => {
      this._streams[z].getTracks().find((q) => g.track === q) && (P = this._streams[z]);
    }), P && (P.getTracks().length === 1 ? this.removeStream(this._reverseStreams[P.id]) : P.removeTrack(g.track), this.dispatchEvent(new Event("negotiationneeded")));
  };
}
function Rr(d, y) {
  !d.RTCPeerConnection && d.webkitRTCPeerConnection && (d.RTCPeerConnection = d.webkitRTCPeerConnection), d.RTCPeerConnection && y.version < 53 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(t) {
    const o = d.RTCPeerConnection.prototype[t], e = { [t]() {
      return arguments[0] = new (t === "addIceCandidate" ? d.RTCIceCandidate : d.RTCSessionDescription)(arguments[0]), o.apply(this, arguments);
    } };
    d.RTCPeerConnection.prototype[t] = e[t];
  });
}
function Jr(d, y) {
  Ge(d, "negotiationneeded", (t) => {
    const o = t.target;
    if (!((y.version < 72 || o.getConfiguration && o.getConfiguration().sdpSemantics === "plan-b") && o.signalingState !== "stable"))
      return t;
  });
}
const jr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  fixNegotiationNeeded: Jr,
  shimAddTrackRemoveTrack: Xr,
  shimAddTrackRemoveTrackWithNative: Hr,
  shimGetSendersWithDtmf: qr,
  shimGetUserMedia: Br,
  shimMediaStream: Wr,
  shimOnTrack: Gr,
  shimPeerConnection: Rr,
  shimSenderReceiverGetStats: Vr
}, Symbol.toStringTag, { value: "Module" }));
function Qr(d, y) {
  const t = d && d.navigator, o = d && d.MediaStreamTrack;
  if (t.getUserMedia = function(e, r, i) {
    Er(
      "navigator.getUserMedia",
      "navigator.mediaDevices.getUserMedia"
    ), t.mediaDevices.getUserMedia(e).then(r, i);
  }, !(y.version > 55 && "autoGainControl" in t.mediaDevices.getSupportedConstraints())) {
    const e = function(i, a, c) {
      a in i && !(c in i) && (i[c] = i[a], delete i[a]);
    }, r = t.mediaDevices.getUserMedia.bind(t.mediaDevices);
    if (t.mediaDevices.getUserMedia = function(i) {
      return typeof i == "object" && typeof i.audio == "object" && (i = JSON.parse(JSON.stringify(i)), e(i.audio, "autoGainControl", "mozAutoGainControl"), e(i.audio, "noiseSuppression", "mozNoiseSuppression")), r(i);
    }, o && o.prototype.getSettings) {
      const i = o.prototype.getSettings;
      o.prototype.getSettings = function() {
        const a = i.apply(this, arguments);
        return e(a, "mozAutoGainControl", "autoGainControl"), e(a, "mozNoiseSuppression", "noiseSuppression"), a;
      };
    }
    if (o && o.prototype.applyConstraints) {
      const i = o.prototype.applyConstraints;
      o.prototype.applyConstraints = function(a) {
        return this.kind === "audio" && typeof a == "object" && (a = JSON.parse(JSON.stringify(a)), e(a, "autoGainControl", "mozAutoGainControl"), e(a, "noiseSuppression", "mozNoiseSuppression")), i.apply(this, [a]);
      };
    }
  }
}
function jn(d, y) {
  d.navigator.mediaDevices && "getDisplayMedia" in d.navigator.mediaDevices || d.navigator.mediaDevices && (d.navigator.mediaDevices.getDisplayMedia = function(o) {
    if (!(o && o.video)) {
      const e = new DOMException("getDisplayMedia without video constraints is undefined");
      return e.name = "NotFoundError", e.code = 8, Promise.reject(e);
    }
    return o.video === !0 ? o.video = { mediaSource: y } : o.video.mediaSource = y, d.navigator.mediaDevices.getUserMedia(o);
  });
}
function $r(d) {
  typeof d == "object" && d.RTCTrackEvent && "receiver" in d.RTCTrackEvent.prototype && !("transceiver" in d.RTCTrackEvent.prototype) && Object.defineProperty(d.RTCTrackEvent.prototype, "transceiver", {
    get() {
      return { receiver: this.receiver };
    }
  });
}
function Sr(d, y) {
  if (typeof d != "object" || !(d.RTCPeerConnection || d.mozRTCPeerConnection))
    return;
  !d.RTCPeerConnection && d.mozRTCPeerConnection && (d.RTCPeerConnection = d.mozRTCPeerConnection), y.version < 53 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(e) {
    const r = d.RTCPeerConnection.prototype[e], i = { [e]() {
      return arguments[0] = new (e === "addIceCandidate" ? d.RTCIceCandidate : d.RTCSessionDescription)(arguments[0]), r.apply(this, arguments);
    } };
    d.RTCPeerConnection.prototype[e] = i[e];
  });
  const t = {
    inboundrtp: "inbound-rtp",
    outboundrtp: "outbound-rtp",
    candidatepair: "candidate-pair",
    localcandidate: "local-candidate",
    remotecandidate: "remote-candidate"
  }, o = d.RTCPeerConnection.prototype.getStats;
  d.RTCPeerConnection.prototype.getStats = function() {
    const [r, i, a] = arguments;
    return o.apply(this, [r || null]).then((c) => {
      if (y.version < 53 && !i)
        try {
          c.forEach((p) => {
            p.type = t[p.type] || p.type;
          });
        } catch (p) {
          if (p.name !== "TypeError")
            throw p;
          c.forEach((g, T) => {
            c.set(T, Object.assign({}, g, {
              type: t[g.type] || g.type
            }));
          });
        }
      return c;
    }).then(i, a);
  };
}
function Yr(d) {
  if (!(typeof d == "object" && d.RTCPeerConnection && d.RTCRtpSender) || d.RTCRtpSender && "getStats" in d.RTCRtpSender.prototype)
    return;
  const y = d.RTCPeerConnection.prototype.getSenders;
  y && (d.RTCPeerConnection.prototype.getSenders = function() {
    const e = y.apply(this, []);
    return e.forEach((r) => r._pc = this), e;
  });
  const t = d.RTCPeerConnection.prototype.addTrack;
  t && (d.RTCPeerConnection.prototype.addTrack = function() {
    const e = t.apply(this, arguments);
    return e._pc = this, e;
  }), d.RTCRtpSender.prototype.getStats = function() {
    return this.track ? this._pc.getStats(this.track) : Promise.resolve(/* @__PURE__ */ new Map());
  };
}
function Kr(d) {
  if (!(typeof d == "object" && d.RTCPeerConnection && d.RTCRtpSender) || d.RTCRtpSender && "getStats" in d.RTCRtpReceiver.prototype)
    return;
  const y = d.RTCPeerConnection.prototype.getReceivers;
  y && (d.RTCPeerConnection.prototype.getReceivers = function() {
    const o = y.apply(this, []);
    return o.forEach((e) => e._pc = this), o;
  }), Ge(d, "track", (t) => (t.receiver._pc = t.srcElement, t)), d.RTCRtpReceiver.prototype.getStats = function() {
    return this._pc.getStats(this.track);
  };
}
function Zr(d) {
  !d.RTCPeerConnection || "removeStream" in d.RTCPeerConnection.prototype || (d.RTCPeerConnection.prototype.removeStream = function(t) {
    Er("removeStream", "removeTrack"), this.getSenders().forEach((o) => {
      o.track && t.getTracks().includes(o.track) && this.removeTrack(o);
    });
  });
}
function en(d) {
  d.DataChannel && !d.RTCDataChannel && (d.RTCDataChannel = d.DataChannel);
}
function tn(d) {
  if (!(typeof d == "object" && d.RTCPeerConnection))
    return;
  const y = d.RTCPeerConnection.prototype.addTransceiver;
  y && (d.RTCPeerConnection.prototype.addTransceiver = function() {
    this.setParametersPromises = [];
    let o = arguments[1] && arguments[1].sendEncodings;
    o === void 0 && (o = []), o = [...o];
    const e = o.length > 0;
    e && o.forEach((i) => {
      if ("rid" in i && !/^[a-z0-9]{0,16}$/i.test(i.rid))
        throw new TypeError("Invalid RID value provided.");
      if ("scaleResolutionDownBy" in i && !(parseFloat(i.scaleResolutionDownBy) >= 1))
        throw new RangeError("scale_resolution_down_by must be >= 1.0");
      if ("maxFramerate" in i && !(parseFloat(i.maxFramerate) >= 0))
        throw new RangeError("max_framerate must be >= 0.0");
    });
    const r = y.apply(this, arguments);
    if (e) {
      const { sender: i } = r, a = i.getParameters();
      (!("encodings" in a) || // Avoid being fooled by patched getParameters() below.
      a.encodings.length === 1 && Object.keys(a.encodings[0]).length === 0) && (a.encodings = o, i.sendEncodings = o, this.setParametersPromises.push(
        i.setParameters(a).then(() => {
          delete i.sendEncodings;
        }).catch(() => {
          delete i.sendEncodings;
        })
      ));
    }
    return r;
  });
}
function rn(d) {
  if (!(typeof d == "object" && d.RTCRtpSender))
    return;
  const y = d.RTCRtpSender.prototype.getParameters;
  y && (d.RTCRtpSender.prototype.getParameters = function() {
    const o = y.apply(this, arguments);
    return "encodings" in o || (o.encodings = [].concat(this.sendEncodings || [{}])), o;
  });
}
function nn(d) {
  if (!(typeof d == "object" && d.RTCPeerConnection))
    return;
  const y = d.RTCPeerConnection.prototype.createOffer;
  d.RTCPeerConnection.prototype.createOffer = function() {
    return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(() => y.apply(this, arguments)).finally(() => {
      this.setParametersPromises = [];
    }) : y.apply(this, arguments);
  };
}
function on(d) {
  if (!(typeof d == "object" && d.RTCPeerConnection))
    return;
  const y = d.RTCPeerConnection.prototype.createAnswer;
  d.RTCPeerConnection.prototype.createAnswer = function() {
    return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(() => y.apply(this, arguments)).finally(() => {
      this.setParametersPromises = [];
    }) : y.apply(this, arguments);
  };
}
const Ir = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  shimAddTransceiver: tn,
  shimCreateAnswer: on,
  shimCreateOffer: nn,
  shimGetDisplayMedia: jn,
  shimGetParameters: rn,
  shimGetUserMedia: Qr,
  shimOnTrack: $r,
  shimPeerConnection: Sr,
  shimRTCDataChannel: en,
  shimReceiverGetStats: Kr,
  shimRemoveStream: Zr,
  shimSenderGetStats: Yr
}, Symbol.toStringTag, { value: "Module" }));
function an(d) {
  if (!(typeof d != "object" || !d.RTCPeerConnection)) {
    if ("getLocalStreams" in d.RTCPeerConnection.prototype || (d.RTCPeerConnection.prototype.getLocalStreams = function() {
      return this._localStreams || (this._localStreams = []), this._localStreams;
    }), !("addStream" in d.RTCPeerConnection.prototype)) {
      const y = d.RTCPeerConnection.prototype.addTrack;
      d.RTCPeerConnection.prototype.addStream = function(o) {
        this._localStreams || (this._localStreams = []), this._localStreams.includes(o) || this._localStreams.push(o), o.getAudioTracks().forEach((e) => y.call(
          this,
          e,
          o
        )), o.getVideoTracks().forEach((e) => y.call(
          this,
          e,
          o
        ));
      }, d.RTCPeerConnection.prototype.addTrack = function(o, ...e) {
        return e && e.forEach((r) => {
          this._localStreams ? this._localStreams.includes(r) || this._localStreams.push(r) : this._localStreams = [r];
        }), y.apply(this, arguments);
      };
    }
    "removeStream" in d.RTCPeerConnection.prototype || (d.RTCPeerConnection.prototype.removeStream = function(t) {
      this._localStreams || (this._localStreams = []);
      const o = this._localStreams.indexOf(t);
      if (o === -1)
        return;
      this._localStreams.splice(o, 1);
      const e = t.getTracks();
      this.getSenders().forEach((r) => {
        e.includes(r.track) && this.removeTrack(r);
      });
    });
  }
}
function sn(d) {
  if (!(typeof d != "object" || !d.RTCPeerConnection) && ("getRemoteStreams" in d.RTCPeerConnection.prototype || (d.RTCPeerConnection.prototype.getRemoteStreams = function() {
    return this._remoteStreams ? this._remoteStreams : [];
  }), !("onaddstream" in d.RTCPeerConnection.prototype))) {
    Object.defineProperty(d.RTCPeerConnection.prototype, "onaddstream", {
      get() {
        return this._onaddstream;
      },
      set(t) {
        this._onaddstream && (this.removeEventListener("addstream", this._onaddstream), this.removeEventListener("track", this._onaddstreampoly)), this.addEventListener("addstream", this._onaddstream = t), this.addEventListener("track", this._onaddstreampoly = (o) => {
          o.streams.forEach((e) => {
            if (this._remoteStreams || (this._remoteStreams = []), this._remoteStreams.includes(e))
              return;
            this._remoteStreams.push(e);
            const r = new Event("addstream");
            r.stream = e, this.dispatchEvent(r);
          });
        });
      }
    });
    const y = d.RTCPeerConnection.prototype.setRemoteDescription;
    d.RTCPeerConnection.prototype.setRemoteDescription = function() {
      const o = this;
      return this._onaddstreampoly || this.addEventListener("track", this._onaddstreampoly = function(e) {
        e.streams.forEach((r) => {
          if (o._remoteStreams || (o._remoteStreams = []), o._remoteStreams.indexOf(r) >= 0)
            return;
          o._remoteStreams.push(r);
          const i = new Event("addstream");
          i.stream = r, o.dispatchEvent(i);
        });
      }), y.apply(o, arguments);
    };
  }
}
function cn(d) {
  if (typeof d != "object" || !d.RTCPeerConnection)
    return;
  const y = d.RTCPeerConnection.prototype, t = y.createOffer, o = y.createAnswer, e = y.setLocalDescription, r = y.setRemoteDescription, i = y.addIceCandidate;
  y.createOffer = function(p, g) {
    const T = arguments.length >= 2 ? arguments[2] : arguments[0], P = t.apply(this, [T]);
    return g ? (P.then(p, g), Promise.resolve()) : P;
  }, y.createAnswer = function(p, g) {
    const T = arguments.length >= 2 ? arguments[2] : arguments[0], P = o.apply(this, [T]);
    return g ? (P.then(p, g), Promise.resolve()) : P;
  };
  let a = function(c, p, g) {
    const T = e.apply(this, [c]);
    return g ? (T.then(p, g), Promise.resolve()) : T;
  };
  y.setLocalDescription = a, a = function(c, p, g) {
    const T = r.apply(this, [c]);
    return g ? (T.then(p, g), Promise.resolve()) : T;
  }, y.setRemoteDescription = a, a = function(c, p, g) {
    const T = i.apply(this, [c]);
    return g ? (T.then(p, g), Promise.resolve()) : T;
  }, y.addIceCandidate = a;
}
function un(d) {
  const y = d && d.navigator;
  if (y.mediaDevices && y.mediaDevices.getUserMedia) {
    const t = y.mediaDevices, o = t.getUserMedia.bind(t);
    y.mediaDevices.getUserMedia = (e) => o(fn(e));
  }
  !y.getUserMedia && y.mediaDevices && y.mediaDevices.getUserMedia && (y.getUserMedia = (function(o, e, r) {
    y.mediaDevices.getUserMedia(o).then(e, r);
  }).bind(y));
}
function fn(d) {
  return d && d.video !== void 0 ? Object.assign(
    {},
    d,
    { video: Nr(d.video) }
  ) : d;
}
function ln(d) {
  if (!d.RTCPeerConnection)
    return;
  const y = d.RTCPeerConnection;
  d.RTCPeerConnection = function(o, e) {
    if (o && o.iceServers) {
      const r = [];
      for (let i = 0; i < o.iceServers.length; i++) {
        let a = o.iceServers[i];
        a.urls === void 0 && a.url ? (Er("RTCIceServer.url", "RTCIceServer.urls"), a = JSON.parse(JSON.stringify(a)), a.urls = a.url, delete a.url, r.push(a)) : r.push(o.iceServers[i]);
      }
      o.iceServers = r;
    }
    return new y(o, e);
  }, d.RTCPeerConnection.prototype = y.prototype, "generateCertificate" in y && Object.defineProperty(d.RTCPeerConnection, "generateCertificate", {
    get() {
      return y.generateCertificate;
    }
  });
}
function dn(d) {
  typeof d == "object" && d.RTCTrackEvent && "receiver" in d.RTCTrackEvent.prototype && !("transceiver" in d.RTCTrackEvent.prototype) && Object.defineProperty(d.RTCTrackEvent.prototype, "transceiver", {
    get() {
      return { receiver: this.receiver };
    }
  });
}
function pn(d) {
  const y = d.RTCPeerConnection.prototype.createOffer;
  d.RTCPeerConnection.prototype.createOffer = function(o) {
    if (o) {
      typeof o.offerToReceiveAudio < "u" && (o.offerToReceiveAudio = !!o.offerToReceiveAudio);
      const e = this.getTransceivers().find((i) => i.receiver.track.kind === "audio");
      o.offerToReceiveAudio === !1 && e ? e.direction === "sendrecv" ? e.setDirection ? e.setDirection("sendonly") : e.direction = "sendonly" : e.direction === "recvonly" && (e.setDirection ? e.setDirection("inactive") : e.direction = "inactive") : o.offerToReceiveAudio === !0 && !e && this.addTransceiver("audio", { direction: "recvonly" }), typeof o.offerToReceiveVideo < "u" && (o.offerToReceiveVideo = !!o.offerToReceiveVideo);
      const r = this.getTransceivers().find((i) => i.receiver.track.kind === "video");
      o.offerToReceiveVideo === !1 && r ? r.direction === "sendrecv" ? r.setDirection ? r.setDirection("sendonly") : r.direction = "sendonly" : r.direction === "recvonly" && (r.setDirection ? r.setDirection("inactive") : r.direction = "inactive") : o.offerToReceiveVideo === !0 && !r && this.addTransceiver("video", { direction: "recvonly" });
    }
    return y.apply(this, arguments);
  };
}
function hn(d) {
  typeof d != "object" || d.AudioContext || (d.AudioContext = d.webkitAudioContext);
}
const Lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  shimAudioContext: hn,
  shimCallbacksAPI: cn,
  shimConstraints: fn,
  shimCreateOfferLegacy: pn,
  shimGetUserMedia: un,
  shimLocalStreamsAPI: an,
  shimRTCIceServerUrls: ln,
  shimRemoteStreamsAPI: sn,
  shimTrackEventTransceiver: dn
}, Symbol.toStringTag, { value: "Module" }));
function vn(d) {
  return d && d.__esModule && Object.prototype.hasOwnProperty.call(d, "default") ? d.default : d;
}
var gn = { exports: {} };
(function(d) {
  const y = {};
  y.generateIdentifier = function() {
    return Math.random().toString(36).substring(2, 12);
  }, y.localCName = y.generateIdentifier(), y.splitLines = function(t) {
    return t.trim().split(`
`).map((o) => o.trim());
  }, y.splitSections = function(t) {
    return t.split(`
m=`).map((e, r) => (r > 0 ? "m=" + e : e).trim() + `\r
`);
  }, y.getDescription = function(t) {
    const o = y.splitSections(t);
    return o && o[0];
  }, y.getMediaSections = function(t) {
    const o = y.splitSections(t);
    return o.shift(), o;
  }, y.matchPrefix = function(t, o) {
    return y.splitLines(t).filter((e) => e.indexOf(o) === 0);
  }, y.parseCandidate = function(t) {
    let o;
    t.indexOf("a=candidate:") === 0 ? o = t.substring(12).split(" ") : o = t.substring(10).split(" ");
    const e = {
      foundation: o[0],
      component: { 1: "rtp", 2: "rtcp" }[o[1]] || o[1],
      protocol: o[2].toLowerCase(),
      priority: parseInt(o[3], 10),
      ip: o[4],
      address: o[4],
      // address is an alias for ip.
      port: parseInt(o[5], 10),
      // skip parts[6] == 'typ'
      type: o[7]
    };
    for (let r = 8; r < o.length; r += 2)
      switch (o[r]) {
        case "raddr":
          e.relatedAddress = o[r + 1];
          break;
        case "rport":
          e.relatedPort = parseInt(o[r + 1], 10);
          break;
        case "tcptype":
          e.tcpType = o[r + 1];
          break;
        case "ufrag":
          e.ufrag = o[r + 1], e.usernameFragment = o[r + 1];
          break;
        default:
          e[o[r]] === void 0 && (e[o[r]] = o[r + 1]);
          break;
      }
    return e;
  }, y.writeCandidate = function(t) {
    const o = [];
    o.push(t.foundation);
    const e = t.component;
    e === "rtp" ? o.push(1) : e === "rtcp" ? o.push(2) : o.push(e), o.push(t.protocol.toUpperCase()), o.push(t.priority), o.push(t.address || t.ip), o.push(t.port);
    const r = t.type;
    return o.push("typ"), o.push(r), r !== "host" && t.relatedAddress && t.relatedPort && (o.push("raddr"), o.push(t.relatedAddress), o.push("rport"), o.push(t.relatedPort)), t.tcpType && t.protocol.toLowerCase() === "tcp" && (o.push("tcptype"), o.push(t.tcpType)), (t.usernameFragment || t.ufrag) && (o.push("ufrag"), o.push(t.usernameFragment || t.ufrag)), "candidate:" + o.join(" ");
  }, y.parseIceOptions = function(t) {
    return t.substring(14).split(" ");
  }, y.parseRtpMap = function(t) {
    let o = t.substring(9).split(" ");
    const e = {
      payloadType: parseInt(o.shift(), 10)
      // was: id
    };
    return o = o[0].split("/"), e.name = o[0], e.clockRate = parseInt(o[1], 10), e.channels = o.length === 3 ? parseInt(o[2], 10) : 1, e.numChannels = e.channels, e;
  }, y.writeRtpMap = function(t) {
    let o = t.payloadType;
    t.preferredPayloadType !== void 0 && (o = t.preferredPayloadType);
    const e = t.channels || t.numChannels || 1;
    return "a=rtpmap:" + o + " " + t.name + "/" + t.clockRate + (e !== 1 ? "/" + e : "") + `\r
`;
  }, y.parseExtmap = function(t) {
    const o = t.substring(9).split(" ");
    return {
      id: parseInt(o[0], 10),
      direction: o[0].indexOf("/") > 0 ? o[0].split("/")[1] : "sendrecv",
      uri: o[1],
      attributes: o.slice(2).join(" ")
    };
  }, y.writeExtmap = function(t) {
    return "a=extmap:" + (t.id || t.preferredId) + (t.direction && t.direction !== "sendrecv" ? "/" + t.direction : "") + " " + t.uri + (t.attributes ? " " + t.attributes : "") + `\r
`;
  }, y.parseFmtp = function(t) {
    const o = {};
    let e;
    const r = t.substring(t.indexOf(" ") + 1).split(";");
    for (let i = 0; i < r.length; i++)
      e = r[i].trim().split("="), o[e[0].trim()] = e[1];
    return o;
  }, y.writeFmtp = function(t) {
    let o = "", e = t.payloadType;
    if (t.preferredPayloadType !== void 0 && (e = t.preferredPayloadType), t.parameters && Object.keys(t.parameters).length) {
      const r = [];
      Object.keys(t.parameters).forEach((i) => {
        t.parameters[i] !== void 0 ? r.push(i + "=" + t.parameters[i]) : r.push(i);
      }), o += "a=fmtp:" + e + " " + r.join(";") + `\r
`;
    }
    return o;
  }, y.parseRtcpFb = function(t) {
    const o = t.substring(t.indexOf(" ") + 1).split(" ");
    return {
      type: o.shift(),
      parameter: o.join(" ")
    };
  }, y.writeRtcpFb = function(t) {
    let o = "", e = t.payloadType;
    return t.preferredPayloadType !== void 0 && (e = t.preferredPayloadType), t.rtcpFeedback && t.rtcpFeedback.length && t.rtcpFeedback.forEach((r) => {
      o += "a=rtcp-fb:" + e + " " + r.type + (r.parameter && r.parameter.length ? " " + r.parameter : "") + `\r
`;
    }), o;
  }, y.parseSsrcMedia = function(t) {
    const o = t.indexOf(" "), e = {
      ssrc: parseInt(t.substring(7, o), 10)
    }, r = t.indexOf(":", o);
    return r > -1 ? (e.attribute = t.substring(o + 1, r), e.value = t.substring(r + 1)) : e.attribute = t.substring(o + 1), e;
  }, y.parseSsrcGroup = function(t) {
    const o = t.substring(13).split(" ");
    return {
      semantics: o.shift(),
      ssrcs: o.map((e) => parseInt(e, 10))
    };
  }, y.getMid = function(t) {
    const o = y.matchPrefix(t, "a=mid:")[0];
    if (o)
      return o.substring(6);
  }, y.parseFingerprint = function(t) {
    const o = t.substring(14).split(" ");
    return {
      algorithm: o[0].toLowerCase(),
      // algorithm is case-sensitive in Edge.
      value: o[1].toUpperCase()
      // the definition is upper-case in RFC 4572.
    };
  }, y.getDtlsParameters = function(t, o) {
    return {
      role: "auto",
      fingerprints: y.matchPrefix(
        t + o,
        "a=fingerprint:"
      ).map(y.parseFingerprint)
    };
  }, y.writeDtlsParameters = function(t, o) {
    let e = "a=setup:" + o + `\r
`;
    return t.fingerprints.forEach((r) => {
      e += "a=fingerprint:" + r.algorithm + " " + r.value + `\r
`;
    }), e;
  }, y.parseCryptoLine = function(t) {
    const o = t.substring(9).split(" ");
    return {
      tag: parseInt(o[0], 10),
      cryptoSuite: o[1],
      keyParams: o[2],
      sessionParams: o.slice(3)
    };
  }, y.writeCryptoLine = function(t) {
    return "a=crypto:" + t.tag + " " + t.cryptoSuite + " " + (typeof t.keyParams == "object" ? y.writeCryptoKeyParams(t.keyParams) : t.keyParams) + (t.sessionParams ? " " + t.sessionParams.join(" ") : "") + `\r
`;
  }, y.parseCryptoKeyParams = function(t) {
    if (t.indexOf("inline:") !== 0)
      return null;
    const o = t.substring(7).split("|");
    return {
      keyMethod: "inline",
      keySalt: o[0],
      lifeTime: o[1],
      mkiValue: o[2] ? o[2].split(":")[0] : void 0,
      mkiLength: o[2] ? o[2].split(":")[1] : void 0
    };
  }, y.writeCryptoKeyParams = function(t) {
    return t.keyMethod + ":" + t.keySalt + (t.lifeTime ? "|" + t.lifeTime : "") + (t.mkiValue && t.mkiLength ? "|" + t.mkiValue + ":" + t.mkiLength : "");
  }, y.getCryptoParameters = function(t, o) {
    return y.matchPrefix(
      t + o,
      "a=crypto:"
    ).map(y.parseCryptoLine);
  }, y.getIceParameters = function(t, o) {
    const e = y.matchPrefix(
      t + o,
      "a=ice-ufrag:"
    )[0], r = y.matchPrefix(
      t + o,
      "a=ice-pwd:"
    )[0];
    return e && r ? {
      usernameFragment: e.substring(12),
      password: r.substring(10)
    } : null;
  }, y.writeIceParameters = function(t) {
    let o = "a=ice-ufrag:" + t.usernameFragment + `\r
a=ice-pwd:` + t.password + `\r
`;
    return t.iceLite && (o += `a=ice-lite\r
`), o;
  }, y.parseRtpParameters = function(t) {
    const o = {
      codecs: [],
      headerExtensions: [],
      fecMechanisms: [],
      rtcp: []
    }, r = y.splitLines(t)[0].split(" ");
    o.profile = r[2];
    for (let a = 3; a < r.length; a++) {
      const c = r[a], p = y.matchPrefix(
        t,
        "a=rtpmap:" + c + " "
      )[0];
      if (p) {
        const g = y.parseRtpMap(p), T = y.matchPrefix(
          t,
          "a=fmtp:" + c + " "
        );
        switch (g.parameters = T.length ? y.parseFmtp(T[0]) : {}, g.rtcpFeedback = y.matchPrefix(
          t,
          "a=rtcp-fb:" + c + " "
        ).map(y.parseRtcpFb), o.codecs.push(g), g.name.toUpperCase()) {
          case "RED":
          case "ULPFEC":
            o.fecMechanisms.push(g.name.toUpperCase());
            break;
        }
      }
    }
    y.matchPrefix(t, "a=extmap:").forEach((a) => {
      o.headerExtensions.push(y.parseExtmap(a));
    });
    const i = y.matchPrefix(t, "a=rtcp-fb:* ").map(y.parseRtcpFb);
    return o.codecs.forEach((a) => {
      i.forEach((c) => {
        a.rtcpFeedback.find((g) => g.type === c.type && g.parameter === c.parameter) || a.rtcpFeedback.push(c);
      });
    }), o;
  }, y.writeRtpDescription = function(t, o) {
    let e = "";
    e += "m=" + t + " ", e += o.codecs.length > 0 ? "9" : "0", e += " " + (o.profile || "UDP/TLS/RTP/SAVPF") + " ", e += o.codecs.map((i) => i.preferredPayloadType !== void 0 ? i.preferredPayloadType : i.payloadType).join(" ") + `\r
`, e += `c=IN IP4 0.0.0.0\r
`, e += `a=rtcp:9 IN IP4 0.0.0.0\r
`, o.codecs.forEach((i) => {
      e += y.writeRtpMap(i), e += y.writeFmtp(i), e += y.writeRtcpFb(i);
    });
    let r = 0;
    return o.codecs.forEach((i) => {
      i.maxptime > r && (r = i.maxptime);
    }), r > 0 && (e += "a=maxptime:" + r + `\r
`), o.headerExtensions && o.headerExtensions.forEach((i) => {
      e += y.writeExtmap(i);
    }), e;
  }, y.parseRtpEncodingParameters = function(t) {
    const o = [], e = y.parseRtpParameters(t), r = e.fecMechanisms.indexOf("RED") !== -1, i = e.fecMechanisms.indexOf("ULPFEC") !== -1, a = y.matchPrefix(t, "a=ssrc:").map((P) => y.parseSsrcMedia(P)).filter((P) => P.attribute === "cname"), c = a.length > 0 && a[0].ssrc;
    let p;
    const g = y.matchPrefix(t, "a=ssrc-group:FID").map((P) => P.substring(17).split(" ").map((I) => parseInt(I, 10)));
    g.length > 0 && g[0].length > 1 && g[0][0] === c && (p = g[0][1]), e.codecs.forEach((P) => {
      if (P.name.toUpperCase() === "RTX" && P.parameters.apt) {
        let z = {
          ssrc: c,
          codecPayloadType: parseInt(P.parameters.apt, 10)
        };
        c && p && (z.rtx = { ssrc: p }), o.push(z), r && (z = JSON.parse(JSON.stringify(z)), z.fec = {
          ssrc: c,
          mechanism: i ? "red+ulpfec" : "red"
        }, o.push(z));
      }
    }), o.length === 0 && c && o.push({
      ssrc: c
    });
    let T = y.matchPrefix(t, "b=");
    return T.length && (T[0].indexOf("b=TIAS:") === 0 ? T = parseInt(T[0].substring(7), 10) : T[0].indexOf("b=AS:") === 0 ? T = parseInt(T[0].substring(5), 10) * 1e3 * 0.95 - 50 * 40 * 8 : T = void 0, o.forEach((P) => {
      P.maxBitrate = T;
    })), o;
  }, y.parseRtcpParameters = function(t) {
    const o = {}, e = y.matchPrefix(t, "a=ssrc:").map((a) => y.parseSsrcMedia(a)).filter((a) => a.attribute === "cname")[0];
    e && (o.cname = e.value, o.ssrc = e.ssrc);
    const r = y.matchPrefix(t, "a=rtcp-rsize");
    o.reducedSize = r.length > 0, o.compound = r.length === 0;
    const i = y.matchPrefix(t, "a=rtcp-mux");
    return o.mux = i.length > 0, o;
  }, y.writeRtcpParameters = function(t) {
    let o = "";
    return t.reducedSize && (o += `a=rtcp-rsize\r
`), t.mux && (o += `a=rtcp-mux\r
`), t.ssrc !== void 0 && t.cname && (o += "a=ssrc:" + t.ssrc + " cname:" + t.cname + `\r
`), o;
  }, y.parseMsid = function(t) {
    let o;
    const e = y.matchPrefix(t, "a=msid:");
    if (e.length === 1)
      return o = e[0].substring(7).split(" "), { stream: o[0], track: o[1] };
    const r = y.matchPrefix(t, "a=ssrc:").map((i) => y.parseSsrcMedia(i)).filter((i) => i.attribute === "msid");
    if (r.length > 0)
      return o = r[0].value.split(" "), { stream: o[0], track: o[1] };
  }, y.parseSctpDescription = function(t) {
    const o = y.parseMLine(t), e = y.matchPrefix(t, "a=max-message-size:");
    let r;
    e.length > 0 && (r = parseInt(e[0].substring(19), 10)), isNaN(r) && (r = 65536);
    const i = y.matchPrefix(t, "a=sctp-port:");
    if (i.length > 0)
      return {
        port: parseInt(i[0].substring(12), 10),
        protocol: o.fmt,
        maxMessageSize: r
      };
    const a = y.matchPrefix(t, "a=sctpmap:");
    if (a.length > 0) {
      const c = a[0].substring(10).split(" ");
      return {
        port: parseInt(c[0], 10),
        protocol: c[1],
        maxMessageSize: r
      };
    }
  }, y.writeSctpDescription = function(t, o) {
    let e = [];
    return t.protocol !== "DTLS/SCTP" ? e = [
      "m=" + t.kind + " 9 " + t.protocol + " " + o.protocol + `\r
`,
      `c=IN IP4 0.0.0.0\r
`,
      "a=sctp-port:" + o.port + `\r
`
    ] : e = [
      "m=" + t.kind + " 9 " + t.protocol + " " + o.port + `\r
`,
      `c=IN IP4 0.0.0.0\r
`,
      "a=sctpmap:" + o.port + " " + o.protocol + ` 65535\r
`
    ], o.maxMessageSize !== void 0 && e.push("a=max-message-size:" + o.maxMessageSize + `\r
`), e.join("");
  }, y.generateSessionId = function() {
    return Math.random().toString().substr(2, 22);
  }, y.writeSessionBoilerplate = function(t, o, e) {
    let r;
    const i = o !== void 0 ? o : 2;
    return t ? r = t : r = y.generateSessionId(), `v=0\r
o=` + (e || "thisisadapterortc") + " " + r + " " + i + ` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`;
  }, y.getDirection = function(t, o) {
    const e = y.splitLines(t);
    for (let r = 0; r < e.length; r++)
      switch (e[r]) {
        case "a=sendrecv":
        case "a=sendonly":
        case "a=recvonly":
        case "a=inactive":
          return e[r].substring(2);
      }
    return o ? y.getDirection(o) : "sendrecv";
  }, y.getKind = function(t) {
    return y.splitLines(t)[0].split(" ")[0].substring(2);
  }, y.isRejected = function(t) {
    return t.split(" ", 2)[1] === "0";
  }, y.parseMLine = function(t) {
    const e = y.splitLines(t)[0].substring(2).split(" ");
    return {
      kind: e[0],
      port: parseInt(e[1], 10),
      protocol: e[2],
      fmt: e.slice(3).join(" ")
    };
  }, y.parseOLine = function(t) {
    const e = y.matchPrefix(t, "o=")[0].substring(2).split(" ");
    return {
      username: e[0],
      sessionId: e[1],
      sessionVersion: parseInt(e[2], 10),
      netType: e[3],
      addressType: e[4],
      address: e[5]
    };
  }, y.isValidSDP = function(t) {
    if (typeof t != "string" || t.length === 0)
      return !1;
    const o = y.splitLines(t);
    for (let e = 0; e < o.length; e++)
      if (o[e].length < 2 || o[e].charAt(1) !== "=")
        return !1;
    return !0;
  }, d.exports = y;
})(gn);
var mn = gn.exports;
const $e = /* @__PURE__ */ vn(mn), In = /* @__PURE__ */ Mn({
  __proto__: null,
  default: $e
}, [mn]);
function wt(d) {
  if (!d.RTCIceCandidate || d.RTCIceCandidate && "foundation" in d.RTCIceCandidate.prototype)
    return;
  const y = d.RTCIceCandidate;
  d.RTCIceCandidate = function(o) {
    if (typeof o == "object" && o.candidate && o.candidate.indexOf("a=") === 0 && (o = JSON.parse(JSON.stringify(o)), o.candidate = o.candidate.substring(2)), o.candidate && o.candidate.length) {
      const e = new y(o), r = $e.parseCandidate(o.candidate);
      for (const i in r)
        i in e || Object.defineProperty(
          e,
          i,
          { value: r[i] }
        );
      return e.toJSON = function() {
        return {
          candidate: e.candidate,
          sdpMid: e.sdpMid,
          sdpMLineIndex: e.sdpMLineIndex,
          usernameFragment: e.usernameFragment
        };
      }, e;
    }
    return new y(o);
  }, d.RTCIceCandidate.prototype = y.prototype, Ge(d, "icecandidate", (t) => (t.candidate && Object.defineProperty(t, "candidate", {
    value: new d.RTCIceCandidate(t.candidate),
    writable: "false"
  }), t));
}
function Tr(d) {
  !d.RTCIceCandidate || d.RTCIceCandidate && "relayProtocol" in d.RTCIceCandidate.prototype || Ge(d, "icecandidate", (y) => {
    if (y.candidate) {
      const t = $e.parseCandidate(y.candidate.candidate);
      t.type === "relay" && (y.candidate.relayProtocol = {
        0: "tls",
        1: "tcp",
        2: "udp"
      }[t.priority >> 24]);
    }
    return y;
  });
}
function Nt(d, y) {
  if (!d.RTCPeerConnection)
    return;
  "sctp" in d.RTCPeerConnection.prototype || Object.defineProperty(d.RTCPeerConnection.prototype, "sctp", {
    get() {
      return typeof this._sctp > "u" ? null : this._sctp;
    }
  });
  const t = function(a) {
    if (!a || !a.sdp)
      return !1;
    const c = $e.splitSections(a.sdp);
    return c.shift(), c.some((p) => {
      const g = $e.parseMLine(p);
      return g && g.kind === "application" && g.protocol.indexOf("SCTP") !== -1;
    });
  }, o = function(a) {
    const c = a.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
    if (c === null || c.length < 2)
      return -1;
    const p = parseInt(c[1], 10);
    return p !== p ? -1 : p;
  }, e = function(a) {
    let c = 65536;
    return y.browser === "firefox" && (y.version < 57 ? a === -1 ? c = 16384 : c = 2147483637 : y.version < 60 ? c = y.version === 57 ? 65535 : 65536 : c = 2147483637), c;
  }, r = function(a, c) {
    let p = 65536;
    y.browser === "firefox" && y.version === 57 && (p = 65535);
    const g = $e.matchPrefix(
      a.sdp,
      "a=max-message-size:"
    );
    return g.length > 0 ? p = parseInt(g[0].substring(19), 10) : y.browser === "firefox" && c !== -1 && (p = 2147483637), p;
  }, i = d.RTCPeerConnection.prototype.setRemoteDescription;
  d.RTCPeerConnection.prototype.setRemoteDescription = function() {
    if (this._sctp = null, y.browser === "chrome" && y.version >= 76) {
      const { sdpSemantics: c } = this.getConfiguration();
      c === "plan-b" && Object.defineProperty(this, "sctp", {
        get() {
          return typeof this._sctp > "u" ? null : this._sctp;
        },
        enumerable: !0,
        configurable: !0
      });
    }
    if (t(arguments[0])) {
      const c = o(arguments[0]), p = e(c), g = r(arguments[0], c);
      let T;
      p === 0 && g === 0 ? T = Number.POSITIVE_INFINITY : p === 0 || g === 0 ? T = Math.max(p, g) : T = Math.min(p, g);
      const P = {};
      Object.defineProperty(P, "maxMessageSize", {
        get() {
          return T;
        }
      }), this._sctp = P;
    }
    return i.apply(this, arguments);
  };
}
function Bt(d) {
  if (!(d.RTCPeerConnection && "createDataChannel" in d.RTCPeerConnection.prototype))
    return;
  function y(o, e) {
    const r = o.send;
    o.send = function() {
      const a = arguments[0], c = a.length || a.size || a.byteLength;
      if (o.readyState === "open" && e.sctp && c > e.sctp.maxMessageSize)
        throw new TypeError("Message too large (can send a maximum of " + e.sctp.maxMessageSize + " bytes)");
      return r.apply(o, arguments);
    };
  }
  const t = d.RTCPeerConnection.prototype.createDataChannel;
  d.RTCPeerConnection.prototype.createDataChannel = function() {
    const e = t.apply(this, arguments);
    return y(e, this), e;
  }, Ge(d, "datachannel", (o) => (y(o.channel, o.target), o));
}
function Pr(d) {
  if (!d.RTCPeerConnection || "connectionState" in d.RTCPeerConnection.prototype)
    return;
  const y = d.RTCPeerConnection.prototype;
  Object.defineProperty(y, "connectionState", {
    get() {
      return {
        completed: "connected",
        checking: "connecting"
      }[this.iceConnectionState] || this.iceConnectionState;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(y, "onconnectionstatechange", {
    get() {
      return this._onconnectionstatechange || null;
    },
    set(t) {
      this._onconnectionstatechange && (this.removeEventListener(
        "connectionstatechange",
        this._onconnectionstatechange
      ), delete this._onconnectionstatechange), t && this.addEventListener(
        "connectionstatechange",
        this._onconnectionstatechange = t
      );
    },
    enumerable: !0,
    configurable: !0
  }), ["setLocalDescription", "setRemoteDescription"].forEach((t) => {
    const o = y[t];
    y[t] = function() {
      return this._connectionstatechangepoly || (this._connectionstatechangepoly = (e) => {
        const r = e.target;
        if (r._lastConnectionState !== r.connectionState) {
          r._lastConnectionState = r.connectionState;
          const i = new Event("connectionstatechange", e);
          r.dispatchEvent(i);
        }
        return e;
      }, this.addEventListener(
        "iceconnectionstatechange",
        this._connectionstatechangepoly
      )), o.apply(this, arguments);
    };
  });
}
function Or(d, y) {
  if (!d.RTCPeerConnection || y.browser === "chrome" && y.version >= 71 || y.browser === "safari" && y.version >= 605)
    return;
  const t = d.RTCPeerConnection.prototype.setRemoteDescription;
  d.RTCPeerConnection.prototype.setRemoteDescription = function(e) {
    if (e && e.sdp && e.sdp.indexOf(`
a=extmap-allow-mixed`) !== -1) {
      const r = e.sdp.split(`
`).filter((i) => i.trim() !== "a=extmap-allow-mixed").join(`
`);
      d.RTCSessionDescription && e instanceof d.RTCSessionDescription ? arguments[0] = new d.RTCSessionDescription({
        type: e.type,
        sdp: r
      }) : e.sdp = r;
    }
    return t.apply(this, arguments);
  };
}
function Wt(d, y) {
  if (!(d.RTCPeerConnection && d.RTCPeerConnection.prototype))
    return;
  const t = d.RTCPeerConnection.prototype.addIceCandidate;
  !t || t.length === 0 || (d.RTCPeerConnection.prototype.addIceCandidate = function() {
    return arguments[0] ? (y.browser === "chrome" && y.version < 78 || y.browser === "firefox" && y.version < 68 || y.browser === "safari") && arguments[0] && arguments[0].candidate === "" ? Promise.resolve() : t.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve());
  });
}
function Gt(d, y) {
  if (!(d.RTCPeerConnection && d.RTCPeerConnection.prototype))
    return;
  const t = d.RTCPeerConnection.prototype.setLocalDescription;
  !t || t.length === 0 || (d.RTCPeerConnection.prototype.setLocalDescription = function() {
    let e = arguments[0] || {};
    if (typeof e != "object" || e.type && e.sdp)
      return t.apply(this, arguments);
    if (e = { type: e.type, sdp: e.sdp }, !e.type)
      switch (this.signalingState) {
        case "stable":
        case "have-local-offer":
        case "have-remote-pranswer":
          e.type = "offer";
          break;
        default:
          e.type = "answer";
          break;
      }
    return e.sdp || e.type !== "offer" && e.type !== "answer" ? t.apply(this, [e]) : (e.type === "offer" ? this.createOffer : this.createAnswer).apply(this).then((i) => t.apply(this, [i]));
  });
}
const Ln = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  removeExtmapAllowMixed: Or,
  shimAddIceCandidateNullOrEmpty: Wt,
  shimConnectionState: Pr,
  shimMaxMessageSize: Nt,
  shimParameterlessSetLocalDescription: Gt,
  shimRTCIceCandidate: wt,
  shimRTCIceCandidateRelayProtocol: Tr,
  shimSendThrowTypeError: Bt
}, Symbol.toStringTag, { value: "Module" }));
function zn({ window: d } = {}, y = {
  shimChrome: !0,
  shimFirefox: !0,
  shimSafari: !0
}) {
  const t = wr, o = Dn(d), e = {
    browserDetails: o,
    commonShim: Ln,
    extractVersion: Ft,
    disableLog: kn,
    disableWarnings: An,
    // Expose sdp as a convenience. For production apps include directly.
    sdp: In
  };
  switch (o.browser) {
    case "chrome":
      if (!jr || !Rr || !y.shimChrome)
        return t("Chrome shim is not included in this adapter release."), e;
      if (o.version === null)
        return t("Chrome shim can not determine version, not shimming."), e;
      t("adapter.js shimming chrome."), e.browserShim = jr, Wt(d, o), Gt(d), Br(d, o), Wr(d), Rr(d, o), Gr(d), Xr(d, o), qr(d), Vr(d), Jr(d, o), wt(d), Tr(d), Pr(d), Nt(d, o), Bt(d), Or(d, o);
      break;
    case "firefox":
      if (!Ir || !Sr || !y.shimFirefox)
        return t("Firefox shim is not included in this adapter release."), e;
      t("adapter.js shimming firefox."), e.browserShim = Ir, Wt(d, o), Gt(d), Qr(d, o), Sr(d, o), $r(d), Zr(d), Yr(d), Kr(d), en(d), tn(d), rn(d), nn(d), on(d), wt(d), Pr(d), Nt(d, o), Bt(d);
      break;
    case "safari":
      if (!Lr || !y.shimSafari)
        return t("Safari shim is not included in this adapter release."), e;
      t("adapter.js shimming safari."), e.browserShim = Lr, Wt(d, o), Gt(d), ln(d), pn(d), cn(d), an(d), sn(d), dn(d), un(d), hn(d), wt(d), Tr(d), Nt(d, o), Bt(d), Or(d, o);
      break;
    default:
      t("Unsupported browser!");
      break;
  }
  return e;
}
zn({ window: typeof window > "u" ? void 0 : window });
var yn = { exports: {} };
(function(d, y) {
  (function(t, o) {
    d.exports = o();
  })(window, function() {
    return function(t) {
      var o = {};
      function e(r) {
        if (o[r]) return o[r].exports;
        var i = o[r] = { i: r, l: !1, exports: {} };
        return t[r].call(i.exports, i, i.exports, e), i.l = !0, i.exports;
      }
      return e.m = t, e.c = o, e.d = function(r, i, a) {
        e.o(r, i) || Object.defineProperty(r, i, { enumerable: !0, get: a });
      }, e.r = function(r) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(r, "__esModule", { value: !0 });
      }, e.t = function(r, i) {
        if (1 & i && (r = e(r)), 8 & i || 4 & i && typeof r == "object" && r && r.__esModule) return r;
        var a = /* @__PURE__ */ Object.create(null);
        if (e.r(a), Object.defineProperty(a, "default", { enumerable: !0, value: r }), 2 & i && typeof r != "string") for (var c in r) e.d(a, c, (function(p) {
          return r[p];
        }).bind(null, c));
        return a;
      }, e.n = function(r) {
        var i = r && r.__esModule ? function() {
          return r.default;
        } : function() {
          return r;
        };
        return e.d(i, "a", i), i;
      }, e.o = function(r, i) {
        return Object.prototype.hasOwnProperty.call(r, i);
      }, e.p = "/", e(e.s = 73);
    }([function(t, o, e) {
      var r = e(61);
      t.exports = function(i, a, c) {
        return (a = r(a)) in i ? Object.defineProperty(i, a, { value: c, enumerable: !0, configurable: !0, writable: !0 }) : i[a] = c, i;
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o) {
      t.exports = function(e) {
        if (e === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e;
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o) {
      function e(r) {
        return t.exports = e = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(i) {
          return i.__proto__ || Object.getPrototypeOf(i);
        }, t.exports.__esModule = !0, t.exports.default = t.exports, e(r);
      }
      t.exports = e, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o) {
      t.exports = function(e, r) {
        if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(61);
      function i(a, c) {
        for (var p = 0; p < c.length; p++) {
          var g = c[p];
          g.enumerable = g.enumerable || !1, g.configurable = !0, "value" in g && (g.writable = !0), Object.defineProperty(a, r(g.key), g);
        }
      }
      t.exports = function(a, c, p) {
        return c && i(a.prototype, c), p && i(a, p), Object.defineProperty(a, "prototype", { writable: !1 }), a;
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      e.d(o, "a", function() {
        return r;
      }), e.d(o, "b", function() {
        return i;
      }), e.d(o, "c", function() {
        return a;
      }), e.d(o, "d", function() {
        return c;
      });
      var r = {};
      e.r(r), e.d(r, "EPSILON", function() {
        return p;
      }), e.d(r, "ARRAY_TYPE", function() {
        return g;
      }), e.d(r, "RANDOM", function() {
        return T;
      }), e.d(r, "setMatrixArrayType", function() {
        return P;
      }), e.d(r, "toRadian", function() {
        return I;
      }), e.d(r, "equals", function() {
        return q;
      });
      var i = {};
      e.r(i), e.d(i, "create", function() {
        return ie;
      }), e.d(i, "clone", function() {
        return te;
      }), e.d(i, "copy", function() {
        return ae;
      }), e.d(i, "identity", function() {
        return G;
      }), e.d(i, "fromValues", function() {
        return U;
      }), e.d(i, "set", function() {
        return k;
      }), e.d(i, "transpose", function() {
        return O;
      }), e.d(i, "invert", function() {
        return D;
      }), e.d(i, "adjoint", function() {
        return B;
      }), e.d(i, "determinant", function() {
        return j;
      }), e.d(i, "multiply", function() {
        return $;
      }), e.d(i, "rotate", function() {
        return L;
      }), e.d(i, "scale", function() {
        return X;
      }), e.d(i, "fromRotation", function() {
        return M;
      }), e.d(i, "fromScaling", function() {
        return J;
      }), e.d(i, "str", function() {
        return Z;
      }), e.d(i, "frob", function() {
        return ee;
      }), e.d(i, "LDU", function() {
        return K;
      }), e.d(i, "add", function() {
        return se;
      }), e.d(i, "subtract", function() {
        return re;
      }), e.d(i, "exactEquals", function() {
        return ne;
      }), e.d(i, "equals", function() {
        return de;
      }), e.d(i, "multiplyScalar", function() {
        return w;
      }), e.d(i, "multiplyScalarAndAdd", function() {
        return N;
      }), e.d(i, "mul", function() {
        return V;
      }), e.d(i, "sub", function() {
        return fe;
      });
      var a = {};
      e.r(a), e.d(a, "create", function() {
        return ce;
      }), e.d(a, "clone", function() {
        return ve;
      }), e.d(a, "fromValues", function() {
        return ye;
      }), e.d(a, "copy", function() {
        return xe;
      }), e.d(a, "set", function() {
        return be;
      }), e.d(a, "add", function() {
        return Se;
      }), e.d(a, "subtract", function() {
        return Ee;
      }), e.d(a, "multiply", function() {
        return Oe;
      }), e.d(a, "divide", function() {
        return at;
      }), e.d(a, "ceil", function() {
        return qt;
      }), e.d(a, "floor", function() {
        return st;
      }), e.d(a, "min", function() {
        return qe;
      }), e.d(a, "max", function() {
        return Vt;
      }), e.d(a, "round", function() {
        return Ht;
      }), e.d(a, "scale", function() {
        return ct;
      }), e.d(a, "scaleAndAdd", function() {
        return Xt;
      }), e.d(a, "distance", function() {
        return ut;
      }), e.d(a, "squaredDistance", function() {
        return ft;
      }), e.d(a, "length", function() {
        return Ye;
      }), e.d(a, "squaredLength", function() {
        return lt;
      }), e.d(a, "negate", function() {
        return Ke;
      }), e.d(a, "inverse", function() {
        return dt;
      }), e.d(a, "normalize", function() {
        return pt;
      }), e.d(a, "dot", function() {
        return ht;
      }), e.d(a, "cross", function() {
        return Ze;
      }), e.d(a, "lerp", function() {
        return Jt;
      }), e.d(a, "random", function() {
        return Qt;
      }), e.d(a, "transformMat2", function() {
        return vt;
      }), e.d(a, "transformMat2d", function() {
        return $t;
      }), e.d(a, "transformMat3", function() {
        return gt;
      }), e.d(a, "transformMat4", function() {
        return mt;
      }), e.d(a, "rotate", function() {
        return je;
      }), e.d(a, "angle", function() {
        return Yt;
      }), e.d(a, "zero", function() {
        return yt;
      }), e.d(a, "str", function() {
        return Kt;
      }), e.d(a, "exactEquals", function() {
        return Zt;
      }), e.d(a, "equals", function() {
        return xt;
      }), e.d(a, "len", function() {
        return _t;
      }), e.d(a, "sub", function() {
        return er;
      }), e.d(a, "mul", function() {
        return bt;
      }), e.d(a, "div", function() {
        return Ct;
      }), e.d(a, "dist", function() {
        return tr;
      }), e.d(a, "sqrDist", function() {
        return Rt;
      }), e.d(a, "sqrLen", function() {
        return rr;
      }), e.d(a, "forEach", function() {
        return St;
      });
      var c = {};
      e.r(c), e.d(c, "create", function() {
        return Fe;
      }), e.d(c, "clone", function() {
        return Ve;
      }), e.d(c, "length", function() {
        return et;
      }), e.d(c, "fromValues", function() {
        return nr;
      }), e.d(c, "copy", function() {
        return Tt;
      }), e.d(c, "set", function() {
        return we;
      }), e.d(c, "add", function() {
        return tt;
      }), e.d(c, "subtract", function() {
        return Ie;
      }), e.d(c, "multiply", function() {
        return Pt;
      }), e.d(c, "divide", function() {
        return Ot;
      }), e.d(c, "ceil", function() {
        return or;
      }), e.d(c, "floor", function() {
        return ir;
      }), e.d(c, "min", function() {
        return Ue;
      }), e.d(c, "max", function() {
        return rt;
      }), e.d(c, "round", function() {
        return Et;
      }), e.d(c, "scale", function() {
        return ar;
      }), e.d(c, "scaleAndAdd", function() {
        return sr;
      }), e.d(c, "distance", function() {
        return Mt;
      }), e.d(c, "squaredDistance", function() {
        return kt;
      }), e.d(c, "squaredLength", function() {
        return nt;
      }), e.d(c, "negate", function() {
        return cr;
      }), e.d(c, "inverse", function() {
        return ur;
      }), e.d(c, "normalize", function() {
        return At;
      }), e.d(c, "dot", function() {
        return Ne;
      }), e.d(c, "cross", function() {
        return Be;
      }), e.d(c, "lerp", function() {
        return He;
      }), e.d(c, "hermite", function() {
        return Dt;
      }), e.d(c, "bezier", function() {
        return fr;
      }), e.d(c, "random", function() {
        return Me;
      }), e.d(c, "transformMat4", function() {
        return Xe;
      }), e.d(c, "transformMat3", function() {
        return jt;
      }), e.d(c, "transformQuat", function() {
        return lr;
      }), e.d(c, "rotateX", function() {
        return dr;
      }), e.d(c, "rotateY", function() {
        return Je;
      }), e.d(c, "rotateZ", function() {
        return It;
      }), e.d(c, "angle", function() {
        return pr;
      }), e.d(c, "zero", function() {
        return hr;
      }), e.d(c, "str", function() {
        return vr;
      }), e.d(c, "exactEquals", function() {
        return gr;
      }), e.d(c, "equals", function() {
        return mr;
      }), e.d(c, "sub", function() {
        return Lt;
      }), e.d(c, "mul", function() {
        return yr;
      }), e.d(c, "div", function() {
        return xr;
      }), e.d(c, "dist", function() {
        return zt;
      }), e.d(c, "sqrDist", function() {
        return _r;
      }), e.d(c, "len", function() {
        return ot;
      }), e.d(c, "sqrLen", function() {
        return br;
      }), e.d(c, "forEach", function() {
        return Ut;
      });
      var p = 1e-6, g = typeof Float32Array < "u" ? Float32Array : Array, T = Math.random;
      function P(f) {
        g = f;
      }
      var z = Math.PI / 180;
      function I(f) {
        return f * z;
      }
      function q(f, v) {
        return Math.abs(f - v) <= p * Math.max(1, Math.abs(f), Math.abs(v));
      }
      function ie() {
        var f = new g(4);
        return g != Float32Array && (f[1] = 0, f[2] = 0), f[0] = 1, f[3] = 1, f;
      }
      function te(f) {
        var v = new g(4);
        return v[0] = f[0], v[1] = f[1], v[2] = f[2], v[3] = f[3], v;
      }
      function ae(f, v) {
        return f[0] = v[0], f[1] = v[1], f[2] = v[2], f[3] = v[3], f;
      }
      function G(f) {
        return f[0] = 1, f[1] = 0, f[2] = 0, f[3] = 1, f;
      }
      function U(f, v, C, A) {
        var F = new g(4);
        return F[0] = f, F[1] = v, F[2] = C, F[3] = A, F;
      }
      function k(f, v, C, A, F) {
        return f[0] = v, f[1] = C, f[2] = A, f[3] = F, f;
      }
      function O(f, v) {
        if (f === v) {
          var C = v[1];
          f[1] = v[2], f[2] = C;
        } else f[0] = v[0], f[1] = v[2], f[2] = v[1], f[3] = v[3];
        return f;
      }
      function D(f, v) {
        var C = v[0], A = v[1], F = v[2], H = v[3], oe = C * H - F * A;
        return oe ? (oe = 1 / oe, f[0] = H * oe, f[1] = -A * oe, f[2] = -F * oe, f[3] = C * oe, f) : null;
      }
      function B(f, v) {
        var C = v[0];
        return f[0] = v[3], f[1] = -v[1], f[2] = -v[2], f[3] = C, f;
      }
      function j(f) {
        return f[0] * f[3] - f[2] * f[1];
      }
      function $(f, v, C) {
        var A = v[0], F = v[1], H = v[2], oe = v[3], le = C[0], ge = C[1], Ce = C[2], Te = C[3];
        return f[0] = A * le + H * ge, f[1] = F * le + oe * ge, f[2] = A * Ce + H * Te, f[3] = F * Ce + oe * Te, f;
      }
      function L(f, v, C) {
        var A = v[0], F = v[1], H = v[2], oe = v[3], le = Math.sin(C), ge = Math.cos(C);
        return f[0] = A * ge + H * le, f[1] = F * ge + oe * le, f[2] = A * -le + H * ge, f[3] = F * -le + oe * ge, f;
      }
      function X(f, v, C) {
        var A = v[0], F = v[1], H = v[2], oe = v[3], le = C[0], ge = C[1];
        return f[0] = A * le, f[1] = F * le, f[2] = H * ge, f[3] = oe * ge, f;
      }
      function M(f, v) {
        var C = Math.sin(v), A = Math.cos(v);
        return f[0] = A, f[1] = C, f[2] = -C, f[3] = A, f;
      }
      function J(f, v) {
        return f[0] = v[0], f[1] = 0, f[2] = 0, f[3] = v[1], f;
      }
      function Z(f) {
        return "mat2(" + f[0] + ", " + f[1] + ", " + f[2] + ", " + f[3] + ")";
      }
      function ee(f) {
        return Math.hypot(f[0], f[1], f[2], f[3]);
      }
      function K(f, v, C, A) {
        return f[2] = A[2] / A[0], C[0] = A[0], C[1] = A[1], C[3] = A[3] - f[2] * C[1], [f, v, C];
      }
      function se(f, v, C) {
        return f[0] = v[0] + C[0], f[1] = v[1] + C[1], f[2] = v[2] + C[2], f[3] = v[3] + C[3], f;
      }
      function re(f, v, C) {
        return f[0] = v[0] - C[0], f[1] = v[1] - C[1], f[2] = v[2] - C[2], f[3] = v[3] - C[3], f;
      }
      function ne(f, v) {
        return f[0] === v[0] && f[1] === v[1] && f[2] === v[2] && f[3] === v[3];
      }
      function de(f, v) {
        var C = f[0], A = f[1], F = f[2], H = f[3], oe = v[0], le = v[1], ge = v[2], Ce = v[3];
        return Math.abs(C - oe) <= p * Math.max(1, Math.abs(C), Math.abs(oe)) && Math.abs(A - le) <= p * Math.max(1, Math.abs(A), Math.abs(le)) && Math.abs(F - ge) <= p * Math.max(1, Math.abs(F), Math.abs(ge)) && Math.abs(H - Ce) <= p * Math.max(1, Math.abs(H), Math.abs(Ce));
      }
      function w(f, v, C) {
        return f[0] = v[0] * C, f[1] = v[1] * C, f[2] = v[2] * C, f[3] = v[3] * C, f;
      }
      function N(f, v, C, A) {
        return f[0] = v[0] + C[0] * A, f[1] = v[1] + C[1] * A, f[2] = v[2] + C[2] * A, f[3] = v[3] + C[3] * A, f;
      }
      Math.hypot || (Math.hypot = function() {
        for (var f = 0, v = arguments.length; v--; ) f += arguments[v] * arguments[v];
        return Math.sqrt(f);
      });
      var V = $, fe = re;
      function ce() {
        var f = new g(2);
        return g != Float32Array && (f[0] = 0, f[1] = 0), f;
      }
      function ve(f) {
        var v = new g(2);
        return v[0] = f[0], v[1] = f[1], v;
      }
      function ye(f, v) {
        var C = new g(2);
        return C[0] = f, C[1] = v, C;
      }
      function xe(f, v) {
        return f[0] = v[0], f[1] = v[1], f;
      }
      function be(f, v, C) {
        return f[0] = v, f[1] = C, f;
      }
      function Se(f, v, C) {
        return f[0] = v[0] + C[0], f[1] = v[1] + C[1], f;
      }
      function Ee(f, v, C) {
        return f[0] = v[0] - C[0], f[1] = v[1] - C[1], f;
      }
      function Oe(f, v, C) {
        return f[0] = v[0] * C[0], f[1] = v[1] * C[1], f;
      }
      function at(f, v, C) {
        return f[0] = v[0] / C[0], f[1] = v[1] / C[1], f;
      }
      function qt(f, v) {
        return f[0] = Math.ceil(v[0]), f[1] = Math.ceil(v[1]), f;
      }
      function st(f, v) {
        return f[0] = Math.floor(v[0]), f[1] = Math.floor(v[1]), f;
      }
      function qe(f, v, C) {
        return f[0] = Math.min(v[0], C[0]), f[1] = Math.min(v[1], C[1]), f;
      }
      function Vt(f, v, C) {
        return f[0] = Math.max(v[0], C[0]), f[1] = Math.max(v[1], C[1]), f;
      }
      function Ht(f, v) {
        return f[0] = Math.round(v[0]), f[1] = Math.round(v[1]), f;
      }
      function ct(f, v, C) {
        return f[0] = v[0] * C, f[1] = v[1] * C, f;
      }
      function Xt(f, v, C, A) {
        return f[0] = v[0] + C[0] * A, f[1] = v[1] + C[1] * A, f;
      }
      function ut(f, v) {
        var C = v[0] - f[0], A = v[1] - f[1];
        return Math.hypot(C, A);
      }
      function ft(f, v) {
        var C = v[0] - f[0], A = v[1] - f[1];
        return C * C + A * A;
      }
      function Ye(f) {
        var v = f[0], C = f[1];
        return Math.hypot(v, C);
      }
      function lt(f) {
        var v = f[0], C = f[1];
        return v * v + C * C;
      }
      function Ke(f, v) {
        return f[0] = -v[0], f[1] = -v[1], f;
      }
      function dt(f, v) {
        return f[0] = 1 / v[0], f[1] = 1 / v[1], f;
      }
      function pt(f, v) {
        var C = v[0], A = v[1], F = C * C + A * A;
        return F > 0 && (F = 1 / Math.sqrt(F)), f[0] = v[0] * F, f[1] = v[1] * F, f;
      }
      function ht(f, v) {
        return f[0] * v[0] + f[1] * v[1];
      }
      function Ze(f, v, C) {
        var A = v[0] * C[1] - v[1] * C[0];
        return f[0] = f[1] = 0, f[2] = A, f;
      }
      function Jt(f, v, C, A) {
        var F = v[0], H = v[1];
        return f[0] = F + A * (C[0] - F), f[1] = H + A * (C[1] - H), f;
      }
      function Qt(f, v) {
        v = v || 1;
        var C = 2 * T() * Math.PI;
        return f[0] = Math.cos(C) * v, f[1] = Math.sin(C) * v, f;
      }
      function vt(f, v, C) {
        var A = v[0], F = v[1];
        return f[0] = C[0] * A + C[2] * F, f[1] = C[1] * A + C[3] * F, f;
      }
      function $t(f, v, C) {
        var A = v[0], F = v[1];
        return f[0] = C[0] * A + C[2] * F + C[4], f[1] = C[1] * A + C[3] * F + C[5], f;
      }
      function gt(f, v, C) {
        var A = v[0], F = v[1];
        return f[0] = C[0] * A + C[3] * F + C[6], f[1] = C[1] * A + C[4] * F + C[7], f;
      }
      function mt(f, v, C) {
        var A = v[0], F = v[1];
        return f[0] = C[0] * A + C[4] * F + C[12], f[1] = C[1] * A + C[5] * F + C[13], f;
      }
      function je(f, v, C, A) {
        var F = v[0] - C[0], H = v[1] - C[1], oe = Math.sin(A), le = Math.cos(A);
        return f[0] = F * le - H * oe + C[0], f[1] = F * oe + H * le + C[1], f;
      }
      function Yt(f, v) {
        var C = f[0], A = f[1], F = v[0], H = v[1], oe = Math.sqrt(C * C + A * A) * Math.sqrt(F * F + H * H), le = oe && (C * F + A * H) / oe;
        return Math.acos(Math.min(Math.max(le, -1), 1));
      }
      function yt(f) {
        return f[0] = 0, f[1] = 0, f;
      }
      function Kt(f) {
        return "vec2(" + f[0] + ", " + f[1] + ")";
      }
      function Zt(f, v) {
        return f[0] === v[0] && f[1] === v[1];
      }
      function xt(f, v) {
        var C = f[0], A = f[1], F = v[0], H = v[1];
        return Math.abs(C - F) <= p * Math.max(1, Math.abs(C), Math.abs(F)) && Math.abs(A - H) <= p * Math.max(1, Math.abs(A), Math.abs(H));
      }
      var Le, _t = Ye, er = Ee, bt = Oe, Ct = at, tr = ut, Rt = ft, rr = lt, St = (Le = ce(), function(f, v, C, A, F, H) {
        var oe, le;
        for (v || (v = 2), C || (C = 0), le = A ? Math.min(A * v + C, f.length) : f.length, oe = C; oe < le; oe += v) Le[0] = f[oe], Le[1] = f[oe + 1], F(Le, Le, H), f[oe] = Le[0], f[oe + 1] = Le[1];
        return f;
      });
      function Fe() {
        var f = new g(3);
        return g != Float32Array && (f[0] = 0, f[1] = 0, f[2] = 0), f;
      }
      function Ve(f) {
        var v = new g(3);
        return v[0] = f[0], v[1] = f[1], v[2] = f[2], v;
      }
      function et(f) {
        var v = f[0], C = f[1], A = f[2];
        return Math.hypot(v, C, A);
      }
      function nr(f, v, C) {
        var A = new g(3);
        return A[0] = f, A[1] = v, A[2] = C, A;
      }
      function Tt(f, v) {
        return f[0] = v[0], f[1] = v[1], f[2] = v[2], f;
      }
      function we(f, v, C, A) {
        return f[0] = v, f[1] = C, f[2] = A, f;
      }
      function tt(f, v, C) {
        return f[0] = v[0] + C[0], f[1] = v[1] + C[1], f[2] = v[2] + C[2], f;
      }
      function Ie(f, v, C) {
        return f[0] = v[0] - C[0], f[1] = v[1] - C[1], f[2] = v[2] - C[2], f;
      }
      function Pt(f, v, C) {
        return f[0] = v[0] * C[0], f[1] = v[1] * C[1], f[2] = v[2] * C[2], f;
      }
      function Ot(f, v, C) {
        return f[0] = v[0] / C[0], f[1] = v[1] / C[1], f[2] = v[2] / C[2], f;
      }
      function or(f, v) {
        return f[0] = Math.ceil(v[0]), f[1] = Math.ceil(v[1]), f[2] = Math.ceil(v[2]), f;
      }
      function ir(f, v) {
        return f[0] = Math.floor(v[0]), f[1] = Math.floor(v[1]), f[2] = Math.floor(v[2]), f;
      }
      function Ue(f, v, C) {
        return f[0] = Math.min(v[0], C[0]), f[1] = Math.min(v[1], C[1]), f[2] = Math.min(v[2], C[2]), f;
      }
      function rt(f, v, C) {
        return f[0] = Math.max(v[0], C[0]), f[1] = Math.max(v[1], C[1]), f[2] = Math.max(v[2], C[2]), f;
      }
      function Et(f, v) {
        return f[0] = Math.round(v[0]), f[1] = Math.round(v[1]), f[2] = Math.round(v[2]), f;
      }
      function ar(f, v, C) {
        return f[0] = v[0] * C, f[1] = v[1] * C, f[2] = v[2] * C, f;
      }
      function sr(f, v, C, A) {
        return f[0] = v[0] + C[0] * A, f[1] = v[1] + C[1] * A, f[2] = v[2] + C[2] * A, f;
      }
      function Mt(f, v) {
        var C = v[0] - f[0], A = v[1] - f[1], F = v[2] - f[2];
        return Math.hypot(C, A, F);
      }
      function kt(f, v) {
        var C = v[0] - f[0], A = v[1] - f[1], F = v[2] - f[2];
        return C * C + A * A + F * F;
      }
      function nt(f) {
        var v = f[0], C = f[1], A = f[2];
        return v * v + C * C + A * A;
      }
      function cr(f, v) {
        return f[0] = -v[0], f[1] = -v[1], f[2] = -v[2], f;
      }
      function ur(f, v) {
        return f[0] = 1 / v[0], f[1] = 1 / v[1], f[2] = 1 / v[2], f;
      }
      function At(f, v) {
        var C = v[0], A = v[1], F = v[2], H = C * C + A * A + F * F;
        return H > 0 && (H = 1 / Math.sqrt(H)), f[0] = v[0] * H, f[1] = v[1] * H, f[2] = v[2] * H, f;
      }
      function Ne(f, v) {
        return f[0] * v[0] + f[1] * v[1] + f[2] * v[2];
      }
      function Be(f, v, C) {
        var A = v[0], F = v[1], H = v[2], oe = C[0], le = C[1], ge = C[2];
        return f[0] = F * ge - H * le, f[1] = H * oe - A * ge, f[2] = A * le - F * oe, f;
      }
      function He(f, v, C, A) {
        var F = v[0], H = v[1], oe = v[2];
        return f[0] = F + A * (C[0] - F), f[1] = H + A * (C[1] - H), f[2] = oe + A * (C[2] - oe), f;
      }
      function Dt(f, v, C, A, F, H) {
        var oe = H * H, le = oe * (2 * H - 3) + 1, ge = oe * (H - 2) + H, Ce = oe * (H - 1), Te = oe * (3 - 2 * H);
        return f[0] = v[0] * le + C[0] * ge + A[0] * Ce + F[0] * Te, f[1] = v[1] * le + C[1] * ge + A[1] * Ce + F[1] * Te, f[2] = v[2] * le + C[2] * ge + A[2] * Ce + F[2] * Te, f;
      }
      function fr(f, v, C, A, F, H) {
        var oe = 1 - H, le = oe * oe, ge = H * H, Ce = le * oe, Te = 3 * H * le, Ae = 3 * ge * oe, De = ge * H;
        return f[0] = v[0] * Ce + C[0] * Te + A[0] * Ae + F[0] * De, f[1] = v[1] * Ce + C[1] * Te + A[1] * Ae + F[1] * De, f[2] = v[2] * Ce + C[2] * Te + A[2] * Ae + F[2] * De, f;
      }
      function Me(f, v) {
        v = v || 1;
        var C = 2 * T() * Math.PI, A = 2 * T() - 1, F = Math.sqrt(1 - A * A) * v;
        return f[0] = Math.cos(C) * F, f[1] = Math.sin(C) * F, f[2] = A * v, f;
      }
      function Xe(f, v, C) {
        var A = v[0], F = v[1], H = v[2], oe = C[3] * A + C[7] * F + C[11] * H + C[15];
        return oe = oe || 1, f[0] = (C[0] * A + C[4] * F + C[8] * H + C[12]) / oe, f[1] = (C[1] * A + C[5] * F + C[9] * H + C[13]) / oe, f[2] = (C[2] * A + C[6] * F + C[10] * H + C[14]) / oe, f;
      }
      function jt(f, v, C) {
        var A = v[0], F = v[1], H = v[2];
        return f[0] = A * C[0] + F * C[3] + H * C[6], f[1] = A * C[1] + F * C[4] + H * C[7], f[2] = A * C[2] + F * C[5] + H * C[8], f;
      }
      function lr(f, v, C) {
        var A = C[0], F = C[1], H = C[2], oe = C[3], le = v[0], ge = v[1], Ce = v[2], Te = F * Ce - H * ge, Ae = H * le - A * Ce, De = A * ge - F * le, ze = F * De - H * Ae, Qe = H * Te - A * De, it = A * Ae - F * Te, m = 2 * oe;
        return Te *= m, Ae *= m, De *= m, ze *= 2, Qe *= 2, it *= 2, f[0] = le + Te + ze, f[1] = ge + Ae + Qe, f[2] = Ce + De + it, f;
      }
      function dr(f, v, C, A) {
        var F = [], H = [];
        return F[0] = v[0] - C[0], F[1] = v[1] - C[1], F[2] = v[2] - C[2], H[0] = F[0], H[1] = F[1] * Math.cos(A) - F[2] * Math.sin(A), H[2] = F[1] * Math.sin(A) + F[2] * Math.cos(A), f[0] = H[0] + C[0], f[1] = H[1] + C[1], f[2] = H[2] + C[2], f;
      }
      function Je(f, v, C, A) {
        var F = [], H = [];
        return F[0] = v[0] - C[0], F[1] = v[1] - C[1], F[2] = v[2] - C[2], H[0] = F[2] * Math.sin(A) + F[0] * Math.cos(A), H[1] = F[1], H[2] = F[2] * Math.cos(A) - F[0] * Math.sin(A), f[0] = H[0] + C[0], f[1] = H[1] + C[1], f[2] = H[2] + C[2], f;
      }
      function It(f, v, C, A) {
        var F = [], H = [];
        return F[0] = v[0] - C[0], F[1] = v[1] - C[1], F[2] = v[2] - C[2], H[0] = F[0] * Math.cos(A) - F[1] * Math.sin(A), H[1] = F[0] * Math.sin(A) + F[1] * Math.cos(A), H[2] = F[2], f[0] = H[0] + C[0], f[1] = H[1] + C[1], f[2] = H[2] + C[2], f;
      }
      function pr(f, v) {
        var C = f[0], A = f[1], F = f[2], H = v[0], oe = v[1], le = v[2], ge = Math.sqrt(C * C + A * A + F * F) * Math.sqrt(H * H + oe * oe + le * le), Ce = ge && Ne(f, v) / ge;
        return Math.acos(Math.min(Math.max(Ce, -1), 1));
      }
      function hr(f) {
        return f[0] = 0, f[1] = 0, f[2] = 0, f;
      }
      function vr(f) {
        return "vec3(" + f[0] + ", " + f[1] + ", " + f[2] + ")";
      }
      function gr(f, v) {
        return f[0] === v[0] && f[1] === v[1] && f[2] === v[2];
      }
      function mr(f, v) {
        var C = f[0], A = f[1], F = f[2], H = v[0], oe = v[1], le = v[2];
        return Math.abs(C - H) <= p * Math.max(1, Math.abs(C), Math.abs(H)) && Math.abs(A - oe) <= p * Math.max(1, Math.abs(A), Math.abs(oe)) && Math.abs(F - le) <= p * Math.max(1, Math.abs(F), Math.abs(le));
      }
      var Lt = Ie, yr = Pt, xr = Ot, zt = Mt, _r = kt, ot = et, br = nt, Ut = function() {
        var f = Fe();
        return function(v, C, A, F, H, oe) {
          var le, ge;
          for (C || (C = 3), A || (A = 0), ge = F ? Math.min(F * C + A, v.length) : v.length, le = A; le < ge; le += C) f[0] = v[le], f[1] = v[le + 1], f[2] = v[le + 2], H(f, f, oe), v[le] = f[0], v[le + 1] = f[1], v[le + 2] = f[2];
          return v;
        };
      }();
    }, function(t, o, e) {
      var r = e(13).default, i = e(1);
      t.exports = function(a, c) {
        if (c && (r(c) === "object" || typeof c == "function")) return c;
        if (c !== void 0) throw new TypeError("Derived constructors may only return object or undefined");
        return i(a);
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(40);
      t.exports = function(i, a) {
        if (typeof a != "function" && a !== null) throw new TypeError("Super expression must either be null or a function");
        i.prototype = Object.create(a && a.prototype, { constructor: { value: i, writable: !0, configurable: !0 } }), Object.defineProperty(i, "prototype", { writable: !1 }), a && r(i, a);
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(141)();
      t.exports = r;
      try {
        regeneratorRuntime = r;
      } catch {
        typeof globalThis == "object" ? globalThis.regeneratorRuntime = r : Function("r", "regeneratorRuntime = r")(r);
      }
    }, function(t, o, e) {
      o.a = { init: function(r, i) {
        r.fill(i);
      }, shuffle: function(r) {
        for (var i = r.length - 1; i > 0; i--) {
          var a = Math.floor(Math.random() * (i + 1)), c = [r[a], r[i]];
          r[i] = c[0], r[a] = c[1];
        }
        return r;
      }, toPointList: function(r) {
        var i = r.reduce(function(a, c) {
          var p = "[".concat(c.join(","), "]");
          return a.push(p), a;
        }, []);
        return "[".concat(i.join(`,\r
`), "]");
      }, threshold: function(r, i, a) {
        return r.reduce(function(c, p) {
          return a.apply(r, [p]) >= i && c.push(p), c;
        }, []);
      }, maxIndex: function(r) {
        for (var i = 0, a = 0; a < r.length; a++) r[a] > r[i] && (i = a);
        return i;
      }, max: function(r) {
        for (var i = 0, a = 0; a < r.length; a++) r[a] > i && (i = r[a]);
        return i;
      }, sum: function(r) {
        for (var i = r.length, a = 0; i--; ) a += r[i];
        return a;
      } };
    }, function(t, o, e) {
      e.d(o, "h", function() {
        return p;
      }), e.d(o, "i", function() {
        return T;
      }), e.d(o, "b", function() {
        return P;
      }), e.d(o, "j", function() {
        return z;
      }), e.d(o, "e", function() {
        return I;
      }), e.d(o, "c", function() {
        return q;
      }), e.d(o, "f", function() {
        return ie;
      }), e.d(o, "g", function() {
        return te;
      }), e.d(o, "a", function() {
        return G;
      }), e.d(o, "d", function() {
        return k;
      });
      var r = e(5), i = e(9);
      r.a.setMatrixArrayType(Array);
      var a = function(O, D) {
        var B = [], j = { rad: 0, vec: r.c.clone([0, 0]) }, $ = {};
        function L(M) {
          $[M.id] = M, B.push(M);
        }
        function X() {
          var M, J = 0;
          for (M = 0; M < B.length; M++) J += B[M].rad;
          j.rad = J / B.length, j.vec = r.c.clone([Math.cos(j.rad), Math.sin(j.rad)]);
        }
        return L(O), X(), { add: function(M) {
          $[M.id] || (L(M), X());
        }, fits: function(M) {
          return Math.abs(r.c.dot(M.point.vec, j.vec)) > D;
        }, getPoints: function() {
          return B;
        }, getCenter: function() {
          return j;
        } };
      }, c = function(O, D, B) {
        return { rad: O[B], point: O, id: D };
      };
      function p(O, D) {
        return { x: O, y: D, toVec2: function() {
          return r.c.clone([this.x, this.y]);
        }, toVec3: function() {
          return r.d.clone([this.x, this.y, 1]);
        }, round: function() {
          return this.x = this.x > 0 ? Math.floor(this.x + 0.5) : Math.floor(this.x - 0.5), this.y = this.y > 0 ? Math.floor(this.y + 0.5) : Math.floor(this.y - 0.5), this;
        } };
      }
      function g(O, D) {
        D || (D = 8);
        for (var B = O.data, j = B.length, $ = 8 - D, L = new Int32Array(1 << D); j--; ) L[B[j] >> $]++;
        return L;
      }
      function T(O, D) {
        var B = function(j) {
          var $, L = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 8, X = 8 - L;
          function M(K, se) {
            for (var re = 0, ne = K; ne <= se; ne++) re += $[ne];
            return re;
          }
          function J(K, se) {
            for (var re = 0, ne = K; ne <= se; ne++) re += ne * $[ne];
            return re;
          }
          function Z() {
            var K, se, re, ne, de = [0], w = (1 << L) - 1;
            $ = g(j, L);
            for (var N = 1; N < w; N++) (re = (K = M(0, N)) * (se = M(N + 1, w))) === 0 && (re = 1), ne = J(0, N) * se - J(N + 1, w) * K, de[N] = ne * ne / re;
            return i.a.maxIndex(de);
          }
          var ee = Z();
          return ee << X;
        }(O);
        return function(j, $, L) {
          L || (L = j);
          for (var X = j.data, M = X.length, J = L.data; M--; ) J[M] = X[M] < $ ? 1 : 0;
        }(O, B, D), B;
      }
      function P(O, D, B) {
        var j, $, L, X, M = [];
        function J(Z) {
          var ee = !1;
          for ($ = 0; $ < M.length; $++) (L = M[$]).fits(Z) && (L.add(Z), ee = !0);
          return ee;
        }
        for (B || (B = "rad"), j = 0; j < O.length; j++) J(X = c(O[j], j, B)) || M.push(a(X, D));
        return M;
      }
      r.a.setMatrixArrayType(Array);
      function z(O, D, B) {
        var j, $, L, X, M = 0, J = 0, Z = [];
        for (j = 0; j < D; j++) Z[j] = { score: 0, item: null };
        for (j = 0; j < O.length; j++) if (($ = B.apply(this, [O[j]])) > J) for ((L = Z[M]).score = $, L.item = O[j], J = Number.MAX_VALUE, X = 0; X < D; X++) Z[X].score < J && (J = Z[X].score, M = X);
        return Z;
      }
      function I(O, D, B) {
        for (var j, $ = 0, L = D.x, X = Math.floor(O.length / 4), M = D.x / 2, J = 0, Z = D.x; L < X; ) {
          for (j = 0; j < M; j++) B[J] = (0.299 * O[4 * $ + 0] + 0.587 * O[4 * $ + 1] + 0.114 * O[4 * $ + 2] + (0.299 * O[4 * ($ + 1) + 0] + 0.587 * O[4 * ($ + 1) + 1] + 0.114 * O[4 * ($ + 1) + 2]) + (0.299 * O[4 * L + 0] + 0.587 * O[4 * L + 1] + 0.114 * O[4 * L + 2]) + (0.299 * O[4 * (L + 1) + 0] + 0.587 * O[4 * (L + 1) + 1] + 0.114 * O[4 * (L + 1) + 2])) / 4, J++, $ += 2, L += 2;
          $ += Z, L += Z;
        }
      }
      function q(O, D, B) {
        var j = O.length / 4 | 0;
        if (B && B.singleChannel === !0) for (var $ = 0; $ < j; $++) D[$] = O[4 * $ + 0];
        else for (var L = 0; L < j; L++) D[L] = 0.299 * O[4 * L + 0] + 0.587 * O[4 * L + 1] + 0.114 * O[4 * L + 2];
      }
      function ie(O, D) {
        for (var B = O.data, j = O.size.x, $ = D.data, L = 0, X = j, M = B.length, J = j / 2, Z = 0; X < M; ) {
          for (var ee = 0; ee < J; ee++) $[Z] = Math.floor((B[L] + B[L + 1] + B[X] + B[X + 1]) / 4), Z++, L += 2, X += 2;
          L += j, X += j;
        }
      }
      function te(O) {
        var D = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [0, 0, 0], B = O[0], j = O[1], $ = O[2], L = $ * j, X = L * (1 - Math.abs(B / 60 % 2 - 1)), M = $ - L, J = 0, Z = 0, ee = 0;
        return B < 60 ? (J = L, Z = X) : B < 120 ? (J = X, Z = L) : B < 180 ? (Z = L, ee = X) : B < 240 ? (Z = X, ee = L) : B < 300 ? (J = X, ee = L) : B < 360 && (J = L, ee = X), D[0] = 255 * (J + M) | 0, D[1] = 255 * (Z + M) | 0, D[2] = 255 * (ee + M) | 0, D;
      }
      function ae(O) {
        for (var D = [], B = [], j = 1; j < Math.sqrt(O) + 1; j++) O % j == 0 && (B.push(j), j !== O / j && D.unshift(Math.floor(O / j)));
        return B.concat(D);
      }
      function G(O, D) {
        var B, j = ae(D.x), $ = ae(D.y), L = Math.max(D.x, D.y), X = function(re, ne) {
          for (var de = 0, w = 0, N = []; de < re.length && w < ne.length; ) re[de] === ne[w] ? (N.push(re[de]), de++, w++) : re[de] > ne[w] ? w++ : de++;
          return N;
        }(j, $), M = [8, 10, 15, 20, 32, 60, 80], J = { "x-small": 5, small: 4, medium: 3, large: 2, "x-large": 1 }, Z = J[O] || J.medium, ee = M[Z], K = Math.floor(L / ee);
        function se(re) {
          for (var ne = 0, de = re[Math.floor(re.length / 2)]; ne < re.length - 1 && re[ne] < K; ) ne++;
          return ne > 0 && (de = Math.abs(re[ne] - K) > Math.abs(re[ne - 1] - K) ? re[ne - 1] : re[ne]), K / de < M[Z + 1] / M[Z] && K / de > M[Z - 1] / M[Z] ? { x: de, y: de } : null;
        }
        return (B = se(X)) || (B = se(ae(L))) || (B = se(ae(K * ee))), B;
      }
      var U = { top: function(O, D) {
        return O.unit === "%" ? Math.floor(D.height * (O.value / 100)) : null;
      }, right: function(O, D) {
        return O.unit === "%" ? Math.floor(D.width - D.width * (O.value / 100)) : null;
      }, bottom: function(O, D) {
        return O.unit === "%" ? Math.floor(D.height - D.height * (O.value / 100)) : null;
      }, left: function(O, D) {
        return O.unit === "%" ? Math.floor(D.width * (O.value / 100)) : null;
      } };
      function k(O, D, B) {
        var j = { width: O, height: D }, $ = Object.keys(B).reduce(function(L, X) {
          var M = function(Z) {
            return { value: parseFloat(Z), unit: (Z.indexOf("%"), Z.length, "%") };
          }(B[X]), J = U[X](M, j);
          return L[X] = J, L;
        }, {});
        return { sx: $.left, sy: $.top, sw: $.right - $.left, sh: $.bottom - $.top };
      }
    }, function(t, o, e) {
      var r = e(62), i = e.n(r), a = e(3), c = e.n(a), p = e(4), g = e.n(p), T = e(0), P = e.n(T), z = e(5), I = e(9), q = e(10);
      function ie(ae) {
        if (ae < 0) throw new Error("expected positive number, received ".concat(ae));
      }
      z.a.setMatrixArrayType(Array);
      var te = function() {
        function ae(G, U) {
          var k = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Uint8Array, O = arguments.length > 3 ? arguments[3] : void 0;
          c()(this, ae), P()(this, "data", void 0), P()(this, "size", void 0), P()(this, "indexMapping", void 0), U ? this.data = U : (this.data = new k(G.x * G.y), O && I.a.init(this.data, 0)), this.size = G;
        }
        return g()(ae, [{ key: "inImageWithBorder", value: function(G) {
          var U = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return ie(U), G.x >= 0 && G.y >= 0 && G.x < this.size.x + 2 * U && G.y < this.size.y + 2 * U;
        } }, { key: "subImageAsCopy", value: function(G, U) {
          ie(U.x), ie(U.y);
          for (var k = G.size, O = k.x, D = k.y, B = 0; B < O; B++) for (var j = 0; j < D; j++) G.data[j * O + B] = this.data[(U.y + j) * this.size.x + U.x + B];
          return G;
        } }, { key: "get", value: function(G, U) {
          return this.data[U * this.size.x + G];
        } }, { key: "getSafe", value: function(G, U) {
          if (!this.indexMapping) {
            this.indexMapping = { x: [], y: [] };
            for (var k = 0; k < this.size.x; k++) this.indexMapping.x[k] = k, this.indexMapping.x[k + this.size.x] = k;
            for (var O = 0; O < this.size.y; O++) this.indexMapping.y[O] = O, this.indexMapping.y[O + this.size.y] = O;
          }
          return this.data[this.indexMapping.y[U + this.size.y] * this.size.x + this.indexMapping.x[G + this.size.x]];
        } }, { key: "set", value: function(G, U, k) {
          return this.data[U * this.size.x + G] = k, delete this.indexMapping, this;
        } }, { key: "zeroBorder", value: function() {
          for (var G = this.size, U = G.x, k = G.y, O = 0; O < U; O++) this.data[O] = this.data[(k - 1) * U + O] = 0;
          for (var D = 1; D < k - 1; D++) this.data[D * U] = this.data[D * U + (U - 1)] = 0;
          return delete this.indexMapping, this;
        } }, { key: "moments", value: function(G) {
          var U, k, O, D, B, j, $, L, X, M, J = this.data, Z = this.size.y, ee = this.size.x, K = [], se = [], re = Math.PI, ne = re / 4;
          if (G <= 0) return se;
          for (B = 0; B < G; B++) K[B] = { m00: 0, m01: 0, m10: 0, m11: 0, m02: 0, m20: 0, theta: 0, rad: 0 };
          for (k = 0; k < Z; k++) for (D = k * k, U = 0; U < ee; U++) (O = J[k * ee + U]) > 0 && ((j = K[O - 1]).m00 += 1, j.m01 += k, j.m10 += U, j.m11 += U * k, j.m02 += D, j.m20 += U * U);
          for (B = 0; B < G; B++) j = K[B], isNaN(j.m00) || j.m00 === 0 || (L = j.m10 / j.m00, X = j.m01 / j.m00, $ = j.m11 / j.m00 - L * X, M = (j.m02 / j.m00 - X * X - (j.m20 / j.m00 - L * L)) / (2 * $), M = 0.5 * Math.atan(M) + ($ >= 0 ? ne : -ne) + re, j.theta = (180 * M / re + 90) % 180 - 90, j.theta < 0 && (j.theta += 180), j.rad = M > re ? M - re : M, j.vec = z.c.clone([Math.cos(M), Math.sin(M)]), se.push(j));
          return se;
        } }, { key: "getAsRGBA", value: function() {
          for (var G = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, U = new Uint8ClampedArray(4 * this.size.x * this.size.y), k = 0; k < this.size.y; k++) for (var O = 0; O < this.size.x; O++) {
            var D = k * this.size.x + O, B = this.get(O, k) * G;
            U[4 * D + 0] = B, U[4 * D + 1] = B, U[4 * D + 2] = B, U[4 * D + 3] = 255;
          }
          return U;
        } }, { key: "show", value: function(G) {
          var U = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
          console.warn("* imagewrapper show getcontext 2d");
          var k = G.getContext("2d");
          if (!k) throw new Error("Unable to get canvas context");
          var O = k.getImageData(0, 0, G.width, G.height), D = this.getAsRGBA(U);
          G.width = this.size.x, G.height = this.size.y;
          var B = new ImageData(D, O.width, O.height);
          k.putImageData(B, 0, 0);
        } }, { key: "overlay", value: function(G, U, k) {
          var O = U < 0 || U > 360 ? 360 : U, D = [0, 1, 1], B = [0, 0, 0], j = [255, 255, 255], $ = [0, 0, 0];
          console.warn("* imagewrapper overlay getcontext 2d");
          var L = G.getContext("2d");
          if (!L) throw new Error("Unable to get canvas context");
          for (var X = L.getImageData(k.x, k.y, this.size.x, this.size.y), M = X.data, J = this.data.length; J--; ) {
            D[0] = this.data[J] * O;
            var Z = 4 * J, ee = D[0] <= 0 ? j : D[0] >= 360 ? $ : Object(q.g)(D, B), K = i()(ee, 3);
            M[Z] = K[0], M[Z + 1] = K[1], M[Z + 2] = K[2], M[Z + 3] = 255;
          }
          L.putImageData(X, k.x, k.y);
        } }]), ae;
      }();
      o.a = te;
    }, function(t, o) {
      function e(r, i, a, c, p, g, T) {
        try {
          var P = r[g](T), z = P.value;
        } catch (I) {
          return void a(I);
        }
        P.done ? i(z) : Promise.resolve(z).then(c, p);
      }
      t.exports = function(r) {
        return function() {
          var i = this, a = arguments;
          return new Promise(function(c, p) {
            var g = r.apply(i, a);
            function T(z) {
              e(g, c, p, T, P, "next", z);
            }
            function P(z) {
              e(g, c, p, T, P, "throw", z);
            }
            T(void 0);
          });
        };
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o) {
      function e(r) {
        return t.exports = e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(i) {
          return typeof i;
        } : function(i) {
          return i && typeof Symbol == "function" && i.constructor === Symbol && i !== Symbol.prototype ? "symbol" : typeof i;
        }, t.exports.__esModule = !0, t.exports.default = t.exports, e(r);
      }
      t.exports = e, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(142);
      function i() {
        return typeof Reflect < "u" && Reflect.get ? (t.exports = i = Reflect.get.bind(), t.exports.__esModule = !0, t.exports.default = t.exports) : (t.exports = i = function(a, c, p) {
          var g = r(a, c);
          if (g) {
            var T = Object.getOwnPropertyDescriptor(g, c);
            return T.get ? T.get.call(arguments.length < 3 ? a : p) : T.value;
          }
        }, t.exports.__esModule = !0, t.exports.default = t.exports), i.apply(this, arguments);
      }
      t.exports = i, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o) {
      t.exports = function(e) {
        var r = typeof e;
        return e != null && (r == "object" || r == "function");
      };
    }, function(t, o) {
      var e = Array.isArray;
      t.exports = e;
    }, function(t, o, e) {
      o.a = { drawRect: function(r, i, a, c) {
        a.strokeStyle = c.color, a.fillStyle = c.color, a.lineWidth = c.lineWidth || 1, a.beginPath(), a.strokeRect(r.x, r.y, i.x, i.y);
      }, drawPath: function(r, i, a, c) {
        a.strokeStyle = c.color, a.fillStyle = c.color, a.lineWidth = c.lineWidth, a.beginPath(), a.moveTo(r[0][i.x], r[0][i.y]);
        for (var p = 1; p < r.length; p++) a.lineTo(r[p][i.x], r[p][i.y]);
        a.closePath(), a.stroke();
      }, drawImage: function(r, i, a) {
        var c = a.getImageData(0, 0, i.x, i.y), p = c.data, g = p.length, T = r.length;
        if (g / T != 4) return !1;
        for (; T--; ) {
          var P = r[T];
          p[--g] = 255, p[--g] = P, p[--g] = P, p[--g] = P;
        }
        return a.putImageData(c, 0, 0), !0;
      } };
    }, function(t, o, e) {
      var r = e(74), i = e(129)(function(a, c, p) {
        r(a, c, p);
      });
      t.exports = i;
    }, function(t, o, e) {
      var r = e(44), i = typeof self == "object" && self && self.Object === Object && self, a = r || i || Function("return this")();
      t.exports = a;
    }, function(t, o) {
      t.exports = function(e) {
        return e != null && typeof e == "object";
      };
    }, function(t, o, e) {
      o.a = { searchDirections: [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]], create: function(r, i) {
        var a, c = r.data, p = i.data, g = this.searchDirections, T = r.size.x;
        function P(I, q, ie, te) {
          var ae, G, U;
          for (ae = 0; ae < g.length; ae++) {
            if (G = I.cy + g[I.dir][0], U = I.cx + g[I.dir][1], c[a = G * T + U] === q && (p[a] === 0 || p[a] === ie)) return p[a] = ie, I.cy = G, I.cx = U, !0;
            p[a] === 0 && (p[a] = te), I.dir = (I.dir + 1) % 8;
          }
          return !1;
        }
        function z(I, q, ie) {
          return { dir: ie, x: I, y: q, next: null, prev: null };
        }
        return { trace: function(I, q, ie, te) {
          return P(I, q, ie, te);
        }, contourTracing: function(I, q, ie, te, ae) {
          return function(G, U, k, O, D) {
            var B, j, $, L = null, X = { cx: U, cy: G, dir: 0 };
            if (P(X, O, k, D)) {
              B = L = z(U, G, X.dir), $ = X.dir, (j = z(X.cx, X.cy, 0)).prev = B, B.next = j, j.next = null, B = j;
              var M = r.size.x * r.size.y, J = 0;
              do
                X.dir = (X.dir + 6) % 8, P(X, O, k, D), $ !== X.dir ? (B.dir = X.dir, (j = z(X.cx, X.cy, 0)).prev = B, B.next = j, j.next = null, B = j) : (B.dir = $, B.x = X.cx, B.y = X.cy), $ = X.dir;
              while ((X.cx !== U || X.cy !== G) && ++J < M);
              L.prev = B.prev, B.prev.next = L;
            }
            return L;
          }(I, q, ie, te, ae);
        } };
      } };
    }, function(t, o, e) {
      var r = e(27), i = e(87), a = e(88), c = r ? r.toStringTag : void 0;
      t.exports = function(p) {
        return p == null ? p === void 0 ? "[object Undefined]" : "[object Null]" : c && c in Object(p) ? i(p) : a(p);
      };
    }, function(t, o, e) {
      (function(r) {
        var i, a, c, p, g, T, P, z, I, q, ie = e(5), te = e(11), ae = e(10), G = e(9), U = (e(17), e(65)), k = e(21), O = e(66);
        ie.a.setMatrixArrayType(Array);
        var D, B, j = { ctx: { binary: null }, dom: { binary: null } }, $ = { x: 0, y: 0 };
        function L(J) {
          var Z, ee, K, se, re, ne, de, w = I.size.x, N = I.size.y, V = -I.size.x, fe = -I.size.y;
          for (Z = 0, ee = 0; ee < J.length; ee++) Z += (se = J[ee]).rad;
          for ((Z = (180 * (Z /= J.length) / Math.PI + 90) % 180 - 90) < 0 && (Z += 180), Z = (180 - Z) * Math.PI / 180, re = ie.b.copy(ie.b.create(), [Math.cos(Z), Math.sin(Z), -Math.sin(Z), Math.cos(Z)]), ee = 0; ee < J.length; ee++)
            for (se = J[ee], K = 0; K < 4; K++) ie.c.transformMat2(se.box[K], se.box[K], re);
          for (ee = 0; ee < J.length; ee++) for (se = J[ee], K = 0; K < 4; K++) se.box[K][0] < w && (w = se.box[K][0]), se.box[K][0] > V && (V = se.box[K][0]), se.box[K][1] < N && (N = se.box[K][1]), se.box[K][1] > fe && (fe = se.box[K][1]);
          for (ne = [[w, N], [V, N], [V, fe], [w, fe]], de = i.halfSample ? 2 : 1, re = ie.b.invert(re, re), K = 0; K < 4; K++) ie.c.transformMat2(ne[K], ne[K], re);
          for (K = 0; K < 4; K++) ie.c.scale(ne[K], ne[K], de);
          return ne;
        }
        function X(J, Z) {
          I.subImageAsCopy(p, Object(ae.h)(J, Z)), B.skeletonize();
        }
        function M(J, Z, ee, K) {
          var se, re, ne, de, w = [], N = [], V = Math.ceil(q.x / 3);
          if (J.length >= 2) {
            for (se = 0; se < J.length; se++) J[se].m00 > V && w.push(J[se]);
            if (w.length >= 2) {
              for (ne = function(ve) {
                var ye = Object(ae.b)(ve, 0.9), xe = Object(ae.j)(ye, 1, function(Oe) {
                  return Oe.getPoints().length;
                }), be = [], Se = [];
                if (xe.length === 1) {
                  be = xe[0].item.getPoints();
                  for (var Ee = 0; Ee < be.length; Ee++) Se.push(be[Ee].point);
                }
                return Se;
              }(w), re = 0, se = 0; se < ne.length; se++) {
                var fe, ce;
                re += (fe = (ce = ne[se]) === null || ce === void 0 ? void 0 : ce.rad) !== null && fe !== void 0 ? fe : 0;
              }
              ne.length > 1 && ne.length >= w.length / 4 * 3 && ne.length > J.length / 4 && (re /= ne.length, de = { index: Z[1] * $.x + Z[0], pos: { x: ee, y: K }, box: [ie.c.clone([ee, K]), ie.c.clone([ee + p.size.x, K]), ie.c.clone([ee + p.size.x, K + p.size.y]), ie.c.clone([ee, K + p.size.y])], moments: ne, rad: re, vec: ie.c.clone([Math.cos(re), Math.sin(re)]) }, N.push(de));
            }
          }
          return N;
        }
        o.a = { init: function(J, Z) {
          i = Z, D = J, function() {
            a = i.halfSample ? new te.a({ x: D.size.x / 2 | 0, y: D.size.y / 2 | 0 }) : D, q = Object(ae.a)(i.patchSize, a.size), $.x = a.size.x / q.x | 0, $.y = a.size.y / q.y | 0, I = new te.a(a.size, void 0, Uint8Array, !1), g = new te.a(q, void 0, Array, !0);
            var ee = new ArrayBuffer(65536);
            p = new te.a(q, new Uint8Array(ee, 0, q.x * q.y)), c = new te.a(q, new Uint8Array(ee, q.x * q.y * 3, q.x * q.y), void 0, !0), B = Object(O.a)(typeof window < "u" ? window : typeof self < "u" ? self : r, { size: q.x }, ee), z = new te.a({ x: a.size.x / p.size.x | 0, y: a.size.y / p.size.y | 0 }, void 0, Array, !0), T = new te.a(z.size, void 0, void 0, !0), P = new te.a(z.size, void 0, Int32Array, !0);
          }(), function() {
            if (!i.useWorker && typeof document < "u") {
              j.dom.binary = document.createElement("canvas"), j.dom.binary.className = "binaryBuffer";
              var ee = !!i.willReadFrequently;
              console.warn("* initCanvas willReadFrequently", ee, i), j.ctx.binary = j.dom.binary.getContext("2d", { willReadFrequently: ee }), j.dom.binary.width = I.size.x, j.dom.binary.height = I.size.y;
            }
          }();
        }, locate: function() {
          i.halfSample && Object(ae.f)(D, a), Object(ae.i)(a, I), I.zeroBorder();
          var J = function() {
            var K, se, re, ne, de, w, N = [];
            for (K = 0; K < $.x; K++) for (se = 0; se < $.y; se++) X(re = p.size.x * K, ne = p.size.y * se), c.zeroBorder(), G.a.init(g.data, 0), w = U.a.create(c, g).rasterize(0), de = g.moments(w.count), N = N.concat(M(de, [K, se], re, ne));
            return N;
          }();
          if (J.length < $.x * $.y * 0.05) return null;
          var Z = function(K) {
            var se, re, ne = 0, de = 0;
            function w() {
              var V;
              for (V = 0; V < P.data.length; V++) if (P.data[V] === 0 && T.data[V] === 1) return V;
              return P.data.length;
            }
            function N(V) {
              var fe, ce, ve, ye, xe, be = V % P.size.x, Se = V / P.size.x | 0;
              if (V < P.data.length) for (ve = z.data[V], P.data[V] = ne, xe = 0; xe < k.a.searchDirections.length; xe++) ce = Se + k.a.searchDirections[xe][0], fe = be + k.a.searchDirections[xe][1], ye = ce * P.size.x + fe, T.data[ye] !== 0 ? P.data[ye] === 0 && Math.abs(ie.c.dot(z.data[ye].vec, ve.vec)) > 0.95 && N(ye) : P.data[ye] = Number.MAX_VALUE;
            }
            for (G.a.init(T.data, 0), G.a.init(P.data, 0), G.a.init(z.data, null), se = 0; se < K.length; se++) re = K[se], z.data[re.index] = re, T.data[re.index] = 1;
            for (T.zeroBorder(); (de = w()) < P.data.length; ) ne++, N(de);
            return ne;
          }(J);
          if (Z < 1) return null;
          var ee = function(K) {
            var se, re, ne = [];
            for (se = 0; se < K; se++) ne.push(0);
            for (re = P.data.length; re--; ) P.data[re] > 0 && ne[P.data[re] - 1]++;
            return (ne = ne.map(function(de, w) {
              return { val: de, label: w + 1 };
            })).sort(function(de, w) {
              return w.val - de.val;
            }), ne.filter(function(de) {
              return de.val >= 5;
            });
          }(Z);
          return ee.length === 0 ? null : function(K, se) {
            var re, ne, de, w, N = [], V = [];
            for (re = 0; re < K.length; re++) {
              for (ne = P.data.length, N.length = 0; ne--; ) P.data[ne] === K[re].label && (de = z.data[ne], N.push(de));
              (w = L(N)) && V.push(w);
            }
            return V;
          }(ee);
        }, checkImageConstraints: function(J, Z) {
          var ee, K, se = J.getWidth(), re = J.getHeight(), ne = Z.halfSample ? 0.5 : 1;
          J.getConfig().area && (K = Object(ae.d)(se, re, J.getConfig().area), J.setTopRight({ x: K.sx, y: K.sy }), J.setCanvasSize({ x: se, y: re }), se = K.sw, re = K.sh);
          var de = { x: Math.floor(se * ne), y: Math.floor(re * ne) };
          if (ee = Object(ae.a)(Z.patchSize, de), J.setWidth(Math.max(Math.floor(Math.floor(de.x / ee.x) * (1 / ne) * ee.x), ee.x)), J.setHeight(Math.max(Math.floor(Math.floor(de.y / ee.y) * (1 / ne) * ee.y), ee.y)), J.getWidth() % ee.x == 0 && J.getHeight() % ee.y == 0) return !0;
          throw new Error("Image dimensions do not comply with the current settings: Width (".concat(se, " )and height (").concat(re, ") must a multiple of ").concat(ee.x));
        } };
      }).call(this, e(45));
    }, function(t, o, e) {
      var r = e(76), i = e(77), a = e(78), c = e(79), p = e(80);
      function g(T) {
        var P = -1, z = T == null ? 0 : T.length;
        for (this.clear(); ++P < z; ) {
          var I = T[P];
          this.set(I[0], I[1]);
        }
      }
      g.prototype.clear = r, g.prototype.delete = i, g.prototype.get = a, g.prototype.has = c, g.prototype.set = p, t.exports = g;
    }, function(t, o, e) {
      var r = e(26);
      t.exports = function(i, a) {
        for (var c = i.length; c--; ) if (r(i[c][0], a)) return c;
        return -1;
      };
    }, function(t, o) {
      t.exports = function(e, r) {
        return e === r || e != e && r != r;
      };
    }, function(t, o, e) {
      var r = e(19).Symbol;
      t.exports = r;
    }, function(t, o, e) {
      var r = e(34)(Object, "create");
      t.exports = r;
    }, function(t, o, e) {
      var r = e(101);
      t.exports = function(i, a) {
        var c = i.__data__;
        return r(a) ? c[typeof a == "string" ? "string" : "hash"] : c.map;
      };
    }, function(t, o, e) {
      var r = e(116), i = e(20), a = Object.prototype, c = a.hasOwnProperty, p = a.propertyIsEnumerable, g = r(/* @__PURE__ */ function() {
        return arguments;
      }()) ? r : function(T) {
        return i(T) && c.call(T, "callee") && !p.call(T, "callee");
      };
      t.exports = g;
    }, function(t, o) {
      var e = /^(?:0|[1-9]\d*)$/;
      t.exports = function(r, i) {
        var a = typeof r;
        return !!(i = i ?? 9007199254740991) && (a == "number" || a != "symbol" && e.test(r)) && r > -1 && r % 1 == 0 && r < i;
      };
    }, function(t, o, e) {
      var r = e(16), i = e(149), a = e(150), c = e(153);
      t.exports = function(p, g) {
        return r(p) ? p : i(p, g) ? [p] : a(c(p));
      };
    }, function(t, o, e) {
      var r = e(143), i = e(144), a = e(59), c = e(145);
      t.exports = function(p) {
        return r(p) || i(p) || a(p) || c();
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(86), i = e(92);
      t.exports = function(a, c) {
        var p = i(a, c);
        return r(p) ? p : void 0;
      };
    }, function(t, o, e) {
      var r = e(22), i = e(15);
      t.exports = function(a) {
        if (!i(a)) return !1;
        var c = r(a);
        return c == "[object Function]" || c == "[object GeneratorFunction]" || c == "[object AsyncFunction]" || c == "[object Proxy]";
      };
    }, function(t, o, e) {
      var r = e(48);
      t.exports = function(i, a, c) {
        a == "__proto__" && r ? r(i, a, { configurable: !0, enumerable: !0, value: c, writable: !0 }) : i[a] = c;
      };
    }, function(t, o) {
      t.exports = function(e) {
        return e.webpackPolyfill || (e.deprecate = function() {
        }, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", { enumerable: !0, get: function() {
          return e.l;
        } }), Object.defineProperty(e, "id", { enumerable: !0, get: function() {
          return e.i;
        } }), e.webpackPolyfill = 1), e;
      };
    }, function(t, o, e) {
      var r = e(35), i = e(39);
      t.exports = function(a) {
        return a != null && i(a.length) && !r(a);
      };
    }, function(t, o) {
      t.exports = function(e) {
        return typeof e == "number" && e > -1 && e % 1 == 0 && e <= 9007199254740991;
      };
    }, function(t, o) {
      function e(r, i) {
        return t.exports = e = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(a, c) {
          return a.__proto__ = c, a;
        }, t.exports.__esModule = !0, t.exports.default = t.exports, e(r, i);
      }
      t.exports = e, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(22), i = e(20);
      t.exports = function(a) {
        return typeof a == "symbol" || i(a) && r(a) == "[object Symbol]";
      };
    }, function(t, o, e) {
      var r = e(41);
      t.exports = function(i) {
        if (typeof i == "string" || r(i)) return i;
        var a = i + "";
        return a == "0" && 1 / i == -1 / 0 ? "-0" : a;
      };
    }, function(t, o, e) {
      var r = e(34)(e(19), "Map");
      t.exports = r;
    }, function(t, o, e) {
      (function(r) {
        var i = typeof r == "object" && r && r.Object === Object && r;
        t.exports = i;
      }).call(this, e(45));
    }, function(t, o) {
      var e;
      e = /* @__PURE__ */ function() {
        return this;
      }();
      try {
        e = e || new Function("return this")();
      } catch {
        typeof window == "object" && (e = window);
      }
      t.exports = e;
    }, function(t, o, e) {
      var r = e(93), i = e(100), a = e(102), c = e(103), p = e(104);
      function g(T) {
        var P = -1, z = T == null ? 0 : T.length;
        for (this.clear(); ++P < z; ) {
          var I = T[P];
          this.set(I[0], I[1]);
        }
      }
      g.prototype.clear = r, g.prototype.delete = i, g.prototype.get = a, g.prototype.has = c, g.prototype.set = p, t.exports = g;
    }, function(t, o, e) {
      var r = e(36), i = e(26);
      t.exports = function(a, c, p) {
        (p !== void 0 && !i(a[c], p) || p === void 0 && !(c in a)) && r(a, c, p);
      };
    }, function(t, o, e) {
      var r = e(34), i = function() {
        try {
          var a = r(Object, "defineProperty");
          return a({}, "", {}), a;
        } catch {
        }
      }();
      t.exports = i;
    }, function(t, o, e) {
      var r = e(115)(Object.getPrototypeOf, Object);
      t.exports = r;
    }, function(t, o) {
      var e = Object.prototype;
      t.exports = function(r) {
        var i = r && r.constructor;
        return r === (typeof i == "function" && i.prototype || e);
      };
    }, function(t, o, e) {
      (function(r) {
        var i = e(19), a = e(118), c = o && !o.nodeType && o, p = c && typeof r == "object" && r && !r.nodeType && r, g = p && p.exports === c ? i.Buffer : void 0, T = (g ? g.isBuffer : void 0) || a;
        r.exports = T;
      }).call(this, e(37)(t));
    }, function(t, o, e) {
      var r = e(120), i = e(121), a = e(122), c = a && a.isTypedArray, p = c ? i(c) : r;
      t.exports = p;
    }, function(t, o) {
      t.exports = function(e, r) {
        if ((r !== "constructor" || typeof e[r] != "function") && r != "__proto__") return e[r];
      };
    }, function(t, o, e) {
      var r = e(36), i = e(26), a = Object.prototype.hasOwnProperty;
      t.exports = function(c, p, g) {
        var T = c[p];
        a.call(c, p) && i(T, g) && (g !== void 0 || p in c) || r(c, p, g);
      };
    }, function(t, o, e) {
      var r = e(125), i = e(127), a = e(38);
      t.exports = function(c) {
        return a(c) ? r(c, !0) : i(c);
      };
    }, function(t, o) {
      t.exports = function(e) {
        return e;
      };
    }, function(t, o, e) {
      var r = e(131), i = Math.max;
      t.exports = function(a, c, p) {
        return c = i(c === void 0 ? a.length - 1 : c, 0), function() {
          for (var g = arguments, T = -1, P = i(g.length - c, 0), z = Array(P); ++T < P; ) z[T] = g[c + T];
          T = -1;
          for (var I = Array(c + 1); ++T < c; ) I[T] = g[T];
          return I[c] = p(z), r(a, this, I);
        };
      };
    }, function(t, o, e) {
      var r = e(132), i = e(134)(r);
      t.exports = i;
    }, function(t, o, e) {
      var r = e(60);
      t.exports = function(i, a) {
        if (i) {
          if (typeof i == "string") return r(i, a);
          var c = Object.prototype.toString.call(i).slice(8, -1);
          return c === "Object" && i.constructor && (c = i.constructor.name), c === "Map" || c === "Set" ? Array.from(i) : c === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c) ? r(i, a) : void 0;
        }
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o) {
      t.exports = function(e, r) {
        (r == null || r > e.length) && (r = e.length);
        for (var i = 0, a = new Array(r); i < r; i++) a[i] = e[i];
        return a;
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(13).default, i = e(140);
      t.exports = function(a) {
        var c = i(a, "string");
        return r(c) === "symbol" ? c : String(c);
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(137), i = e(138), a = e(59), c = e(139);
      t.exports = function(p, g) {
        return r(p) || i(p, g) || a(p, g) || c();
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(146), i = e(160)(function(a, c) {
        return a == null ? {} : r(a, c);
      });
      t.exports = i;
    }, function(t, o, e) {
      var r = e(2), i = e(40), a = e(165), c = e(166);
      function p(g) {
        var T = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
        return t.exports = p = function(P) {
          if (P === null || !a(P)) return P;
          if (typeof P != "function") throw new TypeError("Super expression must either be null or a function");
          if (T !== void 0) {
            if (T.has(P)) return T.get(P);
            T.set(P, z);
          }
          function z() {
            return c(P, arguments, r(this).constructor);
          }
          return z.prototype = Object.create(P.prototype, { constructor: { value: z, enumerable: !1, writable: !0, configurable: !0 } }), i(z, P);
        }, t.exports.__esModule = !0, t.exports.default = t.exports, p(g);
      }
      t.exports = p, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(21), i = { createContour2D: function() {
        return { dir: null, index: null, firstVertex: null, insideContours: null, nextpeer: null, prevpeer: null };
      }, CONTOUR_DIR: { CW_DIR: 0, CCW_DIR: 1, UNKNOWN_DIR: 2 }, DIR: { OUTSIDE_EDGE: -32767, INSIDE_EDGE: -32766 }, create: function(a, c) {
        var p = a.data, g = c.data, T = a.size.x, P = a.size.y, z = r.a.create(a, c);
        return { rasterize: function(I) {
          var q, ie, te, ae, G, U, k, O, D, B, j, $, L = [], X = 0;
          for ($ = 0; $ < 400; $++) L[$] = 0;
          for (L[0] = p[0], D = null, U = 1; U < P - 1; U++) for (ae = 0, ie = L[0], G = 1; G < T - 1; G++) if (g[j = U * T + G] === 0) if ((q = p[j]) !== ie) {
            if (ae === 0) L[te = X + 1] = q, ie = q, (k = z.contourTracing(U, G, te, q, i.DIR.OUTSIDE_EDGE)) !== null && (X++, ae = te, (O = i.createContour2D()).dir = i.CONTOUR_DIR.CW_DIR, O.index = ae, O.firstVertex = k, O.nextpeer = D, O.insideContours = null, D !== null && (D.prevpeer = O), D = O);
            else if ((k = z.contourTracing(U, G, i.DIR.INSIDE_EDGE, q, ae)) !== null) {
              for ((O = i.createContour2D()).firstVertex = k, O.insideContours = null, O.dir = I === 0 ? i.CONTOUR_DIR.CCW_DIR : i.CONTOUR_DIR.CW_DIR, O.index = I, B = D; B !== null && B.index !== ae; ) B = B.nextpeer;
              B !== null && (O.nextpeer = B.insideContours, B.insideContours !== null && (B.insideContours.prevpeer = O), B.insideContours = O);
            }
          } else g[j] = ae;
          else g[j] === i.DIR.OUTSIDE_EDGE || g[j] === i.DIR.INSIDE_EDGE ? (ae = 0, ie = g[j] === i.DIR.INSIDE_EDGE ? p[j] : L[0]) : ie = L[ae = g[j]];
          for (B = D; B !== null; ) B.index = I, B = B.nextpeer;
          return { cc: D, count: X };
        }, debug: { drawContour: function(I, q) {
          var ie, te, ae, G = I.getContext("2d"), U = q;
          for (G.strokeStyle = "red", G.fillStyle = "red", G.lineWidth = 1, ie = U !== null ? U.insideContours : null; U !== null; ) {
            switch (ie !== null ? (te = ie, ie = ie.nextpeer) : (te = U, ie = (U = U.nextpeer) !== null ? U.insideContours : null), te.dir) {
              case i.CONTOUR_DIR.CW_DIR:
                G.strokeStyle = "red";
                break;
              case i.CONTOUR_DIR.CCW_DIR:
                G.strokeStyle = "blue";
                break;
              case i.CONTOUR_DIR.UNKNOWN_DIR:
                G.strokeStyle = "green";
            }
            ae = te.firstVertex, G.beginPath(), G.moveTo(ae.x, ae.y);
            do
              ae = ae.next, G.lineTo(ae.x, ae.y);
            while (ae !== te.firstVertex);
            G.stroke();
          }
        } } };
      } };
      o.a = i;
    }, function(t, o, e) {
      /* @preserve ASM BEGIN */
      /* @preserve ASM END */
      o.a = function(r, i, a) {
        var c = new r.Uint8Array(a), p = i.size | 0, g = r.Math.imul;
        function T(U, k) {
          U |= 0, k |= 0;
          var O = 0, D = 0, B = 0, j = 0, $ = 0, L = 0, X = 0, M = 0;
          for (O = 1; (O | 0) < (p - 1 | 0); O = O + 1 | 0)
            for (M = M + p | 0, D = 1; (D | 0) < (p - 1 | 0); D = D + 1 | 0)
              j = M - p | 0, $ = M + p | 0, L = D - 1 | 0, X = D + 1 | 0, B = (c[U + j + L | 0] | 0) + (c[U + j + X | 0] | 0) + (c[U + M + D | 0] | 0) + (c[U + $ + L | 0] | 0) + (c[U + $ + X | 0] | 0) | 0, (B | 0) == 5 ? c[k + M + D | 0] = 1 : c[k + M + D | 0] = 0;
        }
        function P(U, k, O) {
          U |= 0, k |= 0, O |= 0;
          var D = 0;
          for (D = g(p, p) | 0; (D | 0) > 0; )
            D = D - 1 | 0, c[O + D | 0] = (c[U + D | 0] | 0) - (c[k + D | 0] | 0) | 0;
        }
        function z(U, k, O) {
          U |= 0, k |= 0, O |= 0;
          var D = 0;
          for (D = g(p, p) | 0; (D | 0) > 0; )
            D = D - 1 | 0, c[O + D | 0] = c[U + D | 0] | 0 | (c[k + D | 0] | 0) | 0;
        }
        function I(U) {
          U |= 0;
          var k = 0, O = 0;
          for (O = g(p, p) | 0; (O | 0) > 0; )
            O = O - 1 | 0, k = (k | 0) + (c[U + O | 0] | 0) | 0;
          return k | 0;
        }
        function q(U, k) {
          U |= 0, k |= 0;
          var O = 0;
          for (O = g(p, p) | 0; (O | 0) > 0; )
            O = O - 1 | 0, c[U + O | 0] = k;
        }
        function ie(U, k) {
          U |= 0, k |= 0;
          var O = 0, D = 0, B = 0, j = 0, $ = 0, L = 0, X = 0, M = 0;
          for (O = 1; (O | 0) < (p - 1 | 0); O = O + 1 | 0)
            for (M = M + p | 0, D = 1; (D | 0) < (p - 1 | 0); D = D + 1 | 0)
              j = M - p | 0, $ = M + p | 0, L = D - 1 | 0, X = D + 1 | 0, B = (c[U + j + L | 0] | 0) + (c[U + j + X | 0] | 0) + (c[U + M + D | 0] | 0) + (c[U + $ + L | 0] | 0) + (c[U + $ + X | 0] | 0) | 0, (B | 0) > 0 ? c[k + M + D | 0] = 1 : c[k + M + D | 0] = 0;
        }
        function te(U, k) {
          U |= 0, k |= 0;
          var O = 0;
          for (O = g(p, p) | 0; (O | 0) > 0; )
            O = O - 1 | 0, c[k + O | 0] = c[U + O | 0] | 0;
        }
        function ae(U) {
          U |= 0;
          var k = 0, O = 0;
          for (k = 0; (k | 0) < (p - 1 | 0); k = k + 1 | 0)
            c[U + k | 0] = 0, c[U + O | 0] = 0, O = O + p - 1 | 0, c[U + O | 0] = 0, O = O + 1 | 0;
          for (k = 0; (k | 0) < (p | 0); k = k + 1 | 0)
            c[U + O | 0] = 0, O = O + 1 | 0;
        }
        function G() {
          var U = 0, k = 0, O = 0, D = 0, B = 0, j = 0;
          k = g(p, p) | 0, O = k + k | 0, D = O + k | 0, q(D, 0), ae(U);
          do
            T(U, k), ie(k, O), P(U, O, O), z(D, O, D), te(k, U), B = I(U) | 0, j = (B | 0) == 0 | 0;
          while (!j);
        }
        return { skeletonize: G };
      };
    }, , , , , , , function(t, o, e) {
      t.exports = e(168);
    }, function(t, o, e) {
      var r = e(75), i = e(47), a = e(105), c = e(107), p = e(15), g = e(55), T = e(53);
      t.exports = function P(z, I, q, ie, te) {
        z !== I && a(I, function(ae, G) {
          if (te || (te = new r()), p(ae)) c(z, I, G, q, P, ie, te);
          else {
            var U = ie ? ie(T(z, G), ae, G + "", z, I, te) : void 0;
            U === void 0 && (U = ae), i(z, G, U);
          }
        }, g);
      };
    }, function(t, o, e) {
      var r = e(24), i = e(81), a = e(82), c = e(83), p = e(84), g = e(85);
      function T(P) {
        var z = this.__data__ = new r(P);
        this.size = z.size;
      }
      T.prototype.clear = i, T.prototype.delete = a, T.prototype.get = c, T.prototype.has = p, T.prototype.set = g, t.exports = T;
    }, function(t, o) {
      t.exports = function() {
        this.__data__ = [], this.size = 0;
      };
    }, function(t, o, e) {
      var r = e(25), i = Array.prototype.splice;
      t.exports = function(a) {
        var c = this.__data__, p = r(c, a);
        return !(p < 0) && (p == c.length - 1 ? c.pop() : i.call(c, p, 1), --this.size, !0);
      };
    }, function(t, o, e) {
      var r = e(25);
      t.exports = function(i) {
        var a = this.__data__, c = r(a, i);
        return c < 0 ? void 0 : a[c][1];
      };
    }, function(t, o, e) {
      var r = e(25);
      t.exports = function(i) {
        return r(this.__data__, i) > -1;
      };
    }, function(t, o, e) {
      var r = e(25);
      t.exports = function(i, a) {
        var c = this.__data__, p = r(c, i);
        return p < 0 ? (++this.size, c.push([i, a])) : c[p][1] = a, this;
      };
    }, function(t, o, e) {
      var r = e(24);
      t.exports = function() {
        this.__data__ = new r(), this.size = 0;
      };
    }, function(t, o) {
      t.exports = function(e) {
        var r = this.__data__, i = r.delete(e);
        return this.size = r.size, i;
      };
    }, function(t, o) {
      t.exports = function(e) {
        return this.__data__.get(e);
      };
    }, function(t, o) {
      t.exports = function(e) {
        return this.__data__.has(e);
      };
    }, function(t, o, e) {
      var r = e(24), i = e(43), a = e(46);
      t.exports = function(c, p) {
        var g = this.__data__;
        if (g instanceof r) {
          var T = g.__data__;
          if (!i || T.length < 199) return T.push([c, p]), this.size = ++g.size, this;
          g = this.__data__ = new a(T);
        }
        return g.set(c, p), this.size = g.size, this;
      };
    }, function(t, o, e) {
      var r = e(35), i = e(89), a = e(15), c = e(91), p = /^\[object .+?Constructor\]$/, g = Function.prototype, T = Object.prototype, P = g.toString, z = T.hasOwnProperty, I = RegExp("^" + P.call(z).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
      t.exports = function(q) {
        return !(!a(q) || i(q)) && (r(q) ? I : p).test(c(q));
      };
    }, function(t, o, e) {
      var r = e(27), i = Object.prototype, a = i.hasOwnProperty, c = i.toString, p = r ? r.toStringTag : void 0;
      t.exports = function(g) {
        var T = a.call(g, p), P = g[p];
        try {
          g[p] = void 0;
          var z = !0;
        } catch {
        }
        var I = c.call(g);
        return z && (T ? g[p] = P : delete g[p]), I;
      };
    }, function(t, o) {
      var e = Object.prototype.toString;
      t.exports = function(r) {
        return e.call(r);
      };
    }, function(t, o, e) {
      var r, i = e(90), a = (r = /[^.]+$/.exec(i && i.keys && i.keys.IE_PROTO || "")) ? "Symbol(src)_1." + r : "";
      t.exports = function(c) {
        return !!a && a in c;
      };
    }, function(t, o, e) {
      var r = e(19)["__core-js_shared__"];
      t.exports = r;
    }, function(t, o) {
      var e = Function.prototype.toString;
      t.exports = function(r) {
        if (r != null) {
          try {
            return e.call(r);
          } catch {
          }
          try {
            return r + "";
          } catch {
          }
        }
        return "";
      };
    }, function(t, o) {
      t.exports = function(e, r) {
        return e == null ? void 0 : e[r];
      };
    }, function(t, o, e) {
      var r = e(94), i = e(24), a = e(43);
      t.exports = function() {
        this.size = 0, this.__data__ = { hash: new r(), map: new (a || i)(), string: new r() };
      };
    }, function(t, o, e) {
      var r = e(95), i = e(96), a = e(97), c = e(98), p = e(99);
      function g(T) {
        var P = -1, z = T == null ? 0 : T.length;
        for (this.clear(); ++P < z; ) {
          var I = T[P];
          this.set(I[0], I[1]);
        }
      }
      g.prototype.clear = r, g.prototype.delete = i, g.prototype.get = a, g.prototype.has = c, g.prototype.set = p, t.exports = g;
    }, function(t, o, e) {
      var r = e(28);
      t.exports = function() {
        this.__data__ = r ? r(null) : {}, this.size = 0;
      };
    }, function(t, o) {
      t.exports = function(e) {
        var r = this.has(e) && delete this.__data__[e];
        return this.size -= r ? 1 : 0, r;
      };
    }, function(t, o, e) {
      var r = e(28), i = Object.prototype.hasOwnProperty;
      t.exports = function(a) {
        var c = this.__data__;
        if (r) {
          var p = c[a];
          return p === "__lodash_hash_undefined__" ? void 0 : p;
        }
        return i.call(c, a) ? c[a] : void 0;
      };
    }, function(t, o, e) {
      var r = e(28), i = Object.prototype.hasOwnProperty;
      t.exports = function(a) {
        var c = this.__data__;
        return r ? c[a] !== void 0 : i.call(c, a);
      };
    }, function(t, o, e) {
      var r = e(28);
      t.exports = function(i, a) {
        var c = this.__data__;
        return this.size += this.has(i) ? 0 : 1, c[i] = r && a === void 0 ? "__lodash_hash_undefined__" : a, this;
      };
    }, function(t, o, e) {
      var r = e(29);
      t.exports = function(i) {
        var a = r(this, i).delete(i);
        return this.size -= a ? 1 : 0, a;
      };
    }, function(t, o) {
      t.exports = function(e) {
        var r = typeof e;
        return r == "string" || r == "number" || r == "symbol" || r == "boolean" ? e !== "__proto__" : e === null;
      };
    }, function(t, o, e) {
      var r = e(29);
      t.exports = function(i) {
        return r(this, i).get(i);
      };
    }, function(t, o, e) {
      var r = e(29);
      t.exports = function(i) {
        return r(this, i).has(i);
      };
    }, function(t, o, e) {
      var r = e(29);
      t.exports = function(i, a) {
        var c = r(this, i), p = c.size;
        return c.set(i, a), this.size += c.size == p ? 0 : 1, this;
      };
    }, function(t, o, e) {
      var r = e(106)();
      t.exports = r;
    }, function(t, o) {
      t.exports = function(e) {
        return function(r, i, a) {
          for (var c = -1, p = Object(r), g = a(r), T = g.length; T--; ) {
            var P = g[e ? T : ++c];
            if (i(p[P], P, p) === !1) break;
          }
          return r;
        };
      };
    }, function(t, o, e) {
      var r = e(47), i = e(108), a = e(109), c = e(112), p = e(113), g = e(30), T = e(16), P = e(117), z = e(51), I = e(35), q = e(15), ie = e(119), te = e(52), ae = e(53), G = e(123);
      t.exports = function(U, k, O, D, B, j, $) {
        var L = ae(U, O), X = ae(k, O), M = $.get(X);
        if (M) r(U, O, M);
        else {
          var J = j ? j(L, X, O + "", U, k, $) : void 0, Z = J === void 0;
          if (Z) {
            var ee = T(X), K = !ee && z(X), se = !ee && !K && te(X);
            J = X, ee || K || se ? T(L) ? J = L : P(L) ? J = c(L) : K ? (Z = !1, J = i(X, !0)) : se ? (Z = !1, J = a(X, !0)) : J = [] : ie(X) || g(X) ? (J = L, g(L) ? J = G(L) : q(L) && !I(L) || (J = p(X))) : Z = !1;
          }
          Z && ($.set(X, J), B(J, X, D, j, $), $.delete(X)), r(U, O, J);
        }
      };
    }, function(t, o, e) {
      (function(r) {
        var i = e(19), a = o && !o.nodeType && o, c = a && typeof r == "object" && r && !r.nodeType && r, p = c && c.exports === a ? i.Buffer : void 0, g = p ? p.allocUnsafe : void 0;
        r.exports = function(T, P) {
          if (P) return T.slice();
          var z = T.length, I = g ? g(z) : new T.constructor(z);
          return T.copy(I), I;
        };
      }).call(this, e(37)(t));
    }, function(t, o, e) {
      var r = e(110);
      t.exports = function(i, a) {
        var c = a ? r(i.buffer) : i.buffer;
        return new i.constructor(c, i.byteOffset, i.length);
      };
    }, function(t, o, e) {
      var r = e(111);
      t.exports = function(i) {
        var a = new i.constructor(i.byteLength);
        return new r(a).set(new r(i)), a;
      };
    }, function(t, o, e) {
      var r = e(19).Uint8Array;
      t.exports = r;
    }, function(t, o) {
      t.exports = function(e, r) {
        var i = -1, a = e.length;
        for (r || (r = Array(a)); ++i < a; ) r[i] = e[i];
        return r;
      };
    }, function(t, o, e) {
      var r = e(114), i = e(49), a = e(50);
      t.exports = function(c) {
        return typeof c.constructor != "function" || a(c) ? {} : r(i(c));
      };
    }, function(t, o, e) {
      var r = e(15), i = Object.create, a = /* @__PURE__ */ function() {
        function c() {
        }
        return function(p) {
          if (!r(p)) return {};
          if (i) return i(p);
          c.prototype = p;
          var g = new c();
          return c.prototype = void 0, g;
        };
      }();
      t.exports = a;
    }, function(t, o) {
      t.exports = function(e, r) {
        return function(i) {
          return e(r(i));
        };
      };
    }, function(t, o, e) {
      var r = e(22), i = e(20);
      t.exports = function(a) {
        return i(a) && r(a) == "[object Arguments]";
      };
    }, function(t, o, e) {
      var r = e(38), i = e(20);
      t.exports = function(a) {
        return i(a) && r(a);
      };
    }, function(t, o) {
      t.exports = function() {
        return !1;
      };
    }, function(t, o, e) {
      var r = e(22), i = e(49), a = e(20), c = Function.prototype, p = Object.prototype, g = c.toString, T = p.hasOwnProperty, P = g.call(Object);
      t.exports = function(z) {
        if (!a(z) || r(z) != "[object Object]") return !1;
        var I = i(z);
        if (I === null) return !0;
        var q = T.call(I, "constructor") && I.constructor;
        return typeof q == "function" && q instanceof q && g.call(q) == P;
      };
    }, function(t, o, e) {
      var r = e(22), i = e(39), a = e(20), c = {};
      c["[object Float32Array]"] = c["[object Float64Array]"] = c["[object Int8Array]"] = c["[object Int16Array]"] = c["[object Int32Array]"] = c["[object Uint8Array]"] = c["[object Uint8ClampedArray]"] = c["[object Uint16Array]"] = c["[object Uint32Array]"] = !0, c["[object Arguments]"] = c["[object Array]"] = c["[object ArrayBuffer]"] = c["[object Boolean]"] = c["[object DataView]"] = c["[object Date]"] = c["[object Error]"] = c["[object Function]"] = c["[object Map]"] = c["[object Number]"] = c["[object Object]"] = c["[object RegExp]"] = c["[object Set]"] = c["[object String]"] = c["[object WeakMap]"] = !1, t.exports = function(p) {
        return a(p) && i(p.length) && !!c[r(p)];
      };
    }, function(t, o) {
      t.exports = function(e) {
        return function(r) {
          return e(r);
        };
      };
    }, function(t, o, e) {
      (function(r) {
        var i = e(44), a = o && !o.nodeType && o, c = a && typeof r == "object" && r && !r.nodeType && r, p = c && c.exports === a && i.process, g = function() {
          try {
            var T = c && c.require && c.require("util").types;
            return T || p && p.binding && p.binding("util");
          } catch {
          }
        }();
        r.exports = g;
      }).call(this, e(37)(t));
    }, function(t, o, e) {
      var r = e(124), i = e(55);
      t.exports = function(a) {
        return r(a, i(a));
      };
    }, function(t, o, e) {
      var r = e(54), i = e(36);
      t.exports = function(a, c, p, g) {
        var T = !p;
        p || (p = {});
        for (var P = -1, z = c.length; ++P < z; ) {
          var I = c[P], q = g ? g(p[I], a[I], I, p, a) : void 0;
          q === void 0 && (q = a[I]), T ? i(p, I, q) : r(p, I, q);
        }
        return p;
      };
    }, function(t, o, e) {
      var r = e(126), i = e(30), a = e(16), c = e(51), p = e(31), g = e(52), T = Object.prototype.hasOwnProperty;
      t.exports = function(P, z) {
        var I = a(P), q = !I && i(P), ie = !I && !q && c(P), te = !I && !q && !ie && g(P), ae = I || q || ie || te, G = ae ? r(P.length, String) : [], U = G.length;
        for (var k in P) !z && !T.call(P, k) || ae && (k == "length" || ie && (k == "offset" || k == "parent") || te && (k == "buffer" || k == "byteLength" || k == "byteOffset") || p(k, U)) || G.push(k);
        return G;
      };
    }, function(t, o) {
      t.exports = function(e, r) {
        for (var i = -1, a = Array(e); ++i < e; ) a[i] = r(i);
        return a;
      };
    }, function(t, o, e) {
      var r = e(15), i = e(50), a = e(128), c = Object.prototype.hasOwnProperty;
      t.exports = function(p) {
        if (!r(p)) return a(p);
        var g = i(p), T = [];
        for (var P in p) (P != "constructor" || !g && c.call(p, P)) && T.push(P);
        return T;
      };
    }, function(t, o) {
      t.exports = function(e) {
        var r = [];
        if (e != null) for (var i in Object(e)) r.push(i);
        return r;
      };
    }, function(t, o, e) {
      var r = e(130), i = e(135);
      t.exports = function(a) {
        return r(function(c, p) {
          var g = -1, T = p.length, P = T > 1 ? p[T - 1] : void 0, z = T > 2 ? p[2] : void 0;
          for (P = a.length > 3 && typeof P == "function" ? (T--, P) : void 0, z && i(p[0], p[1], z) && (P = T < 3 ? void 0 : P, T = 1), c = Object(c); ++g < T; ) {
            var I = p[g];
            I && a(c, I, g, P);
          }
          return c;
        });
      };
    }, function(t, o, e) {
      var r = e(56), i = e(57), a = e(58);
      t.exports = function(c, p) {
        return a(i(c, p, r), c + "");
      };
    }, function(t, o) {
      t.exports = function(e, r, i) {
        switch (i.length) {
          case 0:
            return e.call(r);
          case 1:
            return e.call(r, i[0]);
          case 2:
            return e.call(r, i[0], i[1]);
          case 3:
            return e.call(r, i[0], i[1], i[2]);
        }
        return e.apply(r, i);
      };
    }, function(t, o, e) {
      var r = e(133), i = e(48), a = e(56), c = i ? function(p, g) {
        return i(p, "toString", { configurable: !0, enumerable: !1, value: r(g), writable: !0 });
      } : a;
      t.exports = c;
    }, function(t, o) {
      t.exports = function(e) {
        return function() {
          return e;
        };
      };
    }, function(t, o) {
      var e = Date.now;
      t.exports = function(r) {
        var i = 0, a = 0;
        return function() {
          var c = e(), p = 16 - (c - a);
          if (a = c, p > 0) {
            if (++i >= 800) return arguments[0];
          } else i = 0;
          return r.apply(void 0, arguments);
        };
      };
    }, function(t, o, e) {
      var r = e(26), i = e(38), a = e(31), c = e(15);
      t.exports = function(p, g, T) {
        if (!c(T)) return !1;
        var P = typeof g;
        return !!(P == "number" ? i(T) && a(g, T.length) : P == "string" && g in T) && r(T[g], p);
      };
    }, function(t, o) {
      typeof window < "u" && (window.requestAnimationFrame || (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) {
        window.setTimeout(e, 1e3 / 60);
      })), typeof Math.imul != "function" && (Math.imul = function(e, r) {
        var i = 65535 & e, a = 65535 & r;
        return i * a + ((e >>> 16 & 65535) * a + i * (r >>> 16 & 65535) << 16 >>> 0) | 0;
      }), typeof Object.assign != "function" && (Object.assign = function(e) {
        if (e === null) throw new TypeError("Cannot convert undefined or null to object");
        for (var r = Object(e), i = 1; i < arguments.length; i++) {
          var a = arguments[i];
          if (a !== null) for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && (r[c] = a[c]);
        }
        return r;
      });
    }, function(t, o) {
      t.exports = function(e) {
        if (Array.isArray(e)) return e;
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o) {
      t.exports = function(e, r) {
        var i = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
        if (i != null) {
          var a, c, p, g, T = [], P = !0, z = !1;
          try {
            if (p = (i = i.call(e)).next, r === 0) {
              if (Object(i) !== i) return;
              P = !1;
            } else for (; !(P = (a = p.call(i)).done) && (T.push(a.value), T.length !== r); P = !0) ;
          } catch (I) {
            z = !0, c = I;
          } finally {
            try {
              if (!P && i.return != null && (g = i.return(), Object(g) !== g)) return;
            } finally {
              if (z) throw c;
            }
          }
          return T;
        }
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o) {
      t.exports = function() {
        throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(13).default;
      t.exports = function(i, a) {
        if (r(i) !== "object" || i === null) return i;
        var c = i[Symbol.toPrimitive];
        if (c !== void 0) {
          var p = c.call(i, a || "default");
          if (r(p) !== "object") return p;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return (a === "string" ? String : Number)(i);
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(13).default;
      function i() {
        /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
        t.exports = i = function() {
          return c;
        }, t.exports.__esModule = !0, t.exports.default = t.exports;
        var a, c = {}, p = Object.prototype, g = p.hasOwnProperty, T = Object.defineProperty || function(w, N, V) {
          w[N] = V.value;
        }, P = typeof Symbol == "function" ? Symbol : {}, z = P.iterator || "@@iterator", I = P.asyncIterator || "@@asyncIterator", q = P.toStringTag || "@@toStringTag";
        function ie(w, N, V) {
          return Object.defineProperty(w, N, { value: V, enumerable: !0, configurable: !0, writable: !0 }), w[N];
        }
        try {
          ie({}, "");
        } catch {
          ie = function(N, V, fe) {
            return N[V] = fe;
          };
        }
        function te(w, N, V, fe) {
          var ce = N && N.prototype instanceof D ? N : D, ve = Object.create(ce.prototype), ye = new ne(fe || []);
          return T(ve, "_invoke", { value: ee(w, V, ye) }), ve;
        }
        function ae(w, N, V) {
          try {
            return { type: "normal", arg: w.call(N, V) };
          } catch (fe) {
            return { type: "throw", arg: fe };
          }
        }
        c.wrap = te;
        var G = "suspendedStart", U = "executing", k = "completed", O = {};
        function D() {
        }
        function B() {
        }
        function j() {
        }
        var $ = {};
        ie($, z, function() {
          return this;
        });
        var L = Object.getPrototypeOf, X = L && L(L(de([])));
        X && X !== p && g.call(X, z) && ($ = X);
        var M = j.prototype = D.prototype = Object.create($);
        function J(w) {
          ["next", "throw", "return"].forEach(function(N) {
            ie(w, N, function(V) {
              return this._invoke(N, V);
            });
          });
        }
        function Z(w, N) {
          function V(ce, ve, ye, xe) {
            var be = ae(w[ce], w, ve);
            if (be.type !== "throw") {
              var Se = be.arg, Ee = Se.value;
              return Ee && r(Ee) == "object" && g.call(Ee, "__await") ? N.resolve(Ee.__await).then(function(Oe) {
                V("next", Oe, ye, xe);
              }, function(Oe) {
                V("throw", Oe, ye, xe);
              }) : N.resolve(Ee).then(function(Oe) {
                Se.value = Oe, ye(Se);
              }, function(Oe) {
                return V("throw", Oe, ye, xe);
              });
            }
            xe(be.arg);
          }
          var fe;
          T(this, "_invoke", { value: function(ce, ve) {
            function ye() {
              return new N(function(xe, be) {
                V(ce, ve, xe, be);
              });
            }
            return fe = fe ? fe.then(ye, ye) : ye();
          } });
        }
        function ee(w, N, V) {
          var fe = G;
          return function(ce, ve) {
            if (fe === U) throw new Error("Generator is already running");
            if (fe === k) {
              if (ce === "throw") throw ve;
              return { value: a, done: !0 };
            }
            for (V.method = ce, V.arg = ve; ; ) {
              var ye = V.delegate;
              if (ye) {
                var xe = K(ye, V);
                if (xe) {
                  if (xe === O) continue;
                  return xe;
                }
              }
              if (V.method === "next") V.sent = V._sent = V.arg;
              else if (V.method === "throw") {
                if (fe === G) throw fe = k, V.arg;
                V.dispatchException(V.arg);
              } else V.method === "return" && V.abrupt("return", V.arg);
              fe = U;
              var be = ae(w, N, V);
              if (be.type === "normal") {
                if (fe = V.done ? k : "suspendedYield", be.arg === O) continue;
                return { value: be.arg, done: V.done };
              }
              be.type === "throw" && (fe = k, V.method = "throw", V.arg = be.arg);
            }
          };
        }
        function K(w, N) {
          var V = N.method, fe = w.iterator[V];
          if (fe === a) return N.delegate = null, V === "throw" && w.iterator.return && (N.method = "return", N.arg = a, K(w, N), N.method === "throw") || V !== "return" && (N.method = "throw", N.arg = new TypeError("The iterator does not provide a '" + V + "' method")), O;
          var ce = ae(fe, w.iterator, N.arg);
          if (ce.type === "throw") return N.method = "throw", N.arg = ce.arg, N.delegate = null, O;
          var ve = ce.arg;
          return ve ? ve.done ? (N[w.resultName] = ve.value, N.next = w.nextLoc, N.method !== "return" && (N.method = "next", N.arg = a), N.delegate = null, O) : ve : (N.method = "throw", N.arg = new TypeError("iterator result is not an object"), N.delegate = null, O);
        }
        function se(w) {
          var N = { tryLoc: w[0] };
          1 in w && (N.catchLoc = w[1]), 2 in w && (N.finallyLoc = w[2], N.afterLoc = w[3]), this.tryEntries.push(N);
        }
        function re(w) {
          var N = w.completion || {};
          N.type = "normal", delete N.arg, w.completion = N;
        }
        function ne(w) {
          this.tryEntries = [{ tryLoc: "root" }], w.forEach(se, this), this.reset(!0);
        }
        function de(w) {
          if (w || w === "") {
            var N = w[z];
            if (N) return N.call(w);
            if (typeof w.next == "function") return w;
            if (!isNaN(w.length)) {
              var V = -1, fe = function ce() {
                for (; ++V < w.length; ) if (g.call(w, V)) return ce.value = w[V], ce.done = !1, ce;
                return ce.value = a, ce.done = !0, ce;
              };
              return fe.next = fe;
            }
          }
          throw new TypeError(r(w) + " is not iterable");
        }
        return B.prototype = j, T(M, "constructor", { value: j, configurable: !0 }), T(j, "constructor", { value: B, configurable: !0 }), B.displayName = ie(j, q, "GeneratorFunction"), c.isGeneratorFunction = function(w) {
          var N = typeof w == "function" && w.constructor;
          return !!N && (N === B || (N.displayName || N.name) === "GeneratorFunction");
        }, c.mark = function(w) {
          return Object.setPrototypeOf ? Object.setPrototypeOf(w, j) : (w.__proto__ = j, ie(w, q, "GeneratorFunction")), w.prototype = Object.create(M), w;
        }, c.awrap = function(w) {
          return { __await: w };
        }, J(Z.prototype), ie(Z.prototype, I, function() {
          return this;
        }), c.AsyncIterator = Z, c.async = function(w, N, V, fe, ce) {
          ce === void 0 && (ce = Promise);
          var ve = new Z(te(w, N, V, fe), ce);
          return c.isGeneratorFunction(N) ? ve : ve.next().then(function(ye) {
            return ye.done ? ye.value : ve.next();
          });
        }, J(M), ie(M, q, "Generator"), ie(M, z, function() {
          return this;
        }), ie(M, "toString", function() {
          return "[object Generator]";
        }), c.keys = function(w) {
          var N = Object(w), V = [];
          for (var fe in N) V.push(fe);
          return V.reverse(), function ce() {
            for (; V.length; ) {
              var ve = V.pop();
              if (ve in N) return ce.value = ve, ce.done = !1, ce;
            }
            return ce.done = !0, ce;
          };
        }, c.values = de, ne.prototype = { constructor: ne, reset: function(w) {
          if (this.prev = 0, this.next = 0, this.sent = this._sent = a, this.done = !1, this.delegate = null, this.method = "next", this.arg = a, this.tryEntries.forEach(re), !w) for (var N in this) N.charAt(0) === "t" && g.call(this, N) && !isNaN(+N.slice(1)) && (this[N] = a);
        }, stop: function() {
          this.done = !0;
          var w = this.tryEntries[0].completion;
          if (w.type === "throw") throw w.arg;
          return this.rval;
        }, dispatchException: function(w) {
          if (this.done) throw w;
          var N = this;
          function V(be, Se) {
            return ve.type = "throw", ve.arg = w, N.next = be, Se && (N.method = "next", N.arg = a), !!Se;
          }
          for (var fe = this.tryEntries.length - 1; fe >= 0; --fe) {
            var ce = this.tryEntries[fe], ve = ce.completion;
            if (ce.tryLoc === "root") return V("end");
            if (ce.tryLoc <= this.prev) {
              var ye = g.call(ce, "catchLoc"), xe = g.call(ce, "finallyLoc");
              if (ye && xe) {
                if (this.prev < ce.catchLoc) return V(ce.catchLoc, !0);
                if (this.prev < ce.finallyLoc) return V(ce.finallyLoc);
              } else if (ye) {
                if (this.prev < ce.catchLoc) return V(ce.catchLoc, !0);
              } else {
                if (!xe) throw new Error("try statement without catch or finally");
                if (this.prev < ce.finallyLoc) return V(ce.finallyLoc);
              }
            }
          }
        }, abrupt: function(w, N) {
          for (var V = this.tryEntries.length - 1; V >= 0; --V) {
            var fe = this.tryEntries[V];
            if (fe.tryLoc <= this.prev && g.call(fe, "finallyLoc") && this.prev < fe.finallyLoc) {
              var ce = fe;
              break;
            }
          }
          ce && (w === "break" || w === "continue") && ce.tryLoc <= N && N <= ce.finallyLoc && (ce = null);
          var ve = ce ? ce.completion : {};
          return ve.type = w, ve.arg = N, ce ? (this.method = "next", this.next = ce.finallyLoc, O) : this.complete(ve);
        }, complete: function(w, N) {
          if (w.type === "throw") throw w.arg;
          return w.type === "break" || w.type === "continue" ? this.next = w.arg : w.type === "return" ? (this.rval = this.arg = w.arg, this.method = "return", this.next = "end") : w.type === "normal" && N && (this.next = N), O;
        }, finish: function(w) {
          for (var N = this.tryEntries.length - 1; N >= 0; --N) {
            var V = this.tryEntries[N];
            if (V.finallyLoc === w) return this.complete(V.completion, V.afterLoc), re(V), O;
          }
        }, catch: function(w) {
          for (var N = this.tryEntries.length - 1; N >= 0; --N) {
            var V = this.tryEntries[N];
            if (V.tryLoc === w) {
              var fe = V.completion;
              if (fe.type === "throw") {
                var ce = fe.arg;
                re(V);
              }
              return ce;
            }
          }
          throw new Error("illegal catch attempt");
        }, delegateYield: function(w, N, V) {
          return this.delegate = { iterator: de(w), resultName: N, nextLoc: V }, this.method === "next" && (this.arg = a), O;
        } }, c;
      }
      t.exports = i, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(2);
      t.exports = function(i, a) {
        for (; !Object.prototype.hasOwnProperty.call(i, a) && (i = r(i)) !== null; ) ;
        return i;
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(60);
      t.exports = function(i) {
        if (Array.isArray(i)) return r(i);
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o) {
      t.exports = function(e) {
        if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o) {
      t.exports = function() {
        throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(147), i = e(157);
      t.exports = function(a, c) {
        return r(a, c, function(p, g) {
          return i(a, g);
        });
      };
    }, function(t, o, e) {
      var r = e(148), i = e(156), a = e(32);
      t.exports = function(c, p, g) {
        for (var T = -1, P = p.length, z = {}; ++T < P; ) {
          var I = p[T], q = r(c, I);
          g(q, I) && i(z, a(I, c), q);
        }
        return z;
      };
    }, function(t, o, e) {
      var r = e(32), i = e(42);
      t.exports = function(a, c) {
        for (var p = 0, g = (c = r(c, a)).length; a != null && p < g; ) a = a[i(c[p++])];
        return p && p == g ? a : void 0;
      };
    }, function(t, o, e) {
      var r = e(16), i = e(41), a = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, c = /^\w*$/;
      t.exports = function(p, g) {
        if (r(p)) return !1;
        var T = typeof p;
        return !(T != "number" && T != "symbol" && T != "boolean" && p != null && !i(p)) || c.test(p) || !a.test(p) || g != null && p in Object(g);
      };
    }, function(t, o, e) {
      var r = e(151), i = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, a = /\\(\\)?/g, c = r(function(p) {
        var g = [];
        return p.charCodeAt(0) === 46 && g.push(""), p.replace(i, function(T, P, z, I) {
          g.push(z ? I.replace(a, "$1") : P || T);
        }), g;
      });
      t.exports = c;
    }, function(t, o, e) {
      var r = e(152);
      t.exports = function(i) {
        var a = r(i, function(p) {
          return c.size === 500 && c.clear(), p;
        }), c = a.cache;
        return a;
      };
    }, function(t, o, e) {
      var r = e(46);
      function i(a, c) {
        if (typeof a != "function" || c != null && typeof c != "function") throw new TypeError("Expected a function");
        var p = function() {
          var g = arguments, T = c ? c.apply(this, g) : g[0], P = p.cache;
          if (P.has(T)) return P.get(T);
          var z = a.apply(this, g);
          return p.cache = P.set(T, z) || P, z;
        };
        return p.cache = new (i.Cache || r)(), p;
      }
      i.Cache = r, t.exports = i;
    }, function(t, o, e) {
      var r = e(154);
      t.exports = function(i) {
        return i == null ? "" : r(i);
      };
    }, function(t, o, e) {
      var r = e(27), i = e(155), a = e(16), c = e(41), p = r ? r.prototype : void 0, g = p ? p.toString : void 0;
      t.exports = function T(P) {
        if (typeof P == "string") return P;
        if (a(P)) return i(P, T) + "";
        if (c(P)) return g ? g.call(P) : "";
        var z = P + "";
        return z == "0" && 1 / P == -1 / 0 ? "-0" : z;
      };
    }, function(t, o) {
      t.exports = function(e, r) {
        for (var i = -1, a = e == null ? 0 : e.length, c = Array(a); ++i < a; ) c[i] = r(e[i], i, e);
        return c;
      };
    }, function(t, o, e) {
      var r = e(54), i = e(32), a = e(31), c = e(15), p = e(42);
      t.exports = function(g, T, P, z) {
        if (!c(g)) return g;
        for (var I = -1, q = (T = i(T, g)).length, ie = q - 1, te = g; te != null && ++I < q; ) {
          var ae = p(T[I]), G = P;
          if (ae === "__proto__" || ae === "constructor" || ae === "prototype") return g;
          if (I != ie) {
            var U = te[ae];
            (G = z ? z(U, ae, te) : void 0) === void 0 && (G = c(U) ? U : a(T[I + 1]) ? [] : {});
          }
          r(te, ae, G), te = te[ae];
        }
        return g;
      };
    }, function(t, o, e) {
      var r = e(158), i = e(159);
      t.exports = function(a, c) {
        return a != null && i(a, c, r);
      };
    }, function(t, o) {
      t.exports = function(e, r) {
        return e != null && r in Object(e);
      };
    }, function(t, o, e) {
      var r = e(32), i = e(30), a = e(16), c = e(31), p = e(39), g = e(42);
      t.exports = function(T, P, z) {
        for (var I = -1, q = (P = r(P, T)).length, ie = !1; ++I < q; ) {
          var te = g(P[I]);
          if (!(ie = T != null && z(T, te))) break;
          T = T[te];
        }
        return ie || ++I != q ? ie : !!(q = T == null ? 0 : T.length) && p(q) && c(te, q) && (a(T) || i(T));
      };
    }, function(t, o, e) {
      var r = e(161), i = e(57), a = e(58);
      t.exports = function(c) {
        return a(i(c, void 0, r), c + "");
      };
    }, function(t, o, e) {
      var r = e(162);
      t.exports = function(i) {
        return i != null && i.length ? r(i, 1) : [];
      };
    }, function(t, o, e) {
      var r = e(163), i = e(164);
      t.exports = function a(c, p, g, T, P) {
        var z = -1, I = c.length;
        for (g || (g = i), P || (P = []); ++z < I; ) {
          var q = c[z];
          p > 0 && g(q) ? p > 1 ? a(q, p - 1, g, T, P) : r(P, q) : T || (P[P.length] = q);
        }
        return P;
      };
    }, function(t, o) {
      t.exports = function(e, r) {
        for (var i = -1, a = r.length, c = e.length; ++i < a; ) e[c + i] = r[i];
        return e;
      };
    }, function(t, o, e) {
      var r = e(27), i = e(30), a = e(16), c = r ? r.isConcatSpreadable : void 0;
      t.exports = function(p) {
        return a(p) || i(p) || !!(c && p && p[c]);
      };
    }, function(t, o) {
      t.exports = function(e) {
        try {
          return Function.toString.call(e).indexOf("[native code]") !== -1;
        } catch {
          return typeof e == "function";
        }
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      var r = e(40), i = e(167);
      function a(c, p, g) {
        return i() ? (t.exports = a = Reflect.construct.bind(), t.exports.__esModule = !0, t.exports.default = t.exports) : (t.exports = a = function(T, P, z) {
          var I = [null];
          I.push.apply(I, P);
          var q = new (Function.bind.apply(T, I))();
          return z && r(q, z.prototype), q;
        }, t.exports.__esModule = !0, t.exports.default = t.exports), a.apply(null, arguments);
      }
      t.exports = a, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o) {
      t.exports = function() {
        if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
        if (typeof Proxy == "function") return !0;
        try {
          return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
          })), !0;
        } catch {
          return !1;
        }
      }, t.exports.__esModule = !0, t.exports.default = t.exports;
    }, function(t, o, e) {
      e.r(o), e.d(o, "BarcodeDecoder", function() {
        return tt;
      }), e.d(o, "Readers", function() {
        return r;
      }), e.d(o, "CameraAccess", function() {
        return He;
      }), e.d(o, "ImageDebug", function() {
        return q.a;
      }), e.d(o, "ImageWrapper", function() {
        return g.a;
      }), e.d(o, "ResultCollector", function() {
        return Dt;
      });
      var r = {};
      e.r(r), e.d(r, "BarcodeReader", function() {
        return ee;
      }), e.d(r, "TwoOfFiveReader", function() {
        return w;
      }), e.d(r, "NewCodabarReader", function() {
        return ve;
      }), e.d(r, "Code128Reader", function() {
        return xe;
      }), e.d(r, "Code32Reader", function() {
        return ct;
      }), e.d(r, "Code39Reader", function() {
        return qe;
      }), e.d(r, "Code39VINReader", function() {
        return Ye;
      }), e.d(r, "Code93Reader", function() {
        return pt;
      }), e.d(r, "EAN2Reader", function() {
        return yt;
      }), e.d(r, "EAN5Reader", function() {
        return xt;
      }), e.d(r, "EAN8Reader", function() {
        return _t;
      }), e.d(r, "EANReader", function() {
        return je;
      }), e.d(r, "I2of5Reader", function() {
        return bt;
      }), e.d(r, "UPCEReader", function() {
        return Rt;
      }), e.d(r, "UPCReader", function() {
        return St;
      });
      var i = e(13), a = e.n(i), c = e(18), p = e.n(c), g = (e(136), e(11)), T = e(12), P = e.n(T), z = e(8), I = e.n(z), q = e(17), ie = e(3), te = e.n(ie), ae = e(4), G = e.n(ae), U = e(1), k = e.n(U), O = e(7), D = e.n(O), B = e(6), j = e.n(B), $ = e(2), L = e.n($), X = e(0), M = e.n(X), J = e(9), Z = function(m) {
        return m[m.Forward = 1] = "Forward", m[m.Reverse = -1] = "Reverse", m;
      }({}), ee = function() {
        function m(R, h) {
          te()(this, m), M()(this, "_row", []), M()(this, "config", {}), M()(this, "supplements", []), M()(this, "SINGLE_CODE_ERROR", 0), M()(this, "FORMAT", "unknown"), M()(this, "CONFIG_KEYS", {}), this._row = [], this.config = R || {}, h && (this.supplements = h);
        }
        return G()(m, [{ key: "_nextUnset", value: function(R) {
          for (var h = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = h; n < R.length; n++) if (!R[n]) return n;
          return R.length;
        } }, { key: "_matchPattern", value: function(R, h) {
          for (var n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : this.SINGLE_CODE_ERROR || 1, s = 0, u = 0, l = 0, x = 0, _ = 0, b = 0, S = 0, E = 0; E < R.length; E++) l += R[E], x += h[E];
          if (l < x) return Number.MAX_VALUE;
          n *= _ = l / x;
          for (var Q = 0; Q < R.length; Q++) {
            if (b = R[Q], S = h[Q] * _, (u = Math.abs(b - S) / S) > n) return Number.MAX_VALUE;
            s += u;
          }
          return s / x;
        } }, { key: "_nextSet", value: function(R) {
          for (var h = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, n = h; n < R.length; n++) if (R[n]) return n;
          return R.length;
        } }, { key: "_correctBars", value: function(R, h, n) {
          for (var s = n.length, u = 0; s--; ) (u = R[n[s]] * (1 - (1 - h) / 2)) > 1 && (R[n[s]] = u);
        } }, { key: "decodePattern", value: function(R) {
          this._row = R;
          var h = this.decode();
          return h === null ? (this._row.reverse(), (h = this.decode()) && (h.direction = Z.Reverse, h.start = this._row.length - h.start, h.end = this._row.length - h.end)) : h.direction = Z.Forward, h && (h.format = this.FORMAT), h;
        } }, { key: "_matchRange", value: function(R, h, n) {
          var s;
          for (s = R = R < 0 ? 0 : R; s < h; s++) if (this._row[s] !== n) return !1;
          return !0;
        } }, { key: "_fillCounters", value: function() {
          var R = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this._nextUnset(this._row), h = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this._row.length, n = !(arguments.length > 2 && arguments[2] !== void 0) || arguments[2], s = [], u = 0;
          s[u] = 0;
          for (var l = R; l < h; l++) this._row[l] ^ (n ? 1 : 0) ? s[u]++ : (s[++u] = 1, n = !n);
          return s;
        } }, { key: "_toCounters", value: function(R, h) {
          var n = h.length, s = this._row.length, u = !this._row[R], l = 0;
          J.a.init(h, 0);
          for (var x = R; x < s; x++) if (this._row[x] ^ (u ? 1 : 0)) h[l]++;
          else {
            if (++l === n) break;
            h[l] = 1, u = !u;
          }
          return h;
        } }, { key: "decodeImage", value: function(R) {
          return null;
        } }], [{ key: "Exception", get: function() {
          return { StartNotFoundException: "Start-Info was not found!", CodeNotFoundException: "Code could not be found!", PatternNotFoundException: "Pattern could not be found!" };
        } }]), m;
      }();
      function K(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var se = [3, 1, 3, 1, 1, 1], re = [3, 1, 1, 1, 3], ne = [[1, 1, 3, 3, 1], [3, 1, 1, 1, 3], [1, 3, 1, 1, 3], [3, 3, 1, 1, 1], [1, 1, 3, 1, 3], [3, 1, 3, 1, 1], [1, 3, 3, 1, 1], [1, 1, 1, 3, 3], [3, 1, 1, 3, 1], [1, 3, 1, 3, 1]], de = se.reduce(function(m, R) {
        return m + R;
      }, 0), w = function(m) {
        D()(h, m);
        var R = K(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "barSpaceRatio", [1, 1]), M()(k()(n), "FORMAT", "2of5"), M()(k()(n), "SINGLE_CODE_ERROR", 0.78), M()(k()(n), "AVG_CODE_ERROR", 0.3), n;
        }
        return G()(h, [{ key: "_findPattern", value: function(n, s) {
          var u = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], l = arguments.length > 3 && arguments[3] !== void 0 && arguments[3], x = [], _ = 0, b = { error: Number.MAX_VALUE, code: -1, start: 0, end: 0 }, S = 0, E = 0, Q = this.AVG_CODE_ERROR;
          s || (s = this._nextSet(this._row));
          for (var W = 0; W < n.length; W++) x[W] = 0;
          for (var Y = s; Y < this._row.length; Y++) if (this._row[Y] ^ (u ? 1 : 0)) x[_]++;
          else {
            if (_ === x.length - 1) {
              S = 0;
              for (var ue = 0; ue < x.length; ue++) S += x[ue];
              if ((E = this._matchPattern(x, n)) < Q) return b.error = E, b.start = Y - S, b.end = Y, b;
              if (!l) return null;
              for (var he = 0; he < x.length - 2; he++) x[he] = x[he + 2];
              x[x.length - 2] = 0, x[x.length - 1] = 0, _--;
            } else _++;
            x[_] = 1, u = !u;
          }
          return null;
        } }, { key: "_findStart", value: function() {
          for (var n = null, s = this._nextSet(this._row), u = 1, l = 0; !n; ) {
            if (!(n = this._findPattern(se, s, !1, !0))) return null;
            if (u = Math.floor((n.end - n.start) / de), (l = n.start - 5 * u) >= 0 && this._matchRange(l, n.start, 0)) return n;
            s = n.end, n = null;
          }
          return n;
        } }, { key: "_verifyTrailingWhitespace", value: function(n) {
          var s = n.end + (n.end - n.start) / 2;
          return s < this._row.length && this._matchRange(n.end, s, 0) ? n : null;
        } }, { key: "_findEnd", value: function() {
          this._row.reverse();
          var n = this._nextSet(this._row), s = this._findPattern(re, n, !1, !0);
          if (this._row.reverse(), s === null) return null;
          var u = s.start;
          return s.start = this._row.length - s.end, s.end = this._row.length - u, s !== null ? this._verifyTrailingWhitespace(s) : null;
        } }, { key: "_verifyCounterLength", value: function(n) {
          return n.length % 10 == 0;
        } }, { key: "_decodeCode", value: function(n) {
          for (var s = this.AVG_CODE_ERROR, u = { error: Number.MAX_VALUE, code: -1, start: 0, end: 0 }, l = 0; l < ne.length; l++) {
            var x = this._matchPattern(n, ne[l]);
            x < u.error && (u.code = l, u.error = x);
          }
          return u.error < s ? u : null;
        } }, { key: "_decodePayload", value: function(n, s, u) {
          for (var l = 0, x = n.length, _ = [0, 0, 0, 0, 0], b = null; l < x; ) {
            for (var S = 0; S < 5; S++) _[S] = n[l] * this.barSpaceRatio[0], l += 2;
            if (!(b = this._decodeCode(_))) return null;
            s.push("".concat(b.code)), u.push(b);
          }
          return b;
        } }, { key: "decode", value: function(n, s) {
          var u = this._findStart();
          if (!u) return null;
          var l = this._findEnd();
          if (!l) return null;
          var x = this._fillCounters(u.end, l.start, !1);
          if (!this._verifyCounterLength(x)) return null;
          var _ = [];
          _.push(u);
          var b = [];
          return this._decodePayload(x, b, _) ? b.length < 5 ? null : (_.push(l), { code: b.join(""), start: u.start, end: l.end, startInfo: u, decodedCodes: _, format: this.FORMAT }) : null;
        } }]), h;
      }(ee);
      function N(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var V = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 45, 36, 58, 47, 46, 43, 65, 66, 67, 68], fe = [3, 6, 9, 96, 18, 66, 33, 36, 48, 72, 12, 24, 69, 81, 84, 21, 26, 41, 11, 14], ce = [26, 41, 11, 14], ve = function(m) {
        D()(h, m);
        var R = N(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "_counters", []), M()(k()(n), "FORMAT", "codabar"), n;
        }
        return G()(h, [{ key: "_computeAlternatingThreshold", value: function(n, s) {
          for (var u = Number.MAX_VALUE, l = 0, x = 0, _ = n; _ < s; _ += 2) (x = this._counters[_]) > l && (l = x), x < u && (u = x);
          return (u + l) / 2 | 0;
        } }, { key: "_toPattern", value: function(n) {
          var s = n + 7;
          if (s > this._counters.length) return -1;
          for (var u = this._computeAlternatingThreshold(n, s), l = this._computeAlternatingThreshold(n + 1, s), x = 64, _ = 0, b = 0, S = 0; S < 7; S++) _ = 1 & S ? l : u, this._counters[n + S] > _ && (b |= x), x >>= 1;
          return b;
        } }, { key: "_isStartEnd", value: function(n) {
          for (var s = 0; s < ce.length; s++) if (ce[s] === n) return !0;
          return !1;
        } }, { key: "_sumCounters", value: function(n, s) {
          for (var u = 0, l = n; l < s; l++) u += this._counters[l];
          return u;
        } }, { key: "_findStart", value: function() {
          for (var n = this._nextUnset(this._row), s = 1; s < this._counters.length; s++) {
            var u = this._toPattern(s);
            if (u !== -1 && this._isStartEnd(u)) return { start: n += this._sumCounters(0, s), end: n + this._sumCounters(s, s + 8), startCounter: s, endCounter: s + 8 };
          }
          return null;
        } }, { key: "_patternToChar", value: function(n) {
          for (var s = 0; s < fe.length; s++) if (fe[s] === n) return String.fromCharCode(V[s]);
          return null;
        } }, { key: "_calculatePatternLength", value: function(n) {
          for (var s = 0, u = n; u < n + 7; u++) s += this._counters[u];
          return s;
        } }, { key: "_verifyWhitespace", value: function(n, s) {
          return (n - 1 <= 0 || this._counters[n - 1] >= this._calculatePatternLength(n) / 2) && (s + 8 >= this._counters.length || this._counters[s + 7] >= this._calculatePatternLength(s) / 2);
        } }, { key: "_charToPattern", value: function(n) {
          for (var s = n.charCodeAt(0), u = 0; u < V.length; u++) if (V[u] === s) return fe[u];
          return 0;
        } }, { key: "_thresholdResultPattern", value: function(n, s) {
          for (var u, l = { space: { narrow: { size: 0, counts: 0, min: 0, max: Number.MAX_VALUE }, wide: { size: 0, counts: 0, min: 0, max: Number.MAX_VALUE } }, bar: { narrow: { size: 0, counts: 0, min: 0, max: Number.MAX_VALUE }, wide: { size: 0, counts: 0, min: 0, max: Number.MAX_VALUE } } }, x = s, _ = 0; _ < n.length; _++) {
            u = this._charToPattern(n[_]);
            for (var b = 6; b >= 0; b--) {
              var S = (1 & b) == 2 ? l.bar : l.space, E = (1 & u) == 1 ? S.wide : S.narrow;
              E.size += this._counters[x + b], E.counts++, u >>= 1;
            }
            x += 8;
          }
          return ["space", "bar"].forEach(function(Q) {
            var W = l[Q];
            W.wide.min = Math.floor((W.narrow.size / W.narrow.counts + W.wide.size / W.wide.counts) / 2), W.narrow.max = Math.ceil(W.wide.min), W.wide.max = Math.ceil((2 * W.wide.size + 1.5) / W.wide.counts);
          }), l;
        } }, { key: "_validateResult", value: function(n, s) {
          for (var u, l = this._thresholdResultPattern(n, s), x = s, _ = 0; _ < n.length; _++) {
            u = this._charToPattern(n[_]);
            for (var b = 6; b >= 0; b--) {
              var S = 1 & b ? l.space : l.bar, E = (1 & u) == 1 ? S.wide : S.narrow, Q = this._counters[x + b];
              if (Q < E.min || Q > E.max) return !1;
              u >>= 1;
            }
            x += 8;
          }
          return !0;
        } }, { key: "decode", value: function(n, s) {
          if (this._counters = this._fillCounters(), !(s = this._findStart())) return null;
          var u, l = s.startCounter, x = [];
          do {
            if ((u = this._toPattern(l)) < 0) return null;
            var _ = this._patternToChar(u);
            if (_ === null) return null;
            if (x.push(_), l += 8, x.length > 1 && this._isStartEnd(u)) break;
          } while (l < this._counters.length);
          if (x.length - 2 < 4 || !this._isStartEnd(u) || !this._verifyWhitespace(s.startCounter, l - 8) || !this._validateResult(x, s.startCounter)) return null;
          l = l > this._counters.length ? this._counters.length : l;
          var b = s.start + this._sumCounters(s.startCounter, l - 8);
          return { code: x.join(""), start: s.start, end: b, startInfo: s, decodedCodes: x, format: this.FORMAT };
        } }]), h;
      }(ee);
      function ye(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var xe = function(m) {
        D()(h, m);
        var R = ye(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "CODE_SHIFT", 98), M()(k()(n), "CODE_C", 99), M()(k()(n), "CODE_B", 100), M()(k()(n), "CODE_A", 101), M()(k()(n), "START_CODE_A", 103), M()(k()(n), "START_CODE_B", 104), M()(k()(n), "START_CODE_C", 105), M()(k()(n), "STOP_CODE", 106), M()(k()(n), "CODE_PATTERN", [[2, 1, 2, 2, 2, 2], [2, 2, 2, 1, 2, 2], [2, 2, 2, 2, 2, 1], [1, 2, 1, 2, 2, 3], [1, 2, 1, 3, 2, 2], [1, 3, 1, 2, 2, 2], [1, 2, 2, 2, 1, 3], [1, 2, 2, 3, 1, 2], [1, 3, 2, 2, 1, 2], [2, 2, 1, 2, 1, 3], [2, 2, 1, 3, 1, 2], [2, 3, 1, 2, 1, 2], [1, 1, 2, 2, 3, 2], [1, 2, 2, 1, 3, 2], [1, 2, 2, 2, 3, 1], [1, 1, 3, 2, 2, 2], [1, 2, 3, 1, 2, 2], [1, 2, 3, 2, 2, 1], [2, 2, 3, 2, 1, 1], [2, 2, 1, 1, 3, 2], [2, 2, 1, 2, 3, 1], [2, 1, 3, 2, 1, 2], [2, 2, 3, 1, 1, 2], [3, 1, 2, 1, 3, 1], [3, 1, 1, 2, 2, 2], [3, 2, 1, 1, 2, 2], [3, 2, 1, 2, 2, 1], [3, 1, 2, 2, 1, 2], [3, 2, 2, 1, 1, 2], [3, 2, 2, 2, 1, 1], [2, 1, 2, 1, 2, 3], [2, 1, 2, 3, 2, 1], [2, 3, 2, 1, 2, 1], [1, 1, 1, 3, 2, 3], [1, 3, 1, 1, 2, 3], [1, 3, 1, 3, 2, 1], [1, 1, 2, 3, 1, 3], [1, 3, 2, 1, 1, 3], [1, 3, 2, 3, 1, 1], [2, 1, 1, 3, 1, 3], [2, 3, 1, 1, 1, 3], [2, 3, 1, 3, 1, 1], [1, 1, 2, 1, 3, 3], [1, 1, 2, 3, 3, 1], [1, 3, 2, 1, 3, 1], [1, 1, 3, 1, 2, 3], [1, 1, 3, 3, 2, 1], [1, 3, 3, 1, 2, 1], [3, 1, 3, 1, 2, 1], [2, 1, 1, 3, 3, 1], [2, 3, 1, 1, 3, 1], [2, 1, 3, 1, 1, 3], [2, 1, 3, 3, 1, 1], [2, 1, 3, 1, 3, 1], [3, 1, 1, 1, 2, 3], [3, 1, 1, 3, 2, 1], [3, 3, 1, 1, 2, 1], [3, 1, 2, 1, 1, 3], [3, 1, 2, 3, 1, 1], [3, 3, 2, 1, 1, 1], [3, 1, 4, 1, 1, 1], [2, 2, 1, 4, 1, 1], [4, 3, 1, 1, 1, 1], [1, 1, 1, 2, 2, 4], [1, 1, 1, 4, 2, 2], [1, 2, 1, 1, 2, 4], [1, 2, 1, 4, 2, 1], [1, 4, 1, 1, 2, 2], [1, 4, 1, 2, 2, 1], [1, 1, 2, 2, 1, 4], [1, 1, 2, 4, 1, 2], [1, 2, 2, 1, 1, 4], [1, 2, 2, 4, 1, 1], [1, 4, 2, 1, 1, 2], [1, 4, 2, 2, 1, 1], [2, 4, 1, 2, 1, 1], [2, 2, 1, 1, 1, 4], [4, 1, 3, 1, 1, 1], [2, 4, 1, 1, 1, 2], [1, 3, 4, 1, 1, 1], [1, 1, 1, 2, 4, 2], [1, 2, 1, 1, 4, 2], [1, 2, 1, 2, 4, 1], [1, 1, 4, 2, 1, 2], [1, 2, 4, 1, 1, 2], [1, 2, 4, 2, 1, 1], [4, 1, 1, 2, 1, 2], [4, 2, 1, 1, 1, 2], [4, 2, 1, 2, 1, 1], [2, 1, 2, 1, 4, 1], [2, 1, 4, 1, 2, 1], [4, 1, 2, 1, 2, 1], [1, 1, 1, 1, 4, 3], [1, 1, 1, 3, 4, 1], [1, 3, 1, 1, 4, 1], [1, 1, 4, 1, 1, 3], [1, 1, 4, 3, 1, 1], [4, 1, 1, 1, 1, 3], [4, 1, 1, 3, 1, 1], [1, 1, 3, 1, 4, 1], [1, 1, 4, 1, 3, 1], [3, 1, 1, 1, 4, 1], [4, 1, 1, 1, 3, 1], [2, 1, 1, 4, 1, 2], [2, 1, 1, 2, 1, 4], [2, 1, 1, 2, 3, 2], [2, 3, 3, 1, 1, 1, 2]]), M()(k()(n), "SINGLE_CODE_ERROR", 0.64), M()(k()(n), "AVG_CODE_ERROR", 0.3), M()(k()(n), "FORMAT", "code_128"), M()(k()(n), "MODULE_INDICES", { bar: [0, 2, 4], space: [1, 3, 5] }), n;
        }
        return G()(h, [{ key: "_decodeCode", value: function(n, s) {
          for (var u = { error: Number.MAX_VALUE, code: -1, start: n, end: n, correction: { bar: 1, space: 1 } }, l = [0, 0, 0, 0, 0, 0], x = n, _ = !this._row[x], b = 0, S = x; S < this._row.length; S++) if (this._row[S] ^ (_ ? 1 : 0)) l[b]++;
          else {
            if (b === l.length - 1) {
              s && this._correct(l, s);
              for (var E = 0; E < this.CODE_PATTERN.length; E++) {
                var Q = this._matchPattern(l, this.CODE_PATTERN[E]);
                Q < u.error && (u.code = E, u.error = Q);
              }
              return u.end = S, u.code === -1 || u.error > this.AVG_CODE_ERROR ? null : (this.CODE_PATTERN[u.code] && (u.correction.bar = this.calculateCorrection(this.CODE_PATTERN[u.code], l, this.MODULE_INDICES.bar), u.correction.space = this.calculateCorrection(this.CODE_PATTERN[u.code], l, this.MODULE_INDICES.space)), u);
            }
            l[++b] = 1, _ = !_;
          }
          return null;
        } }, { key: "_correct", value: function(n, s) {
          this._correctBars(n, s.bar, this.MODULE_INDICES.bar), this._correctBars(n, s.space, this.MODULE_INDICES.space);
        } }, { key: "_findStart", value: function() {
          for (var n = [0, 0, 0, 0, 0, 0], s = this._nextSet(this._row), u = { error: Number.MAX_VALUE, code: -1, start: 0, end: 0, correction: { bar: 1, space: 1 } }, l = !1, x = 0, _ = s; _ < this._row.length; _++) if (this._row[_] ^ (l ? 1 : 0)) n[x]++;
          else {
            if (x === n.length - 1) {
              for (var b = n.reduce(function(W, Y) {
                return W + Y;
              }, 0), S = this.START_CODE_A; S <= this.START_CODE_C; S++) {
                var E = this._matchPattern(n, this.CODE_PATTERN[S]);
                E < u.error && (u.code = S, u.error = E);
              }
              if (u.error < this.AVG_CODE_ERROR) return u.start = _ - b, u.end = _, u.correction.bar = this.calculateCorrection(this.CODE_PATTERN[u.code], n, this.MODULE_INDICES.bar), u.correction.space = this.calculateCorrection(this.CODE_PATTERN[u.code], n, this.MODULE_INDICES.space), u;
              for (var Q = 0; Q < 4; Q++) n[Q] = n[Q + 2];
              n[4] = 0, n[5] = 0, x--;
            } else x++;
            n[x] = 1, l = !l;
          }
          return null;
        } }, { key: "decode", value: function(n, s) {
          var u = this, l = this._findStart();
          if (l === null) return null;
          var x = { code: l.code, start: l.start, end: l.end, correction: { bar: l.correction.bar, space: l.correction.space } }, _ = [];
          _.push(x);
          for (var b = x.code, S = function(pe) {
            switch (pe) {
              case u.START_CODE_A:
                return u.CODE_A;
              case u.START_CODE_B:
                return u.CODE_B;
              case u.START_CODE_C:
                return u.CODE_C;
              default:
                return null;
            }
          }(x.code), E = !1, Q = !1, W = Q, Y = !0, ue = 0, he = [], me = []; !E; ) {
            if (W = Q, Q = !1, (x = this._decodeCode(x.end, x.correction)) !== null) switch (x.code !== this.STOP_CODE && (Y = !0), x.code !== this.STOP_CODE && (he.push(x.code), b += ++ue * x.code), _.push(x), S) {
              case this.CODE_A:
                if (x.code < 64) me.push(String.fromCharCode(32 + x.code));
                else if (x.code < 96) me.push(String.fromCharCode(x.code - 64));
                else switch (x.code !== this.STOP_CODE && (Y = !1), x.code) {
                  case this.CODE_SHIFT:
                    Q = !0, S = this.CODE_B;
                    break;
                  case this.CODE_B:
                    S = this.CODE_B;
                    break;
                  case this.CODE_C:
                    S = this.CODE_C;
                    break;
                  case this.STOP_CODE:
                    E = !0;
                }
                break;
              case this.CODE_B:
                if (x.code < 96) me.push(String.fromCharCode(32 + x.code));
                else switch (x.code !== this.STOP_CODE && (Y = !1), x.code) {
                  case this.CODE_SHIFT:
                    Q = !0, S = this.CODE_A;
                    break;
                  case this.CODE_A:
                    S = this.CODE_A;
                    break;
                  case this.CODE_C:
                    S = this.CODE_C;
                    break;
                  case this.STOP_CODE:
                    E = !0;
                }
                break;
              case this.CODE_C:
                if (x.code < 100) me.push(x.code < 10 ? "0" + x.code : x.code);
                else switch (x.code !== this.STOP_CODE && (Y = !1), x.code) {
                  case this.CODE_A:
                    S = this.CODE_A;
                    break;
                  case this.CODE_B:
                    S = this.CODE_B;
                    break;
                  case this.STOP_CODE:
                    E = !0;
                }
            }
            else E = !0;
            W && (S = S === this.CODE_A ? this.CODE_B : this.CODE_A);
          }
          return x === null ? null : (x.end = this._nextUnset(this._row, x.end), this._verifyTrailingWhitespace(x) ? (b -= ue * he[he.length - 1]) % 103 !== he[he.length - 1] ? null : me.length ? (Y && me.splice(me.length - 1, 1), { code: me.join(""), start: l.start, end: x.end, codeset: S, startInfo: l, decodedCodes: _, endInfo: x, format: this.FORMAT }) : null : null);
        } }, { key: "_verifyTrailingWhitespace", value: function(n) {
          var s;
          return (s = n.end + (n.end - n.start) / 2) < this._row.length && this._matchRange(n.end, s, 0) ? n : null;
        } }, { key: "calculateCorrection", value: function(n, s, u) {
          for (var l = u.length, x = 0, _ = 0; l--; ) _ += n[u[l]], x += s[u[l]];
          return _ / x;
        } }]), h;
      }(ee), be = e(14), Se = e.n(be), Ee = e(33), Oe = e.n(Ee);
      function at(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var qt = new Uint16Array(Oe()("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. *$/+%").map(function(m) {
        return m.charCodeAt(0);
      })), st = new Uint16Array([52, 289, 97, 352, 49, 304, 112, 37, 292, 100, 265, 73, 328, 25, 280, 88, 13, 268, 76, 28, 259, 67, 322, 19, 274, 82, 7, 262, 70, 22, 385, 193, 448, 145, 400, 208, 133, 388, 196, 148, 168, 162, 138, 42]), qe = function(m) {
        D()(h, m);
        var R = at(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "FORMAT", "code_39"), n;
        }
        return G()(h, [{ key: "_findStart", value: function() {
          for (var n = this._nextSet(this._row), s = n, u = new Uint16Array([0, 0, 0, 0, 0, 0, 0, 0, 0]), l = 0, x = !1, _ = n; _ < this._row.length; _++) if (this._row[_] ^ (x ? 1 : 0)) u[l]++;
          else {
            if (l === u.length - 1) {
              if (this._toPattern(u) === 148) {
                var b = Math.floor(Math.max(0, s - (_ - s) / 4));
                if (this._matchRange(b, s, 0)) return { start: s, end: _ };
              }
              s += u[0] + u[1];
              for (var S = 0; S < 7; S++) u[S] = u[S + 2];
              u[7] = 0, u[8] = 0, l--;
            } else l++;
            u[l] = 1, x = !x;
          }
          return null;
        } }, { key: "_toPattern", value: function(n) {
          for (var s = n.length, u = 0, l = s, x = 0; l > 3; ) {
            u = this._findNextWidth(n, u), l = 0;
            for (var _ = 0, b = 0; b < s; b++) n[b] > u && (_ |= 1 << s - 1 - b, l++, x += n[b]);
            if (l === 3) {
              for (var S = 0; S < s && l > 0; S++) if (n[S] > u && (l--, 2 * n[S] >= x)) return -1;
              return _;
            }
          }
          return -1;
        } }, { key: "_findNextWidth", value: function(n, s) {
          for (var u = Number.MAX_VALUE, l = 0; l < n.length; l++) n[l] < u && n[l] > s && (u = n[l]);
          return u;
        } }, { key: "_patternToChar", value: function(n) {
          for (var s = 0; s < st.length; s++) if (st[s] === n) return String.fromCharCode(qt[s]);
          return null;
        } }, { key: "_verifyTrailingWhitespace", value: function(n, s, u) {
          var l = J.a.sum(u);
          return 3 * (s - n - l) >= l;
        } }, { key: "decode", value: function() {
          var n = new Uint16Array([0, 0, 0, 0, 0, 0, 0, 0, 0]), s = [], u = this._findStart();
          if (!u) return null;
          var l, x, _ = this._nextSet(this._row, u.end);
          do {
            n = this._toCounters(_, n);
            var b = this._toPattern(n);
            if (b < 0 || (l = this._patternToChar(b)) === null) return null;
            s.push(l), x = _, _ += J.a.sum(n), _ = this._nextSet(this._row, _);
          } while (l !== "*");
          return s.pop(), s.length && this._verifyTrailingWhitespace(x, _, n) ? { code: s.join(""), start: u.start, end: _, startInfo: u, decodedCodes: s, format: this.FORMAT } : null;
        } }]), h;
      }(ee);
      function Vt(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var Ht = /[AEIO]/g, ct = function(m) {
        D()(h, m);
        var R = Vt(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "FORMAT", "code_32_reader"), n;
        }
        return G()(h, [{ key: "_decodeCode32", value: function(n) {
          if (/[^0-9BCDFGHJKLMNPQRSTUVWXYZ]/.test(n)) return null;
          for (var s = 0, u = 0; u < n.length; u++) s = 32 * s + "0123456789BCDFGHJKLMNPQRSTUVWXYZ".indexOf(n[u]);
          var l = "".concat(s);
          return l.length < 9 && (l = ("000000000" + l).slice(-9)), "A" + l;
        } }, { key: "_checkChecksum", value: function(n) {
          return !!n;
        } }, { key: "decode", value: function() {
          var n = Se()(L()(h.prototype), "decode", this).call(this);
          if (!n) return null;
          var s = n.code;
          if (!s || (s = s.replace(Ht, ""), !this._checkChecksum(s))) return null;
          var u = this._decodeCode32(s);
          return u ? (n.code = u, n) : null;
        } }]), h;
      }(qe);
      function Xt(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var ut = /[IOQ]/g, ft = /[A-Z0-9]{17}/, Ye = function(m) {
        D()(h, m);
        var R = Xt(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "FORMAT", "code_39_vin"), n;
        }
        return G()(h, [{ key: "_checkChecksum", value: function(n) {
          return !!n;
        } }, { key: "decode", value: function() {
          var n = Se()(L()(h.prototype), "decode", this).call(this);
          if (!n) return null;
          var s = n.code;
          return s && (s = s.replace(ut, "")).match(ft) && this._checkChecksum(s) ? (n.code = s, n) : null;
        } }]), h;
      }(qe);
      function lt(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var Ke = new Uint16Array(Oe()("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%abcd*").map(function(m) {
        return m.charCodeAt(0);
      })), dt = new Uint16Array([276, 328, 324, 322, 296, 292, 290, 336, 274, 266, 424, 420, 418, 404, 402, 394, 360, 356, 354, 308, 282, 344, 332, 326, 300, 278, 436, 434, 428, 422, 406, 410, 364, 358, 310, 314, 302, 468, 466, 458, 366, 374, 430, 294, 474, 470, 306, 350]), pt = function(m) {
        D()(h, m);
        var R = lt(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "FORMAT", "code_93"), n;
        }
        return G()(h, [{ key: "_patternToChar", value: function(n) {
          for (var s = 0; s < dt.length; s++) if (dt[s] === n) return String.fromCharCode(Ke[s]);
          return null;
        } }, { key: "_toPattern", value: function(n) {
          for (var s = n.length, u = n.reduce(function(S, E) {
            return S + E;
          }, 0), l = 0, x = 0; x < s; x++) {
            var _ = Math.round(9 * n[x] / u);
            if (_ < 1 || _ > 4) return -1;
            if (1 & x) l <<= _;
            else for (var b = 0; b < _; b++) l = l << 1 | 1;
          }
          return l;
        } }, { key: "_findStart", value: function() {
          for (var n = this._nextSet(this._row), s = n, u = new Uint16Array([0, 0, 0, 0, 0, 0]), l = 0, x = !1, _ = n; _ < this._row.length; _++) if (this._row[_] ^ (x ? 1 : 0)) u[l]++;
          else {
            if (l === u.length - 1) {
              if (this._toPattern(u) === 350) {
                var b = Math.floor(Math.max(0, s - (_ - s) / 4));
                if (this._matchRange(b, s, 0)) return { start: s, end: _ };
              }
              s += u[0] + u[1];
              for (var S = 0; S < 4; S++) u[S] = u[S + 2];
              u[4] = 0, u[5] = 0, l--;
            } else l++;
            u[l] = 1, x = !x;
          }
          return null;
        } }, { key: "_verifyEnd", value: function(n, s) {
          return !(n === s || !this._row[s]);
        } }, { key: "_decodeExtended", value: function(n) {
          for (var s = n.length, u = [], l = 0; l < s; l++) {
            var x = n[l];
            if (x >= "a" && x <= "d") {
              if (l > s - 2) return null;
              var _ = n[++l], b = _.charCodeAt(0), S = void 0;
              switch (x) {
                case "a":
                  if (!(_ >= "A" && _ <= "Z")) return null;
                  S = String.fromCharCode(b - 64);
                  break;
                case "b":
                  if (_ >= "A" && _ <= "E") S = String.fromCharCode(b - 38);
                  else if (_ >= "F" && _ <= "J") S = String.fromCharCode(b - 11);
                  else if (_ >= "K" && _ <= "O") S = String.fromCharCode(b + 16);
                  else if (_ >= "P" && _ <= "S") S = String.fromCharCode(b + 43);
                  else {
                    if (!(_ >= "T" && _ <= "Z")) return null;
                    S = "";
                  }
                  break;
                case "c":
                  if (_ >= "A" && _ <= "O") S = String.fromCharCode(b - 32);
                  else {
                    if (_ !== "Z") return null;
                    S = ":";
                  }
                  break;
                case "d":
                  if (!(_ >= "A" && _ <= "Z")) return null;
                  S = String.fromCharCode(b + 32);
                  break;
                default:
                  return console.warn("* code_93_reader _decodeExtended hit default case, this may be an error", S), null;
              }
              u.push(S);
            } else u.push(x);
          }
          return u;
        } }, { key: "_matchCheckChar", value: function(n, s, u) {
          var l = n.slice(0, s), x = l.length, _ = l.reduce(function(b, S, E) {
            return b + ((-1 * E + (x - 1)) % u + 1) * Ke.indexOf(S.charCodeAt(0));
          }, 0);
          return Ke[_ % 47] === n[s].charCodeAt(0);
        } }, { key: "_verifyChecksums", value: function(n) {
          return this._matchCheckChar(n, n.length - 2, 20) && this._matchCheckChar(n, n.length - 1, 15);
        } }, { key: "decode", value: function(n, s) {
          if (!(s = this._findStart())) return null;
          var u, l, x = new Uint16Array([0, 0, 0, 0, 0, 0]), _ = [], b = this._nextSet(this._row, s.end);
          do {
            x = this._toCounters(b, x);
            var S = this._toPattern(x);
            if (S < 0 || (l = this._patternToChar(S)) === null) return null;
            _.push(l), u = b, b += J.a.sum(x), b = this._nextSet(this._row, b);
          } while (l !== "*");
          return _.pop(), _.length && this._verifyEnd(u, b) && this._verifyChecksums(_) ? (_ = _.slice(0, _.length - 2), (_ = this._decodeExtended(_)) === null ? null : { code: _.join(""), start: s.start, end: b, startInfo: s, decodedCodes: _, format: this.FORMAT }) : null;
        } }]), h;
      }(ee);
      function ht(m, R) {
        var h = Object.keys(m);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(m);
          R && (n = n.filter(function(s) {
            return Object.getOwnPropertyDescriptor(m, s).enumerable;
          })), h.push.apply(h, n);
        }
        return h;
      }
      function Ze(m) {
        for (var R = 1; R < arguments.length; R++) {
          var h = arguments[R] != null ? arguments[R] : {};
          R % 2 ? ht(Object(h), !0).forEach(function(n) {
            M()(m, n, h[n]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(m, Object.getOwnPropertyDescriptors(h)) : ht(Object(h)).forEach(function(n) {
            Object.defineProperty(m, n, Object.getOwnPropertyDescriptor(h, n));
          });
        }
        return m;
      }
      function Jt(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var Qt = [1, 1, 1], vt = [1, 1, 1, 1, 1], $t = [1, 1, 2], gt = [[3, 2, 1, 1], [2, 2, 2, 1], [2, 1, 2, 2], [1, 4, 1, 1], [1, 1, 3, 2], [1, 2, 3, 1], [1, 1, 1, 4], [1, 3, 1, 2], [1, 2, 1, 3], [3, 1, 1, 2], [1, 1, 2, 3], [1, 2, 2, 2], [2, 2, 1, 2], [1, 1, 4, 1], [2, 3, 1, 1], [1, 3, 2, 1], [4, 1, 1, 1], [2, 1, 3, 1], [3, 1, 2, 1], [2, 1, 1, 3]], mt = [0, 11, 13, 14, 19, 25, 28, 21, 22, 26], je = function(m) {
        D()(h, m);
        var R = Jt(h);
        function h(n, s) {
          var u;
          return te()(this, h), u = R.call(this, p()({ supplements: [] }, n), s), M()(k()(u), "FORMAT", "ean_13"), M()(k()(u), "SINGLE_CODE_ERROR", 0.7), M()(k()(u), "STOP_PATTERN", [1, 1, 1]), u;
        }
        return G()(h, [{ key: "_findPattern", value: function(n, s, u, l) {
          var x = new Array(n.length).fill(0), _ = { error: Number.MAX_VALUE, start: 0, end: 0 }, b = 0;
          s || (s = this._nextSet(this._row));
          for (var S = !1, E = s; E < this._row.length; E++) if (this._row[E] ^ (u ? 1 : 0)) x[b] += 1;
          else {
            if (b === x.length - 1) {
              var Q = this._matchPattern(x, n);
              if (Q < 0.48 && _.error && Q < _.error) return S = !0, _.error = Q, _.start = E - x.reduce(function(Y, ue) {
                return Y + ue;
              }, 0), _.end = E, _;
              if (l) {
                for (var W = 0; W < x.length - 2; W++) x[W] = x[W + 2];
                x[x.length - 2] = 0, x[x.length - 1] = 0, b--;
              }
            } else b++;
            x[b] = 1, u = !u;
          }
          return S ? _ : null;
        } }, { key: "_decodeCode", value: function(n, s) {
          var u = [0, 0, 0, 0], l = n, x = { error: Number.MAX_VALUE, code: -1, start: n, end: n }, _ = !this._row[l], b = 0;
          s || (s = gt.length);
          for (var S = l; S < this._row.length; S++) if (this._row[S] ^ (_ ? 1 : 0)) u[b]++;
          else {
            if (b === u.length - 1) {
              for (var E = 0; E < s; E++) {
                var Q = this._matchPattern(u, gt[E]);
                x.end = S, Q < x.error && (x.code = E, x.error = Q);
              }
              return x.error > 0.48 ? null : x;
            }
            u[++b] = 1, _ = !_;
          }
          return null;
        } }, { key: "_findStart", value: function() {
          for (var n = this._nextSet(this._row), s = null; !s; ) {
            if (!(s = this._findPattern(Qt, n, !1, !0))) return null;
            var u = s.start - (s.end - s.start);
            if (u >= 0 && this._matchRange(u, s.start, 0)) return s;
            n = s.end, s = null;
          }
          return null;
        } }, { key: "_calculateFirstDigit", value: function(n) {
          for (var s = 0; s < mt.length; s++) if (n === mt[s]) return s;
          return null;
        } }, { key: "_decodePayload", value: function(n, s, u) {
          for (var l = Ze({}, n), x = 0, _ = 0; _ < 6; _++) {
            if (!(l = this._decodeCode(l.end))) return null;
            l.code >= 10 ? (l.code -= 10, x |= 1 << 5 - _) : x |= 0 << 5 - _, s.push(l.code), u.push(l);
          }
          var b = this._calculateFirstDigit(x);
          if (b === null) return null;
          s.unshift(b);
          var S = this._findPattern(vt, l.end, !0, !1);
          if (S === null || !S.end) return null;
          u.push(S);
          for (var E = 0; E < 6; E++) {
            if (!(S = this._decodeCode(S.end, 10))) return null;
            u.push(S), s.push(S.code);
          }
          return S;
        } }, { key: "_verifyTrailingWhitespace", value: function(n) {
          var s = n.end + (n.end - n.start);
          return s < this._row.length && this._matchRange(n.end, s, 0) ? n : null;
        } }, { key: "_findEnd", value: function(n, s) {
          var u = this._findPattern(this.STOP_PATTERN, n, s, !1);
          return u !== null ? this._verifyTrailingWhitespace(u) : null;
        } }, { key: "_checksum", value: function(n) {
          for (var s = 0, u = n.length - 2; u >= 0; u -= 2) s += n[u];
          s *= 3;
          for (var l = n.length - 1; l >= 0; l -= 2) s += n[l];
          return s % 10 == 0;
        } }, { key: "_decodeExtensions", value: function(n) {
          var s = this._nextSet(this._row, n), u = this._findPattern($t, s, !1, !1);
          if (u === null) return null;
          for (var l = 0; l < this.supplements.length; l++) try {
            var x = this.supplements[l].decode(this._row, u.end);
            if (x !== null) return { code: x.code, start: s, startInfo: u, end: x.end, decodedCodes: x.decodedCodes, format: this.supplements[l].FORMAT };
          } catch (_) {
            console.error("* decodeExtensions error in ", this.supplements[l], ": ", _);
          }
          return null;
        } }, { key: "decode", value: function(n, s) {
          var u = new Array(), l = new Array(), x = {}, _ = this._findStart();
          if (!_) return null;
          var b = { start: _.start, end: _.end };
          if (l.push(b), !(b = this._decodePayload(b, u, l)) || !(b = this._findEnd(b.end, !1)) || (l.push(b), !this._checksum(u))) return null;
          if (this.supplements.length > 0) {
            var S = this._decodeExtensions(b.end);
            if (!S || !S.decodedCodes) return null;
            var E = S.decodedCodes[S.decodedCodes.length - 1], Q = { start: E.start + ((E.end - E.start) / 2 | 0), end: E.end };
            if (!this._verifyTrailingWhitespace(Q)) return null;
            x = { supplement: S, code: u.join("") + S.code };
          }
          return Ze(Ze({ code: u.join(""), start: _.start, end: b.end, startInfo: _, decodedCodes: l }, x), {}, { format: this.FORMAT });
        } }]), h;
      }(ee);
      function Yt(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var yt = function(m) {
        D()(h, m);
        var R = Yt(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "FORMAT", "ean_2"), n;
        }
        return G()(h, [{ key: "decode", value: function(n, s) {
          n && (this._row = n);
          var u = 0, l = s, x = this._row.length, _ = [], b = [], S = null;
          if (l === void 0) return null;
          for (var E = 0; E < 2 && l < x; E++) {
            if (!(S = this._decodeCode(l))) return null;
            b.push(S), _.push(S.code % 10), S.code >= 10 && (u |= 1 << 1 - E), E !== 1 && (l = this._nextSet(this._row, S.end), l = this._nextUnset(this._row, l));
          }
          if (_.length !== 2 || parseInt(_.join("")) % 4 !== u) return null;
          var Q = this._findStart();
          return { code: _.join(""), decodedCodes: b, end: S.end, format: this.FORMAT, startInfo: Q, start: Q.start };
        } }]), h;
      }(je);
      function Kt(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var Zt = [24, 20, 18, 17, 12, 6, 3, 10, 9, 5], xt = function(m) {
        D()(h, m);
        var R = Kt(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "FORMAT", "ean_5"), n;
        }
        return G()(h, [{ key: "decode", value: function(n, s) {
          if (s === void 0) return null;
          n && (this._row = n);
          for (var u = 0, l = s, x = this._row.length, _ = null, b = [], S = [], E = 0; E < 5 && l < x; E++) {
            if (!(_ = this._decodeCode(l))) return null;
            S.push(_), b.push(_.code % 10), _.code >= 10 && (u |= 1 << 4 - E), E !== 4 && (l = this._nextSet(this._row, _.end), l = this._nextUnset(this._row, l));
          }
          if (b.length !== 5 || function(W) {
            for (var Y = W.length, ue = 0, he = Y - 2; he >= 0; he -= 2) ue += W[he];
            ue *= 3;
            for (var me = Y - 1; me >= 0; me -= 2) ue += W[me];
            return (ue *= 3) % 10;
          }(b) !== function(W) {
            for (var Y = 0; Y < 10; Y++) if (W === Zt[Y]) return Y;
            return null;
          }(u)) return null;
          var Q = this._findStart();
          return { code: b.join(""), decodedCodes: S, end: _.end, format: this.FORMAT, startInfo: Q, start: Q.start };
        } }]), h;
      }(je);
      function Le(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var _t = function(m) {
        D()(h, m);
        var R = Le(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "FORMAT", "ean_8"), n;
        }
        return G()(h, [{ key: "_decodePayload", value: function(n, s, u) {
          for (var l = n, x = 0; x < 4; x++) {
            if (!(l = this._decodeCode(l.end, 10))) return null;
            s.push(l.code), u.push(l);
          }
          if ((l = this._findPattern(vt, l.end, !0, !1)) === null) return null;
          u.push(l);
          for (var _ = 0; _ < 4; _++) {
            if (!(l = this._decodeCode(l.end, 10))) return null;
            u.push(l), s.push(l.code);
          }
          return l;
        } }]), h;
      }(je);
      function er(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var bt = function(m) {
        D()(h, m);
        var R = er(h);
        function h(n) {
          var s;
          return te()(this, h), s = R.call(this, p()({ normalizeBarSpaceWidth: !1 }, n)), M()(k()(s), "barSpaceRatio", [1, 1]), M()(k()(s), "SINGLE_CODE_ERROR", 0.78), M()(k()(s), "AVG_CODE_ERROR", 0.38), M()(k()(s), "START_PATTERN", [1, 1, 1, 1]), M()(k()(s), "STOP_PATTERN", [1, 1, 3]), M()(k()(s), "CODE_PATTERN", [[1, 1, 3, 3, 1], [3, 1, 1, 1, 3], [1, 3, 1, 1, 3], [3, 3, 1, 1, 1], [1, 1, 3, 1, 3], [3, 1, 3, 1, 1], [1, 3, 3, 1, 1], [1, 1, 1, 3, 3], [3, 1, 1, 3, 1], [1, 3, 1, 3, 1]]), M()(k()(s), "MAX_CORRECTION_FACTOR", 5), M()(k()(s), "FORMAT", "i2of5"), n.normalizeBarSpaceWidth && (s.SINGLE_CODE_ERROR = 0.38, s.AVG_CODE_ERROR = 0.09), s.config = n, j()(s, k()(s));
        }
        return G()(h, [{ key: "_matchPattern", value: function(n, s) {
          if (this.config.normalizeBarSpaceWidth) {
            for (var u = [0, 0], l = [0, 0], x = [0, 0], _ = this.MAX_CORRECTION_FACTOR, b = 1 / _, S = 0; S < n.length; S++) u[S % 2] += n[S], l[S % 2] += s[S];
            x[0] = l[0] / u[0], x[1] = l[1] / u[1], x[0] = Math.max(Math.min(x[0], _), b), x[1] = Math.max(Math.min(x[1], _), b), this.barSpaceRatio = x;
            for (var E = 0; E < n.length; E++) n[E] *= this.barSpaceRatio[E % 2];
          }
          return Se()(L()(h.prototype), "_matchPattern", this).call(this, n, s);
        } }, { key: "_findPattern", value: function(n, s) {
          var u = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], l = arguments.length > 3 && arguments[3] !== void 0 && arguments[3], x = new Array(n.length).fill(0), _ = 0, b = { error: Number.MAX_VALUE, start: 0, end: 0 }, S = this.AVG_CODE_ERROR;
          u = u || !1, l = l || !1, s || (s = this._nextSet(this._row));
          for (var E = s; E < this._row.length; E++) if (this._row[E] ^ (u ? 1 : 0)) x[_]++;
          else {
            if (_ === x.length - 1) {
              var Q = x.reduce(function(ue, he) {
                return ue + he;
              }, 0), W = this._matchPattern(x, n);
              if (W < S) return b.error = W, b.start = E - Q, b.end = E, b;
              if (!l) return null;
              for (var Y = 0; Y < x.length - 2; Y++) x[Y] = x[Y + 2];
              x[x.length - 2] = 0, x[x.length - 1] = 0, _--;
            } else _++;
            x[_] = 1, u = !u;
          }
          return null;
        } }, { key: "_findStart", value: function() {
          for (var n = 0, s = this._nextSet(this._row), u = null, l = 1; !u; ) {
            if (!(u = this._findPattern(this.START_PATTERN, s, !1, !0))) return null;
            if (l = Math.floor((u.end - u.start) / 4), (n = u.start - 10 * l) >= 0 && this._matchRange(n, u.start, 0)) return u;
            s = u.end, u = null;
          }
          return null;
        } }, { key: "_verifyTrailingWhitespace", value: function(n) {
          var s = n.end + (n.end - n.start) / 2;
          return s < this._row.length && this._matchRange(n.end, s, 0) ? n : null;
        } }, { key: "_findEnd", value: function() {
          this._row.reverse();
          var n = this._findPattern(this.STOP_PATTERN);
          if (this._row.reverse(), n === null) return null;
          var s = n.start;
          return n.start = this._row.length - n.end, n.end = this._row.length - s, n !== null ? this._verifyTrailingWhitespace(n) : null;
        } }, { key: "_decodePair", value: function(n) {
          for (var s = [], u = 0; u < n.length; u++) {
            var l = this._decodeCode(n[u]);
            if (!l) return null;
            s.push(l);
          }
          return s;
        } }, { key: "_decodeCode", value: function(n) {
          for (var s = this.AVG_CODE_ERROR, u = { error: Number.MAX_VALUE, code: -1, start: 0, end: 0 }, l = 0; l < this.CODE_PATTERN.length; l++) {
            var x = this._matchPattern(n, this.CODE_PATTERN[l]);
            x < u.error && (u.code = l, u.error = x);
          }
          return u.error < s ? u : null;
        } }, { key: "_decodePayload", value: function(n, s, u) {
          for (var l = 0, x = n.length, _ = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]], b = null; l < x; ) {
            for (var S = 0; S < 5; S++) _[0][S] = n[l] * this.barSpaceRatio[0], _[1][S] = n[l + 1] * this.barSpaceRatio[1], l += 2;
            if (!(b = this._decodePair(_))) return null;
            for (var E = 0; E < b.length; E++) s.push(b[E].code + ""), u.push(b[E]);
          }
          return b;
        } }, { key: "_verifyCounterLength", value: function(n) {
          return n.length % 10 == 0;
        } }, { key: "decode", value: function(n, s) {
          var u = new Array(), l = new Array(), x = this._findStart();
          if (!x) return null;
          l.push(x);
          var _ = this._findEnd();
          if (!_) return null;
          var b = this._fillCounters(x.end, _.start, !1);
          return this._verifyCounterLength(b) && this._decodePayload(b, u, l) ? u.length % 2 != 0 || u.length < 6 ? null : (l.push(_), { code: u.join(""), start: x.start, end: _.end, startInfo: x, decodedCodes: l, format: this.FORMAT }) : null;
        } }]), h;
      }(ee);
      function Ct(m, R) {
        var h = Object.keys(m);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(m);
          R && (n = n.filter(function(s) {
            return Object.getOwnPropertyDescriptor(m, s).enumerable;
          })), h.push.apply(h, n);
        }
        return h;
      }
      function tr(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var Rt = function(m) {
        D()(h, m);
        var R = tr(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "CODE_FREQUENCY", [[56, 52, 50, 49, 44, 38, 35, 42, 41, 37], [7, 11, 13, 14, 19, 25, 28, 21, 22, 26]]), M()(k()(n), "STOP_PATTERN", [1 / 6 * 7, 1 / 6 * 7, 1 / 6 * 7, 1 / 6 * 7, 1 / 6 * 7, 1 / 6 * 7]), M()(k()(n), "FORMAT", "upc_e"), n;
        }
        return G()(h, [{ key: "_decodePayload", value: function(n, s, u) {
          for (var l = function(b) {
            for (var S = 1; S < arguments.length; S++) {
              var E = arguments[S] != null ? arguments[S] : {};
              S % 2 ? Ct(Object(E), !0).forEach(function(Q) {
                M()(b, Q, E[Q]);
              }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(b, Object.getOwnPropertyDescriptors(E)) : Ct(Object(E)).forEach(function(Q) {
                Object.defineProperty(b, Q, Object.getOwnPropertyDescriptor(E, Q));
              });
            }
            return b;
          }({}, n), x = 0, _ = 0; _ < 6; _++) {
            if (!(l = this._decodeCode(l.end))) return null;
            l.code >= 10 && (l.code = l.code - 10, x |= 1 << 5 - _), s.push(l.code), u.push(l);
          }
          return this._determineParity(x, s) ? l : null;
        } }, { key: "_determineParity", value: function(n, s) {
          for (var u = 0; u < this.CODE_FREQUENCY.length; u++) for (var l = 0; l < this.CODE_FREQUENCY[u].length; l++) if (n === this.CODE_FREQUENCY[u][l]) return s.unshift(u), s.push(l), !0;
          return !1;
        } }, { key: "_convertToUPCA", value: function(n) {
          var s = [n[0]], u = n[n.length - 2];
          return (s = u <= 2 ? s.concat(n.slice(1, 3)).concat([u, 0, 0, 0, 0]).concat(n.slice(3, 6)) : u === 3 ? s.concat(n.slice(1, 4)).concat([0, 0, 0, 0, 0]).concat(n.slice(4, 6)) : u === 4 ? s.concat(n.slice(1, 5)).concat([0, 0, 0, 0, 0, n[5]]) : s.concat(n.slice(1, 6)).concat([0, 0, 0, 0, u])).push(n[n.length - 1]), s;
        } }, { key: "_checksum", value: function(n) {
          return Se()(L()(h.prototype), "_checksum", this).call(this, this._convertToUPCA(n));
        } }, { key: "_findEnd", value: function(n, s) {
          return Se()(L()(h.prototype), "_findEnd", this).call(this, n, !0);
        } }, { key: "_verifyTrailingWhitespace", value: function(n) {
          var s = n.end + (n.end - n.start) / 2;
          return s < this._row.length && this._matchRange(n.end, s, 0) ? n : null;
        } }]), h;
      }(je);
      function rr(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var St = function(m) {
        D()(h, m);
        var R = rr(h);
        function h() {
          var n;
          te()(this, h);
          for (var s = arguments.length, u = new Array(s), l = 0; l < s; l++) u[l] = arguments[l];
          return n = R.call.apply(R, [this].concat(u)), M()(k()(n), "FORMAT", "upc_a"), n;
        }
        return G()(h, [{ key: "decode", value: function(n, s) {
          var u = je.prototype.decode.call(this);
          return u && u.code && u.code.length === 13 && u.code.charAt(0) === "0" ? (u.code = u.code.substring(1), u) : null;
        } }]), h;
      }(je), Fe = {}, Ve = { UP: 1, DOWN: -1 };
      Fe.getBarcodeLine = function(m, R, h) {
        var n, s, u, l, x, _ = 0 | R.x, b = 0 | R.y, S = 0 | h.x, E = 0 | h.y, Q = Math.abs(E - b) > Math.abs(S - _), W = [], Y = m.data, ue = m.size.x, he = 255, me = 0;
        function pe(We, _n) {
          x = Y[_n * ue + We], he = x < he ? x : he, me = x > me ? x : me, W.push(x);
        }
        Q && (u = _, _ = b, b = u, u = S, S = E, E = u), _ > S && (u = _, _ = S, S = u, u = b, b = E, E = u);
        var _e = S - _, Re = Math.abs(E - b);
        n = _e / 2 | 0, s = b;
        var ke = b < E ? 1 : -1;
        for (l = _; l < S; l++) Q ? pe(s, l) : pe(l, s), (n -= Re) < 0 && (s += ke, n += _e);
        return { line: W, min: he, max: me };
      }, Fe.toBinaryLine = function(m) {
        var R, h, n, s, u, l, x = m.min, _ = m.max, b = m.line, S = x + (_ - x) / 2, E = [], Q = (_ - x) / 12, W = -Q;
        for (n = b[0] > S ? Ve.UP : Ve.DOWN, E.push({ pos: 0, val: b[0] }), u = 0; u < b.length - 2; u++) n !== (s = (R = b[u + 1] - b[u]) + (h = b[u + 2] - b[u + 1]) < W && b[u + 1] < 1.5 * S ? Ve.DOWN : R + h > Q && b[u + 1] > 0.5 * S ? Ve.UP : n) && (E.push({ pos: u, val: b[u] }), n = s);
        for (E.push({ pos: b.length, val: b[b.length - 1] }), l = E[0].pos; l < E[1].pos; l++) b[l] = b[l] > S ? 0 : 1;
        for (u = 1; u < E.length - 1; u++) for (Q = E[u + 1].val > E[u].val ? E[u].val + (E[u + 1].val - E[u].val) / 3 * 2 | 0 : E[u + 1].val + (E[u].val - E[u + 1].val) / 3 | 0, l = E[u].pos; l < E[u + 1].pos; l++) b[l] = b[l] > Q ? 0 : 1;
        return { line: b, threshold: Q };
      }, Fe.debug = { printFrequency: function(m, R) {
        var h, n = R.getContext("2d");
        for (R.width = m.length, R.height = 256, n.beginPath(), n.strokeStyle = "blue", h = 0; h < m.length; h++) n.moveTo(h, 255), n.lineTo(h, 255 - m[h]);
        n.stroke(), n.closePath();
      }, printPattern: function(m, R) {
        var h, n = R.getContext("2d");
        for (R.width = m.length, n.fillColor = "black", h = 0; h < m.length; h++) m[h] === 1 && n.fillRect(h, 0, 1, 100);
      } };
      var et = Fe;
      function nr(m, R) {
        var h = typeof Symbol < "u" && m[Symbol.iterator] || m["@@iterator"];
        if (!h) {
          if (Array.isArray(m) || (h = function(_, b) {
            if (_) {
              if (typeof _ == "string") return Tt(_, b);
              var S = Object.prototype.toString.call(_).slice(8, -1);
              if (S === "Object" && _.constructor && (S = _.constructor.name), S === "Map" || S === "Set") return Array.from(_);
              if (S === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(S)) return Tt(_, b);
            }
          }(m)) || R) {
            h && (m = h);
            var n = 0, s = function() {
            };
            return { s, n: function() {
              return n >= m.length ? { done: !0 } : { done: !1, value: m[n++] };
            }, e: function(_) {
              throw _;
            }, f: s };
          }
          throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
        }
        var u, l = !0, x = !1;
        return { s: function() {
          h = h.call(m);
        }, n: function() {
          var _ = h.next();
          return l = _.done, _;
        }, e: function(_) {
          x = !0, u = _;
        }, f: function() {
          try {
            l || h.return == null || h.return();
          } finally {
            if (x) throw u;
          }
        } };
      }
      function Tt(m, R) {
        (R == null || R > m.length) && (R = m.length);
        for (var h = 0, n = new Array(R); h < R; h++) n[h] = m[h];
        return n;
      }
      var we = { code_128_reader: xe, ean_reader: je, ean_5_reader: xt, ean_2_reader: yt, ean_8_reader: _t, code_39_reader: qe, code_39_vin_reader: Ye, codabar_reader: ve, upc_reader: St, upc_e_reader: Rt, i2of5_reader: bt, "2of5_reader": w, code_93_reader: pt, code_32_reader: ct }, tt = { registerReader: function(m, R) {
        we[m] = R;
      }, create: function(m, R) {
        var h = [];
        function n() {
          m.readers.forEach(function(_) {
            var b, S = {}, E = [];
            a()(_) === "object" ? (b = _.format, S = _.config) : typeof _ == "string" && (b = _), S.supplements && (E = S.supplements.map(function(W) {
              return new we[W]();
            }));
            try {
              var Q = new we[b](S, E);
              h.push(Q);
            } catch (W) {
              throw console.error("* Error constructing reader ", b, W), W;
            }
          });
        }
        function s(_) {
          var b, S = null, E = et.getBarcodeLine(R, _[0], _[1]);
          for (et.toBinaryLine(E), b = 0; b < h.length && S === null; b++) S = h[b].decodePattern(E.line);
          return S === null ? null : { codeResult: S, barcodeLine: E };
        }
        function u(_) {
          return l.apply(this, arguments);
        }
        function l() {
          return (l = P()(I.a.mark(function _(b) {
            var S, E, Q, W;
            return I.a.wrap(function(Y) {
              for (; ; ) switch (Y.prev = Y.next) {
                case 0:
                  S = null, E = nr(h), Y.prev = 2, E.s();
                case 4:
                  if ((Q = E.n()).done) {
                    Y.next = 14;
                    break;
                  }
                  if (!(W = Q.value).decodeImage) {
                    Y.next = 12;
                    break;
                  }
                  return Y.next = 9, W.decodeImage(b);
                case 9:
                  if (!(S = Y.sent)) {
                    Y.next = 12;
                    break;
                  }
                  return Y.abrupt("break", 14);
                case 12:
                  Y.next = 4;
                  break;
                case 14:
                  Y.next = 19;
                  break;
                case 16:
                  Y.prev = 16, Y.t0 = Y.catch(2), E.e(Y.t0);
                case 19:
                  return Y.prev = 19, E.f(), Y.finish(19);
                case 22:
                  return Y.abrupt("return", S);
                case 23:
                case "end":
                  return Y.stop();
              }
            }, _, null, [[2, 16, 19, 22]]);
          }))).apply(this, arguments);
        }
        function x(_) {
          var b, S, E = function(W) {
            return Math.sqrt(Math.pow(Math.abs(W[1].y - W[0].y), 2) + Math.pow(Math.abs(W[1].x - W[0].x), 2));
          }(b = function(W) {
            return [{ x: (W[1][0] - W[0][0]) / 2 + W[0][0], y: (W[1][1] - W[0][1]) / 2 + W[0][1] }, { x: (W[3][0] - W[2][0]) / 2 + W[2][0], y: (W[3][1] - W[2][1]) / 2 + W[2][1] }];
          }(_)), Q = Math.atan2(b[1].y - b[0].y, b[1].x - b[0].x);
          return (b = function(W, Y, ue) {
            function he(me) {
              var pe = me * Math.sin(Y), _e = me * Math.cos(Y);
              W[0].y -= pe, W[0].x -= _e, W[1].y += pe, W[1].x += _e;
            }
            for (he(ue); ue > 1 && (!R.inImageWithBorder(W[0]) || !R.inImageWithBorder(W[1])); ) he(-(ue -= Math.ceil(ue / 2)));
            return W;
          }(b, Q, Math.floor(0.1 * E))) === null ? null : ((S = s(b)) === null && (S = function(W, Y, ue) {
            var he, me, pe, _e = Math.sqrt(Math.pow(W[1][0] - W[0][0], 2) + Math.pow(W[1][1] - W[0][1], 2)), Re = null, ke = Math.sin(ue), We = Math.cos(ue);
            for (he = 1; he < 16 && Re === null; he++) pe = { y: (me = _e / 16 * he * (he % 2 == 0 ? -1 : 1)) * ke, x: me * We }, Y[0].y += pe.x, Y[0].x -= pe.y, Y[1].y += pe.x, Y[1].x -= pe.y, Re = s(Y);
            return Re;
          }(_, b, Q)), S === null ? null : { codeResult: S.codeResult, line: b, angle: Q, pattern: S.barcodeLine.line, threshold: S.barcodeLine.threshold });
        }
        return n(), { decodeFromBoundingBox: function(_) {
          return x(_);
        }, decodeFromBoundingBoxes: function(_) {
          var b, S, E = [], Q = m.multiple;
          for (b = 0; b < _.length; b++) {
            var W = _[b];
            if ((S = x(W) || {}).box = W, Q) E.push(S);
            else if (S.codeResult) return S;
          }
          return { barcodes: E };
        }, decodeFromImage: function(_) {
          return P()(I.a.mark(function b() {
            var S;
            return I.a.wrap(function(E) {
              for (; ; ) switch (E.prev = E.next) {
                case 0:
                  return E.next = 2, u(_);
                case 2:
                  return S = E.sent, E.abrupt("return", S);
                case 4:
                case "end":
                  return E.stop();
              }
            }, b);
          }))();
        }, registerReader: function(_, b) {
          if (we[_]) throw new Error("cannot register existing reader", _);
          we[_] = b;
        }, setReaders: function(_) {
          m.readers = _, h.length = 0, n();
        } };
      } }, Ie = /* @__PURE__ */ function() {
        var m = {};
        function R(s) {
          return m[s] || (m[s] = { subscribers: [] }), m[s];
        }
        function h(s, u) {
          s.async ? setTimeout(function() {
            s.callback(u);
          }, 4) : s.callback(u);
        }
        function n(s, u, l) {
          var x;
          if (typeof u == "function") x = { callback: u, async: l };
          else if (!(x = u).callback) throw new Error("Callback was not specified on options");
          R(s).subscribers.push(x);
        }
        return { subscribe: function(s, u, l) {
          return n(s, u, l);
        }, publish: function(s, u) {
          var l = R(s), x = l.subscribers;
          x.filter(function(_) {
            return !!_.once;
          }).forEach(function(_) {
            h(_, u);
          }), l.subscribers = x.filter(function(_) {
            return !_.once;
          }), l.subscribers.forEach(function(_) {
            h(_, u);
          });
        }, once: function(s, u) {
          var l = arguments.length > 2 && arguments[2] !== void 0 && arguments[2];
          n(s, { callback: u, async: l, once: !0 });
        }, unsubscribe: function(s, u) {
          if (s) {
            var l = R(s);
            l.subscribers = l && u ? l.subscribers.filter(function(x) {
              return x.callback !== u;
            }) : [];
          } else m = {};
        } };
      }(), Pt = e(63), Ot = e.n(Pt), or = e(64);
      function ir(m) {
        var R = function() {
          if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
          if (typeof Proxy == "function") return !0;
          try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
            })), !0;
          } catch {
            return !1;
          }
        }();
        return function() {
          var h, n = L()(m);
          if (R) {
            var s = L()(this).constructor;
            h = Reflect.construct(n, arguments, s);
          } else h = n.apply(this, arguments);
          return j()(this, h);
        };
      }
      var Ue, rt = function(m) {
        D()(h, m);
        var R = ir(h);
        function h(n, s) {
          var u;
          return te()(this, h), u = R.call(this, n), M()(k()(u), "code", void 0), u.code = s, Object.setPrototypeOf(k()(u), h.prototype), u;
        }
        return G()(h);
      }(e.n(or)()(Error)), Et = "This may mean that the user has declined camera access, or the browser does not support media APIs. If you are running in iOS, you must use Safari.";
      function ar() {
        try {
          return navigator.mediaDevices.enumerateDevices();
        } catch {
          var m = new rt("enumerateDevices is not defined. ".concat(Et), -1);
          return Promise.reject(m);
        }
      }
      function sr(m) {
        try {
          return navigator.mediaDevices.getUserMedia(m);
        } catch {
          var R = new rt("getUserMedia is not defined. ".concat(Et), -1);
          return Promise.reject(R);
        }
      }
      function Mt(m) {
        return new Promise(function(R, h) {
          var n = 10;
          (function s() {
            n > 0 ? m.videoWidth > 10 && m.videoHeight > 10 ? R() : window.setTimeout(s, 500) : h(new rt("Unable to play video stream. Is webcam working?", -1)), n--;
          })();
        });
      }
      function kt(m, R) {
        return nt.apply(this, arguments);
      }
      function nt() {
        return (nt = P()(I.a.mark(function m(R, h) {
          var n;
          return I.a.wrap(function(s) {
            for (; ; ) switch (s.prev = s.next) {
              case 0:
                return s.next = 2, sr(h);
              case 2:
                if (n = s.sent, Ue = n, !R) {
                  s.next = 11;
                  break;
                }
                return R.setAttribute("autoplay", "true"), R.setAttribute("muted", "true"), R.setAttribute("playsinline", "true"), R.srcObject = n, R.addEventListener("loadedmetadata", function() {
                  R.play().catch(function(u) {
                    console.warn("* Error while trying to play video stream:", u);
                  });
                }), s.abrupt("return", Mt(R));
              case 11:
                return s.abrupt("return", Promise.resolve());
              case 12:
              case "end":
                return s.stop();
            }
          }, m);
        }))).apply(this, arguments);
      }
      function cr(m) {
        var R = Ot()(m, ["width", "height", "facingMode", "aspectRatio", "deviceId"]);
        return m.minAspectRatio !== void 0 && m.minAspectRatio > 0 && (R.aspectRatio = m.minAspectRatio, console.log("WARNING: Constraint 'minAspectRatio' is deprecated; Use 'aspectRatio' instead")), m.facing !== void 0 && (R.facingMode = m.facing, console.log("WARNING: Constraint 'facing' is deprecated. Use 'facingMode' instead'")), R;
      }
      function ur() {
        var m = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, R = cr(m);
        return R && R.deviceId && R.facingMode && delete R.facingMode, Promise.resolve({ audio: !1, video: R });
      }
      function At() {
        return (At = P()(I.a.mark(function m() {
          var R;
          return I.a.wrap(function(h) {
            for (; ; ) switch (h.prev = h.next) {
              case 0:
                return h.next = 2, ar();
              case 2:
                return R = h.sent, h.abrupt("return", R.filter(function(n) {
                  return n.kind === "videoinput";
                }));
              case 4:
              case "end":
                return h.stop();
            }
          }, m);
        }))).apply(this, arguments);
      }
      function Ne() {
        if (!Ue) return null;
        var m = Ue.getVideoTracks();
        return m && m != null && m.length ? m[0] : null;
      }
      var Be = { requestedVideoElement: null, request: function(m, R) {
        return P()(I.a.mark(function h() {
          var n;
          return I.a.wrap(function(s) {
            for (; ; ) switch (s.prev = s.next) {
              case 0:
                return Be.requestedVideoElement = m, s.next = 3, ur(R);
              case 3:
                return n = s.sent, s.abrupt("return", kt(m, n));
              case 5:
              case "end":
                return s.stop();
            }
          }, h);
        }))();
      }, release: function() {
        var m = Ue && Ue.getVideoTracks();
        return Be.requestedVideoElement !== null && Be.requestedVideoElement.pause(), new Promise(function(R) {
          setTimeout(function() {
            m && m.length && m.forEach(function(h) {
              return h.stop();
            }), Ue = null, Be.requestedVideoElement = null, R();
          }, 0);
        });
      }, enumerateVideoDevices: function() {
        return At.apply(this, arguments);
      }, getActiveStreamLabel: function() {
        var m = Ne();
        return m ? m.label : "";
      }, getActiveTrack: Ne, disableTorch: function() {
        return P()(I.a.mark(function m() {
          var R;
          return I.a.wrap(function(h) {
            for (; ; ) switch (h.prev = h.next) {
              case 0:
                if (!(R = Ne())) {
                  h.next = 11;
                  break;
                }
                return h.prev = 2, h.next = 5, R.applyConstraints({ advanced: [{ torch: !1 }] });
              case 5:
                h.next = 11;
                break;
              case 7:
                throw h.prev = 7, h.t0 = h.catch(2), h.t0 instanceof OverconstrainedError && console.warn("quagga2/CameraAccess: Torch not supported on this device"), h.t0;
              case 11:
              case "end":
                return h.stop();
            }
          }, m, null, [[2, 7]]);
        }))();
      }, enableTorch: function() {
        return P()(I.a.mark(function m() {
          var R;
          return I.a.wrap(function(h) {
            for (; ; ) switch (h.prev = h.next) {
              case 0:
                if (!(R = Ne())) {
                  h.next = 11;
                  break;
                }
                return h.prev = 2, h.next = 5, R.applyConstraints({ advanced: [{ torch: !0 }] });
              case 5:
                h.next = 11;
                break;
              case 7:
                throw h.prev = 7, h.t0 = h.catch(2), h.t0 instanceof OverconstrainedError && console.warn("quagga2/CameraAccess: Torch not supported on this device"), h.t0;
              case 11:
              case "end":
                return h.stop();
            }
          }, m, null, [[2, 7]]);
        }))();
      } }, He = Be, Dt = { create: function(m) {
        var R, h = document.createElement("canvas"), n = h.getContext("2d", { willReadFrequently: !!m.willReadFrequently }), s = [], u = (R = m.capacity) !== null && R !== void 0 ? R : 20, l = m.capture === !0;
        function x(_) {
          return !!u && _ && !function(b, S) {
            return S && S.some(function(E) {
              return Object.keys(E).every(function(Q) {
                return E[Q] === b[Q];
              });
            });
          }(_, m.blacklist) && function(b, S) {
            return typeof S != "function" || S(b);
          }(_, m.filter);
        }
        return { addResult: function(_, b, S) {
          var E = {};
          x(S) && (u--, E.codeResult = S, l && (h.width = b.x, h.height = b.y, q.a.drawImage(_, b, n), E.frame = h.toDataURL()), s.push(E));
        }, getResults: function() {
          return s;
        } };
      } }, fr = { inputStream: { name: "Live", type: "LiveStream", constraints: { width: 640, height: 480, facingMode: "environment" }, area: { top: "0%", right: "0%", left: "0%", bottom: "0%" }, singleChannel: !1 }, locate: !0, numOfWorkers: 4, decoder: { readers: ["code_128_reader"] }, locator: { halfSample: !0, patchSize: "medium" } }, Me = e(5), Xe = e(10), jt = Math.PI / 180, lr = { create: function(m, R) {
        var h, n = {}, s = m.getConfig(), u = (Object(Xe.h)(m.getRealWidth(), m.getRealHeight()), m.getCanvasSize()), l = Object(Xe.h)(m.getWidth(), m.getHeight()), x = m.getTopRight(), _ = x.x, b = x.y, S = null, E = null, Q = s.willReadFrequently;
        return (h = R || document.createElement("canvas")).width = u.x, h.height = u.y, console.warn("*** frame_grabber_browser: willReadFrequently=", Q, "canvas=", h), S = h.getContext("2d", { willReadFrequently: !!Q }), E = new Uint8Array(l.x * l.y), n.attachData = function(W) {
          E = W;
        }, n.getData = function() {
          return E;
        }, n.grab = function() {
          var W, Y = s.halfSample, ue = m.getFrame(), he = ue, me = 0;
          if (he) {
            if (function(pe, _e) {
              pe.width !== _e.x && (pe.width = _e.x), pe.height !== _e.y && (pe.height = _e.y);
            }(h, u), s.type === "ImageStream" && (he = ue.img, ue.tags && ue.tags.orientation)) switch (ue.tags.orientation) {
              case 6:
                me = 90 * jt;
                break;
              case 8:
                me = -90 * jt;
            }
            return me !== 0 ? (S.translate(u.x / 2, u.y / 2), S.rotate(me), S.drawImage(he, -u.y / 2, -u.x / 2, u.y, u.x), S.rotate(-me), S.translate(-u.x / 2, -u.y / 2)) : S.drawImage(he, 0, 0, u.x, u.y), W = S.getImageData(_, b, l.x, l.y).data, Y ? Object(Xe.e)(W, l, E) : Object(Xe.c)(W, E, s), !0;
          }
          return !1;
        }, n.getSize = function() {
          return l;
        }, n;
      } }, dr = lr, Je = { 274: "orientation" }, It = Object.keys(Je).map(function(m) {
        return Je[m];
      });
      function pr(m) {
        return new Promise(function(R) {
          var h = new FileReader();
          h.onload = function(n) {
            return R(n.target.result);
          }, h.readAsArrayBuffer(m);
        });
      }
      function hr(m) {
        return new Promise(function(R, h) {
          var n = new XMLHttpRequest();
          n.open("GET", m, !0), n.responseType = "blob", n.onreadystatechange = function() {
            n.readyState !== XMLHttpRequest.DONE || n.status !== 200 && n.status !== 0 || R(this.response);
          }, n.onerror = h, n.send();
        });
      }
      function vr(m) {
        var R = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : It, h = new DataView(m), n = m.byteLength, s = R.reduce(function(l, x) {
          var _ = Object.keys(Je).filter(function(b) {
            return Je[b] === x;
          })[0];
          return _ && (l[_] = x), l;
        }, {}), u = 2;
        if (h.getUint8(0) !== 255 || h.getUint8(1) !== 216) return !1;
        for (; u < n; ) {
          if (h.getUint8(u) !== 255) return !1;
          if (h.getUint8(u + 1) === 225) return gr(h, u + 4, s);
          u += 2 + h.getUint16(u + 2);
        }
        return !1;
      }
      function gr(m, R, h) {
        if (function(l, x, _) {
          for (var b = "", S = x; S < x + _; S++) b += String.fromCharCode(l.getUint8(S));
          return b;
        }(m, R, 4) !== "Exif") return !1;
        var n, s = R + 6;
        if (m.getUint16(s) === 18761) n = !1;
        else {
          if (m.getUint16(s) !== 19789) return !1;
          n = !0;
        }
        if (m.getUint16(s + 2, !n) !== 42) return !1;
        var u = m.getUint32(s + 4, !n);
        return !(u < 8) && function(l, x, _, b, S) {
          for (var E = l.getUint16(_, !S), Q = {}, W = 0; W < E; W++) {
            var Y = _ + 12 * W + 2, ue = b[l.getUint16(Y, !S)];
            ue && (Q[ue] = mr(l, Y, x, _, S));
          }
          return Q;
        }(m, s, s + u, h, n);
      }
      function mr(m, R, h, n, s) {
        var u = m.getUint16(R + 2, !s), l = m.getUint32(R + 4, !s);
        switch (u) {
          case 3:
            if (l === 1) return m.getUint16(R + 8, !s);
        }
        return null;
      }
      var Lt = {};
      function yr(m, R) {
        m.onload = function() {
          R.loaded(this);
        };
      }
      Lt.load = function(m, R, h, n, s) {
        var u, l, x, _ = new Array(n), b = new Array(_.length);
        if (s === !1) _[0] = m;
        else for (u = 0; u < _.length; u++) x = h + u, _[u] = "".concat(m, "image-").concat("00".concat(x).slice(-3), ".jpg");
        for (b.notLoaded = [], b.addImage = function(S) {
          b.notLoaded.push(S);
        }, b.loaded = function(S) {
          for (var E = b.notLoaded, Q = 0; Q < E.length; Q++) if (E[Q] === S) {
            E.splice(Q, 1);
            for (var W = 0; W < _.length; W++) {
              var Y = _[W].substr(_[W].lastIndexOf("/"));
              if (S.src.lastIndexOf(Y) !== -1) {
                b[W] = { img: S };
                break;
              }
            }
            break;
          }
          E.length === 0 && (s === !1 ? function(ue) {
            var he = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : It;
            return /^blob:/i.test(ue) ? hr(ue).then(pr).then(function(me) {
              return vr(me, he);
            }) : Promise.resolve(null);
          }(m, ["orientation"]).then(function(ue) {
            b[0].tags = ue, R(b);
          }).catch(function(ue) {
            console.log(ue), R(b);
          }) : R(b));
        }, u = 0; u < _.length; u++) l = new Image(), b.addImage(l), yr(l, b), l.src = _[u];
      };
      var xr = Lt, zt = { createVideoStream: function(m) {
        console.warn("**** InputStreamBrowser createVideoStream");
        var R, h, n = null, s = ["canrecord", "ended"], u = {}, l = { x: 0, y: 0, type: "Point" }, x = { x: 0, y: 0, type: "XYSize" }, _ = { getRealWidth: function() {
          return m.videoWidth;
        }, getRealHeight: function() {
          return m.videoHeight;
        }, getWidth: function() {
          return R;
        }, getHeight: function() {
          return h;
        }, setWidth: function(b) {
          R = b;
        }, setHeight: function(b) {
          h = b;
        }, setInputStream: function(b) {
          n = b, this.setAttribute("src", b.src !== void 0 ? b.src : "");
        }, ended: function() {
          return m.ended;
        }, getConfig: function() {
          return n;
        }, setAttribute: function(b, S) {
          m && m.setAttribute(b, S);
        }, pause: function() {
          m.pause();
        }, play: function() {
          m.play();
        }, setCurrentTime: function(b) {
          var S;
          ((S = n) === null || S === void 0 ? void 0 : S.type) !== "LiveStream" && this.setAttribute("currentTime", b.toString());
        }, addEventListener: function(b, S, E) {
          s.indexOf(b) !== -1 ? (u[b] || (u[b] = []), u[b].push(S)) : m.addEventListener(b, S, E);
        }, clearEventHandlers: function() {
          s.forEach(function(b) {
            var S = u[b];
            S && S.length > 0 && S.forEach(function(E) {
              m.removeEventListener(b, E);
            });
          });
        }, trigger: function(b, S) {
          var E, Q, W, Y, ue, he = u[b];
          if (b === "canrecord" && (Y = m.videoWidth, ue = m.videoHeight, R = (Q = n) !== null && Q !== void 0 && Q.size ? Y / ue > 1 ? n.size : Math.floor(Y / ue * n.size) : Y, h = (W = n) !== null && W !== void 0 && W.size ? Y / ue > 1 ? Math.floor(ue / Y * n.size) : n.size : ue, x.x = R, x.y = h), he && he.length > 0) for (E = 0; E < he.length; E++) he[E].apply(_, S);
        }, setTopRight: function(b) {
          l.x = b.x, l.y = b.y;
        }, getTopRight: function() {
          return l;
        }, setCanvasSize: function(b) {
          x.x = b.x, x.y = b.y;
        }, getCanvasSize: function() {
          return x;
        }, getFrame: function() {
          return m;
        } };
        return _;
      }, createLiveStream: function(m) {
        console.warn("**** InputStreamBrowser createLiveStream"), m && m.setAttribute("autoplay", "true");
        var R = zt.createVideoStream(m);
        return R.ended = function() {
          return !1;
        }, R;
      }, createImageStream: function() {
        var m, R, h = null, n = 0, s = 0, u = 0, l = !0, x = !1, _ = null, b = 0, S = null, E = !1, Q = ["canrecord", "ended"], W = {}, Y = { x: 0, y: 0, type: "Point" }, ue = { x: 0, y: 0, type: "XYSize" };
        function he(pe, _e) {
          var Re, ke = W[pe];
          if (ke && ke.length > 0) for (Re = 0; Re < ke.length; Re++) ke[Re].apply(me, _e);
        }
        var me = { trigger: he, getWidth: function() {
          return m;
        }, getHeight: function() {
          return R;
        }, setWidth: function(pe) {
          m = pe;
        }, setHeight: function(pe) {
          R = pe;
        }, getRealWidth: function() {
          return n;
        }, getRealHeight: function() {
          return s;
        }, setInputStream: function(pe) {
          var _e;
          h = pe, pe.sequence === !1 ? (S = pe.src, b = 1) : (S = pe.src, b = pe.length), x = !1, xr.load(S, function(Re) {
            var ke, We;
            if (_ = Re, Re[0].tags && Re[0].tags.orientation) switch (Re[0].tags.orientation) {
              case 6:
              case 8:
                n = Re[0].img.height, s = Re[0].img.width;
                break;
              default:
                n = Re[0].img.width, s = Re[0].img.height;
            }
            else n = Re[0].img.width, s = Re[0].img.height;
            m = (ke = h) !== null && ke !== void 0 && ke.size ? n / s > 1 ? h.size : Math.floor(n / s * h.size) : n, R = (We = h) !== null && We !== void 0 && We.size ? n / s > 1 ? Math.floor(s / n * h.size) : h.size : s, ue.x = m, ue.y = R, x = !0, u = 0, setTimeout(function() {
              he("canrecord", []);
            }, 0);
          }, 1, b, (_e = h) === null || _e === void 0 ? void 0 : _e.sequence);
        }, ended: function() {
          return E;
        }, setAttribute: function() {
        }, getConfig: function() {
          return h;
        }, pause: function() {
          l = !0;
        }, play: function() {
          l = !1;
        }, setCurrentTime: function(pe) {
          u = pe;
        }, addEventListener: function(pe, _e) {
          Q.indexOf(pe) !== -1 && (W[pe] || (W[pe] = []), W[pe].push(_e));
        }, clearEventHandlers: function() {
          Object.keys(W).forEach(function(pe) {
            return delete W[pe];
          });
        }, setTopRight: function(pe) {
          Y.x = pe.x, Y.y = pe.y;
        }, getTopRight: function() {
          return Y;
        }, setCanvasSize: function(pe) {
          ue.x = pe.x, ue.y = pe.y;
        }, getCanvasSize: function() {
          return ue;
        }, getFrame: function() {
          var pe, _e;
          return x ? (l || (pe = (_e = _) === null || _e === void 0 ? void 0 : _e[u], u < b - 1 ? u++ : setTimeout(function() {
            E = !0, he("ended", []);
          }, 0)), pe) : null;
        } };
        return me;
      } }, _r = zt, ot = e(23), br = G()(function m() {
        te()(this, m), M()(this, "config", void 0), M()(this, "inputStream", void 0), M()(this, "framegrabber", void 0), M()(this, "inputImageWrapper", void 0), M()(this, "stopped", !1), M()(this, "boxSize", void 0), M()(this, "resultCollector", void 0), M()(this, "decoder", void 0), M()(this, "workerPool", []), M()(this, "onUIThread", !0), M()(this, "canvasContainer", new f());
      }), Ut = G()(function m() {
        te()(this, m), M()(this, "image", void 0), M()(this, "overlay", void 0);
      }), f = G()(function m() {
        te()(this, m), M()(this, "ctx", void 0), M()(this, "dom", void 0), this.ctx = new Ut(), this.dom = new Ut();
      });
      function v(m) {
        if (typeof document > "u") return null;
        if (m instanceof HTMLElement && m.nodeName && m.nodeType === 1) return m;
        var R = typeof m == "string" ? m : "#interactive.viewport";
        return document.querySelector(R);
      }
      function C(m, R, h) {
        var n = function(u, l) {
          var x = document.querySelector(u);
          return x || ((x = document.createElement("canvas")).className = l), x;
        }(m, R);
        console.warn("* initCanvas getCanvasAndContext");
        var s = n.getContext("2d", { willReadFrequently: h.willReadFrequently });
        return { canvas: n, context: s };
      }
      function A(m) {
        var R, h, n, s, u, l, x = v(m == null || (R = m.config) === null || R === void 0 || (h = R.inputStream) === null || h === void 0 ? void 0 : h.target), _ = m == null || (n = m.config) === null || n === void 0 || (s = n.inputStream) === null || s === void 0 ? void 0 : s.type;
        if (!_) return null;
        var b = function(E, Q) {
          var W = Q.willReadFrequently;
          if (typeof document < "u") {
            var Y = C("canvas.imgBuffer", "imgBuffer", { willReadFrequently: W }), ue = C("canvas.drawingBuffer", "drawingBuffer", { willReadFrequently: W });
            return Y.canvas.width = ue.canvas.width = E.x, Y.canvas.height = ue.canvas.height = E.y, { dom: { image: Y.canvas, overlay: ue.canvas }, ctx: { image: Y.context, overlay: ue.context } };
          }
          return null;
        }(m.inputStream.getCanvasSize(), { willReadFrequently: !(m == null || (u = m.config) === null || u === void 0 || (l = u.inputStream) === null || l === void 0 || !l.willReadFrequently) });
        if (!b) return { dom: { image: null, overlay: null }, ctx: { image: null, overlay: null } };
        var S = b.dom;
        return typeof document < "u" && x && (_ !== "ImageStream" || x.contains(S.image) || x.appendChild(S.image), x.contains(S.overlay) || x.appendChild(S.overlay)), b;
      }
      function F(m, R) {
        var h = Object.keys(m);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(m);
          R && (n = n.filter(function(s) {
            return Object.getOwnPropertyDescriptor(m, s).enumerable;
          })), h.push.apply(h, n);
        }
        return h;
      }
      function H(m) {
        for (var R = 1; R < arguments.length; R++) {
          var h = arguments[R] != null ? arguments[R] : {};
          R % 2 ? F(Object(h), !0).forEach(function(n) {
            M()(m, n, h[n]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(m, Object.getOwnPropertyDescriptors(h)) : F(Object(h)).forEach(function(n) {
            Object.defineProperty(m, n, Object.getOwnPropertyDescriptor(h, n));
          });
        }
        return m;
      }
      Me.a.setMatrixArrayType(Array);
      var oe = [];
      function le(m) {
        return H(H({}, m), {}, { inputStream: H(H({}, m.inputStream), {}, { target: null }) });
      }
      function ge(m) {
        if (m) {
          var R = m().default;
          if (!R) return void self.postMessage({ event: "error", message: "Quagga could not be created" });
        }
        var h;
        function n(u) {
          self.postMessage({ event: "processed", imageData: h.data, result: u }, [h.data.buffer]);
        }
        function s() {
          self.postMessage({ event: "initialized", imageData: h.data }, [h.data.buffer]);
        }
        self.onmessage = function(u) {
          if (u.data.cmd === "init") {
            var l = u.data.config;
            l.numOfWorkers = 0, h = new R.ImageWrapper({ x: u.data.size.x, y: u.data.size.y }, new Uint8Array(u.data.imageData)), R.init(l, s, h), R.onProcessed(n);
          } else u.data.cmd === "process" ? (h.data = new Uint8Array(u.data.imageData), R.start()) : u.data.cmd === "setReaders" ? R.setReaders(u.data.readers) : u.data.cmd === "registerReader" && R.registerReader(u.data.name, u.data.reader);
        };
      }
      function Ce(m, R, h) {
        var n, s, u = (typeof __factorySource__ < "u" && (s = __factorySource__), n = new Blob(["(" + ge.toString() + ")(" + s + ");"], { type: "text/javascript" }), window.URL.createObjectURL(n)), l = { worker: new Worker(u), imageData: new Uint8Array(R.getWidth() * R.getHeight()), busy: !0 };
        l.worker.onmessage = function(x) {
          x.data.event === "initialized" ? (URL.revokeObjectURL(u), l.busy = !1, l.imageData = new Uint8Array(x.data.imageData), h(l)) : x.data.event === "processed" ? (l.imageData = new Uint8Array(x.data.imageData), l.busy = !1, typeof publishResult < "u" && publishResult(x.data.result, l.imageData)) : x.data.event;
        }, l.worker.postMessage({ cmd: "init", size: { x: R.getWidth(), y: R.getHeight() }, imageData: l.imageData, config: le(m) }, [l.imageData.buffer]);
      }
      function Te(m, R, h, n) {
        var s = m - oe.length;
        if (s === 0 && n) n();
        else if (s < 0)
          oe.slice(s).forEach(function(x) {
            x.worker.terminate();
          }), oe = oe.slice(0, s), n && n();
        else {
          var u = function(x) {
            oe.push(x), oe.length >= m && n && n();
          };
          if (R) for (var l = 0; l < s; l++) Ce(R, h, u);
        }
      }
      function Ae(m, R, h) {
        for (var n = m.length; n--; ) m[n][0] += R, m[n][1] += h;
      }
      Me.a.setMatrixArrayType(Array);
      var De = function() {
        function m() {
          var n = this;
          te()(this, m), M()(this, "context", new br()), M()(this, "canRecord", function(s) {
            var u;
            n.context.config && (ot.a.checkImageConstraints(n.context.inputStream, (u = n.context.config) === null || u === void 0 ? void 0 : u.locator), n.initCanvas(), n.context.framegrabber = dr.create(n.context.inputStream, n.context.canvasContainer.dom.image), n.context.config.numOfWorkers === void 0 && (n.context.config.numOfWorkers = 0), Te(n.context.config.numOfWorkers, n.context.config, n.context.inputStream, function() {
              var l;
              ((l = n.context.config) === null || l === void 0 ? void 0 : l.numOfWorkers) === 0 && n.initializeData(), n.ready(s);
            }));
          }), M()(this, "update", function() {
            if (n.context.onUIThread) {
              var s, u = (x = n.context.framegrabber, oe.length ? !!(_ = oe.filter(function(b) {
                return !b.busy;
              })[0]) && (x.attachData(_.imageData), x.grab() && (_.busy = !0, _.worker.postMessage({ cmd: "process", imageData: _.imageData }, [_.imageData.buffer])), !0) : null);
              u || (n.context.framegrabber.attachData((s = n.context.inputImageWrapper) === null || s === void 0 ? void 0 : s.data), n.context.framegrabber.grab() && (u || n.locateAndDecode()));
            } else {
              var l;
              n.context.framegrabber.attachData((l = n.context.inputImageWrapper) === null || l === void 0 ? void 0 : l.data), n.context.framegrabber.grab(), n.locateAndDecode();
            }
            var x, _;
          });
        }
        var R, h;
        return G()(m, [{ key: "initBuffers", value: function(n) {
          if (this.context.config) {
            var s = function(x, _, b) {
              var S = _ || new g.a({ x: x.getWidth(), y: x.getHeight(), type: "XYSize" }), E = [Me.c.clone([0, 0]), Me.c.clone([0, S.size.y]), Me.c.clone([S.size.x, S.size.y]), Me.c.clone([S.size.x, 0])];
              return ot.a.init(S, b), { inputImageWrapper: S, boxSize: E };
            }(this.context.inputStream, n, this.context.config.locator), u = s.inputImageWrapper, l = s.boxSize;
            this.context.inputImageWrapper = u, this.context.boxSize = l;
          }
        } }, { key: "initializeData", value: function(n) {
          this.context.config && (this.initBuffers(n), this.context.decoder = tt.create(this.context.config.decoder, this.context.inputImageWrapper));
        } }, { key: "getViewPort", value: function() {
          return this.context.config && this.context.config.inputStream ? v(this.context.config.inputStream.target) : null;
        } }, { key: "ready", value: function(n) {
          this.context.inputStream.play(), n();
        } }, { key: "initCanvas", value: function() {
          var n = A(this.context);
          if (n) {
            var s = n.ctx, u = n.dom;
            this.context.canvasContainer.dom.image = u.image, this.context.canvasContainer.dom.overlay = u.overlay, this.context.canvasContainer.ctx.image = s.image, this.context.canvasContainer.ctx.overlay = s.overlay;
          }
        } }, { key: "initInputStream", value: function(n) {
          if (this.context.config && this.context.config.inputStream) {
            var s = this.context.config.inputStream, u = s.type, l = s.constraints, x = function() {
              var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "LiveStream", E = arguments.length > 1 ? arguments[1] : void 0, Q = arguments.length > 2 ? arguments[2] : void 0;
              switch (S) {
                case "VideoStream":
                  var W = document.createElement("video");
                  return { video: W, inputStream: Q.createVideoStream(W) };
                case "ImageStream":
                  return { inputStream: Q.createImageStream() };
                case "LiveStream":
                  var Y = null;
                  return E && ((Y = E.querySelector("video")) || (Y = document.createElement("video"), E.appendChild(Y))), { video: Y, inputStream: Q.createLiveStream(Y) };
                default:
                  return console.error("* setupInputStream invalid type ".concat(S)), { video: null, inputStream: null };
              }
            }(u, this.getViewPort(), _r), _ = x.video, b = x.inputStream;
            u === "LiveStream" && _ && He.request(_, l).then(function() {
              return b.trigger("canrecord");
            }).catch(function(S) {
              return n(S);
            }), b && (b.setAttribute("preload", "auto"), b.setInputStream(this.context.config.inputStream), b.addEventListener("canrecord", this.canRecord.bind(void 0, n))), this.context.inputStream = b;
          }
        } }, { key: "getBoundingBoxes", value: function() {
          var n;
          return (n = this.context.config) !== null && n !== void 0 && n.locate ? ot.a.locate() : [[Me.c.clone(this.context.boxSize[0]), Me.c.clone(this.context.boxSize[1]), Me.c.clone(this.context.boxSize[2]), Me.c.clone(this.context.boxSize[3])]];
        } }, { key: "transformResult", value: function(n) {
          var s = this, u = this.context.inputStream.getTopRight(), l = u.x, x = u.y;
          if ((l !== 0 || x !== 0) && (n.barcodes && n.barcodes.forEach(function(b) {
            return s.transformResult(b);
          }), n.line && n.line.length === 2 && function(b, S, E) {
            b[0].x += S, b[0].y += E, b[1].x += S, b[1].y += E;
          }(n.line, l, x), n.box && Ae(n.box, l, x), n.boxes && n.boxes.length > 0)) for (var _ = 0; _ < n.boxes.length; _++) Ae(n.boxes[_], l, x);
        } }, { key: "addResult", value: function(n, s) {
          var u = this;
          s && this.context.resultCollector && (n.barcodes ? n.barcodes.filter(function(l) {
            return l.codeResult;
          }).forEach(function(l) {
            return u.addResult(l, s);
          }) : n.codeResult && this.context.resultCollector.addResult(s, this.context.inputStream.getCanvasSize(), n.codeResult));
        } }, { key: "hasCodeResult", value: function(n) {
          return !(!n || !(n.barcodes ? n.barcodes.some(function(s) {
            return s.codeResult;
          }) : n.codeResult));
        } }, { key: "publishResult", value: function() {
          var n, s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null, u = arguments.length > 1 ? arguments[1] : void 0, l = s;
          s && this.context.onUIThread && (this.transformResult(s), this.addResult(s, u), l = (s == null || (n = s.barcodes) === null || n === void 0 ? void 0 : n.length) > 0 ? s.barcodes : s), Ie.publish("processed", l), this.hasCodeResult(s) && Ie.publish("detected", l);
        } }, { key: "locateAndDecode", value: (h = P()(I.a.mark(function n() {
          var s, u, l, x, _;
          return I.a.wrap(function(b) {
            for (; ; ) switch (b.prev = b.next) {
              case 0:
                if (!(s = this.getBoundingBoxes())) {
                  b.next = 12;
                  break;
                }
                return b.next = 4, this.context.decoder.decodeFromBoundingBoxes(s);
              case 4:
                if (b.t0 = b.sent, b.t0) {
                  b.next = 7;
                  break;
                }
                b.t0 = {};
              case 7:
                (l = b.t0).boxes = s, this.publishResult(l, (u = this.context.inputImageWrapper) === null || u === void 0 ? void 0 : u.data), b.next = 16;
                break;
              case 12:
                return b.next = 14, this.context.decoder.decodeFromImage(this.context.inputImageWrapper);
              case 14:
                (x = b.sent) ? this.publishResult(x, (_ = this.context.inputImageWrapper) === null || _ === void 0 ? void 0 : _.data) : this.publishResult();
              case 16:
              case "end":
                return b.stop();
            }
          }, n, this);
        })), function() {
          return h.apply(this, arguments);
        }) }, { key: "startContinuousUpdate", value: function() {
          var n, s = this, u = null, l = 1e3 / (((n = this.context.config) === null || n === void 0 ? void 0 : n.frequency) || 60);
          this.context.stopped = !1;
          var x = this.context;
          (function _(b) {
            u = u || b, x.stopped || (b >= u && (u += l, s.update()), window.requestAnimationFrame(_));
          })(performance.now());
        } }, { key: "start", value: function() {
          var n, s;
          this.context.onUIThread && ((n = this.context.config) === null || n === void 0 || (s = n.inputStream) === null || s === void 0 ? void 0 : s.type) === "LiveStream" ? this.startContinuousUpdate() : this.update();
        } }, { key: "stop", value: (R = P()(I.a.mark(function n() {
          var s;
          return I.a.wrap(function(u) {
            for (; ; ) switch (u.prev = u.next) {
              case 0:
                if (this.context.stopped = !0, Te(0), (s = this.context.config) === null || s === void 0 || !s.inputStream || this.context.config.inputStream.type !== "LiveStream") {
                  u.next = 6;
                  break;
                }
                return u.next = 5, He.release();
              case 5:
                this.context.inputStream.clearEventHandlers();
              case 6:
              case "end":
                return u.stop();
            }
          }, n, this);
        })), function() {
          return R.apply(this, arguments);
        }) }, { key: "setReaders", value: function(n) {
          this.context.decoder && this.context.decoder.setReaders(n), function(s) {
            oe.forEach(function(u) {
              return u.worker.postMessage({ cmd: "setReaders", readers: s });
            });
          }(n);
        } }, { key: "registerReader", value: function(n, s) {
          tt.registerReader(n, s), this.context.decoder && this.context.decoder.registerReader(n, s), function(u, l) {
            oe.forEach(function(x) {
              return x.worker.postMessage({ cmd: "registerReader", name: u, reader: l });
            });
          }(n, s);
        } }]), m;
      }(), ze = new De(), Qe = ze.context, it = { init: function(m, R, h) {
        var n, s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ze;
        return R || (n = new Promise(function(u, l) {
          R = function(x) {
            x ? l(x) : u();
          };
        })), s.context.config = p()({}, fr, m), s.context.config.numOfWorkers > 0 && (s.context.config.numOfWorkers = 0), h ? (s.context.onUIThread = !1, s.initializeData(h), R && R()) : s.initInputStream(R), n;
      }, start: function() {
        return ze.start();
      }, stop: function() {
        return ze.stop();
      }, pause: function() {
        Qe.stopped = !0;
      }, onDetected: function(m) {
        m && (typeof m == "function" || a()(m) === "object" && m.callback) ? Ie.subscribe("detected", m) : console.trace("* warning: Quagga.onDetected called with invalid callback, ignoring");
      }, offDetected: function(m) {
        Ie.unsubscribe("detected", m);
      }, onProcessed: function(m) {
        m && (typeof m == "function" || a()(m) === "object" && m.callback) ? Ie.subscribe("processed", m) : console.trace("* warning: Quagga.onProcessed called with invalid callback, ignoring");
      }, offProcessed: function(m) {
        Ie.unsubscribe("processed", m);
      }, setReaders: function(m) {
        m ? ze.setReaders(m) : console.trace("* warning: Quagga.setReaders called with no readers, ignoring");
      }, registerReader: function(m, R) {
        m ? R ? ze.registerReader(m, R) : console.trace("* warning: Quagga.registerReader called with no reader, ignoring") : console.trace("* warning: Quagga.registerReader called with no name, ignoring");
      }, registerResultCollector: function(m) {
        m && typeof m.addResult == "function" && (Qe.resultCollector = m);
      }, get canvas() {
        return Qe.canvasContainer;
      }, decodeSingle: function(m, R) {
        var h = this, n = new De();
        return (m = p()({ inputStream: { type: "ImageStream", sequence: !1, size: 800, src: m.src }, numOfWorkers: 1, locator: { halfSample: !1 } }, m)).numOfWorkers > 0 && (m.numOfWorkers = 0), m.numOfWorkers > 0 && (typeof Blob > "u" || typeof Worker > "u") && (console.warn("* no Worker and/or Blob support - forcing numOfWorkers to 0"), m.numOfWorkers = 0), new Promise(function(s, u) {
          try {
            h.init(m, function() {
              Ie.once("processed", function(l) {
                n.stop(), R && R.call(null, l), s(l);
              }, !0), n.start();
            }, null, n);
          } catch (l) {
            u(l);
          }
        });
      }, get default() {
        return it;
      }, Readers: r, CameraAccess: He, ImageDebug: q.a, ImageWrapper: g.a, ResultCollector: Dt };
      o.default = it;
    }]).default;
  });
})(yn);
var Un = yn.exports;
const Pe = /* @__PURE__ */ vn(Un), xn = (d) => (On("data-v-52e3de8a"), d = d(), En(), d), Fn = {
  id: "interactive",
  class: "viewport scanner"
}, wn = /* @__PURE__ */ xn(() => /* @__PURE__ */ zr("video", null, null, -1)), Nn = /* @__PURE__ */ xn(() => /* @__PURE__ */ zr("canvas", { class: "drawingBuffer" }, null, -1)), Bn = [
  wn,
  Nn
], Wn = /* @__PURE__ */ bn({
  __name: "QuaggaScanner",
  props: {
    onDetected: { type: Function, default: (d) => {
      console.log("detected: ", d);
    } },
    onProcessed: { type: Function, default: (d) => {
      let y = Pe.canvas.ctx.overlay, t = Pe.canvas.dom.overlay;
      d && (d.boxes && (y.clearRect(
        0,
        0,
        parseInt(t == null ? void 0 : t.getAttribute("width")),
        parseInt(t == null ? void 0 : t.getAttribute("height"))
      ), d.boxes.filter((o) => o !== d.box).forEach((o) => {
        Pe.ImageDebug.drawPath(o, { x: 0, y: 1 }, y, {
          color: "green",
          lineWidth: 2
        });
      })), d.box && Pe.ImageDebug.drawPath(d.box, { x: 0, y: 1 }, y, {
        color: "#00F",
        lineWidth: 2
      }), d.codeResult && d.codeResult.code && Pe.ImageDebug.drawPath(
        d.line,
        { x: "x", y: "y" },
        y,
        { color: "red", lineWidth: 3 }
      ));
    } },
    type: { default: "LiveStream" },
    readerTypes: { default: () => ["code_128_reader"] },
    constraints: { default: () => ({
      width: 640,
      height: 480,
      aspectRatio: {
        min: 0,
        max: 1
      }
    }) },
    locate: { type: Boolean, default: !0 },
    numOfWorkers: { default: 4 },
    frequency: { default: 10 },
    facingMode: { default: "environment" }
  },
  setup(d) {
    const y = d, t = Cn({
      inputStream: {
        type: y.type,
        constraints: y.constraints
      },
      locator: {
        patchSize: "medium",
        halfSample: !0
      },
      numOfWorkers: y.numOfWorkers,
      frequency: y.frequency,
      decoder: {
        readers: y.readerTypes
      },
      locate: y.locate
    });
    return Mr(
      () => y.onDetected,
      (o, e) => {
        e && Pe.offDetected(e), o && Pe.onDetected(o);
      }
    ), Mr(
      () => y.onProcessed,
      (o, e) => {
        e && Pe.offProcessed(
          e
        ), o && Pe.onProcessed(o);
      }
    ), Rn(() => {
      Pe.init(t, (o) => {
        if (o)
          return console.error(o);
        Pe.start();
      }), Pe.onDetected(y.onDetected), Pe.onProcessed(
        y.onProcessed
      );
    }), Sn(() => {
      y.onDetected && Pe.offDetected(y.onDetected), y.onProcessed && Pe.offProcessed(
        y.onProcessed
      ), Pe.stop();
    }), (o, e) => (Tn(), Pn("div", Fn, Bn));
  }
}), Gn = (d, y) => {
  const t = d.__vccOpts || d;
  for (const [o, e] of y)
    t[o] = e;
  return t;
}, qn = /* @__PURE__ */ Gn(Wn, [["__scopeId", "data-v-52e3de8a"]]), Hn = {
  install: (d) => {
    d.component("QuaggaScanner", qn);
  }
};
export {
  qn as QuaggaScanner,
  Hn as default
};
