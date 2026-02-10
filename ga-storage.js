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

  function readSession() {
    var s = safeGet(sessionStorage, SESSION_KEY);
    if (s) return s;
    var l = safeGet(localStorage, SESSION_KEY);
    if (l) {
      safeSet(sessionStorage, SESSION_KEY, l);
      return l;
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

  function readProgress(key) {
    var s = safeGet(sessionStorage, PROGRESS_PREFIX + key);
    if (s) return s;
    var l = safeGet(localStorage, PROGRESS_PREFIX + key);
    if (l) {
      safeSet(sessionStorage, PROGRESS_PREFIX + key, l);
      return l;
    }
    return null;
  }

  function writeProgress(key, data) {
    safeSet(sessionStorage, PROGRESS_PREFIX + key, data);
    safeSet(localStorage, PROGRESS_PREFIX + key, data);
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
  };
})(typeof window !== "undefined" ? window : this);
