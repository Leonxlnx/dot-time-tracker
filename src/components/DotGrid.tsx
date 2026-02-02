import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { theme, DotColorPreset } from '../theme';
import { TimeData, ViewType, generateDotCells } from '../utils/timeUtils';
import Dot from './Dot';

interface DotGridProps {
    timeData: TimeData;
    viewType: ViewType;
    colorPreset?: DotColorPreset;
}

const DotGrid: React.FC<DotGridProps> = ({ timeData, viewType, colorPreset = 'default' }) => {
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.97)).current;

    const cells = useMemo(() => generateDotCells(timeData, viewType), [timeData, viewType]);

    useEffect(() => {
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.98);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                damping: 20,
                stiffness: 180,
                useNativeDriver: true,
            }),
        ]).start();
    }, [viewType]);

    // Premium layout: smaller dots, more spacing
    const getResponsiveConfig = () => {
        const horizontalPadding = theme.spacing.xl * 2;
        const availableWidth = SCREEN_WIDTH - horizontalPadding;
        const availableHeight = SCREEN_HEIGHT * 0.42;
        const gapRatio = theme.dots.gapRatio; // 50% gap ratio for premium spacing

        const total = timeData.totalDays;

        let bestConfig = { columns: 7, dotSize: 10, gap: 5 };
        let bestDotSize = 0;

        // Determine column range based on view
        const minCols = viewType === 'year' ? 18 : viewType === 'life' ? 10 : 7;
        const maxCols = viewType === 'year' ? 28 : viewType === 'life' ? 14 : 8;

        for (let cols = minCols; cols <= maxCols; cols++) {
            const rows = Math.ceil(total / cols);

            // Calculate with more generous gap ratio
            const dotByWidth = availableWidth / (cols + (cols - 1) * gapRatio);
            const dotByHeight = availableHeight / (rows + (rows - 1) * gapRatio);
            const dotSize = Math.min(dotByWidth, dotByHeight);

            if (dotSize > bestDotSize) {
                bestDotSize = dotSize;
                bestConfig = {
                    columns: cols,
                    dotSize,
                    gap: dotSize * gapRatio
                };
            }
        }

        // Apply size limits for premium look
        const maxSize = viewType === 'month' ? 28 : viewType === 'life' ? 20 : 8;
        const finalDotSize = Math.min(bestConfig.dotSize, maxSize);

        return {
            columns: bestConfig.columns,
            dotSize: finalDotSize,
            gap: finalDotSize * gapRatio
        };
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
                    transform: [{ scale: scaleAnim }],
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
        paddingHorizontal: theme.spacing.xl,
    },
    grid: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
});

export default DotGrid;
