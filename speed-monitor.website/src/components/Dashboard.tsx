import React, { useMemo } from 'react';


interface Point {
  timestamp: string;
  downloadSpeed: number;
}

export interface DashboardProps {
  points: Point[];
}

const Dashboard: React.FC<DashboardProps> = ({ points }: DashboardProps) => {
  const calculations = useMemo(() => {
    const max = Math.max(...points.map((point: Point) => point.downloadSpeed));
    const min = Math.min(...points.map((point: Point) => point.downloadSpeed));
    const avg = points.reduce((acc: number, point: Point) => acc + point.downloadSpeed, 0) / points.length;
    // remove the top 10% and bottom 10% of the data
    const sortedPoints = points.map((point) => point.downloadSpeed).sort();
    const sliceIndex = Math.floor(sortedPoints.length * 0.1);
    const slicedPoints = sortedPoints.slice(sliceIndex, sortedPoints.length - sliceIndex);
    const slicedAverage = slicedPoints.reduce((acc, point) => acc + point, 0) / slicedPoints.length;
    console.log({ points: points.length, sliceIndex, slicedPoints: slicedPoints.length });
    return {
      max,
      min,
      avg,
      slicedAverage,
    };
  }, [points]);

  return (
    <div>
      <div className="number-card-container">
        <h2 className="number-card">Max: {calculations.max}</h2>
        <h2 className="number-card">Min: {calculations.min}</h2>
        <h2 className="number-card">Avg: {calculations.avg}</h2>
        <h2 className="number-card">trimmed by 10%: {calculations.slicedAverage}</h2>
      </div>
    </div>
  )
}

export default Dashboard;

