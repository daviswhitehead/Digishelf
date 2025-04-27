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
exports.default = Shelf;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const useResponsive_1 = require("../../../utils/useResponsive");
const layoutUtils_1 = require("../../../utils/layoutUtils");
const firestoreUtils_1 = require("../../../utils/firestoreUtils");
const firebase_1 = require("../../../utils/firebase");
const firestore_1 = require("firebase/firestore");
const functions_1 = require("firebase/functions");
const BookCard_1 = __importDefault(require("../../../components/BookCard"));
const ShelfHeader_1 = __importDefault(require("../../../components/ShelfHeader"));
const QRCode_1 = __importDefault(require("../../../components/QRCode"));
const router_1 = require("next/router");
const colorthief_1 = __importDefault(require("colorthief"));
const lodash_1 = require("lodash"); // Import lodash for throttling and debouncing
const SidePanel_1 = __importDefault(require("../../../components/SidePanel")); // Add this import
const splitIntoColumns = (data, numColumns) => {
    // Distributes data evenly across the specified number of columns
    const columns = Array.from({ length: numColumns }, () => []);
    data.forEach((item, index) => {
        columns[index % numColumns].push(item);
    });
    return columns;
};
const fetchBooksWithPrimaryColor = async (shelfId) => {
    const booksData = await (0, firestoreUtils_1.fetchItemsByShelfId)(shelfId);
    const batch = (0, firestore_1.writeBatch)(firebase_1.db); // Initialize Firestore batch
    const updatedBooks = await Promise.all(booksData.map(async (book) => {
        if (!book.primaryColor && book.coverImage) {
            const img = new window.Image();
            img.crossOrigin = 'Anonymous';
            img.src = book.coverImage;
            const primaryColor = await new Promise(resolve => {
                img.onload = () => {
                    const colorThief = new colorthief_1.default();
                    const dominantColor = colorThief.getColor(img);
                    const hexColor = `#${dominantColor.map(c => c.toString(16).padStart(2, '0')).join('')}`;
                    resolve(hexColor);
                };
                img.onerror = () => resolve(null); // No fallback color
            });
            if (primaryColor) {
                const itemDocRef = (0, firestore_1.doc)(firebase_1.db, 'items', book.id);
                batch.update(itemDocRef, {
                    primaryColor,
                    updatedAt: (0, firestore_1.serverTimestamp)(), // Use Firestore server timestamp
                });
                return Object.assign(Object.assign({}, book), { primaryColor });
            }
        }
        return book;
    }));
    try {
        await batch.commit(); // Commit all batched updates
    }
    catch (error) {
        console.error('Failed to commit Firestore batch:', error);
    }
    return updatedBooks;
};
const BookGrid = ({ columns, cardWidth, margin }) => (<react_native_1.View style={[styles.row, { gap: margin }]}>
    {columns.map((column, index) => (<react_native_1.View key={index} style={[styles.column, { width: cardWidth }]}>
        {column.map(book => (<BookCard_1.default key={book.id} book={book} cardWidth={cardWidth} margin={margin}/>))}
      </react_native_1.View>))}
  </react_native_1.View>);
