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
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    const cells = useMemo(() => generateDotCells(timeData, viewType), [timeData, viewType]);

    useEffect(() => {
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.96);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                damping: 16,
                stiffness: 130,
                useNativeDriver: true,
            }),
        ]).start();
    }, [viewType]);

    // Optimized responsive calculations
    const getResponsiveConfig = () => {
        const horizontalPadding = theme.spacing.lg * 2;
        const availableWidth = SCREEN_WIDTH - horizontalPadding;
        const availableHeight = SCREEN_HEIGHT * 0.48; // More vertical space

        switch (viewType) {
            case 'month': {
                const cols = 7;
                const rows = Math.ceil(timeData.totalDays / cols);
                const gapRatio = 0.18;

                const maxByWidth = availableWidth / (cols * (1 + gapRatio));
                const maxByHeight = availableHeight / (rows * (1 + gapRatio));
                const dotSize = Math.min(maxByWidth, maxByHeight, 44);
                const gap = dotSize * gapRatio;

                return { columns: cols, dotSize, gap };
            }
            case 'year': {
                const cols = 20;
                const rows = Math.ceil(timeData.totalDays / cols);
                const gapRatio = 0.25;

                const maxByWidth = availableWidth / (cols * (1 + gapRatio));
                const maxByHeight = availableHeight / (rows * (1 + gapRatio));
                const dotSize = Math.min(maxByWidth, maxByHeight, 11);
                const gap = dotSize * gapRatio;

                return { columns: cols, dotSize: Math.max(dotSize, 5), gap };
            }
            case 'life': {
                const cols = 10;
                const rows = Math.ceil(timeData.totalDays / cols);
                const gapRatio = 0.22;

                const maxByWidth = availableWidth / (cols * (1 + gapRatio));
                const maxByHeight = availableHeight / (rows * (1 + gapRatio));
                const dotSize = Math.min(maxByWidth, maxByHeight, 30);
                const gap = dotSize * gapRatio;

                return { columns: cols, dotSize, gap };
            }
            default:
                return { columns: 7, dotSize: 20, gap: 4 };
        }
    };

    const { columns, dotSize, gap } = getResponsiveConfig();

    const rows: (typeof cells)[] = [];
    for (let i = 0; i < cells.length; i += columns) {
        rows.push(cells.slice(i, i + columns));
    }

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
                {gridContent}
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
        paddingTop: theme.spacing.xl, // More space from top
    },
    grid: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
});

export default DotGrid;
