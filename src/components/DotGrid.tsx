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
    const scaleAnim = useRef(new Animated.Value(0.96)).current;

    const cells = useMemo(() => generateDotCells(timeData, viewType), [timeData, viewType]);

    useEffect(() => {
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.97);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                damping: 18,
                stiffness: 150,
                useNativeDriver: true,
            }),
        ]).start();
    }, [viewType]);

    // Smart layout using available width AND height
    const getResponsiveConfig = () => {
        const horizontalPadding = theme.spacing.lg * 2;
        const availableWidth = SCREEN_WIDTH - horizontalPadding;
        const availableHeight = SCREEN_HEIGHT * 0.45;
        const gapRatio = 0.2;

        const total = timeData.totalDays;

        // Find optimal columns by trying different values
        let bestConfig = { columns: 7, dotSize: 10, gap: 2 };
        let bestDotSize = 0;

        // Test column range based on view type
        const minCols = viewType === 'year' ? 15 : viewType === 'life' ? 8 : 5;
        const maxCols = viewType === 'year' ? 30 : viewType === 'life' ? 15 : 10;

        for (let cols = minCols; cols <= maxCols; cols++) {
            const rows = Math.ceil(total / cols);

            // Calculate dot size for this column count
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
    grid: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
});

export default DotGrid;
