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
exports.default = Shelves;
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const firebase_1 = require("../../../utils/firebase");
const firestore_1 = require("firebase/firestore");
const useUser_1 = require("../../../utils/useUser");
const Sidebar_1 = __importDefault(require("../../../components/Sidebar"));
const react_native_1 = require("react-native");
function Shelves() {
    const router = (0, router_1.useRouter)();
    const user = (0, useUser_1.useUser)();
    const [shelves, setShelves] = (0, react_1.useState)([]);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (!user)
            return;
        const fetchShelves = async () => {
            try {
                const shelvesRef = (0, firestore_1.collection)(firebase_1.db, 'shelves');
                const q = (0, firestore_1.query)(shelvesRef, (0, firestore_1.where)('userId', '==', user.uid));
                const querySnapshot = await (0, firestore_1.getDocs)(q);
                const shelvesList = querySnapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
                setShelves(shelvesList);
            }
            catch (err) {
                setError(err.message);
            }
        };
        fetchShelves();
    }, [user]);
    const handleShelfClick = shelfId => {
        router.push(`/${user.uid}/shelves/${shelfId}`);
    };
    return (<react_native_1.View style={styles.container}>
      <Sidebar_1.default />
      <react_native_1.View style={styles.contentWrapper}>
        <react_native_1.ScrollView contentContainerStyle={styles.content}>
          <react_native_1.Text style={styles.title}>Your Shelves</react_native_1.Text>
          {error && <react_native_1.Text style={styles.errorText}>{error}</react_native_1.Text>}
          <react_native_1.View style={styles.cardContainer}>
            {shelves.map(shelf => (<react_native_1.TouchableOpacity key={shelf.id} style={styles.card} onPress={() => handleShelfClick(shelf.id)}>
                <react_native_1.Text style={styles.cardTitle}>{shelf.displayName}</react_native_1.Text>
                <react_native_1.Text style={styles.cardSubtitle}>{shelf.sourceDisplayName}</react_native_1.Text>
              </react_native_1.TouchableOpacity>))}
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