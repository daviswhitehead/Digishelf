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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const router_1 = require("next/router"); // Import useRouter
const auth_1 = require("firebase/auth");
const firebase_1 = require("../utils/firebase");
const firestore_1 = require("firebase/firestore");
const AuthPage = () => {
    const [error, setError] = (0, react_1.useState)(null);
    const router = (0, router_1.useRouter)(); // Initialize useRouter
    const handleGoogleLogin = async () => {
        try {
            const result = await (0, auth_1.signInWithPopup)(firebase_1.auth, firebase_1.googleProvider);
            const user = result.user;
            // Extract first and last name from displayName
            const [firstName, ...lastNameParts] = user.displayName.split(' ');
            const lastName = lastNameParts.join(' ');
            // Create or update the user document in Firestore
            const userDocRef = (0, firestore_1.doc)(firebase_1.db, 'users', user.uid);
            const userDoc = await (0, firestore_1.getDoc)(userDocRef);
            await (0, firestore_1.setDoc)(userDocRef, Object.assign({ userId: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL, firstName,
                lastName, updatedAt: (0, firestore_1.serverTimestamp)() }, (userDoc.exists() ? {} : { createdAt: (0, firestore_1.serverTimestamp)() })), { merge: true } // Merge with existing data if the document already exists
            );
            // Redirect to the user's profile page
            router.push(`/${user.uid}`);
        }
        catch (err) {
            setError(err.message);
        }
    };
    return (<div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '20px',
        }}>
      <h1>Log in or sign up</h1>
      <p>Create an account or log in to book and manage your appointments.</p>
      <button onClick={handleGoogleLogin} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            marginTop: '20px',
        }}>
        <span style={{ marginRight: '10px' }}>🏫</span> Continue with Google
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>);
};
exports.default = AuthPage;
//# sourceMappingURL=Login.js.map