import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { theme, DotColorPreset } from '../theme';
import { TimeData, ViewType, generateDotCells } from '../utils/timeUtils';
import { useParallax } from '../hooks/useParallax';
import Dot from './Dot';

interface DotGridProps {
    timeData: TimeData;
    viewType: ViewType;
    colorPreset?: DotColorPreset;
    parallaxEnabled?: boolean;
}

const DotGrid: React.FC<DotGridProps> = ({
    timeData,
    viewType,
    colorPreset = 'gold',
    parallaxEnabled = true
}) => {
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.96)).current;
    const { x: parallaxX, y: parallaxY } = useParallax(parallaxEnabled ? 8 : 0);

    const cells = useMemo(() => generateDotCells(timeData, viewType), [timeData, viewType]);

    useEffect(() => {
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.96);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                damping: 22,
                stiffness: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [viewType]);

    // Fully responsive layout - fills available space properly
    const getResponsiveConfig = () => {
        const horizontalPadding = theme.spacing.lg * 2;
        const availableWidth = SCREEN_WIDTH - horizontalPadding;
        // More vertical space for dots
        const availableHeight = SCREEN_HEIGHT * 0.52;
        const gapRatio = theme.dots.gapRatio;

        const total = timeData.totalDays;

        let bestConfig = { columns: 7, dotSize: 10, gap: 4 };
        let maxGridArea = 0;

        // Different column ranges based on view type
        let minCols: number, maxCols: number;
        if (viewType === 'month') {
            minCols = 6;
            maxCols = 8;
        } else if (viewType === 'year') {
            minCols = 14;
            maxCols = 24;
        } else {
            minCols = 8;
            maxCols = 12;
        }

        for (let cols = minCols; cols <= maxCols; cols++) {
            const rows = Math.ceil(total / cols);

            // Calculate max dot size that fits
            const dotByWidth = availableWidth / (cols * (1 + gapRatio));
            const dotByHeight = availableHeight / (rows * (1 + gapRatio));
            const dotSize = Math.floor(Math.min(dotByWidth, dotByHeight));

            // Calculate total grid area to maximize space usage
            const gap = dotSize * gapRatio;
            const gridWidth = cols * (dotSize + gap);
            const gridHeight = rows * (dotSize + gap);
            const gridArea = gridWidth * gridHeight;

            // Prefer configuration that uses more space
            if (gridArea > maxGridArea && dotSize >= 4) {
                maxGridArea = gridArea;
                bestConfig = { columns: cols, dotSize, gap };
            }
        }

        return bestConfig;
    };

    const { columns, dotSize, gap } = getResponsiveConfig();

    const rows: (typeof cells)[] = [];
    for (let i = 0; i < cells.length; i += columns) {
        rows.push(cells.slice(i, i + columns));
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [
                        { scale: scaleAnim },
                        { translateX: parallaxX },
                        { translateY: parallaxY },
                    ],
                }
            ]}
        >
            <View style={styles.centerWrapper}>
                <View style={styles.grid}>
                    {rows.map((rowCells, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {rowCells.map((cell) => (
                                <Dot
                                    key={cell.index}
                                    cell={cell}
                                    size={dotSize}
                                    gap={gap}
                                    colorPreset={colorPreset}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    centerWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
    grid: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
});

export default DotGrid;
