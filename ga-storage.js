/**
 * 게임 접근성 측정 도구 - 통합 저장소 유틸
 * sessionStorage + localStorage 동시 저장 (브라우저 종료 시에도 복구 가능)
 */
(function (global) {
  var SESSION_KEY = "ga_current_session";
  var SESSION_BY_ID_PREFIX = "ga_session_";
  var PROGRESS_PREFIX = "ga_progress_";
  var DRAFT_VISION = "ga_vision_draft";

  function safeGet(storage, key) {
    try {
      var raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function safeSet(storage, key, value) {
    try {
      storage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    } catch (e) {}
  }

  function recordedAtMs(obj) {
    if (!obj || typeof obj !== "object") return 0;
    var t = obj.recordedAt;
    if (t) {
      var ms = Date.parse(t);
      return isNaN(ms) ? 0 : ms;
    }
    return 0;
  }

  /** 동일 카테고리 내 한 항목(테스트 결과)끼리 더 최신·더 완전한 쪽 선택 */
  function pickRicherResult(va, vb) {
    if (va == null || va === undefined) return vb;
    if (vb == null || vb === undefined) return va;
    if (Array.isArray(va) && Array.isArray(vb)) {
      if (vb.length !== va.length) return vb.length > va.length ? vb : va;
      return vb;
    }
    if (typeof va !== "object" || typeof vb !== "object") return vb;
    var tb = recordedAtMs(vb);
    var ta = recordedAtMs(va);
    if (tb > ta) return vb;
    if (ta > tb) return va;
    try {
      return JSON.stringify(vb).length > JSON.stringify(va).length ? vb : va;
    } catch (e) {
      return vb;
    }
  }

  function mergeCategoryObjects(a, b) {
    a = a && typeof a === "object" ? a : {};
    b = b && typeof b === "object" ? b : {};
    var keys = {};
    Object.keys(a).forEach(function (k) {
      keys[k] = true;
    });
    Object.keys(b).forEach(function (k) {
      keys[k] = true;
    });
    var out = {};
    Object.keys(keys).forEach(function (k) {
      out[k] = pickRicherResult(a[k], b[k]);
    });
    return out;
  }

  /** localStorage·sessionStorage 각각의 user_data를 합쳐 유실 방지 */
  function mergeUserDataDeep(udL, udR) {
    var cats = [
      "vision_results",
      "motor_results",
      "cognitive_results",
      "hearing_results",
      "color_results",
      "audio_results"
    ];
    var out = {};
    cats.forEach(function (cat) {
      out[cat] = mergeCategoryObjects(
        udL && udL[cat],
        udR && udR[cat]
      );
    });
    return out;
  }

  /**
   * sessionStorage가 오래된 탭 스냅샷일 수 있어, localStorage와 병합합니다.
   * 프로필 필드는 localStorage 쪽이 덮어쓰도록 해 영구 저장본을 우선합니다.
   */
  function mergeTwoStoredSessions(ssVal, lsVal) {
    if (!ssVal && !lsVal) return null;
    if (!ssVal) return lsVal;
    if (!lsVal) return ssVal;
    var profile = Object.assign({}, ssVal, lsVal);
    profile.user_data = mergeUserDataDeep(ssVal.user_data, lsVal.user_data);
    return profile;
  }

  function readSession() {
    var s = safeGet(sessionStorage, SESSION_KEY);
    var l = safeGet(localStorage, SESSION_KEY);
    var merged = mergeTwoStoredSessions(s, l);
    if (merged && typeof merged === "object" && Object.keys(merged).length > 0) {
      safeSet(sessionStorage, SESSION_KEY, merged);
      safeSet(localStorage, SESSION_KEY, merged);
      var id = merged.userId || merged.id;
      if (id) {
        safeSet(localStorage, SESSION_BY_ID_PREFIX + id, merged);
      }
      return merged;
    }
    var u = safeGet(sessionStorage, "user_data");
    if (u && typeof u === "object" && Object.keys(u).length > 0) return u;
    return {};
  }

  function writeSession(merge) {
    var current = readSession();
    // user_data 객체가 없으면 생성
    if (!current.user_data) {
      current.user_data = {};
    }
    // merge 객체의 속성을 user_data 구조로 변환
    var next = Object.assign({}, current);
    if (typeof merge === "object" && merge !== null) {
      // cognitive, motor, vision, audio를 user_data.[카테고리]_results로 변환
      if (merge.cognitive) {
        next.user_data.cognitive_results = Object.assign({}, next.user_data.cognitive_results || {}, merge.cognitive);
        delete merge.cognitive;
      }
      if (merge.motor) {
        next.user_data.motor_results = Object.assign({}, next.user_data.motor_results || {}, merge.motor);
        delete merge.motor;
      }
      if (merge.vision) {
        next.user_data.vision_results = Object.assign({}, next.user_data.vision_results || {}, merge.vision);
        delete merge.vision;
      }
      if (merge.audio) {
        next.user_data.audio_results = Object.assign({}, next.user_data.audio_results || {}, merge.audio);
        delete merge.audio;
      }
      if (merge.hearing) {
        next.user_data.hearing_results = Object.assign({}, next.user_data.hearing_results || {}, merge.hearing);
        delete merge.hearing;
      }
      if (merge.color) {
        next.user_data.color_results = Object.assign({}, next.user_data.color_results || {}, merge.color);
        delete merge.color;
      }
      // 나머지 속성은 그대로 병합 (userId, disabilityType 등)
      next = Object.assign({}, next, merge);
    }
    safeSet(sessionStorage, SESSION_KEY, next);
    safeSet(localStorage, SESSION_KEY, next);
    var id = next.userId || next.id;
    if (id) {
      safeSet(localStorage, SESSION_BY_ID_PREFIX + id, next);
    }
    return next;
  }

  function readSessionById(userId) {
    if (!userId) return null;
    return safeGet(localStorage, SESSION_BY_ID_PREFIX + userId);
  }

  function restoreSessionById(userId) {
    var data = readSessionById(userId);
    if (data) {
      safeSet(sessionStorage, SESSION_KEY, data);
      safeSet(localStorage, SESSION_KEY, data);
      return true;
    }
    return false;
  }

  function _progressKey(key, userId) {
    return userId ? PROGRESS_PREFIX + userId + "_" + key : PROGRESS_PREFIX + key;
  }

  function readProgress(key) {
    var session = readSession();
    var userId = session.userId || session.id || null;
    var storageKey = _progressKey(key, userId);
    var stored = safeGet(sessionStorage, storageKey) || safeGet(localStorage, storageKey);
    if (!stored) return null;
    return stored;
  }

  function writeProgress(key, data) {
    var session = readSession();
    var userId = session.userId || session.id || null;
    var payload = typeof data === "object" && data !== null ? Object.assign({}, data) : data;
    if (userId && typeof payload === "object") payload.userId = userId;
    var storageKey = _progressKey(key, userId);
    safeSet(sessionStorage, storageKey, payload);
    safeSet(localStorage, storageKey, payload);
  }

  function readDraftVision() {
    var s = safeGet(sessionStorage, DRAFT_VISION);
    if (s) return s;
    var l = safeGet(localStorage, DRAFT_VISION);
    if (l) {
      safeSet(sessionStorage, DRAFT_VISION, l);
      return l;
    }
    return { font: null, fovRounds: [] };
  }

  function writeDraftVision(data) {
    safeSet(sessionStorage, DRAFT_VISION, data);
    safeSet(localStorage, DRAFT_VISION, data);
  }

  function clearDraftVision() {
    try {
      sessionStorage.removeItem(DRAFT_VISION);
      localStorage.removeItem(DRAFT_VISION);
    } catch (e) {}
  }

  function clearAllProgress() {
    var keys = ["visual", "motor", "audio", "color", "cognitive"];
    var session = readSession();
    var userId = session.userId || session.id || null;
    keys.forEach(function(k) {
      try {
        var sk = _progressKey(k, userId);
        sessionStorage.removeItem(sk);
        localStorage.removeItem(sk);
        sessionStorage.removeItem(PROGRESS_PREFIX + k);
        localStorage.removeItem(PROGRESS_PREFIX + k);
      } catch (e) {}
    });
  }

  /** hub.html 진행률 바와 동일한 완료 판정 (user_data 기준, *_hub.html와 맞춤) */
  function countVisualTestsDone(ud) {
    var v = (ud && ud.vision_results) || {};
    var n = 0;
    if (v.reactionTime && v.reactionTime.trials && v.reactionTime.trials.length >= 4) n++;
    if (v.fontReadability && v.fontReadability.minFontSize) n++;
    if (v.aimTrainer && v.aimTrainer.targets && v.aimTrainer.targets.length >= 15) n++;
    if (Array.isArray(v.fovResults) && v.fovResults.length > 0) n++;
    else if (v.fovResults && typeof v.fovResults === "object" && Object.keys(v.fovResults).length > 0) n++;
    if (v.contrastSensitivity && v.contrastSensitivity.contrast_threshold != null) n++;
    return n;
  }

  function countMotorTestsDone(ud) {
    var m = (ud && ud.motor_results) || {};
    var n = 0;
    if (m.reactionTime && m.reactionTime.trials && m.reactionTime.trials.length >= 4) n++;
    if (m.aimTrainer && m.aimTrainer.targets && m.aimTrainer.targets.length >= 15) n++;
    if (m.holdDuration && m.holdDuration.keyboard && m.holdDuration.mouse) n++;
    if (m.simultaneousInput && m.simultaneousInput.maxKeys !== undefined) n++;
    if (m.precision && m.precision.averageError !== undefined) n++;
    if (m.burstSpeed && m.burstSpeed.keyboard && m.burstSpeed.mouse) n++;
    if (m.fatigue && m.fatigue.fatigueIndex !== undefined) n++;
    if (m.switching_latency && m.switching_latency.trials && m.switching_latency.trials.length >= 8) n++;
    return n;
  }

  function countAudioTestsDone(ud) {
    var h = (ud && ud.hearing_results) || {};
    var n = 0;
    if (h.reactionTime && h.reactionTime.trials && h.reactionTime.trials.length >= 4) n++;
    if (Boolean(h.hearingInputSaved && h.source) && typeof h.overallDb === "number" && !isNaN(h.overallDb)) n++;
    if (h.speechClarityTest && h.speechClarityPercent != null) n++;
    if (h.articulationTest && h.articulationTest.matchRate != null) n++;
    return n;
  }

  function countColorTestsDone(ud) {
    var c = (ud && ud.color_results) || {};
    var cm = c.color_confusion_matrix || {};
    var n = 0;
    if (c.reactionTime && c.reactionTime.trials && c.reactionTime.trials.length >= 4) n++;
    if (cm.ishihara && (cm.ishihara.classification != null || (cm.ishihara.plateResults && cm.ishihara.plateResults.length > 0))) n++;
    if (cm.deepDiscrimination && (cm.deepDiscrimination.luminanceBoundary != null || cm.deepDiscrimination.complementaryConfusion != null)) n++;
    return n;
  }

  function countCognitiveTestsDone(ud) {
    var c = (ud && ud.cognitive_results) || {};
    var n = 0;
    if (c.reactionTime && c.reactionTime.trials && c.reactionTime.trials.length >= 4) n++;
    if (c.sequenceMemory && c.sequenceMemory.averageReactionTime !== undefined) n++;
    if (c.goNoGo && c.goNoGo.successRate !== undefined) n++;
    if (c.dividedAttention && c.dividedAttention.averageReactionTime !== undefined) n++;
    if (c.readingSpeed && c.readingSpeed.successRate !== undefined) n++;
    return n;
  }

  /**
   * 메인 허브는 ga_progress_* 캐시만 보면 실제 측정값(user_data)과 어긋날 수 있음.
   * 허브 진입 시 user_data로 진척도를 다시 맞춥니다.
   */
  function syncHubProgressFromUserData(session) {
    var ud = (session && session.user_data) || {};
    var v = countVisualTestsDone(ud);
    writeProgress("visual", {
      label: "시야각 측정 포함 총 5개 테스트",
      current: v,
      total: 5,
      completedAt: v >= 5 ? new Date().toISOString() : undefined
    });
    var mo = countMotorTestsDone(ud);
    writeProgress("motor", {
      label: "에임 트레이너 포함 총 8개 테스트",
      current: mo,
      total: 8,
      completedAt: mo >= 8 ? new Date().toISOString() : undefined
    });
    var a = countAudioTestsDone(ud);
    writeProgress("audio", {
      label: "언어 명료도 포함 총 4개 테스트",
      current: a,
      total: 4,
      completedAt: a >= 4 ? new Date().toISOString() : undefined
    });
    var co = countColorTestsDone(ud);
    writeProgress("color", {
      label: "색약 검사 포함 총 3개 테스트",
      current: co,
      total: 3,
      completedAt: co >= 3 ? new Date().toISOString() : undefined
    });
    var cg = countCognitiveTestsDone(ud);
    writeProgress("cognitive", {
      label: "순서 기억 포함 총 5개 테스트",
      current: cg,
      total: 5,
      completedAt: cg >= 5 ? new Date().toISOString() : undefined
    });
  }

  global.GAStorage = {
    readSession: readSession,
    writeSession: writeSession,
    readSessionById: readSessionById,
    restoreSessionById: restoreSessionById,
    readProgress: readProgress,
    writeProgress: writeProgress,
    readDraftVision: readDraftVision,
    writeDraftVision: writeDraftVision,
    clearDraftVision: clearDraftVision,
    clearAllProgress: clearAllProgress,
    syncHubProgressFromUserData: syncHubProgressFromUserData
  };
})(typeof window !== "undefined" ? window : this);