function Shelf() {
    const router = (0, router_1.useRouter)();
    const { shelfId } = router.query;
    const [books, setBooks] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [isPlaying, setIsPlaying] = (0, react_1.useState)(false);
    const [scrollPosition, setScrollPosition] = (0, react_1.useState)(0);
    const [isPanelVisible, setIsPanelVisible] = (0, react_1.useState)(false); // Track SidePanel visibility
    const { width, isLoading } = (0, useResponsive_1.useResponsive)();
    const [currentUrl, setCurrentUrl] = (0, react_1.useState)('');
    const [shelfDetails, setShelfDetails] = (0, react_1.useState)({
        displayName: '',
        sourceDisplayName: '',
        userId: '',
    });
    const [_isRefreshing, setIsRefreshing] = (0, react_1.useState)(false);
    const isAutoscrolling = (0, react_1.useRef)(false); // Track if autoscroll is active
    const throttledUpdateScrollPosition = (0, react_1.useRef)((0, lodash_1.throttle)(() => {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const scrollableHeight = scrollHeight - clientHeight;
        const position = (scrollTop / scrollableHeight) * 100;
        setScrollPosition(Math.min(Math.max(position, 0), 100)); // Clamp between 0 and 100
    }, 1000) // Throttle updates to every 200ms
    ).current;
    // Autoscroll logic using requestAnimationFrame
    (0, react_1.useEffect)(() => {
        let animationFrameId;
        const autoScroll = () => {
            if (isPlaying) {
                isAutoscrolling.current = true;
                window.scrollBy(0, 2); // Scroll down by 2px per frame
                // Throttled update of scrollPosition during autoscroll
                throttledUpdateScrollPosition();
                animationFrameId = requestAnimationFrame(autoScroll);
            }
            else {
                isAutoscrolling.current = false;
                cancelAnimationFrame(animationFrameId);
            }
        };
        autoScroll();
        return () => cancelAnimationFrame(animationFrameId); // Cleanup on unmount
    }, [isPlaying, throttledUpdateScrollPosition]);
    // Throttled scroll handler for manual scrolling
    (0, react_1.useEffect)(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
            const handleScroll = (0, lodash_1.throttle)(() => {
                if (isAutoscrolling.current)
                    return; // Skip updates during autoscroll
                const scrollTop = window.scrollY;
                const scrollHeight = document.documentElement.scrollHeight;
                const clientHeight = window.innerHeight;
                const scrollableHeight = scrollHeight - clientHeight;
                const position = (scrollTop / scrollableHeight) * 100;
                setScrollPosition(Math.min(Math.max(position, 0), 100));
            }, 100); // Throttle to run every 100ms
            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
                handleScroll.cancel();
            };
        }
    }, []);
    (0, react_1.useEffect)(() => {
        if (!shelfId)
            return;
        const fetchShelfDetails = async () => {
            try {
                const shelfDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.db, 'shelves', shelfId));
                if (shelfDoc.exists()) {
                    const shelfData = shelfDoc.data();
                    setShelfDetails({
                        displayName: shelfData.displayName || 'Shelf',
                        sourceDisplayName: shelfData.sourceDisplayName || 'Unknown Source',
                        userId: shelfData.userId,
                    });
                }
                else {
                    throw new Error('Shelf not found.');
                }
                const booksWithColors = await fetchBooksWithPrimaryColor(shelfId);
                setBooks(booksWithColors);
            }
            catch (err) {
                if (err.code === 'permission-denied') {
                    setError('You do not have permission to view this shelf.');
                }
                else {
                    setError('Failed to fetch shelf details or books.');
                }
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchShelfDetails();
    }, [shelfId]);
    const _handleRefresh = async () => {
        console.log('Current user:', firebase_1.auth.currentUser); // Debug log
        if (!firebase_1.auth.currentUser) {
            setError('You must be logged in to refresh the shelf.');
            return;
        }
        setIsRefreshing(true);
        try {
            const refreshShelf = (0, functions_1.httpsCallable)(firebase_1.functions, 'refreshShelf');
            await refreshShelf({ shelfId });
            const booksWithColors = await fetchBooksWithPrimaryColor(shelfId);
            setBooks(booksWithColors);
        }
        catch (err) {
            console.error('Failed to refresh shelf:', err);
            setError('Failed to refresh shelf.');
        }
        finally {
            setIsRefreshing(false);
        }
    };
    if (isLoading || loading)
        return <react_native_1.Text>Loading...</react_native_1.Text>;
    if (error)
        return <react_native_1.Text>{error}</react_native_1.Text>;
    if (books.length === 0)
        return <react_native_1.Text>No books available.</react_native_1.Text>;
    const { columns: numColumns, cardWidth, margin, } = (0, layoutUtils_1.getResponsiveValues)(isPanelVisible ? width - 350 : width);
    const columns = splitIntoColumns(books, numColumns);
    const totalWidth = (0, layoutUtils_1.calculateTotalWidth)(numColumns, cardWidth, margin);
    return (<react_native_1.View style={[styles.container, isPanelVisible && styles.containerShift]}>
      <ShelfHeader_1.default title={shelfDetails.displayName} subtitle={shelfDetails.sourceDisplayName} isPlaying={isPlaying} onPlayPausePress={() => setIsPlaying(!isPlaying)} scrollPosition={scrollPosition} onMenuToggle={() => setIsPanelVisible(true)} isPanelVisible={isPanelVisible}/>
      <SidePanel_1.default isVisible={isPanelVisible} onClose={() => setIsPanelVisible(false)} title={shelfDetails.displayName} subtitle={shelfDetails.sourceDisplayName} scrollPosition={scrollPosition} userId={shelfDetails.userId} shelfId={shelfId}/>
      <QRCode_1.default url={currentUrl}/>
      <react_native_1.View style={[
            styles.contentContainer,
            { maxWidth: totalWidth, marginHorizontal: 'auto' },
            isPanelVisible && styles.contentContainerShift,
        ]}>
        <BookGrid columns={columns} cardWidth={cardWidth} margin={margin}/>
      </react_native_1.View>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        marginVertical: 20,
        backgroundColor: '#000000',
        minHeight: '100vh',
        transition: 'all 0.3s ease-in-out', // Smooth transition for all changes
    },
    containerShift: {
        marginLeft: 350, // Space for the side panel
        width: 'calc(100% - 350px)', // Reduce width by panel width
    },
    contentContainer: {
        width: '100%',
        paddingHorizontal: 20,
        transition: 'all 0.3s ease-in-out', // Smooth transition for content
    },
    contentContainerShift: {
        width: 'calc(100% - 350px)', // Adjust width when panel is open
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'nowrap',
    },
    column: {
        flexShrink: 0,
    },
    url: {
        color: '#FFFFFF',
        padding: 20,
        fontSize: 14,
    },
});
//# sourceMappingURL=%5BshelfId%5D.js.map