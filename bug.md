react-dom.development.js:18704 The above error occurred in the <NowPlayingSidebar> component:

    at NowPlayingSidebar (http://localhost:5173/src/components/player/NowPlayingSidebar.tsx?t=1776170703953:30:39)
    at div
    at div
    at MainLayout (http://localhost:5173/src/components/layout/MainLayout.tsx?t=1776170703953:31:31)
    at ProtectedRoute (http://localhost:5173/src/components/auth/ProtectedRoute.tsx:20:34)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=3949bcf4:4131:5)
    at Routes (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=3949bcf4:4601:5)
    at Router (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=3949bcf4:4544:15)
    at BrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=3949bcf4:5290:5)
    at App (http://localhost:5173/src/App.tsx?t=1776170703953:54:31)
    at QueryClientProvider (http://localhost:5173/node_modules/.vite/deps/chunk-7QAH2OQY.js?v=3949bcf4:3194:3)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
logCapturedError	@	react-dom.development.js:18704
update.callback	@	react-dom.development.js:18737
callCallback	@	react-dom.development.js:15036
commitUpdateQueue	@	react-dom.development.js:15057
commitLayoutEffectOnFiber	@	react-dom.development.js:23430
commitLayoutMountEffects_complete	@	react-dom.development.js:24727
commitLayoutEffects_begin	@	react-dom.development.js:24713
commitLayoutEffects	@	react-dom.development.js:24651
commitRootImpl	@	react-dom.development.js:26862
commitRoot	@	react-dom.development.js:26721
finishConcurrentRender	@	react-dom.development.js:25931
performConcurrentWorkOnRoot	@	react-dom.development.js:25848
workLoop	@	scheduler.development.js:266
flushWork	@	scheduler.development.js:239
performWorkUntilDeadline

NowPlayingSidebar.tsx:193 Uncaught TypeError: Cannot read properties of undefined (reading '0')
    at NowPlayingSidebar (NowPlayingSidebar.tsx:193:35)
