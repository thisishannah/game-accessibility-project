(function(){"use strict";var N;(function(t){t.STRING="string",t.NUMBER="number",t.INTEGER="integer",t.BOOLEAN="boolean",t.ARRAY="array",t.OBJECT="object"})(N||(N={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var w;(function(t){t.LANGUAGE_UNSPECIFIED="language_unspecified",t.PYTHON="python"})(w||(w={}));var T;(function(t){t.OUTCOME_UNSPECIFIED="outcome_unspecified",t.OUTCOME_OK="outcome_ok",t.OUTCOME_FAILED="outcome_failed",t.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"})(T||(T={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b=["user","model","function","system"];var M;(function(t){t.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",t.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",t.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",t.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",t.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",t.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY"})(M||(M={}));var D;(function(t){t.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE"})(D||(D={}));var G;(function(t){t.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",t.NEGLIGIBLE="NEGLIGIBLE",t.LOW="LOW",t.MEDIUM="MEDIUM",t.HIGH="HIGH"})(G||(G={}));var L;(function(t){t.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",t.SAFETY="SAFETY",t.OTHER="OTHER"})(L||(L={}));var m;(function(t){t.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",t.STOP="STOP",t.MAX_TOKENS="MAX_TOKENS",t.SAFETY="SAFETY",t.RECITATION="RECITATION",t.LANGUAGE="LANGUAGE",t.BLOCKLIST="BLOCKLIST",t.PROHIBITED_CONTENT="PROHIBITED_CONTENT",t.SPII="SPII",t.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",t.OTHER="OTHER"})(m||(m={}));var x;(function(t){t.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",t.RETRIEVAL_QUERY="RETRIEVAL_QUERY",t.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",t.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",t.CLASSIFICATION="CLASSIFICATION",t.CLUSTERING="CLUSTERING"})(x||(x={}));var U;(function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.AUTO="AUTO",t.ANY="ANY",t.NONE="NONE"})(U||(U={}));var F;(function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC"})(F||(F={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u extends Error{constructor(e){super(`[GoogleGenerativeAI Error]: ${e}`)}}class v extends u{constructor(e,n){super(e),this.response=n}}class H extends u{constructor(e,n,o,s){super(e),this.status=n,this.statusText=o,this.errorDetails=s}}class E extends u{}class j extends u{}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt="https://generativelanguage.googleapis.com",et="v1beta",nt="0.24.1",ot="genai-js";var _;(function(t){t.GENERATE_CONTENT="generateContent",t.STREAM_GENERATE_CONTENT="streamGenerateContent",t.COUNT_TOKENS="countTokens",t.EMBED_CONTENT="embedContent",t.BATCH_EMBED_CONTENTS="batchEmbedContents"})(_||(_={}));class st{constructor(e,n,o,s,i){this.model=e,this.task=n,this.apiKey=o,this.stream=s,this.requestOptions=i}toString(){var e,n;const o=((e=this.requestOptions)===null||e===void 0?void 0:e.apiVersion)||et;let i=`${((n=this.requestOptions)===null||n===void 0?void 0:n.baseUrl)||tt}/${o}/${this.model}:${this.task}`;return this.stream&&(i+="?alt=sse"),i}}function it(t){const e=[];return t!=null&&t.apiClient&&e.push(t.apiClient),e.push(`${ot}/${nt}`),e.join(" ")}async function rt(t){var e;const n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",it(t.requestOptions)),n.append("x-goog-api-key",t.apiKey);let o=(e=t.requestOptions)===null||e===void 0?void 0:e.customHeaders;if(o){if(!(o instanceof Headers))try{o=new Headers(o)}catch(s){throw new E(`unable to convert customHeaders value ${JSON.stringify(o)} to Headers: ${s.message}`)}for(const[s,i]of o.entries()){if(s==="x-goog-api-key")throw new E(`Cannot set reserved header name ${s}`);if(s==="x-goog-api-client")throw new E(`Header name ${s} can only be set using the apiClient field`);n.append(s,i)}}return n}async function at(t,e,n,o,s,i){const r=new st(t,e,n,o,i);return{url:r.toString(),fetchOptions:Object.assign(Object.assign({},ut(i)),{method:"POST",headers:await rt(r),body:s})}}async function I(t,e,n,o,s,i={},r=fetch){const{url:a,fetchOptions:c}=await at(t,e,n,o,s,i);return ct(a,c,r)}async function ct(t,e,n=fetch){let o;try{o=await n(t,e)}catch(s){dt(s,t)}return o.ok||await lt(o,t),o}function dt(t,e){let n=t;throw n.name==="AbortError"?(n=new j(`Request aborted when fetching ${e.toString()}: ${t.message}`),n.stack=t.stack):t instanceof H||t instanceof E||(n=new u(`Error fetching from ${e.toString()}: ${t.message}`),n.stack=t.stack),n}async function lt(t,e){let n="",o;try{const s=await t.json();n=s.error.message,s.error.details&&(n+=` ${JSON.stringify(s.error.details)}`,o=s.error.details)}catch{}throw new H(`Error fetching from ${e.toString()}: [${t.status} ${t.statusText}] ${n}`,t.status,t.statusText,o)}function ut(t){const e={};if((t==null?void 0:t.signal)!==void 0||(t==null?void 0:t.timeout)>=0){const n=new AbortController;(t==null?void 0:t.timeout)>=0&&setTimeout(()=>n.abort(),t.timeout),t!=null&&t.signal&&t.signal.addEventListener("abort",()=>{n.abort()}),e.signal=n.signal}return e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function A(t){return t.text=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),S(t.candidates[0]))throw new v(`${C(t)}`,t);return ft(t)}else if(t.promptFeedback)throw new v(`Text not available. ${C(t)}`,t);return""},t.functionCall=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),S(t.candidates[0]))throw new v(`${C(t)}`,t);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),$(t)[0]}else if(t.promptFeedback)throw new v(`Function call not available. ${C(t)}`,t)},t.functionCalls=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),S(t.candidates[0]))throw new v(`${C(t)}`,t);return $(t)}else if(t.promptFeedback)throw new v(`Function call not available. ${C(t)}`,t)},t}function ft(t){var e,n,o,s;const i=[];if(!((n=(e=t.candidates)===null||e===void 0?void 0:e[0].content)===null||n===void 0)&&n.parts)for(const r of(s=(o=t.candidates)===null||o===void 0?void 0:o[0].content)===null||s===void 0?void 0:s.parts)r.text&&i.push(r.text),r.executableCode&&i.push("\n```"+r.executableCode.language+`
`+r.executableCode.code+"\n```\n"),r.codeExecutionResult&&i.push("\n```\n"+r.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}function $(t){var e,n,o,s;const i=[];if(!((n=(e=t.candidates)===null||e===void 0?void 0:e[0].content)===null||n===void 0)&&n.parts)for(const r of(s=(o=t.candidates)===null||o===void 0?void 0:o[0].content)===null||s===void 0?void 0:s.parts)r.functionCall&&i.push(r.functionCall);if(i.length>0)return i}const ht=[m.RECITATION,m.SAFETY,m.LANGUAGE];function S(t){return!!t.finishReason&&ht.includes(t.finishReason)}function C(t){var e,n,o;let s="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)s+="Response was blocked",!((e=t.promptFeedback)===null||e===void 0)&&e.blockReason&&(s+=` due to ${t.promptFeedback.blockReason}`),!((n=t.promptFeedback)===null||n===void 0)&&n.blockReasonMessage&&(s+=`: ${t.promptFeedback.blockReasonMessage}`);else if(!((o=t.candidates)===null||o===void 0)&&o[0]){const i=t.candidates[0];S(i)&&(s+=`Candidate was blocked due to ${i.finishReason}`,i.finishMessage&&(s+=`: ${i.finishMessage}`))}return s}function R(t){return this instanceof R?(this.v=t,this):new R(t)}function gt(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var o=n.apply(t,e||[]),s,i=[];return s={},r("next"),r("throw"),r("return"),s[Symbol.asyncIterator]=function(){return this},s;function r(l){o[l]&&(s[l]=function(d){return new Promise(function(f,O){i.push([l,d,f,O])>1||a(l,d)})})}function a(l,d){try{c(o[l](d))}catch(f){p(i[0][3],f)}}function c(l){l.value instanceof R?Promise.resolve(l.value.v).then(h,g):p(i[0][2],l)}function h(l){a("next",l)}function g(l){a("throw",l)}function p(l,d){l(d),i.shift(),i.length&&a(i[0][0],i[0][1])}}typeof SuppressedError=="function"&&SuppressedError;/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function Et(t){const e=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),n=pt(e),[o,s]=n.tee();return{stream:_t(o),response:Ct(s)}}async function Ct(t){const e=[],n=t.getReader();for(;;){const{done:o,value:s}=await n.read();if(o)return A(vt(e));e.push(s)}}function _t(t){return gt(this,arguments,function*(){const n=t.getReader();for(;;){const{value:o,done:s}=yield R(n.read());if(s)break;yield yield R(A(o))}})}function pt(t){const e=t.getReader();return new ReadableStream({start(o){let s="";return i();function i(){return e.read().then(({value:r,done:a})=>{if(a){if(s.trim()){o.error(new u("Failed to parse stream"));return}o.close();return}s+=r;let c=s.match(k),h;for(;c;){try{h=JSON.parse(c[1])}catch{o.error(new u(`Error parsing JSON response: "${c[1]}"`));return}o.enqueue(h),s=s.substring(c[0].length),c=s.match(k)}return i()}).catch(r=>{let a=r;throw a.stack=r.stack,a.name==="AbortError"?a=new j("Request aborted when reading from the stream"):a=new u("Error reading from the stream"),a})}}})}function vt(t){const e=t[t.length-1],n={promptFeedback:e==null?void 0:e.promptFeedback};for(const o of t){if(o.candidates){let s=0;for(const i of o.candidates)if(n.candidates||(n.candidates=[]),n.candidates[s]||(n.candidates[s]={index:s}),n.candidates[s].citationMetadata=i.citationMetadata,n.candidates[s].groundingMetadata=i.groundingMetadata,n.candidates[s].finishReason=i.finishReason,n.candidates[s].finishMessage=i.finishMessage,n.candidates[s].safetyRatings=i.safetyRatings,i.content&&i.content.parts){n.candidates[s].content||(n.candidates[s].content={role:i.content.role||"user",parts:[]});const r={};for(const a of i.content.parts)a.text&&(r.text=a.text),a.functionCall&&(r.functionCall=a.functionCall),a.executableCode&&(r.executableCode=a.executableCode),a.codeExecutionResult&&(r.codeExecutionResult=a.codeExecutionResult),Object.keys(r).length===0&&(r.text=""),n.candidates[s].content.parts.push(r)}s++}o.usageMetadata&&(n.usageMetadata=o.usageMetadata)}return n}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function B(t,e,n,o){const s=await I(e,_.STREAM_GENERATE_CONTENT,t,!0,JSON.stringify(n),o);return Et(s)}async function K(t,e,n,o){const i=await(await I(e,_.GENERATE_CONTENT,t,!1,JSON.stringify(n),o)).json();return{response:A(i)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{text:t}]};if(t.text)return{role:"system",parts:[t]};if(t.parts)return t.role?t:{role:"system",parts:t.parts}}}function y(t){let e=[];if(typeof t=="string")e=[{text:t}];else for(const n of t)typeof n=="string"?e.push({text:n}):e.push(n);return Ot(e)}function Ot(t){const e={role:"user",parts:[]},n={role:"function",parts:[]};let o=!1,s=!1;for(const i of t)"functionResponse"in i?(n.parts.push(i),s=!0):(e.parts.push(i),o=!0);if(o&&s)throw new u("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!o&&!s)throw new u("No content is provided for sending chat message.");return o?e:n}function mt(t,e){var n;let o={model:e==null?void 0:e.model,generationConfig:e==null?void 0:e.generationConfig,safetySettings:e==null?void 0:e.safetySettings,tools:e==null?void 0:e.tools,toolConfig:e==null?void 0:e.toolConfig,systemInstruction:e==null?void 0:e.systemInstruction,cachedContent:(n=e==null?void 0:e.cachedContent)===null||n===void 0?void 0:n.name,contents:[]};const s=t.generateContentRequest!=null;if(t.contents){if(s)throw new E("CountTokensRequest must have one of contents or generateContentRequest, not both.");o.contents=t.contents}else if(s)o=Object.assign(Object.assign({},o),t.generateContentRequest);else{const i=y(t);o.contents=[i]}return{generateContentRequest:o}}function P(t){let e;return t.contents?e=t:e={contents:[y(t)]},t.systemInstruction&&(e.systemInstruction=Y(t.systemInstruction)),e}function It(t){return typeof t=="string"||Array.isArray(t)?{content:y(t)}:t}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],Rt={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};function yt(t){let e=!1;for(const n of t){const{role:o,parts:s}=n;if(!e&&o!=="user")throw new u(`First content should be with role 'user', got ${o}`);if(!b.includes(o))throw new u(`Each item should include role field. Got ${o} but valid roles are: ${JSON.stringify(b)}`);if(!Array.isArray(s))throw new u("Content should have 'parts' property with an array of Parts");if(s.length===0)throw new u("Each Content should have at least one part");const i={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const a of s)for(const c of q)c in a&&(i[c]+=1);const r=Rt[o];for(const a of q)if(!r.includes(a)&&i[a]>0)throw new u(`Content with role '${o}' can't contain '${a}' part`);e=!0}}function V(t){var e;if(t.candidates===void 0||t.candidates.length===0)return!1;const n=(e=t.candidates[0])===null||e===void 0?void 0:e.content;if(n===void 0||n.parts===void 0||n.parts.length===0)return!1;for(const o of n.parts)if(o===void 0||Object.keys(o).length===0||o.text!==void 0&&o.text==="")return!1;return!0}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const J="SILENT_ERROR";class St{constructor(e,n,o,s={}){this.model=n,this.params=o,this._requestOptions=s,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=e,o!=null&&o.history&&(yt(o.history),this._history=o.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(e,n={}){var o,s,i,r,a,c;await this._sendPromise;const h=y(e),g={safetySettings:(o=this.params)===null||o===void 0?void 0:o.safetySettings,generationConfig:(s=this.params)===null||s===void 0?void 0:s.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,cachedContent:(c=this.params)===null||c===void 0?void 0:c.cachedContent,contents:[...this._history,h]},p=Object.assign(Object.assign({},this._requestOptions),n);let l;return this._sendPromise=this._sendPromise.then(()=>K(this._apiKey,this.model,g,p)).then(d=>{var f;if(V(d.response)){this._history.push(h);const O=Object.assign({parts:[],role:"model"},(f=d.response.candidates)===null||f===void 0?void 0:f[0].content);this._history.push(O)}else{const O=C(d.response);O&&console.warn(`sendMessage() was unsuccessful. ${O}. Inspect response object for details.`)}l=d}).catch(d=>{throw this._sendPromise=Promise.resolve(),d}),await this._sendPromise,l}async sendMessageStream(e,n={}){var o,s,i,r,a,c;await this._sendPromise;const h=y(e),g={safetySettings:(o=this.params)===null||o===void 0?void 0:o.safetySettings,generationConfig:(s=this.params)===null||s===void 0?void 0:s.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(r=this.params)===null||r===void 0?void 0:r.toolConfig,systemInstruction:(a=this.params)===null||a===void 0?void 0:a.systemInstruction,cachedContent:(c=this.params)===null||c===void 0?void 0:c.cachedContent,contents:[...this._history,h]},p=Object.assign(Object.assign({},this._requestOptions),n),l=B(this._apiKey,this.model,g,p);return this._sendPromise=this._sendPromise.then(()=>l).catch(d=>{throw new Error(J)}).then(d=>d.response).then(d=>{if(V(d)){this._history.push(h);const f=Object.assign({},d.candidates[0].content);f.role||(f.role="model"),this._history.push(f)}else{const f=C(d);f&&console.warn(`sendMessageStream() was unsuccessful. ${f}. Inspect response object for details.`)}}).catch(d=>{d.message!==J&&console.error(d)}),l}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function At(t,e,n,o){return(await I(e,_.COUNT_TOKENS,t,!1,JSON.stringify(n),o)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nt(t,e,n,o){return(await I(e,_.EMBED_CONTENT,t,!1,JSON.stringify(n),o)).json()}async function wt(t,e,n,o){const s=n.requests.map(r=>Object.assign(Object.assign({},r),{model:e}));return(await I(e,_.BATCH_EMBED_CONTENTS,t,!1,JSON.stringify({requests:s}),o)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e,n,o={}){this.apiKey=e,this._requestOptions=o,n.model.includes("/")?this.model=n.model:this.model=`models/${n.model}`,this.generationConfig=n.generationConfig||{},this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=Y(n.systemInstruction),this.cachedContent=n.cachedContent}async generateContent(e,n={}){var o;const s=P(e),i=Object.assign(Object.assign({},this._requestOptions),n);return K(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(o=this.cachedContent)===null||o===void 0?void 0:o.name},s),i)}async generateContentStream(e,n={}){var o;const s=P(e),i=Object.assign(Object.assign({},this._requestOptions),n);return B(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(o=this.cachedContent)===null||o===void 0?void 0:o.name},s),i)}startChat(e){var n;return new St(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(n=this.cachedContent)===null||n===void 0?void 0:n.name},e),this._requestOptions)}async countTokens(e,n={}){const o=mt(e,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),s=Object.assign(Object.assign({},this._requestOptions),n);return At(this.apiKey,this.model,o,s)}async embedContent(e,n={}){const o=It(e),s=Object.assign(Object.assign({},this._requestOptions),n);return Nt(this.apiKey,this.model,o,s)}async batchEmbedContents(e,n={}){const o=Object.assign(Object.assign({},this._requestOptions),n);return wt(this.apiKey,this.model,e,o)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tt{constructor(e){this.apiKey=e}getGenerativeModel(e,n){if(!e.model)throw new u("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new W(this.apiKey,e,n)}getGenerativeModelFromCachedContent(e,n,o){if(!e.name)throw new E("Cached content must contain a `name` field.");if(!e.model)throw new E("Cached content must contain a `model` field.");const s=["model","systemInstruction"];for(const r of s)if(n!=null&&n[r]&&e[r]&&(n==null?void 0:n[r])!==e[r]){if(r==="model"){const a=n.model.startsWith("models/")?n.model.replace("models/",""):n.model,c=e.model.startsWith("models/")?e.model.replace("models/",""):e.model;if(a===c)continue}throw new E(`Different value for "${r}" specified in modelParams (${n[r]}) and cachedContent (${e[r]})`)}const i=Object.assign(Object.assign({},n),{model:e.model,tools:e.tools,toolConfig:e.toolConfig,systemInstruction:e.systemInstruction,cachedContent:e});return new W(this.apiKey,i,o)}}const X="gemini-2.5-flash";function Q(t){return String(t??"").trim().replace(/^models\/+/i,"").trim()}const bt={apiVersion:"v1"};async function z(t,e,n,o){const s=typeof t=="string"?t.trim():"";if(!s)throw new Error("Gemini API 키가 비어 있습니다. 분석 전에 API 키를 입력해 주세요.");const i=new Tt(s),r=typeof o=="string"?o.trim():"",a=e!=null?String(e):"",c=r?`[Instruction]
`+r+`

`+a:a,g={model:Q(n)||Q(X)||X,generationConfig:{temperature:.35,maxOutputTokens:8192}},d=(await i.getGenerativeModel(g,bt).generateContent(c)).response.text();if(!d||!String(d).trim())throw new Error("Gemini 응답에 본문이 없습니다.");return String(d)}function Z(t){const e=t&&typeof t=="object"?t:{},n=e.participantData!=null?e.participantData:{},o=e.observerComment!=null&&String(e.observerComment).trim().length>0?String(e.observerComment).trim():"",s=e.observerReportForm&&typeof e.observerReportForm=="object"?e.observerReportForm:{},i=typeof e.outputFormatMarkdown=="string"&&e.outputFormatMarkdown.trim().length>0?e.outputFormatMarkdown.trim():"";let r;try{r=JSON.stringify(n,null,2)}catch{r='{"error":"participantData JSON 직렬화 실패"}'}let a;try{a=JSON.stringify(s,null,2)}catch{a="{}"}let c;return o?c=`### [관찰자 현장 코멘트 — 최우선 반영]
아래는 요약 화면에서 관찰자가 **직접 입력·저장한** 현장 소견입니다. 설문 수치만으로는 드러나지 않는 맥락(보조기기, 피로, 조명, 정서, 과제 이해, 실수 패턴 등)이 포함될 수 있습니다.

---
`+o+`
---

**분석 지시 (필수):**
- 아래 세 개의 출력 섹션 전부에서 이 코멘트를 **측정 JSON과 동등 이상의 가중치**로 통합하세요.
- 수치와 코멘트가 충돌해 보이면 **코멘트의 현장 설명을 우선** 채택하고, 수치는 그에 맞게 재해석·한계를 밝히세요.
- 코멘트에만 등장하는 요인은 섹션 2·3에 **반드시 구체 시나리오·권장안**으로 명시하세요.

`:c=`### [관찰자 현장 코멘트]
(비어 있음. participantData와 구조화된 관찰자 리포트 폼만 사용하세요.)

`,`너는 세계 최고의 게임 접근성 컨설턴트야. 'Smile Play Ally' 프로젝트의 데이터를 분석해야 해.

## 입력 데이터

### [참여자 측정·프로필 통합 객체 (participantData)]
참여자 JSON 불러오기·세션에 저장된 **측정값·user_data·프로필**입니다.

`+r+`

`+c+`### [관찰자 리포트 구조화 필드 (전용 양식·AT~AV 계열)]
`+a+`

### [참고]
현장 코멘트 블록이 있으면 해석과 권고의 **주요 근거**로 삼고, 구조화 필드는 보조 맥락으로 결합하세요.

`+(i||"")}async function Mt(t,e,n,o){const s=Z(e);return z(t,s,n,o)}typeof window<"u"&&(window.__summaryGeminiGenerate=z,window.generateSummary=Mt,window.buildAccessibilitySummaryUserPrompt=Z)})();
