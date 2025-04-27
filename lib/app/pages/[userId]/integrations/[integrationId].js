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
exports.default = Integration;
const react_1 = __importStar(require("react"));
const router_1 = require("next/router");
const firebase_1 = require("../../../utils/firebase");
const firestore_1 = require("firebase/firestore");
const Sidebar_1 = __importDefault(require("../../../components/Sidebar"));
const react_native_1 = require("react-native");
function Integration() {
    const router = (0, router_1.useRouter)();
    const { userId, integrationId } = router.query;
    const [integrationData, setIntegrationData] = (0, react_1.useState)(null);
    const [myBooksURL, setMyBooksURL] = (0, react_1.useState)('');
    const [accountSlug, setAccountSlug] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)(null);
    const [successMessage, setSuccessMessage] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        if (!userId || !integrationId)
            return;
        const fetchIntegrationData = async () => {
            try {
                const integrationDocRef = (0, firestore_1.doc)(firebase_1.db, 'integrations', integrationId);
                const integrationDoc = await (0, firestore_1.getDoc)(integrationDocRef);
                if (integrationDoc.exists()) {
                    const data = integrationDoc.data();
                    setIntegrationData(data);
                    setMyBooksURL(data.myBooksURL || '');
                    setAccountSlug(data.myBooksURL ? deriveAccountSlug(data.myBooksURL) : '');
                }
                else {
                    setError('Integration not found.');
                }
            }
            catch (err) {
                setError(err.message);
            }
        };
        fetchIntegrationData();
    }, [userId, integrationId]);
    const deriveAccountSlug = url => {
        try {
            const urlParts = new URL(url).pathname.split('/');
            return urlParts[urlParts.length - 1] || '';
        }
        catch (_a) {
            return '';
        }
    };
    const handleSave = async () => {
        try {
            const integrationDocRef = (0, firestore_1.doc)(firebase_1.db, 'integrations', integrationId);
            await (0, firestore_1.updateDoc)(integrationDocRef, {
                myBooksURL,
            });
            setSuccessMessage('Changes saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
        catch (err) {
            setError(err.message);
        }
    };
    const handleDelete = async () => {
        try {
            const integrationDocRef = (0, firestore_1.doc)(firebase_1.db, 'integrations', integrationId);
            await (0, firestore_1.deleteDoc)(integrationDocRef);
            router.push(`/${userId}/integrations`);
        }
        catch (err) {
            setError(err.message);
        }
    };
    if (error) {
        return (<react_native_1.View style={styles.container}>
        <Sidebar_1.default />
        <react_native_1.View style={styles.content}>
          <react_native_1.Text style={styles.errorText}>{error}</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>);
    }
    if (!integrationData) {
        return (<react_native_1.View style={styles.container}>
        <Sidebar_1.default />
        <react_native_1.View style={styles.content}>
          <react_native_1.Text style={styles.loadingText}>Loading...</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>);
    }
    return (<react_native_1.View style={styles.container}>
      <Sidebar_1.default />
      <react_native_1.View style={styles.contentWrapper}>
        <react_native_1.ScrollView contentContainerStyle={styles.content}>
          <react_native_1.Text style={styles.title}>Your {integrationData.displayName} Integration</react_native_1.Text>
          <react_native_1.View style={styles.formGroup}>
            <react_native_1.Text style={styles.label}>My Books URL:</react_native_1.Text>
            <react_native_1.Text style={styles.helperText}>
              <a href='https://www.goodreads.com/review/list/' target='_blank' rel='noopener noreferrer' style={styles.link}>
                Click here
              </a>
              , login, then copy and paste the URL here.
            </react_native_1.Text>
            <react_native_1.TextInput value={myBooksURL} onChangeText={text => {
            setMyBooksURL(text);
            setAccountSlug(deriveAccountSlug(text));
        }} style={styles.input}/>
          </react_native_1.View>
          <react_native_1.View style={styles.formGroup}>
            <react_native_1.Text style={styles.label}>Account Slug:</react_native_1.Text>
            <react_native_1.TextInput value={accountSlug} editable={false} style={styles.inputDisabled}/>
          </react_native_1.View>
          <react_native_1.TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <react_native_1.Text style={styles.saveButtonText}>Save</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <react_native_1.Text style={styles.deleteButtonText}>Delete</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          {successMessage && <react_native_1.Text style={styles.successText}>{successMessage}</react_native_1.Text>}
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
    formGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    inputDisabled: {
        backgroundColor: '#333',
        color: '#aaa',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    saveButton: {
        backgroundColor: '#4caf50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    loadingText: {
        color: '#fff',
        fontSize: 16,
    },
    successText: {
        color: 'green',
        fontSize: 16,
        marginTop: 10,
    },
    helperText: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 5,
    },
    link: {
        color: '#4caf50',
        textDecorationLine: 'underline',
    },
});
//# sourceMappingURL=%5BintegrationId%5D.js.map