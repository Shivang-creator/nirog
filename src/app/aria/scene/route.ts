import { NURSE_HTML } from "@/lib/aria/nurseHtml";

/**
 * Serves the ARIA scene as a standalone document for an iframe.
 *
 * The scene is lifted unmodified from the Nirog mobile app, where it runs inside
 * a react-native-webview. It was already browser code — Three.js, Web Speech,
 * WebGL — so the only thing standing between it and a web page is the host
 * bridge it expects.
 *
 * Rather than editing 1,600 lines of a working 3D scene, we give it the host it
 * is looking for. Two globals injected before the module runs:
 *
 *   window.ReactNativeWebView.postMessage  → forwarded to window.parent
 *   window.NIROG_MODEL_URL                 → the GLB served from /public
 *
 * Keeping the scene byte-identical to the app's copy means a fix in either place
 * still applies to both, and there is no second implementation to drift.
 */

const SHIM = `
<script>
  // The scene calls window.ReactNativeWebView.postMessage(json) for every event
  // it emits — ready, speaking, idle, caption, listening, log. In a browser that
  // object does not exist, so we provide one that forwards to the parent frame.
  window.ReactNativeWebView = {
    postMessage: function (payload) {
      try { window.parent.postMessage(payload, window.location.origin); } catch (e) {}
    }
  };
  window.NIROG_MODEL_URL = '/aria/chloe_avatar.glb';
  window.NIROG_MODEL_URLS = ['/aria/chloe_avatar.glb'];
</script>
`;

export async function GET() {
  // The shim has to land before the module script that reads those globals.
  const html = NURSE_HTML.replace("</head>", `${SHIM}</head>`);

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      // The 14 MB avatar is the slow part; letting the document itself be
      // revalidated cheaply keeps a reload from re-downloading everything.
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
