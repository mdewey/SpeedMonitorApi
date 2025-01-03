import React from 'react';

import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory";



interface Point {
  timestamp: string;
  downloadSpeed: number;
}

export interface GraphProps {
  points: Point[];
}


const Graph: React.FC<GraphProps> = ({ points }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <VictoryChart
        theme={VictoryTheme.clean}
      >
        <VictoryAxis dependentAxis
          label={'Download Speed (Mbps)'}
          tickFormat={(x: number) => `${x}`}
          style={{
            axisLabel: { padding: 50 },
          }}
        />
        <VictoryAxis crossAxis
          label={'Time'}
          tickFormat={() => ''}
        />
        <VictoryLine
          interpolation="linear"
          theme={VictoryTheme.clean}
          data={points.map((point: Point) => {
            return {
              x: point.timestamp,
              y: point.downloadSpeed,
            }
          })} />
      </VictoryChart>
    </div>
  );
};

export default Graph;