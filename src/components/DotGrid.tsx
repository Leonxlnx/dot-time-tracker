import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { theme } from '../theme';
import { TimeData, ViewType, generateDotCells } from '../utils/timeUtils';
import Dot from './Dot';

interface DotGridProps {
    timeData: TimeData;
    viewType: ViewType;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = theme.spacing.xl;
const GRID_WIDTH = SCREEN_WIDTH - GRID_PADDING * 2;

const DotGrid: React.FC<DotGridProps> = ({ timeData, viewType }) => {
    const cells = useMemo(() => generateDotCells(timeData, viewType), [timeData, viewType]);

    const getConfig = () => {
        switch (viewType) {
            case 'month':
                return { columns: 7, dotSize: (GRID_WIDTH / 7) - 8 }; // 7 cols for days of week
            case 'year':
                return { columns: 16, dotSize: (GRID_WIDTH / 16) - 5 }; // Denser grid
            case 'life':
                return { columns: 10, dotSize: (GRID_WIDTH / 10) - 8 }; // Decades
            default:
                return { columns: 7, dotSize: 12 };
        }
    };

    const { columns, dotSize } = getConfig();

    const rows: (typeof cells)[] = [];
    for (let i = 0; i < cells.length; i += columns) {
        rows.push(cells.slice(i, i + columns));
    }

    const isScrollable = viewType === 'year';

    const gridContent = (
        <View style={styles.grid}>
            {rows.map((rowCells, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {rowCells.map((cell) => (
                        <Dot key={cell.index} cell={cell} size={dotSize} />
                    ))}
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            {isScrollable ? (
                <ScrollView
                    showsVerticalScrollIndicator={false} // Vertical scroll for year
                    contentContainerStyle={styles.scrollContent}
                >
                    {gridContent}
                </ScrollView>
            ) : (
                gridContent
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: theme.spacing.xl,
        alignItems: 'center',
        paddingBottom: 120, // Space for the floating selector
    },
    scrollContent: {
        alignItems: 'center',
        paddingBottom: 120,
    },
    grid: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4, // Row spacing
    },
});

export default DotGrid;
