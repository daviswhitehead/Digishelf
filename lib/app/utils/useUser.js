"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUser = exports.UserProvider = void 0;
const react_1 = require("react");
const firebase_1 = require("./firebase");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const UserContext = (0, react_1.createContext)(null);
const UserProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const unsubscribe = (0, auth_1.onAuthStateChanged)(firebase_1.auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = (0, firestore_1.doc)(firebase_1.db, 'users', firebaseUser.uid);
                const userDoc = await (0, firestore_1.getDoc)(userDocRef);
                if (userDoc.exists()) {
                    setUser(Object.assign({ uid: firebaseUser.uid }, userDoc.data()));
                }
            }
            else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
exports.UserProvider = UserProvider;
const useUser = () => {
    return (0, react_1.useContext)(UserContext);
};
exports.useUser = useUser;
//# sourceMappingURL=useUser.js.map