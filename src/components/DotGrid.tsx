import React, { useMemo, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Animated, Easing } from 'react-native';
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

    const cells = useMemo(() => generateDotCells(timeData, viewType), [timeData, viewType]);

    useEffect(() => {
        // Fade in grid on view change
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [viewType]);

    // Premium responsive calculations
    const getResponsiveConfig = () => {
        const horizontalPadding = theme.spacing.xl * 2;
        const availableWidth = SCREEN_WIDTH - horizontalPadding;
        // Use more screen real estate - 55% of height
        const availableHeight = SCREEN_HEIGHT * 0.55;

        switch (viewType) {
            case 'month': {
                const cols = 7;
                const rows = Math.ceil(timeData.totalDays / cols);
                const gapRatio = 0.18; // Gap as percentage of dot size

                // Calculate optimal dot size
                const maxByWidth = availableWidth / (cols * (1 + gapRatio));
                const maxByHeight = availableHeight / (rows * (1 + gapRatio));
                const dotSize = Math.min(maxByWidth, maxByHeight, 52);
                const gap = dotSize * gapRatio;

                return { columns: cols, dotSize, gap };
            }
            case 'year': {
                const cols = 18;
                const rows = Math.ceil(timeData.totalDays / cols);
                const gapRatio = 0.25;

                const maxByWidth = availableWidth / (cols * (1 + gapRatio));
                const maxByHeight = availableHeight / (rows * (1 + gapRatio));
                const dotSize = Math.min(maxByWidth, maxByHeight, 14);
                const gap = dotSize * gapRatio;

                return { columns: cols, dotSize: Math.max(dotSize, 6), gap };
            }
            case 'life': {
                const cols = 10;
                const rows = Math.ceil(timeData.totalDays / cols);
                const gapRatio = 0.2;

                const maxByWidth = availableWidth / (cols * (1 + gapRatio));
                const maxByHeight = availableHeight / (rows * (1 + gapRatio));
                const dotSize = Math.min(maxByWidth, maxByHeight, 36);
                const gap = dotSize * gapRatio;

                return { columns: cols, dotSize, gap };
            }
            default:
                return { columns: 7, dotSize: 20, gap: 4 };
        }
    };

    const { columns, dotSize, gap } = getResponsiveConfig();

    // Build rows
    const rows: (typeof cells)[] = [];
    for (let i = 0; i < cells.length; i += columns) {
        rows.push(cells.slice(i, i + columns));
    }

    const needsScroll = viewType === 'year' && rows.length > 22;

    const gridContent = (
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
    );

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {needsScroll ? (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    bounces={true}
                >
                    {gridContent}
                </ScrollView>
            ) : (
                <View style={styles.centerWrapper}>
                    {gridContent}
                </View>
            )}
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
    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.md,
        paddingBottom: 140,
    },
    grid: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
});

export default DotGrid;
