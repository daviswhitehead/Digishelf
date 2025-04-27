"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePageUrl = void 0;
const react_1 = require("react");
const router_1 = require("next/router");
const usePageUrl = () => {
    const [pageUrl, setPageUrl] = (0, react_1.useState)('');
    const router = (0, router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        if (typeof window !== 'undefined') {
            const updateUrl = () => {
                const fullUrl = window.location.origin + router.asPath;
                setPageUrl(fullUrl);
            };
            updateUrl(); // Initial URL set
            router.events.on('routeChangeComplete', updateUrl);
            return () => router.events.off('routeChangeComplete', updateUrl);
        }
    }, [router.asPath]); // Depend on router.asPath
    return pageUrl;
};
exports.usePageUrl = usePageUrl;
//# sourceMappingURL=usePageUrl.js.map