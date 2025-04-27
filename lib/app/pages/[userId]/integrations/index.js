"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Integrations;
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const firebase_1 = require("../../../utils/firebase");
const firestore_1 = require("firebase/firestore");
const useUser_1 = require("../../../utils/useUser");
const Sidebar_1 = __importDefault(require("../../../components/Sidebar"));
const react_native_1 = require("react-native");
function Integrations() {
    const router = (0, router_1.useRouter)();
    const user = (0, useUser_1.useUser)();
    const [enabledIntegrations, setEnabledIntegrations] = (0, react_1.useState)([]);
    const [availableIntegrations, setAvailableIntegrations] = (0, react_1.useState)([]);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (!user)
            return;
        const fetchIntegrations = async () => {
            try {
                // Fetch enabled integrations
                const integrationsRef = (0, firestore_1.collection)(firebase_1.db, 'integrations');
                const integrationsQuery = (0, firestore_1.query)(integrationsRef, (0, firestore_1.where)('userId', '==', user.uid));
                const integrationsSnapshot = await (0, firestore_1.getDocs)(integrationsQuery);
                const enabled = integrationsSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
                // Fetch available integrations (sources)
                const sourcesRef = (0, firestore_1.collection)(firebase_1.db, 'sources');
                const sourcesSnapshot = await (0, firestore_1.getDocs)(sourcesRef);
                const available = sourcesSnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
                // Filter out duplicates by displayName
                const enabledDisplayNames = new Set(enabled.map(integration => integration.displayName));
                const filteredAvailable = available.filter(source => !enabledDisplayNames.has(source.displayName));
                setEnabledIntegrations(enabled);
                setAvailableIntegrations(filteredAvailable);
            }
            catch (err) {
                setError(err.message);
            }
        };
        fetchIntegrations();
    }, [user]);
    const handleIntegrationClick = integrationId => {
        router.push(`/${user.uid}/integrations/${integrationId}`);
    };
    const handleEnableIntegration = async (source) => {
        try {
            if (source.displayName === 'Goodreads') {
                router.push(`/${user.uid}/integrations/new/${source.id}`);
                return;
            }
            // Logic to enable an integration (e.g., create a new document in the integrations collection)
            const integrationsRef = (0, firestore_1.collection)(firebase_1.db, 'integrations');
            await (0, firestore_1.setDoc)((0, firestore_1.doc)(integrationsRef), {
                userId: user.uid,
                displayName: source.displayName,
                sourceId: source.id,
                createdAt: (0, firestore_1.serverTimestamp)(),
            });
            // Refresh the integrations
            setEnabledIntegrations(prev => [
                ...prev,
                { displayName: source.displayName, sourceId: source.id },
            ]);
            setAvailableIntegrations(prev => prev.filter(item => item.displayName !== source.displayName));
        }
        catch (err) {
            setError(err.message);
        }
    };
    return (<react_native_1.View style={styles.container}>
      <Sidebar_1.default />
      <react_native_1.View style={styles.contentWrapper}>
        <react_native_1.ScrollView contentContainerStyle={styles.content}>
          <react_native_1.Text style={styles.title}>Enabled Integrations</react_native_1.Text>
          {error && <react_native_1.Text style={styles.errorText}>{error}</react_native_1.Text>}
          <react_native_1.View style={styles.cardContainer}>
            {enabledIntegrations.map(integration => {
            var _a;
            return (<react_native_1.TouchableOpacity key={integration.id} style={styles.card} onPress={() => handleIntegrationClick(integration.id)}>
                <react_native_1.Text style={styles.cardTitle}>{integration.displayName}</react_native_1.Text>
                <react_native_1.Text style={styles.cardSubtitle}>{(_a = integration.shelves) === null || _a === void 0 ? void 0 : _a.join(' · ')}</react_native_1.Text>
              </react_native_1.TouchableOpacity>);
        })}
          </react_native_1.View>

          <react_native_1.Text style={[styles.title, { marginTop: 40 }]}>Available Integrations</react_native_1.Text>
          <react_native_1.View style={styles.cardContainer}>
            {availableIntegrations.map(source => {
            var _a;
            return (<react_native_1.TouchableOpacity key={source.id} style={styles.card} onPress={() => handleEnableIntegration(source)}>
                <react_native_1.Text style={styles.cardTitle}>{source.displayName}</react_native_1.Text>
                <react_native_1.Text style={styles.cardSubtitle}>
                  {((_a = source.shelves) === null || _a === void 0 ? void 0 : _a.join(' · ')) || 'No shelves available'}
                </react_native_1.Text>
              </react_native_1.TouchableOpacity>);
        })}
          </react_native_1.View>
        </react_native_1.ScrollView>
      </react_native_1.View>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row', // Align sidebar and content side by side
        backgroundColor: '#000',
    },
    contentWrapper: {
        flex: 1, // Allow the content to take up the remaining space
        marginLeft: 250, // Match the width of the sidebar
    },
    content: {
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 20,
    },
    cardContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
    },
    card: {
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: 15,
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        width: 250,
        cursor: 'pointer',
    },
    cardTitle: {
        marginBottom: 5,
        fontSize: 18,
        color: '#fff',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#aaa',
    },
});
//# sourceMappingURL=index.js.map