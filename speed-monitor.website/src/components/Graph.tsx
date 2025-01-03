import React from 'react';

import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory";


export interface GraphProps {
  points: {
    timestamp: string;
    downloadSpeed: number;
  }[];
}


const Graph: React.FC = ({ points }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <VictoryChart
        theme={VictoryTheme.clean}
      >
        <VictoryAxis dependentAxis
          label={'Download Speed (Mbps)'}
          tickFormat={(x: any) => `${x}`}
          style={{
            axisLabel: { padding: 50 },
          }}
        />
        <VictoryAxis crossAxis
          label={'Time'}
          tickFormat={(x: any) => ''}
        />
        <VictoryLine
          interpolation="linear"
          theme={VictoryTheme.clean}
          data={points.map((point: { timestamp: any; downloadSpeed: any; }) => {
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